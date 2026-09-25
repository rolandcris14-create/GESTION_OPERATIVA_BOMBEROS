/* Capítulo 10. De novato a experto: construcción de la pericia clínica */
(function () {

  /* ---------- Taller de representación del problema ---------- */
  var RELATOS = [
    {
      relato: '«Tengo 26 años, me desmayé en el trabajo, me duele la parte baja de la barriga desde la mañana. No estoy embarazada, me cuido.»',
      dims: [
        { rot: 'Edad y sexo', ops: ['Mujer joven en edad fértil', 'Mujer anciana'], ok: 0 },
        { rot: 'Inicio', ops: ['Agudo', 'Crónico'], ok: 0 },
        { rot: 'Episodio', ops: ['Primer episodio', 'Recurrente'], ok: 0 }
      ],
      clave: { ops: ['Síncope', '«No estoy embarazada»', 'Trabaja de pie'], ok: 0, porque: 'El síncope es el dato de gravedad. La negación del embarazo no es un dato fiable.' },
      modelo: 'Mujer joven en edad fértil con dolor abdominal agudo y síncope.',
      guion: { ops: ['Embarazo ectópico roto', 'Síncope vasovagal', 'Gastroenteritis'], ok: 0 },
      nota: 'La frase activa el guion del ectópico; el relato literal no lo hace.'
    },
    {
      relato: '«Mi esposo tiene 71 años. Desde hace una hora está mareado, vomitó dos veces y no puede caminar sin apoyarse. Es diabético e hipertenso. Nunca le había pasado.»',
      dims: [
        { rot: 'Edad', ops: ['Joven', 'Anciano'], ok: 1 },
        { rot: 'Inicio', ops: ['Agudo', 'Crónico'], ok: 0 },
        { rot: 'Episodio', ops: ['Primer episodio', 'Recurrente'], ok: 0 }
      ],
      clave: { ops: ['Vomitó dos veces', 'No puede caminar sin apoyo', 'Está mareado'], ok: 1, porque: 'La incapacidad para la marcha separa lo central de lo periférico.' },
      modelo: 'Anciano con factores de riesgo vascular y síndrome vestibular agudo de primer episodio, con incapacidad para la marcha.',
      guion: { ops: ['Vértigo periférico', 'Ictus de circulación posterior', 'Gastroenteritis'], ok: 1 },
      nota: 'Anciano, agudo, primer episodio e incapacidad para la marcha: el guion es el ictus de circulación posterior (capítulo 12).'
    },
    {
      relato: '«Mi mamá tiene 84 años. Desde ayer no quiere comer, hoy no me reconoce y está calientita.»',
      dims: [
        { rot: 'Edad', ops: ['Joven', 'Anciana'], ok: 1 },
        { rot: 'Evolución', ops: ['Aguda, de horas', 'Crónica, de meses'], ok: 0 },
        { rot: 'Conciencia', ops: ['Confusión aguda', 'Olvidos de siempre'], ok: 0 }
      ],
      clave: { ops: ['No quiere comer', 'Probable fiebre', 'Vive con su hija'], ok: 1, porque: 'La fiebre orienta la causa médica del delirium.' },
      modelo: 'Anciana con confusión aguda de 24 horas y probable fiebre.',
      guion: { ops: ['Demencia avanzada', 'Tristeza por la edad', 'Delirium por causa médica, sepsis primero'], ok: 2 },
      nota: 'El guion obliga a medir temperatura, glucemia, SpO2 y FR.'
    },
    {
      relato: '«Tengo 34 años. Estaba levantando una caja en la bodega y de golpe me dio un dolor en el lado derecho del pecho y me falta el aire. Nunca me había pasado.»',
      dims: [
        { rot: 'Edad', ops: ['Joven', 'Anciano'], ok: 0 },
        { rot: 'Inicio', ops: ['Súbito', 'Gradual'], ok: 0 },
        { rot: 'Localización', ops: ['Unilateral', 'Bilateral'], ok: 0 }
      ],
      clave: { ops: ['Levantaba una caja', 'Disnea', 'Trabaja en una bodega'], ok: 1, porque: 'La disnea da la gravedad; la caja solo explica el momento del inicio.' },
      modelo: 'Varón joven con dolor torácico unilateral y disnea de inicio súbito durante un esfuerzo, primer episodio.',
      guion: { ops: ['Contractura muscular', 'Neumotórax', 'Crisis de ansiedad'], ok: 1 },
      nota: 'El inicio súbito orienta a causas vasculares o mecánicas, como el neumotórax.'
    },
    {
      relato: '«Tengo 38 años. No me puedo quedar quieta del dolor, me duele el costado izquierdo y baja hacia la ingle, vomité. Hace dos años me pasó igual y eran piedras.»',
      dims: [
        { rot: 'Edad', ops: ['De 20 a 50 años', 'Más de 60 años'], ok: 0 },
        { rot: 'Tipo de dolor', ops: ['Cólico', 'Peritoneal'], ok: 0 },
        { rot: 'Episodio', ops: ['Primer episodio', 'Recurrente'], ok: 1 }
      ],
      clave: { ops: ['Hemodinamia estable', 'Vomitó', 'Dolor en la ingle'], ok: 0, porque: 'La estabilidad hemodinámica es el dato que separa este guion del aneurisma roto.' },
      modelo: 'Mujer joven con dolor cólico del flanco a la ingle, recurrente, con litiasis previa y estable.',
      guion: { ops: ['Aneurisma de aorta roto', 'Cólico renal', 'Apendicitis'], ok: 1 },
      nota: 'Recurrente orienta a un cuadro conocido, pero obliga a preguntar qué cambió esta vez.'
    },
    {
      relato: '«Mi papá tiene 68 años, fuma y es hipertenso. De repente le dio un dolor fuerte en la espalda baja y se desmayó en el baño. Ahora está pálido.»',
      dims: [
        { rot: 'Edad', ops: ['De 20 a 50 años', 'Más de 60 años'], ok: 1 },
        { rot: 'Inicio', ops: ['Súbito', 'Gradual'], ok: 0 },
        { rot: 'Episodio', ops: ['Primer episodio', 'Recurrente'], ok: 0 }
      ],
      clave: { ops: ['Dolor en la espalda', 'Estaba en el baño', 'Síncope y palidez'], ok: 2, porque: 'Síncope e hipotensión relativa son los datos que separan el aneurisma del cólico renal.' },
      modelo: 'Varón mayor con perfil vascular, dolor lumbar súbito y síncope.',
      guion: { ops: ['Lumbalgia mecánica', 'Cólico renal', 'Aneurisma de aorta abdominal roto'], ok: 2 },
      nota: 'Edad, perfil vascular, síncope e hipotensión: guion del aneurisma roto.'
    }
  ];

  function tallerRepresentacion(el, api) {
    var h = api.h;
    var casos = api.barajar(RELATOS).slice(0, 4), i = 0, puntos = 0, total = 0;
    function pintar() {
      el.innerHTML = '';
      if (i >= casos.length) return api.fin(puntos / total, puntos + ' de ' + total + ' elementos de la representación correctos', true);
      var c = casos[i], elegido = {}, grupos = [];
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Relato ' + (i + 1) + ' de ' + casos.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Lo que le dicen en la escena</span>' + c.relato }));
      el.appendChild(h('div', { class: 'enunciado' }, '1. Elija los calificadores semánticos'));
      var filas = c.dims.concat([{ rot: 'Hallazgo clave', ops: c.clave.ops, ok: c.clave.ok }]);
      filas.forEach(function (d, k) {
        var bots = api.barajar(d.ops.map(function (_, j) { return j; })).map(function (j) {
          return h('button', { 'data-j': j, onclick: function () {
            if (corregido) return;
            elegido[k] = j;
            bots.forEach(function (b) { b.classList.toggle('sel', +b.getAttribute('data-j') === j); });
          } }, d.ops[j]);
        });
        var fila = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, d.rot), h('div', { class: 'bots' }, bots));
        grupos.push(fila);
        el.appendChild(fila);
      });
      var corregido = false, zona = h('div'), aviso = h('span', { class: 'pregunta-n' });
      var bt = h('button', { class: 'btn', onclick: function () {
        if (Object.keys(elegido).length < filas.length) { aviso.textContent = 'Elija una opción en cada fila.'; return; }
        corregido = true; bt.disabled = true; aviso.textContent = '';
        var bien = 0;
        filas.forEach(function (d, k) {
          var ok = elegido[k] === d.ok; if (ok) bien++;
          grupos[k].classList.add(ok ? 'bien' : 'mal');
          if (!ok) grupos[k].appendChild(h('div', { class: 'porque' }, 'Correcto: ' + d.ops[d.ok] + '.'));
        });
        puntos += bien; total += filas.length;
        zona.appendChild(h('div', { class: 'fb info', html: '<b>Representación del problema:</b> «' + c.modelo + '» ' + c.clave.porque }));
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, '2. ¿Qué guion de enfermedad activa esta frase en primer lugar?'));
        var ops = [], correctoBt;
        api.barajar(c.guion.ops.map(function (_, j) { return j; })).forEach(function (j) {
          var b = h('button', { class: 'opcion', onclick: function () {
            ops.forEach(function (x) { x.disabled = true; });
            var ok = j === c.guion.ok; total++; if (ok) puntos++;
            correctoBt.classList.add('bien'); if (!ok) this.classList.add('mal');
            zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + c.nota }));
            zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; pintar(); } }, i + 1 < casos.length ? 'Siguiente relato' : 'Ver resultado')));
          } }, c.guion.ops[j]);
          if (j === c.guion.ok) correctoBt = b;
          ops.push(b);
        });
        ops.forEach(function (b) { zona.appendChild(b); });
      } }, 'Construir la representación');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    pintar();
  }

  /* ---------- Mapa de pericia por dominio y plan de práctica deliberada ---------- */
  var DOMINIOS = [
    { id: 'trauma', n: 'Trauma', obj: 'Completar la evaluación primaria en un maniquí sin omitir ninguna letra en 10 de 10 escenarios' },
    { id: 'pedia', n: 'Pediatría', obj: 'Lograr el primer intento exitoso de vía aérea pediátrica en menos de 30 segundos en simulador' },
    { id: 'obst', n: 'Obstetricia', obj: 'Enunciar la representación y el guion correctos en 9 de 10 casos de dolor abdominal en mujeres en edad fértil' },
    { id: 'ecg', n: 'Dolor torácico y ECG', obj: 'Reconocer una elevación del ST en menos de 30 segundos con 95 % de acierto' }
  ];
  var PREG_ETAPA = [
    '¿Necesito seguir la lista paso a paso para no olvidar nada?',
    '¿Distingo con rapidez qué datos importan y cuáles son accesorios?',
    '¿Advierto antes que otros que algo no encaja, aunque todavía no sepa qué es?',
    '¿Puedo explicar a un aprendiz por qué mi intuición me llevó a una decisión?'
  ];
  var ETAPAS = {
    nov: { n: 'Novato o principiante avanzado', riesgo: 'Rigidez; no ver lo que la regla no nombra, o tratar todos los datos como igual de importantes.', avance: 'Reglas claras, supervisión directa y casos comentados con un mentor.' },
    pa: { n: 'Principiante avanzado', riesgo: 'Tratar todos los datos como igual de importantes.', avance: 'Casos comentados con un mentor.' },
    comp: { n: 'Competente', riesgo: 'Lentitud y sobrecarga en situaciones nuevas.', avance: 'Casos variados, responsabilidad progresiva y reflexión sobre los casos.' },
    prof: { n: 'Proficiente', riesgo: 'Exceso de confianza en su lectura global.', avance: 'Retroalimentación de desenlaces. Si no puede explicar su intuición, enseña poco y se corrige con dificultad.' },
    exp: { n: 'Experto', riesgo: 'Punto ciego ante lo atípico; dificultad para enseñar.', avance: 'Casos atípicos, retroalimentación sobre sus errores y enseñanza en voz alta.' }
  };
  function etapaDe(r) {
    if (r[2] && r[3]) return 'exp';
    if (r[2]) return 'prof';
    if (r[1]) return 'comp';
    if (r[0]) return 'nov';
    return 'pa';
  }
  var PLAN = [
    { rot: 'Objetivo', ops: ['{obj}', 'Mejorar en {dom} durante este año', 'Hacer más turnos con pacientes de {dom}'] },
    { rot: 'Punto de partida', ops: ['Medir el desempeño actual antes de empezar', 'Empezar directamente: la mejora se notará sola', 'Pedir a un compañero su opinión general'] },
    { rot: 'Qué repetir', ops: ['Lo que más falla, seleccionado a propósito', 'Lo que ya domina, para ganar confianza', 'Lo que vaya saliendo en los turnos, al azar'] },
    { rot: 'Retroalimentación', ops: ['Respuesta correcta y explicación justo después de cada intento', 'Revisión de todos los intentos al final del mes', 'Autoevaluación sin contrastar con nadie'] },
    { rot: 'Dificultad', ops: ['Creciente: de casos claros a casos con artefactos o atípicos', 'Siempre casos típicos, para consolidar lo básico', 'Empezar por los casos más difíciles posibles'] },
    { rot: 'Repaso', ops: ['Volver a los casos fallados días después', 'Repetirlos todos el mismo día hasta acertar', 'No volver a ellos: ya se corrigieron una vez'] },
    { rot: 'Desenlaces', ops: ['Revisión quincenal con compañeros y registro de diagnósticos de trabajo', 'Asumir que acertó si nadie presentó quejas', 'Esperar a que el servicio informe algún día'] }
  ];

  function mapaPericia(el, api) {
    var h = api.h;
    var resp = {}, etapas = {};
    DOMINIOS.forEach(function (d) { resp[d.id] = [null, null, null, null]; });
    var dom = DOMINIOS[0].id;
    var selDom = h('select', { 'aria-label': 'Dominio', onchange: function () { dom = selDom.value; pintarPreg(); } },
      DOMINIOS.map(function (d) { return h('option', { value: d.id }, d.n); }));
    var zonaPreg = h('div'), zonaRes = h('div'), zonaPlan = h('div');
    el.appendChild(h('div', { class: 'enunciado' }, 'Paso 1. Ubíquese en cada dominio'));
    el.appendChild(h('div', { class: 'fila' }, h('b', null, 'Dominio:'), selDom));
    el.appendChild(zonaPreg);
    el.appendChild(zonaRes);
    el.appendChild(zonaPlan);
    function nombre(id) { for (var k = 0; k < DOMINIOS.length; k++) if (DOMINIOS[k].id === id) return DOMINIOS[k]; }
    function pintarPreg() {
      zonaPreg.innerHTML = '';
      var r = resp[dom];
      PREG_ETAPA.forEach(function (p, k) {
        var bs = ['Sí, casi siempre', 'No'].map(function (t, j) {
          var b = h('button', { class: r[k] === (j === 0) ? 'sel' : '', onclick: function () { r[k] = j === 0; pintarPreg(); } }, t);
          return b;
        });
        zonaPreg.appendChild(h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, (k + 1) + '. ' + p), h('div', { class: 'bots' }, bs)));
      });
      if (r.every(function (x) { return x !== null; })) etapas[dom] = etapaDe(r);
      pintarRes();
    }
    function pintarRes() {
      zonaRes.innerHTML = '';
      var ids = Object.keys(etapas);
      if (!ids.length) return;
      var tabla = h('table', { class: 't' }, h('tr', null, h('th', null, 'Dominio'), h('th', null, 'Etapa estimada'), h('th', null, 'Qué la hace avanzar')));
      ids.forEach(function (id) {
        var e = ETAPAS[etapas[id]];
        tabla.appendChild(h('tr', null, h('td', null, nombre(id).n), h('td', null, h('b', null, e.n), h('div', { class: 'pregunta-n' }, 'Riesgo: ' + e.riesgo)), h('td', null, e.avance)));
      });
      zonaRes.appendChild(h('div', { class: 'tabla-scroll' }, tabla));
      zonaRes.appendChild(h('div', { class: 'pregunta-n' }, 'La pericia es específica de dominio: la misma persona puede estar en etapas distintas según el tipo de paciente.'));
      if (!zonaPlan.hasChildNodes()) zonaPlan.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: pintarPlan }, 'Paso 2. Diseñar mi plan de práctica')));
    }
    function pintarPlan() {
      /* Elige el dominio con la etapa más baja registrada. */
      var orden = ['nov', 'pa', 'comp', 'prof', 'exp'], peor = null;
      Object.keys(etapas).forEach(function (id) { if (peor === null || orden.indexOf(etapas[id]) < orden.indexOf(etapas[peor])) peor = id; });
      var D = nombre(peor), eleccion = {}, filas = [], botonesPlan = [], corregido = false;
      zonaPlan.innerHTML = '';
      zonaPlan.appendChild(h('div', { class: 'enunciado', style: 'margin-top:14px' }, 'Paso 2. Plan de práctica deliberada para: ' + D.n));
      zonaPlan.appendChild(h('div', { class: 'pregunta-n' }, 'Elija, en cada componente, la opción que cumple los criterios de la práctica deliberada.'));
      PLAN.forEach(function (p, k) {
        var idx = api.barajar([0, 1, 2]);
        var bots = idx.map(function (j) {
          var txt = p.ops[j].replace('{obj}', D.obj).replace('{dom}', D.n.toLowerCase());
          return h('button', { class: 'opcion', 'data-j': j, onclick: function () {
            if (corregido) return;
            eleccion[k] = j;
            bots.forEach(function (b) { b.classList.toggle('sel', +b.getAttribute('data-j') === j); });
          } }, txt);
        });
        botonesPlan.push(bots);
        var fila = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, (k + 1) + '. ' + p.rot), bots);
        filas.push(fila); zonaPlan.appendChild(fila);
      });
      var aviso = h('span', { class: 'pregunta-n' }), salida = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (Object.keys(eleccion).length < PLAN.length) { aviso.textContent = 'Complete los siete componentes.'; return; }
        corregido = true; bt.disabled = true; aviso.textContent = '';
        var bien = 0, lineas = [];
        PLAN.forEach(function (p, k) {
          var ok = eleccion[k] === 0; if (ok) bien++;
          filas[k].classList.add(ok ? 'bien' : 'mal');
          botonesPlan[k].forEach(function (b) { b.disabled = true; if (b.getAttribute('data-j') === '0') b.classList.add('bien'); else if (+b.getAttribute('data-j') === eleccion[k]) b.classList.add('mal'); });
          lineas.push('<li><b>' + p.rot + ':</b> ' + p.ops[0].replace('{obj}', D.obj).replace('{dom}', D.n.toLowerCase()) + '</li>');
        });
        salida.appendChild(h('div', { class: 'caja objetivo', html: '<span class="rot">Su plan, versión correcta</span><ol style="margin:4px 0 0;padding-left:20px">' + lineas.join('') + '</ol>' }));
        salida.appendChild(h('div', { class: 'fb info', html: 'Sin retroalimentación la experiencia consolida hábitos, buenos o malos. Si el servicio no devuelve los desenlaces, construya su propio circuito.' }));
        api.fin(bien / PLAN.length, bien + ' de ' + PLAN.length + ' componentes del plan bien elegidos', true);
      } }, 'Revisar el plan');
      zonaPlan.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      zonaPlan.appendChild(salida);
    }
    pintarPreg();
  }

  TDC.registrar({
    numero: 10, parte: 'IV',
    titulo: 'De novato a experto: construcción de la pericia clínica',
    mision: 'Convierta relatos en representaciones, arme guiones de enfermedad y diseñe su práctica deliberada.',
    objetivo: 'Ubicar el propio nivel de pericia, construir representaciones del problema con calificadores semánticos y diseñar un plan de práctica deliberada con retroalimentación.',
    escena: 'Usted comparte turno con un compañero que lleva seis meses en el servicio. Ante la misma paciente, ambos tienen los mismos datos; la diferencia está en cómo se <b>organizan</b>. Su tarea es razonar como experto y, además, hacer visible ese razonamiento para que el otro aprenda.',
    actividades: [
      {
        tipo: 'caso', titulo: 'Dos paramédicos frente a la misma paciente',
        presentacion: '<b>Despacho, 11:30:</b> «mujer de 26 años se desmayó en su trabajo, ya está consciente». Llega con un compañero de seis meses de experiencia.',
        fases: [
          {
            titulo: 'Primer contacto',
            monitor: { FC: '108 lpm (sentada)', PA: '104/68', FR: '20 rpm', SpO2: '98 %', 'T.ª': '36,6 °C' },
            datos: 'Está sentada, pálida, con dolor en la parte baja del abdomen desde la mañana. Afirma: «No estoy embarazada, me cuido». Su compañero empieza la anamnesis en el orden fijo de su lista.',
            decision: { tipo: 'opcion', pregunta: '¿Qué representación del problema enuncia en voz alta?',
              opciones: ['Mujer de 26 años que se desmayó en el trabajo y tiene dolor de barriga', 'Síncope vasovagal en mujer joven con probable gastroenteritis', 'Mujer joven en edad fértil con dolor abdominal agudo y síncope'],
              correcta: 2,
              porOpcion: { 0: 'Repetir el relato no transforma los datos: no activa ningún guion.', 1: 'Es un diagnóstico prematuro, no una representación.' },
              explicacion: 'Los calificadores (joven, edad fértil, agudo, síncope) transforman los datos en términos que activan el guion correcto.' },
            experto: '“Mujer en edad fértil con dolor abdominal agudo y síncope: embarazo ectópico roto hasta que se demuestre lo contrario.”'
          },
          {
            titulo: '«No estoy embarazada»',
            datos: 'Su compañero anota: «embarazo descartado».',
            decision: { tipo: 'opcion', pregunta: '¿Cómo usa esa afirmación?',
              opciones: ['Descarto el embarazo: la paciente dice que se cuida', 'La registro como dato no fiable y mantengo la hipótesis del ectópico', 'Le pido que lo confirme dos veces y, si insiste, lo descarto'],
              correcta: 1,
              explicacion: 'Una proporción no despreciable de mujeres que afirman no estar embarazadas tiene una prueba positiva. La anamnesis no descarta el embarazo.' }
          },
          {
            titulo: 'Los datos que el novato explicó de otra forma',
            datos: 'Al ponerse de pie para pasar a la camilla refiere mareo intenso y casi se desvanece. Dolor en la fosa ilíaca derecha y en el hombro derecho. Última menstruación hace siete semanas, «pero siempre soy irregular». Su compañero opina: «Está nerviosa, se levantó rápido y lo del hombro no tiene que ver».',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que su guion del ectópico roto explica.',
              opciones: ['FC 108 lpm en una mujer joven y sana: posible hipovolemia compensada', 'Mareo al incorporarse: intolerancia ortostática por pérdida de volumen', 'Dolor en el hombro: irritación diafragmática por hemoperitoneo', 'Retraso menstrual de siete semanas, aunque sea irregular', 'Temperatura de 36,6 °C: aleja una causa hemorrágica', 'SpO2 de 98 %: excluye un cuadro grave'],
              correctas: [0, 1, 2, 3],
              explicacion: 'El novato tenía los mismos datos; le faltaba el guion que los conecta. Una temperatura y una SpO2 normales no descartan una hemorragia.' },
            experto: '“Pregunté por la última menstruación y por el dolor en el hombro porque son los datos que más separan el ectópico de sus simuladores.”'
          },
          {
            titulo: 'La decisión',
            datos: 'Traslado estimado de 20 minutos a un hospital con ginecología y cirugía.',
            decision: { tipo: 'multiple', pregunta: 'Marque las acciones que corresponden.',
              opciones: ['Decúbito supino', 'Dos accesos venosos', 'Prueba de embarazo si está disponible', 'Preaviso a ginecología y cirugía', 'Reposición restrictiva', 'Traslado sentada y sin preaviso', 'Carga rápida de líquidos hasta normalizar la FC'],
              correctas: [0, 1, 2, 3, 4],
              explicacion: 'Es la conducta del experto: posición, accesos, prueba, preaviso y reposición restrictiva. Sentada y sin preaviso fue la conducta del novato.' }
          },
          {
            titulo: 'Después del caso',
            datos: 'Prueba de embarazo positiva en urgencias y ecografía con líquido libre abundante. En quirófano: ectópico tubárico roto con 1,5 L de hemoperitoneo. De regreso a la base, su compañero pregunta: «¿Cómo lo supiste?».',
            decision: { tipo: 'opcion', pregunta: '¿Cómo cierra el caso con él?',
              opciones: ['«Con los años se aprende a verlo; ya te va a salir solo.»', '«Repasa el capítulo de urgencias obstétricas y lo comentamos.»', '«Lo primero que noté fue…; eso me hizo pensar en…; por eso pregunté…; me haría cambiar de opinión…»'],
              correcta: 2, parcial: [1],
              explicacion: 'La pericia se transfiere cuando el experto hace visible su razonamiento. La fórmula del mentor, en menos de un minuto, transmite más que una clase teórica.' },
            experto: '“Una mujer joven se desmayó y tiene dolor abdominal: eso activa el guion del ectópico. La taquicardia y el mareo al incorporarse me hicieron pensar en pérdida de volumen. Lo que me haría cambiar de opinión sería una prueba de embarazo negativa, y aun así buscaría otra causa de hemorragia.”'
          }
        ],
        cierre: 'El experto no pensó más rápido por intuición mágica: la representación del problema activó un guion y el guion ordenó la búsqueda. El embarazo ectópico es la principal causa de muerte materna en el primer trimestre; considérelo en toda mujer en edad fértil con dolor abdominal, pélvico o en el hombro, sangrado vaginal, mareo o síncope.'
      },
      {
        tipo: 'personalizado', titulo: 'Taller de representación del problema', render: tallerRepresentacion,
        instrucciones: 'Lea lo que le dicen en la escena, elija los calificadores semánticos y el hallazgo clave, y compruebe qué guion activa la frase resultante. Plantilla: [edad y sexo] con [síndrome] de [inicio y evolución], en el contexto de [factores de riesgo], con [hallazgo clave] y [gravedad].'
      },
      {
        tipo: 'clasificar', titulo: '¿En qué etapa de Dreyfus está?',
        instrucciones: 'Asigne cada conducta o rasgo a la etapa del modelo de Dreyfus adaptado por Benner.',
        categorias: ['Novato', 'Principiante avanzado', 'Competente', 'Proficiente', 'Experto'],
        items: [
          { texto: 'Aplica el algoritmo de dolor torácico paso a paso a una paciente con dolor pleurítico evidente', cat: 0, porque: 'Sigue la regla sin contexto aunque no encaje.' },
          { texto: 'Necesita la lista para no olvidar nada y no ve lo que la regla no nombra', cat: 0, porque: 'Rigidez: el riesgo principal del novato.' },
          { texto: 'Reconoce los patrones frecuentes, pero trata todos los datos como igual de importantes', cat: 1, porque: 'Reconoce aspectos situacionales, pero todavía no jerarquiza.' },
          { texto: 'Avanza sobre todo con casos comentados con un mentor', cat: 1, porque: 'Es lo que hace progresar al principiante avanzado.' },
          { texto: 'Organiza la escena y prioriza de forma deliberada, pero en una situación nueva se vuelve lento', cat: 2, porque: 'Planifica y elige qué datos importan; su riesgo es la sobrecarga ante lo nuevo.' },
          { texto: 'Percibe la escena como un todo y detecta pronto que «algo no encaja»; luego decide de forma deliberada', cat: 3, porque: 'Lectura global con decisión deliberada.' },
          { texto: 'Su principal riesgo es el exceso de confianza en su lectura global', cat: 3, porque: 'Se corrige con retroalimentación de desenlaces.' },
          { texto: 'Actúa con fluidez y le cuesta explicar a un aprendiz por qué decidió', cat: 4, porque: 'Decide de forma intuitiva y explica menos su razonamiento.' },
          { texto: 'Su punto ciego es lo atípico; progresa revisando casos atípicos y enseñando en voz alta', cat: 4, porque: 'Es el riesgo y la vía de avance del experto.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: 'Arme el guion del neumotórax a tensión',
        instrucciones: 'Un guion de enfermedad tiene tres componentes. Ubique cada elemento en el suyo.',
        categorias: ['Condiciones', 'Falla fisiopatológica', 'Consecuencias clínicas'],
        items: [
          { texto: 'Trauma torácico', cat: 0, porque: 'Condición que lo hace posible.' },
          { texto: 'Ventilación con presión positiva', cat: 0, porque: 'Condición: la intubación puede convertir un neumotórax simple en uno a tensión.' },
          { texto: 'Enfermedad pulmonar previa', cat: 0, porque: 'Condición predisponente.' },
          { texto: 'Procedimientos invasivos', cat: 0, porque: 'Condición que lo hace posible.' },
          { texto: 'Aire que entra en la pleura sin poder salir', cat: 1, porque: 'Es el mecanismo central de la falla.' },
          { texto: 'Colapso pulmonar y desplazamiento mediastínico', cat: 1, porque: 'Parte de la falla fisiopatológica.' },
          { texto: 'Caída del retorno venoso', cat: 1, porque: 'Explica el shock obstructivo.' },
          { texto: 'Hipoxemia progresiva y dificultad para ventilar', cat: 2, porque: 'Consecuencia clínica.' },
          { texto: 'Taquicardia e hipotensión', cat: 2, porque: 'Consecuencia de la caída del retorno venoso.' },
          { texto: 'Ausencia de murmullo y de deslizamiento pleural', cat: 2, porque: 'Consecuencia que se busca en la exploración y la ecografía.' },
          { texto: 'Ingurgitación yugular, si no hay hipovolemia', cat: 2, porque: 'Consecuencia que puede faltar en el paciente hipovolémico.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: 'Mapa de pericia y plan de práctica', render: mapaPericia,
        instrucciones: 'Responda con honestidad las cuatro preguntas en cada dominio que atiende. Después, diseñe un plan de práctica deliberada para el dominio en el que se ubicó más bajo.'
      },
      {
        tipo: 'ordenar', titulo: 'Una sesión de práctica deliberada',
        instrucciones: 'Ordene los seis pasos para diseñar una sesión de práctica deliberada de lectura del ECG.',
        pasos: ['Fijar un objetivo medible: elevación del ST en menos de 30 segundos con 95 % de acierto', 'Medir la línea de base antes de empezar', 'Repetir de forma enfocada en la debilidad: 20 ECG por semana entre los que más se fallan', 'Recibir retroalimentación inmediata tras cada intento', 'Aumentar la dificultad: trazados con artefactos, bloqueo de rama o marcapasos', 'Volver días después a los casos fallados'],
        explicacion: 'Sin objetivo ni línea de base no se sabe si hay progreso; sin retroalimentación inmediata la repetición consolida los errores.'
      },
      {
        tipo: 'quiz', titulo: 'Pericia en la práctica',
        preguntas: [
          { p: 'Un colega con quince años de servicio decide peor que cuando empezó. ¿Cuál es la explicación más probable?', opciones: ['La pericia se deteriora de forma natural después de diez años', 'Sin retroalimentación de desenlaces, la experiencia consolida aciertos y errores', 'La intuición siempre es menos exacta que el protocolo'], correcta: 1, explicacion: 'En 32 de 62 comparaciones el desempeño disminuía con los años de práctica. La pericia requiere práctica deliberada y conocer el resultado de las propias decisiones.' },
          { p: 'Un paramédico experto en trauma atiende a un lactante grave. ¿Qué es lo esperable?', opciones: ['Que su pericia en trauma se transfiera entera a la pediatría', 'Que en ese dominio decida como un principiante avanzado', 'Que retroceda a novato en todos los dominios'], correcta: 1, explicacion: 'La pericia es específica de dominio. En pediatría los propios paramédicos reconocen experiencia y formación insuficientes.' },
          { p: 'Usted organiza la supervisión de un turno con un novato, un competente y un experto. ¿Qué reparto es el correcto?', opciones: ['Supervisión directa a los tres por igual, para no discriminar', 'Novato: reglas y supervisión directa; competente: casos variados; experto: casos atípicos', 'Novato: casos atípicos; competente: reglas claras; experto: sin supervisión'], correcta: 1, explicacion: 'Supervisar a todos por igual desperdicia a los expertos y deja solos a los novatos.' },
          { p: '¿Qué datos separan mejor el síncope arrítmico del vasovagal?', opciones: ['La palidez, la náusea posterior y la edad', 'El esfuerzo, la ausencia de pródromo y el ECG', 'La duración de la pérdida de conciencia y la hora'], correcta: 1, explicacion: 'Vasovagal: joven, desencadenante, pródromo, recuperación rápida. Arrítmico: cardiopatía o muerte súbita familiar, esfuerzo o decúbito, palpitaciones, sin pródromo y ECG alterado.' },
          { p: 'Varón de 68 años, fumador, con dolor súbito en el flanco. ¿Qué datos lo separan de un cólico renal?', opciones: ['Síncope e hipotensión relativa con perfil vascular', 'Vómitos e inquietud por el dolor', 'Dolor que irradia hacia la ingle'], correcta: 0, explicacion: 'Edad, perfil vascular, síncope e hipotensión separan el aneurisma roto de su principal simulador. Los otros datos son compatibles con ambos.' },
          { p: 'Para practicar la vía aérea pediátrica, una habilidad poco frecuente y crítica, ¿qué plan cumple los criterios?', opciones: ['Leer la guía y esperar a que aparezcan casos reales', 'Un curso intensivo anual con un examen final teórico', 'Primer intento exitoso en menos de 30 s en simulador, sesiones breves y frecuentes'], correcta: 2, explicacion: 'Objetivo medible, sesiones breves y frecuentes, dificultad creciente, retroalimentación inmediata y revisión de cada caso real con el mismo formato.' },
          { p: 'La semana pasada atendió un cólico renal en un paciente muy parecido al de hoy. ¿Cómo usa ese recuerdo?', opciones: ['Como diagnóstico: el parecido es la mejor prueba', 'Como hipótesis que debe contrastar con su simulador', 'Lo descarta: los recuerdos siempre sesgan'], correcta: 1, explicacion: 'Los guiones de casos concretos aceleran el reconocimiento, pero el último caso visto pesa más de lo que debería (capítulo 8).' },
          { p: 'Una ambulancia queda aislada por un derrumbe con un paciente en shock hemorrágico y oxígeno limitado. ¿Qué hace el experto adaptativo?', opciones: ['Busca el paso siguiente del algoritmo de shock', 'Espera instrucciones antes de modificar el protocolo', 'Razona desde los principios y reevalúa cada pocos minutos'], correcta: 2, explicacion: 'Controlar la hemorragia, reservar el oxígeno para los momentos de mayor necesidad, pedir apoyo por la vía disponible y reevaluar el plan.' },
          { p: 'Un aprendiz presenta un caso relatando todos los datos en orden cronológico. ¿Qué le pide?', opciones: ['Una frase con calificadores, dos o tres hipótesis, su duda principal y un plan', 'Que agregue más datos de la anamnesis para ser completo', 'Que diga solo el diagnóstico final para ahorrar tiempo'], correcta: 0, explicacion: 'El mentor corrige el razonamiento, no solo la conclusión.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Tres componentes de un guion de enfermedad', reverso: 'Condiciones que lo hacen posible · falla fisiopatológica · consecuencias clínicas' },
          { frente: 'Plantilla de la representación del problema', reverso: '[Edad y sexo] con [síndrome] de [inicio y evolución], en el contexto de [factores de riesgo], con [hallazgo clave] y [gravedad]' },
          { frente: 'Cuatro preguntas para ubicarse en la escala de Dreyfus', reverso: '¿Necesito la lista paso a paso? · ¿Distingo lo que importa? · ¿Advierto antes que algo no encaja? · ¿Puedo explicar mi intuición?' },
          { frente: 'Seis pasos de la práctica deliberada', reverso: 'Objetivo medible · línea de base · repetición en la debilidad · retroalimentación inmediata · dificultad creciente · repetición espaciada' },
          { frente: 'Fórmula del mentor', reverso: '«Lo primero que noté fue…; eso me hizo pensar en…; por eso pregunté…; lo que me hizo descartar… fue…; y lo que me haría cambiar de opinión es…»' },
          { frente: 'Pericia rutinaria frente a adaptativa', reverso: 'Rutinaria: rápida y exacta en lo conocido. Adaptativa: entiende el porqué y modifica el procedimiento ante lo nuevo.' },
          { frente: 'Retroalimentación sin un sistema formal', reverso: 'Revisión quincenal con compañeros · seguimiento de pacientes según la normativa · registro personal de diagnósticos de trabajo frente a los finales' },
          { frente: '«No me puedo quedar quieto del dolor» frente a «no me puedo mover porque me duele más»', reverso: 'Dolor cólico (víscera hueca obstruida) frente a dolor peritoneal (irritación peritoneal)' }
        ]
      }
    ]
  });
})();
