/* Capítulo 4. Precisión diagnóstica: sensibilidad, especificidad, valores predictivos y sesgos de los estudios */
(function () {

  /* Laboratorio de la tabla de 2 × 2 con retos verificables. */
  function laboratorio2x2(el, api) {
    var h = api.h, F = api.fmt, B = api.bayes;
    var se = 80, es = 85, prev = 20, tocado = false, terminado = false;
    var RETOS = [
      { t: 'Trampa del SnNout: sensibilidad de 90 % o más, pero un negativo que no descarta (LR− de 0,3 o más).', ok: function (m) { return m.se >= 0.9 && m.lrn >= 0.3; } },
      { t: 'Misma prueba, otra población: con Se y Es de exactamente 90 %, halle una prevalencia en la que el VPP sea menor de 10 %.', ok: function (m) { return se === 90 && es === 90 && m.vpp < 0.10; } },
      { t: 'Prueba que confirma y descarta: LR+ de 10 o más y LR− de 0,1 o menos.', ok: function (m) { return m.lrp >= 10 && m.lrn <= 0.1; } }
    ];
    var hechos = [false, false, false];
    function deslizador(rot, min, max, get, set) {
      var val = h('b', null, get() + ' %');
      var r = h('input', { type: 'range', min: min, max: max, step: 1, value: get(), 'aria-label': rot, oninput: function () { set(+r.value); val.textContent = r.value + ' %'; tocado = true; calc(); } });
      return h('div', { style: 'margin:6px 0' }, h('div', null, rot + ': ', val), r);
    }
    el.appendChild(deslizador('Sensibilidad', 50, 100, function () { return se; }, function (v) { se = v; }));
    el.appendChild(deslizador('Especificidad', 0, 100, function () { return es; }, function (v) { es = v; }));
    el.appendChild(deslizador('Prevalencia (probabilidad previa)', 1, 60, function () { return prev; }, function (v) { prev = v; }));
    var salida = h('div'); el.appendChild(salida);
    el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Retos: mueva los deslizadores hasta cumplir cada uno'));
    var listaRetos = h('div'); el.appendChild(listaRetos);
    var acc = h('div', { class: 'acciones' }); el.appendChild(acc);
    function calc() {
      var s = se / 100, e = es / 100, p = prev / 100, N = 1000;
      var a = N * p * s, c = N * p - a, d = N * (1 - p) * e, b = N * (1 - p) - d;
      var m = { se: s, es: e, vpp: a + b > 0 ? a / (a + b) : 0, vpn: c + d > 0 ? d / (c + d) : 1, lrp: e < 1 ? s / (1 - e) : Infinity, lrn: e > 0 ? (1 - s) / e : Infinity };
      salida.innerHTML = '';
      salida.appendChild(h('div', { class: 'tabla-scroll' }, h('table', { class: 't' },
        h('tr', null, h('th', null, '1.000 pacientes'), h('th', null, 'Con condición'), h('th', null, 'Sin condición')),
        h('tr', null, h('th', null, 'Positivo'), h('td', null, 'a = ' + F(a)), h('td', null, 'b = ' + F(b))),
        h('tr', null, h('th', null, 'Negativo'), h('td', null, 'c = ' + F(c)), h('td', null, 'd = ' + F(d))))));
      function lr(x) { return x === Infinity ? '∞' : F(x, x < 1 ? 2 : 1); }
      salida.appendChild(h('div', null,
        h('span', { class: 'cifra' }, h('small', null, 'VPP = a/(a + b)'), F(m.vpp * 100) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'VPN = d/(c + d)'), F(m.vpn * 100, 1) + ' %'),
        h('span', { class: 'cifra' }, h('small', null, 'LR+ = Se/(1 − Es)'), lr(m.lrp)),
        h('span', { class: 'cifra' }, h('small', null, 'LR− = (1 − Se)/Es'), lr(m.lrn))));
      salida.appendChild(api.barraProb([
        { p: p, t: 'P' },
        { p: m.vpp, t: '+', clase: 'post' },
        { p: 1 - m.vpn, t: '−' }
      ]));
      salida.appendChild(h('div', { class: 'pregunta-n' }, 'P: previa ' + prev + ' % · +: tras un positivo ' + F(m.vpp * 100) + ' % · −: tras un negativo ' + F((1 - m.vpn) * 100, 1) + ' %'));
      var lect = m.lrn <= 0.1 ? 'Un negativo descarta con fuerza si la previa no es alta.' : m.lrn >= 0.3 ? 'Un negativo apenas descarta, por alta que sea la sensibilidad.' : 'Un negativo baja la probabilidad, pero no resuelve la pregunta.';
      salida.appendChild(h('div', { class: 'pregunta-n', style: 'margin-top:6px' }, lect + ' ' + (m.lrp >= 10 ? 'Un positivo confirma con fuerza si la previa no es muy baja.' : 'Un positivo no basta por sí solo para confirmar.')));
      listaRetos.innerHTML = '';
      RETOS.forEach(function (re, i) {
        if (tocado && !hechos[i] && re.ok(m)) hechos[i] = true;
        listaRetos.appendChild(h('div', { class: 'item-clas' + (hechos[i] ? ' bien' : '') }, h('div', { class: 'txt' }, (hechos[i] ? '☑ ' : '☐ ') + re.t)));
      });
      var n = hechos.filter(Boolean).length;
      acc.innerHTML = '';
      if (terminado) return;
      if (n === 3) { terminado = true; api.fin(1, 'Tres retos cumplidos: el cociente de verosimilitud, no la sensibilidad sola, es lo que descarta.', true); return; }
      acc.appendChild(h('button', { class: 'btn sec', disabled: n === 0, onclick: function () { terminado = true; acc.innerHTML = ''; api.fin(n / 3, n + ' de 3 retos cumplidos', true); } }, 'Terminar con ' + n + ' de 3'));
    }
    calc();
  }

  /* Monitor seriado del ciclista: índice de shock cada 5 minutos y momento de la decisión. */
  var SERIE = [{ min: 0, fc: 104, pa: 118 }, { min: 5, fc: 112, pa: 116 }, { min: 10, fc: 120, pa: 110 }, { min: 15, fc: 128, pa: 86 }];

  function monitorIS(el, api) {
    var h = api.h, F = api.fmt;
    var k = 0, aciertosIS = 0, decidido = -1, registros = [];
    function grafico() {
      var alto = 120, max = 1.6;
      var g = h('div', { style: 'position:relative;height:' + alto + 'px;border-bottom:1px solid var(--linea);display:flex;align-items:flex-end;gap:14px;padding:0 8px;margin:12px 0 22px' });
      g.appendChild(h('div', { style: 'position:absolute;left:0;right:0;bottom:' + (0.9 / max * alto) + 'px;border-top:2px dashed var(--rojo)' },
        h('span', { class: 'pregunta-n', style: 'position:absolute;right:0;top:-18px' }, 'IS 0,9')));
      SERIE.forEach(function (s, i) {
        var is = s.fc / s.pa, visible = i < registros.length;
        g.appendChild(h('div', { style: 'flex:1;max-width:56px;position:relative;height:' + (visible ? Math.min(is, max) / max * alto : 0) + 'px;background:' + (is >= 0.9 ? 'var(--rojo)' : 'var(--ambar-borde)') + ';border-radius:4px 4px 0 0;opacity:' + (visible ? 1 : 0) },
          h('span', { class: 'pregunta-n', style: 'position:absolute;bottom:-18px;left:0;right:0;text-align:center' }, 'min ' + s.min)));
      });
      return g;
    }
    function pintar() {
      el.innerHTML = '';
      var s = SERIE[k], is = s.fc / s.pa;
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">En ruta · minuto ' + s.min + '</span>Ciclista de 19 años, impacto del manillar en el hipocondrio izquierdo, dolor en el hombro izquierdo, pálido. Usted reevalúa cada 5 minutos.' }));
      var mon = h('div', { class: 'monitor' });
      mon.appendChild(h('span', null, 'FC', h('b', null, s.fc + ' lpm')));
      mon.appendChild(h('span', null, 'PA sistólica', h('b', null, s.pa + ' mmHg')));
      el.appendChild(mon);
      el.appendChild(grafico());
      var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Índice de shock', placeholder: '0,00', style: 'width:90px' });
      el.appendChild(h('div', { class: 'fila' }, h('span', null, 'Índice de shock (FC/PAS):'), inp));
      var zona = h('div');
      function decidir(traslado) {
        var v = api.num(inp.value); if (isNaN(v)) { aviso.textContent = 'Calcule primero el índice de shock.'; inp.focus(); return; }
        aviso.textContent = '';
        var ok = Math.abs(v - is) <= 0.02; if (ok) aciertosIS++;
        registros.push({ min: s.min, is: is, ok: ok, v: v });
        if (traslado) { decidido = k; return final(); }
        if (k + 1 >= SERIE.length) return final();
        k++; pintar();
        el.insertBefore(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: 'Minuto ' + s.min + ': IS ' + F(is, 2) + (ok ? ' (bien calculado).' : ' (usted escribió ' + F(v, 2) + ').') + ' Mantuvo el plan.' }), el.firstChild);
      }
      el.appendChild(h('button', { class: 'opcion', onclick: function () { decidir(false); } }, 'Mantener el plan y reevaluar en 5 minutos'));
      el.appendChild(h('button', { class: 'opcion', onclick: function () { decidir(true); } }, 'Decidir ahora: centro de trauma con preaviso'));
      var aviso = h('div', { class: 'pregunta-n' });
      el.appendChild(aviso);
      el.appendChild(zona);
    }
    function final() {
      el.innerHTML = '';
      registros = SERIE.map(function (s) { return { min: s.min, is: s.fc / s.pa }; });
      el.appendChild(grafico());
      var t = h('table', { class: 't' }, h('tr', null, h('th', null, 'Minuto'), h('th', null, 'FC'), h('th', null, 'PAS'), h('th', null, 'IS')));
      SERIE.forEach(function (s) { t.appendChild(h('tr', null, h('td', null, String(s.min)), h('td', null, String(s.fc)), h('td', null, String(s.pa)), h('td', null, F(s.fc / s.pa, 2)))); });
      el.appendChild(h('div', { class: 'tabla-scroll' }, t));
      var notaDec = decidido === 0 || decidido === 1 ? 1 : decidido === 2 ? 0.5 : 0;
      var evaluados = decidido >= 0 ? decidido + 1 : SERIE.length;
      var notaIS = aciertosIS / evaluados;
      var msj = decidido < 0 ? '<b>No decidió el traslado.</b> A los 15 minutos la PA cayó a 86 mmHg: esperó a la hipotensión, el marcador tardío.'
        : decidido <= 1 ? '<b>Decisión a tiempo (minuto ' + SERIE[decidido].min + ').</b> ' + (decidido === 0 ? 'Con mecanismo de riesgo e IS de 0,88, cercano al umbral, el experto ya decide aquí.' : 'El IS superó 0,9 antes de que cayera la PA.')
        : decidido === 2 ? '<b>Decisión tardía (minuto 10).</b> El IS ya había superado 0,9 en el minuto 5.'
        : '<b>Decisión cuando cayó la PA (minuto 15).</b> El IS superaba 0,9 desde el minuto 5.';
      el.appendChild(h('div', { class: 'fb ' + (notaDec === 1 ? 'bien' : notaDec ? 'info' : 'mal'), html: msj + ' Índices bien calculados: ' + aciertosIS + ' de ' + evaluados + '. La trayectoria de la FC y el índice de shock informan antes que la PA.' }));
      api.fin(0.5 * notaDec + 0.5 * notaIS, 'Momento de la decisión y cálculo del índice de shock', true);
    }
    pintar();
  }

  TDC.registrar({
    numero: 4, parte: 'II',
    titulo: 'Precisión diagnóstica: sensibilidad, especificidad, valores predictivos y sesgos de los estudios',
    mision: 'Construya la tabla de 2 × 2, desconfíe del negativo tranquilizador y lea un estudio con ojo crítico.',
    objetivo: 'Calcular e interpretar sensibilidad, especificidad y valores predictivos, reconocer cuándo un hallazgo negativo no descarta y evaluar críticamente un estudio de precisión diagnóstica.',
    escena: 'Un joven ciclista con la PA normal «parece estable» y todos quieren creerlo. Su tarea es saber cuánto vale ese dato: qué descarta de verdad un resultado negativo, qué significa un positivo en su población y cuándo las cifras de un estudio no se cumplen en su ambulancia.',
    actividades: [
      {
        tipo: 'caso', titulo: 'La presión arterial que tranquilizó a todos',
        presentacion: '<b>Domingo, 10:30.</b> Ciclista de 19 años que choca contra un poste a unos 35 km/h; el manillar le golpea el hipocondrio izquierdo.',
        fases: [
          {
            titulo: 'El mecanismo',
            datos: 'Su compañero comenta: «Es una caída de bicicleta, energía baja».',
            decision: { tipo: 'opcion', pregunta: '¿Cómo valora el mecanismo?',
              opciones: ['Energía baja: una bicicleta a poca velocidad', 'Solo importa si hay heridas o deformidad visibles', 'Alto riesgo: el manillar concentra la energía en un área pequeña del abdomen'],
              correcta: 2,
              explicacion: 'El impacto del manillar es un mecanismo de alto riesgo de lesión visceral.' },
            experto: '“Manillar contra el costado izquierdo: pienso en bazo hasta que se demuestre lo contrario.”'
          },
          {
            titulo: 'Evaluación',
            monitor: { FC: '104 lpm', PA: '118/76', FR: '22 rpm', SpO2: '98 %', 'Relleno capilar': '3 s' },
            datos: 'Consciente y orientado. Dolor en el costado izquierdo y en el hombro izquierdo. Pálido. Dolor a la palpación del hipocondrio izquierdo, sin defensa franca.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que pesan a favor de una hemorragia.',
              opciones: ['Dolor en el hombro izquierdo sin trauma directo', 'FC de 104 lpm en un deportista de 19 años', 'Palidez', 'PA de 118/76 mmHg', 'SpO2 de 98 %'],
              correctas: [0, 1, 2],
              explicacion: 'Hombro: posible sangre subdiafragmática (signo de Kehr). FC 104 con basal probable cercana a 60: taquicardia relativa marcada. Palidez: vasoconstricción compensadora. La PA normal es la ausencia de un hallazgo tardío.' },
            experto: '“FC de 104 en un deportista de 19 años es una taquicardia relativa; la PA normal no me dice nada todavía.”'
          },
          {
            titulo: '¿Cuánto tranquiliza la PA normal?',
            datos: 'En voluntarios sometidos a extracción de sangre, la hipotensión tuvo una sensibilidad de solo 33 % para pérdidas de 630 a 1.150 mL. Con especificidad alta, una PA normal tiene un LR− aproximado de 0,7.',
            decision: { tipo: 'probabilidad', pregunta: 'Si la probabilidad previa de lesión intraabdominal significativa era de 35 %, ¿cuál es tras ver una PA normal?', rango: [22, 32],
              explicacion: 'Odds 0,54 × 0,7 = 0,38 → 27 %. Casi no la modifica: se dio a un dato débil el peso de uno fuerte.' }
          },
          {
            titulo: 'Índice de shock',
            decision: { tipo: 'opcion', pregunta: '¿Cuál es el índice de shock y qué indica?',
              opciones: ['0,62: normal y tranquilizador', '0,88: cerca del umbral de 0,9 asociado con hemorragia crítica', '1,13: shock establecido'],
              correcta: 1,
              explicacion: '104/118 = 0,88. Medido de forma seriada habría mostrado la trayectoria antes de la hipotensión.' }
          },
          {
            titulo: 'Destino',
            decision: { tipo: 'opcion', pregunta: '¿Adónde lo lleva?',
              opciones: ['Centro de trauma con preaviso, acceso venoso y ácido tranexámico dentro de las 3 horas', 'Hospital general más cercano, sin preaviso: la PA está normal', 'Espera en la escena una segunda PA antes de decidir'],
              correcta: 0,
              porOpcion: { 1: 'Es lo que ocurrió: a los 25 minutos tenía FC 128 y PA 86/50, sin cirujano de guardia.', 2: 'Esperar la hipotensión es esperar un marcador tardío.' },
              explicacion: 'Diagnóstico de trabajo: shock compensado por probable lesión esplénica.' }
          },
          {
            titulo: 'Reevaluación a los 10 minutos',
            monitor: { FC: '116 lpm' },
            decision: { tipo: 'opcion', pregunta: '¿Qué hace en ruta?',
              opciones: ['Nada distinto: la PA sigue normal', 'Hipotensión permisiva y reevaluación cada 5 minutos', 'Bolo de fluidos hasta normalizar la FC'],
              correcta: 1,
              explicacion: 'La tendencia de la FC confirma la pérdida; la reposición es restrictiva hasta el control quirúrgico.' },
            experto: '“FC de 116: la tendencia confirma la pérdida.”'
          }
        ],
        cierre: 'En el caso real requirió traslado secundario, esplenectomía y seis unidades de concentrado de hematíes. El error no fue de conocimiento sino de ponderación. En el paciente joven con mecanismo de riesgo, una PA normal no es un hallazgo tranquilizador: es la ausencia de un hallazgo tardío.'
      },
      {
        tipo: 'personalizado', titulo: 'Monitor seriado: índice de shock', render: monitorIS,
        instrucciones: 'Signos del ciclista cada 5 minutos. En cada lectura calcule el índice de shock (dos decimales) y decida si mantiene el plan o traslada ya al centro de trauma con preaviso. Se evalúa el cálculo y, sobre todo, el momento de la decisión.'
      },
      {
        tipo: 'personalizado', titulo: 'Laboratorio de la tabla de 2 × 2', render: laboratorio2x2,
        instrucciones: 'Mueva sensibilidad, especificidad y prevalencia. Observe la tabla para 1.000 pacientes, los valores predictivos y los cocientes de verosimilitud, y dónde queda la probabilidad tras un positivo o un negativo. Cumpla los tres retos.'
      },
      {
        tipo: 'numero', titulo: 'De la tabla a la decisión',
        instrucciones: 'Calcule. Escriba solo el número; use coma o punto decimal.',
        problemas: [
          { enunciado: 'Soplo holosistólico e insuficiencia tricuspídea (McGee): a = 22, b = 3, c = 20, d = 55. ¿Sensibilidad?', respuesta: 52, tolerancia: 1, unidad: '%', solucion: '22/42 = 52 %.' },
          { enunciado: 'Con la misma tabla, ¿especificidad?', respuesta: 95, tolerancia: 1, unidad: '%', solucion: '55/58 = 95 %.' },
          { enunciado: 'Y el LR+ (un decimal).', respuesta: 10.1, tolerancia: 0.4, decimales: 1, solucion: '0,52/(1 − 0,95) ≈ 10,1: presente pesa mucho; ausente (LR− 0,5), poco. El VPP de 88 % solo vale para la prevalencia del estudio (42 %).' },
          { enunciado: 'Regla de alerta de ictus con Se 80 % y Es 85 % en 500 llamadas con prevalencia de 20 %. ¿VPP?', respuesta: 57, tolerancia: 1.5, unidad: '%', solucion: '80 VP / (80 + 60) = 57 %: algo más de 1 ictus por cada 2 alertas. Se perderían 20 ictus.' },
          { enunciado: 'Regla de cribado de sepsis con Se 95 % y Es 20 %. Probabilidad previa 30 % y resultado negativo. ¿Probabilidad posterior?', respuesta: 10, tolerancia: 1.5, unidad: '%', solucion: 'LR− = 0,05/0,20 = 0,25; odds 0,43 × 0,25 = 0,11 → 10 %. SnNout sugería descartar, pero 1 de cada 10 no es aceptable.' },
          { enunciado: 'Prueba con Se 90 % y Es 30 % (LR− 0,33). Probabilidad previa 30 % y resultado negativo. ¿Probabilidad posterior?', respuesta: 12, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,43 × 0,33 = 0,14 → 12 %. Misma sensibilidad que una prueba con Es 90 %, pero descarta mucho menos.' },
          { enunciado: 'Prueba con Se 85 % y Es 90 %. ¿VPP si la prevalencia es de 5 %?', respuesta: 31, tolerancia: 1.5, unidad: '%', solucion: '0,0425/(0,0425 + 0,095) = 31 %: un positivo significa «probablemente no».' },
          { enunciado: 'La misma prueba con prevalencia de 40 %. ¿VPP?', respuesta: 85, tolerancia: 1.5, unidad: '%', solucion: '0,34/(0,34 + 0,06) = 85 %: ahora un positivo significa «casi seguro».' }
        ]
      },
      {
        tipo: 'clasificar', titulo: 'Lectura crítica: ¿qué sesgo es?',
        instrucciones: 'Identifique el sesgo principal de cada estudio de precisión diagnóstica.',
        categorias: ['Espectro', 'Verificación', 'Incorporación', 'Revisión', 'Referencia imperfecta'],
        items: [
          { texto: 'Una escala de ictus se evalúa en pacientes con ictus extensos confirmados frente a voluntarios sanos', cat: 0, porque: 'Enfermos graves frente a sanos evidentes: sobreestima sensibilidad y especificidad.' },
          { texto: 'Un estudio de ecografía FAST solo incluye pacientes hipotensos con hemoperitoneo masivo', cat: 0, porque: 'La ecografía detecta mejor un hemoperitoneo grande que uno pequeño en un paciente estable.' },
          { texto: 'Solo los pacientes con escala positiva recibieron tomografía; los negativos se dieron por sanos', cat: 1, porque: 'Solo los positivos reciben la referencia: sobreestima la sensibilidad.' },
          { texto: 'Solo se hizo seguimiento del diagnóstico final a los pacientes con alerta paramédica positiva', cat: 1, porque: 'Sesgo de verificación.' },
          { texto: 'La alerta paramédica de sepsis activaba el protocolo que definía el diagnóstico final', cat: 2, porque: 'La prueba forma parte de la referencia: infla ambos parámetros.' },
          { texto: 'El diagnóstico final de infarto se construyó incluyendo el ECG prehospitalario que se evaluaba', cat: 2, porque: 'Sesgo de incorporación.' },
          { texto: 'El radiólogo que informó la tomografía conocía el resultado de la ecografía prehospitalaria', cat: 3, porque: 'Quien interpreta la referencia conoce la prueba: infla la concordancia.' },
          { texto: 'La ecografía para neumotórax se comparó con la radiografía de tórax en decúbito', cat: 4, porque: 'El estándar también falla: distorsiona en cualquier dirección.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Precisión diagnóstica en la escena',
        preguntas: [
          { p: 'Un estudio de ecografía para neumotórax hecho por expertos en un centro de trauma informa sensibilidad de 91 %. ¿Qué espera en un servicio rural con operadores novatos?',
            opciones: ['La misma cifra: la sensibilidad es una propiedad fija de la prueba', 'Una cifra menor: espectro, operador y condiciones distintas; 91 % es un techo', 'Una cifra mayor, porque los pacientes rurales llegan más graves'], correcta: 1,
            explicacion: 'El servicio debe auditar su propio rendimiento.' },
          { p: 'Para detectar hemorragia importante en trauma, ¿qué corte del índice de shock elige?',
            opciones: ['0,9: más sensible, porque el falso negativo cuesta mucho más', '1,4: más específico, para evitar falsas alarmas', 'Da igual: el área bajo la curva es la misma'], correcta: 0,
            explicacion: 'Un corte más alto serviría para otra pregunta, como decidir una transfusión masiva.' },
          { p: 'Dolor torácico típico y ECG normal. ¿Qué concluye?',
            opciones: ['Descartado: el ECG es la prueba de referencia', 'Probable origen muscular', 'El ECG normal no descarta un síndrome coronario agudo'], correcta: 2,
            explicacion: 'Un hallazgo solo descarta si su LR− es bajo y la probabilidad previa no era alta. Tampoco una SpO2 normal descarta un tromboembolismo.' },
          { p: 'Prueba con LR− de 0,11 y probabilidad previa de 70 %. El resultado es negativo. ¿Qué probabilidad queda?',
            opciones: ['Cerca de 20 %: con previa alta, ni una buena prueba descarta', 'Menos de 5 %: descartado', 'Cerca de 50 %'], correcta: 0,
            explicacion: 'Odds 2,33 × 0,11 = 0,26 → 20 %. Para descartar: LR− de 0,1 o menor y previa baja o intermedia.' },
          { p: 'Un estudio hospitalario informa un VPP de 80 % para un signo. ¿Por qué no lo traslada a la escena?',
            opciones: ['Porque en la escena los signos se miden peor', 'Porque el VPP depende de la prevalencia, que en la escena es otra; el LR se traslada mejor', 'Porque el VPP solo vale para pruebas de laboratorio'], correcta: 1,
            explicacion: 'Los cocientes de verosimilitud no dependen directamente de la prevalencia.' },
          { p: 'Una escala tiene un área bajo la curva ROC de 0,85. ¿Qué punto de corte debe usar?',
            opciones: ['El que dé 85 % de sensibilidad', 'El de máximo índice de Youden, siempre', 'El área no lo dice: el corte se elige según el costo de cada error'], correcta: 2,
            explicacion: 'Youden (J = Se + Es − 1) solo es óptimo si ambos errores cuestan lo mismo, algo raro en la escena.' },
          { p: 'Dos pacientes: FC 104 y FC 140. Ambos se registran como «taquicardia». ¿Qué problema ilustra?',
            opciones: ['Ninguno: la taquicardia es un hallazgo binario', 'Dicotomizar una variable continua desperdicia información', 'Un error de medición del monitor'], correcta: 1,
            explicacion: 'Los LR por intervalos y los índices combinados, como el índice de shock, conservan mejor la información.' },
          { p: 'Los criterios NEXUS tienen sensibilidad de 99,6 % y especificidad de 12,9 %. ¿Cómo se usan?',
            opciones: ['Para descartar lesión cervical dentro de la población en que se validaron', 'Para confirmar lesión cervical cuando son positivos', 'Para ambas cosas, porque su sensibilidad es casi perfecta'], correcta: 0,
            explicacion: 'LR− de 0,03 pero LR+ de 1,1: casi nunca pierden una lesión y señalan a muchos sin lesión.' },
          { p: 'En trauma, ¿desde qué PA sistólica sugieren los datos de mortalidad que empieza la hipotensión con significado pronóstico?',
            opciones: ['Por debajo de 90 mmHg', 'Por debajo de 110 mmHg', 'Por debajo de 70 mmHg'], correcta: 1,
            explicacion: 'Esperar a 90 mmHg es esperar un marcador todavía más tardío.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Tabla de 2 × 2', reverso: 'Se = a/(a + c) · Es = d/(b + d) · VPP = a/(a + b) · VPN = d/(c + d)' },
          { frente: 'Dos direcciones de lectura', reverso: 'Se y Es por columnas (desde la verdad). VPP y VPN por filas (desde el resultado), dependen de la prevalencia' },
          { frente: 'Regla práctica para descartar y confirmar', reverso: 'Descartar: LR− ≤ 0,1 y previa baja o intermedia. Confirmar: LR+ ≥ 10 y previa no muy baja' },
          { frente: 'SnNout y SpPin', reverso: 'Orientan, pero engañan si el otro parámetro es bajo. Lo que descarta o confirma es el LR' },
          { frente: 'qSOFA prehospitalario', reverso: 'Se 16,3 % · Es 97,3 % · LR+ 6,0 · LR− 0,86: un positivo pesa, un negativo no descarta' },
          { frente: 'Índice de shock', reverso: 'FC/PAS. Un valor de 0,9 o más se asocia con hemorragia crítica en trauma' },
          { frente: 'Índice de Youden', reverso: 'J = Se + Es − 1. Útil solo si ambos errores cuestan lo mismo' },
          { frente: 'Cinco sesgos de los estudios de precisión', reverso: 'Espectro · verificación · incorporación · revisión · referencia imperfecta' },
          { frente: 'Hipotensión en la hemorragia', reverso: 'Sensibilidad cercana a 33 % para pérdidas de 630 a 1.150 mL: marcador tardío' }
        ]
      }
    ]
  });
})();
