/* Capítulo 6. Reglas de decisión clínica y escalas prehospitalarias */
(function () {
  function elegir(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- NEWS2 (tabla del Royal College of Physicians, escala 1 de SpO2) ---------- */
  function ptsFR(v) { return v <= 8 ? 3 : v <= 11 ? 1 : v <= 20 ? 0 : v <= 24 ? 2 : 3; }
  function ptsSat(v) { return v <= 91 ? 3 : v <= 93 ? 2 : v <= 95 ? 1 : 0; }
  function ptsPAS(v) { return v <= 90 ? 3 : v <= 100 ? 2 : v <= 110 ? 1 : v <= 219 ? 0 : 3; }
  function ptsFC(v) { return v <= 40 ? 3 : v <= 50 ? 1 : v <= 90 ? 0 : v <= 110 ? 1 : v <= 130 ? 2 : 3; }
  function ptsT(v) { return v <= 35.0 ? 3 : v <= 36.0 ? 1 : v <= 38.0 ? 0 : v <= 39.0 ? 1 : 2; }

  var CATS = [
    'Bajo (0 a 4)',
    'Bajo a medio: 3 en un solo parámetro',
    'Medio (5 o 6): respuesta urgente',
    'Alto (7 o más): respuesta de emergencia'
  ];
  var RESP = [
    'Riesgo bajo. Recalcule en cada reevaluación: la tendencia pesa más que el valor aislado.',
    'Un solo parámetro extremo exige actuar sobre él aunque el total sea bajo, y reevaluar pronto.',
    'Umbral de respuesta urgente: en la escena orienta a más prioridad de traslado y a preaviso.',
    'Umbral de emergencia: máxima prioridad, recurso del nivel adecuado y preaviso (capítulo 13).'
  ];
  var CONTEXTOS = ['Anciano febril en su domicilio', 'Mujer con disnea de dos días', 'Varón con dolor abdominal y vómitos',
    'Paciente con infección urinaria en tratamiento', 'Mujer encontrada en el suelo por su vecina', 'Varón con tos productiva y malestar general',
    'Anciana con diarrea desde ayer', 'Varón diabético con una herida infectada en el pie'];

  function retoNEWS2(el, api) {
    var h = api.h, F = api.fmt;
    var ronda = 0, total = 5, puntos = 0, tiempos = [];
    function mezcla(normal, anormal) { return Math.random() < 0.5 ? elegir(normal) : elegir(anormal); }
    function paciente() {
      return {
        fr: mezcla([14, 16, 18, 20], [7, 10, 22, 24, 26, 32]),
        sat: mezcla([96, 97, 98], [89, 91, 92, 93, 94, 95]),
        o2: Math.random() < 0.25,
        pas: mezcla([118, 126, 134, 148], [84, 96, 104, 108, 226]),
        fc: mezcla([62, 74, 86], [38, 46, 96, 104, 116, 124, 138]),
        conc: Math.random() < 0.75 ? 'Alerta' : elegir(['Confusión nueva', 'Responde a la voz', 'Responde al dolor']),
        t: mezcla([36.6, 37.0, 37.6], [34.8, 35.6, 38.4, 38.9, 39.4])
      };
    }
    function desglose(p) {
      return [
        { n: 'Frecuencia respiratoria', v: p.fr + ' rpm', s: ptsFR(p.fr) },
        { n: 'SpO2 (escala 1)', v: p.sat + ' %', s: ptsSat(p.sat) },
        { n: '¿Aire u oxígeno?', v: p.o2 ? 'Oxígeno' : 'Aire', s: p.o2 ? 2 : 0 },
        { n: 'PA sistólica', v: p.pas + ' mmHg', s: ptsPAS(p.pas) },
        { n: 'Pulso', v: p.fc + ' lpm', s: ptsFC(p.fc) },
        { n: 'Conciencia', v: p.conc, s: p.conc === 'Alerta' ? 0 : 3 },
        { n: 'Temperatura', v: F(p.t, 1) + ' °C', s: ptsT(p.t) }
      ];
    }
    function categoria(d) {
      var tot = 0, tres = false;
      d.forEach(function (x) { tot += x.s; if (x.s === 3) tres = true; });
      return { tot: tot, cat: tot >= 7 ? 3 : tot >= 5 ? 2 : tres ? 1 : 0 };
    }
    function nueva() {
      el.innerHTML = '';
      if (ronda >= total) {
        var media = tiempos.reduce(function (a, b) { return a + b; }, 0) / tiempos.length;
        return api.fin(puntos / total, 'NEWS2 y nivel de respuesta: ' + F(puntos, puntos % 1 ? 1 : 0) + ' de ' + total + ' puntos. Tiempo medio por paciente: ' + F(media) + ' s.');
      }
      var p = paciente(), d = desglose(p), res = categoria(d), t0 = Date.now(), sel = null;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Paciente ' + (ronda + 1) + ' de ' + total + ' · primer contacto'));
      el.appendChild(h('div', { class: 'enunciado' }, elegir(CONTEXTOS) + '.'));
      var m = h('div', { class: 'monitor' });
      [['FR', p.fr + ' rpm'], ['SpO2', p.sat + ' %'], ['Soporte', p.o2 ? 'O2' : 'Aire'], ['PA', p.pas + '/' + Math.round(p.pas * 0.6)],
        ['FC', p.fc + ' lpm'], ['Conciencia', p.conc], ['T', F(p.t, 1) + ' °C']].forEach(function (x) {
        m.appendChild(h('span', null, x[0], h('b', null, x[1])));
      });
      el.appendChild(m);
      var inp = h('input', { type: 'text', inputmode: 'numeric', 'aria-label': 'NEWS2 total', placeholder: 'Total', style: 'width:90px' });
      el.appendChild(h('div', { class: 'fila', style: 'margin-top:8px' }, h('b', null, 'NEWS2 total:'), inp));
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Nivel de riesgo y respuesta'));
      var bots = CATS.map(function (c, k) {
        return h('button', { class: 'opcion', onclick: function () {
          if (hecho) return; sel = k;
          bots.forEach(function (b, j) { b.classList.toggle('sel', j === k); });
        } }, c);
      });
      bots.forEach(function (b) { el.appendChild(b); });
      var zona = h('div'), aviso = h('span', { class: 'pregunta-n' }), hecho = false;
      var bt = h('button', { class: 'btn', onclick: function () {
        var v = api.num(inp.value);
        if (isNaN(v) || sel === null) { aviso.textContent = 'Escriba el total y elija el nivel.'; return; }
        hecho = true; bt.disabled = true; inp.disabled = true; aviso.textContent = '';
        var seg = (Date.now() - t0) / 1000; tiempos.push(seg);
        var okT = v === res.tot, okC = sel === res.cat, nota = (okT ? 0.5 : 0) + (okC ? 0.5 : 0);
        puntos += nota;
        bots.forEach(function (b, j) { b.disabled = true; if (j === res.cat) b.classList.add('bien'); else if (j === sel) b.classList.add('mal'); });
        var tabla = h('table', { class: 't' }, h('tr', null, h('th', null, 'Parámetro'), h('th', null, 'Valor'), h('th', null, 'Puntos')));
        d.forEach(function (x) { tabla.appendChild(h('tr', null, h('td', null, x.n), h('td', null, x.v), h('td', { style: x.s === 3 ? 'font-weight:700;color:var(--rojo)' : '' }, String(x.s)))); });
        tabla.appendChild(h('tr', null, h('td', null, h('b', null, 'Total')), h('td'), h('td', null, h('b', null, String(res.tot)))));
        zona.appendChild(h('div', { class: 'fb ' + (nota === 1 ? 'bien' : nota ? 'info' : 'mal'), html:
          '<b>' + (okT ? 'Total correcto' : 'Total: ' + res.tot + ' (usted escribió ' + F(v) + ')') + '. ' + (okC ? 'Nivel correcto.' : 'Nivel: ' + CATS[res.cat] + '.') + '</b> ' + RESP[res.cat] + ' Tiempo: ' + F(seg, 0) + ' s.' }));
        zona.appendChild(h('div', { class: 'tabla-scroll' }, tabla));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ronda++; nueva(); } }, ronda + 1 < total ? 'Siguiente paciente' : 'Ver resultado')));
      } }, 'Comprobar');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    nueva();
  }

  /* ---------- Regla Canadiense de columna cervical, paso a paso ---------- */
  var CCR_APLICA = [
    { txt: 'Mujer de 34 años. Colisión trasera simple a baja velocidad. Estaba sentada en su vehículo y ha caminado por la escena. Dolor cervical que empezó una hora después, sin dolor en la línea media. Sin parestesias. Glasgow 15, signos vitales normales.',
      alto: false, altoTxt: 'Menor de 65 años, mecanismo no peligroso y sin parestesias.', bajo: true, bajoTxt: 'Tiene varios: colisión trasera simple, ha caminado, dolor diferido y sin dolor en la línea media.',
      rota: true, rotaTxt: 'gira 45 grados a la izquierda y a la derecha sin dificultad.' },
    { txt: 'Varón de 71 años. Colisión trasera simple en un semáforo. Ha caminado hasta la acera, está alerta y estable, con dolor cervical leve y sin parestesias.',
      alto: true, altoTxt: 'La edad de 65 años o más es por sí sola un factor de alto riesgo, aunque el mecanismo parezca banal.' },
    { txt: 'Ciclista de 26 años que chocó contra un automóvil que abrió la puerta. Alerta y estable, ha caminado, sin dolor en la línea media y sin parestesias.',
      alto: true, altoTxt: 'La colisión en bicicleta es un mecanismo peligroso en la regla. Haber caminado no compensa un factor de alto riesgo.' },
    { txt: 'Mujer de 38 años que cayó de su propia altura en la acera. Alerta y estable. Refiere hormigueo en ambas manos desde la caída.',
      alto: true, altoTxt: 'Las parestesias en las extremidades son un factor de alto riesgo.' },
    { txt: 'Mujer de 45 años. Colisión frontal a velocidad moderada; los bomberos la extrajeron y permanece acostada en la camilla, sin haber caminado. Dolor cervical inmediato en la línea media. Alerta, estable, sin parestesias.',
      alto: false, altoTxt: 'Menor de 65 años, sin parestesias; la colisión frontal a velocidad moderada no está en la lista de mecanismos peligrosos.', bajo: false,
      bajoTxt: 'Ninguno: no fue una colisión trasera simple, no está sentada, no ha caminado, el dolor fue inmediato y está en la línea media.' },
    { txt: 'Varón de 52 años. Colisión trasera simple. Estaba sentado en su vehículo, ha caminado y el dolor comenzó al rato. Alerta y estable, sin parestesias.',
      alto: false, altoTxt: 'Menor de 65 años, mecanismo no peligroso y sin parestesias.', bajo: true, bajoTxt: 'Colisión trasera simple, sentado, ha caminado y dolor diferido.',
      rota: false, rotaTxt: 'gira 45 grados a la derecha, pero solo unos 20 grados a la izquierda por dolor.' },
    { txt: 'Obrero de 40 años al que le cayó una caja pesada sobre la cabeza desde una estantería. Alerta y estable, ha caminado, sin dolor en la línea media.',
      alto: true, altoTxt: 'La carga axial sobre la cabeza es un mecanismo peligroso.' }
  ];
  var CCR_NO = [
    { txt: 'Adolescente de 14 años que cayó de su patineta. Alerta y estable, dolor cervical leve, ha caminado.',
      porqueNo: 'La regla se derivó y validó en adultos. En este paciente no puede usarse para descartar: decida con su protocolo y su juicio.' },
    { txt: 'Varón de 30 años con aliento alcohólico y Glasgow 14 tras una colisión trasera simple. Dice que el cuello no le duele.',
      porqueNo: 'No está alerta: la regla se validó en adultos alerta y estables. La intoxicación también excluye el uso de NEXUS.' },
    { txt: 'Mujer de 50 años tras una colisión lateral. Alerta, sin dolor cervical. PA 84/50 mmHg, FC 124 lpm.',
      porqueNo: 'No está estable. Fuera de la población de validación, “la regla no aplica” no equivale a “la regla es negativa”.' }
  ];

  function reglaCanadiense(el, api) {
    var h = api.h;
    var cartas = api.barajar(api.barajar(CCR_NO).slice(0, 2).concat(api.barajar(CCR_APLICA).slice(0, 4)));
    var i = 0, suma = 0, perfectas = 0;
    function carta() {
      el.innerHTML = '';
      if (i >= cartas.length) return api.fin(suma / cartas.length, perfectas + ' de ' + cartas.length + ' pacientes resueltos sin errores de secuencia.', false);
      var c = cartas[i], aplica = !c.porqueNo, pasos = 0, bien = 0;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Paciente ' + (i + 1) + ' de ' + cartas.length));
      el.appendChild(h('div', { class: 'caja', html: c.txt }));
      var zona = h('div'); el.appendChild(zona);
      function pregunta(txt, verdad, explic, luego) {
        var q = h('div', { style: 'margin-top:10px' });
        q.appendChild(h('div', { class: 'enunciado', html: txt }));
        var bs = [true, false].map(function (val) {
          return h('button', { class: 'btn sec', onclick: function () {
            bs.forEach(function (b) { b.disabled = true; });
            pasos++; var ok = val === verdad; if (ok) bien++;
            this.style.borderColor = ok ? 'var(--verde)' : 'var(--rojo)';
            q.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No. La respuesta es «' + (verdad ? 'Sí' : 'No') + '».</b> ') + explic }));
            luego();
          } }, val ? 'Sí' : 'No');
        });
        q.appendChild(h('div', { class: 'acciones', style: 'margin-top:4px' }, bs));
        zona.appendChild(q);
      }
      function concluir(txt) {
        var nota = pasos ? bien / pasos : 1; suma += nota; if (nota === 1) perfectas++;
        zona.appendChild(h('div', { class: 'fb info', html: '<b>Conclusión:</b> ' + txt }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; carta(); } }, i + 1 < cartas.length ? 'Siguiente paciente' : 'Ver resultado')));
      }
      pregunta('Antes de aplicar: ¿pertenece a la población de la regla (adulto alerta y estable)?', aplica, aplica ? 'Adulto, alerta y estable: la regla se puede aplicar.' : c.porqueNo, function () {
        if (!aplica) return concluir('la regla no aplica. Mantenga la restricción del movimiento espinal según su protocolo y traslade para evaluación.');
        pregunta('Paso 1. ¿Hay algún factor de alto riesgo? <span class="pregunta-n">(65 años o más, mecanismo peligroso o parestesias)</span>', c.alto, c.altoTxt, function () {
          if (c.alto) return concluir('imagen indicada. No explore la movilidad del cuello.');
          pregunta('Paso 2. ¿Hay algún factor de bajo riesgo que permita explorar la movilidad? <span class="pregunta-n">(colisión trasera simple, sentado, ha caminado, dolor de inicio diferido o sin dolor en la línea media)</span>', c.bajo, c.bajoTxt, function () {
            if (!c.bajo) return concluir('imagen indicada. Sin factores de bajo riesgo no es seguro explorar la rotación.');
            zona.appendChild(h('div', { class: 'datos', style: 'margin-top:10px' }, 'Le pide que rote activamente el cuello: ' + c.rotaTxt));
            pregunta('Paso 3. ¿Puede rotar activamente 45 grados a la izquierda y a la derecha?', c.rota, c.rota ? 'Rotación completa a ambos lados.' : 'No completa la rotación a un lado.', function () {
              concluir(c.rota ? 'no necesita imagen. La regla permite una restricción selectiva del movimiento espinal en lugar de la inmovilización universal.' : 'imagen indicada.');
            });
          });
        });
      });
    }
    carta();
  }

  TDC.registrar({
    numero: 6, parte: 'II',
    titulo: 'Reglas de decisión clínica y escalas prehospitalarias',
    mision: 'Elija la regla, verifique que el paciente pertenece a su población y aplíquela con criterio.',
    objetivo: 'Seleccionar, aplicar e interpretar reglas de decisión según su nivel de validación, su población de origen y el costo asimétrico de los errores.',
    escena: 'En un mismo turno atiende trauma, dolor torácico y pacientes febriles. Lleva en el bolsillo NEXUS, la Regla Canadiense, HEART y NEWS2. Su tarea no es recitarlas, sino saber <b>a quién se aplican</b>, qué error evitan y cuándo su juicio debe ir más allá de lo que la regla mide.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Reto NEWS2 en el primer contacto', render: retoNEWS2,
        instrucciones: 'Cinco pacientes con signos vitales al azar. Calcule el NEWS2 total y elija el nivel de riesgo. Todos usan la escala 1 de SpO2. Recuerde que un solo parámetro con 3 puntos cambia la respuesta aunque el total sea bajo.'
      },
      {
        tipo: 'personalizado', titulo: 'Regla Canadiense de columna, paso a paso', render: reglaCanadiense,
        instrucciones: 'Para cada paciente de trauma, decida primero si pertenece a la población de la regla y después recorra sus tres preguntas. El error que se busca evitar es aplicar una regla a un paciente que ella misma excluye.'
      },
      {
        tipo: 'caso', titulo: 'La anciana anticoagulada que solo se golpeó la cabeza',
        presentacion: '<b>08:20.</b> Mujer de 82 años que resbaló en el baño y se golpeó la región occipital. Toma apixabán por fibrilación auricular. Llamó la hija, que vive en otra ciudad.',
        fases: [
          {
            titulo: 'Evaluación inicial',
            monitor: { Glasgow: '15', FC: '82 lpm irregular', PA: '146/84', SpO2: '97 %' },
            datos: 'Orientada, cefalea occipital leve, sin vómitos ni pérdida de conciencia referida. Hematoma occipital de 3 cm. Exploración neurológica normal. Usted tiene a mano una lista local de no traslado para el TCE leve.',
            decision: { tipo: 'opcion', pregunta: 'Antes de aplicar cualquier regla de descarte, ¿cuál es la primera pregunta?',
              opciones: ['¿Pertenece esta paciente a la población en que se validó la regla?', '¿Cumple todos los criterios de la lista local de no traslado?', '¿Mantiene un Glasgow de 15 durante las próximas 2 horas?'],
              correcta: 0, explicacion: 'La primera pregunta no es qué dice la regla, sino si el paciente pertenece a la población en que se validó. Los criterios de exclusión son parte de la regla, no una nota al pie.' },
            experto: '“Anciana anticoagulada con un golpe en la cabeza: primero, ¿alguna regla de descarte se aplica a ella?”'
          },
          {
            titulo: 'La lista local',
            datos: 'La lista local pide Glasgow 15, sin pérdida de conciencia, sin vómitos y sin amnesia. La paciente cumple los cuatro.',
            decision: { tipo: 'opcion', pregunta: '¿Qué concluye?',
              opciones: ['No hay criterios de traslado: la paciente puede quedarse en casa', 'Aplico NEXUS: si cumple los cinco criterios, no necesita imagen', 'La regla de TC craneal excluyó a los anticoagulados, y la edad ya es de alto riesgo'],
              correcta: 2, porOpcion: { 1: 'NEXUS responde a otra pregunta: la columna cervical, no la hemorragia intracraneal.' },
              explicacion: 'La Regla Canadiense de TC craneal se derivó sin pacientes anticoagulados: aquí no aplica. Y aunque se aplicara, 65 años o más es un criterio de alto riesgo de la misma regla.' },
            experto: '“La regla canadiense excluyó a los anticoagulados, y aunque se aplicara, la edad ya es criterio de alto riesgo.”'
          },
          {
            titulo: 'Probabilidad previa',
            datos: 'Su compañero comenta: “Fue un golpe leve y está perfecta”.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que elevan el riesgo de hemorragia intracraneal en esta paciente.',
              opciones: ['Edad de 82 años', 'Tratamiento anticoagulante', 'Caída de baja energía con impacto craneal después de los 65 años', 'Glasgow de 15', 'Ausencia de vómitos', 'Exploración neurológica normal'],
              correctas: [0, 1, 2],
              explicacion: 'La guía de triaje de campo incluye la anticoagulación y la caída de baja energía con impacto craneal en mayores de 65. En pacientes con TCE y warfarina o clopidogrel previos, la hemorragia inmediata fue de 5,1 y 12,0 %, y hubo casos diferidos. Un Glasgow de 15 no la descarta.' }
          },
          {
            titulo: 'La negativa',
            datos: 'La paciente dice: “Estoy bien, no quiero ir al hospital”.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo le explica el riesgo?',
              opciones: ['“Fue un golpe leve; si se siente bien y está orientada, puede quedarse tranquila en casa”', '“De cada 100 personas anticoaguladas que se golpean como usted, unas 5 sangran dentro del cráneo”', '“Tiene que ir al hospital: si no acepta, avisaremos a la policía para llevarla igual”'],
              correcta: 1, parcial: [],
              explicacion: 'El riesgo se explica en frecuencias, añadiendo que algunas personas sangran horas después y que la tomografía es la única forma de saberlo. La negativa debe ser informada, con evaluación de la capacidad.' },
            experto: '“Tiene derecho a negarse, pero la negativa debe ser informada.”'
          },
          {
            titulo: 'Si mantiene la negativa',
            datos: 'Tras la explicación, la paciente, con capacidad conservada, mantiene su decisión.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace?',
              opciones: ['Registro lo explicado, consulto con la dirección médica y dejo un plan: acompañante 24 horas, signos de alarma por escrito y nueva llamada ante cambios', 'Registro la negativa firmada y me retiro: es su derecho y está orientada', 'Espero una hora en el domicilio y, si sigue igual, me retiro con la negativa firmada'],
              correcta: 0, parcial: [1],
              explicacion: 'La hija vive en otra ciudad: el plan de seguridad debe resolver quién la acompañará. NICE recomienda TC en las 8 horas siguientes en adultos anticoagulados con TCE.' },
            experto: '“Si mantiene la negativa: acompañante 24 horas, signos de alarma por escrito y consulta con la dirección médica.”'
          }
        ],
        cierre: 'En el caso real, el paramédico aplicó de memoria la lista local, concluyó que no había criterios de traslado y aceptó la negativa. Seis horas después la hija no logró despertarla: hematoma subdural agudo con evacuación quirúrgica. Un falso positivo cuesta un traslado y una TC; un falso negativo, la vida o la independencia. Antes de usar una regla, la primera pregunta es si este paciente pertenece a la población en que se validó.'
      },
      {
        tipo: 'numero', titulo: 'Cuánto debe descartar una regla',
        instrucciones: 'Use odds cuando corresponda. Escriba solo el número, con coma o punto decimal.',
        problemas: [
          { enunciado: 'La Regla Canadiense de columna tiene una sensibilidad de 100 % con límite inferior del intervalo de 98 % y una especificidad de 42,5 %. ¿Cuál es el LR− en el peor escenario plausible? (tres decimales)', respuesta: 0.047, tolerancia: 0.003, decimales: 3, solucion: 'LR− = (1 − 0,98)/0,425 = 0,047. Aun en el extremo menos favorable descarta con seguridad.' },
          { enunciado: 'Probabilidad previa de hemorragia intracraneal de 5 % y umbral para no hacer TC de 0,5 %. ¿Qué LR− necesita la regla? (tres decimales)', respuesta: 0.095, tolerancia: 0.006, decimales: 3, solucion: 'Odds del umbral 0,005/0,995 = 0,005. Odds previas 0,05/0,95 = 0,053. LR− necesario = 0,005/0,053 = 0,095: 0,1 o menos.' },
          { enunciado: 'En ese mismo grupo (previa 5 %), ¿qué probabilidad dejaría una regla con LR− de 0,3? (en %, un decimal)', respuesta: 1.6, tolerancia: 0.2, decimales: 1, unidad: '%', solucion: 'Odds 0,053 × 0,3 = 0,016 → 1,6 %, por encima del umbral de 0,5 %: esa regla no sirve para descartar aquí.' },
          { enunciado: 'Si 1 % de los pacientes con trauma cervical tiene una lesión importante y se cumplen los cinco criterios NEXUS (LR− 0,03), ¿qué probabilidad queda? (en %, dos decimales)', respuesta: 0.03, tolerancia: 0.006, decimales: 2, unidad: '%', solucion: 'Odds 0,0101 × 0,03 = 0,0003 → 0,03 %, muy por debajo del umbral ilustrativo de 0,1 %.' },
          { enunciado: 'Mujer de 52 años, dolor torácico de características mixtas, ondas T aplanadas inespecíficas, hipertensa y fumadora. ¿Cuál es su HEAR (HEART sin troponina)?', respuesta: 4, tolerancia: 0, solucion: 'Anamnesis 1, ECG 1, edad 1, factores de riesgo 1: HEAR 4. No es candidata a descarte prehospitalario aunque la troponina sea normal.' },
          { enunciado: 'Varón de 38 años, dolor muy sospechoso de isquemia, ECG normal, tabaquismo como único factor de riesgo. ¿Cuál es su HEAR?', respuesta: 3, tolerancia: 0, solucion: 'Anamnesis 2, ECG 0, edad 0, factores de riesgo 1: HEAR 3. Cumple el umbral de bajo riesgo, pero una anamnesis muy sospechosa obliga a valorar si el juicio debe prevalecer.' },
          { enunciado: 'qSOFA prehospitalario: sensibilidad 16,3 % y especificidad 97,3 %. ¿Cuál es su LR+? (un decimal)', respuesta: 6.0, tolerancia: 0.2, decimales: 1, solucion: 'LR+ = 0,163/(1 − 0,973) = 6,0. Un positivo pesa; el LR− de 0,86 casi no informa.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Cuánto vale esta regla? Niveles de McGinn',
        instrucciones: 'Asigne el nivel de evidencia a cada regla según cómo se validó.',
        categorias: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4'],
        items: [
          { texto: 'Puntaje de sepsis derivado en un hospital y validado con una partición de la misma base', cat: 3, porque: 'La partición de la misma muestra no es una validación independiente: comparte el sobreajuste. No debe usarse en la práctica.' },
          { texto: 'Regla validada prospectivamente en varios servicios de urgencias de países distintos, sin análisis de impacto', cat: 1, porque: 'Se puede usar con confianza en su exactitud, pero no hay pruebas de que cambie la conducta ni mejore desenlaces.' },
          { texto: 'Regla validada en poblaciones distintas, con un análisis de impacto que demuestra cambio de conducta y beneficio', cat: 0, porque: 'Nivel máximo: aplicable con confianza en ámbitos variados.' },
          { texto: 'Regla validada en una sola muestra prospectiva de un servicio con pacientes muy seleccionados', cat: 2, porque: 'Solo con cautela y en pacientes similares a los del estudio.' },
          { texto: 'Regla que seleccionó las mejores variables en una cohorte con pocos eventos y aún no se ha probado en otros pacientes', cat: 3, porque: 'Derivada sin validación: riesgo de sobreajuste, no aplicable a la práctica.' },
          { texto: 'Regla validada en un único estudio prospectivo amplio', cat: 1, porque: 'Nivel 2: exactitud confiable, sin pruebas de impacto.' },
          { texto: 'Escala recién publicada, muy precisa en su estudio de derivación, que un colega quiere adoptar mañana', cat: 3, porque: 'La precisión en la derivación suele caer en pacientes nuevos. Primero, validación independiente.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Reglas en la escena',
        preguntas: [
          { p: '¿Por qué el traslado directo al centro de trombectomía no mejoró el estado funcional en RACECAT?', opciones: ['Porque la escala RACE se aplicó mal en la mayoría de los pacientes', 'Porque los centros locales de ictus ya ofrecían trombectomía', 'Porque los tiempos de traslado directo resultaron demasiado largos para todos', 'Porque lo ganado con las oclusiones se perdió con los desviados sin oclusión'], correcta: 3, explicacion: 'La escala identifica sospechas, no oclusiones. Con un valor predictivo cercano a 40 %, muchos desviados no tenían oclusión o tenían hemorragias, y perdieron tiempo hasta la trombólisis o su atención.' },
          { p: 'Anciano febril, FR 24 rpm, FC 112 lpm, PA 118/70 mmHg, alerta: qSOFA de 1. ¿Lo tranquiliza?', opciones: ['No: el LR− de qSOFA es 0,86 y el NEWS2 ya marca riesgo medio o más', 'Sí: con qSOFA menor de 2 la sepsis grave se vuelve improbable', 'Sí, siempre que la temperatura se mantenga por debajo de 39 °C', 'No, porque un qSOFA de 1 ya confirma el diagnóstico de sepsis'], correcta: 0, explicacion: 'FR 24 suma 2 y FC 112 suma 2 en NEWS2. Se trata como sepsis probable: preaviso, acceso venoso, lactato si está disponible y reevaluación.' },
          { p: 'Dolor torácico desgarrante irradiado a la espalda con HEART de 2. ¿Qué error comete quien lo clasifica como bajo riesgo?', opciones: ['Un error de suma: olvidó el punto que corresponde a la edad', 'Sesgo de automatización: HEART no se diseñó para la disección', 'Ninguno, siempre que la troponina en el punto de atención sea normal', 'Un error de población: HEART solo se validó en mayores de 65'], correcta: 1, explicacion: 'HEART estima eventos coronarios en sospecha de síndrome coronario agudo. El dolor desgarrante obliga a la evaluación específica de disección (capítulo 15).' },
          { p: 'Sospecha de ictus sin paresia facial, sin deriva del brazo y sin alteración del habla. ¿Qué concluye?', opciones: ['El ictus queda descartado y puede buscar otra causa', 'Debe aplicar la escala RACE para confirmar el descarte', 'La probabilidad baja poco (LR− 0,39), sobre todo en la circulación posterior', 'La ausencia de signos sugiere un ictus hemorrágico'], correcta: 2, explicacion: 'La presencia de alguno de los tres signos tiene LR+ 5,5; la ausencia de los tres, solo LR− 0,39 (capítulo 12).' },
          { p: 'Un paciente pasa de NEWS2 de 3 a 6 en 20 minutos. ¿Cómo lo interpreta?', opciones: ['Sigue en riesgo medio, así que mantengo la prioridad inicial', 'Espero un tercer control antes de cambiar la prioridad', 'Recalculo con la escala 2 de SpO2 para confirmar el valor', 'La tendencia manda: cambio la prioridad y la comunico en la transferencia'], correcta: 3, explicacion: 'La tendencia pesa más que el valor aislado. Un ascenso rápido exige otra prioridad aunque 6 siga siendo “riesgo medio”.' },
          { p: 'La regla de columna es negativa, pero a usted le preocupa el paciente por un dato que la regla no mide. ¿Qué hace?', opciones: ['Sigo la regla, porque está validada y es más fiable que mi impresión', 'Prevalece la opción más segura y registro el caso para la auditoría', 'Aplico otra regla distinta hasta obtener un resultado positivo', 'Pido al paciente que decida si quiere la restricción de movimiento'], correcta: 1, explicacion: 'Una regla negativa autoriza a no hacer algo; no obliga a no hacerlo. Es un piso de seguridad, no un techo para el juicio.' },
          { p: 'Varón de 70 años atropellado a baja velocidad, alerta, PAS 104 mmHg, FC 96 lpm. Según la guía de triaje de campo de 2021:', opciones: ['No cumple criterios rojos, porque su PAS es mayor de 90', 'Cumple un criterio rojo: PAS menor de 110 a partir de los 65 años', 'Solo cumple un criterio amarillo, por el mecanismo del atropello', 'Cumple un criterio rojo, porque su FC es mayor de 90 lpm'], correcta: 1, explicacion: 'A partir de los 65 años el corte es PAS menor de 110 mmHg o FC mayor que la PAS. Entre los 10 y 64 años, PAS menor de 90.' },
          { p: 'Residente de Quito con neumonía: SpO2 93 % al aire, que su familia dice que es su valor habitual. ¿Cómo usa NEWS2?', opciones: ['Resto por mi cuenta los puntos de la SpO2 por la altitud', 'Uso siempre la escala 2 de SpO2 en los pacientes de la Sierra', 'Lo calculo completo y leo la SpO2 en contexto, con más peso a FR, conciencia y tendencia', 'No lo calculo en pacientes que viven a más de 2.500 metros'], correcta: 2, explicacion: 'En altura, 92 a 95 % suma puntos aunque pueda ser habitual. Ajustar la saturación no siempre mejora la escala (anexo E).' },
          { p: 'En trauma se acepta un sobretriaje de 25 a 35 %. ¿Por qué?', opciones: ['Porque el infratriaje del lesionado grave es el error más costoso', 'Porque los centros de trauma siempre tienen capacidad disponible', 'Porque la guía de triaje de campo tiene una sensibilidad baja', 'Porque el sobretriaje mejora la especificidad de la guía'], correcta: 0, explicacion: 'Se busca un infratriaje menor de 5 %. La elección de la regla sigue el costo asimétrico del error: ante la duda, trasladar a un centro de trauma.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Incorporar una regla al servicio',
        instrucciones: 'Ordene los cinco pasos para que una regla funcione en su servicio y no solo en el estudio.',
        pasos: [
          'Elegir reglas de nivel 1 o 2 cuya población se parezca a la del servicio',
          'Traducirlas a una ayuda cognitiva de bolsillo o al registro electrónico, con los criterios de exclusión visibles',
          'Entrenar su aplicación con casos, incluidos los que la regla excluye',
          'Auditar cuántos pacientes se clasificaron de bajo riesgo, cuántos presentaron el desenlace y cuántas veces se aplicó fuera de su población',
          'Analizar cualquier falso negativo grave como un evento centinela'
        ],
        explicacion: 'Sin auditoría, el servicio no conoce el rendimiento real de su regla ni cuántas veces se usa en pacientes que ella excluye.'
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Niveles de McGinn', reverso: '1: validada en poblaciones distintas + impacto · 2: validación prospectiva amplia · 3: una sola muestra estrecha · 4: solo derivada' },
          { frente: 'LR− necesario para descartar', reverso: 'Odds del umbral ÷ odds previas. En la práctica, una regla de descarte necesita LR− de 0,1 o menor.' },
          { frente: 'Criterios NEXUS', reverso: 'Sin dolor en la línea media cervical posterior, sin déficit focal, alerta normal, sin intoxicación, sin lesión dolorosa que distraiga. LR− 0,03.' },
          { frente: 'Regla Canadiense de columna: tres preguntas', reverso: '1. ¿Alto riesgo? (≥ 65 años, mecanismo peligroso, parestesias) · 2. ¿Algún factor de bajo riesgo? · 3. ¿Rota 45° a ambos lados?' },
          { frente: 'Mecanismos peligrosos de la Regla Canadiense', reverso: 'Caída desde 1 metro o 5 escalones, carga axial, colisión a alta velocidad, vuelco o eyección, vehículo motorizado recreativo, bicicleta.' },
          { frente: 'Regla Canadiense de TC craneal: alto riesgo', reverso: 'Glasgow < 15 a las 2 h, sospecha de fractura abierta o deprimida, signos de fractura de base, 2 o más vómitos, 65 años o más. Excluyó a los anticoagulados.' },
          { frente: 'HEART: eventos a 6 semanas', reverso: '0 a 3: 1,7 % · 4 a 6: 16,6 % · 7 a 10: 50,1 %. Bajo riesgo no es riesgo cero.' },
          { frente: 'Umbrales de NEWS2', reverso: '0 a 4 bajo · 3 en un parámetro: bajo a medio · 5 o 6: respuesta urgente · 7 o más: emergencia' },
          { frente: 'qSOFA en la ambulancia', reverso: 'Se 16,3 % · Es 97,3 % · LR+ ≈ 6 · LR− 0,86. Positivo alarma; negativo no tranquiliza.' },
          { frente: 'La regla como piso', reverso: 'Una regla negativa autoriza a no hacer algo; no obliga a no hacerlo. Si el juicio detecta un riesgo que la regla no mide, prevalece la opción más segura.' }
        ]
      }
    ]
  });
})();
