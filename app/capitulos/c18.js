/* Capítulo 18. Principios transversales de la atención prehospitalaria */
(function () {
  var HABILIDADES = ['Comunicar una elección y mantenerla', 'Comprender la información relevante', 'Apreciar la situación y sus consecuencias para sí', 'Razonar comparando las opciones'];
  var CONDUCTAS = [
    'Respetar la decisión: su capacidad basta para una decisión de este riesgo',
    'Resolver el motivo práctico y, si mantiene la negativa, negativa informada',
    'Tratar la causa corregible en su mejor interés y evaluar de nuevo la capacidad',
    'Decidir con su representante y el plan de cuidados ya acordado',
    'Actuar en su mejor interés y registrar por qué no hubo consentimiento'
  ];

  /* Pacientes del evaluador de capacidad. ok[k] = true si la habilidad k está conservada. */
  var PACIENTES = [
    {
      titulo: 'El diabético que no quiere ir',
      situacion: 'Hombre de 55 años con diabetes, confuso y sudoroso. Glucemia capilar de 38 mg/dL. Dice que no quiere ir a ningún hospital.',
      decision: 'rechazar el traslado', riesgo: 'alto',
      preguntas: ['«¿Qué quiere que hagamos?»', '«¿Qué le acabamos de explicar sobre su azúcar?»', '«¿Qué cree que le puede pasar si se queda en casa?»', '«¿Por qué prefiere quedarse?»'],
      respuestas: ['«No voy… bueno, llévenme… no, déjenme aquí.»', '«¿Qué azúcar? Yo no tomé nada.»', '«Nada, yo estoy perfecto.»', 'Se distrae, cambia de tema y no compara opciones.'],
      ok: [false, false, false, false], conducta: 2,
      exp: 'La causa que compromete la capacidad, la hipoglucemia, es corregible. No se acepta la negativa mientras persista: se trata en su mejor interés y, corregida la glucemia, se evalúa de nuevo la capacidad antes de discutir el traslado.',
      registro: ['Decisión evaluada: rechazo del traslado (riesgo alto). Glucemia 38 mg/dL, confuso.', 'Comunicar: no mantiene una elección. Comprender: no repite la información.', 'Apreciar: niega el problema. Razonar: no compara opciones.', 'Sin capacidad por causa corregible: se trata la hipoglucemia en su mejor interés.', 'Tras corregir: nueva evaluación de la capacidad antes de decidir el traslado. Horas de cada paso.']
    },
    {
      titulo: 'El cuidador con dolor torácico',
      situacion: 'Hombre de 60 años con dolor torácico, lúcido. Rechaza el traslado porque es el único cuidador de su esposa, que tiene demencia.',
      decision: 'rechazar el traslado', riesgo: 'alto',
      preguntas: ['«¿Qué ha decidido?»', '«¿Puede decirme con sus palabras lo que le explicamos?»', '«¿Cree que eso le puede pasar a usted?»', '«¿Qué pesa más para usted en esta decisión?»'],
      respuestas: ['«No voy a ir. Lo he pensado y no voy.»', '«Que puede ser el corazón y que podría empeorar, hasta morirme.»', '«Sí, sé que me puede pasar a mí. Tengo miedo.»', '«Si me voy, mi esposa se queda sola y no sabe ni tomar sus pastillas. Prefiero arriesgarme.»'],
      ok: [true, true, true, true], conducta: 1,
      exp: 'Tiene capacidad. La autonomía obliga a respetar su decisión; la beneficencia, a insistir con información clara; la no maleficencia impide presionarlo con miedo o engaño. Conseguir quién cuide a la esposa elimina el motivo del rechazo. Si aun así se niega, negativa informada con dirección médica (anexo E).',
      registro: ['Decisión evaluada: rechazo del traslado (riesgo alto) por dolor torácico.', 'Comunicar, comprender, apreciar y razonar: conservadas; repite el riesgo con sus palabras.', 'Motivo del rechazo: es el único cuidador de su esposa con demencia.', 'Solución acordada: familiar que queda con la esposa; riesgo explicado en frecuencias naturales.', 'Resultado: acepta o negativa informada con firma o testigo y plan de seguridad. Hora de salida.']
    },
    {
      titulo: 'Miedo a las agujas',
      situacion: 'Mujer de 45 años con migraña conocida, dos juegos de signos vitales normales y exploración neurológica normal. Acepta el traslado, pero rechaza la vía venosa: «me dan pánico las agujas».',
      decision: 'rechazar la vía venosa', riesgo: 'bajo',
      preguntas: ['«¿Qué prefiere que hagamos?»', '«¿Para qué le propusimos la vía?»', '«¿Qué pasa si el dolor aumenta en el camino?»', '«¿Por qué prefiere no ponerla?»'],
      respuestas: ['«Al hospital sí voy, pero sin agujas.»', '«Para ponerme medicina por la vena si me duele más.»', '«Si me duele más, lo aguanto hasta llegar, o se la pido.»', '«Prefiero aguantar un poco a que me pinchen aquí en la ambulancia.»'],
      ok: [true, true, true, true], conducta: 0,
      exp: 'La capacidad es específica de cada decisión: rechazar una vía en una situación de bajo riesgo exige menos que rechazar el traslado con un infarto en curso. Se respeta y se registra; si la situación cambia, se vuelve a proponer.',
      registro: ['Decisión evaluada: rechazo de la vía venosa (riesgo bajo). Acepta el traslado.', 'Comunicar, comprender, apreciar y razonar: conservadas.', 'Motivo: miedo a las agujas.', 'Se respeta la decisión; se le explica que puede pedir la vía si el dolor aumenta.', 'Signos vitales y exploración neurológica normales en dos controles. Horas.']
    },
    {
      titulo: 'Fractura de cadera en cuidados paliativos',
      situacion: 'Hombre de 94 años con demencia avanzada y fractura de cadera. Tiene un plan de cuidados paliativos acordado con su familia y su médico tratante. Su hija, representante legal, está presente.',
      decision: 'intensidad del tratamiento y destino', riesgo: 'alto',
      preguntas: ['«¿Qué quiere que hagamos?»', '«¿Me puede repetir lo que le expliqué?»', '«¿Sabe qué le pasó en la pierna?»', '«¿Prefiere ir al hospital o quedarse en casa?»'],
      respuestas: ['Repite frases sin relación con la pregunta.', 'No recuerda ninguna parte de la explicación.', 'Pregunta por su madre; no reconoce la lesión.', 'Responde «sí» a ambas opciones.'],
      ok: [false, false, false, false], conducta: 3,
      exp: 'La evaluación clínica es idéntica a la de cualquier fractura de cadera; cambia el objetivo del cuidado. Analgesia y confort, y el destino y la intensidad del tratamiento se deciden con la familia y con su médico tratante.',
      registro: ['Decisión evaluada: intensidad del tratamiento y destino (riesgo alto).', 'Sin capacidad: no comunica una elección estable ni comprende, aprecia ni razona.', 'Representante legal presente: su hija. Plan de cuidados paliativos acordado previamente.', 'Plan acordado con la hija y el médico tratante: analgesia, confort y destino según ese plan.', 'Información entregada a la hija y hora de cada decisión.']
    },
    {
      titulo: 'Desconocido en la vía pública',
      situacion: 'Hombre de unos 30 años encontrado en la calle con respiración ruidosa y Glasgow de 7. Nadie lo acompaña ni lo conoce. Necesita atención inmediata de la vía aérea.',
      decision: 'aceptar la atención de emergencia', riesgo: 'alto',
      preguntas: ['«Señor, ¿me escucha? ¿Nos deja ayudarlo?»', '«Vamos a atenderlo, ¿me entiende?»', '«¿Sabe dónde está?»', '«¿Quiere que lo llevemos al hospital?»'],
      respuestas: ['No responde a la voz.', 'Sin respuesta verbal.', 'Sin respuesta verbal.', 'Sin respuesta; solo retira la mano ante el estímulo doloroso.'],
      ok: [false, false, false, false], conducta: 4,
      exp: 'Emergencia vital, sin capacidad y sin representante disponible: se actúa en su mejor interés y se registra por qué no fue posible obtener el consentimiento.',
      registro: ['Decisión: atención de emergencia con consentimiento imposible de obtener.', 'Sin capacidad: Glasgow 7, sin respuesta verbal.', 'Sin acompañantes ni representante localizable.', 'Se actúa en su mejor interés: atención de la vía aérea y traslado.', 'Motivo por el que no se obtuvo el consentimiento y horas de cada intervención.']
    }
  ];

  function evaluador(el, api) {
    var h = api.h, F = api.fmt;
    var lista = api.barajar(PACIENTES), i = 0, puntos = 0, max = 0;
    function mostrar() {
      el.innerHTML = '';
      if (i >= lista.length) {
        var nota = puntos / max;
        return api.fin(nota, F(puntos, puntos % 1 ? 1 : 0) + ' de ' + max + ' puntos: habilidades bien valoradas y conducta elegida en ' + lista.length + ' pacientes', true);
      }
      var P = lista[i], marca = {}, conducta = null, corregido = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Paciente ' + (i + 1) + ' de ' + lista.length));
      el.appendChild(h('h3', { style: 'margin:4px 0' }, P.titulo));
      el.appendChild(h('div', { class: 'caja escena', style: 'margin:8px 0', html: P.situacion }));
      el.appendChild(h('div', { class: 'fila', style: 'gap:6px' },
        h('span', { class: 'cifra' }, h('small', null, 'Decisión en juego'), P.decision),
        h('span', { class: 'cifra' }, h('small', null, 'Riesgo de la decisión'), P.riesgo)));
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, '1. Valore cada habilidad según la respuesta'));
      var filas = HABILIDADES.map(function (hab, k) {
        var bots = ['Conservada', 'Comprometida'].map(function (t, v) {
          return h('button', { onclick: function () {
            if (corregido) return;
            marca[k] = v === 0;
            bots.forEach(function (b, bi) { b.classList.toggle('sel', bi === v); });
          } }, t);
        });
        var f = h('div', { class: 'item-clas' },
          h('div', { class: 'txt' }, (k + 1) + '. ' + hab),
          h('div', { style: 'font-size:14.5px;margin-bottom:6px' }, h('span', { class: 'pregunta-n' }, 'Pregunta: '), P.preguntas[k], h('br'), h('span', { class: 'pregunta-n' }, 'Respuesta: '), h('i', null, P.respuestas[k])),
          h('div', { class: 'bots' }, bots));
        el.appendChild(f); return f;
      });
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, '2. Elija la conducta'));
      var bc = CONDUCTAS.map(function (c, k) {
        var b = h('button', { class: 'opcion', onclick: function () {
          if (corregido) return;
          conducta = k;
          bc.forEach(function (x, xi) { x.classList.toggle('sel', xi === k); });
        } }, c);
        el.appendChild(b); return b;
      });
      var aviso = h('span', { class: 'pregunta-n' });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (Object.keys(marca).length < 4 || conducta === null) { aviso.textContent = 'Valore las cuatro habilidades y elija una conducta.'; return; }
        corregido = true; bt.disabled = true; aviso.textContent = '';
        var p = 0;
        filas.forEach(function (f, k) {
          var ok = marca[k] === P.ok[k]; if (ok) p++;
          f.classList.add(ok ? 'bien' : 'mal');
          if (!ok) f.appendChild(h('div', { class: 'porque' }, h('b', null, 'Correcto: ' + (P.ok[k] ? 'conservada.' : 'comprometida.'))));
        });
        var okC = conducta === P.conducta;
        bc.forEach(function (b, k) { b.disabled = true; if (k === P.conducta) b.classList.add('bien'); else if (k === conducta) b.classList.add('mal'); });
        if (okC) p += 2;
        puntos += p; max += 6;
        zona.appendChild(h('div', { class: 'fb ' + (p === 6 ? 'bien' : p >= 4 ? 'info' : 'mal'), html: '<b>' + p + ' de 6 puntos.</b> ' + P.exp }));
        zona.appendChild(h('div', { class: 'fb info' }, h('b', null, 'Registro modelo en cinco líneas'), h('ol', { style: 'margin:6px 0 0;padding-left:20px' }, P.registro.map(function (r) { return h('li', null, r); }))));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; mostrar(); } }, i + 1 < lista.length ? 'Siguiente paciente' : 'Ver resultado')));
      } }, 'Corregir');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    mostrar();
  }

  TDC.registrar({
    numero: 18, parte: 'VI',
    titulo: 'Principios transversales de la atención prehospitalaria',
    mision: 'Evalúe la capacidad para decidir, aplique el estándar mínimo y resuelva conflictos éticos en la escena.',
    objetivo: 'Aplicar, en cada contacto con el paciente, los principios que no pertenecen a una sola fase de la atención: la atención centrada en la persona, el marco ético y legal, la evaluación de la capacidad, el estándar mínimo de evaluación, el reparto de roles y la revisión reflexiva del propio desempeño.',
    escena: 'Un paciente con un infarto en curso le dice que no irá al hospital. Otro, confuso, rechaza que lo toque. Antes de aceptar o rechazar una negativa, usted debe saber <b>si esa persona puede decidir</b>, qué evaluación mínima le debe a cualquier paciente y cómo repartir el trabajo con su compañero.',
    actividades: [
      {
        tipo: 'caso', titulo: 'El infarto que «se pasa con reposo»',
        presentacion: 'Hombre de 58 años con diabetes y dolor opresivo retroesternal desde hace 40 minutos. Está orientado y conversa con fluidez. Rechaza el traslado: «se me pasa con reposo; además, no puedo dejar sola a mi esposa», que tiene demencia.',
        fases: [
          {
            titulo: 'El electrocardiograma',
            monitor: { ECG: 'ST elevado V1 a V4', Dolor: '40 min' },
            decision: { pregunta: '¿Qué principios éticos entran en conflicto?',
              opciones: ['Justicia frente a no maleficencia', 'Autonomía frente a beneficencia', 'Beneficencia frente a no maleficencia'],
              correcta: 1, explicacion: 'Los principios rara vez chocan en la teoría; chocan cuando un paciente rechaza lo que el equipo considera necesario.' }
          },
          {
            titulo: 'Antes de responder a la negativa',
            decision: { pregunta: '¿Cuál es el paso siguiente?',
              opciones: ['Aceptar la negativa: está orientado y conversa', 'Evaluar su capacidad para esta decisión concreta', 'Trasladarlo igualmente, porque es un infarto'],
              correcta: 1, explicacion: 'Estar orientado no equivale a tener capacidad. Se evalúa en cuatro habilidades y es específica de cada decisión.' }
          },
          {
            titulo: 'Las cuatro habilidades',
            datos: 'Mantiene su decisión. Repite que el electrocardiograma «sale alterado». Sobre el riesgo dice: «se me pasa, a mí no me va a dar nada». Compara el riesgo con el cuidado de su esposa.',
            decision: { pregunta: '¿Qué habilidad parece comprometida?',
              opciones: ['Comunicar una elección', 'Comprender la información', 'Apreciar la situación para sí mismo', 'Razonar comparando opciones'],
              correcta: 2, explicacion: 'Comprende que el ECG está alterado, pero no aplica esa información a su propia situación: la apreciación parece comprometida.' },
            experto: '“Entiende el dato, pero no lo aplica a sí mismo. Y su razonamiento me revela que el motivo del rechazo es práctico, no clínico.”'
          },
          {
            titulo: 'El riesgo de la decisión',
            decision: { pregunta: '¿Alcanza su capacidad para rechazar el traslado?',
              opciones: ['Sí: tres de cuatro habilidades conservadas bastan', 'No: una decisión de riesgo alto exige una capacidad sólida', 'Sí, porque sería capaz de rechazar una vía venosa'],
              correcta: 1, explicacion: 'Cuanto mayor es el riesgo de la decisión, más sólida debe ser la capacidad que la sostiene. Una apreciación débil no la alcanza.' }
          },
          {
            titulo: 'El motivo real',
            decision: { pregunta: '¿Qué intervención tiene más probabilidad de resolver el conflicto?',
              opciones: ['Explicarle con insistencia que puede morir esta noche', 'Buscar quién cuide a su esposa: la hija llega en 15 minutos', 'Pedir a la policía que lo acompañe al hospital'],
              correcta: 1, explicacion: 'Intervención centrada en la persona: se elimina el motivo del rechazo. El riesgo se comunica en frecuencias naturales (capítulo 6), sin presionar con miedo.' },
            experto: '“La hija se queda con su madre. Ahora sí me escucha.”'
          },
          {
            titulo: 'Si hubiera mantenido la negativa',
            decision: { pregunta: 'Suponga que, con capacidad demostrada, mantiene la negativa. ¿Qué corresponde?',
              opciones: ['Retirarse sin más: es su derecho y no hay nada que registrar', 'Negativa informada con dirección médica, firma o testigo y plan de seguridad', 'Sedarlo y trasladarlo en su mejor interés'],
              correcta: 1, explicacion: 'Una negativa es válida con capacidad, información comprensible y sin coacción. Se registra y se deja un plan de seguridad: signos de alarma, cómo volver a llamar y quién lo acompaña (anexo E).' }
          },
          {
            titulo: 'El registro',
            decision: { tipo: 'multiple', pregunta: '¿Qué debe constar?',
              opciones: ['Evaluación de las cuatro habilidades', 'Información entregada', 'Solución acordada', 'Hora de salida', 'Opinión del equipo sobre el carácter del paciente'],
              correctas: [0, 1, 2, 3],
              explicacion: 'Se registran hechos y conductas, no juicios sobre la persona (capítulo 20).' }
          }
        ],
        cierre: 'Antes de aceptar o rechazar una negativa se evalúa la capacidad, y se evalúa para esa decisión y ese riesgo. Preguntar por qué rechaza revela muchas veces un motivo práctico que tiene solución.'
      },
      {
        tipo: 'personalizado', titulo: 'Evaluador de capacidad en la escena', render: evaluador,
        instrucciones: 'Cinco pacientes, en orden aleatorio. Lea la pregunta del paramédico y la respuesta de cada uno, valore las cuatro habilidades y elija la conducta. Al corregir verá el registro modelo en cinco líneas o menos.'
      },
      {
        tipo: 'clasificar', titulo: 'El estándar mínimo de evaluación',
        instrucciones: '¿Cuándo corresponde cada elemento? Ante la duda sobre la profundidad necesaria, la evaluación se amplía, no se acorta.',
        categorias: ['Siempre', 'Según la presentación', 'Antes de no trasladar'],
        items: [
          { texto: 'Capacidad y preferencias del paciente', cat: 0, porque: 'Condicionan todo el plan.' },
          { texto: 'Motivo de la llamada, en palabras del paciente', cat: 0, porque: 'La anamnesis sola orientó el diagnóstico final en 66 de 80 pacientes.' },
          { texto: 'Antecedentes, fármacos y alergias', cat: 0, porque: 'Siempre; abreviados en el crítico y completados en el ciclo siguiente.' },
          { texto: 'FR contada, pulso, PA, SpO2, temperatura y nivel de conciencia', cat: 0, porque: 'Siempre que el paciente lo permita: son la base de NEWS2.' },
          { texto: 'Glucemia capilar', cat: 1, porque: 'Alteración de la conciencia o de la conducta, déficit neurológico, convulsión o diabetes.' },
          { texto: 'ECG de 12 derivaciones', cat: 1, porque: 'Dolor torácico o epigástrico, disnea, síncope, palpitaciones, o malestar inespecífico en adultos mayores o diabéticos.' },
          { texto: 'Dos juegos completos de signos vitales separados en el tiempo', cat: 2, porque: 'La tendencia informa más que un valor aislado.' },
          { texto: 'Examen físico ampliado cuando se contempla dejar al paciente en casa', cat: 2, porque: 'Evita el cierre prematuro; también se amplía si la queja es vaga.' },
          { texto: 'Reevaluación tras cada intervención', cat: 0, porque: 'La respuesta al tratamiento es una prueba diagnóstica.' },
          { texto: 'Registro de lo que no pudo evaluarse y del motivo', cat: 0, porque: 'Siempre que ocurra: protege al paciente y al equipo.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿En qué momento de la atención?',
        instrucciones: 'Asigne cada herramienta al momento del ciclo de evaluación que la usa.',
        categorias: ['Preparar', 'Evaluar', 'Sintetizar', 'Actuar', 'Transferir', 'Aprender'],
        items: [
          { texto: 'Tratar la etiqueta del despacho como hipótesis ajena', cat: 0, porque: '¿Qué puede ser y qué puede engañarme? (anexo E).' },
          { texto: 'Probabilidad previa y autochequeo de sesgos', cat: 0, porque: 'Capítulos 3, 7 y 8.' },
          { texto: 'Semiología con cocientes de verosimilitud', cat: 1, porque: '¿Qué dato cambia la probabilidad? (capítulos 2 y 5).' },
          { texto: 'Triángulo de evaluación pediátrica', cat: 1, porque: 'Capítulo 11.' },
          { texto: 'Reglas de decisión y diagnósticos que no pueden perderse', cat: 2, porque: '¿Qué es lo más probable, lo más peligroso y cuánto riesgo corre? (capítulos 6 y 12).' },
          { texto: 'Umbral terapéutico y pre-mortem', cat: 3, porque: '¿Qué hago, adónde lo llevo y qué haré si falla? (capítulos 11 y 13).' },
          { texto: 'Decisión compartida con el paciente', cat: 3, porque: 'Anexo E.' },
          { texto: 'IMIST-AMBO y comunicación en bucle cerrado', cat: 4, porque: '¿Qué necesita saber quien recibe? (capítulo 16).' },
          { texto: 'Puntuación de Brier y análisis de incidentes', cat: 5, porque: '¿Acerté, y por qué? (capítulos 14 y 16).' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Los seis momentos de la atención',
        instrucciones: 'Ordene el ciclo de la evaluación prehospitalaria.',
        pasos: [
          'Preparar: ¿qué puede ser y qué puede engañarme?',
          'Evaluar: ¿qué amenaza la vida y qué dato cambia la probabilidad?',
          'Sintetizar: ¿qué es lo más probable, lo más peligroso y cuánto riesgo corre?',
          'Actuar: ¿qué hago, adónde lo llevo y qué haré si falla?',
          'Transferir: ¿qué necesita saber quien recibe al paciente?',
          'Aprender: ¿acerté, y por qué?'
        ],
        explicacion: 'Cada intervención y cada cambio en el paciente devuelven al momento de evaluar: es la reevaluación. Los principios del capítulo atraviesan los seis momentos.'
      },
      {
        tipo: 'quiz', titulo: 'Principios en la práctica',
        preguntas: [
          { p: '¿Por qué la capacidad para decidir no se evalúa una sola vez durante la atención?', opciones: ['Porque la ley obliga a repetirla cada 15 minutos', 'Porque es específica de cada decisión y fluctúa con causas corregibles', 'Porque el paciente suele mentir en la primera evaluación'], correcta: 1, explicacion: 'Hipoglucemia, hipoxemia, intoxicación o delirium pueden quitarla y devolverla en minutos.' },
          { p: 'Diabético confuso con glucemia de 38 mg/dL que rechaza el traslado. ¿Acepta la negativa?', opciones: ['Sí, si firma el formulario de negativa', 'No mientras persista la hipoglucemia: trato y reevalúo la capacidad', 'Sí, si un familiar está de acuerdo con él'], correcta: 1, explicacion: 'La causa que compromete la capacidad es corregible. Se trata en su mejor interés y después se evalúa de nuevo.' },
          { p: '¿Qué elementos del estándar mínimo son imprescindibles antes de decidir no trasladar?', opciones: ['Capacidad, dos juegos de signos vitales separados en el tiempo y examen físico ampliado', 'Un juego de signos vitales normal y la firma del paciente', 'ECG de 12 derivaciones y glucemia en todos los casos'], correcta: 0, explicacion: 'Sin tendencia no se sabe si mejora o empeora; sin capacidad demostrada la decisión no es válida.' },
          { p: 'En una tripulación de dos, ¿por qué conviene que solo una persona conduzca la entrevista?', opciones: ['Porque así se acorta la entrevista a la mitad', 'Porque el más experimentado debe hablar siempre', 'Porque el otro queda libre para medir, observar y detectar omisiones'], correcta: 2, explicacion: 'El paciente conversa con una sola voz y el segundo integrante conserva la carga cognitiva libre: es la monitorización cruzada.' },
          { p: '¿Qué tres preguntas se suman al interrogatorio clínico en la atención centrada en la persona?', opciones: ['Por qué llamó hoy, qué le preocupa y qué espera de la atención', 'Qué seguro tiene, a qué hospital prefiere ir y quién paga', 'Qué edad tiene, qué enfermedades tiene y qué fármacos toma'], correcta: 0, explicacion: 'La respuesta a la primera suele ser distinta del síntoma principal: un cuidador agotado, un dolor que no le deja dormir, el miedo a morir solo.' },
          { p: 'Mujer de 70 años que quiere volver a caminar y hombre de 94 años con demencia avanzada y plan paliativo, ambos con fractura de cadera. ¿Qué cambia?', opciones: ['La evaluación clínica: al segundo se le hace una más breve', 'Nada: el protocolo de fractura de cadera es el mismo', 'El objetivo del cuidado; la evaluación clínica es idéntica'], correcta: 2, explicacion: 'En el segundo, analgesia y confort; el destino y la intensidad se deciden con la familia y su médico tratante.' },
          { p: 'Un paciente extiende el brazo cuando usted le explica que va a tomarle la presión. ¿Qué tipo de consentimiento es?', opciones: ['Implícito', 'Explícito verbal', 'No hay consentimiento'], correcta: 0, explicacion: 'Colaborar con un procedimiento que se acaba de explicar es consentimiento implícito.' },
          { p: 'Una paciente habla solo kichwa y su nieto interpreta. ¿Qué hace?', opciones: ['Registra quién interpretó y le pide que repita lo esencial con sus palabras', 'Habla más despacio y más fuerte en castellano', 'Pide al nieto que decida por ella para ganar tiempo'], correcta: 0, explicacion: 'El kichwa y el shuar son idiomas oficiales de relación intercultural. La comprensión se verifica con la técnica de enseñar de vuelta (capítulo 20).' },
          { p: '¿Con quién puede compartirse la información clínica del paciente?', opciones: ['Con cualquier familiar que la pida en la escena', 'Con quien participa en la atención, el representante legal y la autoridad cuando la ley obliga', 'Con los medios, si el caso es de interés público'], correcta: 1, explicacion: 'Por ejemplo, el maltrato infantil obliga a denunciar (anexo G).' },
          { p: '¿Qué preguntas guían la revisión reflexiva después de un caso relevante?', opciones: ['Quién se equivocó, cuándo y qué sanción corresponde', 'Qué esperaba encontrar, qué encontré, por qué hubo diferencia y qué haré distinto', 'Cuánto duró la atención y cuántos fármacos se usaron'], correcta: 1, explicacion: 'Revisar el propio razonamiento mejora la exactitud diagnóstica en los casos complejos; su registro alimenta la calibración (capítulo 14).' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Las cuatro habilidades de la capacidad para decidir', reverso: 'Comunicar una elección y mantenerla · comprender · apreciar la situación y sus consecuencias para sí · razonar comparando opciones' },
          { frente: 'Capacidad y riesgo de la decisión', reverso: 'Cuanto mayor es el riesgo de la decisión, más sólida debe ser la capacidad que la sostiene.' },
          { frente: 'Los cuatro principios de la ética biomédica', reverso: 'Autonomía, beneficencia, no maleficencia y justicia' },
          { frente: 'Tres preguntas de la atención centrada en la persona', reverso: '¿Por qué llamó hoy? ¿Qué le preocupa? ¿Qué espera de la atención?' },
          { frente: 'Los seis momentos de la atención', reverso: 'Preparar · evaluar · sintetizar · actuar · transferir · aprender. La reevaluación devuelve siempre a evaluar.' },
          { frente: 'Imprescindible antes de no trasladar', reverso: 'Capacidad demostrada, dos juegos de signos vitales separados en el tiempo y examen físico ampliado' },
          { frente: 'Roles en una tripulación de dos', reverso: 'Uno conduce la entrevista; el otro mide, observa y registra. Los roles se nombran al llegar.' },
          { frente: 'Emergencia vital sin capacidad ni representante', reverso: 'Se actúa en su mejor interés y se registra por qué no fue posible obtener el consentimiento.' },
          { frente: 'Práctica reflexiva: cuatro preguntas', reverso: '¿Qué esperaba encontrar? ¿Qué encontré? ¿Por qué hubo diferencia? ¿Qué haré distinto?' }
        ]
      }
    ]
  });
})();
