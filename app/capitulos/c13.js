/* Capítulo 13. El umbral terapéutico y las decisiones de disposición */
(function () {

  function zonaDe(p, inf, sup) { return p < inf ? 0 : p > sup ? 2 : 1; }
  var ZONAS = ['No probar ni tratar', 'Probar y decidir según el resultado', 'Tratar sin esperar la prueba'];

  /* ---------- Simulador de umbrales (Pauker y Kassirer) ---------- */
  var PRESETS = [
    { n: 'Ácido tranexámico, primera hora (CRASH-2)', B: 2.4, D: 0.2, nota: 'Beneficio de 2,4 puntos y daño supuesto de 0,2: umbral cercano a 8 %. No hay una prueba asociada; los límites de prueba usan los LR que tenga seleccionados.' },
    { n: 'Fibrinólisis en el caso del capítulo', B: 2.5, D: 0.7, nota: 'Estimación ilustrativa: daño 0,7 y beneficio 2,5 puntos. Pruebe B = 1: el umbral sube a 41 %. Los límites de prueba usan los LR que tenga seleccionados.' },
    { n: 'CPAP con ecografía pulmonar', B: 7, D: 3, lrp: 8.8, lrn: 0.13, nota: 'Relación 7:3, umbral de 30 %; ecografía pulmonar con LR+ 8,8 y LR− 0,13.' },
    { n: 'Ejemplo del apartado 13.3', B: 4, D: 1, lrp: 10, lrn: 0.1, nota: 'Umbral de 20 % y prueba con LR+ 10 y LR− 0,1: conviene probar entre 2,4 y 71 %.' }
  ];

  function simuladorUmbral(el, api) {
    var h = api.h, B = api.bayes, F = api.fmt;
    var s = { B: 4, D: 1, lrp: 10, lrn: 0.1, P: 40 }, tocado = false;
    el.appendChild(h('div', { class: 'enunciado' }, 'Paso 1. Explore el modelo'));
    var pre = h('select', { 'aria-label': 'Ejemplo', onchange: function () {
      var x = PRESETS[+pre.value]; if (!x) return;
      s.B = x.B; s.D = x.D; if (x.lrp) { s.lrp = x.lrp; s.lrn = x.lrn; } tocado = true; notaPre.textContent = x.nota; sincronizar();
    } }, h('option', { value: '' }, 'Cargar un ejemplo del capítulo…'), PRESETS.map(function (x, k) { return h('option', { value: k }, x.n); }));
    var notaPre = h('div', { class: 'pregunta-n' });
    el.appendChild(pre); el.appendChild(notaPre);
    var ctrls = {};
    function control(clave, rot, min, max, paso, dec) {
      var v = h('b'), r = h('input', { type: 'range', min: min, max: max, step: paso, 'aria-label': rot, oninput: function () { s[clave] = +r.value; tocado = true; calc(); } });
      ctrls[clave] = { r: r, v: v, dec: dec };
      el.appendChild(h('div', { style: 'margin-top:8px' }, rot + ': ', v));
      el.appendChild(r);
    }
    control('B', 'Beneficio si hay enfermedad (puntos)', 0.1, 10, 0.1, 1);
    control('D', 'Daño si no la hay (puntos)', 0.1, 10, 0.1, 1);
    control('lrp', 'LR+ de la prueba', 1, 50, 0.1, 1);
    control('lrn', 'LR− de la prueba', 0.01, 1, 0.01, 2);
    control('P', 'Probabilidad del paciente (%)', 1, 99, 1, 0);
    var salida = h('div', { style: 'padding-top:14px' }); el.appendChild(salida);
    function sincronizar() { for (var k in ctrls) ctrls[k].r.value = s[k]; calc(); }
    function calc() {
      for (var k in ctrls) ctrls[k].v.textContent = F(s[k], ctrls[k].dec) + (k === 'P' ? ' %' : '');
      var T = s.D / (s.D + s.B), oT = B.odds(T), inf = B.prob(oT / s.lrp), sup = B.prob(oT / s.lrn), p = s.P / 100, z = zonaDe(p, inf, sup);
      salida.innerHTML = '';
      salida.appendChild(api.barraProb([{ p: p, t: 'Paciente ' + s.P + ' %', clase: 'post' }], [{ p: inf, t: 'inf.' }, { p: T, t: 'T' }, { p: sup, t: 'sup.' }]));
      salida.appendChild(h('div', null,
        h('span', { class: 'cifra' }, h('small', null, 'Umbral T = D/(D + B)'), F(T * 100, 1) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'Probar desde'), F(inf * 100, 1) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'Probar hasta'), F(sup * 100, 1) + ' %')));
      salida.appendChild(h('div', { class: 'fb ' + ['info', 'info', 'bien'][z], html: '<b>' + ZONAS[z] + '.</b> ' +
        ['Por debajo del límite inferior, ni siquiera un resultado positivo llevaría a tratar.', 'En esta zona el resultado de la prueba puede cruzar el umbral: la prueba decide.', 'Por encima del límite superior, ni siquiera un resultado negativo justificaría no tratar.'][z] +
        ' Relación beneficio:daño ' + F(s.B / s.D, 1) + ':1.' }));
    }
    sincronizar();

    /* Paso 2: retos aleatorios de zona. */
    var RATIOS = [[1, 1], [3, 1], [4, 1], [9, 1], [19, 1], [7, 3]];
    var PRUEBAS = [[8.8, 0.13], [18.5, 0.27], [10, 0.1], [5.5, 0.39], [48, 0.03]];
    var PS = [2, 3, 5, 8, 10, 15, 20, 25, 35, 45, 55, 65, 75, 85, 92, 97];
    var reto = h('div', { style: 'margin-top:18px' }); el.appendChild(reto);
    reto.appendChild(h('div', { class: 'enunciado' }, 'Paso 2. Decida la zona sin la calculadora'));
    reto.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: iniciar }, 'Empezar 5 retos')));
    var ronda = 0, bien = 0;
    function generar() {
      var c;
      for (var intento = 0; intento < 200; intento++) {
        var r = RATIOS[Math.floor(Math.random() * RATIOS.length)], t = PRUEBAS[Math.floor(Math.random() * PRUEBAS.length)], p = PS[Math.floor(Math.random() * PS.length)];
        var T = r[1] / (r[0] + r[1]), oT = B.odds(T), inf = B.prob(oT / t[0]), sup = B.prob(oT / t[1]);
        c = { r: r, t: t, p: p, T: T, inf: inf, sup: sup, z: zonaDe(p / 100, inf, sup) };
        if (Math.abs(p / 100 - inf) > 0.02 && Math.abs(p / 100 - sup) > 0.03) return c;
      }
      return c;
    }
    function iniciar() { ronda = 0; bien = 0; siguiente(); }
    function siguiente() {
      reto.innerHTML = '';
      reto.appendChild(h('div', { class: 'enunciado' }, 'Paso 2. Decida la zona sin la calculadora'));
      if (ronda >= 5) {
        reto.appendChild(h('div', { class: 'fb ' + (bien >= 4 ? 'bien' : 'info') }, bien + ' de 5 zonas correctas.'));
        return api.fin(bien / 5, bien + ' de 5 decisiones de zona correctas' + (tocado ? '' : ' (explore también el simulador)'), true);
      }
      var c = generar();
      reto.appendChild(h('div', { class: 'pregunta-n' }, 'Reto ' + (ronda + 1) + ' de 5'));
      reto.appendChild(h('div', { html: 'Intervención con relación beneficio:daño <b>' + c.r[0] + ':' + c.r[1] + '</b>. Prueba disponible con <b>LR+ ' + F(c.t[0], 1) + '</b> y <b>LR− ' + F(c.t[1], 2) + '</b>. Probabilidad del paciente: <b>' + c.p + ' %</b>.' }));
      var z = h('div');
      var ops = ZONAS.map(function (t, j) {
        return h('button', { class: 'opcion', onclick: function () {
          ops.forEach(function (b) { b.disabled = true; });
          var ok = j === c.z; if (ok) bien++;
          ops[c.z].classList.add('bien'); if (!ok) this.classList.add('mal');
          z.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + 'T = ' + c.r[1] + '/(' + c.r[1] + ' + ' + c.r[0] + ') = ' + F(c.T * 100, 1) + ' %; odds ' + F(B.odds(c.T), 2) + '. Límite inferior: ' + F(B.odds(c.T), 2) + '/' + F(c.t[0], 1) + ' → ' + F(c.inf * 100, 1) + ' %. Límite superior: ' + F(B.odds(c.T), 2) + '/' + F(c.t[1], 2) + ' → ' + F(c.sup * 100, 1) + ' %.' }));
          z.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ronda++; siguiente(); } }, ronda + 1 < 5 ? 'Siguiente reto' : 'Ver resultado')));
        } }, t);
      });
      ops.forEach(function (b) { reto.appendChild(b); });
      reto.appendChild(z);
    }
  }

  /* ---------- Lista del no traslado seguro ---------- */
  var CONDICIONES = [
    'Probabilidad de enfermedad grave bajo el umbral, tras una evaluación estructurada',
    'Signos vitales normales y escala de alerta precoz de bajo riesgo',
    'Capacidad de decisión conservada y consentimiento informado',
    'Plan de seguridad: acompañante, signos de alarma por escrito y vía para volver a llamar',
    'Registro de la información dada y del razonamiento',
    'Consulta a la dirección médica ante cualquier duda',
    'Ausencia de preocupación clínica'
  ];
  var ESCENAS_NT = [
    { t: 'Varón de 28 años que cayó de su bicicleta a baja velocidad. Contusión en el antebrazo con movilidad completa; la evaluación estructurada no encuentra otras lesiones. FC 78 lpm, PA 124/78, FR 14 rpm, SpO2 98 %, NEWS2 0. Orientado, entiende lo que le explica y prefiere no ir al hospital. Su pareja se queda con él; recibe los signos de alarma por escrito y el número para volver a llamar. Usted lo registra todo, no tiene dudas y no está preocupado.',
      falla: [], neutro: [], fb: 'Se cumplen las siete condiciones: el no traslado es razonable y queda documentado.' },
    { t: 'Mujer de 84 años que se cayó en casa, sin lesiones visibles. Su hija dice que «está rara desde ayer». Signos vitales normales y NEWS2 bajo. No sabe en qué día está, repite la misma pregunta y dice que no quiere ir al hospital. La hija puede quedarse con ella.',
      falla: [0, 2], neutro: [4, 5, 6], fb: 'Confusión aguda: delirium con una causa médica sin descartar, y sin capacidad de decisión conservada. Signos vitales normales no bastan.' },
    { t: 'Varón de 55 años, diabético, con epigastralgia y náuseas desde hace una hora: «es la gastritis de siempre». Signos vitales normales, NEWS2 0. No se ha hecho un ECG. Lúcido, entiende la información y prefiere quedarse. Su esposa está con él y recibiría los signos de alarma por escrito.',
      falla: [0], neutro: [4, 5, 6], fb: 'La evaluación estructurada está incompleta: la epigastralgia en un diabético es un camaleón del infarto y falta el ECG. Hasta descartarlo, la probabilidad no está bajo el umbral.' },
    { t: 'Mujer de 30 años con una cefalea igual a sus migrañas de siempre, de inicio gradual, sin fiebre ni focalidad, que mejoró con su analgésico habitual. Signos vitales normales, NEWS2 0. Lúcida, comprende y prefiere quedarse. Vive sola, nadie puede acompañarla esta noche y no tiene saldo en el teléfono.',
      falla: [3], neutro: [4, 5], fb: 'La clínica es tranquilizadora, pero no hay plan de seguridad: sin acompañante ni vía para volver a llamar. Resuélvalo o traslade.' },
    { t: 'Niño de 3 años con fiebre desde ayer. Tras el antitérmico, sus signos vitales están dentro de lo normal para la edad. Los padres entienden la información, prefieren no ir al hospital y se quedarían con él. Usted siente que algo va mal: está demasiado quieto y la madre dice que «no es el mismo».',
      falla: [0, 6], neutro: [4, 5], fb: 'La preocupación clínica y la de los padres son datos con peso propio (sensación de alarma con LR+ 25,5). Si el profesional está preocupado, traslada.' }
  ];

  function noTraslado(el, api) {
    var h = api.h;
    var esc = api.barajar(ESCENAS_NT).slice(0, 4), i = 0, suma = 0;
    function pintar() {
      el.innerHTML = '';
      if (i >= esc.length) return api.fin(suma / esc.length, 'Decisiones de disposición revisadas: ' + esc.length + ' · desempeño medio ' + Math.round(suma / esc.length * 100) + ' %', true);
      var E = esc[i], marc = {}, cerrado = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Paciente ' + (i + 1) + ' de ' + esc.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Tras su evaluación</span>' + E.t }));
      el.appendChild(h('div', { class: 'enunciado' }, '1. Marque las condiciones que NO se cumplen'));
      var bots = CONDICIONES.map(function (c, k) {
        return h('button', { class: 'opcion', onclick: function () {
          if (cerrado) return;
          marc[k] = !marc[k]; this.classList.toggle('sel', marc[k]); this.innerHTML = (marc[k] ? '✗ ' : '☐ ') + (k + 1) + '. ' + c;
        } }, '☐ ' + (k + 1) + '. ' + c);
      });
      bots.forEach(function (b) { el.appendChild(b); });
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, '2. ¿Qué decide?'));
      var zona = h('div');
      var decis = ['No traslado seguro', 'Todavía no: trasladar o resolver lo que falta'].map(function (t, j) {
        return h('button', { class: 'opcion', onclick: function () {
          if (cerrado) return; cerrado = true;
          decis.forEach(function (b) { b.disabled = true; });
          var debe = E.falla.length ? 1 : 0, okDec = j === debe;
          decis[debe].classList.add('bien'); if (!okDec) this.classList.add('mal');
          var eval_ = 0, bienC = 0;
          bots.forEach(function (b, k) {
            b.disabled = true;
            var falla = E.falla.indexOf(k) >= 0, neutro = E.neutro.indexOf(k) >= 0, m = !!marc[k];
            if (falla) b.classList.add(m ? 'bien' : 'mal');
            else if (m && !neutro) b.classList.add('mal');
            if (!neutro) { eval_++; if (m === falla) bienC++; }
          });
          var nota = 0.5 * (okDec ? 1 : 0) + 0.5 * bienC / eval_;
          suma += nota;
          zona.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : nota >= 0.5 ? 'info' : 'mal'), html: '<b>' + (okDec ? 'Decisión acertada.' : 'Decisión equivocada.') + '</b> ' + E.fb +
            (E.neutro.length ? ' <span class="pregunta-n">Las condiciones de registro, consulta o preocupación que dependen de usted no se puntúan aquí.</span>' : '') }));
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; pintar(); } }, i + 1 < esc.length ? 'Siguiente paciente' : 'Ver resultado')));
        } }, t);
      });
      decis.forEach(function (b) { el.appendChild(b); });
      el.appendChild(zona);
    }
    pintar();
  }

  TDC.registrar({
    numero: 13, parte: 'IV',
    titulo: 'El umbral terapéutico y las decisiones de disposición',
    mision: 'Calcule umbrales, decida si probar o tratar y aplique los criterios del no traslado seguro.',
    objetivo: 'Decidir cuándo tratar, cuándo seguir estudiando y cuándo trasladar mediante umbrales explícitos que integran probabilidad, beneficio, daño y valores del paciente.',
    escena: 'En la escena no se trata un diagnóstico: se trata una probabilidad. Cada intervención tiene su propio umbral, que depende de lo que se gana en quien está enfermo y de lo que se arriesga en quien no lo está. Su tarea es hacer <b>explícita esa comparación</b> antes de actuar, de probar o de dejar a un paciente en casa.',
    actividades: [
      {
        tipo: 'caso', titulo: 'Infarto a 180 kilómetros de la hemodinamia',
        presentacion: '<b>05:40.</b> Varón de 62 años en una localidad rural con dolor opresivo retroesternal de 90 minutos, sudoración y náuseas. La sala de hemodinamia más cercana está a 180 km por carretera de montaña, unas 4 horas; el transporte aéreo no está disponible por el clima.',
        fases: [
          {
            titulo: 'Paso 1: probabilidad',
            monitor: { FC: '64 lpm', 'PA brazo der.': '148/90', 'PA brazo izq.': '144/88', SpO2: '96 %' },
            datos: 'ECG: elevación del ST de 3 mm en II, III y aVF con descenso especular en aVL; elevación del ST en V4R. Pulsos simétricos, sin déficit neurológico ni soplo diastólico. El dolor no es desgarrante ni irradia a la espalda.',
            decision: { tipo: 'probabilidad', pregunta: '¿Qué probabilidad de infarto con elevación del ST estima?', rango: [82, 96],
              explicacion: 'Clínica y ECG con criterios claros la sitúan cerca de 90 %. En los sistemas de activación de hemodinamia, 14 % de las activaciones no tuvo arteria culpable; aquí la concordancia de clínica y ECG reduce ese riesgo.' }
          },
          {
            titulo: 'Paso 2: tiempo',
            decision: { tipo: 'opcion', pregunta: 'Con 4 horas hasta la angioplastia, ¿qué estrategia corresponde?',
              opciones: ['Esperar a que el clima permita el transporte aéreo', 'Traslado directo para angioplastia primaria, sin fibrinólisis', 'Fibrinólisis en los 10 minutos siguientes al diagnóstico, si no hay contraindicaciones, y traslado'],
              correcta: 2,
              explicacion: 'Si el tiempo previsto hasta la angioplastia supera 120 minutos, se indica fibrinólisis en los 10 minutos siguientes al diagnóstico. El beneficio es mayor cuanto antes: en torno a 37 vidas por cada 1.000 tratados en la segunda hora desde el inicio.' },
            experto: '“Cuatro horas hasta la hemodinamia: muy por encima de 120 minutos.”'
          },
          {
            titulo: 'Paso 3: umbral',
            datos: 'Estimación ilustrativa. Daño si no fuera un infarto: unos 0,7 puntos (hemorragia intracraneal cercana a 1 %, la mitad mortal o discapacitante, más otras hemorragias graves). Beneficio frente a una angioplastia a más de 4 horas: unos 2,5 puntos.',
            decision: { tipo: 'opcion', pregunta: '¿Cuál es el umbral de tratamiento?',
              opciones: ['28 %: 0,7/2,5', '22 %: 0,7/(0,7 + 2,5)', '78 %: 2,5/(0,7 + 2,5)'],
              correcta: 1,
              porOpcion: { 0: 'Dividió el daño por el beneficio: el denominador es D + B.', 2: 'Esa es la proporción del beneficio, no el umbral.' },
              explicacion: 'T = D/(D + B) = 22 %. Aun con un beneficio de solo 1 punto, el umbral sería de 41 %, muy por debajo de 90 %.' },
            experto: '“Probabilidad cercana a 90 % frente a un umbral de 20 a 40 %: corresponde tratar.”'
          },
          {
            titulo: 'Paso 4: punto de parada',
            datos: 'Antes del fármaco de alto riesgo, repasa la lista en voz alta con su compañero.',
            decision: { tipo: 'multiple', pregunta: 'Marque las contraindicaciones absolutas que verifica.',
              opciones: ['Hemorragia intracraneal previa', 'Ictus isquémico reciente', 'Trauma o cirugía mayor reciente', 'Hemorragia digestiva reciente', 'Sospecha de disección aórtica', 'Infarto de ventrículo derecho', 'Edad mayor de 60 años'],
              correctas: [0, 1, 2, 3, 4],
              explicacion: 'La lista incluye además neoplasia del sistema nervioso central y trastorno hemorrágico conocido. Para la disección se aplicaron los criterios de riesgo: sin condiciones, dolor ni hallazgos de alto riesgo, puntaje 0. El infarto de ventrículo derecho y la edad no contraindican la fibrinólisis.' },
            experto: '“Antes del fármaco: contraindicaciones y disección, en voz alta.”'
          },
          {
            titulo: 'Paso 5: valores del paciente',
            decision: { tipo: 'opcion', pregunta: '¿Cómo le explica el riesgo?',
              opciones: ['«Es un medicamento muy seguro; casi nunca pasa nada.»', '«De cada 100 personas tratadas, alrededor de 1 tiene un sangrado cerebral»; y el beneficio, también en frecuencias', '«Hay 1 % de riesgo de hemorragia cerebral, pero sin él usted podría morir.»'],
              correcta: 1, parcial: [2],
              porOpcion: { 2: 'La cifra es correcta, pero el marco empuja la decisión.' },
              explicacion: 'Frecuencias naturales, los dos marcos y sin adjetivos que empujen. Luego se verifica que el paciente repita lo que entendió.' }
          },
          {
            titulo: 'Tratamiento y criterio de éxito',
            monitor: { FC: '66 lpm', PA: '140/86', ST: 'bajó > 50 % a los 60 min' },
            datos: 'Tenecteplasa ajustada al peso, antiagregación y anticoagulación según protocolo. Su compañero sugiere nitroglicerina sublingual para el dolor residual.',
            decision: { tipo: 'opcion', pregunta: '¿Qué plan corresponde?',
              opciones: ['Nitroglicerina y dejarlo en el centro de salud local: ya reperfundió', 'Sin nitratos por el ventrículo derecho; seguir al centro con hemodinamia. Si el ST no hubiera bajado, reperfusión de rescate', 'Repetir la fibrinólisis para asegurar la reperfusión'],
              correcta: 1,
              explicacion: 'La elevación en V4R indica compromiso del ventrículo derecho: nada de nitratos. El criterio de éxito es un descenso del ST de más de la mitad a los 60 a 90 minutos; si no ocurre, reperfusión de rescate.' },
            experto: '“A los 60 a 90 minutos, el ST debería haber bajado más de la mitad; si no, reperfusión de rescate.”'
          }
        ],
        cierre: 'La coronariografía al día siguiente mostró una oclusión de la coronaria derecha recanalizada, tratada con un stent. La decisión no se tomó por el diagnóstico sino por la comparación explícita entre la probabilidad y el umbral, y el punto de parada antes del fármaco de alto riesgo convirtió una decisión correcta en una decisión segura (capítulo 15).'
      },
      {
        tipo: 'personalizado', titulo: 'Simulador de umbrales', render: simuladorUmbral,
        instrucciones: 'Ajuste beneficio, daño y los LR de la prueba, o cargue un ejemplo. Vea dónde cae el paciente: no probar ni tratar, probar o tratar. Después resuelva 5 retos aleatorios sin la calculadora.'
      },
      {
        tipo: 'numero', titulo: 'Umbrales a mano',
        instrucciones: 'Use T = D/(D + B) y los límites odds T/LR+ y odds T/LR−. Escriba solo el número.',
        problemas: [
          { enunciado: 'Un tratamiento tiene un beneficio neto 6 veces mayor que su daño. ¿Umbral de tratamiento?', respuesta: 14, tolerancia: 1, unidad: '%', solucion: 'T = 1/(1 + 6) = 0,14.' },
          { enunciado: 'Beneficio de 3 puntos y daño de 1 punto. ¿Umbral?', respuesta: 25, tolerancia: 0.5, unidad: '%', solucion: 'VE = P × 3 − (1 − P) × 1 = 0 → 4P = 1 → P = 0,25.' },
          { enunciado: 'Ácido tranexámico en la primera hora: beneficio de 2,4 puntos (7,7 a 5,3 %) y daño supuesto de 0,2 puntos. ¿Umbral? (un decimal)', respuesta: 7.7, tolerancia: 0.4, decimales: 1, unidad: '%', solucion: '0,2/(0,2 + 2,4) = 7,7 %. Una sospecha razonable de hemorragia importante basta dentro de las 3 horas.' },
          { enunciado: 'Umbral para CPAP de 30 %. Ecografía pulmonar con LR+ 8,8. ¿Por debajo de qué probabilidad no vale la pena hacerla?', respuesta: 4.7, tolerancia: 0.6, decimales: 1, unidad: '%', solucion: 'Odds del umbral 0,43; 0,43/8,8 = 0,049 → cerca de 5 %.' },
          { enunciado: 'Mismo umbral y LR− 0,13. ¿Por encima de qué probabilidad inicia la CPAP sin esperar la imagen?', respuesta: 77, tolerancia: 1.5, unidad: '%', solucion: '0,43/0,13 = 3,3 → 3,3/4,3 = 77 %.' },
          { enunciado: 'Caso de la fibrinólisis con daño de 0,7 puntos, pero suponiendo un beneficio de solo 1 punto. ¿Umbral?', respuesta: 41, tolerancia: 1, unidad: '%', solucion: '0,7/(0,7 + 1) = 41 %: aún muy por debajo de una probabilidad cercana a 90 %.' },
          { enunciado: 'Adrenalina en el paro extrahospitalario: supervivencia a 30 días de 3,2 % frente a 2,4 %. ¿NNT?', respuesta: 125, tolerancia: 3, solucion: 'RAR = 0,8 puntos; NNT = 1/0,008 = 125. Con más supervivientes con daño neurológico grave (31,0 frente a 17,8 %).' },
          { enunciado: 'Regla de terminación de soporte vital básico: recomendó terminar en 776 pacientes y 4 sobrevivieron al alta. ¿Porcentaje? (un decimal)', respuesta: 0.5, tolerancia: 0.1, decimales: 1, unidad: '%', solucion: '4/776 = 0,5 %.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: '¿No traslado seguro?', render: noTraslado,
        instrucciones: 'Cuatro pacientes que prefieren no ir al hospital. Revise las siete condiciones del no traslado seguro, marque las que no se cumplen y decida.'
      },
      {
        tipo: 'clasificar', titulo: 'Regla de terminación de la reanimación',
        instrucciones: 'Aplique la regla de soporte vital básico: paro no presenciado por el equipo, ninguna descarga y ninguna recuperación de la circulación antes del traslado.',
        categorias: ['Considerar la terminación', 'La regla no se cumple'],
        items: [
          { texto: 'Mujer de 78 años hallada por su familia; 20 minutos de reanimación en asistolia, sin descargas ni recuperación de la circulación', cat: 0, porque: 'Cumple los tres criterios. La decisión final integra el protocolo, la dirección médica y los deseos conocidos de la paciente.' },
          { texto: 'Paro que ocurre delante de la tripulación, en asistolia, sin descargas', cat: 1, porque: 'Presenciado por el equipo.' },
          { texto: 'Paro no presenciado por el equipo; se administró una descarga al inicio; sin recuperación', cat: 1, porque: 'Hubo una descarga.' },
          { texto: 'Paro no presenciado por el equipo; recuperó el pulso a los 12 minutos y lo volvió a perder', cat: 1, porque: 'Hubo recuperación de la circulación.' },
          { texto: 'Colapso en la calle con testigos; el desfibrilador público no indicó descarga; sin recuperación en ningún momento', cat: 0, porque: 'La regla básica se refiere al equipo. La versión avanzada añade que no haya testigos ni reanimación antes de la llegada.' },
          { texto: 'Paro durante el traslado, ya dentro de la ambulancia', cat: 1, porque: 'Presenciado por el equipo.' },
          { texto: 'Hallado en la cama, ritmo no desfibrilable durante toda la reanimación, sin pulso en ningún momento', cat: 0, porque: 'Cumple los tres criterios: la regla estima el pronóstico y los valores del paciente deciden.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Comunicar el fallecimiento',
        instrucciones: 'Ordene la secuencia práctica para comunicar la muerte a la familia.',
        pasos: ['Preparar el espacio y retirar de la vista el material si es posible', 'Identificar al familiar principal y presentarse', 'Anticipar la noticia: «tengo malas noticias»', 'Decirla con palabras claras: «ha muerto», sin eufemismos', 'Guardar silencio y permitir la reacción', 'Responder con honestidad y explicar los pasos siguientes'],
        explicacion: 'La claridad no es falta de compasión: los eufemismos prolongan la incertidumbre de la familia. Después, una conversación breve con la tripulación reduce el efecto de arrastre (capítulo 9).'
      },
      {
        tipo: 'quiz', titulo: 'Tratar, probar o trasladar',
        preguntas: [
          { p: 'Paciente con hemorragia por trauma atendido 3 horas y media después de la lesión. ¿Ácido tranexámico?', opciones: ['Sí: el beneficio se mantiene a cualquier hora', 'No: después de 3 horas aumentó la muerte por hemorragia', 'Sí, pero a mitad de la dosis habitual'], correcta: 1, explicacion: 'En CRASH-2, después de 3 horas: 4,4 % frente a 3,1 % de muertes por hemorragia. El umbral de tiempo es parte del umbral terapéutico.' },
          { p: '¿Cómo presenta la fibrinólisis sin inducir un efecto de encuadre?', opciones: ['Solo con la supervivencia, que tranquiliza', 'Con los dos marcos, en frecuencias y sin adjetivos', 'Con el riesgo relativo, que es más preciso'], correcta: 1, explicacion: 'Con cáncer de pulmón, 18 % prefirió la radioterapia en términos de supervivencia y 44 % en términos de mortalidad. Verifique que el paciente repita lo que entendió.' },
          { p: 'El umbral para la dextrosa en una sospecha de hipoglucemia es casi 0. ¿Por qué medir la glucemia antes cuando es posible?', opciones: ['Porque la dextrosa sin confirmar está contraindicada', 'Porque cuesta segundos, confirma la causa y deja una referencia', 'Porque el umbral real de la dextrosa es alto'], correcta: 1, explicacion: 'Si el valor es normal, orienta la búsqueda hacia otra causa.' },
          { p: 'Sospecha de sepsis con traslado corto. ¿Antibióticos en la ambulancia?', opciones: ['Siempre: cada minuto ganado reduce la mortalidad', 'En general no: priorizar reconocimiento, preaviso y traslado', 'Nunca, ni siquiera en la enfermedad meningocócica'], correcta: 1, explicacion: 'En 2.672 pacientes se administraron 26 minutos antes, sin cambio en la mortalidad a 28 días. Excepciones: shock séptico con traslado largo o sospecha de enfermedad meningocócica.' },
          { p: 'Su servicio de trauma tiene 30 % de sobretriaje. ¿Cómo lo interpreta?', opciones: ['Un fallo del equipo que debe corregirse', 'El costo calculado de mantener el infratriaje bajo 5 %', 'Una señal de que la escala de campo no sirve'], correcta: 1, explicacion: 'Se acepta un sobretriaje de 25 a 35 % para no perder a los pacientes graves.' },
          { p: 'La probabilidad ya supera el umbral de tratamiento y el retraso tiene costo. ¿Qué hace con la prueba que tarda minutos?', opciones: ['Trata primero y prueba después, en paralelo o en ruta', 'Espera la prueba: siempre debe confirmarse antes', 'Omite el tratamiento hasta el hospital'], correcta: 0, explicacion: 'Si la probabilidad está en la zona intermedia, en cambio, la prueba se justifica aunque cueste minutos.' },
          { p: 'Adrenalina en el paro extrahospitalario (PARAMEDIC2). ¿Qué mostró?', opciones: ['Más supervivencia, sin diferencia en el daño neurológico', 'Más supervivencia a 30 días, con más daño neurológico grave', 'Ningún efecto sobre la supervivencia a 30 días'], correcta: 1, explicacion: '3,2 frente a 2,4 % de supervivencia; 31,0 frente a 17,8 % de daño neurológico grave entre los supervivientes. En buen estado neurológico, 2,2 frente a 1,9 %, sin diferencia significativa.' },
          { p: 'No hay números para calcular el umbral. ¿Qué pregunta lo sustituye?', opciones: ['¿Qué haría el protocolo más conservador?', '¿Qué error lamentaría más: tratar de más o de menos?', '¿Qué decidiría el hospital receptor?'], correcta: 1, explicacion: 'En las patologías tiempo-dependientes el arrepentimiento por omisión suele ser mucho mayor que por comisión.' },
          { p: 'Un paciente en coma no despierta tras la dextrosa. ¿Qué le dice eso?', opciones: ['Que hay que repetir la dosis hasta que despierte', 'Que la hipoglucemia era la causa, pero tardará', 'Que hay que buscar otra causa: el tratamiento también es prueba'], correcta: 2, explicacion: 'La dextrosa, la naloxona o un broncodilatador tienen umbral muy bajo y su respuesta aporta información (capítulo 11).' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Umbral de tratamiento', reverso: 'T = D/(D + B). Sale de igualar a 0: VE = P × B − (1 − P) × D' },
          { frente: 'Relación beneficio:daño y umbral', reverso: '1:1 → 50 % · 3:1 → 25 % · 4:1 → 20 % · 9:1 → 10 % · 19:1 → 5 % · 99:1 → 1 %' },
          { frente: 'Intervalo en que conviene hacer una prueba', reverso: 'Odds inferior = odds T/LR+ · odds superior = odds T/LR−. Fuera de ese intervalo, la prueba no cambia la conducta.' },
          { frente: 'Fibrinólisis prehospitalaria', reverso: 'Si la angioplastia tardará más de 120 minutos, fibrinólisis en los 10 minutos siguientes al diagnóstico, salvo contraindicación.' },
          { frente: 'Siete condiciones del no traslado seguro', reverso: 'Bajo el umbral tras evaluación · signos vitales y escala de bajo riesgo · capacidad y consentimiento · plan de seguridad · registro · consulta ante la duda · sin preocupación clínica' },
          { frente: 'Regla de terminación de soporte vital básico', reverso: 'No presenciado por el equipo · sin descargas · sin recuperación de la circulación. En su validación, 0,5 % de supervivencia al alta.' },
          { frente: 'Documentar una decisión bajo incertidumbre', reverso: 'Probabilidad estimada · hallazgos que la sostienen · alternativa considerada y por qué se descartó · plan si la evolución no es la esperada' },
          { frente: 'Guion de la conversación de no traslado', reverso: '«Todo indica que ahora no tiene una enfermedad grave, pero ninguna evaluación es perfecta. Si aparece…, llame de inmediato. ¿Puede repetirme qué haría?»' }
        ]
      }
    ]
  });
})();
