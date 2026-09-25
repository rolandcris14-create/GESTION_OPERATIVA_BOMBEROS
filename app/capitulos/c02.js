/* Capítulo 2. Semiología basada en la evidencia: el hallazgo clínico como prueba diagnóstica y su fiabilidad */
(function () {

  function grado(k) {
    if (k < 0) return 'Pobre';
    if (k <= 0.20) return 'Leve';
    if (k <= 0.40) return 'Aceptable';
    if (k <= 0.60) return 'Moderada';
    if (k <= 0.80) return 'Considerable';
    return 'Casi perfecta';
  }

  /* Laboratorio de concordancia: tabla de coincidencias de dos observadores con retos verificables. */
  function laboratorioKappa(el, api) {
    var h = api.h, F = api.fmt;
    var v = { a: 10, b: 10, c: 10, d: 10 }, editado = false, terminado = false;
    function esEjemplo() { return (v.a === 20 && v.b === 10 && v.c === 10 && v.d === 60) || (v.a === 0 && v.b === 1 && v.c === 1 && v.d === 98); }
    var RETOS = [
      { t: 'Concordancia moderada: κ entre 0,41 y 0,60, con al menos 20 pacientes.', ok: function (r) { return r.n >= 20 && r.k >= 0.41 && r.k <= 0.60; } },
      { t: 'Paradoja de la prevalencia: acuerdo observado de 90 % o más, pero κ menor de 0,20.', ok: function (r) { return r.n >= 20 && r.po >= 0.9 && r.k < 0.2; } },
      { t: 'Mismo acuerdo, otro kappa: acuerdo observado de exactamente 80 % con κ de 0,55 o más.', ok: function (r) { return r.n >= 20 && Math.abs(r.po - 0.8) < 0.0001 && r.k >= 0.55; } }
    ];
    var hechos = [false, false, false];
    var inputs = {};
    function celda(clave, rotulo) {
      var inp = h('input', { type: 'text', inputmode: 'numeric', value: v[clave], 'aria-label': rotulo, style: 'width:50px;padding:6px 4px;text-align:center', oninput: function () {
        var x = parseInt(inp.value, 10); v[clave] = isNaN(x) || x < 0 ? 0 : Math.min(x, 999); editado = true; calc();
      } });
      inputs[clave] = inp;
      function paso(d) { return h('button', { class: 'btn sec', style: 'padding:0;width:28px;height:32px;min-width:0', 'aria-label': (d > 0 ? 'Sumar' : 'Restar') + ' en ' + rotulo, onclick: function () {
        v[clave] = Math.max(0, v[clave] + d); inp.value = v[clave]; editado = true; calc();
      } }, d > 0 ? '+' : '−'); }
      return h('td', { style: 'text-align:center;padding:6px 2px' }, h('div', { style: 'display:flex;gap:3px;justify-content:center;align-items:center' }, paso(-1), inp, paso(1)));
    }
    var tabla = h('table', { class: 't', style: 'font-size:13px' },
      h('tr', null, h('th', null, ''), h('th', { style: 'text-align:center' }, 'B: sí'), h('th', { style: 'text-align:center' }, 'B: no')),
      h('tr', null, h('th', { style: 'padding:6px 2px' }, 'A: sí'), celda('a', 'ambos sí'), celda('b', 'solo A')),
      h('tr', null, h('th', { style: 'padding:6px 2px' }, 'A: no'), celda('c', 'solo B'), celda('d', 'ambos no')));
    el.appendChild(h('div', { class: 'fila' },
      h('span', { class: 'pregunta-n' }, 'Cargar ejemplo:'),
      h('button', { class: 'btn sec', onclick: function () { cargar(20, 10, 10, 60); } }, 'Crepitantes'),
      h('button', { class: 'btn sec', onclick: function () { cargar(0, 1, 1, 98); } }, 'Desviación traqueal')));
    el.appendChild(h('div', { class: 'tabla-scroll' }, tabla));
    var salida = h('div'); el.appendChild(salida);
    var listaRetos = h('div'); el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Retos: modifique la tabla hasta cumplir cada uno'));
    el.appendChild(listaRetos);
    var acc = h('div', { class: 'acciones' }); el.appendChild(acc);
    function cargar(a, b, c, d) { v = { a: a, b: b, c: c, d: d }; ['a', 'b', 'c', 'd'].forEach(function (x) { inputs[x].value = v[x]; }); editado = false; calc(); }
    function calc() {
      var n = v.a + v.b + v.c + v.d, r = { n: n, po: 0, pe: 0, k: 0 };
      salida.innerHTML = '';
      if (!n) { salida.appendChild(h('div', { class: 'pregunta-n' }, 'Introduzca al menos un paciente.')); pintarRetos(null); return; }
      var pA = (v.a + v.b) / n, pB = (v.a + v.c) / n;
      r.po = (v.a + v.d) / n; r.pe = pA * pB + (1 - pA) * (1 - pB);
      r.k = r.pe >= 1 ? 0 : (r.po - r.pe) / (1 - r.pe);
      salida.appendChild(h('div', null,
        h('span', { class: 'cifra' }, h('small', null, 'Pacientes'), String(n)),
        h('span', { class: 'cifra' }, h('small', null, 'Po: acuerdo observado'), F(r.po * 100, 1) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'Pe: acuerdo por azar'), F(r.pe * 100, 1) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'κ = (Po − Pe)/(1 − Pe)'), F(r.k, 2) + ' · ' + grado(r.k))));
      salida.appendChild(h('div', { class: 'pregunta-n' }, 'A marca «sí» en ' + F(pA * 100) + ' % y B en ' + F(pB * 100) + ' %. Pe = ' + F(pA, 2) + ' × ' + F(pB, 2) + ' + ' + F(1 - pA, 2) + ' × ' + F(1 - pB, 2) + '.'));
      var msj = r.k < 0.4 ? 'Con κ menor de 0,4 el hallazgo no decide solo: confirme con un segundo observador, otra técnica o la tendencia.' : 'Con κ de 0,4 o más, el hallazgo puede usarse como argumento, siempre que además sea válido para la pregunta.';
      salida.appendChild(h('div', { class: 'fb ' + (r.k < 0.4 ? 'mal' : 'info') }, msj));
      pintarRetos(r);
    }
    function pintarRetos(r) {
      listaRetos.innerHTML = '';
      RETOS.forEach(function (re, i) {
        if (r && editado && !esEjemplo() && !hechos[i] && re.ok(r)) hechos[i] = true;
        listaRetos.appendChild(h('div', { class: 'item-clas' + (hechos[i] ? ' bien' : '') }, h('div', { class: 'txt' }, (hechos[i] ? '☑ ' : '☐ ') + re.t)));
      });
      var n = hechos.filter(Boolean).length;
      acc.innerHTML = '';
      if (n === 3 && !terminado) { terminado = true; api.fin(1, 'Tres retos cumplidos: domina el acuerdo por azar y la paradoja de la prevalencia.', true); return; }
      if (!terminado) acc.appendChild(h('button', { class: 'btn sec', disabled: n === 0, onclick: function () { terminado = true; acc.innerHTML = ''; api.fin(n / 3, n + ' de 3 retos cumplidos', true); } }, 'Terminar con ' + n + ' de 3'));
    }
    calc();
  }

  /* Contar la frecuencia respiratoria: un tórax animado a una frecuencia oculta. */
  function contarFR(el, api) {
    var h = api.h, F = api.fmt;
    var FRS = api.barajar([14, 16, 20, 22, 24, 26, 28, 30]);
    var ronda = 0, bien = 0, errEst = null, errCont = [], timer = null;
    var RONDAS = [{ modo: 'estimar', seg: 6 }, { modo: 'contar', seg: 30 }, { modo: 'contar', seg: 30 }, { modo: 'contar', seg: 30 }];
    function detener() { if (timer) { clearInterval(timer); timer = null; } }
    function nueva() {
      detener();
      el.innerHTML = '';
      if (ronda >= RONDAS.length) {
        var medio = errCont.length ? errCont.reduce(function (s, x) { return s + x; }, 0) / errCont.length : 0;
        el.appendChild(h('div', { class: 'fb info', html: '<b>Comparación.</b> Error al estimar a simple vista: ' + F(errEst) + ' rpm. Error medio al contar 30 segundos: ' + F(medio, 1) + ' rpm. La FR es de los signos que mejor anticipan el deterioro y de los peor registrados: se cuenta, no se estima.' }));
        return api.fin(bien / 3, bien + ' de 3 conteos con un error de 2 rpm o menos', true);
      }
      var R = RONDAS[ronda], fr = FRS[ronda];
      var periodo = 60 / fr, fase = 0, t = 0, taps = 0, corriendo = false, visto = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Ronda ' + (ronda + 1) + ' de ' + RONDAS.length + (R.modo === 'estimar' ? ' · estimación a simple vista (no puntúa)' : ' · conteo de 30 segundos')));
      el.appendChild(h('div', { class: 'enunciado' }, R.modo === 'estimar'
        ? 'Mire al paciente 6 segundos, como quien lo ve de pasada, y estime su frecuencia respiratoria.'
        : 'Cuente las respiraciones durante 30 segundos y multiplique por 2. Puede tocar el botón en cada inspiración para no perder la cuenta.'));
      var torax = h('div', { style: 'width:130px;height:90px;margin:0 auto;border-radius:50% 50% 42% 42%;background:var(--rojo-tinte);border:3px solid var(--rojo);transition:none' });
      var escena = h('div', { style: 'height:140px;display:flex;align-items:center;justify-content:center;background:var(--fondo);border-radius:10px;margin:8px 0;position:relative' }, torax);
      var reloj = h('div', { style: 'position:absolute;top:8px;right:12px;font-weight:700', 'aria-live': 'polite' }, '');
      escena.appendChild(reloj);
      escena.appendChild(h('div', { class: 'pregunta-n', style: 'position:absolute;bottom:6px;left:12px' }, 'Tórax del paciente'));
      var tapeo = h('button', { class: 'btn sec', disabled: true, onclick: function () { taps++; tapeo.textContent = 'Inspiración (' + taps + ')'; } }, 'Inspiración (0)');
      var inp = h('input', { type: 'text', inputmode: 'numeric', placeholder: 'rpm', 'aria-label': 'Frecuencia respiratoria en rpm', disabled: true, style: 'width:90px' });
      var zona = h('div');
      var comprobar = h('button', { class: 'btn', disabled: true, onclick: function () {
        var x = api.num(inp.value); if (isNaN(x)) { inp.focus(); return; }
        comprobar.disabled = true; inp.disabled = true;
        var err = Math.abs(x - fr);
        if (R.modo === 'estimar') {
          errEst = err;
          zona.appendChild(h('div', { class: 'fb info', html: '<b>FR real: ' + fr + ' rpm.</b> Usted estimó ' + F(x) + ' (error de ' + F(err) + '). Los registros hechos a ojo se agrupan de forma sospechosa en 18 y 20 rpm, como en el caso del anciano que nadie contó.' }));
        } else {
          errCont.push(err); var ok = err <= 2; if (ok) bien++;
          zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: '<b>' + (ok ? 'Buen conteo.' : 'Revise el conteo.') + '</b> FR real: ' + fr + ' rpm; usted registró ' + F(x) + '.' +
            (fr >= 25 ? ' En NEWS2, 25 o más suma 3 puntos.' : fr >= 21 ? ' En NEWS2, 21 a 24 suma 2 puntos.' : ' Dentro de 12 a 20: 0 puntos en NEWS2.') }));
        }
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ronda++; nueva(); } }, ronda + 1 < RONDAS.length ? 'Siguiente paciente' : 'Ver resultado')));
      } }, 'Registrar');
      var iniciar = h('button', { class: 'btn', onclick: function () {
        if (visto) return; visto = true; iniciar.disabled = true; corriendo = true; tapeo.disabled = R.modo !== 'contar';
        var inicio = Date.now(), previo = inicio, jitter = 1;
        timer = setInterval(function () {
          if (!document.body.contains(el) || !torax.isConnected) { detener(); return; }
          var ahora = Date.now(), trans = (ahora - inicio) / 1000;
          var dt = (ahora - previo) / 1000; previo = ahora; fase += dt / (periodo * jitter);
          while (fase >= 1) { fase -= 1; jitter = 0.92 + Math.random() * 0.16; }
          var esc = fase < 0.4 ? 1 + 0.16 * Math.sin(fase / 0.4 * Math.PI / 2) : 1 + 0.16 * Math.cos((fase - 0.4) / 0.6 * Math.PI / 2);
          torax.style.transform = 'scale(' + esc.toFixed(3) + ',' + (1 + (esc - 1) * 0.6).toFixed(3) + ')';
          var resta = Math.max(0, R.seg - trans);
          reloj.textContent = F(Math.ceil(resta)) + ' s';
          if (resta <= 0) {
            detener(); corriendo = false; torax.style.transform = 'none'; torax.style.opacity = '0.25';
            reloj.textContent = 'Tiempo';
            tapeo.disabled = true; inp.disabled = false; comprobar.disabled = false;
            if (R.modo === 'contar' && taps) inp.value = taps * 2;
            inp.focus();
          }
        }, 50);
      } }, R.modo === 'estimar' ? 'Mirar 6 segundos' : 'Empezar el conteo');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !comprobar.disabled) comprobar.click(); });
      el.appendChild(escena);
      el.appendChild(h('div', { class: 'acciones' }, iniciar, tapeo));
      el.appendChild(h('div', { class: 'fila', style: 'margin-top:8px' }, h('span', null, 'FR registrada:'), inp, h('span', null, 'rpm'), comprobar));
      el.appendChild(zona);
    }
    nueva();
  }

  TDC.registrar({
    numero: 2, parte: 'I',
    titulo: 'Semiología basada en la evidencia: el hallazgo clínico como prueba diagnóstica y su fiabilidad',
    mision: 'Mida con técnica fiable, calcule kappa y decida cuánto pesa cada hallazgo antes de usarlo.',
    objetivo: 'Juzgar la fiabilidad y la validez de un hallazgo antes de usarlo como argumento diagnóstico, e interpretar el estadístico kappa.',
    escena: 'En la ambulancia, la exploración y unos pocos dispositivos son todo su laboratorio. Antes de apoyar una decisión en un signo, usted debe responder dos preguntas: <b>¿otro observador obtendría lo mismo?</b> y <b>¿ese hallazgo responde la pregunta que me importa?</b>',
    actividades: [
      {
        tipo: 'caso', titulo: 'La frecuencia respiratoria que nadie contó',
        presentacion: '<b>Despacho, 15:10:</b> «varón de 78 años, caída en domicilio sin lesiones, la familia pide valoración».',
        fases: [
          {
            titulo: 'Primera impresión',
            datos: 'Está sentado en un sillón, conversa y «se ve bien». Tiene antecedente de demencia leve. No se aprecian lesiones.',
            decision: { tipo: 'opcion', pregunta: '¿Qué pregunta debe guiar su evaluación?',
              opciones: ['¿Qué lesiones le produjo la caída?', '¿Por qué se cayó hoy?', '¿Hace falta realmente trasladarlo?'],
              correcta: 1, parcial: [0],
              porOpcion: { 0: 'Buscar lesiones es necesario, pero no explica la caída.' },
              explicacion: 'En el anciano, la caída es a menudo el síntoma centinela de una enfermedad aguda: infección, arritmia, deshidratación, hemorragia o fármacos.' },
            experto: '“El despacho dice caída sin lesiones; la pregunta es por qué se cayó hoy.”'
          },
          {
            titulo: 'La frase de la hija',
            datos: 'La hija comenta que su padre «está raro desde ayer» y que no quiso almorzar.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo registra ese dato?',
              opciones: ['Como parte de la demencia que ya tiene', 'Como dato poco fiable: lo refiere un familiar', 'Como posible confusión nueva: pregunto por su estado basal'],
              correcta: 2,
              explicacion: '«¿Está como siempre?» convierte una confusión inespecífica en una confusión nueva, que es un signo de alarma. Atribuirla a la demencia es ensombrecimiento diagnóstico.' },
            experto: '“La hija dice que está raro desde ayer: eso es confusión nueva, no demencia.”'
          },
          {
            titulo: 'Signos vitales',
            monitor: { FR: '18 (estimada)', SpO2: '94 % aire', FC: '98 lpm', PA: '118/70', 'T.ª': '37,6 °C' },
            datos: 'Su compañero anotó la FR «en unos segundos», mientras hablaba con la familia.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace con la frecuencia respiratoria?',
              opciones: ['La acepto: 18 es normal y el paciente conversa', 'La cuento 10 segundos y multiplico por 6', 'La cuento sin anunciarlo: 30 segundos dos veces, o 60'],
              correcta: 2,
              porOpcion: { 1: 'Contar 10 segundos y multiplicar por 6 es una fuente conocida de error técnico.' },
              explicacion: 'Si un signo va a cambiar la decisión, se mide con la técnica fiable aunque cueste un minuto más. Contar mientras se conversa es falta de atención.' },
            experto: '“La FR la cuento, no la estimo: 28.”'
          },
          {
            titulo: 'El dato real',
            monitor: { FR: '28 (contada)', SpO2: '94 % aire', FC: '98 lpm', PA: '118/70', 'T.ª': '37,6 °C', Conciencia: 'confusión nueva' },
            decision: { tipo: 'opcion', pregunta: '¿Cuánto suma ahora NEWS2?',
              opciones: ['2 puntos: riesgo bajo', '5 puntos: riesgo medio', '8 puntos: riesgo alto'],
              correcta: 2, parcial: [1],
              explicacion: 'FR 28: 3 · SpO2 94 %: 1 · FC 98: 1 · confusión nueva: 3 · PA y temperatura: 0. Total 8. Con los datos registrados sumaba 2.' }
          },
          {
            titulo: 'Integración',
            decision: { tipo: 'multiple', pregunta: 'Marque las conclusiones correctas.',
              opciones: ['qSOFA es positivo: FR de 22 o más y alteración mental', 'NEWS2 de 8 exige preaviso y prioridad alta', 'La temperatura de 37,6 °C descarta sepsis', 'El NEWS2 de 2 con datos estimados era igual de válido'],
              correctas: [0, 1],
              explicacion: 'Una escala de alerta precoz solo es tan buena como los datos que la alimentan.' },
            experto: '“NEWS2 de 8 y qSOFA de 2 en un anciano febril: sepsis probable.”'
          },
          {
            titulo: 'Transferencia',
            decision: { tipo: 'opcion', pregunta: '¿Qué transmite al equipo receptor?',
              opciones: ['«Caída mecánica, estable»', '«Delirium, FR 28 contada y febrícula tras una caída; NEWS2 8 y qSOFA 2; sospecha de sepsis respiratoria»', '«Anciano con demencia que se cayó; signos vitales normales»'],
              correcta: 1,
              explicacion: 'Se transmiten valores brutos, no etiquetas. En el caso real, la transferencia «caída mecánica» trasladó el error al hospital.' }
          }
        ],
        cierre: 'En el caso real, en triaje la FR contada fue de 28 y se confirmó un delirium: neumonía del lóbulo inferior derecho con lactato de 4,1 mmol/L, e hipotensión en la sala de espera. Dos ítems mal medidos, la FR y la conciencia, movieron el NEWS2 de 2 a 8 puntos.'
      },
      {
        tipo: 'personalizado', titulo: 'Cuente la frecuencia respiratoria', render: contarFR,
        instrucciones: 'Primero estime a simple vista; después cuente de verdad a tres pacientes. Se acepta un error de hasta 2 rpm. Compare al final cuánto se equivoca cada método.'
      },
      {
        tipo: 'personalizado', titulo: 'Laboratorio de concordancia (kappa)', render: laboratorioKappa,
        instrucciones: 'Dos paramédicos evalúan el mismo hallazgo en los mismos pacientes sin conocer el resultado del otro. Modifique la tabla de coincidencias y observe cómo cambian el acuerdo observado, el acuerdo por azar y kappa. Cumpla los tres retos.'
      },
      {
        tipo: 'numero', titulo: 'Kappa, NEWS2 y peso del hallazgo',
        instrucciones: 'Calcule. Escriba solo el número; use coma o punto decimal.',
        problemas: [
          { enunciado: 'Dos paramédicos evalúan crepitantes en 100 pacientes: ambos los detectan en 20, ninguno en 60, solo A en 10 y solo B en 10. ¿Cuál es el acuerdo esperado por azar (Pe, en decimales)?', respuesta: 0.58, tolerancia: 0.01, decimales: 2, solucion: 'Cada uno marca «sí» en 30 %: Pe = 0,30 × 0,30 + 0,70 × 0,70 = 0,58.' },
          { enunciado: 'Con esos datos, ¿cuánto vale kappa?', respuesta: 0.52, tolerancia: 0.02, decimales: 2, solucion: 'κ = (0,80 − 0,58)/(1 − 0,58) = 0,52: concordancia moderada. Puede apoyar una hipótesis, no decidir sola.' },
          { enunciado: 'Desviación traqueal en 100 pacientes de trauma: cada observador la marca presente en 1 %. ¿Cuál es Pe (dos decimales)?', respuesta: 0.98, tolerancia: 0.01, decimales: 2, solucion: 'Pe = 0,01 × 0,01 + 0,99 × 0,99 = 0,98. Todo el acuerdo observado (98 %) era esperable por azar: κ ≈ 0.' },
          { enunciado: 'En el anciano de la caída, recalcule NEWS2 si se hubiera contado la FR (28) pero la conciencia se siguiera registrando como «alerta».', respuesta: 5, tolerancia: 0, unidad: 'puntos', solucion: 'FR 3 + SpO2 1 + FC 1 = 5: riesgo medio, umbral de respuesta urgente.' },
          { enunciado: '¿Y si la FR hubiera sido 22, con la confusión nueva reconocida?', respuesta: 7, tolerancia: 0, unidad: 'puntos', solucion: 'FR 2 + SpO2 1 + FC 1 + conciencia 3 = 7: riesgo alto. Cada ítem mal medido desplaza al paciente de categoría.' },
          { enunciado: 'Disneico con probabilidad previa de insuficiencia cardíaca de 40 %. Ausculta un tercer ruido (LR+ 11). ¿Probabilidad posterior?', respuesta: 88, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,67 × 11 = 7,3; 7,3/8,3 = 88 %.' },
          { enunciado: 'El mismo paciente, pero <b>no</b> se ausculta tercer ruido (LR− 0,88). ¿Probabilidad posterior?', respuesta: 37, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,67 × 0,88 = 0,59; 0,59/1,59 = 37 %. Confirma con fuerza, pero casi no descarta.' },
          { enunciado: 'Varón de 68 años con tos y fiebre, probabilidad previa de neumonía de 20 %. Presenta egofonía (LR 4,1). ¿Probabilidad posterior?', respuesta: 51, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,25 × 4,1 = 1,03; 1,03/2,03 = 51 %.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Para qué sirve este hallazgo?',
        instrucciones: 'Sin ver el LR, decida si el hallazgo desplaza la probabilidad de forma útil. Un LR de 3 o más, o de 0,3 o menos, la mueve de forma clínicamente útil.',
        categorias: ['Confirma con peso', 'Descarta con peso', 'Mueve poco'],
        items: [
          { texto: 'Tercer ruido presente, para insuficiencia cardíaca en disnea aguda', cat: 0, porque: 'LR 11: refleja un mecanismo específico, el aumento de las presiones de llenado.' },
          { texto: 'Déficit de pulso, para disección aórtica aguda', cat: 0, porque: 'LR 5,7.' },
          { texto: 'Irradiación del dolor a ambos brazos, para síndrome coronario agudo', cat: 0, porque: 'LR 4,1.' },
          { texto: 'Dolor pleurítico, para síndrome coronario agudo', cat: 1, porque: 'LR 0,2: reduce la probabilidad, pero no la lleva a cero.' },
          { texto: 'Dolor reproducible a la palpación, para síndrome coronario agudo', cat: 1, porque: 'LR 0,3.' },
          { texto: 'Solo 0 o 1 de los hallazgos de Heckerling, para neumonía', cat: 1, porque: 'LR 0,3: su ausencia pesa aunque cada hallazgo aislado aporte poco.' },
          { texto: 'Diaforesis, para síndrome coronario agudo', cat: 2, porque: 'LR 2,0: aparece en muchas enfermedades.' },
          { texto: 'Crepitantes, para neumonía', cat: 2, porque: 'LR 2,8: empuja poco.' },
          { texto: 'Sibilancias, para neumonía', cat: 2, porque: 'LR 0,8: prácticamente neutro.' },
          { texto: 'Ausencia de tercer ruido, para insuficiencia cardíaca', cat: 2, porque: 'LR− 0,88: su ausencia no debe tranquilizar.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Puede decidir con este signo?',
        instrucciones: 'Según su concordancia publicada y la forma en que se obtiene, decida el uso que admite en la escena.',
        categorias: ['Puede decidir', 'Confirmar antes', 'No usar para decidir'],
        items: [
          { texto: 'Taquicardia medida con el monitor', cat: 0, porque: 'κ 0,85: fiable si se mide con monitor o se cuenta 30 s o más.' },
          { texto: 'Pulso periférico presente o ausente', cat: 0, porque: 'κ 0,52 a 0,92: útil en esa forma binaria.' },
          { texto: 'Alteración de la conciencia, presente o ausente', cat: 0, porque: 'κ 0,65 a 0,88; se transmite desglosada.' },
          { texto: 'Crepitantes', cat: 1, porque: 'κ 0,21 a 0,65: variable, confirmar con otros datos.' },
          { texto: 'Ingurgitación yugular', cat: 1, porque: 'κ 0,08 a 0,71: muy dependiente de la técnica y la posición.' },
          { texto: 'Relleno capilar prolongado, umbral de 3 s', cat: 1, porque: 'κ 0,29: solo como dato de apoyo mientras se estandariza la técnica.' },
          { texto: '«Pulso débil» frente a pulso normal', cat: 2, porque: 'κ 0,01 a 0,15: descriptor casi inútil.' },
          { texto: 'Temperatura estimada con el dorso de la mano', cat: 2, porque: 'κ 0,09 a 0,23: use un termómetro.' },
          { texto: 'Desviación traqueal', cat: 2, porque: 'κ 0,01: el neumotórax a tensión se reconoce por otros datos.' },
          { texto: 'Taquipnea estimada a simple vista', cat: 2, porque: 'κ 0,25 a 0,60: poco fiable si se estima; siempre contar.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Fiabilidad y validez en la ambulancia',
        preguntas: [
          { p: 'Dos observadores coinciden en 98 % de 100 pacientes de trauma al valorar la desviación traqueal, pero κ es prácticamente 0. ¿Por qué?',
            opciones: ['Porque el hallazgo es tan raro que casi todo el acuerdo se explica por azar', 'Porque 100 pacientes son pocos para calcular kappa', 'Porque kappa no sirve para hallazgos binarios'], correcta: 0,
            explicacion: 'Pe = 0,98: nunca coincidieron en un positivo. Es la paradoja de la prevalencia; el κ publicado del signo es 0,01.' },
          { p: 'Ciclista con PA sistólica normal, bien medida con manguito adecuado. ¿Por qué no descarta una hemorragia importante?',
            opciones: ['Porque la PA automática nunca es fiable en trauma', 'Porque es fiable, pero no válida para esa pregunta: la hipotensión es tardía', 'Porque la PA solo es válida si se mide en ambos brazos'], correcta: 1,
            explicacion: 'Fiabilidad y validez son propiedades independientes: un hallazgo puede ser reproducible y, aun así, engañoso (capítulo 4).' },
          { p: 'Paciente que «se ve bien». ¿Qué secuencia de tripulación hace fiables los signos vitales?',
            opciones: ['El que entrevista mide también, para no duplicar tareas', 'Se miden al llegar al hospital, donde hay mejor luz', 'El segundo mide sin conocer la impresión del primero y cuenta la FR 30 s dos veces'], correcta: 2,
            explicacion: 'Además: preguntar por el estado basal, registrar valores brutos con hora, calcular la escala y repetir a los 10 o 15 minutos.' },
          { p: 'En un ejercicio del servicio, «relleno capilar prolongado» obtiene κ de 0,30. ¿Qué hace?',
            opciones: ['Lo elimina de la evaluación para siempre', 'Estandariza definición y técnica, reentrena y lo usa solo como apoyo', 'Lo sigue usando igual: 0,30 es una concordancia aceptable'], correcta: 1,
            explicacion: 'Sitio y duración de la compresión, conteo de segundos en voz alta, ambiente templado; después se repite la medición de concordancia.' },
          { p: '¿Cómo transmite la escala de Glasgow en la transferencia?',
            opciones: ['Desglosada: ocular, verbal y motora, con el estímulo usado', 'Solo el total, que es lo que usan las escalas', 'Como «estuporoso» o «somnoliento», que se entiende mejor'], correcta: 0,
            explicacion: 'La concordancia exacta del total entre dos médicos de urgencias fue baja: el desglose conserva la información.' },
          { p: 'En un paro cardíaco, ¿qué enseña la evidencia sobre la palpación del pulso carotídeo?',
            opciones: ['Es rápida y exacta en manos entrenadas', 'Es lenta e inexacta: no más de 10 segundos y apoyarse en otros signos', 'Debe prolongarse hasta estar seguro, aunque se pause la reanimación'], correcta: 1,
            explicacion: 'Muy pocos reanimadores lograron una evaluación correcta en 10 segundos.' },
          { p: 'Paciente negro con SpO2 de 94 %. ¿Qué considera?',
            opciones: ['Nada: la pulsioximetría es igual de fiable en todos', 'Que la SpO2 subestima la oxigenación en piel oscura', 'Que la hipoxemia oculta fue unas tres veces más frecuente en pacientes negros'], correcta: 2,
            explicacion: '11,7 % frente a 3,6 % de SaO2 menor de 88 % con SpO2 de 92 a 96 %. Integre la clínica y la tendencia.' },
          { p: 'PA automática de 78/40 mmHg en un paciente que conversa, sonrosado y con buen relleno. ¿Qué hace primero?',
            opciones: ['Repetirla con técnica manual: un valor extremo discordante suele contener error', 'Tratar el shock de inmediato', 'Anotarla y seguir: el paciente está bien'], correcta: 0,
            explicacion: 'Regresión a la media: la siguiente medición tenderá a acercarse al valor habitual. Un valor extremo confirmado dos veces es real y se trata.' },
          { p: 'El despacho dijo «insuficiencia cardíaca» y usted «oye» crepitantes. ¿Qué fuente de discordancia puede actuar?',
            opciones: ['Variación biológica real', 'Sesgo de expectativa', 'Definición vaga del hallazgo'], correcta: 1,
            explicacion: 'Corrección: explorar antes de conocer la hipótesis ajena y usar un segundo observador.' },
          { p: 'La FC pasa de 92 a 96 lpm entre dos lecturas con el paciente tranquilo. ¿Qué indica?',
            opciones: ['Una tendencia al alza que obliga a reevaluar', 'Nada: es del tamaño del error de medición', 'Un inicio de shock compensado'], correcta: 1,
            explicacion: 'Una diferencia del tamaño del error no es una tendencia. Un ascenso sostenido de 20 lpm en tres mediciones sí lo es.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Fiabilidad frente a validez', reverso: 'Fiabilidad: ¿otro observador obtiene lo mismo? Validez: ¿coincide con la verdad del estándar de referencia?' },
          { frente: 'Fórmula de kappa', reverso: 'κ = (Po − Pe)/(1 − Pe) · Pe = pA·pB + (1 − pA)(1 − pB)' },
          { frente: 'Escala de Landis y Koch', reverso: '0 a 0,20 leve · 0,21 a 0,40 aceptable · 0,41 a 0,60 moderada · 0,61 a 0,80 considerable · 0,81 a 1 casi perfecta' },
          { frente: 'Regla operativa de kappa', reverso: 'Con κ menor de 0,4, el hallazgo no decide solo: segundo observador, otra técnica o tendencia' },
          { frente: 'Cinco fuentes de discordancia (McGee)', reverso: 'Definición vaga · técnica defectuosa · variación biológica · falta de atención · sesgo de expectativa' },
          { frente: 'LR que mueve la probabilidad de forma útil', reverso: '3 o más, o 0,3 o menos. Cercano a 1: casi no la modifica' },
          { frente: 'Tercer ruido en insuficiencia cardíaca', reverso: 'LR+ 11 · LR− 0,88: confirma con fuerza, casi no descarta' },
          { frente: 'Técnica de la FR', reverso: 'Observar el tórax sin anunciarlo, 30 s dos veces o 60 s; capnografía si está disponible' },
          { frente: 'Paradoja de la prevalencia', reverso: 'Con hallazgos muy raros, Pe se acerca a 100 % y κ queda cerca de 0 aunque el acuerdo observado sea alto' },
          { frente: 'Pregunta que convierte confusión en signo de alarma', reverso: '«¿Está como siempre?»' }
        ]
      }
    ]
  });
})();
