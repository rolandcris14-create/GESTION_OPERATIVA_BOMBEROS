/* Capítulo 15. Mitigación de sesgos y puntos de parada cognitiva */
(function () {

  /* Anexo C: tarjeta de bolsillo del punto de parada cognitiva */
  var MOMENTOS = [
    'Antes de un fármaco o una intervención de alto riesgo o irreversible',
    'Antes de un no traslado o de aceptar una negativa',
    'Antes de la transferencia',
    'Ante un dato que no encaja',
    'Ante un deterioro o una respuesta inesperada al tratamiento',
    'Cuando alguien de la tripulación expresa preocupación',
    'Cuando el estado propio está comprometido'
  ];
  var HALTS = ['Hambre', 'Enojo', 'Retraso', 'Cansancio', 'Estrés'];
  var LETRAS = [
    { l: 'P', n: 'Peor diagnóstico', q: '¿Qué podría matar a este paciente y lo he descartado de forma activa?' },
    { l: 'A', n: 'Alternativas', q: '¿Qué más podría ser? ¿Qué dato no encaja?' },
    { l: 'U', n: 'Umbral', q: '¿La probabilidad supera el umbral de esta acción? ¿Qué dato cambiaría la decisión?' },
    { l: 'S', n: 'Sesgos y estado', q: '¿Me influye la etiqueta del despacho, una emoción o mi cansancio?' },
    { l: 'A', n: 'Acuerdo', q: '¿Mi compañero ve lo mismo? ¿Tiene alguna objeción?' }
  ];

  /* Escenarios construidos con casos y preguntas del manual (capítulos 6, 9 y 15). */
  var ESCENARIOS = [
    {
      titulo: 'Glasgow 7 en una mañana de invierno',
      escena: '<b>06:30, invierno.</b> Un vecino encontró en su casa a un hombre de 45 años que no despierta. Glasgow 7, SpO2 97 %, respira. El despacho lo trajo como “ebrio”. Su compañero ya prepara la inducción para intubar. Llevan 22 horas de turno y la central avisa que hay otro servicio en espera. Aún no se midió la glucemia.',
      momentos: [0, 6],
      porqueMomentos: 'La inducción anestésica es una intervención de alto riesgo, y 22 horas de turno con otro servicio en espera comprometen el estado propio.',
      halts: [2, 3],
      pausa: [
        { op: ['Hemorragia intracraneal, monóxido de carbono, hipoglucemia u opioides: ninguna está descartada', 'Una intoxicación etílica grave, como indicó el despacho', 'Una broncoaspiración: por eso hay que intubar sin demora'], ok: 0,
          porque: 'El peor diagnóstico se nombra y se descarta de forma activa. Ninguna de esas causas se ha buscado todavía.' },
        { op: ['No hay alternativas: un Glasgow de 7 obliga siempre a intubar', 'Causas reversibles que harían innecesaria la intubación', 'Un ictus: se activa el código y se omite lo demás'], ok: 1,
          porque: 'Antes de un procedimiento irreversible, la pregunta es qué causa reversible lo haría innecesario.' },
        { op: ['Intubar primero y medir la glucemia en el hospital', 'Esperar a que el Glasgow baje de 6 antes de decidir', 'Corregir antes lo reversible: glucemia, naloxona si hay miosis y bradipnea, y evaluar el ambiente'], ok: 2,
          porque: 'El umbral para inducir se evalúa después de corregir lo que puede corregirse en minutos.' },
        { op: ['Sí: la etiqueta de “ebrio” del despacho y 22 horas de turno', 'No: con experiencia, el cansancio no afecta', 'Solo influye la ansiedad del vecino'], ok: 0,
          porque: 'Nombrar la etiqueta y el cansancio en voz alta es lo que permite neutralizarlos.' },
        { op: ['El líder decide solo para no perder tiempo', 'Se verbalizan con el compañero los roles de la inducción y el plan ante el fallo', 'Se pide acuerdo solo si algo sale mal'], ok: 1,
          porque: 'El acuerdo incluye quién hace qué y qué se hará si la intubación falla.' }
      ],
      decision: { p: '¿Qué hace ahora?', op: ['Inducción inmediata: la pausa ya se hizo', 'Traslado sin intubar para no correr riesgos', 'Glucemia, pupilas y FR, evaluación del ambiente; después, inducción con roles y plan de fallo acordados'], ok: 2,
        porque: 'La pausa no retrasa lo necesario: ordena primero lo reversible y luego la intubación con un plan compartido.' }
    },
    {
      titulo: 'La negativa de la anciana anticoagulada',
      escena: '<b>08:20.</b> Mujer de 82 años que resbaló en el baño y se golpeó la región occipital. Toma apixabán por fibrilación auricular. Glasgow 15, cefalea occipital leve, hematoma de 3 cm, exploración neurológica normal. Dice: “estoy bien, no quiero ir al hospital”. Su compañero comenta: “no me quedo tranquilo con esto”. No han desayunado y la central insiste en liberar la unidad.',
      momentos: [1, 5, 6],
      porqueMomentos: 'Va a aceptar una negativa, un compañero expresó preocupación, y el hambre con la prisa de la central comprometen el estado propio.',
      halts: [0, 2],
      pausa: [
        { op: ['Ninguno: Glasgow 15 y exploración normal descartan una lesión', 'Una hemorragia intracraneal, que puede aparecer horas después', 'Una fractura de cadera no detectada'], ok: 1,
          porque: 'En pacientes con TCE y anticoagulación hay hemorragias inmediatas y diferidas. Sin TC no está descartada.' },
        { op: ['El apixabán y la edad no encajan con “golpe leve”: la regla de no traslado no aplica', 'Una cefalea tensional por el susto', 'Una migraña desencadenada por la caída'], ok: 0,
          porque: 'La Regla Canadiense de TC craneal excluyó a los anticoagulados, y la edad de 65 años o más ya es criterio de alto riesgo (capítulo 6).' },
        { op: ['Con Glasgow 15 está bajo el umbral: se acepta la negativa', 'Se la traslada contra su voluntad aunque tenga capacidad', 'Umbral de traslado bajo por la asimetría de errores; la negativa solo vale si es informada'], ok: 2,
          porque: 'Un falso negativo puede costarle la vida o la independencia; un falso positivo, un traslado y una TC.' },
        { op: ['No: la decisión es puramente clínica', 'Sí: el hambre, la prisa de la central y el deseo de la paciente empujan al no traslado', 'Solo el cansancio, que a esta hora no es relevante'], ok: 1,
          porque: 'Dos elementos de HALTS y la presión de la paciente apuntan en la misma dirección: hacia el error.' },
        { op: ['El compañero ya expresó preocupación: se trata como un dato y se responde', 'El líder tiene la última palabra y no necesita responder', 'Se decide por mayoría, contando a la paciente'], ok: 0,
          porque: 'La objeción del compañero es un dato. Si se expresa dos veces sin respuesta, se escala a la dirección médica.' }
      ],
      decision: { p: '¿Qué hace?', op: ['Aceptar la negativa tras tranquilizarla y dejarle el número de emergencias', 'Riesgo en frecuencias, capacidad evaluada y recomendación de TC; si mantiene la negativa, dirección médica y plan de seguridad', 'Aceptar la negativa: no hubo vómitos ni pérdida de conciencia'], ok: 1,
        porque: '“De cada 100 personas que toman un anticoagulante y se golpean la cabeza como usted, unas 5 tienen un sangrado.” Si mantiene la negativa con capacidad: acompañante 24 horas, signos de alarma por escrito y consulta con la dirección médica.' }
    },
    {
      titulo: 'El paciente agitado que la policía quería sedar',
      escena: '<b>16:40.</b> Hombre de 28 años con esquizofrenia, agitado, sujetado en decúbito prono por dos policías. Le acaba de escupir a usted. Un policía pide: “pónganle algo para dormirlo”. La madre cuenta que hace cinco días le aumentaron el antipsicótico y que desde ayer suda mucho y “está tieso”. Usted tiene el haloperidol cargado.',
      momentos: [0, 3, 6],
      porqueMomentos: 'La sedación es una intervención de alto riesgo, la rigidez y el sudor con un antipsicótico recién aumentado no encajan, y el escupitajo le dejó enojado.',
      halts: [1, 4],
      pausa: [
        { op: ['Que agreda a otro miembro del equipo', 'Una causa médica de la agitación, como un síndrome neuroléptico maligno', 'Una descompensación de su esquizofrenia'], ok: 1,
          porque: 'Toda agitación grave es un delirium con posible causa médica hasta que se demuestre lo contrario.' },
        { op: ['Nada: el despacho ya dijo que es psiquiátrico', 'Solo cabe una intoxicación alcohólica', 'Rigidez, sudoración y un antipsicótico recién aumentado no encajan con una psicosis'], ok: 2,
          porque: 'La esquizofrenia no lo explica todo: eso sería ensombrecimiento diagnóstico (capítulo 9).' },
        { op: ['Ningún fármaco hasta medir temperatura, glucemia y SpO2, y revisar pupilas y fármacos', 'El riesgo para el equipo justifica el haloperidol ahora', 'Sedar solo si la madre lo autoriza'], ok: 0,
          porque: 'Si hay un síndrome neuroléptico maligno, otro antipsicótico lo agrava: la acción cruzaría del beneficio al daño.' },
        { op: ['No: el enojo no cambia la dosis', 'Solo influye la presión de la policía', 'Sí: el escupitajo y el enojo empujan a “controlarlo”; cedo la decisión a mi compañera'], ok: 2,
          porque: 'Nombrar la emoción y ceder la decisión farmacológica es la contramedida del sesgo visceral.' },
        { op: ['Mi compañera pide dos minutos para los signos vitales: acepto la objeción', 'La policía está de acuerdo, así que hay consenso', 'No hace falta acuerdo en una contención'], ok: 0,
          porque: 'El acuerdo que importa es el de la tripulación, y la objeción se trata como un dato.' }
      ],
      decision: { p: '¿Qué hace?', op: ['Haloperidol intramuscular y traslado sujetado en prono', 'Evaluación mínima, paso del prono a supino o lateral y ningún antipsicótico', 'Esperar a que se calme antes de evaluarlo'], ok: 1,
        porque: 'En el caso real: temperatura 39,8 °C, rigidez en tubo de plomo y mutismo. Síndrome neuroléptico maligno; midazolam titulado con vigilancia de la vía aérea, enfriamiento y traslado a cuidados intensivos.' }
    },
    {
      titulo: '“Es mi migraña de siempre”',
      escena: '<b>Inicio del turno.</b> Mujer de 45 años con “la migraña de siempre”, pero esta vez el dolor empezó de golpe durante el ejercicio. Está consciente y orientada. Insiste en que es su migraña y quiere quedarse en casa. La tripulación está descansada y no hay otros servicios pendientes.',
      momentos: [1, 3],
      porqueMomentos: 'Va a aceptar una negativa, y el inicio súbito durante el esfuerzo no encaja con su migraña habitual. El estado de la tripulación no está comprometido.',
      halts: [],
      pausa: [
        { op: ['Una migraña con aura', 'Una hemorragia subaracnoidea', 'Una crisis hipertensiva'], ok: 1,
          porque: 'Amenaza: ¿hay riesgo vital? Una hemorragia subaracnoidea.' },
        { op: ['Otra cefalea en trueno o una disección arterial', 'Una cefalea tensional por el ejercicio', 'Ninguna: ella conoce su migraña'], ok: 0,
          porque: 'Qué más: si no es migraña, ¿qué es? Lo que no encaja es el inicio súbito durante el esfuerzo.' },
        { op: ['Si mejora con un analgésico, queda descartada', 'Sin déficit neurológico, está bajo el umbral de traslado', 'La evidencia no basta para descartar: el inicio súbito es la señal de alarma'], ok: 2,
          porque: 'Evidencia: ¿basta para descartar? No. La respuesta al analgésico no diferencia las causas.' },
        { op: ['El cansancio del equipo', 'La insistencia de la paciente en que es “su migraña” actúa como encuadre', 'Ninguno: no hay presión externa'], ok: 1,
          porque: 'Disposición: la etiqueta la trae la propia paciente y empuja hacia el no traslado.' },
        { op: ['El compañero confirma u objeta en voz alta', 'No hace falta: el caso es claro', 'Se consulta solo a la familia'], ok: 0,
          porque: 'Incluso cuando el líder está seguro, el compañero confirma u objeta en voz alta.' }
      ],
      decision: { p: '¿Qué hace?', op: ['Analgésico y control telefónico en unas horas', 'Traslado al hospital más cercano, aunque no tenga tomografía', 'Traslado a un centro con tomografía, explicando el riesgo a la paciente'], ok: 2,
        porque: 'Es el ejemplo de TWED del manual: amenaza, qué más, evidencia y disposición llevan al traslado a un centro con tomografía.' }
    }
  ];
  var turno = 0;

  function simuladorPausa(el, api) {
    var h = api.h, F = api.fmt;
    var E = ESCENARIOS[turno % ESCENARIOS.length]; turno++;
    var paso = 0, puntos = 0, total = 8, t0 = null, tPausa = null, respPausa = [];

    function tarjeta() {
      var fila = h('div', { style: 'display:flex;gap:6px;margin:6px 0 10px' });
      LETRAS.forEach(function (L, k) {
        var r = respPausa[k], actual = paso === k + 2;
        var fondo = r == null ? (actual ? 'var(--tinta)' : 'var(--panel)') : r ? 'var(--verde)' : 'var(--rojo)';
        var color = r == null && !actual ? 'var(--tinta)' : '#fff';
        fila.appendChild(h('div', { style: 'flex:1;text-align:center;border:1px solid var(--linea);border-radius:8px;padding:6px 2px;background:' + fondo + ';color:' + color },
          h('div', { style: 'font:800 20px Montserrat,sans-serif' }, L.l),
          h('div', { style: 'font-size:10.5px;line-height:1.2' }, L.n)));
      });
      return fila;
    }
    function cabecera() {
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Escenario ' + (ESCENARIOS.indexOf(E) + 1) + ' de ' + ESCENARIOS.length + ' · ' + E.titulo));
      el.appendChild(h('div', { class: 'caja escena', html: E.escena }));
    }
    function toggles(lista, correctas, etiqueta, alCorregir) {
      var marc = {};
      var bots = lista.map(function (t, k) {
        return h('button', { class: 'opcion', onclick: function () {
          marc[k] = !marc[k]; this.classList.toggle('sel', !!marc[k]);
          this.textContent = (marc[k] ? '☑ ' : '☐ ') + t;
        } }, '☐ ' + t);
      });
      bots.forEach(function (b) { el.appendChild(b); });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        bt.disabled = true;
        var bien = 0;
        bots.forEach(function (b, k) {
          b.disabled = true;
          var debe = correctas.indexOf(k) >= 0, esta = !!marc[k];
          if (debe === esta) bien++;
          if (debe) b.classList.add('bien'); else if (esta) b.classList.add('mal');
        });
        var nota = bien / lista.length; puntos += nota;
        alCorregir(zona, nota, bien, marc);
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { paso++; pintar(); } }, 'Continuar')));
      } }, etiqueta);
      el.appendChild(h('div', { class: 'acciones' }, bt));
      el.appendChild(zona);
    }
    function eleccion(opciones, ok, porque, alElegir) {
      var orden = api.barajar(opciones.map(function (_, k) { return k; }));
      var zona = h('div'), bots = [];
      orden.forEach(function (k) {
        var b = h('button', { class: 'opcion', onclick: function () {
          bots.forEach(function (x) { x.b.disabled = true; if (x.k === ok) x.b.classList.add('bien'); });
          var acierto = k === ok; if (!acierto) b.classList.add('mal');
          if (acierto) puntos++;
          alElegir(acierto);
          zona.appendChild(h('div', { class: 'fb ' + (acierto ? 'bien' : 'mal'), html: (acierto ? '<b>Bien.</b> ' : '<b>No.</b> ') + porque }));
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { paso++; pintar(); } }, 'Continuar')));
        } }, opciones[k]);
        bots.push({ b: b, k: k }); el.appendChild(b);
      });
      el.appendChild(zona);
    }

    function pintar() {
      el.innerHTML = '';
      if (paso === 0) {
        cabecera();
        el.appendChild(h('div', { class: 'enunciado' }, '1. ¿Por qué hay que parar ahora? Marque todos los momentos obligatorios presentes.'));
        toggles(MOMENTOS, E.momentos, 'Confirmar', function (zona, nota, bien) {
          zona.appendChild(h('div', { class: 'fb ' + (nota === 1 ? 'bien' : nota >= 0.7 ? 'info' : 'mal'), html: '<b>' + bien + ' de 7 correctos.</b> ' + E.porqueMomentos }));
        });
      } else if (paso === 1) {
        cabecera();
        el.appendChild(h('div', { class: 'enunciado' }, '2. Autochequeo HALTS de la tripulación: ¿qué está presente?'));
        toggles(HALTS, E.halts, 'Confirmar', function (zona, nota, bien) {
          var n = E.halts.length;
          zona.appendChild(h('div', { class: 'fb ' + (nota === 1 ? 'bien' : 'info'), html: '<b>' + bien + ' de 5 correctos.</b> Presentes: ' + (n ? E.halts.map(function (k) { return HALTS[k]; }).join(', ') : 'ninguno') + '. ' +
            (n >= 2 ? 'Con dos o más, se pide al compañero una <b>verificación explícita</b> de la siguiente decisión crítica.' : 'Con menos de dos, no hace falta pedir una verificación extra, pero la PAUSA se hace igual.') }));
        });
      } else if (paso >= 2 && paso <= 6) {
        if (t0 === null) t0 = Date.now();
        var k = paso - 2, L = LETRAS[k], P = E.pausa[k];
        el.appendChild(h('div', { class: 'pregunta-n' }, '3. PAUSA en voz alta · ' + E.titulo));
        el.appendChild(h('details', { class: 'pregunta-n' }, h('summary', null, 'Ver la escena'), h('div', { class: 'datos', html: E.escena })));
        el.appendChild(tarjeta());
        el.appendChild(h('div', { class: 'enunciado' }, L.l + ': ' + L.n.toLowerCase() + '. ' + L.q));
        el.appendChild(h('div', { class: 'pregunta-n', style: 'margin-bottom:6px' }, 'Elija la respuesta del líder en una frase.'));
        eleccion(P.op, P.ok, P.porque, function (acierto) { respPausa[k] = acierto; if (k === 4) tPausa = (Date.now() - t0) / 1000; });
      } else if (paso === 7) {
        el.appendChild(tarjeta());
        el.appendChild(h('div', { class: 'fb info', html: 'Su PAUSA tomó <b>' + F(tPausa, 0) + ' s</b>. En un equipo entrenado, dicha en voz alta, dura de 30 a 60 segundos y queda registrada con la hora.' }));
        el.appendChild(h('div', { class: 'enunciado' }, '4. ' + E.decision.p));
        eleccion(E.decision.op, E.decision.ok, E.decision.porque, function () {});
      } else {
        var nota = puntos / total;
        el.appendChild(tarjeta());
        el.appendChild(h('div', { class: 'caja objetivo', html: '<span class="rot">Resultado de la pausa</span>Momentos, HALTS, cinco letras y decisión: ' + F(puntos, puntos % 1 ? 1 : 0) + ' de ' + total + ' puntos. Repita la actividad para practicar el siguiente escenario (hay ' + ESCENARIOS.length + ').' }));
        api.fin(nota, 'Punto de parada: ' + E.titulo + '.', true);
      }
    }
    pintar();
  }

  /* Constructor de reglas de forzamiento: si [presentación] en [población], descartar [diagnóstico] con [dato] */
  var REGLAS = [
    { si: 'Síncope', en: 'mujer en edad fértil', dx: 'Embarazo ectópico', con: 'Fecha de la última menstruación, prueba de embarazo, signos de hipovolemia' },
    { si: 'Dolor en el flanco', en: 'mayor de 60 años', dx: 'Aneurisma de aorta', con: 'Síncope, PA basal, palpación o ecografía de la aorta' },
    { si: 'Alteración de la conciencia', en: 'cualquier paciente', dx: 'Hipoglucemia', con: 'Glucemia capilar' },
    { si: 'Agitación grave', en: 'cualquier paciente', dx: 'Causa médica', con: 'Temperatura, glucemia, SpO2, pupilas y fármacos' },
    { si: 'Dolor torácico antes de antitrombóticos', en: 'cualquier paciente', dx: 'Disección aórtica', con: 'Tipo de dolor, pulsos, PA en ambos brazos, déficit neurológico' },
    { si: 'Varios afectados en el mismo lugar', en: 'cualquier escena', dx: 'Tóxico ambiental', con: 'Evaluación de la escena y cooximetría' },
    { si: 'Traumatismo craneal', en: 'paciente intoxicado', dx: 'Hemorragia intracraneal', con: 'Glasgow seriado, pupilas, búsqueda de focalidad y traslado para TC' }
  ];
  function constructorReglas(el, api) {
    var h = api.h;
    var dxs = api.barajar(REGLAS.map(function (r) { return r.dx; }));
    var cons = api.barajar(REGLAS.map(function (r) { return r.con; }));
    var filas = [];
    REGLAS.forEach(function (r, k) {
      function sel(lista, etiqueta) {
        return h('select', { 'aria-label': etiqueta, style: 'width:100%;margin-top:4px' },
          h('option', { value: '' }, 'Elija…'), lista.map(function (x) { return h('option', { value: x }, x); }));
      }
      var s1 = sel(dxs, 'Diagnóstico que hay que descartar'), s2 = sel(cons, 'Dato o prueba');
      var caja = h('div', { class: 'item-clas' },
        h('div', { class: 'txt' }, (k + 1) + '. Si ' + r.si.toLowerCase() + ' en ' + r.en + ', entonces descartar…'),
        s1, h('div', { class: 'pregunta-n', style: 'margin-top:6px' }, '…con:'), s2);
      filas.push({ r: r, s1: s1, s2: s2, caja: caja });
      el.appendChild(caja);
    });
    var aviso = h('span', { class: 'pregunta-n' });
    var bt = h('button', { class: 'btn', onclick: function () {
      if (filas.some(function (f) { return !f.s1.value || !f.s2.value; })) { aviso.textContent = 'Complete las siete reglas antes de corregir.'; return; }
      bt.disabled = true; aviso.textContent = '';
      var bien = 0;
      filas.forEach(function (f) {
        var a = f.s1.value === f.r.dx, b = f.s2.value === f.r.con;
        bien += (a ? 1 : 0) + (b ? 1 : 0);
        f.s1.disabled = true; f.s2.disabled = true;
        f.caja.classList.add(a && b ? 'bien' : 'mal');
        if (!(a && b)) f.caja.appendChild(h('div', { class: 'porque', html: '<b>Regla correcta:</b> descartar «' + f.r.dx + '» con «' + f.r.con + '».' }));
      });
      el.appendChild(h('div', { class: 'fb info', html: 'La regla es útil cuando nombra el <b>dato concreto que descarta</b>, no solo el diagnóstico que hay que recordar. La intoxicación no explica un Glasgow que empeora.' }));
      api.fin(bien / 14, bien + ' de 14 elementos correctos en siete reglas', true);
    } }, 'Corregir las reglas');
    el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
  }

  TDC.registrar({
    numero: 15, parte: 'V',
    titulo: 'Mitigación de sesgos y puntos de parada cognitiva',
    mision: 'Ejecute la PAUSA en los momentos obligatorios y detenga el error antes del fármaco irreversible.',
    objetivo: 'Seleccionar estrategias de mitigación con respaldo empírico y ejecutar un punto de parada cognitiva estructurado en los momentos críticos de la atención.',
    escena: 'Los sesgos no se sienten como error: se sienten como evidencia. Por eso usted no va a esperar a “darse cuenta”. Va a detenerse <b>siempre en los mismos momentos</b>, en voz alta y con su compañero, antes de un fármaco irreversible, de un no traslado o de una transferencia.',
    actividades: [
      {
        tipo: 'caso', titulo: 'El infarto inferior que no debía anticoagularse',
        presentacion: '<b>22:05.</b> Varón de 58 años, hipertenso con mal control. Dolor torácico súbito e intenso que describe “como un desgarro”, irradiado entre los omóplatos. Tuvo un desmayo breve al inicio. Está sudoroso y angustiado. El centro con angioplastia está a 150 minutos.',
        fases: [
          {
            titulo: 'El ECG y el protocolo',
            monitor: { FC: '92 lpm', 'PA (brazo derecho)': '168/96', SpO2: '96 %' },
            datos: 'ECG: <b>elevación del ST de 2 mm en II, III y aVF</b>. Por el tiempo hasta la angioplastia, el protocolo orienta a antiagregación, anticoagulación y fibrinólisis. El líder prepara la heparina y la tenecteplasa.',
            decision: { tipo: 'opcion', pregunta: 'Usted es la compañera. ¿Qué hace?',
              opciones: ['Ayudo a administrar: el tiempo es miocardio', 'Pido una pausa antes del fármaco irreversible', 'Propongo trasladar sin tratar y que decidan en el hospital'],
              correcta: 1,
              explicacion: 'Antes de una intervención de alto riesgo o irreversible, la pausa es obligatoria, no depende de que alguien dude. La inicia quien no ejecuta la intervención.' },
            experto: '“Antes del fármaco irreversible: pausa.”'
          },
          {
            titulo: 'Peor diagnóstico y alternativas',
            datos: 'La compañera lee las preguntas en voz alta. <i>¿Qué podría matar a este paciente? ¿Qué dato no encaja?</i>',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que un infarto inferior aislado <b>no explica</b>.',
              opciones: ['Dolor desgarrante', 'Elevación del ST en II, III y aVF', 'Síncope al inicio del dolor', 'Sudoración', 'Hipertensión mal controlada'],
              correctas: [0, 2],
              explicacion: 'El infarto explicaba el ECG, pero no el dolor desgarrante ni el síncope. Peor diagnóstico: disección aórtica que compromete la coronaria derecha y produce un infarto inferior.' },
            experto: '“Dolor desgarrante y síncope: disección. Mido la PA en ambos brazos.”'
          },
          {
            titulo: 'La exploración dirigida',
            monitor: { 'PA derecha': '168/96', 'PA izquierda': '128/78', FC: '92 lpm' },
            datos: 'Pulso radial izquierdo más débil que el derecho.',
            decision: { tipo: 'opcion', pregunta: '¿Cuánto suma el puntaje de riesgo de disección aórtica?',
              opciones: ['0', '1', '2', '3'],
              correcta: 2,
              explicacion: 'Dolor de características de alto riesgo (1) y hallazgo de alto riesgo en la exploración (1): 2. Un puntaje de 1 o más tuvo una sensibilidad de 95,7 % en su validación. El déficit de pulso tiene un LR+ de 5,7.' }
          },
          {
            titulo: 'Umbral',
            datos: 'La diferencia de PA entre brazos también aparece en personas sin disección. Aquí se suma a un dolor típico, a un síncope y a un déficit de pulso.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace con los antitrombóticos?',
              opciones: ['Solo aspirina, que es menos riesgosa', 'Ninguno: la sospecha de disección es una contraindicación absoluta', 'Fibrinólisis a mitad de dosis', 'Heparina sin fibrinólisis'],
              correcta: 1,
              explicacion: 'Sin antiagregantes, anticoagulantes ni fibrinólisis. Con una probabilidad relevante de disección, el fármaco pasa de beneficio a catástrofe.' },
            experto: '“Con esta sospecha, el fármaco pasa de beneficio a catástrofe.” El líder acepta detener la administración.'
          },
          {
            titulo: 'Sesgos y estado',
            decision: { tipo: 'opcion', pregunta: '¿Qué mecanismo estuvo a punto de causar el daño?',
              opciones: ['Disponibilidad por casos recientes de disección', 'El ECG ancló el diagnóstico y el protocolo lo encaminó', 'Sesgo retrospectivo del equipo', 'Exceso de pruebas en la escena'],
              correcta: 1,
              explicacion: 'Un protocolo bien aplicado al diagnóstico equivocado produce un daño eficiente: es un error basado en reglas (capítulo 16).' }
          },
          {
            titulo: 'Tratamiento y destino',
            decision: { tipo: 'opcion', pregunta: '¿Qué plan sigue?',
              opciones: ['Traslado al centro con angioplastia a 150 minutos, sin tratamiento', 'Hospital más cercano, aunque no tenga tomografía', 'Opioide titulado, control de FC y PA según protocolo, y centro con tomografía y cirugía cardíaca'],
              correcta: 2,
              explicacion: 'Analgesia, control hemodinámico y preaviso a un centro que pueda confirmar y operar.' }
          },
          {
            titulo: 'La transferencia',
            decision: { tipo: 'opcion', pregunta: '¿Qué diagnóstico de trabajo transmite?',
              opciones: ['Infarto inferior con alta sospecha de disección aórtica tipo A', 'Infarto con elevación del ST inferior', 'Disección descartada: el ECG es de infarto'],
              correcta: 0,
              explicacion: 'Se transmiten ambos: lo que muestra el ECG y la hipótesis que lo explica todo. No se entrega una etiqueta sin verificar.' },
            experto: 'La angiotomografía confirmó una disección tipo A con compromiso del ostium de la coronaria derecha. Fue operado de urgencia y sobrevivió.'
          }
        ],
        cierre: 'Un protocolo bien aplicado al diagnóstico equivocado produce un daño eficiente. El punto de parada antes del fármaco irreversible fue la última barrera, y funcionó porque estaba previsto, se hizo en voz alta y la objeción de la compañera se aceptó como un dato.'
      },
      {
        tipo: 'personalizado', titulo: 'Simulador de PAUSA', render: simuladorPausa,
        instrucciones: 'Tarjeta de bolsillo del Anexo C en acción. Identifique por qué hay que parar, haga el autochequeo HALTS, recorra las cinco letras de PAUSA y decida. Cada vez que repita la actividad cambia el escenario.'
      },
      {
        tipo: 'clasificar', titulo: '¿En qué nivel actúa cada estrategia?',
        instrucciones: 'Clasifique cada medida según los cuatro niveles de mitigación de sesgos.',
        categorias: ['Educativo', 'En el momento', 'Forzamiento', 'Sistema'],
        items: [
          { texto: 'Formación en sesgos con casos reales', cat: 0, porque: 'Conocer los sesgos y sus mecanismos. Necesario, pero con poco efecto por sí solo.' },
          { texto: 'Punto de parada antes de fármacos de alto riesgo', cat: 1, porque: 'Interrumpe el razonamiento en un punto crítico de la tarea.' },
          { texto: '“En toda mujer en edad fértil con síncope, descartar ectópico”', cat: 2, porque: 'Regla específica que obliga a considerar una alternativa.' },
          { texto: 'Glucemia obligatoria para cerrar el registro de un paciente con alteración de la conciencia', cat: 3, porque: 'El diseño hace difícil el error.' },
          { texto: 'Leer PAUSA en voz alta antes de aceptar una negativa de traslado', cat: 1, porque: 'Herramienta ligada a un momento obligatorio.' },
          { texto: '“Después de encontrar una lesión, buscar la segunda”', cat: 2, porque: 'Estrategia de forzamiento genérica contra la búsqueda satisfecha.' },
          { texto: 'Una sola concentración de cada fármaco de alto riesgo en la dotación', cat: 3, porque: 'Elimina la posibilidad del error de conversión (capítulo 16).' },
          { texto: 'Conocer cómo actúa el anclaje en la interpretación del ECG', cat: 0, porque: 'Conocimiento del sesgo: no garantiza detectarlo cuando actúa.' },
          { texto: '“Antes de transferir, nombrar al menos una alternativa y por qué se descartó”', cat: 2, porque: 'Forzamiento genérico contra el cierre prematuro.' },
          { texto: 'TWED ante un dato discordante', cat: 1, porque: 'Punto de parada breve en un momento crítico.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: 'Constructor de reglas de forzamiento', render: constructorReglas,
        instrucciones: 'Estructura: si [presentación] en [población], entonces descartar [diagnóstico] con [dato o prueba]. Complete cada regla con el diagnóstico y el dato concreto que lo descarta.'
      },
      {
        tipo: 'ordenar', titulo: 'Cómo se ejecuta la pausa',
        instrucciones: 'Ordene la ejecución de PAUSA en una tripulación.',
        pasos: [
          'Cualquier miembro inicia la pausa diciendo “pausa”',
          'Quien no ejecuta el procedimiento lee las cinco preguntas en voz alta',
          'El líder responde cada pregunta en una frase',
          'El compañero confirma u objeta',
          'La pausa y su resolución quedan registradas con la hora'
        ],
        explicacion: 'En un equipo entrenado dura entre 30 y 60 segundos. PAUSA es una síntesis docente de TWED y SLOW sin validación empírica propia: su valor depende de practicarla hasta que sea automática.'
      },
      {
        tipo: 'quiz', titulo: 'Qué funciona y cuándo',
        preguntas: [
          { p: '¿Por qué enseñar el catálogo de sesgos no basta para reducir los errores?', opciones: ['Porque los sesgos son raros en la práctica', 'Porque el sesgo opera sin sensación de error y cada uno lo ve mejor en los demás', 'Porque los catálogos están desactualizados', 'Porque solo afecta a los novatos'], correcta: 1, explicacion: 'Hace falta ligar la mitigación a momentos concretos de la tarea y al trabajo en equipo, con disparadores externos.' },
          { p: 'La herramienta SLOW no redujo los errores en su ensayo, aunque los participantes la valoraron bien. ¿Qué enseña?', opciones: ['Que el agrado subjetivo por una herramienta no prueba su eficacia', 'Que ninguna herramienta cognitiva funciona', 'Que conviene usarla igual porque gusta', 'Que el ensayo estaba mal diseñado'], correcta: 0, explicacion: 'La reflexión guiada sobre los datos concretos del caso sí mejoró la exactitud en casos complejos.' },
          { p: 'En una revisión sistemática de 28 estudios, ¿qué intervención tuvo los resultados más consistentes?', opciones: ['Las instrucciones de ir más despacio', 'Las listas de verificación', 'La reflexión guiada', 'La enseñanza genérica de sesgos'], correcta: 2, explicacion: 'Las listas tuvieron resultados mixtos y las instrucciones de ir más despacio, en general, no mejoraron la exactitud.' },
          { p: 'De las cuatro condiciones para corregir un sesgo, ¿cuál es la más difícil?', opciones: ['Saber que existe', 'Estar motivado para corregirlo', 'Disponer de una estrategia eficaz', 'Detectarlo en el momento en que actúa'], correcta: 3, explicacion: 'Por eso funcionan mejor los disparadores externos: un momento fijo, una pregunta obligatoria o un compañero que objeta.' },
          { p: 'Mujer de 70 años con aneurisma de aorta torácica conocido y dolor de espalda súbito e intenso, sin hallazgos en la exploración. ¿Puntaje de riesgo de disección y conducta?', opciones: ['1: riesgo bajo, antiagregar', '2: riesgo alto, sin antitrombóticos y centro con tomografía y cirugía', '0: la exploración normal lo descarta', '3: fibrinólisis urgente'], correcta: 1, explicacion: 'Condición de alto riesgo (1) y dolor de alto riesgo (1). La ausencia de hallazgos exploratorios no la reduce lo suficiente.' },
          { p: 'Durante la pausa, la compañera objeta la fibrinólisis y el líder decide continuar. ¿Qué debe hacer el líder?', opciones: ['Continuar sin comentarios para no perder tiempo', 'Agradecer, repetir la objeción, explicar el dato que la descarta y registrar', 'Pedir a la compañera que lo discutan después', 'Consultar la opinión de la familia'], correcta: 1, explicacion: 'Por ejemplo: pulsos y PA simétricos con un dolor no desgarrante. Si no puede descartarla con un dato concreto, la objeción prevalece y el fármaco no se administra.' },
          { p: '¿Qué indicador muestra mejor que una herramienta de mitigación funciona en un servicio?', opciones: ['La ausencia total de errores', 'La satisfacción del personal con la herramienta', 'Los errores interceptados', 'El número de capacitaciones dictadas'], correcta: 2, explicacion: 'La anticoagulación que se detuvo, la negativa que se convirtió en traslado, la dosis corregida antes de administrarla.' },
          { p: 'En un protocolo local de puntos de parada, ¿quién inicia la pausa antes de una intervención?', opciones: ['El profesional que no ejecuta la intervención', 'El más antiguo de la tripulación', 'El médico regulador por radio', 'El que va a administrar el fármaco'], correcta: 0, explicacion: 'Se hace en voz alta con la estructura acordada, queda registrada con la hora y se audita su cumplimiento.' },
          { p: 'Hay 40 mmHg de diferencia de PA entre brazos en un paciente con dolor torácico. ¿Cómo la usa?', opciones: ['Confirma la disección por sí sola', 'No tiene ningún valor', 'Es un dato de apoyo que pesa junto al tipo de dolor, el síncope y los pulsos', 'Solo importa si supera 60 mmHg'], correcta: 2, explicacion: 'La diferencia entre brazos también aparece en personas sin disección: apoya, no confirma.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Tarjeta de bolsillo',
        tarjetas: [
          { frente: 'PAUSA', reverso: 'P: peor diagnóstico · A: alternativas · U: umbral · S: sesgos y estado · A: acuerdo. En voz alta y en menos de 60 segundos.' },
          { frente: 'Los siete momentos para parar', reverso: 'Fármaco o intervención de alto riesgo · no traslado o negativa · transferencia · dato que no encaja · deterioro o respuesta inesperada · preocupación de un compañero · estado propio comprometido.' },
          { frente: 'Autochequeo HALTS', reverso: 'Hambre, enojo, retraso, cansancio, estrés. Con dos o más, se pide al compañero una verificación explícita de la siguiente decisión crítica.' },
          { frente: 'Frases de seguridad de la tripulación', reverso: '“Estoy preocupado.” “Estoy incómodo.” “Esto es un problema de seguridad: paramos.” La tercera detiene la acción.' },
          { frente: 'Antes de un fármaco de alto riesgo', reverso: 'Paciente e indicación; contraindicaciones y alergias; dosis en mg, concentración y volumen en mL; vía; repetición en voz alta por quien carga; hora.' },
          { frente: 'Antes de transferir', reverso: '¿Qué verifiqué y qué no? ¿Diagnóstico de trabajo y alternativa principal? ¿Qué espero en la próxima hora? ¿Cómo conoceré el desenlace?' },
          { frente: 'Estructura de una regla de forzamiento', reverso: 'Si [presentación] en [población], entonces descartar [diagnóstico] con [dato o prueba].' },
          { frente: 'TWED', reverso: 'Amenaza (threat) · qué más (what else) · evidencia · disposición.' },
          { frente: 'Disección aórtica: cifras', reverso: 'Déficit de pulso LR+ 5,7 · ausencia de dolor súbito LR− 0,3 · puntaje de riesgo ≥ 1: sensibilidad 95,7 %.' }
        ]
      }
    ]
  });
})();
