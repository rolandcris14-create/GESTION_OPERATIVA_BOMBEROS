/* Capítulo 7. La mente en la emergencia: teoría del proceso dual, carga cognitiva y estrés */
(function () {
  function elegir(a) { return a[Math.floor(Math.random() * a.length)]; }
  function dos(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- Simulador de memoria de trabajo en un paro pediátrico ---------- */
  var RUIDO = [
    'Radio: la central pregunta el tiempo estimado de llegada.',
    'La madre grita: “¿Se va a salvar? ¡Díganme algo!”.',
    'Alarma del monitor: electrodo desconectado. Lo recoloca.',
    'El hospital llama para confirmar la edad del niño.',
    'Un vecino pregunta dónde puede estacionar su auto.',
    'La policía pide los datos del domicilio para su parte.',
    'El padre pregunta si puede subir a la ambulancia.'
  ];
  var ACCESOS = ['Intraóseo en la tibia derecha', 'Intraóseo en la tibia izquierda', 'Venoso en el antebrazo izquierdo'];
  var VIAS = ['Dispositivo supraglótico colocado', 'Ventilación con bolsa y mascarilla a dos manos', 'Intubación confirmada con capnografía'];
  var PENDIENTES = ['Medir la glucemia', 'Medir la temperatura', 'Descartar un neumotórax'];

  function escenario() {
    var peso = elegir([12, 14, 16, 18, 20, 22]), ciclo = elegir([2, 3, 4]);
    var m1 = elegir([12, 14, 16, 18]), m2 = m1 + elegir([4, 5]);
    var acceso = elegir(ACCESOS), via = elegir(VIAS), pend = elegir(PENDIENTES);
    var ruido = api_barajar(RUIDO);
    var ev = [
      { t: 'Peso estimado con la cinta: ' + peso + ' kg.', clave: 'peso' },
      { t: 'Inicia el ciclo ' + ciclo + ' de compresiones.', clave: 'ciclo' },
      { t: ruido[0], ruido: true },
      { t: 'Adrenalina administrada a las 19:' + dos(m1) + '.', clave: 'adr' },
      { t: ruido[1], ruido: true },
      { t: 'Acceso vascular: ' + acceso.toLowerCase() + '.', clave: 'acceso' },
      { t: ruido[2], ruido: true },
      { t: 'Vía aérea: ' + via.toLowerCase() + '.', clave: 'via' },
      { t: 'Inicia el ciclo ' + (ciclo + 1) + ' de compresiones.', clave: 'ciclo' },
      { t: ruido[3], ruido: true },
      { t: 'Segunda dosis de adrenalina a las 19:' + dos(m2) + '.', clave: 'adr' },
      { t: 'Causa reversible pendiente: ' + pend.toLowerCase() + '.', clave: 'pend' },
      { t: ruido[4], ruido: true }
    ];
    var preg = [
      { p: '¿A qué hora se dio la última adrenalina?', o: ['19:' + dos(m2), '19:' + dos(m1), '19:' + dos(m2 + 2), '19:' + dos(m1 - 2)] },
      { p: '¿En qué ciclo de compresiones están?', o: [String(ciclo + 1), String(ciclo), String(ciclo + 2), String(ciclo - 1)] },
      { p: '¿Qué acceso vascular tiene el niño?', o: [acceso].concat(ACCESOS.filter(function (x) { return x !== acceso; })) },
      { p: '¿Qué peso estimado se registró?', o: [peso + ' kg', (peso + 4) + ' kg', (peso - 2) + ' kg', (peso + 2) + ' kg'] },
      { p: '¿Qué queda pendiente entre las causas reversibles?', o: [pend].concat(PENDIENTES.filter(function (x) { return x !== pend; })) }
    ];
    return { ev: ev, preg: preg };
  }
  var api_barajar;

  function memoriaTrabajo(el, api) {
    var h = api.h;
    api_barajar = api.barajar;
    var INTERVALO = 2800, notaR1 = null;
    function vivo() { return document.body.contains(el); }
    function inicio(ronda) {
      el.innerHTML = '';
      var con = ronda === 2;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Ronda ' + ronda + ' de 2'));
      el.appendChild(h('div', { class: 'caja escena', html: con
        ? '<b>Con registrador.</b> Mismo tipo de paro, datos nuevos. Ahora puede tocar «Anotar» en cada dato que considere clínico: su nota queda visible. No anote el ruido: la carga ajena a la tarea se elimina, no se registra.'
        : '<b>Solo memoria.</b> Paro cardíaco pediátrico. Los datos y las interrupciones aparecerán uno a uno durante unos 3 segundos. No puede anotar nada. Al final, cinco preguntas.' }));
      el.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { correr(con); } }, 'Empezar la ronda ' + ronda)));
    }
    function correr(con) {
      var E = escenario(), k = 0, notas = [], ruidoAnotado = 0;
      el.innerHTML = '';
      var barra = h('div', { class: 'linea-tiempo' });
      E.ev.forEach(function () { barra.appendChild(h('i')); });
      var pantalla = h('div', { class: 'monitor', style: 'min-height:84px;align-items:center;font-size:15px' });
      var bAnotar = h('button', { class: 'btn', onclick: function () {
        var e = E.ev[k]; if (!e || e.anotado) return;
        e.anotado = true; bAnotar.disabled = true;
        if (e.ruido) ruidoAnotado++;
        notas.push(e.t); pintarNotas();
      } }, 'Anotar');
      var hoja = h('div');
      function pintarNotas() {
        hoja.innerHTML = '';
        if (!con) return;
        hoja.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Registro'));
        if (!notas.length) hoja.appendChild(h('div', { class: 'pregunta-n' }, 'Sin anotaciones.'));
        notas.forEach(function (n) { hoja.appendChild(h('div', { class: 'datos', style: 'border-left:3px solid var(--rojo);padding-left:8px' }, n)); });
      }
      el.appendChild(barra); el.appendChild(pantalla);
      if (con) el.appendChild(h('div', { class: 'acciones' }, bAnotar));
      el.appendChild(hoja); pintarNotas();
      function paso() {
        if (!vivo()) return;
        if (k >= E.ev.length) return preguntas(E, con, notas, ruidoAnotado);
        barra.children[k].className = 'hecho';
        pantalla.textContent = E.ev[k].t;
        bAnotar.disabled = false;
        setTimeout(function () { k++; paso(); }, INTERVALO);
      }
      paso();
    }
    function preguntas(E, con, notas, ruidoAnotado) {
      el.innerHTML = '';
      el.appendChild(h('div', { class: 'enunciado' }, con ? 'Responda con ayuda de su registro.' : 'Responda de memoria.'));
      if (con) {
        var hoja = h('div', { class: 'caja' }, h('div', { class: 'pregunta-n' }, 'Su registro'));
        if (!notas.length) hoja.appendChild(h('div', null, 'Sin anotaciones.'));
        notas.forEach(function (n) { hoja.appendChild(h('div', null, '· ' + n)); });
        el.appendChild(hoja);
      }
      var sel = {}, grupos = [];
      E.preg.forEach(function (q, qi) {
        var orden = api.barajar(q.o.map(function (_, j) { return j; }));
        el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, (qi + 1) + '. ' + q.p));
        var bs = orden.map(function (j) {
          return h('button', { class: 'opcion', onclick: function () {
            if (hecho) return; sel[qi] = j;
            bs.forEach(function (b) { b.classList.toggle('sel', b === this); }, this);
          } }, q.o[j]);
        });
        bs.forEach(function (b, n) { b.dataset.j = orden[n]; el.appendChild(b); });
        grupos.push(bs);
      });
      var hecho = false, aviso = h('span', { class: 'pregunta-n' }), zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (Object.keys(sel).length < E.preg.length) { aviso.textContent = 'Responda las cinco preguntas.'; return; }
        hecho = true; bt.disabled = true; aviso.textContent = '';
        var bien = 0;
        grupos.forEach(function (bs, qi) {
          if (sel[qi] === 0) bien++;
          bs.forEach(function (b) { b.disabled = true; if (+b.dataset.j === 0) b.classList.add('bien'); else if (+b.dataset.j === sel[qi]) b.classList.add('mal'); });
        });
        if (!con) {
          notaR1 = bien;
          zona.appendChild(h('div', { class: 'fb info', html: '<b>Solo memoria: ' + bien + ' de 5.</b> Trece elementos, con datos que cambian (la dosis y el ciclo) y ruido intercalado, frente a una capacidad de unos 4 a la vez. Ahora repita con un registrador externo.' }));
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { inicio(2); } }, 'Ir a la ronda 2')));
        } else {
          var pen = Math.min(0.2, ruidoAnotado * 0.05), nota = Math.max(0, bien / 5 - pen);
          zona.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : 'info'), html: '<b>Solo memoria: ' + notaR1 + ' de 5 · con registrador: ' + bien + ' de 5.</b> ' +
            (ruidoAnotado ? 'Anotó ' + ruidoAnotado + ' interrupción(es) sin valor clínico: cada una resta 5 puntos. ' : 'No registró ruido: bien. ') +
            'Con diez elementos que cambian cada pocos minutos, la única estrategia viable es sacarlos de la memoria: un registrador que anote y anuncie, una cinta de dosificación y roles fijos.' }));
          api.fin(nota, 'Con registrador: ' + bien + ' de 5 datos correctos' + (ruidoAnotado ? ', con ' + ruidoAnotado + ' anotación(es) de ruido.' : ', sin anotar ruido.'), true);
        }
      } }, 'Comprobar');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    inicio(1);
  }

  TDC.registrar({
    numero: 7, parte: 'III',
    titulo: 'La mente en la emergencia: teoría del proceso dual, carga cognitiva y estrés',
    mision: 'Detecte qué sistema decide, frene ante el dato que no encaja y saque la carga de su memoria.',
    objetivo: 'Reconocer qué modo cognitivo gobierna una decisión, identificar las condiciones que degradan cada modo y activar deliberadamente el análisis cuando los datos lo exigen.',
    escena: 'Son las 19:15 de un turno largo. El despacho ya le entregó una etiqueta, la radio no para y la familia pregunta. Su mente propondrá respuestas rápidas, casi siempre útiles: su tarea es saber <b>cuándo confiar en ellas</b> y cuándo un dato obliga a detenerse y analizar.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Memoria de trabajo en un paro pediátrico', render: memoriaTrabajo,
        instrucciones: 'Dos rondas. En la primera retiene los datos solo con la memoria, entre interrupciones. En la segunda usa un registrador y decide qué anotar. Compare ambos resultados. La nota corresponde a la ronda con registrador.'
      },
      {
        tipo: 'caso', titulo: 'La “crisis de ansiedad” con saturación de 88 %',
        presentacion: '<b>19:15. Despacho:</b> “mujer de 34 años con crisis de ansiedad, hiperventila”. La pareja refiere que tiene un trastorno de ansiedad en tratamiento y que “le pasa seguido”.',
        fases: [
          {
            titulo: 'Primer contacto',
            monitor: { FR: '30 rpm', SpO2: '88 % aire', FC: '122 lpm', PA: '112/74', T: '37,3 °C' },
            datos: 'Sentada, angustiada, dice que no puede respirar. Hormigueo en manos y labios. Su compañero propone: “Que respire en una bolsa de papel y la tranquilizamos antes de decidir”.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace?',
              opciones: ['Acepto la bolsa de papel y la calmo antes de decidir el traslado', 'Traslado sin intervenir: la ansiedad se resuelve sola en unos minutos', 'Me detengo: una SpO2 de 88 % no encaja con ansiedad y busco una causa orgánica'],
              correcta: 2,
              explicacion: 'La hiperventilación de la ansiedad baja el CO2 y no produce hipoxemia. Un dato objetivo discordante invalida el patrón: es una anulación racional.' },
            experto: '“88 % no es ansiedad: la hiperventilación sube la saturación, no la baja.”'
          },
          {
            titulo: 'Reconstrucción analítica',
            datos: 'Al preguntar: dolor leve en el costado derecho al inspirar, toma anticonceptivos orales y lleva una bota ortopédica en la pierna derecha por una fractura de peroné hace tres semanas.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que apoyan un tromboembolismo pulmonar.',
              opciones: ['Inmovilización de la pierna por la fractura', 'Anticonceptivos orales', 'Dolor pleurítico derecho', 'FC de 122 lpm', 'Hormigueo en manos y labios', 'Antecedente de trastorno de ansiedad'],
              correctas: [0, 1, 2, 3],
              explicacion: 'Inmovilización, estrógenos, dolor pleurítico, taquicardia e hipoxemia. Las parestesias y el antecedente psiquiátrico eran los datos que sostenían el patrón equivocado.' },
            experto: '“Bota ortopédica, anticonceptivos, dolor pleurítico y taquicardia: esto es tromboembolismo hasta que se demuestre lo contrario.”'
          },
          {
            titulo: 'Criterios de Wells',
            datos: 'FC mayor de 100, inmovilización reciente y el tromboembolismo como diagnóstico más probable. La bota impide ver la pierna.',
            decision: { tipo: 'opcion', pregunta: '¿Cuántos puntos de Wells suma?',
              opciones: ['3 puntos', '4,5 puntos', '6 puntos', '7,5 puntos'],
              correcta: 2, parcial: [3],
              porOpcion: { 3: 'Sumar 3 por signos de trombosis sería correcto si pudiera verlos, pero la bota los oculta.' },
              explicacion: 'FC mayor de 100: 1,5. Inmovilización reciente: 1,5. Tromboembolismo como diagnóstico más probable: 3. Total 6: tromboembolismo probable. La bota ocultaba la pierna donde podían estar los signos de trombosis venosa.' }
          },
          {
            titulo: '¿Sirve PERC?',
            decision: { tipo: 'opcion', pregunta: '¿Puede usar los criterios PERC para descartar en la escena?',
              opciones: ['No: cumple el criterio de edad, pero falla FC, SpO2 y estrógenos', 'Sí: tiene menos de 50 años, que es el criterio principal', 'Sí, siempre que el Wells hubiera salido bajo'],
              correcta: 0,
              explicacion: 'PERC solo descarta si se cumplen todos sus criterios con una sospecha clínica baja. Aplicarlo a medias es el riesgo típico de una regla del Sistema 2.' }
          },
          {
            titulo: 'Tratamiento',
            decision: { tipo: 'opcion', pregunta: '¿Qué conducta elige?',
              opciones: ['Bolsa de papel unos minutos y oxígeno si no mejora', 'Oxígeno titulado a SpO2 de 94 a 98 %, acceso venoso, ECG y traslado prioritario con preaviso', 'Oxígeno a alto flujo y esperar a que se calme antes de moverla'],
              correcta: 1, parcial: [2],
              porOpcion: { 0: 'La reinhalación puede producir hipoxemia peligrosa y está contraindicada en una paciente hipoxémica.', 2: 'Esperar a que “se calme” mantiene el marco de la ansiedad y retrasa el traslado.' },
              explicacion: 'El ECG mostró taquicardia sinusal. La sospecha de tromboembolismo con hipoxemia justifica prioridad alta y preaviso.' },
            experto: '“Nada de bolsa de papel: está hipoxémica.”'
          },
          {
            titulo: 'Transferencia',
            decision: { tipo: 'opcion', pregunta: '¿Cómo la presenta en el hospital?',
              opciones: ['“Crisis de ansiedad con hiperventilación que no mejora”', '“Hiperventilación con parestesias en paciente ansiosa conocida”', '“Sospecha de tromboembolismo con hipoxemia; la ansiedad no explica los signos”'],
              correcta: 2,
              explicacion: 'Una transferencia con la etiqueta “ansiedad” propaga el encuadre al equipo receptor. Se transmiten los hallazgos y la hipótesis que sí los explica.' },
            experto: '“Sospecha de tromboembolismo con hipoxemia; los antecedentes psiquiátricos no explican los signos.”'
          }
        ],
        cierre: 'La angiotomografía confirmó un tromboembolismo bilateral con dilatación del ventrículo derecho. El despacho, la pareja y el antecedente psiquiátrico encuadraron el caso antes de la evaluación. La corrección llegó de quien tenía menos carga cognitiva y había medido el dato. Un dato objetivo discordante vale más que un patrón convincente: la ansiedad es un diagnóstico de exclusión cuando hay alteraciones fisiológicas que no explica.'
      },
      {
        tipo: 'clasificar', titulo: 'Anulación racional, disracional o verificación',
        instrucciones: 'Decida qué ocurre entre el Sistema 1 y el Sistema 2 en cada situación.',
        categorias: ['Anulación racional', 'Anulación disracional', 'Verificación'],
        items: [
          { texto: 'Reconoce el patrón de hipoglucemia y mide la glucemia antes de dar dextrosa', cat: 2, porque: 'No hay anulación: el Sistema 2 confirma lo que propuso el Sistema 1.' },
          { texto: 'Conoce la regla de medir la glucemia ante una alteración de la conciencia, pero la omite porque está cansado y “es obvio que está ebrio”', cat: 1, porque: 'El Sistema 1 se impone sobre una regla que se conoce.' },
          { texto: 'La compañera que registra los signos vitales dice: “la saturación no cuadra con ansiedad”', cat: 0, porque: 'El análisis corrige al patrón ante un dato discordante.' },
          { texto: 'Ante una opresión torácica típica, advierte que el dolor irradia a la espalda y el pulso radial izquierdo es débil, y busca una disección antes de dar antitrombóticos', cat: 0, porque: 'El Sistema 2 detecta que la propuesta intuitiva no encaja y la corrige.' },
          { texto: 'El equipo, cansado y con prisa, nota la asimetría de pulsos pero da igualmente los antitrombóticos', cat: 1, porque: 'Se ignora un dato conocido por cansancio y presión.' },
          { texto: 'Sabe que debe usar la cinta de dosificación pediátrica, pero calcula la dosis “a ojo” para ganar tiempo', cat: 1, porque: 'La regla se conoce y se omite por presión: disracional.' },
          { texto: 'La disnea no mejora con broncodilatadores y abandona la etiqueta “crisis asmática” para volver a la evaluación primaria', cat: 0, porque: 'La falta de respuesta es un disparador que activa el análisis.' },
          { texto: 'Reconoce de un vistazo una elevación del ST inferior y la confirma revisando derivación por derivación', cat: 2, porque: 'Verificación del patrón: el análisis confirma, no corrige.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Hay un disparador de reflexión?',
        instrucciones: 'La reflexión ayuda de forma selectiva. Decida si la situación exige activar el análisis ahora o si el patrón basta para actuar.',
        categorias: ['Activar el análisis', 'El patrón basta'],
        items: [
          { texto: 'SpO2 de 88 % en una supuesta crisis de ansiedad', cat: 0, porque: 'Dato que no encaja: reformular el diagnóstico de trabajo.' },
          { texto: 'Decidir que un anciano con una caída se queda en casa', cat: 0, porque: 'Decisión irreversible y de alto riesgo: punto de parada con el compañero (capítulo 15).' },
          { texto: 'La disnea no mejora tras dos broncodilatadores', cat: 0, porque: 'Falta de respuesta: volver a la evaluación primaria y ampliar el diferencial.' },
          { texto: 'El compañero dice: “no me convence”', cat: 0, porque: 'El desacuerdo se trata como un dato.' },
          { texto: 'Hora 20 del turno, después de una agresión, antes de sedar a un paciente', cat: 0, porque: 'Estado propio comprometido y decisión de alto riesgo: verificación explícita.' },
          { texto: 'Fibrilación ventricular en el monitor de un paciente sin pulso, con un equipo entrenado', cat: 1, porque: 'Entorno válido y retroalimentación inmediata: el Sistema 1 entrenado es fiable y la demora cuesta.' },
          { texto: 'Hemorragia externa masiva en el muslo tras un choque: colocar un torniquete', cat: 1, porque: 'Patrón inequívoco y acción urgente: analizar ahora solo retrasa.' },
          { texto: 'Esguince de tobillo con signos vitales normales y todo encaja', cat: 1, porque: 'Sin dato discordante ni decisión de alto riesgo, la reflexión estructurada no añade exactitud en los casos simples.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Proceso dual, carga y estrés',
        preguntas: [
          { p: 'En el problema del bate y la pelota, más de la mitad responde 10 centavos. ¿Qué revela el error?', opciones: ['Un déficit de cálculo aritmético en los estudiantes', 'Que el Sistema 2 aprobó la propuesta del Sistema 1 sin verificarla', 'Que el Sistema 1 es menos inteligente que el Sistema 2', 'Que la pregunta estaba mal formulada a propósito'], correcta: 1, explicacion: 'El supervisor perezoso: revisar cuesta, y el Sistema 2 a menudo aprueba sin mirar. En el caso, la SpO2 de 88 % era “la suma que no daba”.' },
          { p: 'Según Kahneman y Klein, ¿en qué decisión es más fiable la intuición?', opciones: ['La decisión de no trasladar a un paciente', 'El descarte de gravedad en un niño que “se ve bien”', 'El reconocimiento de ritmos durante el paro', 'La etiqueta que trae el despacho'], correcta: 2, explicacion: 'Entorno con regularidades válidas y retroalimentación inmediata. El no traslado casi nunca recibe retroalimentación.' },
          { p: 'La sensación de gravedad en un niño tiene un LR+ alto. ¿Cómo se usa?', opciones: ['Como alarma, pero su ausencia no descarta', 'Como prueba de descarte si el niño se ve bien', 'Solo si la acompaña una fiebre alta', 'No se usa: es subjetiva y poco fiable'], correcta: 0, explicacion: 'Retroalimentación diferida, a veces nula: útil como alarma, no como descarte.' },
          { p: 'Si la evidencia no respalda la consigna “piense despacio”, ¿qué debe enseñarse?', opciones: ['A desconfiar sistemáticamente de toda intuición', 'A responder siempre lo más rápido posible', 'Conocimiento organizado y disparadores concretos de reflexión', 'A aplicar todas las reglas a todos los pacientes'], correcta: 2, explicacion: 'El déficit de conocimiento es la causa más frecuente de error, y la reflexión estructurada mejora la exactitud en los casos complejos, no en los simples.' },
          { p: 'Cada interrupción al administrar medicamentos se asoció con 12,1 % más fallos de procedimiento. ¿Qué medida responde a ese dato?', opciones: ['Cargar las dosis más rápido para evitar interrupciones', 'Zona estéril: nadie interrumpe a quien carga una dosis', 'Apagar la radio durante todo el traslado', 'Que una sola persona cargue, administre y registre todo'], correcta: 1, explicacion: 'Con 4 interrupciones el riesgo de error grave se duplicó. Una persona decide, otra ejecuta y verifica.' },
          { p: 'En un paro pediátrico hay unos diez elementos que cambian cada pocos minutos. ¿Cuál es la única estrategia viable?', opciones: ['Entrenar para retener los diez a la vez', 'Que el líder los repita en voz alta cada minuto', 'Sacarlos de la memoria: registrador, cinta de dosificación y roles fijos', 'Reducir el número de datos que se controlan'], correcta: 2, explicacion: 'La memoria de trabajo mantiene unos 4 elementos. La carga ajena se elimina y la propia se organiza en algoritmos que ocupan un solo espacio.' },
          { p: 'Lleva 17 horas despierto. ¿A qué equivale su deterioro?', opciones: ['A nada medible si ha tomado café', 'A una alcoholemia de 0,10 %', 'A una alcoholemia de 0,05 %', 'A una noche sin dormir de 36 horas'], correcta: 2, explicacion: '17 horas de vigilia equivalen a 0,05 % y 24 horas a 0,10 %. Los profesionales fatigados tuvieron más errores o eventos adversos (OR 2,2).' },
          { p: 'Son las 4 de la madrugada, hora 21 del turno. Debe decidir si un anciano con una caída se queda en casa. ¿Qué hace primero?', opciones: ['Pide a su compañero una verificación explícita de la decisión', 'Decide rápido para no prolongar la atención', 'Deja la decisión al paciente y a su familia', 'Aplica solo el Glasgow y la marcha'], correcta: 0, explicacion: 'Franja y estado de mayor riesgo cognitivo. Evaluación estructurada completa (causa de la caída, anticoagulación, marcha, signos vitales, NEWS2) y, si persiste la duda, la opción más segura.' },
          { p: 'Durante un paro con una familia desesperada, el equipo se concentra en la vía aérea y olvida los ciclos. ¿Qué lo compensa?', opciones: ['Que todos ayuden con la vía aérea', 'Un líder que no ejecuta procedimientos y conserva la visión amplia', 'Pedir a la familia que salga antes de seguir', 'Reiniciar el algoritmo desde el principio'], correcta: 1, explicacion: 'El estrés agudo estrecha la atención y refuerza los hábitos automáticos; el líder sin manos ocupadas mantiene el cuadro completo.' }
        ]
      },
      {
        tipo: 'numero', titulo: 'Verificar lo que propone la intuición',
        instrucciones: 'Escriba solo el número.',
        problemas: [
          { enunciado: 'Un bate y una pelota cuestan 1,10 dólares. El bate cuesta 1 dólar más que la pelota. ¿Cuántos centavos cuesta la pelota?', respuesta: 5, tolerancia: 0, unidad: 'centavos', solucion: 'Pelota 0,05 + bate 1,05 = 1,10. La respuesta intuitiva, 10 centavos, daría 1,20.' },
          { enunciado: 'Criterios de Wells: mujer de 34 años con FC de 122 lpm, bota ortopédica por fractura hace tres semanas y el tromboembolismo como diagnóstico más probable. ¿Puntos?', respuesta: 6, tolerancia: 0, decimales: 1, solucion: 'FC mayor de 100: 1,5 · inmovilización: 1,5 · tromboembolismo más probable: 3. Total 6: probable.' },
          { enunciado: 'Mujer de 45 años, FC 108 lpm, cirugía de rodilla hace dos semanas, sin signos de trombosis y con una alternativa igual de probable. ¿Puntos de Wells?', respuesta: 3, tolerancia: 0, decimales: 1, solucion: '1,5 + 1,5 + 0 = 3: improbable en el esquema de dos niveles (4 o menos). Pero no cumple PERC por la taquicardia y la cirugía: no se descarta en la escena.' },
          { enunciado: 'Mujer de 70 años con disnea súbita, SpO2 88 %, FC 120 lpm y pierna izquierda edematosa desde hace 3 días; el tromboembolismo es el diagnóstico más probable. ¿Puntos de Wells?', respuesta: 7.5, tolerancia: 0, decimales: 1, solucion: 'Signos de trombosis 3 + FC mayor de 100 1,5 + tromboembolismo más probable 3 = 7,5 (capítulo 17).' },
          { enunciado: 'Se despertó a las 6:00 y son las 23:00. ¿A qué alcoholemia (en %) equivale su deterioro?', respuesta: 0.05, tolerancia: 0.005, decimales: 2, unidad: '%', solucion: '17 horas de vigilia equivalen a una alcoholemia de 0,05 %; 24 horas, a 0,10 %.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Interrumpir sin provocar un error',
        instrucciones: 'Su compañero está cargando un fármaco y usted necesita decirle algo. Ordene los pasos.',
        pasos: [
          'Decidir si la interrupción es imprescindible; si no lo es, esperar a que termine',
          'Esperar una pausa natural en la tarea',
          'Anunciar la interrupción',
          'Transmitir un solo mensaje',
          'Confirmar que el mensaje fue recibido'
        ],
        explicacion: 'Interrumpir a quien carga un fármaco o calcula una dosis debe ser la excepción: cada interrupción aumenta los fallos de procedimiento y los errores clínicos.'
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Rasgo que define al Sistema 2', reverso: 'El uso de la memoria de trabajo, no la lentitud ni la corrección.' },
          { frente: 'Anulación racional y disracional', reverso: 'Racional: el análisis corrige una intuición que no encaja. Disracional: la intuición se impone sobre una regla que se conoce.' },
          { frente: 'Dos condiciones para una intuición fiable (Kahneman y Klein)', reverso: 'Entorno con regularidades válidas y oportunidad de aprenderlas con retroalimentación rápida e inequívoca.' },
          { frente: 'Sanción de retroalimentación', reverso: 'El clínico rara vez conoce el desenlace y puede repetir un error durante años. En prehospitalaria, el paciente desaparece en la puerta del hospital.' },
          { frente: 'Capacidad de la memoria de trabajo', reverso: 'Unos 4 elementos a la vez.' },
          { frente: 'Interrupciones y medicación', reverso: '+12,1 % fallos de procedimiento y +12,7 % errores clínicos por interrupción; el error grave se duplica con 4.' },
          { frente: 'Cinco disparadores de reflexión', reverso: 'Dato que no encaja · decisión irreversible o de alto riesgo · deterioro o falta de respuesta · incertidumbre o desacuerdo · estado propio comprometido' },
          { frente: 'HALTS', reverso: 'Hambre, enojo, retraso, cansancio, estrés.' },
          { frente: 'Respiración táctica', reverso: 'Inhalar 4 s, retener 4, exhalar 4, pausa 4; 3 o 4 veces. Para recuperar el control de la atención, no para relajarse.' },
          { frente: 'Vigilia y deterioro', reverso: '17 horas ≈ alcoholemia de 0,05 %; 24 horas ≈ 0,10 %.' }
        ]
      }
    ]
  });
})();
