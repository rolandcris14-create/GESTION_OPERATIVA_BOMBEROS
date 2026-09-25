/* Capítulo 9. Emociones, afecto y juicio clínico */
(function () {
  /* ---------- Evaluación mínima innegociable bajo provocación ---------- */
  var MINIMA = ['temp', 'gluc', 'spo2', 'pup', 'trauma', 'farm'];
  var ESCENAS = [
    {
      intro: 'Varón de 45 años en la vía pública, con aliento alcohólico. Insulta, empuja y no coopera. La policía quiere llevárselo detenido “porque está borracho”.',
      res: { temp: 'Temperatura: 36,4 °C', gluc: 'Glucemia: <b>42 mg/dL</b>', spo2: 'SpO2: 96 % al aire', pup: 'Pupilas: normales y reactivas', trauma: 'Sin signos de trauma', farm: 'Su hermano, por teléfono: “usa insulina y hoy no comió”', fam: 'El hermano: “bebe, pero nunca se pone así”' },
      clave: 'gluc',
      opciones: ['Tratar la hipoglucemia y reevaluar la conducta', 'Entregarlo a la policía: es una intoxicación etílica', 'Sedarlo para poder trasladarlo como agitación', 'Dejarlo dormir en su domicilio con un familiar'],
      explic: 'La hipoglucemia explicaba la conducta. El olor a alcohol era el dato que confirmaba la etiqueta; la glucemia, el que la refutaba.'
    },
    {
      intro: 'Mujer de 78 años con demencia, en su casa. Grita, arranca la ropa de cama y golpea a la hija. La hija, agotada: “Ya no la aguanto, llévensela o denle algo”.',
      res: { temp: 'Temperatura: 37,9 °C', gluc: 'Glucemia: 124 mg/dL', spo2: 'SpO2: <b>84 % al aire</b>', pup: 'Pupilas: normales y reactivas', trauma: 'Sin signos de trauma', farm: 'Sus fármacos habituales, sin cambios recientes', fam: 'La hija: “desde anoche tose y está más confundida que nunca”' },
      clave: 'spo2',
      opciones: ['Sedarla: la agitación es propia de su demencia', 'Oxígeno, buscar la causa de la hipoxemia y trasladar', 'Recomendar a la hija que aumente su medicación', 'Esperar a que se calme y reevaluar en una hora'],
      explic: 'Delirium por hipoxemia, probablemente infeccioso. La demencia “explicaba todo”: ensombrecimiento diagnóstico.'
    },
    {
      intro: 'Joven de 22 años traído por sus amigos desde una fiesta. Muy agitado, sudoroso, insulta al equipo y se niega a que lo toquen. Un amigo dice: “Está loco, siempre se pone así”.',
      res: { temp: 'Temperatura: <b>40,1 °C</b>', gluc: 'Glucemia: 98 mg/dL', spo2: 'SpO2: 97 % al aire', pup: 'Pupilas: <b>midriáticas</b>', trauma: 'Sin signos de trauma', farm: 'Un amigo admite que “tomó unas pastillas” en la fiesta', fam: 'Otro amigo: “nunca lo había visto así”' },
      clave: 'temp',
      opciones: ['Dejarlo con sus amigos hasta que se le pase', 'Tratarlo como crisis psiquiátrica con un antipsicótico', 'Enfriamiento activo, sin antipsicóticos, y traslado con preaviso', 'Pedir a la policía que lo contenga en el suelo'],
      explic: 'Hipertermia y midriasis sugieren un toxíndrome simpaticomimético o un golpe de calor: urgencia médica, no conducta.'
    }
  ];
  var ACCIONES = [
    { k: 'temp', t: 'Medir la temperatura' }, { k: 'gluc', t: 'Medir la glucemia' }, { k: 'spo2', t: 'Medir la SpO2' },
    { k: 'pup', t: 'Revisar las pupilas' }, { k: 'trauma', t: 'Buscar signos de trauma' }, { k: 'farm', t: 'Preguntar por fármacos y consumo' },
    { k: 'fam', t: 'Preguntar qué es distinto de lo habitual' },
    { k: 'reg', t: 'Nombrar la emoción y ceder el trato al compañero', bueno: true },
    { k: 'x1', t: 'Responderle con firmeza para que respete al equipo', malo: 'Discutir con el paciente consume la atención que el diagnóstico necesita.' },
    { k: 'x2', t: 'Pedir que lo sujeten boca abajo', malo: 'El decúbito prono puede comprometer la ventilación.' },
    { k: 'x3', t: 'Sedar ya con un antipsicótico', malo: 'Sedar antes de la evaluación mínima puede enmascarar la causa o empeorarla.' },
    { k: 'x4', t: 'Registrar: “paciente agresivo y manipulador”', malo: 'Se documentan hechos, no juicios.' }
  ];
  var INSULTOS = ['“¡Lárguense, nadie los llamó!”', '“¡No me toque!”', '“Son unos inútiles.”', '“¡Los voy a denunciar!”', '“¿Qué mira? ¡Váyase!”', '“¡Déjenme en paz!”'];

  function provocacion(el, api) {
    var h = api.h, F = api.fmt;
    var E = ESCENAS[Math.floor(Math.random() * ESCENAS.length)];
    var hechas = {}, malos = 0, regulo = false, n = 0;
    el.appendChild(h('div', { class: 'caja escena', html: E.intro }));
    var voz = h('div', { class: 'fb mal', style: 'font-style:italic' }, 'Paciente: ' + INSULTOS[0]);
    el.appendChild(voz);
    el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Elija sus acciones, una a una'));
    var bots = h('div'); el.appendChild(bots);
    var registro = h('div', { class: 'caja' }, h('div', { class: 'pregunta-n' }, 'Registro de la evaluación'));
    el.appendChild(registro);
    var zona = h('div'); el.appendChild(zona);
    api.barajar(ACCIONES).forEach(function (a) {
      var b = h('button', { class: 'opcion', onclick: function () {
        b.disabled = true; n++;
        voz.textContent = 'Paciente: ' + INSULTOS[n % INSULTOS.length];
        if (a.malo) { malos++; b.classList.add('mal'); registro.appendChild(h('div', { style: 'color:var(--rojo)' }, '✗ ' + a.t + '. ' + a.malo)); return; }
        b.classList.add('bien');
        if (a.bueno) { regulo = true; registro.appendChild(h('div', null, '✓ Emoción nombrada; su compañero asume el trato. La activación baja y recupera capacidad de razonar.')); return; }
        hechas[a.k] = true;
        registro.appendChild(h('div', { html: '✓ ' + E.res[a.k] }));
      } }, a.t);
      bots.appendChild(b);
    });
    var bDec = h('button', { class: 'btn', onclick: function () {
      bDec.disabled = true;
      bots.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
      var cubiertas = MINIMA.filter(function (k) { return hechas[k]; }).length;
      zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Con lo que sabe, ¿qué hace ahora?'));
      var ops = E.opciones.map(function (o, k) { return { o: o, k: k }; });
      var correcta = E.clave === 'gluc' ? 0 : E.clave === 'spo2' ? 1 : 2;
      var bs = api.barajar(ops).map(function (x) {
        var b = h('button', { class: 'opcion', onclick: function () {
          bs.forEach(function (y) { y.disabled = true; if (+y.dataset.k === correcta) y.classList.add('bien'); });
          var ok = x.k === correcta; if (!ok) b.classList.add('mal');
          var vio = !!hechas[E.clave];
          var nota = 0.5 * cubiertas / MINIMA.length + (ok ? 0.4 : 0) + (regulo ? 0.1 : 0) - 0.15 * malos;
          nota = Math.max(0, Math.min(1, nota));
          zona.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : nota >= 0.5 ? 'info' : 'mal'), html:
            '<b>Evaluación mínima: ' + cubiertas + ' de 6.</b> ' + (vio ? 'Encontró el dato orgánico escondido. ' : '<b>No encontró el dato orgánico:</b> ' + E.res[E.clave].replace(/<\/?b>/g, '') + '. ') +
            E.explic + (malos ? ' Acciones de riesgo: ' + malos + ' (cada una resta 15 puntos).' : '') + (regulo ? '' : ' Nombrar la emoción o ceder el trato habría protegido su juicio.') }));
          api.fin(nota, 'Evaluación mínima ' + cubiertas + '/6 · decisión ' + (ok ? 'acertada' : 'equivocada') + (malos ? ' · ' + malos + ' acción(es) de riesgo' : ''), true);
        } }, x.o);
        b.dataset.k = x.k;
        return b;
      });
      bs.forEach(function (b) { zona.appendChild(b); });
    } }, 'Pasar a decidir');
    el.appendChild(h('div', { class: 'acciones' }, bDec));
  }

  /* ---------- Constructor de transferencia sin ensombrecimiento ---------- */
  var FRASES = [
    { id: 'f1', t: 'Varón de 28 años. T 39,8 °C, FC 132 lpm, PA 142/88 mmHg, FR 26 rpm, SpO2 95 %, glucemia 112 mg/dL.', req: true, fisico: true },
    { id: 'f2', t: 'Rigidez generalizada en tubo de plomo, temblor, diaforesis profusa, mutismo y desorientación.', req: true, fisico: true },
    { id: 'f3', t: 'Aumento de la dosis de antipsicótico hace cinco días y haloperidol ayer en el centro de salud.', req: true },
    { id: 'f4', t: 'Sospecha de síndrome neuroléptico maligno; diferencial: golpe de calor, síndrome serotoninérgico, infección del sistema nervioso central.', req: true },
    { id: 'f5', t: 'Midazolam titulado, enfriamiento activo y reposición intravenosa en curso; no recibió antipsicóticos.', req: true },
    { id: 'o1', t: 'Antecedente de esquizofrenia.' },
    { id: 'o2', t: 'Escupió a un paramédico durante la sujeción.' },
    { id: 'j1', t: 'Paciente psiquiátrico agresivo.', juicio: 'Etiqueta que encuadra al receptor como el despacho encuadró al equipo.' },
    { id: 'j2', t: 'Está así porque no se toma bien la medicación, como siempre.', juicio: 'Interpretación sin verificar que atribuye el cuadro a la conducta.' },
    { id: 'j3', t: 'Manipulador; creemos que exagera la rigidez.', juicio: 'Juicio sobre el carácter que invita a ignorar un signo mayor.' }
  ];
  function transferencia(el, api) {
    var h = api.h;
    var elegidas = [], banco = api.barajar(FRASES), hecho = false;
    el.appendChild(h('div', { class: 'caja escena', html: 'Paciente del caso: varón de 28 años con esquizofrenia, llevado al hospital con cuidados intensivos. Construya la transferencia verbal <b>tocando las frases en el orden en que las diría</b>.' }));
    var lista = h('ol', { class: 'orden' }), bancoEl = h('div'), zona = h('div');
    el.appendChild(h('div', { class: 'enunciado' }, 'Su transferencia'));
    el.appendChild(lista);
    el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Frases disponibles'));
    el.appendChild(bancoEl);
    function pintar() {
      lista.innerHTML = ''; bancoEl.innerHTML = '';
      if (!elegidas.length) lista.appendChild(h('li', null, h('span', { class: 'txt pregunta-n' }, 'Aún vacía.')));
      elegidas.forEach(function (f, k) {
        var li = h('li', null, h('span', { class: 'n' }, k + 1), h('span', { class: 'txt' }, f.t),
          h('button', { 'aria-label': 'Subir', disabled: hecho || k === 0, onclick: function () { var t = elegidas[k - 1]; elegidas[k - 1] = f; elegidas[k] = t; pintar(); } }, '▲'),
          h('button', { 'aria-label': 'Quitar', disabled: hecho, onclick: function () { elegidas.splice(k, 1); pintar(); } }, '✕'));
        if (hecho) li.classList.add(f.juicio ? 'mal' : 'bien');
        lista.appendChild(li);
      });
      banco.forEach(function (f) {
        if (elegidas.indexOf(f) >= 0) return;
        bancoEl.appendChild(h('button', { class: 'opcion', disabled: hecho, onclick: function () { elegidas.push(f); pintar(); } }, f.t));
      });
    }
    pintar();
    var bt = h('button', { class: 'btn', onclick: function () {
      if (elegidas.length < 3) { zona.innerHTML = ''; zona.appendChild(h('div', { class: 'fb info' }, 'Elija al menos tres frases.')); return; }
      hecho = true; bt.disabled = true; pintar(); zona.innerHTML = '';
      var req = FRASES.filter(function (f) { return f.req; });
      var inc = req.filter(function (f) { return elegidas.indexOf(f) >= 0; });
      var juicios = elegidas.filter(function (f) { return f.juicio; });
      var primeroFisico = !!elegidas[0].fisico;
      var nota = 0.5 * inc.length / req.length + Math.max(0, 0.3 - 0.1 * juicios.length) + (primeroFisico ? 0.2 : 0);
      var faltan = req.filter(function (f) { return elegidas.indexOf(f) < 0; });
      var html = '<b>Datos esenciales: ' + inc.length + ' de ' + req.length + '.</b> ' +
        (faltan.length ? 'Faltó: ' + faltan.map(function (f) { return '«' + f.t + '»'; }).join(' ') + ' ' : '') +
        (juicios.length ? '<br><b>Juicios incluidos:</b> ' + juicios.map(function (f) { return '«' + f.t + '» ' + f.juicio; }).join(' ') : '<br>Sin juicios: bien.') +
        '<br>' + (primeroFisico ? 'Empezó por los hallazgos físicos: correcto.' : '<b>Empezó por «' + elegidas[0].t + '».</b> La transferencia debe empezar por los hallazgos físicos y no por el diagnóstico psiquiátrico, para no transmitir el ensombrecimiento al equipo receptor.');
      zona.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : 'info'), html: html }));
      api.fin(Math.min(1, nota), 'Transferencia: ' + inc.length + '/' + req.length + ' datos esenciales, ' + juicios.length + ' juicio(s), ' + (primeroFisico ? 'inicio por hallazgos físicos.' : 'inicio incorrecto.'), true);
    } }, 'Revisar la transferencia');
    el.appendChild(h('div', { class: 'acciones' }, bt));
    el.appendChild(zona);
  }

  TDC.registrar({
    numero: 9, parte: 'III',
    titulo: 'Emociones, afecto y juicio clínico',
    mision: 'Reconozca la emoción que intenta decidir por usted y aplique la evaluación mínima innegociable.',
    objetivo: 'Reconocer cómo las emociones propias y las reacciones hacia el paciente modifican el razonamiento, y aplicar estrategias de regulación en la escena.',
    escena: 'Un paciente le escupe, una familia le grita, un llamador frecuente vuelve a pedir ayuda. Usted también siente. Su tarea es distinguir el afecto que <b>informa sobre el paciente</b> del que contamina su juicio, y no dejar que la conducta de nadie decida cuánto evalúa.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Evaluación mínima bajo provocación', render: provocacion,
        instrucciones: 'El paciente le insultará con cada acción. Elija qué hacer, una acción cada vez; los resultados quedan en el registro. Cuando crea que tiene lo necesario, pase a decidir. El guion esconde un dato orgánico que solo aparece si completa la evaluación.'
      },
      {
        tipo: 'caso', titulo: 'El paciente agitado que la policía quería sedar',
        presentacion: '<b>16:40. Despacho:</b> “paciente psiquiátrico agresivo, policía en el lugar”. Hombre de 28 años con esquizofrenia, sujetado en decúbito prono por dos policías.',
        fases: [
          {
            titulo: 'La agresión',
            datos: 'Al acercarse, el paciente le escupe. Un policía pide: “Pónganle algo para dormirlo; ayer en el centro de salud ya le pusieron haloperidol”. Usted nota la mandíbula apretada y ganas de terminar pronto.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace primero?',
              opciones: ['Haloperidol intramuscular, como pide la policía, y traslado sujetado', 'Nombro mi enojo, cedo la decisión farmacológica a mi compañera y pido dos minutos para los signos vitales', 'Me retiro hasta que la policía lo controle del todo en el suelo'],
              correcta: 1,
              explicacion: 'La etiqueta del despacho, la presión policial y la ira empujaban en la misma dirección. Nombrar la emoción y ceder la decisión protege el juicio.' },
            experto: '“Me escupió y estoy enojado. No voy a decidir la sedación en este estado.”'
          },
          {
            titulo: 'Lo que aporta la madre',
            datos: 'La madre cuenta: “Hace cinco días le aumentaron la dosis del antipsicótico. Desde ayer está raro: no come, suda mucho, está tieso y casi no habla”.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que obligan a buscar una causa médica.',
              opciones: ['Aumento reciente del antipsicótico', 'Sudoración profusa', 'Rigidez (“está tieso”)', 'Casi no habla', 'Diagnóstico de esquizofrenia', 'Escupió al paramédico', 'Recibió haloperidol ayer'],
              correctas: [0, 1, 2, 3, 6],
              explicacion: 'Lo que es distinto de lo habitual y los fármacos recientes son las pistas. La esquizofrenia y el escupitajo describen al paciente, no su fisiología.' }
          },
          {
            titulo: 'Evaluación mínima',
            monitor: { T: '39,8 °C', FC: '132 lpm', PA: '176/104 → 142/88', FR: '26 rpm', SpO2: '95 %', Glucemia: '112 mg/dL' },
            datos: 'Diaforesis profusa, rigidez muscular generalizada en tubo de plomo, temblor, mutismo y desorientación.',
            decision: { tipo: 'opcion', pregunta: '¿Cuál es su diagnóstico de trabajo?',
              opciones: ['Síndrome neuroléptico maligno hasta que se demuestre lo contrario', 'Descompensación psicótica con agitación', 'Intoxicación alcohólica con deshidratación'],
              correcta: 0,
              explicacion: 'Fiebre, rigidez, alteración mental e inestabilidad autonómica con un antipsicótico recién aumentado. Diferencial: síndrome serotoninérgico, intoxicación anticolinérgica o simpaticomimética, golpe de calor, infección del sistema nervioso central y catatonia maligna.' },
            experto: '“Fiebre alta, rigidez, mutismo y un antipsicótico recién aumentado: síndrome neuroléptico maligno.”'
          },
          {
            titulo: 'La sedación',
            decision: { tipo: 'opcion', pregunta: 'Sigue agitado. ¿Cómo lo seda?',
              opciones: ['Haloperidol intramuscular a dosis baja', 'No lo sedo y lo mantengo sujetado en prono hasta el hospital', 'Midazolam titulado, con vigilancia de la vía aérea; ningún antipsicótico'],
              correcta: 2,
              porOpcion: { 0: 'Otro antipsicótico agrava el síndrome neuroléptico maligno.', 1: 'La sujeción en prono puede comprometer la ventilación y causar asfixia.' },
              explicacion: 'La sedación es un procedimiento de riesgo, no una solución administrativa.' }
          },
          {
            titulo: 'El resto del manejo',
            decision: { tipo: 'multiple', pregunta: 'Marque lo que corresponde.',
              opciones: ['Pasarlo a decúbito supino o lateral', 'Enfriamiento activo', 'Reposición intravenosa por riesgo de rabdomiólisis', 'Traslado con preaviso a un hospital con cuidados intensivos', 'Mantenerlo en prono mientras siga agitado', 'Antipirético oral y dejarlo en su domicilio'],
              correctas: [0, 1, 2, 3],
              explicacion: 'Se vigilan de forma continua la respiración y la SpO2, con capnografía si está disponible. La sujeción controla una conducta; no trata su causa.' },
            experto: '“En prono no puede ventilar bien.”'
          },
          {
            titulo: 'La policía',
            decision: { tipo: 'opcion', pregunta: '¿Qué le dice a la policía?',
              opciones: ['“Llévenlo ustedes; nosotros los seguimos hasta el hospital”', '“Es una emergencia médica: necesitamos ayuda para el traslado, no para contenerlo en el suelo”', '“Manténganlo sujeto boca abajo hasta que llegue el efecto”'],
              correcta: 1,
              explicacion: 'Reencuadrar la situación como médica cambia lo que se espera de cada uno en la escena.' }
          }
        ],
        cierre: 'Creatina quinasa de 38.000 U/L. Ingresó en cuidados intensivos y se recuperó sin secuelas. Encuadre por el despacho, sesgo visceral por la ira, atribución psicológica y ensombrecimiento diagnóstico empujaban hacia el haloperidol. Toda agitación grave es un delirium con posible causa médica hasta que se demuestre lo contrario: antes de sedar, temperatura, glucemia, SpO2, pupilas y fármacos.'
      },
      {
        tipo: 'personalizado', titulo: 'Transferencia sin ensombrecimiento', render: transferencia,
        instrucciones: 'Construya la transferencia del paciente del caso. Incluya los datos esenciales, deje fuera los juicios y empiece por los hallazgos físicos, no por el diagnóstico psiquiátrico. Puede reordenar con ▲ y quitar con ✕.'
      },
      {
        tipo: 'clasificar', titulo: '¿El afecto informa o contamina?',
        instrucciones: 'No toda emoción es un sesgo. Decida si cada reacción informa sobre el paciente o contamina el juicio.',
        categorias: ['Informa sobre el paciente', 'Contamina el juicio'],
        items: [
          { texto: '“Algo no está bien en este niño”', cat: 0, porque: 'Informativo: evaluar más y bajar el umbral de traslado.' },
          { texto: 'Irritación ante un paciente grosero', cat: 1, porque: 'Informa sobre la relación, no sobre su fisiología: evaluación mínima innegociable.' },
          { texto: 'Cansancio y enojo arrastrados de la llamada anterior', cat: 1, porque: 'Estado propio: pedir verificación al compañero.' },
          { texto: 'Simpatía por la anciana amable que “no quiere molestar”', cat: 1, porque: 'El afecto positivo también sesga: la misma evaluación estructurada que para cualquiera.' },
          { texto: 'Sensación de alarma ante un paciente que “se ve mal”', cat: 0, porque: 'Justifica evaluar más.' },
          { texto: 'Asco ante un paciente en situación de calle con mala higiene', cat: 1, porque: 'Afecto contaminante: sin evaluación completa, el ensombrecimiento está a un paso.' },
          { texto: 'Euforia después de una reanimación exitosa', cat: 1, porque: 'Exceso de confianza: mantener las mismas verificaciones que en un mal día.' },
          { texto: 'Su compañero: “No me gusta cómo respira”', cat: 0, porque: 'La preocupación del clínico puede preceder a cualquier cambio en los signos vitales (capítulo 6).' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Afecto, estigma y regulación',
        preguntas: [
          { p: 'Una anciana amable y agradecida minimiza su dolor torácico. ¿Cómo actúa la heurística afectiva?', opciones: ['No actúa, porque el afecto positivo no sesga el juicio', 'Hace que se sobreestime su riesgo por empatía', 'Solo actúa si la paciente es un familiar del clínico', 'Genera sensación de bajo riesgo: se le cree más y se explora menos'], correcta: 3, explicacion: 'Cuando algo agrada, se subestiman sus riesgos. La contramedida es la misma evaluación estructurada.' },
          { p: 'En el caso del paciente agitado, la presión policial es una influencia emocional…', opciones: ['Endógena', 'Situacional', 'Ambiental', 'Visceral'], correcta: 2, explicacion: 'Ambiental: escena en la vía pública, presión policial, prisa. El escupitajo es situacional; la ira del paramédico, endógena.' },
          { p: '¿Por qué el afecto “frío” es más peligroso que el “caliente”?', opciones: ['Porque es más intenso', 'Porque actúa como disposición de fondo sin que el clínico lo perciba', 'Porque solo aparece al final del turno', 'Porque siempre es positivo'], correcta: 1, explicacion: 'La ira o el miedo se notan; la aversión de fondo hacia ciertos grupos actúa en silencio.' },
          { p: 'En ensayos aleatorizados, ¿qué pasó con los casos idénticos de pacientes disruptivos?', opciones: ['La exactitud bajó solo en los casos complejos', 'La exactitud no cambió', 'La exactitud bajó en casos simples y complejos', 'La exactitud mejoró por mayor alerta'], correcta: 2, explicacion: 'Los médicos recordaron más la conducta y menos los hallazgos. El paciente difícil necesita una evaluación más estructurada, no menos.' },
          { p: 'Las personas con trastornos mentales tienen una mortalidad 2,2 veces mayor. ¿Qué parte se relaciona con la atención?', opciones: ['Enfermedades físicas diagnosticadas tarde', 'Ninguna: se debe solo a suicidios', 'La falta de adherencia al tratamiento psiquiátrico', 'Exclusivamente el consumo de sustancias'], correcta: 0, explicacion: 'Pierden una mediana de 10 años de vida potencial; parte se explica por el ensombrecimiento diagnóstico.' },
          { p: 'Después de ser agredido, ¿qué hace el paramédico para proteger su juicio?', opciones: ['Terminar la atención lo antes posible', 'Pedir a la policía que asuma la atención', 'Nombrar la emoción, ceder el trato y completar la evaluación mínima', 'Seguir igual: el profesional no debe sentir'], correcta: 2, explicacion: 'Además, documentar hechos y no juicios, y una conversación breve del equipo después.' },
          { p: 'Llamador frecuente, 15 llamadas en el mes, “se siente solo” y refiere dolor abdominal. ¿Qué corresponde?', opciones: ['Una evaluación rápida, porque ya se le conoce', 'Explicarle que no puede seguir llamando así', 'Derivarlo a servicios sociales sin explorarlo', 'La misma evaluación que ante cualquier dolor abdominal'], correcta: 3, explicacion: 'Patrón del dependiente que se aferra, que despierta agotamiento. Los límites se ponen a la conducta, no a la calidad de la evaluación.' },
          { p: 'Diez minutos después de una reanimación pediátrica sin éxito, llega una llamada por “dolor torácico leve”. ¿Qué riesgo existe?', opciones: ['Efecto de arrastre: subestimar o sobretratar al siguiente', 'Ninguno, si el equipo tiene experiencia suficiente', 'Solo el del cansancio físico acumulado', 'Un sesgo de representatividad por el dolor leve'], correcta: 0, explicacion: 'Pausa breve de la tripulación (“¿cómo estamos para la próxima?”), evaluación estructurada estricta y, si es posible, apoyo o relevo.' },
          { p: 'Si es imprescindible sujetar a un paciente agitado, ¿qué se hace?', opciones: ['Decúbito prono para controlarlo mejor', 'Sedar siempre antes de sujetar', 'Evitar el prono, vigilar respiración y SpO2, buscar la causa', 'Dejar la vigilancia en manos de la policía'], correcta: 2, explicacion: 'La agitación grave es a menudo un delirium con causa médica. La sujeción controla una conducta; no trata su causa.' },
          { p: '¿Por qué funciona nombrar la emoción (“estoy enojado con este paciente”)?', opciones: ['Porque reduce la activación de la amígdala', 'Porque avisa al paciente de que debe calmarse', 'Porque deja constancia para el registro', 'Porque elimina la emoción por completo'], correcta: 0, explicacion: 'La emoción no desaparece, pero deja de dirigir las decisiones.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Protocolo contra el ensombrecimiento',
        instrucciones: 'Persona con enfermedad mental, consumo, discapacidad intelectual, demencia o en situación de calle que presenta un cambio agudo. Ordene los cinco pasos.',
        pasos: [
          'Signos vitales completos con temperatura, glucemia y SpO2',
          'Preguntar al familiar o cuidador: “¿qué es distinto de lo habitual?”',
          'Buscar causas orgánicas de la conducta: hipoxia, hipoglucemia, infección, intoxicación, abstinencia, trauma y fármacos',
          'Registrar hechos observados, no juicios',
          'Transferir empezando por los hallazgos físicos y no por el diagnóstico psiquiátrico'
        ],
        explicacion: 'Los datos objetivos primero: sin ellos, el antecedente psiquiátrico explica “todo” y la causa médica se pierde.'
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Sesgo visceral', reverso: 'Sentimientos positivos o negativos hacia un paciente que alteran la evaluación (contratransferencia).' },
          { frente: 'Tres fuentes de influencia emocional', reverso: 'Ambiental (entorno y organización) · situacional (lo que despierta el paciente) · endógena (estado y rasgos del clínico).' },
          { frente: 'Afecto caliente y frío', reverso: 'Caliente: intenso y agudo, se nota (ira, miedo). Frío: disposición de fondo que actúa sin percibirse (aversión a ciertos grupos).' },
          { frente: 'Cuatro patrones de Groves', reverso: 'Dependiente que se aferra · exigente con sensación de derecho · manipulador que rechaza la ayuda · negador autodestructivo.' },
          { frente: 'Ensombrecimiento diagnóstico', reverso: 'Atribuir síntomas físicos a una enfermedad mental, un consumo o una discapacidad conocidos.' },
          { frente: 'Evaluación mínima innegociable', reverso: 'Signos vitales completos con temperatura, glucemia, SpO2, pupilas y búsqueda de trauma; revisar fármacos.' },
          { frente: 'Regulación en la escena', reverso: 'Nombrar la emoción · controlar la fisiología · cambiar la perspectiva · evaluación mínima · usar al compañero · hechos, no juicios · cierre de equipo.' },
          { frente: 'Efecto de arrastre', reverso: 'La emoción de una llamada viaja a la siguiente. Pausa breve: “¿cómo estamos para la próxima?”.' },
          { frente: 'Síndrome neuroléptico maligno', reverso: 'Fiebre, rigidez, alteración mental e inestabilidad autonómica con un antipsicótico. Otro antipsicótico lo agrava.' },
          { frente: 'Frases de desescalada', reverso: 'Presentarse · tono bajo y frases cortas · nombrar lo que siente el paciente · opciones simples · explicar antes de actuar.' }
        ]
      }
    ]
  });
})();
