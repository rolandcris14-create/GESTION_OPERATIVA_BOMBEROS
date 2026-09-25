/* Laboratorio de Decisiones · motor común.
   Cada capítulo se registra con TDC.registrar({...}) desde capitulos/cNN.js.
   Tipos de actividad: quiz, caso, numero, clasificar, ordenar, tarjetas, personalizado.
   Cada actividad devuelve una nota de 0 a 1; el capítulo se aprueba con 80 % de promedio. */
(function () {
  'use strict';
  var NOTA_MINIMA = 0.8;
  var CLAVE = 'tdc-lab-v1';
  var capitulos = {};
  var PARTES = {
    I: 'El problema del diagnóstico en la escena',
    II: 'Matemática clínica: razonar con probabilidades',
    III: 'La mente en la emergencia',
    IV: 'Arquitectura del diagnóstico y de la decisión',
    V: 'Mitigación del error y seguridad del paciente',
    VI: 'Aplicación: el estándar de evaluación del paciente prehospitalario'
  };
  var INDICE = [
    [1, 'I', 'El método clínico y el error diagnóstico'], [2, 'I', 'Semiología basada en la evidencia'],
    [3, 'II', 'Probabilidad y pensamiento en frecuencias'], [4, 'II', 'Precisión diagnóstica'],
    [5, 'II', 'Cocientes de verosimilitud, Bayes y POCUS'], [6, 'II', 'Reglas de decisión y escalas'],
    [7, 'III', 'Proceso dual, carga cognitiva y estrés'], [8, 'III', 'Heurísticas y sesgos cognitivos'],
    [9, 'III', 'Emociones y juicio clínico'], [10, 'IV', 'De novato a experto'],
    [11, 'IV', 'Reconocimiento de patrones y decisión naturalista'], [12, 'IV', 'Evaluación estructurada y patologías tiempo-dependientes'],
    [13, 'IV', 'Umbral terapéutico y disposición'], [14, 'V', 'Metacognición y calibración'],
    [15, 'V', 'Mitigación de sesgos y puntos de parada'], [16, 'V', 'Factores humanos y trabajo en equipo'],
    [17, 'V', 'Casos integradores'], [18, 'VI', 'Principios transversales de la atención'],
    [19, 'VI', 'Del despacho al examen físico'], [20, 'VI', 'Del juicio clínico a la transferencia']
  ];

  /* ---------- utilidades ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) anadir(el, arguments[i]);
    return el;
  }
  function anadir(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { anadir(el, x); }); return; }
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  function fmt(x, dec) {
    if (dec == null) dec = 0;
    return Number(x).toFixed(dec).replace('.', ',');
  }
  function num(s) { return parseFloat(String(s).replace(',', '.')); }
  function barajar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var bayes = {
    odds: function (p) { return p / (1 - p); },
    prob: function (o) { return o / (1 + o); },
    post: function (p, lr) { var o = p / (1 - p) * lr; return o / (1 + o); },
    lrPos: function (se, es) { return se / (1 - es); },
    lrNeg: function (se, es) { return (1 - se) / es; }
  };
  /* Barra de probabilidad con marcas (previa, posterior) y umbrales opcionales. */
  function barraProb(marcas, umbrales) {
    var b = h('div', { class: 'prob-barra', role: 'img', 'aria-label': 'Escala de probabilidad de 0 a 100 %' });
    (umbrales || []).forEach(function (u) {
      b.appendChild(h('div', { class: 'umbral', style: 'left:' + (u.p * 100) + '%' }, h('span', null, u.t)));
    });
    (marcas || []).forEach(function (m) {
      b.appendChild(h('div', { class: 'marca ' + (m.clase || ''), style: 'left:calc(' + (Math.max(0, Math.min(1, m.p)) * 100) + '% - 1px)' },
        h('span', null, m.t)));
    });
    return b;
  }

  /* ---------- almacenamiento ---------- */
  var estado = {};
  try { estado = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { estado = {}; }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ } }
  function notaAct(cap, i) { return (estado[cap] || {})[i]; }
  function ponerNota(cap, i, nota) {
    estado[cap] = estado[cap] || {};
    var prev = estado[cap][i];
    if (prev == null || nota > prev) estado[cap][i] = nota;
    guardar();
  }
  function avanceCap(n) {
    var c = capitulos[n]; if (!c) return { hechas: 0, total: 0, prom: 0 };
    var total = c.actividades.length, hechas = 0, suma = 0;
    for (var i = 0; i < total; i++) { var v = notaAct(n, i); if (v != null) { hechas++; suma += v; } }
    return { hechas: hechas, total: total, prom: total ? suma / total : 0 };
  }

  /* ---------- tipos de actividad ---------- */
  var tipos = {};

  tipos.quiz = function (act, el, fin) {
    var preg = act.barajar === false ? act.preguntas : barajar(act.preguntas);
    var i = 0, aciertos = 0;
    function mostrar() {
      el.innerHTML = '';
      if (i >= preg.length) return fin(aciertos / preg.length, aciertos + ' de ' + preg.length + ' respuestas correctas');
      var q = preg[i], respondida = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Pregunta ' + (i + 1) + ' de ' + preg.length));
      el.appendChild(h('div', { class: 'enunciado', html: q.p }));
      var cont = h('div'), fbx = h('div');
      var idx = q.opciones.map(function (_, k) { return k; });
      if (q.barajar !== false) idx = barajar(idx);
      var botones = [];
      idx.forEach(function (k) {
        var b = h('button', { class: 'opcion', html: q.opciones[k], onclick: function () {
          if (respondida) return; respondida = true;
          var ok = k === q.correcta; if (ok) aciertos++;
          botones.forEach(function (x) { x.b.disabled = true; if (x.k === q.correcta) x.b.classList.add('bien'); });
          if (!ok) b.classList.add('mal');
          fbx.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + (q.explicacion || '') }));
          fbx.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; mostrar(); } }, i + 1 < preg.length ? 'Siguiente' : 'Ver resultado')));
        } });
        botones.push({ b: b, k: k }); cont.appendChild(b);
      });
      el.appendChild(cont); el.appendChild(fbx);
    }
    mostrar();
  };

  /* Caso por fases. Cada fase: {titulo, datos (html), monitor {FC:..}, decision}
     decision.tipo: 'opcion' {opciones, correcta, explicacion, parcial:[idx]}
                    'probabilidad' {rango:[min,max], explicacion}  (valores en %)
                    'multiple' {opciones, correctas:[...], explicacion}
                    ninguna: solo lectura.  Además cada fase puede traer 'experto'. */
  tipos.caso = function (act, el, fin) {
    var f = 0, puntos = 0, evaluables = 0;
    function cab() {
      var lt = h('div', { class: 'linea-tiempo' });
      act.fases.forEach(function (_, k) { lt.appendChild(h('i', { class: k < f ? 'hecho' : '' })); });
      return lt;
    }
    function siguiente(extra) {
      return h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { f++; mostrar(); } },
        f + 1 < act.fases.length ? 'Continuar el caso' : 'Cerrar el caso'), extra);
    }
    function mostrar() {
      el.innerHTML = '';
      if (f >= act.fases.length) {
        if (act.cierre) el.appendChild(h('div', { class: 'caja objetivo', html: '<span class="rot">Lección operativa</span>' + act.cierre }));
        return fin(evaluables ? puntos / evaluables : 1, evaluables ? 'Decisiones acertadas: ' + fmt(puntos, puntos % 1 ? 1 : 0) + ' de ' + evaluables : '');
      }
      var fase = act.fases[f];
      el.appendChild(cab());
      if (f === 0 && act.presentacion) el.appendChild(h('div', { class: 'caja escena', html: act.presentacion }));
      el.appendChild(h('h3', { style: 'margin:6px 0' }, fase.titulo || ('Tiempo ' + (f + 1))));
      if (fase.monitor) {
        var m = h('div', { class: 'monitor' });
        for (var k in fase.monitor) m.appendChild(h('span', null, k, h('b', null, fase.monitor[k])));
        el.appendChild(m);
      }
      if (fase.datos) el.appendChild(h('div', { class: 'datos', html: fase.datos }));
      var d = fase.decision, zona = h('div');
      el.appendChild(zona);
      function cerrarFase(nota, texto, clase) {
        puntos += nota; evaluables++;
        zona.appendChild(h('div', { class: 'fb ' + clase, html: texto }));
        if (fase.experto) zona.appendChild(h('div', { class: 'experto', html: fase.experto }));
        zona.appendChild(siguiente());
      }
      if (!d) {
        if (fase.experto) zona.appendChild(h('div', { class: 'experto', html: fase.experto }));
        zona.appendChild(siguiente()); return;
      }
      zona.appendChild(h('div', { class: 'enunciado', html: d.pregunta }));
      if (d.tipo === 'probabilidad') {
        var val = h('b', null, '50 %');
        var r = h('input', { type: 'range', min: 0, max: 100, value: 50, 'aria-label': 'Probabilidad estimada', oninput: function () { val.textContent = r.value + ' %'; } });
        var bt = h('button', { class: 'btn', onclick: function () {
          bt.disabled = true; r.disabled = true;
          var v = +r.value, a = d.rango[0], b = d.rango[1], nota, cls;
          if (v >= a && v <= b) { nota = 1; cls = 'bien'; }
          else if (v >= a - 10 && v <= b + 10) { nota = 0.5; cls = 'info'; }
          else { nota = 0; cls = 'mal'; }
          var pref = nota === 1 ? '<b>Bien calibrado.</b> ' : nota ? '<b>Cerca.</b> ' : '<b>Fuera de rango.</b> ';
          cerrarFase(nota, pref + 'Rango esperado: ' + a + ' a ' + b + ' %. ' + (d.explicacion || ''), cls);
        } }, 'Registrar estimación');
        zona.appendChild(h('div', { class: 'fila' }, h('span', null, 'Mi probabilidad: '), val));
        zona.appendChild(r); zona.appendChild(h('div', { class: 'acciones' }, bt));
      } else if (d.tipo === 'multiple') {
        var marcadas = {};
        var bts = d.opciones.map(function (o, k) {
          return h('button', { class: 'opcion', html: '☐ ' + o, onclick: function () {
            marcadas[k] = !marcadas[k];
            this.classList.toggle('sel', marcadas[k]);
            this.innerHTML = (marcadas[k] ? '☑ ' : '☐ ') + o;
          } });
        });
        bts.forEach(function (b) { zona.appendChild(b); });
        var ok = h('button', { class: 'btn', onclick: function () {
          ok.disabled = true;
          var bien = 0, total = d.opciones.length;
          bts.forEach(function (b, k) {
            b.disabled = true;
            var debe = d.correctas.indexOf(k) >= 0, esta = !!marcadas[k];
            if (debe === esta) bien++;
            if (debe) b.classList.add('bien'); else if (esta) b.classList.add('mal');
          });
          var nota = bien / total;
          cerrarFase(nota, '<b>' + bien + ' de ' + total + ' elecciones correctas.</b> ' + (d.explicacion || ''), nota === 1 ? 'bien' : nota >= 0.6 ? 'info' : 'mal');
        } }, 'Confirmar');
        zona.appendChild(h('div', { class: 'acciones' }, ok));
      } else {
        var lista = d.opciones.map(function (o, k) {
          return h('button', { class: 'opcion', html: o, onclick: function () {
            lista.forEach(function (b) { b.disabled = true; });
            var ok = k === d.correcta, parcial = (d.parcial || []).indexOf(k) >= 0;
            lista[d.correcta].classList.add('bien'); if (!ok) this.classList.add('mal');
            var extra = d.porOpcion && d.porOpcion[k] ? d.porOpcion[k] + ' ' : '';
            cerrarFase(ok ? 1 : parcial ? 0.5 : 0, (ok ? '<b>Decisión acertada.</b> ' : parcial ? '<b>Aceptable, pero no la mejor.</b> ' : '<b>Decisión equivocada.</b> ') + extra + (d.explicacion || ''), ok ? 'bien' : parcial ? 'info' : 'mal');
          } });
        });
        lista.forEach(function (b) { zona.appendChild(b); });
      }
    }
    mostrar();
  };

  /* Problemas numéricos: {problemas:[{enunciado, respuesta, tolerancia, unidad, solucion}]} */
  tipos.numero = function (act, el, fin) {
    var i = 0, bien = 0, P = act.problemas;
    function mostrar() {
      el.innerHTML = '';
      if (i >= P.length) return fin(bien / P.length, bien + ' de ' + P.length + ' cálculos correctos');
      var p = P[i];
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Problema ' + (i + 1) + ' de ' + P.length));
      el.appendChild(h('div', { class: 'enunciado', html: p.enunciado }));
      var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Respuesta', placeholder: 'Respuesta' });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        var v = num(inp.value); if (isNaN(v)) { inp.focus(); return; }
        bt.disabled = true; inp.disabled = true;
        var ok = Math.abs(v - p.respuesta) <= (p.tolerancia != null ? p.tolerancia : Math.abs(p.respuesta) * 0.05);
        if (ok) bien++;
        zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>Revise el cálculo.</b> Respuesta: ' + fmt(p.respuesta, p.decimales || 0) + ' ' + (p.unidad || '') + '. ') + (p.solucion || '') }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; mostrar(); } }, i + 1 < P.length ? 'Siguiente' : 'Ver resultado')));
      } }, 'Comprobar');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !bt.disabled) bt.click(); });
      el.appendChild(h('div', { class: 'fila' }, inp, h('span', null, p.unidad || ''), bt));
      el.appendChild(zona);
    }
    mostrar();
  };

  /* Clasificar: {categorias:[...], items:[{texto, cat (índice), porque}]} */
  tipos.clasificar = function (act, el, fin) {
    var items = barajar(act.items), eleccion = {};
    el.innerHTML = '';
    var filas = items.map(function (it, k) {
      var bots = act.categorias.map(function (c, ci) {
        return h('button', { onclick: function () {
          if (corregido) return;
          eleccion[k] = ci;
          bots.forEach(function (b, bi) { b.classList.toggle('sel', bi === ci); });
        } }, c);
      });
      var fila = h('div', { class: 'item-clas' }, h('div', { class: 'txt', html: it.texto }), h('div', { class: 'bots' }, bots));
      el.appendChild(fila);
      return fila;
    });
    var corregido = false;
    var bt = h('button', { class: 'btn', onclick: function () {
      if (Object.keys(eleccion).length < items.length) { aviso.textContent = 'Clasifique todos los elementos antes de corregir.'; return; }
      corregido = true; bt.disabled = true; aviso.textContent = '';
      var bien = 0;
      items.forEach(function (it, k) {
        var ok = eleccion[k] === it.cat; if (ok) bien++;
        filas[k].classList.add(ok ? 'bien' : 'mal');
        filas[k].appendChild(h('div', { class: 'porque', html: (ok ? '' : '<b>Correcto: ' + act.categorias[it.cat] + '.</b> ') + (it.porque || '') }));
      });
      fin(bien / items.length, bien + ' de ' + items.length + ' bien clasificados', true);
    } }, 'Corregir');
    var aviso = h('span', { class: 'pregunta-n' });
    el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
  };

  /* Ordenar: {pasos:[en orden correcto], explicacion} */
  tipos.ordenar = function (act, el, fin) {
    var orden = barajar(act.pasos.map(function (_, k) { return k; }));
    while (act.pasos.length > 1 && orden.every(function (v, k) { return v === k; })) orden = barajar(orden);
    var corregido = false;
    el.innerHTML = '';
    var ol = h('ol', { class: 'orden' });
    function pintar() {
      ol.innerHTML = '';
      orden.forEach(function (v, k) {
        var li = h('li', null, h('span', { class: 'n' }, k + 1), h('span', { class: 'txt', html: act.pasos[v] }),
          h('button', { 'aria-label': 'Subir', disabled: corregido || k === 0, onclick: function () { var t = orden[k - 1]; orden[k - 1] = orden[k]; orden[k] = t; pintar(); } }, '▲'),
          h('button', { 'aria-label': 'Bajar', disabled: corregido || k === orden.length - 1, onclick: function () { var t = orden[k + 1]; orden[k + 1] = orden[k]; orden[k] = t; pintar(); } }, '▼'));
        if (corregido) li.classList.add(v === k ? 'bien' : 'mal');
        ol.appendChild(li);
      });
    }
    pintar();
    el.appendChild(ol);
    var zona = h('div');
    var bt = h('button', { class: 'btn', onclick: function () {
      corregido = true; bt.disabled = true; pintar();
      var bien = orden.filter(function (v, k) { return v === k; }).length;
      var correcto = h('ol', null, act.pasos.map(function (p) { return h('li', { html: p }); }));
      zona.appendChild(h('div', { class: 'fb ' + (bien === orden.length ? 'bien' : 'info') }, h('b', null, 'Secuencia correcta:'), correcto, h('div', { html: act.explicacion || '' })));
      fin(bien / orden.length, bien + ' de ' + orden.length + ' pasos en su lugar', true);
    } }, 'Comprobar el orden');
    el.appendChild(h('div', { class: 'acciones' }, bt));
    el.appendChild(zona);
  };

  /* Tarjetas de repaso con autoevaluación: {tarjetas:[{frente, reverso}]} */
  tipos.tarjetas = function (act, el, fin) {
    /* "Repasar de nuevo" devuelve la tarjeta al final del mazo; se completa cuando todas se recuerdan. */
    var T = barajar(act.tarjetas), i = 0, sabidas = 0;
    function mostrar() {
      el.innerHTML = '';
      if (i >= T.length) return fin(1, 'Mazo completado: ' + sabidas + ' tarjetas recordadas');
      var vuelta = false, t = T[i];
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Tarjeta ' + (i + 1) + ' de ' + T.length + ' · toque para girar'));
      var cara = h('div', { class: 'cara', html: t.frente });
      var acc = h('div', { class: 'acciones', style: 'visibility:hidden' },
        h('button', { class: 'btn', onclick: function () { sabidas++; i++; mostrar(); } }, 'La sabía'),
        h('button', { class: 'btn sec', onclick: function () { T.push(t); i++; mostrar(); } }, 'Repasar de nuevo'));
      el.appendChild(h('div', { class: 'flash', role: 'button', tabindex: 0, onclick: function () {
        vuelta = !vuelta; cara.innerHTML = vuelta ? t.reverso : t.frente; cara.classList.toggle('rev', vuelta); acc.style.visibility = 'visible';
      } }, cara));
      el.appendChild(acc);
    }
    mostrar();
  };
  /* Personalizado: {render(el, api)} con api.fin(nota, texto), api.h, api.bayes, api.fmt, api.barraProb */
  tipos.personalizado = function (act, el, fin) {
    el.innerHTML = '';
    act.render(el, { fin: fin, h: h, bayes: bayes, fmt: fmt, num: num, barraProb: barraProb, barajar: barajar });
  };

  /* ---------- vistas ---------- */
  var raiz;
  function totalGlobal() {
    var aprob = 0, disp = 0;
    INDICE.forEach(function (x) { if (capitulos[x[0]]) { disp++; var a = avanceCap(x[0]); if (a.hechas === a.total && a.prom >= NOTA_MINIMA) aprob++; } });
    return { aprob: aprob, disp: disp };
  }
  function cabecera() {
    var g = totalGlobal();
    return h('header', { class: 'barra' }, h('div', { class: 'contenedor' },
      h('a', { href: '#' }, h('img', { src: 'isotipo_resuslab.svg', alt: '' })),
      h('a', { href: '#' }, h('div', null, h('div', { class: 't1' }, 'Laboratorio de Decisiones Clínicas'), h('div', { class: 't2' }, 'The ResusLab · práctica por capítulo'))),
      h('div', { class: 'progreso-global' }, g.aprob + ' de ' + INDICE.length + ' capítulos aprobados')));
  }
  function vistaMapa() {
    raiz.innerHTML = '';
    raiz.appendChild(cabecera());
    var c = h('main', { class: 'contenedor' });
    c.appendChild(h('section', { class: 'intro' },
      h('h1', null, 'Practique cada capítulo en la escena'),
      h('p', null, 'Cada capítulo del manual tiene su propio laboratorio: casos que avanzan en el tiempo, calculadoras, clasificaciones y preguntas con resolución. Decida como lo haría en la ambulancia y reciba la retroalimentación del razonamiento experto.'),
      h('p', null, 'Un capítulo se aprueba al completar todas sus actividades con un promedio de 80 % o más. Puede repetirlas: se guarda su mejor nota en este navegador.')));
    var parteActual = null, rej = null;
    INDICE.forEach(function (x) {
      var n = x[0];
      if (x[1] !== parteActual) {
        parteActual = x[1];
        c.appendChild(h('div', { class: 'parte' }, 'Parte ' + x[1] + ' · ' + PARTES[x[1]]));
        rej = h('div', { class: 'rejilla' }); c.appendChild(rej);
      }
      var cap = capitulos[n], a = avanceCap(n);
      var ok = cap && a.hechas === a.total && a.prom >= NOTA_MINIMA;
      rej.appendChild(h(cap ? 'a' : 'div', { class: 'tarjeta-cap' + (cap ? '' : ' pendiente'), href: cap ? '#c' + n : null },
        h('span', { class: 'num' }, 'CAPÍTULO ' + n + (ok ? ' · APROBADO' : '')),
        h('span', { class: 'tit' }, x[2]),
        h('span', { class: 'mision' }, cap ? cap.mision : 'En preparación'),
        cap ? h('span', { class: 'pregunta-n' }, a.hechas + '/' + a.total + ' actividades · ' + Math.round(a.prom * 100) + ' %') : null,
        h('div', { class: 'barrita' + (ok ? ' ok' : '') }, h('i', { style: 'width:' + Math.round(a.prom * 100) + '%' }))));
    });
    c.appendChild(h('div', { class: 'pie' }, 'Basado en el manual «Toma de Decisiones Clínicas y Método Clínico en Emergencias Prehospitalarias» (Coronel Seminario CR, The ResusLab, 2026). Herramienta formativa: no sustituye protocolos locales ni el juicio clínico.'));
    raiz.appendChild(c);
    window.scrollTo(0, 0);
  }
  function vistaCapitulo(n, idx) {
    var cap = capitulos[n]; if (!cap) return vistaMapa();
    idx = idx || 0;
    raiz.innerHTML = '';
    raiz.appendChild(cabecera());
    var c = h('main', { class: 'contenedor' });
    c.appendChild(h('div', { class: 'cap-cab' },
      h('button', { class: 'volver', onclick: function () { location.hash = ''; } }, '← Todos los capítulos'),
      h('div', { class: 'parte', style: 'margin:10px 0 0' }, 'Capítulo ' + n + ' · Parte ' + cap.parte),
      h('h1', null, cap.titulo)));
    c.appendChild(h('div', { class: 'caja objetivo', html: '<span class="rot">Objetivo de aprendizaje</span>' + cap.objetivo }));
    if (cap.escena) c.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Su misión</span>' + cap.escena }));
    var pest = h('div', { class: 'pestanas', role: 'tablist' });
    cap.actividades.forEach(function (a, k) {
      var nota = notaAct(n, k);
      pest.appendChild(h('button', { role: 'tab', class: k === idx ? 'activa' : '', 'aria-selected': k === idx ? 'true' : 'false', onclick: function () { location.hash = 'c' + n + '/' + k; } },
        (k + 1) + '. ' + a.titulo, nota != null ? h('span', { class: 'chk' }, ' ' + Math.round(nota * 100) + '%') : null));
    });
    c.appendChild(pest);
    var act = cap.actividades[idx];
    var caja = h('section', { class: 'actividad' });
    caja.appendChild(h('div', { class: 'tipo' }, ({ quiz: 'Preguntas', caso: 'Caso en la escena', numero: 'Cálculo', clasificar: 'Clasificación', ordenar: 'Secuencia', tarjetas: 'Tarjetas de repaso', personalizado: 'Simulador' })[act.tipo] || ''));
    caja.appendChild(h('h2', null, act.titulo));
    if (act.instrucciones) caja.appendChild(h('div', { class: 'instr', html: act.instrucciones }));
    var cuerpo = h('div'); caja.appendChild(cuerpo);
    var res = h('div'); caja.appendChild(res);
    function fin(nota, texto, conservar) {
      ponerNota(n, idx, nota);
      if (!conservar) cuerpo.innerHTML = '';
      var ok = nota >= NOTA_MINIMA;
      res.innerHTML = '';
      res.appendChild(h('div', { class: 'resultado' + (ok ? ' ok' : '') },
        h('div', { class: 'nota' }, Math.round(nota * 100) + ' %'),
        h('div', null, texto || ''),
        h('div', { class: 'pregunta-n' }, ok ? 'Actividad superada.' : 'Se necesita 80 % para superarla. Repítala: la retroalimentación es parte del aprendizaje.'),
        h('div', { class: 'acciones', style: 'justify-content:center' },
          h('button', { class: 'btn sec', onclick: function () { vistaCapitulo(n, idx); } }, 'Repetir'),
          idx + 1 < cap.actividades.length
            ? h('button', { class: 'btn', onclick: function () { location.hash = 'c' + n + '/' + (idx + 1); } }, 'Siguiente actividad')
            : h('button', { class: 'btn', onclick: function () { location.hash = ''; } }, 'Volver al mapa'))));
      pest.querySelectorAll('button')[idx].querySelector('.chk') || pest.querySelectorAll('button')[idx].appendChild(h('span', { class: 'chk' }, ' ' + Math.round((notaAct(n, idx)) * 100) + '%'));
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    tipos[act.tipo](act, cuerpo, fin);
    c.appendChild(caja);
    raiz.appendChild(c);
    window.scrollTo(0, 0);
  }
  function ruta() {
    var m = /^#c(\d+)(?:\/(\d+))?$/.exec(location.hash);
    if (m) vistaCapitulo(+m[1], m[2] ? +m[2] : 0); else vistaMapa();
  }

  window.TDC = {
    registrar: function (cap) { capitulos[cap.numero] = cap; },
    iniciar: function (el) { raiz = el; window.addEventListener('hashchange', ruta); ruta(); },
    util: { h: h, bayes: bayes, fmt: fmt, num: num, barraProb: barraProb, barajar: barajar }
  };
})();
