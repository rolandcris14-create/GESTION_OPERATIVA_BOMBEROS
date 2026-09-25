/* Capítulo 16. Factores humanos, trabajo en equipo y gestión del error en la ambulancia */
(function () {

  /* Laboratorio del queso suizo: incidente adaptado para el ejercicio de la estación 1 (16.7). */
  var LAMINAS = ['Organización', 'Protocolos y supervisión', 'Condiciones de trabajo', 'Equipo y comunicación', 'Acto inseguro', 'Barrera que funcionó'];
  var INCIDENTE = '<b>05:40.</b> Paro cardíaco en un domicilio. La tripulación está en la hora 22 de un turno de 24 horas y recibe el apoyo de una segunda unidad cuyo paramédico trabaja con ellos por primera vez. El líder dirige y a la vez ventila. En plena reanimación dice: “que alguien ponga la adrenalina”. La compañera y el paramédico de apoyo la administran casi al mismo tiempo; nadie confirma en voz alta ni anota la hora. El paciente recibe 2 mg en lugar de 1 mg. El error se detecta al contar las ampollas vacías antes de la transferencia y se informa al equipo receptor.';
  var HECHOS = [
    { t: 'Turnos de 24 horas', ok: [0], p: 'Decisión de la organización que permanece latente hasta alinearse con un fallo activo.' },
    { t: 'Unidades con monitores y dotaciones distintas entre sí', ok: [0], p: 'Condición latente de diseño: dispositivos distintos entre unidades agrandan los agujeros.' },
    { t: 'El protocolo de paro no exige asignar roles al inicio ni un responsable único de fármacos', ok: [1], p: 'Falta de estructura en el protocolo.' },
    { t: 'El registro no tiene un campo para la hora de cada fármaco', ok: [1], p: 'Una herramienta de registro que no fuerza el dato.' },
    { t: 'Madrugada, hora 22 del turno', ok: [2], p: 'El cansancio agranda los agujeros de todas las láminas.' },
    { t: 'Un paramédico de apoyo que trabaja con el equipo por primera vez', ok: [2, 3], p: 'Un equipo poco familiar es una condición que favorece el error y afecta a la comunicación.' },
    { t: 'Orden al aire: “que alguien ponga la adrenalina”', ok: [3], p: 'Sin destinatario, nadie la asume o la asumen dos personas.' },
    { t: 'Nadie confirmó en voz alta la administración ni su hora', ok: [3], p: 'No se cerró el bucle de comunicación.' },
    { t: 'El líder ventila y dirige a la vez', ok: [3], p: 'Liderazgo: un líder que ejecuta procedimientos pierde la visión global.' },
    { t: 'Dos personas administran la adrenalina casi al mismo tiempo', ok: [4], p: 'Es el fallo activo, el último agujero antes del daño.' },
    { t: 'El conteo de ampollas vacías antes de la transferencia detectó la dosis doble', ok: [5], p: 'Aprender también de lo que sale bien: esta barrera conviene reforzarla.' }
  ];
  var FUERZA = ['Eliminar', 'Forzar', 'Simplificar y estandarizar', 'Verificar', 'Recordar y entrenar'];
  var MEDIDAS = [
    { t: 'Registro que no permite anotar una segunda dosis de adrenalina sin mostrar la hora de la anterior', ok: 1 },
    { t: 'Un único responsable de fármacos asignado al inicio de cada paro, con tarjeta de roles', ok: 2 },
    { t: 'Quien administra repite la orden y confirma en voz alta la hora de administración', ok: 3 },
    { t: 'Taller de comunicación en crisis para todo el personal', ok: 4 },
    { t: 'El mismo modelo de monitor y la misma dotación en todas las unidades', ok: 2 }
  ];
  var CULTURA = ['Error humano', 'Conducta de riesgo', 'Conducta temeraria'];
  var CONDUCTAS = [
    { t: 'Quienes administraron la segunda dosis tras una orden al aire, en la hora 22 del turno', ok: 0, p: 'Error humano involuntario favorecido por el sistema: apoyo y mejoras del sistema.' },
    { t: 'Un paramédico que omite de forma habitual la confirmación en voz alta “porque nunca pasa nada”', ok: 1, p: 'Atajo normalizado: entrenamiento y eliminar los incentivos al atajo.' },
    { t: 'Un paramédico que trabajó bajo los efectos del alcohol', ok: 2, p: 'Desprecio consciente de un riesgo sustancial: la única que justifica sanción, además de apoyo.' }
  ];

  function laboratorioQueso(el, api) {
    var h = api.h;
    var p1 = 0, p2 = 0, p3 = 0;
    function selector(opciones, etiqueta) {
      return h('select', { 'aria-label': etiqueta, style: 'width:100%;margin-top:6px' },
        h('option', { value: '' }, 'Elija…'), opciones.map(function (x, k) { return h('option', { value: k }, x); }));
    }
    function paso1() {
      el.innerHTML = '';
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Cronología del incidente</span>' + INCIDENTE }));
      el.appendChild(h('div', { class: 'enunciado' }, 'Paso 1 de 3. Asigne cada hecho a su lámina del queso suizo.'));
      var filas = api.barajar(HECHOS).map(function (x) {
        var s = selector(LAMINAS, 'Lámina');
        var caja = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, x.t), s);
        el.appendChild(caja);
        return { x: x, s: s, caja: caja };
      });
      var aviso = h('span', { class: 'pregunta-n' }), zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (filas.some(function (f) { return f.s.value === ''; })) { aviso.textContent = 'Asigne todos los hechos.'; return; }
        bt.disabled = true; aviso.textContent = '';
        var bien = 0, agujeros = LAMINAS.map(function () { return 0; });
        filas.forEach(function (f) {
          var v = +f.s.value, ok = f.x.ok.indexOf(v) >= 0;
          if (ok) bien++;
          agujeros[f.x.ok[0]]++;
          f.s.disabled = true;
          f.caja.classList.add(ok ? 'bien' : 'mal');
          f.caja.appendChild(h('div', { class: 'porque', html: (ok ? '' : '<b>' + f.x.ok.map(function (k) { return LAMINAS[k]; }).join(' o ') + '.</b> ') + f.x.p }));
        });
        p1 = bien / filas.length;
        zona.appendChild(dibujoQueso(agujeros));
        zona.appendChild(h('div', { class: 'fb ' + (p1 >= 0.8 ? 'bien' : 'info'), html: '<b>' + bien + ' de ' + filas.length + ' hechos bien ubicados.</b> Ninguna condición causa el error por sí sola: cada una agranda los agujeros hasta que se alinean. Buscar solo al culpable del acto inseguro dejaría intactas las otras láminas.' }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: paso2 }, 'Paso 2: medidas')));
      } }, 'Corregir y ver el queso');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    function dibujoQueso(agujeros) {
      /* Cinco láminas con sus agujeros alineados hasta el daño; la barrera que funcionó se dibuja como un muro. */
      var W = 340, H = 150, n = 5, sw = 44, gap = (W - 40 - n * sw) / (n - 1);
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Modelo del queso suizo con los agujeros de cada lámina" style="max-width:520px;display:block;margin:10px auto">';
      for (var i = 0; i < n; i++) {
        var x = 10 + i * (sw + gap);
        svg += '<rect x="' + x + '" y="18" width="' + sw + '" height="104" rx="8" fill="#E9C46A" stroke="#B08A2E"/>';
        for (var k = 0; k < agujeros[i]; k++) svg += '<circle cx="' + (x + sw / 2) + '" cy="' + (38 + k * 22) + '" r="7" style="fill:var(--panel)" stroke="#B08A2E"/>';
        svg += '<text x="' + (x + sw / 2) + '" y="138" font-size="9" text-anchor="middle" fill="currentColor">' + ['Organiz.', 'Protoc.', 'Condic.', 'Equipo', 'Acto'][i] + '</text>';
      }
      svg += '<line x1="4" y1="38" x2="' + (W - 34) + '" y2="38" stroke="#B3151B" stroke-width="2.5" stroke-dasharray="5 4"/>';
      svg += '<rect x="' + (W - 30) + '" y="30" width="10" height="70" fill="#1E7A46"/>';
      svg += '<text x="' + (W - 25) + '" y="14" font-size="9" text-anchor="middle" fill="#1E7A46">Barrera</text>';
      svg += '</svg>';
      return h('div', { html: svg, style: 'color:var(--texto)' });
    }
    function paso2() {
      el.innerHTML = '';
      el.appendChild(h('div', { class: 'enunciado' }, 'Paso 2 de 3. ¿Qué fuerza tiene cada medida propuesta?'));
      el.appendChild(h('div', { class: 'pregunta-n' }, 'De más fuerte a más débil: eliminar, forzar, simplificar y estandarizar, verificar, recordar y entrenar.'));
      var filas = MEDIDAS.map(function (m) {
        var s = selector(FUERZA, 'Nivel de fuerza');
        var caja = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, m.t), s);
        el.appendChild(caja);
        return { m: m, s: s, caja: caja };
      });
      var aviso = h('span', { class: 'pregunta-n' }), zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (filas.some(function (f) { return f.s.value === ''; })) { aviso.textContent = 'Clasifique todas las medidas.'; return; }
        bt.disabled = true; aviso.textContent = '';
        var bien = 0;
        filas.forEach(function (f) {
          var ok = +f.s.value === f.m.ok; if (ok) bien++;
          f.s.disabled = true; f.caja.classList.add(ok ? 'bien' : 'mal');
          if (!ok) f.caja.appendChild(h('div', { class: 'porque', html: '<b>' + FUERZA[f.m.ok] + '.</b>' }));
        });
        p2 = bien / filas.length;
        var ord = MEDIDAS.slice().sort(function (a, b) { return a.ok - b.ok; });
        zona.appendChild(h('div', { class: 'fb ' + (p2 >= 0.8 ? 'bien' : 'info') },
          h('b', null, bien + ' de ' + filas.length + '. Plan de acción ordenado por fuerza:'),
          h('ol', null, ord.map(function (m) { return h('li', null, m.t + ' (' + FUERZA[m.ok].toLowerCase() + ')'); })),
          h('div', null, 'Las medidas de la parte baja son necesarias, pero fallan justo cuando el cansancio y el estrés son mayores. Un análisis que solo concluye con “recordar” o “capacitar” no ha terminado su trabajo. Cada acción lleva responsable y plazo.')));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: paso3 }, 'Paso 3: cultura justa')));
      } }, 'Corregir');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    function paso3() {
      el.innerHTML = '';
      el.appendChild(h('div', { class: 'enunciado' }, 'Paso 3 de 3. ¿Cómo responde una cultura justa a cada conducta?'));
      var filas = CONDUCTAS.map(function (c) {
        var s = selector(CULTURA, 'Tipo de conducta');
        var caja = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, c.t), s);
        el.appendChild(caja);
        return { c: c, s: s, caja: caja };
      });
      var aviso = h('span', { class: 'pregunta-n' });
      var bt = h('button', { class: 'btn', onclick: function () {
        if (filas.some(function (f) { return f.s.value === ''; })) { aviso.textContent = 'Clasifique las tres conductas.'; return; }
        bt.disabled = true; aviso.textContent = '';
        var bien = 0;
        filas.forEach(function (f) {
          var ok = +f.s.value === f.c.ok; if (ok) bien++;
          f.s.disabled = true; f.caja.classList.add(ok ? 'bien' : 'mal');
          f.caja.appendChild(h('div', { class: 'porque', html: (ok ? '' : '<b>' + CULTURA[f.c.ok] + '.</b> ') + f.c.p }));
        });
        p3 = bien / filas.length;
        el.appendChild(h('div', { class: 'fb info', html: 'Cierre del análisis: se devuelve el resultado a quien notificó, se mide si las acciones funcionaron y se ofrece apoyo entre pares a los implicados, que pueden vivirlo como segundas víctimas.' }));
        var nota = (p1 * 11 + p2 * 5 + p3 * 3) / 19;
        api.fin(nota, 'Láminas ' + Math.round(p1 * 100) + ' % · fuerza de las medidas ' + Math.round(p2 * 100) + ' % · cultura justa ' + Math.round(p3 * 100) + ' %', true);
      } }, 'Corregir y cerrar el análisis');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
    }
    paso1();
  }

  TDC.registrar({
    numero: 16, parte: 'V',
    titulo: 'Factores humanos, trabajo en equipo y gestión del error en la ambulancia',
    mision: 'Analice incidentes con el queso suizo, comunique en bucle cerrado y gestione el error con cultura justa.',
    objetivo: 'Analizar los incidentes desde una perspectiva sistémica, aplicar herramientas de comunicación del equipo y de transferencia, y gestionar el error con criterios de cultura justa.',
    escena: 'Madrugada, poca luz, ruido y una tripulación de dos en la hora 20 del turno. Los humanos se equivocan de forma previsible: su trabajo no es prometer que no fallará, sino <b>poner barreras</b> que atrapen el error antes de que llegue al paciente, y responder bien cuando llega.',
    actividades: [
      {
        tipo: 'caso', titulo: 'La convulsión, la jeringa y el decimal',
        presentacion: '<b>03:10.</b> Niño de 3 años y unos 15 kg con una crisis tónico-clónica de 12 minutos. La tripulación está en la hora 20 de un turno de 24 horas. La luz del dormitorio es escasa y la madre grita pidiendo ayuda. La dotación lleva midazolam en ampollas de <b>1 mg/mL</b> y también de <b>5 mg/mL</b>.',
        fases: [
          {
            titulo: 'La decisión clínica',
            monitor: { Crisis: '12 min', Peso: '≈ 15 kg' },
            decision: { tipo: 'opcion', pregunta: 'Midazolam intramuscular a 0,2 mg/kg. ¿Qué dosis indica?',
              opciones: ['1,5 mg', '3 mg', '15 mg', '0,3 mg'],
              correcta: 1,
              explicacion: '0,2 × 15 = 3 mg. La vía intramuscular es una buena elección: en el ámbito prehospitalario fue al menos tan eficaz como el lorazepam intravenoso para detener el estado epiléptico.' }
          },
          {
            titulo: 'De la decisión a la jeringa',
            datos: 'Usted dirige. Su compañero va a cargar.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo da la orden?',
              opciones: ['“3 mg, son 3 mL.”', '“Carga el midazolam para la convulsión.”', '“Midazolam 3 mg, de la ampolla de 5 mg/mL: 0,6 mL.” Y espera que la repita', '“Midazolam 0,6 mL, rápido.”'],
              correcta: 2,
              porOpcion: { 0: 'Solo es correcta con la ampolla de 1 mg/mL, y no la nombra.', 3: 'Sin la dosis ni la concentración, el receptor no puede verificar nada.' },
              explicacion: 'Toda orden de un fármaco de alto riesgo nombra la dosis, la concentración y el volumen, y el receptor la repite antes de cargar.' },
            experto: '“Midazolam 3 mg, de la ampolla de 5 mg/mL: 0,6 mL.” “Repito: 3 mg, 0,6 mL de la ampolla de 5 mg/mL.”'
          },
          {
            titulo: 'Lo que ocurrió en realidad',
            datos: 'En el caso real, el líder dijo: “3 mg, son 3 mL”, pensando en la ampolla de 1 mg/mL. Su compañero cargó 3 mL de la ampolla de <b>5 mg/mL</b> sin repetir la orden.',
            decision: { tipo: 'opcion', pregunta: '¿Qué dosis recibió el niño?',
              opciones: ['3 mg', '0,6 mg', '15 mg', '9 mg'],
              correcta: 2,
              explicacion: '3 mL × 5 mg/mL = 15 mg: cinco veces la dosis prevista. La dosis se decide en miligramos, pero se administra en mililitros.' }
          },
          {
            titulo: 'Diez minutos después',
            monitor: { Resp: 'apnea', SpO2: '70 %' },
            datos: 'La crisis cedió. Ahora el niño no respira.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace?',
              opciones: ['Flumazenil para revertir la benzodiacepina', 'Ventilar con bolsa y mascarilla, sin flumazenil, y trasladar con preaviso', 'Oxígeno con mascarilla con reservorio y observar', 'Estimular al niño y esperar a que respire'],
              correcta: 1,
              porOpcion: { 0: 'El flumazenil puede desencadenar nuevas crisis.' },
              explicacion: 'Apnea tras una dosis alta: se ventila. Se trasladó con ventilación asistida, requirió 2 horas de ventilación mecánica y se recuperó sin secuelas.' },
            experto: '“Apnea tras una dosis alta: ventilar; no flumazenil.”'
          },
          {
            titulo: 'La transferencia',
            decision: { tipo: 'opcion', pregunta: '¿Incluye el error en la transferencia?',
              opciones: ['No: se notifica después por el canal interno', 'Sí: dosis real, hora y efecto, porque el equipo receptor lo necesita para tratar', 'Solo si el médico receptor pregunta por la dosis', 'Solo en el informe escrito, no en voz alta'],
              correcta: 1,
              explicacion: '“Recibió por error 15 mg de midazolam intramuscular en lugar de 3 mg, a las 03:25. A los 10 minutos hizo apnea con SpO2 de 70 %; ahora ventilado con bolsa, SpO2 96 %. No se dio flumazenil.”' }
          },
          {
            titulo: 'La madre pregunta qué pasó',
            decision: { tipo: 'opcion', pregunta: '¿Qué le dice?',
              opciones: ['“Es una reacción que a veces da el medicamento; ya pasó.”', '“Mi compañero cargó mal la dosis, pero yo di bien la orden.”', '“Le dimos una dosis mayor de la indicada; por eso dejó de respirar. Lo sentimos. Revisaremos qué falló y les contaremos.”', '“Le aseguro que no tendrá ninguna secuela.”'],
              correcta: 2,
              explicacion: 'Reconocer, disculparse, explicar lo que se sabe y lo que se hará, y comprometerse a evitar que se repita. Sin minimizar, sin culpar a un compañero y sin prometer lo que no depende del equipo.' },
            experto: '“Le contamos a la madre lo que pasó y notificamos.”'
          },
          {
            titulo: 'Análisis bajo cultura justa',
            decision: { tipo: 'opcion', pregunta: '¿Cómo se clasifica lo ocurrido?',
              opciones: ['Conducta temeraria: sanción al que cargó la dosis', 'Conducta de riesgo: reentrenar en cálculo de dosis', 'Error humano favorecido por el sistema: apoyo, notificación y cambios del sistema'],
              correcta: 2, parcial: [1],
              explicacion: 'Dos concentraciones en la dotación, sin tabla de volúmenes, sin doble verificación, madrugada y cansancio. El paramédico que cargó la dosis recibió apoyo entre pares como segunda víctima.' },
            experto: '“Esto le puede pasar a cualquiera en la hora 20.”'
          },
          {
            titulo: 'La barrera más fuerte',
            decision: { tipo: 'opcion', pregunta: '¿Qué cambio habría detenido el error aunque ambos estuvieran cansados?',
              opciones: ['Un curso de cálculo de dosis', 'Doble verificación obligatoria', 'Una sola concentración de midazolam en la dotación', 'Carteles de advertencia en la ambulancia'],
              correcta: 2, parcial: [1],
              explicacion: 'Eliminar hace imposible el error de conversión. Las medidas que dependen de la atención fallan justo cuando la fatiga y el estrés son máximos.' }
          }
        ],
        cierre: 'La dosis se decide en miligramos, pero se administra en mililitros. El error no estuvo en la decisión clínica, sino en el paso de la decisión a la jeringa. Toda orden de un fármaco de alto riesgo nombra la dosis, la concentración y el volumen, y el receptor la repite antes de cargar.'
      },
      {
        tipo: 'personalizado', titulo: 'Laboratorio del queso suizo', render: laboratorioQueso,
        instrucciones: 'Analice un incidente como en una revisión sin culpables: ubique cada hecho en su lámina, clasifique la fuerza de las medidas propuestas y aplique los criterios de cultura justa.'
      },
      {
        tipo: 'numero', titulo: 'De miligramos a mililitros',
        instrucciones: 'Midazolam intramuscular a 0,2 mg/kg. Volumen = dosis en mg / concentración en mg/mL. Use coma o punto decimal.',
        problemas: [
          { enunciado: 'Niño de 15 kg. ¿Dosis de midazolam en mg?', respuesta: 3, tolerancia: 0.01, unidad: 'mg', solucion: '0,2 × 15 = 3 mg.' },
          { enunciado: 'Esa dosis con la ampolla de <b>5 mg/mL</b>. ¿Volumen?', respuesta: 0.6, tolerancia: 0.01, decimales: 1, unidad: 'mL', solucion: '3 / 5 = 0,6 mL.' },
          { enunciado: 'La misma dosis con la ampolla de <b>1 mg/mL</b>. ¿Volumen?', respuesta: 3, tolerancia: 0.01, unidad: 'mL', solucion: '3 / 1 = 3 mL. El mismo número de mililitros significa cosas muy distintas según la ampolla.' },
          { enunciado: 'Se cargan 3 mL de la ampolla de 5 mg/mL. ¿Cuántos mg recibe el niño?', respuesta: 15, tolerancia: 0.01, unidad: 'mg', solucion: '3 × 5 = 15 mg, cinco veces la dosis prevista.' },
          { enunciado: 'Niño de 10 kg, ampolla de 5 mg/mL. ¿Volumen?', respuesta: 0.4, tolerancia: 0.01, decimales: 1, unidad: 'mL', solucion: '0,2 × 10 = 2 mg; 2 / 5 = 0,4 mL.' },
          { enunciado: 'En un servicio, 125 de 360 administraciones de fármacos a niños tuvieron un error de dosis. ¿Qué porcentaje?', respuesta: 34.7, tolerancia: 0.1, decimales: 1, unidad: '%', solucion: '125 / 360 = 34,7 %. La adrenalina fue el fármaco con más errores.' },
          { enunciado: 'En la transferencia del ciclista: FC 116 lpm y PA 110/70 mmHg. ¿Índice de shock? (Al llegar era 104/118 = 0,88.)', respuesta: 1.05, tolerancia: 0.02, decimales: 2, solucion: '116 / 110 = 1,05. En ascenso: se transmite la tendencia, no solo el último valor.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: 'Tipos de error según Reason',
        instrucciones: 'Clasifique cada error. Desliz: fallo de atención en la ejecución. Lapsus: omisión por fallo de memoria. Reglas: regla correcta en la situación equivocada. Conocimiento: situación nueva sin conocimiento suficiente. Violación: desviación deliberada.',
        categorias: ['Desliz', 'Lapsus', 'Reglas', 'Conocimiento', 'Violación'],
        items: [
          { texto: 'Tomar la ampolla equivocada entre dos parecidas', cat: 0, porque: 'La acción ejecutada no es la planificada.' },
          { texto: 'No repetir la glucemia después de administrar dextrosa', cat: 1, porque: 'Omisión por un fallo de memoria.' },
          { texto: 'Aplicar el protocolo de infarto a una disección aórtica', cat: 2, porque: 'Regla correcta, situación equivocada (capítulo 15).' },
          { texto: 'No reconocer un síndrome neuroléptico maligno', cat: 3, porque: 'Razonar en una situación nueva con conocimiento insuficiente.' },
          { texto: 'Omitir la doble verificación “porque hay prisa”', cat: 4, porque: 'Desviación deliberada de una norma.' },
          { texto: 'Cargar 3 mL de la ampolla de 5 mg/mL creyendo tomar la de 1 mg/mL', cat: 0, porque: 'Desliz de carga: la dosis correcta en mg se tradujo mal a mL.' },
          { texto: 'Aplicar la regla de no traslado del TCE leve a una anciana anticoagulada', cat: 2, porque: 'La regla excluía a los anticoagulados (capítulo 6).' },
          { texto: 'No hacer la doble verificación porque “nunca pasa nada”', cat: 4, porque: 'En cultura justa, una conducta de riesgo normalizada: entrenamiento y eliminar el atractivo del atajo.' },
          { texto: 'Olvidar reevaluar al paciente después de un tratamiento, por atender a otra tarea', cat: 1, porque: 'Omisión por fallo de memoria.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Transferencia IMIST-AMBO en 60 segundos',
        instrucciones: 'Ordene los fragmentos de la transferencia del ciclista según IMIST-AMBO.',
        pasos: [
          'I: Juan, 19 años',
          'M: ciclista contra un poste a unos 35 km/h, con impacto del manillar en el hipocondrio izquierdo',
          'I: dolor en el hipocondrio y en el hombro izquierdos, sin otras lesiones visibles',
          'S: FC de 104 al llegar y ahora de 116; PA de 118/76 y ahora de 110/70; índice de shock en ascenso; Glasgow 15',
          'T: dos accesos venosos, ácido tranexámico 1 g a las 10:58 y analgesia',
          'A: sin alergias conocidas',
          'M: sin medicación habitual',
          'B: sano',
          'O: su madre viene en camino. Sospechamos una lesión esplénica con shock compensado; no se hizo ecografía'
        ],
        explicacion: 'Tres reglas completan el protocolo: pausa de manos quietas (el equipo receptor escucha antes de mover al paciente), separar hallazgos de interpretaciones y declarar lo que no se verificó.'
      },
      {
        tipo: 'quiz', titulo: 'Equipo, comunicación y cultura justa',
        preguntas: [
          { p: 'Ordene por su fuerza estas medidas tras el error de midazolam: (a) curso de cálculo de dosis; (b) retirar una de las dos concentraciones; (c) doble verificación obligatoria; (d) tabla de volúmenes por peso.', opciones: ['a, c, d, b', 'b, d, c, a', 'c, b, a, d', 'd, b, c, a'], correcta: 1, barajar: false, explicacion: 'Eliminar, simplificar y estandarizar, verificar, entrenar. Solo la primera hace imposible repetir exactamente el mismo error.' },
          { p: 'El paramédico B omite de forma habitual la doble verificación. Según la cultura justa, ¿qué corresponde?', opciones: ['Sanción disciplinaria', 'Entrenamiento y revisar por qué el atajo se normalizó', 'Nada, si nunca causó daño', 'Apoyo como segunda víctima'], correcta: 1, explicacion: 'Es una conducta de riesgo: no percibe el peligro de un atajo normalizado. La sanción queda para la conducta temeraria.' },
          { p: '¿Cuál es el orden correcto de la asertividad graduada para detener una fibrinólisis ante una sospecha de disección?', opciones: ['Declarar la emergencia, desafiar, alertar, sondear', 'Alertar, sondear, declarar la emergencia, desafiar', 'Sondear, alertar, desafiar, declarar la emergencia', 'Desafiar, sondear, alertar, declarar la emergencia'], correcta: 2, barajar: false, explicacion: 'De “¿revisamos los pulsos en ambos brazos?” a “esto es un problema de seguridad: detén la fibrinólisis”. Sin respuesta tras dos intentos, se llama a la dirección médica.' },
          { p: 'En un paro, el líder dice: “que alguien ponga la adrenalina”. ¿Qué riesgo hay?', opciones: ['Ninguno si el equipo es experimentado', 'Que nadie la asuma o la asuman dos, con omisión o dosis doble', 'Solo un retraso de segundos', 'Que se administre por la vía equivocada'], correcta: 1, explicacion: 'La orden eficaz nombra a la persona, el fármaco, la dosis y la vía, y se cierra con la confirmación y la hora.' },
          { p: 'Su compañero alerta: “No veo onda de capnografía”. ¿Cómo responde el líder?', opciones: ['“Ya lo sé.”', '“Gracias, lo verificamos ahora”, y lo verifica', '“Después lo revisamos.”', '“Confía en mí, el tubo está bien.”'], correcta: 1, explicacion: 'Nunca “ya lo sé” sin verificar: si hablar tiene costo, el equipo dejará de hacerlo.' },
          { p: '¿Qué hace el equipo receptor durante una transferencia IMIST-AMBO?', opciones: ['Mueve al paciente mientras escucha para ganar tiempo', 'Pregunta a medida que surgen dudas', 'Escucha sin mover al paciente, pregunta al final y repite los datos críticos', 'Cada miembro hace sus propias preguntas a la vez'], correcta: 2, explicacion: 'Pausa de manos quietas. Si hay varias personas, una dirige la recepción y el resto escucha.' },
          { p: '¿Cómo debe ser el apoyo a la segunda víctima?', opciones: ['Inmediato, confidencial, entre pares y no ligado a la investigación', 'Ofrecido cuando termine la investigación', 'A cargo del supervisor que investiga el caso', 'Opcional y solo si el profesional lo pide por escrito'], correcta: 0, explicacion: 'Entre 10,4 y 43,3 % de los profesionales refirió haber sido segunda víctima en los estudios revisados.' },
          { p: 'En el modelo de Reason, ¿qué son las condiciones latentes?', opciones: ['Los actos inseguros de quien atiende al paciente', 'Errores que el paciente no percibe', 'Decisiones de diseño, organización y gestión que permanecen ocultas hasta alinearse con un fallo activo', 'Las violaciones deliberadas de la norma'], correcta: 2, explicacion: 'Los fallos activos ocurren en contacto con el paciente; las condiciones latentes agrandan los agujeros de cada lámina.' },
          { p: 'Al evaluar una simulación, un observador anota: “resume la situación en voz alta y anticipa”. ¿Qué habilidad no técnica describe?', opciones: ['Liderazgo', 'Conciencia situacional', 'Manejo del estrés', 'Trabajo en equipo'], correcta: 1, explicacion: 'Se observan conductas, no rasgos de personalidad. La conducta deficiente sería fijarse en una tarea y sorprenderse ante lo previsible.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Jerarquía de fuerza de las medidas', reverso: 'Eliminar > forzar > simplificar y estandarizar > verificar > recordar y entrenar.' },
          { frente: 'Orden en bucle cerrado', reverso: 'Orden específica a una persona, repetición del receptor y confirmación de la ejecución con la hora.' },
          { frente: 'Asertividad graduada', reverso: 'Sondear, alertar, desafiar y declarar una emergencia, en ese orden.' },
          { frente: 'Palabras de alarma', reverso: '“Estoy preocupado.” “Estoy incómodo.” “Esto es un problema de seguridad.” La tercera detiene la acción.' },
          { frente: 'Regla de los dos desafíos', reverso: 'Una preocupación expresada dos veces sin respuesta se escala o detiene la acción.' },
          { frente: 'IMIST-AMBO', reverso: 'Identificación · Mecanismo o motivo · Lesiones · Signos vitales y tendencia · Tratamiento y respuesta · Alergias · Medicación · Antecedentes · Otros.' },
          { frente: 'Cultura justa: tres conductas', reverso: 'Error humano: apoyo y sistema. Conducta de riesgo: entrenamiento y quitar incentivos al atajo. Conducta temeraria: sanción.' },
          { frente: 'Comunicar un error', reverso: 'Reconocer lo ocurrido, disculparse, explicar lo que se sabe y lo que se hará, comprometerse a evitar que se repita.' },
          { frente: 'Analizar un incidente en seis pasos', reverso: 'Cronología sin juicios · fallos activos · condiciones latentes por lámina · barreras que funcionaron y faltaron · acciones por fuerza con responsable y plazo · devolver y medir.' },
          { frente: 'Errores de dosis en pediatría prehospitalaria', reverso: '34,7 % de las administraciones (125 de 360); la adrenalina, el fármaco con más errores.' }
        ]
      }
    ]
  });
})();
