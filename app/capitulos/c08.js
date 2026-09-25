/* Capítulo 8. Heurísticas y sesgos cognitivos en entornos de alta presión */
(function () {
  /* Mapa operativo del capítulo: sesgo y contramedida */
  var SESGOS = {
    anclaje: { n: 'Anclaje', c: 'En cada reevaluación, reformular el diagnóstico de trabajo sin mirar el anterior' },
    cierre: { n: 'Cierre prematuro', c: 'Preguntar “¿qué más podría ser?” y descartar de forma activa lo peor' },
    confirmacion: { n: 'Confirmación', c: 'Buscar a propósito el dato que refutaría la hipótesis' },
    disponibilidad: { n: 'Disponibilidad', c: 'Volver a la tasa base del paciente concreto' },
    representatividad: { n: 'Representatividad', c: 'Usar la probabilidad y los LR, no el prototipo' },
    encuadre: { n: 'Encuadre por el despacho', c: 'Tratar la información de terceros como hipótesis' },
    inercia: { n: 'Inercia diagnóstica', c: 'Transferir hallazgos, no etiquetas, y señalar lo no verificado' },
    satisfecha: { n: 'Búsqueda satisfecha', c: 'Buscar la segunda lesión y la causa de la primera' },
    posterior: { n: 'Error de probabilidad posterior', c: 'Evaluar cada episodio como nuevo, con signos vitales completos' },
    confianza: { n: 'Exceso de confianza', c: 'Enunciar una probabilidad y buscar la desconfirmación' },
    costo: { n: 'Costo hundido', c: 'Reevaluar la meta, no la inversión hecha' },
    retro: { n: 'Retrospectiva', c: 'Reconstruir lo que se sabía en cada momento' }
  };
  var ESCENAS = [
    { titulo: 'El dolor de muelas', lineas: [
      { t: 'Despacho: “mujer de 60 años con dolor de muelas”.' },
      { t: 'Su compañero, camino al domicilio: “Dolor de muelas: esto es rápido, la mandamos al dentista”.', s: 'encuadre' },
      { t: 'La paciente refiere dolor mandibular izquierdo desde hace 40 minutos. Está sudorosa.' },
      { t: 'Usted piensa: “La semana pasada atendí un absceso dental igualito”.', s: 'disponibilidad' },
      { t: 'Le aconsejan acudir al dentista mañana. No se hace ECG.', s: 'cierre' }
    ], leccion: 'El dolor mandibular con sudoración a los 60 años puede ser una isquemia coronaria: ECG de 12 derivaciones y signos vitales completos antes de cualquier no traslado.' },
    { titulo: 'El llamador frecuente', lineas: [
      { t: 'Despacho: varón con EPOC y disnea. Es su quinta llamada del mes.' },
      { t: 'Su compañero: “Siempre exagera; veamos qué quiere ahora”.', s: 'posterior' },
      { t: 'FR 32 rpm, SpO2 84 %, somnoliento.' },
      { t: '“Tiene sibilancias, como siempre: es su crisis de siempre.” Nadie valora la somnolencia ni mide la EtCO2.', s: 'confirmacion' }
    ], leccion: 'La somnolencia con hipoxemia sugiere hipercapnia. Cada episodio se evalúa como nuevo, con signos vitales completos y EtCO2 si hay capnografía.' },
    { titulo: 'La anciana que se cayó', lineas: [
      { t: 'Despacho: “anciana de 80 años caída en su casa”.' },
      { t: 'Pierna derecha acortada y en rotación externa, dolor en la cadera.' },
      { t: '“Ya está: fractura de cadera. Inmovilizamos y nos vamos.” Nadie pregunta por qué se cayó.', s: 'satisfecha' },
      { t: 'La hija comenta: “Desde la mañana estaba rara, antes de caerse”.' },
      { t: '“Lo de rara será por el dolor de la cadera.” El diagnóstico de trabajo no cambia.', s: 'anclaje' },
      { t: 'Transferencia: “Fractura de cadera, estable”. No se menciona la confusión previa ni que la glucemia no se midió.', s: 'inercia' }
    ], leccion: 'La fractura explica el dolor, no la caída. Hay que buscar la causa de la primera lesión y declarar en la transferencia lo que no se verificó.' },
    { titulo: 'La vía aérea difícil', lineas: [
      { t: 'Paciente con trauma facial; la SpO2 cae pese a la ventilación.' },
      { t: 'Tercer intento fallido de intubación. El paramédico: “Ya invertimos demasiado; uno más y lo logro”.', s: 'costo' },
      { t: 'Se coloca un dispositivo supraglótico y la SpO2 mejora.' },
      { t: 'En la sesión de revisión alguien dice: “Era obvio desde el principio que había que pasar al supraglótico”.', s: 'retro' }
    ], leccion: 'La meta es oxigenar, no intubar. Y el análisis del caso debe juzgar el razonamiento con la información disponible en su momento.' },
    { titulo: 'La deportista con disnea', lineas: [
      { t: 'Despacho: mujer de 28 años con disnea.' },
      { t: 'Deportista, sin antecedentes. FC 118 lpm, SpO2 91 %.' },
      { t: 'Su compañero: “Una chica joven y en forma no parece un tromboembolismo”.', s: 'representatividad' },
      { t: '“Estoy seguro: es ansiedad. No hace falta pensar más.”', s: 'confianza' }
    ], leccion: 'El parecido con el prototipo no es una probabilidad. Taquicardia e hipoxemia exigen enunciar hipótesis y buscar el dato que las refute.' }
  ];

  function detectorSesgos(el, api) {
    var h = api.h, F = api.fmt;
    var escenas = api.barajar(ESCENAS).slice(0, 4);
    var e = 0, l = 0, pts = 0, totalS = 0, falsas = 0;
    escenas.forEach(function (x) { x.lineas.forEach(function (y) { if (y.s) totalS++; }); });
    var claves = Object.keys(SESGOS);
    function pintarEscena() {
      el.innerHTML = '';
      if (e >= escenas.length) {
        var nota = Math.max(0, (pts - falsas * 0.25) / totalS);
        return api.fin(nota, 'Puntos: ' + F(pts, pts % 1 ? 1 : 0) + ' de ' + totalS + ' sesgos (nombre y contramedida)' + (falsas ? '; ' + falsas + ' falsa(s) alarma(s), 0,25 menos cada una.' : ', sin falsas alarmas.'));
      }
      var E = escenas[e]; l = 0;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Escena ' + (e + 1) + ' de ' + escenas.length));
      el.appendChild(h('h3', { style: 'margin:4px 0 8px' }, E.titulo));
      var guion = h('div'); el.appendChild(guion);
      function linea() {
        if (l >= E.lineas.length) {
          guion.appendChild(h('div', { class: 'experto', html: E.leccion }));
          guion.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { e++; pintarEscena(); } }, e + 1 < escenas.length ? 'Siguiente escena' : 'Ver resultado')));
          return;
        }
        var L = E.lineas[l];
        var fila = h('div', { class: 'datos', style: 'border-left:3px solid var(--linea);padding:4px 10px;margin:8px 0' }, L.t);
        guion.appendChild(fila);
        var zona = h('div'); guion.appendChild(zona);
        var bSeguir = h('button', { class: 'btn sec', onclick: function () {
          zona.removeChild(filaBots);
          if (L.s) {
            fila.style.borderLeftColor = 'var(--rojo)';
            zona.appendChild(h('div', { class: 'fb mal', html: '<b>Se le pasó: ' + SESGOS[L.s].n + '.</b> Contramedida: ' + SESGOS[L.s].c + '.' }));
          }
          l++; linea();
        } }, 'Continuar');
        var bSesgo = h('button', { class: 'btn', onclick: function () {
          zona.removeChild(filaBots);
          if (!L.s) {
            falsas++;
            zona.appendChild(h('div', { class: 'fb info', html: '<b>Aquí no hay sesgo:</b> es un dato. Señalar sin motivo también cuesta atención.' }));
            l++; return linea();
          }
          fila.style.borderLeftColor = 'var(--rojo)';
          nombrar(L, zona);
        } }, 'Aquí hay un sesgo');
        var filaBots = h('div', { class: 'acciones', style: 'margin-top:4px' }, bSesgo, bSeguir);
        zona.appendChild(filaBots);
      }
      function nombrar(L, zona) {
        var ops = api.barajar([L.s].concat(api.barajar(claves.filter(function (k) { return k !== L.s; })).slice(0, 3)));
        zona.appendChild(h('div', { class: 'enunciado' }, '¿Qué sesgo es?'));
        var bs = ops.map(function (k) {
          return h('button', { class: 'opcion', onclick: function () {
            bs.forEach(function (b) { b.disabled = true; });
            var ok = k === L.s; if (ok) pts += 0.5;
            bs[ops.indexOf(L.s)].classList.add('bien'); if (!ok) this.classList.add('mal');
            contramedida(L, zona);
          } }, SESGOS[k].n);
        });
        bs.forEach(function (b) { zona.appendChild(b); });
      }
      function contramedida(L, zona) {
        var otras = api.barajar(claves.filter(function (k) { return k !== L.s; })).slice(0, 2);
        var ops = api.barajar([L.s].concat(otras));
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:8px' }, '¿Qué contramedida aplica ahora?'));
        var bs = ops.map(function (k) {
          return h('button', { class: 'opcion', onclick: function () {
            bs.forEach(function (b) { b.disabled = true; });
            var ok = k === L.s; if (ok) pts += 0.5;
            bs[ops.indexOf(L.s)].classList.add('bien'); if (!ok) this.classList.add('mal');
            l++; linea();
          } }, SESGOS[k].c);
        });
        bs.forEach(function (b) { zona.appendChild(b); });
      }
      linea();
    }
    pintarEscena();
  }

  /* ---------- Triaje START contra reloj ---------- */
  var COLORES = [
    { n: 'Verde: diferido', c: '#1E7A46' }, { n: 'Amarillo: urgente', c: '#C9A000' },
    { n: 'Rojo: inmediato', c: '#B3151B' }, { n: 'Negro: fallecido', c: '#1B1C1D' }
  ];
  var VICTIMAS = [
    { t: 'Camina hacia usted con una herida sangrante en el brazo.', camina: true },
    { t: 'Sentado en el suelo, no puede caminar. FR 34 rpm.', respira: true, fr: 34 },
    { t: 'No camina por una fractura de tibia. FR 20 rpm, pulso radial presente, relleno capilar de 2 s, obedece órdenes.', respira: true, fr: 20, pulso: true, relleno: 2, obedece: true },
    { t: 'Tendido, no respira. Al abrir la vía aérea sigue sin respirar.', respira: false, via: false },
    { t: 'Tendido, no respira. Al abrir la vía aérea empieza a respirar.', respira: false, via: true },
    { t: 'No camina. FR 24 rpm, sin pulso radial palpable.', respira: true, fr: 24, pulso: false },
    { t: 'No camina. FR 18 rpm, pulso radial presente, relleno capilar de 4 s.', respira: true, fr: 18, pulso: true, relleno: 4 },
    { t: 'No camina. FR 22 rpm, pulso radial presente, relleno de 1 s. No obedece órdenes simples.', respira: true, fr: 22, pulso: true, relleno: 1, obedece: false },
    { t: 'Camina por la escena con una fractura abierta de antebrazo y se queja mucho.', camina: true },
    { t: 'No camina por dolor en la cadera. FR 28 rpm, pulso radial presente, relleno de 2 s, obedece órdenes.', respira: true, fr: 28, pulso: true, relleno: 2, obedece: true },
    { t: 'Grita y llora junto al vehículo; no puede ponerse de pie. FR 26 rpm, pulso radial, relleno de 1 s, obedece órdenes.', respira: true, fr: 26, pulso: true, relleno: 1, obedece: true }
  ];
  function arbolSTART(v) {
    var r = [];
    if (v.camina) { r.push('¿Camina? Sí'); return [0, r]; }
    r.push('¿Camina? No');
    if (!v.respira) {
      r.push('¿Respira? No');
      if (v.via) { r.push('¿Respira al abrir la vía? Sí'); return [2, r]; }
      r.push('¿Respira al abrir la vía? No'); return [3, r];
    }
    r.push('¿Respira? Sí');
    if (v.fr > 30) { r.push('FR ' + v.fr + ': mayor de 30'); return [2, r]; }
    r.push('FR ' + v.fr + ': no mayor de 30');
    if (!v.pulso) { r.push('Sin pulso radial'); return [2, r]; }
    if (v.relleno > 2) { r.push('Relleno de ' + v.relleno + ' s: más de 2'); return [2, r]; }
    r.push('Pulso radial y relleno de 2 s o menos');
    if (!v.obedece) { r.push('No obedece órdenes'); return [2, r]; }
    r.push('Obedece órdenes'); return [1, r];
  }

  function triajeSTART(el, api) {
    var h = api.h, F = api.fmt;
    var V = api.barajar(VICTIMAS).slice(0, 8), i = 0, bien = 0, t0Total = Date.now();
    function victima() {
      el.innerHTML = '';
      if (i >= V.length) {
        var seg = (Date.now() - t0Total) / 1000;
        return api.fin(bien / V.length, bien + ' de ' + V.length + ' víctimas bien clasificadas. Tiempo total de decisión: ' + F(seg) + ' s (' + F(seg / V.length, 1) + ' s por víctima, con la lectura).');
      }
      var v = V[i], res = arbolSTART(v), t0 = Date.now();
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Víctima ' + (i + 1) + ' de ' + V.length));
      el.appendChild(h('div', { class: 'caja', style: 'font-weight:600' }, v.t));
      var zona = h('div');
      var bs = COLORES.map(function (c, k) {
        return h('button', { class: 'opcion', style: 'border-left:8px solid ' + c.c, onclick: function () {
          bs.forEach(function (b) { b.disabled = true; });
          var ok = k === res[0]; if (ok) bien++;
          bs[res[0]].classList.add('bien'); if (!ok) this.classList.add('mal');
          zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: '<b>' + (ok ? 'Correcto' : 'Era ' + COLORES[res[0]].n.toLowerCase()) + '.</b> Ruta: ' + res[1].join(' → ') + '. Decisión en ' + F((Date.now() - t0) / 1000, 1) + ' s.' +
            (v.camina && /fractura/.test(v.t) ? ' El árbol acepta errores individuales a cambio de clasificar a muchas víctimas en segundos: se reevalúa después.' : '') }));
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; victima(); } }, i + 1 < V.length ? 'Siguiente víctima' : 'Ver resultado')));
        } }, c.n);
      });
      bs.forEach(function (b) { el.appendChild(b); });
      el.appendChild(zona);
    }
    victima();
  }

  TDC.registrar({
    numero: 8, parte: 'III',
    titulo: 'Heurísticas y sesgos cognitivos en entornos de alta presión',
    mision: 'Nombre el sesgo en el momento en que actúa y aplique su contramedida antes de que cierre el caso.',
    objetivo: 'Identificar en tiempo real los sesgos más frecuentes, reconocer sus señales de alarma en la escena y asociar a cada uno una contramedida concreta.',
    escena: 'Madrugada. El despacho ya le dio un diagnóstico y la familia, otro. Cada atajo mental le ahorra tiempo y casi siempre acierta, <b>hasta que el caso no es el que parece</b>. Su tarea no es dejar de usar atajos, sino detectar a tiempo la señal de alarma y aplicar la contramedida.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Detector de sesgos en tiempo real', render: detectorSesgos,
        instrucciones: 'Cuatro escenas se desarrollan línea a línea. Pulse «Aquí hay un sesgo» en el momento en que aparece, nómbrelo y elija la contramedida. Si deja pasar un sesgo, no suma; cada falsa alarma resta 0,25.'
      },
      {
        tipo: 'caso', titulo: 'El “cólico renal” del hombre de 67 años',
        presentacion: '<b>02:10. Despacho:</b> “cólico renal, dolor muy fuerte”. La esposa cuenta que su marido “tiene problemas de riñón”.',
        fases: [
          {
            titulo: 'Primer contacto',
            monitor: { FC: '98 lpm', PA: '108/70', SpO2: '96 %' },
            datos: 'Varón de 67 años, hipertenso, fumador de 40 paquetes-año. Dolor lumbar izquierdo súbito e intenso irradiado a la ingle, vómitos, inquietud. Pálido y sudoroso.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hipótesis enuncia?',
              opciones: ['Cólico renal típico: analgesia y traslado sin prioridad', 'Cólico renal o aneurisma de aorta roto; el segundo no se puede perder', 'Lumbalgia mecánica con dolor irradiado a la ingle'],
              correcta: 1,
              explicacion: 'Un primer cólico renal a los 67 años es raro, y el aneurisma roto es su simulador clásico. La etiqueta del despacho y de la familia es una hipótesis, no un dato.' },
            experto: '“Dolor en el flanco a los 67 años y primer episodio: cólico renal o aneurisma. El segundo es el que no puedo perder.”'
          },
          {
            titulo: 'Un dato que no pertenece',
            datos: 'La esposa añade que se desmayó un momento al levantarse para ir al baño.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace con el síncope?',
              opciones: ['Lo atribuyo al dolor intenso y a los vómitos', 'Lo registro, pero no cambia mi hipótesis', 'Un cólico no desmaya: pregunto por su presión habitual'],
              correcta: 2,
              explicacion: 'El síncope no pertenece al cólico renal y empuja hacia una hemorragia. Leer solo los datos que encajan es el sesgo de confirmación.' },
            experto: '“Un cólico no desmaya. El síncope me empuja hacia una hemorragia.”'
          },
          {
            titulo: 'La presión arterial',
            datos: 'La esposa dice que su presión habitual ronda 150/90 mmHg.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo lee la PA de 108/70?',
              opciones: ['Hipotensión relativa: ha perdido unos 40 mmHg', 'Normal: está por encima de 90 mmHg', 'Buena respuesta al reposo de un hipertenso'],
              correcta: 0,
              explicacion: 'Anclarse en el valor “normal” oculta una caída de unos 40 mmHg respecto de su basal.' },
            experto: '“108 con una basal de 150: ha perdido 40 mmHg.”'
          },
          {
            titulo: 'El abdomen',
            datos: 'Abdomen obeso, doloroso de forma difusa, sin masa palpable.',
            decision: { tipo: 'opcion', pregunta: '¿Descarta el aneurisma?',
              opciones: ['Sí: sin masa pulsátil no hay aneurisma importante', 'No: la ausencia de masa apenas descarta (LR− 0,72)', 'Sí, si además no hay sangre en la orina'],
              correcta: 1,
              explicacion: 'La masa pulsátil tiene LR+ 12, pero su ausencia casi no cambia la probabilidad, sobre todo en obesos. En manos entrenadas, la ecografía de aorta alcanza sensibilidad de 99 % y especificidad de 98 %.' },
            experto: '“Obeso y sin masa palpable: la palpación no descarta.”'
          },
          {
            titulo: 'Tratamiento en ruta',
            decision: { tipo: 'multiple', pregunta: 'Marque lo que corresponde.',
              opciones: ['Dos accesos venosos gruesos', 'Antiinflamatorio intravenoso para el dolor', 'Opioide titulado', 'Reposición guiada por el estado mental y una PAS cercana a 80 o 90 mmHg', 'Fluidos hasta recuperar su PA habitual de 150', 'Preaviso a un centro con cirugía vascular'],
              correctas: [0, 2, 3, 5],
              explicacion: 'Hipotensión permisiva, analgesia con opioide y sin antiinflamatorios, contraindicados si hay posibilidad de hemorragia.' }
          },
          {
            titulo: 'Transferencia',
            decision: { tipo: 'opcion', pregunta: '¿Qué transferencia protege al equipo receptor de la inercia diagnóstica?',
              opciones: ['“Cólico renal izquierdo con vómitos; recibió analgesia en ruta”', '“Varón de 67 años con dolor lumbar súbito, síncope y PA 108/70 con basal de 150/90. No hemos descartado un aneurisma; no se exploró la aorta con ecografía”', '“Probable aneurisma roto confirmado clínicamente”'],
              correcta: 1,
              explicacion: 'Separa los hallazgos de las interpretaciones y declara lo que no se verificó.' }
          }
        ],
        cierre: 'En el caso real se dio un antiinflamatorio y se trasladó con prioridad baja como “cólico renal”. A los 50 minutos, en la sala de espera, la PA cayó a 70/40 mmHg: aneurisma de aorta de 7 cm con rotura retroperitoneal, reparado con varias horas de demora. En una revisión sistemática, 42 % de los aneurismas rotos se diagnosticó mal en el primer contacto, y el cólico renal fue el error más frecuente. Ante un diagnóstico benigno frecuente, pregunte qué enfermedad letal lo imita en este paciente.'
      },
      {
        tipo: 'clasificar', titulo: 'Los cinco sesgos nucleares',
        instrucciones: 'Asigne a cada situación el sesgo que mejor la describe.',
        categorias: ['Anclaje', 'Cierre prematuro', 'Confirmación', 'Disponibilidad', 'Representatividad'],
        items: [
          { texto: 'El “ebrio” del despacho sigue siendo ebrio pese a la diaforesis y la piel fría', cat: 0, porque: 'La primera etiqueta sigue intacta pese a datos nuevos.' },
          { texto: '“Es un cólico renal”, y no se buscan signos de aneurisma', cat: 1, porque: 'Se acepta un diagnóstico antes de verificarlo y se deja de buscar.' },
          { texto: 'El olor a alcohol se registra; la glucemia no se mide', cat: 2, porque: 'Solo se buscan los datos que apoyan la hipótesis.' },
          { texto: 'Tras una semana de cuadros virales, todo febril “es otro virus”', cat: 3, porque: 'La facilidad de recordar casos sustituye a la frecuencia real.' },
          { texto: 'La mujer joven con disnea “no parece” un tromboembolismo', cat: 4, porque: 'Se juzga por el parecido con el prototipo, ignorando la probabilidad.' },
          { texto: 'El despacho informó dolor de 3 sobre 10 y el equipo lo sigue tratando como leve aunque el paciente se retuerce', cat: 0, porque: 'Un número inicial fija la estimación y se ajusta poco.' },
          { texto: 'Una semana después de un aneurisma roto, todo dolor lumbar le parece un aneurisma', cat: 3, porque: 'Lo reciente y llamativo pesa más en la mente que cien casos rutinarios.' },
          { texto: 'Solo busca sibilancias y el antecedente de asma; no ausculta la asimetría del murmullo', cat: 2, porque: 'No busca el dato que podría refutar su hipótesis.' },
          { texto: 'Un joven deportista con dolor torácico “no tiene cara de infarto”', cat: 4, porque: 'El parecido ignora que un cuadro atípico puede ser más probable que uno típico de algo raro.' },
          { texto: 'Se acepta “ansiedad” y ya no se toma la SpO2', cat: 1, porque: 'La búsqueda se detiene antes de verificar.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: 'Triaje START: una heurística bien usada', render: triajeSTART,
        instrucciones: 'Accidente con múltiples víctimas. Clasifique a cada una con el árbol START lo más rápido que pueda. Ninguna clasificación exige un diagnóstico: el árbol se detiene en la primera señal decisiva.'
      },
      {
        tipo: 'quiz', titulo: 'Heurísticas, sesgos y evidencia',
        preguntas: [
          { p: 'En el experimento de la ruleta, un número irrelevante movió las estimaciones 20 puntos. ¿Cuál es la contramedida en la escena?', opciones: ['Ignorar por completo la información del despacho', 'Construir la estimación propia antes de mirar la ajena', 'Pedir siempre una segunda opinión al hospital', 'Anotar la cifra del despacho como dato clínico'], correcta: 1, explicacion: 'El ancla puede ser la puntuación de dolor del despacho, una PA previa o el diagnóstico del familiar. Se reformula la estimación en cada reevaluación.' },
          { p: '¿Por qué “cólico renal” es una etiqueta peligrosa después de los 60 años?', opciones: ['Porque la tasa base del cólico cae y la del aneurisma, que lo imita, aumenta', 'Porque a esa edad el cólico renal es mucho más doloroso', 'Porque los analgésicos habituales no funcionan en mayores', 'Porque la hematuria, si aparece, descarta el aneurisma'], correcta: 0, explicacion: 'El aneurisma roto imita el cólico, incluso con hematuria, y el costo del error es asimétrico.' },
          { p: 'En la revisión de un caso con mal desenlace todos coinciden en que el error “era evidente”. ¿Qué ocurre?', opciones: ['El equipo de la escena fue negligente', 'Un sesgo de disponibilidad del equipo revisor', 'Una revisión bien hecha y objetiva', 'Un sesgo retrospectivo y de resultado'], correcta: 3, explicacion: 'Los evaluadores identifican más sesgos cuando el desenlace fue malo. Se reconstruye la cronología con lo que se sabía en cada momento.' },
          { p: '¿Qué hace buena a una heurística como el triaje START?', opciones: ['Que usa toda la información disponible', 'Que sustituye al diagnóstico definitivo', 'Pocas señales, orden fijo, regla de parada y decisión explícita', 'Que nunca comete errores individuales'], correcta: 2, explicacion: 'Esa estructura la hace rápida, transparente y fácil de enseñar. Es buena en el entorno para el que se diseñó.' },
          { p: 'Residentes que acababan de ver casos de una enfermedad diagnosticaron peor casos nuevos que solo se le parecían. ¿Qué corrigió ese efecto?', opciones: ['Ver todavía más casos de la misma enfermedad', 'El razonamiento reflexivo estructurado', 'Responder más rápido para no sobrepensar', 'Memorizar la lista completa de sesgos'], correcta: 1, explicacion: 'Mamede et al. indujeron un sesgo de disponibilidad y la reflexión estructurada lo corrigió. Conocer la lista de sesgos, por sí solo, no garantiza detectarlos.' },
          { p: 'El encuadre por el despacho y la inercia diagnóstica se corrigen mejor con…', opciones: ['Exhortaciones a tener más cuidado', 'Sanciones al personal de despacho', 'Más experiencia individual de la tripulación', 'Diseño: preguntas estructuradas y protocolos de transferencia'], correcta: 3, explicacion: 'Son sesgos del sistema: los produce la forma en que circula la información.' },
          { p: 'La representatividad responde una pregunta fácil en lugar de una difícil. ¿Cuál sustituye a cuál?', opciones: ['“¿Qué tan fácil es recordarlo?” por “¿qué tan grave es?”', '“¿Qué dijo el despacho?” por “¿qué encontré?”', '“¿Cuánto se parece al caso típico?” por “¿qué tan probable es?”', '“¿Qué haría un experto?” por “¿qué hago yo?”'], correcta: 2, explicacion: 'Un cuadro típico de una enfermedad rara sigue siendo menos probable que un cuadro atípico de una frecuente.' },
          { p: 'Una revisión de 20 estudios asoció el exceso de confianza, el anclaje y la disponibilidad con inexactitudes en 36,5 a 77 % de los escenarios. ¿Qué no se concluye?', opciones: ['Que los sesgos son frecuentes', 'Que se asocian con errores diagnósticos', 'Que todo error diagnóstico es un sesgo', 'Que merece la pena buscar contramedidas'], correcta: 2, explicacion: 'Muchos errores nacen de conocimiento insuficiente o de datos que nunca se recogieron.' },
          { p: 'Despacho: “dolor de muelas”. Mujer de 60 años con dolor mandibular y sudoración. ¿Qué hace antes de decidir?', opciones: ['ECG de 12 derivaciones y signos vitales completos', 'Revisar la boca en busca de un absceso', 'Recomendar analgesia y consulta dental', 'Preguntar si ya tuvo abscesos antes'], correcta: 0, explicacion: 'El dolor mandibular puede ser la presentación de una isquemia coronaria. La edad y la sudoración son señales de alarma.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Cómo viaja una etiqueta',
        instrucciones: 'Ordene el recorrido de la etiqueta “está borracho” desde la llamada hasta el médico.',
        pasos: [
          'El alertante dice: “está borracho”',
          'El despacho codifica “intoxicación etílica”',
          'La tripulación transfiere “ebrio”',
          'El triaje hospitalario asigna baja prioridad',
          'El médico lo ve horas después'
        ],
        explicacion: 'En cada paso la etiqueta gana autoridad, aunque nadie la haya verificado. La contramedida es estructural: en la transferencia se separan los hallazgos de las interpretaciones y se declara lo que no se verificó (capítulo 16).'
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso: sesgo y contramedida',
        tarjetas: [
          { frente: 'Anclaje', reverso: 'Señal: la primera etiqueta sigue intacta. Contramedida: reformular el diagnóstico en cada reevaluación sin mirar el anterior.' },
          { frente: 'Cierre prematuro', reverso: 'El fallo cognitivo más frecuente en el análisis de Graber. Contramedida: “¿qué más podría ser?” y descartar lo peor.' },
          { frente: 'Confirmación', reverso: 'Buscar a propósito el dato que refutaría la hipótesis.' },
          { frente: 'Disponibilidad', reverso: '“La semana pasada tuve uno igual.” Volver a la tasa base del paciente concreto.' },
          { frente: 'Representatividad', reverso: '“No parece.” Usar la probabilidad y los LR, no el prototipo.' },
          { frente: 'Búsqueda satisfecha', reverso: 'Buscar la segunda lesión y la causa de la primera.' },
          { frente: 'Error de probabilidad posterior', reverso: '“Siempre es lo mismo.” Evaluar cada episodio como nuevo, con signos vitales completos.' },
          { frente: 'Costo hundido', reverso: 'Reevaluar la meta, no la inversión hecha.' },
          { frente: 'Sesgo retrospectivo', reverso: '“Era obvio.” Reconstruir lo que se sabía en cada momento.' },
          { frente: 'Árbol START', reverso: '¿Camina? → ¿respira (y al abrir la vía)? → ¿FR > 30? → ¿pulso radial y relleno ≤ 2 s? → ¿obedece órdenes?' },
          { frente: 'Masa pulsátil en el aneurisma', reverso: 'LR+ 12, pero LR− 0,72: su ausencia apenas descarta, sobre todo en obesos.' }
        ]
      }
    ]
  });
})();
