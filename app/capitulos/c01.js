/* Capítulo 1. El método clínico en el entorno prehospitalario y la magnitud del error diagnóstico */
(function () {

  /* Casos para el constructor del diagnóstico de trabajo. En cada componente la opción 0 es la correcta (se barajan al mostrar). */
  var CASOS_DT = [
    {
      titulo: 'Mujer de 71 años con disnea',
      datos: 'Disnea de 2 días y confusión nueva según la hija. FR 28 rpm, SpO2 89 % al aire, FC 118 lpm, PA 96/60 mmHg, temperatura 38,6 °C. Crepitantes en la base derecha.',
      comp: [
        { c: 'Problema principal como síndrome', ops: ['Insuficiencia respiratoria hipoxémica con hipoperfusión y confusión aguda', 'Neumonía de la base derecha', 'Demencia descompensada por fiebre'],
          porque: 'El síndrome describe el problema fisiológico. «Neumonía» es una etiología probable, no el síndrome, y la confusión es nueva, no demencia.' },
        { c: 'Gravedad fisiológica actual', ops: ['Grave: hipoxemia, PA sistólica de 96 y confusión', 'Leve: conversa y solo tiene fiebre', 'Moderada: la PA todavía es mayor de 90'],
          porque: 'Hipoxemia, hipoperfusión y alteración mental a la vez definen gravedad, aunque la PA no haya caído por debajo de 90.' },
        { c: 'Trayectoria', ops: ['En empeoramiento: dos días de evolución y confusión nueva', 'Estable: lleva dos días así', 'En mejoría: la fiebre es la respuesta del organismo'],
          porque: 'La aparición de confusión sobre un cuadro de dos días indica una dirección, no un estado estable.' },
        { c: 'Hipótesis más probable', ops: ['Neumonía con sepsis', 'Insuficiencia cardíaca descompensada', 'Crisis de ansiedad por la disnea'],
          porque: 'Fiebre, crepitantes focales, taquipnea e hipoperfusión apuntan primero a neumonía con sepsis.' },
        { c: 'Hipótesis peligrosas no descartadas', ops: ['Shock séptico, tromboembolismo pulmonar e insuficiencia cardíaca descompensada', 'Ninguna: la neumonía lo explica todo', 'Gripe estacional y deshidratación leve'],
          porque: 'Lo peor se descarta de forma activa, nunca por omisión. Que una hipótesis lo explique todo es la señal del cierre prematuro.' },
        { c: 'Decisión que se deriva', ops: ['Oxígeno titulado, acceso venoso, volumen con reevaluación, preaviso de sepsis y hospital con cuidados intensivos', 'Antipirético y traslado sin preaviso al centro más cercano', 'Esperar a que la radiografía confirme la neumonía antes de elegir destino'],
          porque: 'Cada componente orienta una acción y ninguno exige una certeza que la escena no puede dar (capítulo 1, pregunta 4).' }
      ]
    },
    {
      titulo: 'Mujer de 30 años con dolor abdominal y un desmayo',
      datos: 'Dolor abdominal y síncope en casa. Retraso menstrual de 6 semanas. Glucemia capilar 98 mg/dL. Pálida y fría. FC 112 lpm a la llegada y 124 lpm a los 10 minutos; PA 104/70 mmHg y luego 100/68 mmHg.',
      comp: [
        { c: 'Problema principal como síndrome', ops: ['Shock compensado', 'Síncope vasovagal', 'Dolor abdominal inespecífico'],
          porque: 'Taquicardia creciente, palidez y frialdad con PA aún conservada definen un shock compensado.' },
        { c: 'Gravedad fisiológica actual', ops: ['Grave: hipoperfusión con PA todavía sostenida por la compensación', 'Leve: la PA sistólica es mayor de 100', 'No valorable hasta tener una ecografía'],
          porque: 'La PA es un hallazgo tardío: la FC y la piel informan antes (capítulo 4).' },
        { c: 'Trayectoria', ops: ['En empeoramiento: la FC sube 12 lpm en 10 minutos', 'Estable: la PA apenas cambió', 'En mejoría tras recostarla'],
          porque: 'Velocidad de cambio: (124 − 112)/10 = 1,2 lpm por minuto. La pendiente anticipa el colapso.' },
        { c: 'Hipótesis más probable', ops: ['Hemorragia intraabdominal', 'Gastroenteritis con deshidratación', 'Cetoacidosis diabética'],
          porque: 'La glucemia de 98 mg/dL descarta la cetoacidosis y la gastroenteritis no explica el síncope con shock.' },
        { c: 'Hipótesis peligrosa no descartada', ops: ['Embarazo ectópico roto', 'Apendicitis no complicada', 'Infección urinaria'],
          porque: 'El retraso menstrual está a favor del ectópico: define destino y prioridad.' },
        { c: 'Decisión que se deriva', ops: ['Traslado inmediato con preaviso a un centro con quirófano, acceso venoso en ruta y reposición restrictiva', 'Reposición agresiva en la escena hasta normalizar la FC y después trasladar', 'Traslado sin prioridad al centro más cercano para ecografía'],
          porque: 'Es el diagnóstico de trabajo modelo del capítulo: la decisión sale del síndrome y de la hipótesis peligrosa, sin esperar la etiqueta final.' }
      ]
    },
    {
      titulo: 'Varón de 58 años con disnea, a los 10 minutos',
      datos: 'Refiere EPOC y a la llegada tenía sibilancias. Tras 10 minutos de broncodilatadores: sin mejoría, SpO2 88 % con oxígeno, FR 30 rpm, crepitantes bilaterales, PA 190/110 mmHg.',
      comp: [
        { c: 'Problema principal como síndrome', ops: ['Insuficiencia respiratoria aguda con hipoxemia que no responde al tratamiento', 'EPOC exacerbada', 'Crisis hipertensiva aislada'],
          porque: 'El síndrome se mantiene abierto; «EPOC exacerbada» era la hipótesis inicial, y aferrarse a ella es anclaje.' },
        { c: 'Gravedad fisiológica actual', ops: ['Grave: hipoxemia con oxígeno y FR de 30', 'Moderada: la saturación es aceptable para un EPOC', 'Leve: el paciente habla'],
          porque: 'Una SpO2 de 88 % con oxígeno y FR de 30 es insuficiencia respiratoria en curso.' },
        { c: 'Trayectoria', ops: ['Sin respuesta al tratamiento: empeora o no mejora', 'En mejoría lenta, esperable con broncodilatadores', 'Estable'],
          porque: 'La falta de respuesta al tratamiento es un dato que obliga a reescribir el diagnóstico de trabajo.' },
        { c: 'Hipótesis más probable', ops: ['Edema pulmonar agudo', 'EPOC exacerbada', 'Neumonía bilateral'],
          porque: 'Crepitantes bilaterales, PA de 190/110 y falta de respuesta a broncodilatadores reordenan el pizarrón.' },
        { c: 'Hipótesis peligrosa no descartada', ops: ['Síndrome coronario agudo', 'Crisis de ansiedad', 'Reacción a los broncodilatadores'],
          porque: 'El edema pulmonar puede ser la expresión de una isquemia aguda: el ECG la busca.' },
        { c: 'Decisión que se deriva', ops: ['ECG de 12 derivaciones ahora, reorientar el tratamiento y definir el destino según el ECG', 'Repetir broncodilatadores y mantener la hipótesis de EPOC', 'Trasladar sin más pruebas: el hospital lo aclarará'],
          porque: 'En el ejemplo del capítulo, a los 20 minutos el ECG mostró elevación del ST en V2 a V4 y el destino pasó a un centro con hemodinamia.' }
      ]
    }
  ];

  /* Simulador: el alumno arma el diagnóstico de trabajo componente a componente. */
  function constructorDT(el, api) {
    var h = api.h;
    var casos = api.barajar(CASOS_DT), ci = 0, k = 0, bien = 0, total = 0, frase = [];
    function pintar() {
      el.innerHTML = '';
      if (ci >= casos.length) {
        return api.fin(bien / total, bien + ' de ' + total + ' componentes bien elegidos en ' + casos.length + ' diagnósticos de trabajo', true);
      }
      var cs = casos[ci], comp = cs.comp[k];
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Caso ' + (ci + 1) + ' de ' + casos.length + ' · componente ' + (k + 1) + ' de 6'));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">' + cs.titulo + '</span>' + cs.datos }));
      var borrador = h('div', { class: 'datos', html: '<b>Diagnóstico de trabajo:</b> ' + (frase.length ? frase.join('; ') + '…' : '<span class="pregunta-n">(en construcción)</span>') });
      el.appendChild(borrador);
      el.appendChild(h('div', { class: 'enunciado' }, (k + 1) + '. ' + comp.c));
      var zona = h('div');
      var orden = api.barajar([0, 1, 2]);
      var bots = [];
      orden.forEach(function (idx) {
        var b = h('button', { class: 'opcion', onclick: function () {
          bots.forEach(function (x) { x.b.disabled = true; if (x.i === 0) x.b.classList.add('bien'); });
          var ok = idx === 0; total++; if (ok) bien++; else b.classList.add('mal');
          zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + comp.porque }));
          frase.push(comp.ops[0]);
          var ultimo = k === 5;
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () {
            if (ultimo) { mostrarFinal(); } else { k++; pintar(); }
          } }, ultimo ? 'Ver el diagnóstico completo' : 'Siguiente componente')));
        } }, comp.ops[idx]);
        bots.push({ b: b, i: idx });
        el.appendChild(b);
      });
      el.appendChild(zona);
    }
    function mostrarFinal() {
      el.innerHTML = '';
      var cs = casos[ci];
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Caso ' + (ci + 1) + ' de ' + casos.length + ' · diagnóstico de trabajo completo'));
      el.appendChild(h('div', { class: 'caja objetivo', html: '<span class="rot">' + cs.titulo + '</span>«' + frase.join('; ') + '.»' }));
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Seis componentes: síndrome, gravedad, trayectoria, hipótesis más probable, hipótesis peligrosa no descartada y decisión. Se reescribe en cada reevaluación.'));
      el.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ci++; k = 0; frase = []; pintar(); } },
        ci + 1 < casos.length ? 'Siguiente caso' : 'Ver resultado')));
    }
    pintar();
  }

  TDC.registrar({
    numero: 1, parte: 'I',
    titulo: 'El método clínico en el entorno prehospitalario y la magnitud del error diagnóstico',
    mision: 'Formule diagnósticos de trabajo que orienten la acción y analice el error diagnóstico sin culpa.',
    objetivo: 'Formular un diagnóstico de trabajo orientado a la acción y reconocer los mecanismos, la frecuencia y el impacto del error diagnóstico en emergencias.',
    escena: 'Son las 23:40 y lleva 14 horas de turno. El despacho ya le entregó una etiqueta y en la escena alguien le pide que resuelva rápido. Su tarea no es acertar el nombre de la enfermedad, sino responder <b>qué puede tener este paciente que le obligue a actuar ahora, y con qué probabilidad</b>.',
    actividades: [
      {
        tipo: 'caso', titulo: 'El hombre dormido en la parada de autobús',
        presentacion: '<b>Despacho, 23:40:</b> «hombre ebrio acostado en la parada de autobús, no responde, huele a alcohol». Tripulación de dos paramédicos en la hora 14 de un turno de 24 horas.',
        fases: [
          {
            titulo: 'Antes de llegar',
            datos: 'En ruta, su compañero comenta: «Otro borracho; lo llevamos a que duerma».',
            decision: { tipo: 'opcion', pregunta: '¿Cómo entra la etiqueta «ebrio» en su razonamiento?',
              opciones: ['Como hipótesis: alteración de la conciencia de causa no establecida', 'Como punto de partida que la escena confirmará o descartará', 'No la tengo en cuenta: la información del despacho no aporta nada'],
              correcta: 0, parcial: [1],
              porOpcion: { 1: 'Partir de la etiqueta ya encuadra la evaluación: cada dato se leerá a su favor.', 2: 'El despacho es información real, aunque débil y de segunda mano.' },
              explicacion: 'La etiqueta del despacho es un diagnóstico ajeno: se trata como hipótesis, nunca como hallazgo. El cierre precoz inducido por esa información es un sesgo descrito.' },
            experto: '“Escena segura. Hombre que no responde: primero vía aérea, respiración y circulación; la etiqueta, después.”'
          },
          {
            titulo: 'En la parada de autobús',
            monitor: { Glasgow: '9 (O2 V3 M4)', FC: '112 lpm', PA: '152/88', FR: '18 rpm', SpO2: '96 % aire', 'T.ª': '36,1 °C' },
            datos: 'Varón de unos 50 años, sin documentos, con una lata de cerveza al lado y olor a alcohol. Diaforesis profusa, piel fría y pálida. Pupilas isocóricas y reactivas. Sin trauma visible en la inspección rápida. Dos policías piden que «se lo lleven para que duerma».',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que <b>no encajan</b> con una intoxicación etílica simple.',
              opciones: ['Diaforesis profusa', 'Piel fría y pálida', 'Taquicardia de 112 lpm con sudor frío', 'Olor a alcohol', 'Lata de cerveza al lado', 'Pupilas isocóricas y reactivas'],
              correctas: [0, 1, 2],
              explicacion: 'Son signos adrenérgicos discordantes: la intoxicación etílica simple produce vasodilatación y piel caliente. El olor a alcohol no permite estimar la alcoholemia ni excluye otras causas.' },
            experto: '“Glasgow 9, sudoroso y frío. Un ebrio no suda frío: esto no encaja.”'
          },
          {
            titulo: 'La presión de la escena',
            datos: 'Los policías insisten en que lo suban ya. Su compañero propone acomodarlo en decúbito lateral y medir la glucemia «en el hospital».',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace antes de mover al paciente?',
              opciones: ['Traslado inmediato en decúbito lateral: la glucemia no cambia nada ahora', 'Glucemia capilar, temperatura y búsqueda de trauma craneal', 'Oxígeno y traslado; glucemia en ruta si la carga de trabajo lo permite'],
              correcta: 1, parcial: [2],
              porOpcion: { 2: 'Medirla en ruta es mejor que diferirla, pero condicionada a «si se puede» suele quedar sin hacer.' },
              explicacion: 'La glucemia es obligatoria ante cualquier alteración de la conciencia y era la prueba que más podía cambiar la conducta.' },
            experto: '“Antes de moverlo: glucemia, temperatura y búsqueda de trauma craneal.”'
          },
          {
            titulo: 'El umbral de la glucemia',
            datos: 'Su compañero objeta: «Aunque midas, la probabilidad de hipoglucemia en un ebrio será de un 5 %».',
            decision: { tipo: 'opcion', pregunta: 'Con una probabilidad de solo 5 %, ¿está justificado medirla?',
              opciones: ['No: con 5 % el resultado casi siempre será normal', 'Solo si alguien confirma que es diabético', 'Sí: cuesta segundos, no tiene riesgo y un positivo cambia la conducta'],
              correcta: 2,
              explicacion: 'Cuando una prueba casi no cuesta y su resultado puede evitar un daño grave, el umbral para hacerla es prácticamente 0 (capítulo 13).' }
          },
          {
            titulo: 'Glucemia y tratamiento',
            monitor: { Glucemia: '32 mg/dL (1,8 mmol/L)' },
            datos: 'Tras dextrosa intravenosa recupera la conciencia en 6 minutos. Es diabético tipo 2 tratado con insulina, no cenó y bebió una cerveza. Los policías proponen dejarlo en su casa.',
            decision: { tipo: 'opcion', pregunta: '¿Cuál es su disposición?',
              opciones: ['Traslado y vigilancia: la hipoglucemia puede repetirse horas después', 'Alta en la escena con la indicación de comer algo', 'Alta si una segunda glucemia a los 10 minutos es normal'],
              correcta: 0,
              explicacion: 'La insulina de acción prolongada puede reproducir la hipoglucemia y el alcohol agota las reservas de glucógeno: el etanol inhibe la gluconeogénesis. Alcohol e hipoglucemia no compiten, pueden coexistir.' },
            experto: '“Despertó. ¿Qué insulina usa? Si es de acción prolongada, la hipoglucemia puede repetirse.”'
          },
          {
            titulo: 'Transferencia',
            datos: 'Llega a urgencias. ¿Qué transmite?',
            decision: { tipo: 'opcion', pregunta: 'Elija la transferencia correcta.',
              opciones: ['«Ebrio con hipoglucemia, ya resuelta»', '«Alteración aguda de la conciencia por hipoglucemia de 32 mg/dL en diabético con insulina, corregida con dextrosa; ingesta de alcohol; descartar trauma craneal y vigilar recidiva»', '«Paciente estable, sin novedades en el traslado»'],
              correcta: 1,
              explicacion: 'La palabra «ebrio» no es un diagnóstico. Un diagnóstico correcto que no se comunica sigue siendo un error: la transferencia es la fase donde se pierde o se conserva.' }
          },
          {
            titulo: 'Análisis sin culpa',
            datos: 'En la reunión del servicio se revisa el caso tal como ocurrió realmente: la glucemia se difirió y el paciente convulsionó a los 12 minutos de traslado.',
            decision: { tipo: 'multiple', pregunta: '¿Qué condiciones <b>del sistema</b> facilitaron el error?',
              opciones: ['Fatiga de la hora 14 de un turno de 24 horas', 'Ausencia de una función de forzamiento que exija glucemia antes de mover al paciente', 'Presión externa de la policía en la escena', 'Presentación atípica de la hipoglucemia', 'Falta de conocimiento sobre la hipoglucemia'],
              correctas: [0, 1, 2],
              explicacion: 'No hubo componente sin culpa: la presentación era típica. El fallo cognitivo fue de síntesis (anclaje, confirmación, cierre prematuro y error fundamental de atribución), no de conocimiento, como en la serie de Graber.' }
          }
        ],
        cierre: 'El alcohol es un diagnóstico de exclusión. Antes de aceptarlo deben descartarse hipoglucemia, traumatismo craneal, hipoxia, sepsis e intoxicación asociada. La etiqueta pasó del alertante a la policía y de la policía al equipo sin que nadie la verificara: eso es inercia diagnóstica.'
      },
      {
        tipo: 'personalizado', titulo: 'Constructor del diagnóstico de trabajo', render: constructorDT,
        instrucciones: 'Arme, componente a componente, el diagnóstico de trabajo de tres pacientes. Es lo que usted transmite en el preaviso y en la transferencia: debe orientar la acción sin exigir una certeza que la escena no da.'
      },
      {
        tipo: 'clasificar', titulo: 'Tipos de error según Graber',
        instrucciones: 'Clasifique cada situación en la categoría dominante. En la serie original, los factores del sistema y los cognitivos coexistieron en 46 % de los casos; aquí elija el que pesa más.',
        categorias: ['Sin culpa', 'Del sistema', 'Cognitivo'],
        items: [
          { texto: 'Infarto sin dolor en un paciente con demencia avanzada', cat: 0, porque: 'Presentación atípica o enmascarada.' },
          { texto: 'Paciente que no colabora y oculta la ingesta de fármacos', cat: 0, porque: 'El paciente no aporta la información: error sin culpa.' },
          { texto: 'Glucómetro sin tiras reactivas en la ambulancia', cat: 1, porque: 'Falla técnica u organizativa.' },
          { texto: 'Protocolo que no exige glucemia ante una alteración de la conciencia', cat: 1, porque: 'Falta una barrera del sistema.' },
          { texto: 'Turnos de 24 horas sin descanso programado', cat: 1, porque: 'Condición organizativa que degrada el razonamiento.' },
          { texto: 'Atribuir un coma al alcohol sin medir la glucemia', cat: 2, porque: 'Recolección y síntesis defectuosas de datos.' },
          { texto: 'Cerrar el caso con la primera explicación que encaja', cat: 2, porque: 'Cierre prematuro: el fallo cognitivo más frecuente.' },
          { texto: 'Dar por descartada una hemorragia porque la PA es normal', cat: 2, porque: 'Síntesis defectuosa: sobrepeso de un dato tranquilizador (capítulo 4).' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Las siete fases del proceso diagnóstico',
        instrucciones: 'Ordene las fases del proceso diagnóstico adaptado a la escena. Cada una tiene su modo de fallo típico.',
        pasos: ['Despacho y acceso', 'Recolección de datos', 'Generación de hipótesis', 'Ponderación y pruebas', 'Reconocimiento de urgencia', 'Decisión de disposición', 'Transferencia'],
        explicacion: 'Fallos típicos: etiqueta errónea en el despacho; signos estimados y glucemia omitida; la causa real nunca entra en la lista; sobrepeso de un dato tranquilizador; infratriaje del que «se ve bien»; no traslado sin plan de seguridad; pérdida del hallazgo crítico en la transferencia.'
      },
      {
        tipo: 'numero', titulo: 'Trayectoria y magnitud del error',
        instrucciones: 'Calcule. Escriba solo el número; use coma o punto decimal.',
        problemas: [
          { enunciado: 'La FC pasa de 104 a 122 lpm en 15 minutos. ¿Cuál es la velocidad de cambio en lpm por minuto?', respuesta: 1.2, tolerancia: 0.05, decimales: 1, unidad: 'lpm/min', solucion: '(122 − 104)/15 = 1,2 lpm por minuto.' },
          { enunciado: 'Si esa tendencia se mantiene, ¿qué FC tendrá a los 30 minutos de la primera medición?', respuesta: 140, tolerancia: 2, unidad: 'lpm', solucion: '104 + 1,2 × 30 = 140 lpm, aunque la PA siga normal. La pendiente anticipa el colapso.' },
          { enunciado: 'Un paramédico atiende al año 50 pacientes con una condición tiempo-dependiente. Con la sensibilidad prehospitalaria agrupada de 0,74 (Wilson et al.), ¿cuántos no serían reconocidos?', respuesta: 13, tolerancia: 1, unidad: 'pacientes', solucion: '50 × (1 − 0,74) = 13. Es un orden de magnitud, no una predicción exacta.' },
          { enunciado: 'Con esos mismos valores (Se 0,74; Es 0,94) y una prevalencia de 10 %, ¿cuántos de 1.000 pacientes enfermos pasarían sin reconocerse?', respuesta: 26, tolerancia: 1, unidad: 'pacientes', solucion: '100 enfermos × 0,26 = 26 omisiones.' },
          { enunciado: 'En esos mismos 1.000 pacientes, ¿cuántas falsas alarmas cabe esperar?', respuesta: 54, tolerancia: 1, unidad: 'pacientes', solucion: '900 sanos × (1 − 0,94) = 54 falsas alarmas.' },
          { enunciado: 'Y el valor predictivo positivo de la impresión del equipo en ese escenario (en %).', respuesta: 58, tolerancia: 1.5, unidad: '%', solucion: '74 verdaderos positivos / (74 + 54) = 58 %. El valor predictivo negativo es 846/872 = 97 %.' },
          { enunciado: 'Un paramédico atiende al año 40 pacientes con síndrome coronario agudo y su sensibilidad para reconocerlo es de 0,80. ¿Cuántos pasarían sin reconocerse?', respuesta: 8, tolerancia: 0.5, unidad: 'pacientes', solucion: '40 × (1 − 0,80) = 8 al año. Para conocer su sensibilidad real necesita el diagnóstico de egreso de sus pacientes (capítulo 14).' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Método clínico y error en la escena',
        preguntas: [
          { p: 'Usted corrigió una hipoglucemia en la escena, pero en la transferencia solo dice «paciente estable». Según la definición de las Academias Nacionales, ¿hubo error diagnóstico?',
            opciones: ['No: el diagnóstico fue correcto, oportuno y el tratamiento eficaz', 'Sí: la definición exige también comunicarlo a quien debe actuar', 'Solo si el paciente sufre después un daño atribuible a la omisión'], correcta: 1,
            explicacion: 'El diagnóstico existe para orientar decisiones. Si no llega al equipo receptor, reproduce el mismo fallo.' },
          { p: 'Un paramédico decide no trasladar a un paciente con dolor torácico y el paciente evoluciona bien. ¿Cómo se juzga esa decisión?',
            opciones: ['Por el proceso: probabilidad, hallazgos, alternativas y plan de seguridad', 'Fue correcta: el buen resultado confirma que el razonamiento era sólido', 'Fue incorrecta: todo dolor torácico debe trasladarse sin excepción'], correcta: 0,
            explicacion: 'Juzgar por el desenlace es el sesgo de resultado: una mala decisión puede terminar bien y una buena, mal.' },
          { p: 'Tras el caso del hombre dormido, ¿qué medida reduce el riesgo de repetir el error con independencia de la tripulación?',
            opciones: ['Una circular que pida al personal extremar el cuidado con los «ebrios»', 'Un registro que no se cierra sin glucemia ante alteración de la conciencia', 'Una sanción ejemplar al paramédico que estaba al mando del caso'], correcta: 1,
            explicacion: 'Las soluciones que dependen de «tener más cuidado» fallan justo cuando aparecen la fatiga y la presión. También ayuda asignar al segundo paramédico el papel de verificador de omisiones.' },
          { p: 'El paramédico no preguntó si el paciente tomaba anticoagulantes. ¿En qué fase del proceso diagnóstico ocurrió el fallo?',
            opciones: ['Despacho y acceso', 'Ponderación y pruebas', 'Recolección de datos'], correcta: 2,
            explicacion: 'No se obtuvo un dato que cambia el riesgo. La barrera es una lista de datos obligatorios.' },
          { p: 'Anciana con cáncer avanzado y disnea. La familia discute si ella quería ir al hospital, mientras el equipo busca afinar el diagnóstico. ¿Qué incertidumbre domina la decisión?',
            opciones: ['Diagnóstica', 'Terapéutica', 'De valores'], correcta: 2,
            explicacion: 'Confundir las incertidumbres lleva a buscar certeza diagnóstica cuando la decisión depende de los deseos del paciente.' },
          { p: 'PA 70/40 mmHg, FC 140 lpm y piel fría. Aún no sabe si sangra una úlcera o un aneurisma. ¿Qué necesita para decidir?',
            opciones: ['Definir primero la etiología para elegir el tratamiento y el destino', 'Nada más: acceso vascular, control de la pérdida y traslado prioritario', 'Una ecografía abdominal completa antes de mover al paciente'], correcta: 1,
            explicacion: 'La mayoría de las decisiones prehospitalarias no necesita un diagnóstico nosológico. El diagnóstico fino se persigue solo cuando cambia la acción.' },
          { p: 'SpO2 de 82 % en un paciente que conversa tranquilo, sin disnea ni cianosis. ¿Qué indica la máxima «repetir lo sorprendente»?',
            opciones: ['Tratar de inmediato con oxígeno a alto flujo y preaviso', 'Repetir la medición con otro sensor antes de actuar', 'Ignorar el valor: el aspecto del paciente es lo que manda'], correcta: 1,
            explicacion: 'Protege contra el error de medición. Si el paciente estuviera cianótico, se trataría de inmediato.' },
          { p: 'Mujer de 30 años con dolor abdominal y síncope. ¿Qué pregunta discrimina mejor entre apendicitis y embarazo ectópico?',
            opciones: ['¿Ha tenido fiebre o escalofríos en los últimos días?', '¿Fecha de la última menstruación y dolor en el hombro?', '¿Ha tenido diarrea o vómitos desde que empezó?'], correcta: 1,
            explicacion: 'Una pregunta es útil cuando su respuesta cambia según la hipótesis. El experto elige sus preguntas por su poder de discriminación.' },
          { p: 'Un infarto se trasladó sin ECG ni preaviso y el paciente llegó estable. ¿Cómo se clasifica?',
            opciones: ['Error sin daño', 'Resultado adverso sin error', 'Evolución inevitable'], correcta: 0,
            explicacion: 'Error no equivale a daño. Los errores sin daño son los más baratos para aprender.' },
          { p: 'Según la revisión de la AHRQ, ¿dónde conviene concentrar el entrenamiento para reducir el daño grave por error diagnóstico?',
            opciones: ['En las presentaciones típicas de las enfermedades más frecuentes del servicio', 'En las condiciones raras que casi nunca se ven en toda una carrera', 'En formas atípicas de ictus, infarto, disección, compresión medular y tromboembolismo'], correcta: 2,
            explicacion: 'Esas cinco condiciones concentraron 39 % de los daños graves. El ictus con mareo tuvo unas 14 veces más probabilidades de pasar inadvertido que el ictus con síntomas motores.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Pregunta útil en la escena', reverso: '¿Qué puede tener que me obligue a actuar ahora, y con qué probabilidad?' },
          { frente: 'Seis componentes del diagnóstico de trabajo', reverso: 'Síndrome · gravedad · trayectoria · hipótesis más probable · hipótesis peligrosa no descartada · decisión' },
          { frente: 'Cuatro incertidumbres', reverso: 'Diagnóstica, pronóstica, terapéutica y de valores' },
          { frente: 'Cuándo dejar de buscar información', reverso: 'Cuando el siguiente dato ya no puede cambiar la decisión, o esperarlo cuesta más que actuar sin él' },
          { frente: 'Categorías de Graber', reverso: 'Sin culpa (7 %) · del sistema (65 %) · cognitivo (74 %); ambos a la vez en 46 %. Fallo más frecuente: cierre prematuro' },
          { frente: 'Error diagnóstico en urgencias (AHRQ)', reverso: '5,7 % de las visitas (1 de 18); evento adverso 2,0 % (1 de 50); daño grave 0,3 % (1 de 350)' },
          { frente: 'Precisión diagnóstica prehospitalaria (Wilson)', reverso: 'Se 0,74 · Es 0,94: el error dominante es la omisión, no la falsa alarma' },
          { frente: 'Velocidad de cambio', reverso: '(valor final − valor inicial)/tiempo transcurrido. Un NEWS2 que sube 2 puntos obliga a reevaluar' },
          { frente: 'Cinco preguntas para analizar un error propio', reverso: '¿Oportunidad perdida? · ¿En qué fase? · ¿Qué factor cognitivo? · ¿Qué condición del sistema? · ¿Qué barrera lo habría detenido?' },
          { frente: 'Autochequeo HALTS', reverso: 'Hambre, enojo, retraso, cansancio y estrés' }
        ]
      }
    ]
  });
})();
