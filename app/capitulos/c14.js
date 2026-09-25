/* Capítulo 14. Metacognición y calibración */
(function () {

  /* Viñetas del juego de calibración. Todas salen de casos del manual (capítulos 1 a 14),
     salvo la del síncope reflejo, construida como contraste de un caso en que la confianza alta sí se justifica. */
  var VINETAS = [
    { t: 'Varón de unos 50 años acostado en una parada de autobús, con olor a alcohol y una lata de cerveza al lado. Glasgow 9, diaforesis profusa, piel fría y pálida. FC 112 lpm, PA 152/88 mmHg, SpO2 96 %. Aún no se midió la glucemia.',
      op: ['Intoxicación etílica', 'Hipoglucemia', 'Ictus'], ok: 1,
      final: 'Hipoglucemia de 32 mg/dL en un diabético tratado con insulina.',
      leccion: 'La diaforesis y la piel fría no encajan con la embriaguez. Alteración de la conciencia: glucemia capilar siempre (capítulos 1 y 15).' },
    { t: 'Varón de 78 años, caída en su domicilio sin lesiones. La hija dice que “está raro desde ayer” y no quiso almorzar. FR contada durante un minuto: 28 rpm. SpO2 94 %, FC 98 lpm, temperatura 37,6 °C, algo lento.',
      op: ['Caída mecánica sin lesiones', 'Neumonía con sepsis y delirium', 'Progresión de su demencia'], ok: 1,
      final: 'Neumonía del lóbulo inferior derecho con lactato de 4,1 mmol/L y delirium.',
      leccion: 'La FR contada y el cambio agudo del estado mental pesan más que el “se ve bien” (capítulo 2).' },
    { t: 'Mujer de 34 años, despacho “crisis de ansiedad”. Hormigueo en manos y labios, dolor leve en el costado derecho al inspirar. Toma anticonceptivos orales y lleva una bota ortopédica por una fractura de peroné de hace tres semanas. FR 30 rpm, SpO2 88 % al aire, FC 122 lpm.',
      op: ['Crisis de ansiedad con hiperventilación', 'Tromboembolismo pulmonar', 'Neumonía'], ok: 1,
      final: 'Tromboembolismo pulmonar.',
      leccion: 'La hiperventilación de la ansiedad no produce hipoxemia: la SpO2 de 88 % invalida el patrón (capítulo 7).' },
    { t: 'Varón de 67 años, hipertenso y fumador. Dolor lumbar izquierdo súbito e intenso irradiado a la ingle, con vómitos. Se desmayó un momento al levantarse. PA 108/70 mmHg (su habitual ronda 150/90), pálido y sudoroso.',
      op: ['Cólico renal', 'Aneurisma de aorta abdominal roto', 'Pielonefritis'], ok: 1,
      final: 'Aneurisma de aorta abdominal de 7 cm con rotura retroperitoneal.',
      leccion: 'Dolor en el flanco después de los 60 años con síncope y PA baja para su basal: descartar aneurisma (capítulos 8 y 15).' },
    { t: 'Madrugada fría. Madre de 38 años con cefalea, náuseas y un desvanecimiento en el baño; sus dos hijos también tienen cefalea y el menor está somnoliento. El padre mejoró al salir a comprar pan. Ventanas cerradas y calentador de agua a gas dentro del baño. SpO2 de 98 a 99 % en todos.',
      op: ['Gastroenteritis viral familiar', 'Intoxicación por monóxido de carbono', 'Migraña'], ok: 1,
      final: 'Intoxicación por monóxido de carbono.',
      leccion: 'Varios afectados en el mismo lugar: tóxico ambiental hasta demostrar lo contrario. La SpO2 normal no lo descarta (capítulo 11).' },
    { t: 'Taxista de 61 años, hipertenso y diabético. Vértigo continuo desde hace una hora; no puede mantenerse sentado sin apoyo. Nistagmo que bate hacia el lado al que mira. BE-FAST sin asimetría facial ni deriva del brazo, habla normal. Glucemia 138 mg/dL.',
      op: ['Vértigo periférico', 'Ictus de circulación posterior', 'Hipoglucemia'], ok: 1,
      final: 'Ictus de circulación posterior.',
      leccion: 'La ataxia troncal y el nistagmo que cambia de dirección indican un origen central aunque el BE-FAST sea negativo (capítulo 12).' },
    { t: 'Ciclista de 19 años que choca contra un poste; el manillar le golpea el hipocondrio izquierdo. Dolor en el costado y en el hombro izquierdos, pálido. FC 104 lpm, PA 118/76 mmHg, relleno capilar de 3 segundos.',
      op: ['Contusión de la pared abdominal', 'Lesión esplénica con shock compensado', 'Fractura costal aislada'], ok: 1,
      final: 'Lesión esplénica que requirió esplenectomía y seis unidades de concentrado de hematíes.',
      leccion: 'Una PA normal no descarta el shock: taquicardia, palidez y relleno lento ya lo anunciaban (capítulo 4).' },
    { t: 'Varón de 22 años que se desmaya de pie durante una ceremonia al sol, después de náuseas, calor y visión en túnel. Recuperación completa en segundos. No hizo esfuerzo, no tiene antecedentes familiares de muerte súbita y el ECG es normal.',
      op: ['Síncope vasovagal', 'Síncope arrítmico por miocardiopatía', 'Crisis epiléptica'], ok: 0,
      final: 'Síncope reflejo (vasovagal).',
      leccion: 'Aquí los pródromos típicos estaban presentes y no había datos de alto riesgo: la confianza alta estaba justificada. Calibrarse también es confiar cuando la evidencia lo sostiene.' },
    { t: 'Hombre de 28 años con esquizofrenia, agitado, sujetado por la policía. Hace cinco días le aumentaron el antipsicótico. Temperatura 39,8 °C, FC 132 lpm, rigidez “en tubo de plomo”, sudoración profusa y mutismo.',
      op: ['Descompensación psicótica', 'Síndrome neuroléptico maligno', 'Intoxicación alcohólica'], ok: 1,
      final: 'Síndrome neuroléptico maligno (creatina quinasa de 38.000 U/L).',
      leccion: 'Toda agitación grave es un delirium con posible causa médica hasta que se demuestre lo contrario (capítulo 9).' },
    { t: 'Paciente con diagnóstico de trabajo de crisis asmática. Tras dos nebulizaciones de salbutamol, a los 20 minutos mantiene el mismo trabajo respiratorio y tiene el murmullo abolido en el hemitórax derecho.',
      op: ['Crisis asmática grave', 'Neumotórax', 'Anafilaxia'], ok: 1,
      final: 'Neumotórax.',
      leccion: 'La falta de respuesta al tratamiento era la señal: obliga a revisar el diagnóstico (capítulos 11 y 14).' },
    { t: 'Mujer de 82 años que toma apixabán; resbaló y se golpeó la región occipital. Glasgow 15, cefalea leve, hematoma de 3 cm, exploración neurológica normal. Dice: “estoy bien, no quiero ir al hospital”.',
      op: ['TCE leve sin riesgo relevante', 'TCE con riesgo de hemorragia intracraneal', 'Síncope cardíaco'], ok: 1,
      final: 'Hematoma subdural agudo diagnosticado seis horas después.',
      leccion: 'La regla de no traslado excluía a los anticoagulados y la edad ya era criterio de alto riesgo (capítulo 6).' },
    { t: 'Varón de 70 años con fiebre y tos productiva desde hace tres días. FR 26 rpm contada, crepitantes en la base derecha, PA 96/60 mmHg, confuso.',
      op: ['Neumonía con sepsis', 'Insuficiencia cardíaca descompensada', 'Tromboembolismo pulmonar'], ok: 0,
      final: 'Neumonía con sepsis.',
      leccion: 'Cuando los datos convergen, la confianza alta es correcta. Lo que penaliza no es la seguridad, sino la seguridad en los errores.' }
  ];

  function juegoCalibracion(el, api) {
    var h = api.h, F = api.fmt;
    var N = 10, casos = api.barajar(VINETAS).slice(0, N), i = 0, reg = [];

    function vineta() {
      el.innerHTML = '';
      if (i >= N) return resultado();
      var v = casos[i], elegido = null, conf = 70;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Viñeta ' + (i + 1) + ' de ' + N + ' · el diagnóstico final se revela al terminar'));
      el.appendChild(h('div', { class: 'datos' }, v.t));
      el.appendChild(h('div', { class: 'enunciado' }, 'Su diagnóstico de trabajo:'));
      var orden = api.barajar(v.op.map(function (_, k) { return k; }));
      var bots = [];
      orden.forEach(function (k) {
        var b = h('button', { class: 'opcion', onclick: function () {
          elegido = k;
          bots.forEach(function (x) { x.b.classList.toggle('sel', x.k === k); });
          bt.disabled = false;
        } }, v.op[k]);
        bots.push({ b: b, k: k });
        el.appendChild(b);
      });
      var val = h('b', null, conf + ' %');
      var r = h('input', { type: 'range', min: 50, max: 100, step: 10, value: conf, 'aria-label': 'Confianza declarada', oninput: function () { conf = +r.value; val.textContent = conf + ' %'; } });
      el.appendChild(h('div', { class: 'fila', style: 'margin-top:12px' }, h('span', null, '¿Qué tan seguro está?'), val));
      el.appendChild(r);
      el.appendChild(h('div', { class: 'pregunta-n' }, '50 % = no lo sé, es una moneda al aire · 100 % = apostaría mi sueldo'));
      var bt = h('button', { class: 'btn', disabled: true, onclick: function () {
        reg.push({ v: v, elegido: elegido, p: conf / 100, ok: elegido === v.ok });
        i++; vineta();
      } }, 'Registrar y seguir');
      el.appendChild(h('div', { class: 'acciones' }, bt));
    }

    function barra(txt, p, color) {
      return h('div', { style: 'margin:3px 0' },
        h('div', { class: 'pregunta-n' }, txt + ': ' + Math.round(p * 100) + ' %'),
        h('div', { style: 'height:10px;border-radius:5px;background:var(--linea);overflow:hidden' },
          h('div', { style: 'height:100%;width:' + Math.round(p * 100) + '%;background:' + color })));
    }

    function resultado() {
      el.innerHTML = '';
      var brier = 0, aciertos = 0;
      reg.forEach(function (r) { var o = r.ok ? 1 : 0; brier += (r.p - o) * (r.p - o); aciertos += o; });
      brier /= reg.length;

      el.appendChild(h('h3', { style: 'margin:4px 0' }, 'Su registro de calibración'));
      var filas = reg.map(function (r, k) {
        return h('tr', null,
          h('td', null, (k + 1) + '. ' + r.v.op[r.elegido]),
          h('td', null, Math.round(r.p * 100) + ' %'),
          h('td', null, r.v.op[r.v.ok]),
          h('td', { style: 'font-weight:700;color:' + (r.ok ? 'var(--verde)' : 'var(--rojo)') }, r.ok ? 'Sí' : 'No'));
      });
      el.appendChild(h('div', { class: 'tabla-scroll' }, h('table', { class: 't', style: 'font-size:13.5px' },
        h('thead', null, h('tr', null, h('th', null, 'Su diagnóstico'), h('th', null, 'Conf.'), h('th', null, 'Final'), h('th', null, 'Acierto'))),
        h('tbody', null, filas))));

      /* Curva de calibración por tramos de confianza */
      var tramos = [{ t: '50 a 60 %', a: 0.5, b: 0.6 }, { t: '70 a 80 %', a: 0.7, b: 0.8 }, { t: '90 a 100 %', a: 0.9, b: 1 }];
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:14px' }, 'Confianza declarada frente a exactitud real'));
      var hayExceso = false;
      tramos.forEach(function (tr) {
        var g = reg.filter(function (r) { return r.p >= tr.a - 0.001 && r.p <= tr.b + 0.001; });
        if (!g.length) return;
        var confMedia = g.reduce(function (s, r) { return s + r.p; }, 0) / g.length;
        var exac = g.filter(function (r) { return r.ok; }).length / g.length;
        var dif = confMedia - exac, lectura;
        if (dif > 0.1) { lectura = 'Exceso de confianza'; hayExceso = true; }
        else if (dif < -0.1) lectura = 'Falta de confianza';
        else lectura = 'Bien calibrado';
        el.appendChild(h('div', { class: 'caja' },
          h('b', null, 'Tramo ' + tr.t + ' · ' + g.length + (g.length === 1 ? ' caso' : ' casos') + ' · ' + lectura),
          barra('Confianza media', confMedia, 'var(--ambar-borde)'),
          barra('Exactitud real', exac, dif > 0.1 ? 'var(--rojo)' : 'var(--verde)')));
      });

      el.appendChild(h('div', null,
        h('span', { class: 'cifra' }, h('small', null, 'Aciertos'), aciertos + ' de ' + reg.length),
        h('span', { class: 'cifra' }, h('small', null, 'Puntuación de Brier'), F(brier, 2)),
        h('span', { class: 'cifra' }, h('small', null, 'Referencia: declarar siempre 50 %'), '0,25')));

      var msj;
      if (brier <= 0.1) msj = '<b>Buena calibración.</b> Su confianza acompañó a la evidencia: alta donde los datos convergían y más baja donde había datos discordantes.';
      else if (brier < 0.25) msj = '<b>Calibración aceptable, con margen.</b> Revise abajo los errores cometidos con confianza alta: son los que más penalizan.';
      else msj = '<b>Peor que declarar siempre 50 %.</b> La confianza puesta en los errores le está penalizando. Aplique las cuatro preguntas antes de declarar una certeza alta.';
      el.appendChild(h('div', { class: 'fb ' + (brier <= 0.1 ? 'bien' : brier < 0.25 ? 'info' : 'mal'), html: msj + (hayExceso ? ' En al menos un tramo su confianza superó su exactitud en más de 10 puntos: exceso de confianza.' : '') }));

      var caros = reg.filter(function (r) { return !r.ok && r.p >= 0.8; });
      var dudas = reg.filter(function (r) { return r.ok && r.p <= 0.6; });
      if (caros.length) {
        el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Errores con confianza de 80 % o más (los que más penalizan)'));
        caros.forEach(function (r) {
          el.appendChild(h('div', { class: 'fb mal', html: '<b>' + r.v.op[r.elegido] + ' al ' + Math.round(r.p * 100) + ' %.</b> Final: ' + r.v.final + ' Aporte a Brier: ' + F((r.p) * (r.p), 2) + '. ' + r.v.leccion }));
        });
      }
      reg.filter(function (r) { return !r.ok && r.p < 0.8; }).forEach(function (r) {
        el.appendChild(h('div', { class: 'fb info', html: '<b>' + r.v.op[r.elegido] + ' al ' + Math.round(r.p * 100) + ' %.</b> Final: ' + r.v.final + ' ' + r.v.leccion }));
      });
      if (dudas.length) el.appendChild(h('div', { class: 'fb info', html: '<b>Aciertos con 60 % o menos:</b> ' + dudas.length + '. Dudar de lo que se sabe también descalibra, aunque penaliza menos que la seguridad en el error.' }));
      el.appendChild(h('div', { class: 'pregunta-n', style: 'margin-top:8px' }, 'Después de 30 a 40 registros reales, este mismo análisis muestra en qué tipo de casos se concentra su descalibración.'));

      /* Nota: Brier 0,15 o menos = 100 %; 0,20 = 80 %; 0,25 (moneda al aire) = 60 %; 0,40 o más = 0 %. */
      var nota = Math.max(0, Math.min(1, (0.40 - brier) / 0.25));
      api.fin(nota, 'Puntuación de Brier ' + F(brier, 2) + ' con ' + aciertos + ' de ' + reg.length + ' aciertos. Se aprueba con Brier de 0,20 o menos.', true);
    }
    vineta();
  }

  TDC.registrar({
    numero: 14, parte: 'V',
    titulo: 'Metacognición y calibración',
    mision: 'Declare su confianza, mida su calibración y ponga a prueba la certeza antes de decidir.',
    objetivo: 'Monitorizar el propio grado de certeza, detectar la desconexión entre confianza y exactitud, y usar la reflexión estructurada y la retroalimentación para calibrarse.',
    escena: 'Usted entrega al paciente y rara vez vuelve a saber de él. Nadie le dice si su diagnóstico de trabajo fue correcto, y su sensación de certeza no le avisa cuando el caso es difícil. Aquí va a <b>declarar su confianza</b>, compararla con el desenlace y aprender a detenerse justo cuando se siente más seguro.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Juego de calibración', render: juegoCalibracion,
        instrucciones: 'Diez viñetas breves con el diagnóstico final oculto. Elija su diagnóstico de trabajo y declare su confianza entre 50 y 100 %. Al final verá su registro, su curva de calibración y su puntuación de Brier (cuanto más baja, mejor).'
      },
      {
        tipo: 'caso', titulo: 'El desmayo del futbolista',
        presentacion: '<b>17:15.</b> Partido de fútbol juvenil. Un jugador de 16 años se desploma durante un pique a mitad del segundo tiempo. Pierde el conocimiento unos 20 segundos y se recupera por completo. El entrenador y los padres piden “que lo revisen nomás”: quieren evitar el hospital.',
        fases: [
          {
            titulo: 'Primera impresión',
            monitor: { FC: '88 lpm', PA: '118/72', SpO2: '99 %', Glucemia: '96 mg/dL', 'T°': '37,4 °C' },
            datos: 'Consciente, orientado, sin dolor. Día caluroso. Sin trauma craneal ni mordedura de lengua. Su conclusión inmediata: <b>síncope vasovagal por calor y deshidratación</b>, con una confianza de 90 %. Empieza a preparar el alta en el lugar.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace con esa certeza de 90 %?',
              opciones: ['Firmo el no traslado: los signos vitales son normales', 'Hago una pausa metacognitiva antes de firmar el no traslado', 'Lo traslado sin más análisis, por si acaso'],
              correcta: 1, parcial: [2],
              porOpcion: { 0: 'Los signos vitales normales no evalúan la causa del síncope.', 2: 'Trasladar es prudente, pero sin analizar no sabrá a dónde ni con qué urgencia.' },
              explicacion: 'Un no traslado es una decisión irreversible. Cuanto más alta es la certeza en una decisión así, más necesaria es la pausa que la ponga a prueba.' },
            experto: '“Joven, sano, día caluroso: vasovagal. Estoy muy seguro, y eso es justamente lo que debo revisar antes de un no traslado.”'
          },
          {
            titulo: 'Las cuatro preguntas: ¿qué no encaja?',
            datos: 'Repase la historia: se desplomó <b>durante</b> el pique. No refiere náuseas, sensación de calor ni visión en túnel antes de caer.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que <b>no encajan</b> con un síncope vasovagal.',
              opciones: ['El síncope ocurrió durante el esfuerzo, no después', 'El día es caluroso', 'Se recuperó por completo', 'Faltan los pródromos típicos: náuseas, calor, visión en túnel', 'Temperatura de 37,4 °C', 'Glucemia de 96 mg/dL'],
              correctas: [0, 3],
              explicacion: 'El síncope de esfuerzo es de alto riesgo aunque el paciente se vea bien. Lo esperado y ausente, los pródromos, también es un dato en contra.' },
            experto: '“Se desmayó durante el pique, no después.”'
          },
          {
            titulo: '¿Qué dato me haría cambiar de opinión?',
            datos: 'Lo peor que podría ser: una causa cardíaca de muerte súbita.',
            decision: { tipo: 'opcion', pregunta: '¿Qué busca ahora?',
              opciones: ['Repetir la PA de pie para buscar ortostatismo', 'Preguntar por antecedentes familiares de muerte súbita y hacer un ECG de 12 derivaciones', 'Dar líquidos orales y reevaluar a los 15 minutos'],
              correcta: 1,
              explicacion: 'La pregunta útil nombra el dato concreto que cambiaría la decisión: un ECG anormal o un familiar con muerte súbita a edad joven.' },
            experto: '“Un ECG anormal o un familiar con muerte súbita me harían cambiar de opinión.”'
          },
          {
            titulo: 'Los datos que cambian la decisión',
            datos: 'La madre recuerda que un tío del joven “murió dormido” a los 35 años. El ECG de 12 derivaciones muestra <b>voltajes de hipertrofia ventricular izquierda con ondas T profundamente negativas</b> en derivaciones laterales.',
            decision: { tipo: 'opcion', pregunta: '¿Qué decide?',
              opciones: ['No traslado con cita ambulatoria de cardiología esta semana', 'Traslado al hospital más cercano; si allí el ECG es normal, puede volver a jugar', 'Traslado a un hospital con cardiología, sin actividad física hasta la evaluación especializada, y explicación a la familia'],
              correcta: 2,
              explicacion: 'Síncope de esfuerzo, antecedente familiar de muerte súbita joven y ECG sugestivo de miocardiopatía: las guías europeas lo consideran de alto riesgo.' },
            experto: '“ECG con hipertrofia y ondas T negativas, y un tío que murió dormido: causa cardíaca.” La ecocardiografía confirmó una miocardiopatía hipertrófica.'
          },
          {
            titulo: 'Análisis de la calibración',
            datos: 'Su confianza inicial fue de 90 % y el diagnóstico era incorrecto.',
            decision: { tipo: 'opcion', pregunta: '¿En qué descansaba esa confianza?',
              opciones: ['En los signos vitales normales, que descartan con fuerza una causa cardíaca', 'En un único prototipo y en la presión por no trasladar, antes de reunir la evidencia', 'En la edad: a los 16 años una causa cardíaca es excepcional y se puede ignorar'],
              correcta: 1,
              explicacion: 'El dato de mayor peso, el síncope durante el ejercicio, estaba disponible desde el principio y no se ponderó. La confianza se formó antes de reunir la evidencia.' }
          },
          {
            titulo: 'El registro personal',
            datos: 'Usted anota el caso en su registro de calibración: <i>Síncope vasovagal · 90 % · Miocardiopatía hipertrófica · No</i>.',
            decision: { tipo: 'opcion', pregunta: '¿Qué lección escribe en la última columna?',
              opciones: ['El síncope de esfuerzo pesa más que el calor', 'Trasladar siempre a los deportistas', 'No hacer caso a los padres'],
              correcta: 0,
              explicacion: 'La lección útil nombra el dato que debió pesar más. Así el registro enseña en qué tipo de casos se concentra la propia descalibración.' }
          }
        ],
        cierre: 'La confianza es un dato sobre el clínico, no sobre el paciente. Cuanto más alta es la certeza en una decisión irreversible, como un no traslado, más necesaria es la pausa que la ponga a prueba. La muerte súbita en deportistas jóvenes es infrecuente, pero el síncope de esfuerzo es con frecuencia su única advertencia.'
      },
      {
        tipo: 'numero', titulo: 'Medir la calibración',
        instrucciones: 'Use coma o punto decimal. Para Brier, escriba el resultado con dos decimales.',
        problemas: [
          { enunciado: 'En su registro, de 40 casos en que dijo estar 90 % seguro, acertó en 28. ¿Cuál es su exactitud real en ese tramo?', respuesta: 70, tolerancia: 0.5, unidad: '%', solucion: '28/40 = 70 %. Confianza de 90 % con exactitud de 70 %: exceso de confianza.' },
          { enunciado: 'De 20 casos en que declaró 50 %, acertó en 14. ¿Exactitud real?', respuesta: 70, tolerancia: 0.5, unidad: '%', solucion: '14/20 = 70 %. Aquí duda de lo que sabe: falta de confianza.' },
          { enunciado: 'Un solo caso: declaró 90 % de confianza y se equivocó. ¿Cuánto aporta a la puntuación de Brier?', respuesta: 0.81, tolerancia: 0.005, decimales: 2, solucion: '(0,9 − 0)² = 0,81. Un error seguro penaliza mucho.' },
          { enunciado: 'Tres casos: 90 % y acierto, 90 % y error, 60 % y acierto. ¿Puntuación de Brier?', respuesta: 0.33, tolerancia: 0.01, decimales: 2, solucion: '(0,01 + 0,81 + 0,16)/3 = 0,33. Peor que declarar siempre 50 % (0,25).' },
          { enunciado: 'Cuatro decisiones: 80 % y acierto, 80 % y acierto, 80 % y error, 50 % y acierto. ¿Puntuación de Brier?', respuesta: 0.24, tolerancia: 0.01, decimales: 2, solucion: '(0,04 + 0,04 + 0,64 + 0,25)/4 = 0,24. Apenas mejor que 0,25: el error con 80 % es el que más penaliza.' },
          { enunciado: '¿Qué puntuación de Brier obtiene quien declara siempre 50 %, acierte o no?', respuesta: 0.25, tolerancia: 0.005, decimales: 2, solucion: '(0,5)² = 0,25 en cada caso. Es la referencia: una puntuación peor indica que la confianza en los errores penaliza.' },
          { enunciado: 'En el estudio de Meyer et al., la exactitud fue de 55,3 % en casos fáciles y de 5,8 % en difíciles. ¿Cuántos puntos porcentuales cayó?', respuesta: 49.5, tolerancia: 0.2, decimales: 1, unidad: 'puntos', solucion: '55,3 − 5,8 = 49,5 puntos. La confianza, en cambio, solo bajó de 7,2 a 6,4 sobre 10.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Monitorizar o controlar?',
        instrucciones: 'La monitorización evalúa el estado del propio razonamiento; el control actúa sobre ese estado. Clasifique cada conducta.',
        categorias: ['Monitorización', 'Control'],
        items: [
          { texto: 'Advertir: “estoy dando por hecho que es ansiedad y no he explicado la SpO2 de 88 %”', cat: 0, porque: 'Es darse cuenta de un hueco en el propio razonamiento.' },
          { texto: 'Reformular el diagnóstico de trabajo y buscar un tromboembolismo', cat: 1, porque: 'Actúa sobre la advertencia: cambia de estrategia.' },
          { texto: 'Notar: “estoy 90 % seguro, y eso es justamente lo que debo revisar”', cat: 0, porque: 'Evalúa el propio grado de certeza.' },
          { texto: 'Preguntar a la madre por antecedentes familiares de muerte súbita', cat: 1, porque: 'Buscar un dato es una acción de control.' },
          { texto: 'Reconocer que el paciente no responde al tratamiento como se esperaba', cat: 0, porque: 'Detecta que algo no encaja con el diagnóstico de trabajo.' },
          { texto: 'Pedir a la compañera que cuente la FR durante un minuto completo', cat: 1, porque: 'Busca el dato que falta.' },
          { texto: 'Darse cuenta de que no sabe cuánto tiempo estuvo inconsciente el paciente', cat: 0, porque: 'Identifica qué no sabe.' },
          { texto: 'Detenerse antes de firmar un no traslado y aplicar las cuatro preguntas', cat: 1, porque: 'Detenerse es una forma de control.' },
          { texto: 'Llamar a la dirección médica ante una duda que no logra resolver', cat: 1, porque: 'Pedir ayuda es control. Sin control, la monitorización queda en una duda que no cambia nada.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Reflexión estructurada en 60 a 90 segundos',
        instrucciones: 'Ordene los seis pasos de la versión prehospitalaria de la reflexión estructurada.',
        pasos: [
          '¿Cuál es el diagnóstico que me vino a la mente?',
          '¿Qué datos lo apoyan?',
          '¿Qué datos lo contradicen?',
          '¿Qué datos esperaría encontrar si fuera cierto y no están?',
          '¿Qué alternativa explicaría mejor los datos? Repetir los pasos 2 a 4 con ella',
          '¿Qué ordenamiento final hago, y con qué probabilidad para cada hipótesis?'
        ],
        explicacion: 'Úsela en los casos que activan un disparador, en los complejos y en las decisiones irreversibles. En un caso rutinario añade tiempo sin mejorar la exactitud.'
      },
      {
        tipo: 'quiz', titulo: 'Confianza, exactitud y retroalimentación',
        preguntas: [
          { p: 'En su registro, de 40 casos en que dijo estar 90 % seguro acertó en 28. ¿Qué hace?', opciones: ['Nada: 70 % de acierto es un resultado aceptable', 'Declarar siempre 50 % para no equivocarse', 'Pedir más pruebas en todos los casos', 'Reflexión estructurada cuando su certeza supere 80 % en decisiones de alto riesgo'], correcta: 3, explicacion: 'Exactitud de 70 % frente a confianza de 90 %: exceso de confianza. Se corrige con reflexión dirigida y revisando en qué tipo de casos se concentran los errores.' },
          { p: 'En el estudio de Meyer et al., la exactitud cayó a 5,8 % en los casos difíciles, pero la confianza apenas bajó. ¿Qué implica para la escena?', opciones: ['La dificultad se detecta con criterios objetivos, no con la sensación de certeza', 'Los casos difíciles deben dejarse para el hospital', 'La confianza de los médicos es más fiable que la de otros', 'Una confianza baja es una alarma suficiente'], correcta: 0, explicacion: 'Datos discordantes, presentación atípica o falta de respuesta al tratamiento son los avisos. Ante los casos difíciles, además, no pidieron más ayuda.' },
          { p: 'En pacientes fallecidos en cuidados intensivos, los errores graves confirmados por autopsia fueron 8,7 % con certeza completa y 10,5 % con más incertidumbre. ¿Qué enseña?', opciones: ['Que la certeza completa reduce los errores a la mitad', 'Que la incertidumbre causa más errores graves', 'Que declarar certeza completa no protegía del error', 'Que la autopsia es poco fiable para medir errores'], correcta: 2, explicacion: 'La frecuencia de errores fue prácticamente la misma: la certeza declarada no era un indicador de acierto.' },
          { p: 'En 13 de 20 comparaciones, la autoevaluación de los médicos tuvo poca, ninguna o una relación inversa con su competencia. ¿Qué pregunta conviene hacerse?', opciones: ['¿Lo hice bien?', '¿Qué dato externo me diría si lo hice bien?', '¿Me sentí seguro durante la atención?', '¿Mi compañero quedó conforme?'], correcta: 1, explicacion: 'El conocimiento que falta para hacer bien una tarea es el mismo que falta para juzgarla. Hacen falta referencias externas: diagnóstico final, revisión por pares, indicadores.' },
          { p: 'Su puntuación de Brier en cuatro decisiones es 0,24. ¿Cómo la interpreta?', opciones: ['Excelente: está muy por debajo de 1', 'Mala: debería estar por encima de 0,5', 'Apenas mejor que declarar siempre 50 %', 'No se interpreta sin el diagnóstico final'], correcta: 2, explicacion: 'La referencia es 0,25. Un error con 80 % de confianza aporta 0,64 por sí solo: la seguridad en los errores penaliza más que la duda en los aciertos.' },
          { p: 'Un compañero aceptó la negativa de traslado de una anciana anticoagulada con un golpe en la cabeza, sin explicarle el riesgo. ¿Qué le dice?', opciones: ['“Eso fue una negligencia y no puede volver a pasar.”', '“Tranquilo, todos lo hemos hecho alguna vez.”', '“Vi que no le explicaste el riesgo; me preocupó porque toma apixabán. ¿Qué pensabas en ese momento?”', '“La próxima vez trasládala aunque no quiera.”'], correcta: 2, explicacion: 'Observación concreta más pregunta genuina: evita juzgar a la persona y descubre el razonamiento, que es lo que hay que corregir.' },
          { p: '¿Cuándo tiene más efecto la auditoría con retroalimentación?', opciones: ['Cuando es frecuente, la da un colega respetado e incluye metas y un plan', 'Cuando es anual, anónima y sin nombres', 'Cuando la entrega un sistema automático sin comentarios', 'Cuando solo informa de los errores graves'], correcta: 0, explicacion: 'Su efecto medio es pequeño pero importante: una mediana de 4,3 puntos porcentuales de mejora en la conducta deseada.' },
          { p: 'Registrar su diagnóstico de trabajo <b>antes</b> de recibir información del hospital corrige sobre todo…', opciones: ['El exceso de confianza en la escena', 'El cierre prematuro', 'La anulación disracional', 'El sesgo retrospectivo en la autoevaluación'], correcta: 3, explicacion: 'Es el compromiso previo: sin él, la retrospectiva hace creer que el acierto era previsible.' },
          { p: 'Al diseñar la retroalimentación de desenlaces de su servicio, ¿qué casos prioriza?', opciones: ['Los traslados sin incidencias', 'Infratriajes, no traslados con reconsulta y diagnósticos omitidos', 'Los de mayor tiempo de atención', 'Solo los pacientes fallecidos'], correcta: 1, explicacion: 'Se prioriza lo que más enseña, con protección de datos y revisión sin culpables centrada en el razonamiento.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Clínico bien calibrado', reverso: 'Su confianza coincide con su tasa de acierto: si dice 70 % en muchos casos, acierta en unos 70 %.' },
          { frente: 'Puntuación de Brier', reverso: 'Promedio de (confianza − resultado)², con resultado 1 si acertó y 0 si no. Cuanto más baja, mejor. Declarar siempre 50 % da 0,25.' },
          { frente: 'Las cuatro preguntas', reverso: '¿Qué más podría ser? ¿Qué no encaja? ¿Qué es lo peor que podría ser? ¿Qué dato me haría cambiar de opinión?' },
          { frente: 'Meyer et al. (118 médicos)', reverso: 'Exactitud 55,3 % en casos fáciles y 5,8 % en difíciles; confianza 7,2 frente a 6,4 sobre 10. No pidieron más ayuda.' },
          { frente: 'Tres tipos de conocimiento metacognitivo (Flavell)', reverso: 'Sobre la persona, sobre la tarea y sobre las estrategias. Se construyen revisando los propios casos.' },
          { frente: 'Prueba de la apuesta', reverso: '“¿Apostaría mi sueldo a este diagnóstico?” Corrige el exceso de confianza.' },
          { frente: 'Retroalimentación a un colega', reverso: 'Observación concreta + pregunta genuina: “Vi que…; me preocupó porque…; ¿qué estabas pensando en ese momento?”' },
          { frente: 'Cuatro componentes de un sistema de retroalimentación', reverso: 'Seguimiento de desenlaces con los hospitales · revisión de casos sin culpables · registro personal con confianza declarada · indicadores del servicio a cada profesional.' },
          { frente: 'Cuándo aplicar la reflexión estructurada', reverso: 'Con un disparador, en casos complejos y en decisiones irreversibles. No en los rutinarios.' }
        ]
      }
    ]
  });
})();
