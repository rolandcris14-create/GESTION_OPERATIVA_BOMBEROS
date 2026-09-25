/* Capítulo 11. Reconocimiento de patrones y toma de decisiones naturalista */
(function () {

  /* ---------- Detector de violaciones de expectativas ----------
     Cada escena parte de un patrón reconocido. Los datos llegan de uno en uno.
     v: true si el dato viola la expectativa del patrón. */
  var ESCENAS = [
    {
      patron: 'Crisis de ansiedad', contexto: 'Mujer de 32 años que hiperventila tras una discusión. El despacho informa «crisis de nervios».',
      datos: [
        { t: 'Está muy angustiada y dice que no puede respirar', v: false },
        { t: 'Sin hallazgos focales en la exploración', v: false },
        { t: 'SpO2 de 89 % al aire', v: true },
        { t: 'FC de 132 lpm que no baja cuando se calma', v: true },
        { t: 'Dolor en el costado que aumenta al inspirar', v: true }
      ],
      reevaluar: true, final: 'Hipoxemia, taquicardia desproporcionada y dolor pleurítico no encajan con la ansiedad. Reconstruya la historia: tromboembolismo pulmonar u otra causa orgánica.'
    },
    {
      patron: 'Síncope vasovagal', contexto: 'Estudiante de 19 años que se desmayó en una campaña de donación de sangre.',
      datos: [
        { t: 'Se desmayó al ver la aguja, estando de pie', v: false },
        { t: 'Antes tuvo calor, náuseas y visión en túnel', v: false },
        { t: 'Se recuperó en segundos, orientada', v: false },
        { t: 'Sin palpitaciones previas y sin cardiopatía conocida', v: false },
        { t: 'ECG de 12 derivaciones normal', v: false }
      ],
      reevaluar: false, final: 'Todo lo que el patrón predice está presente: desencadenante, pródromo, bipedestación, recuperación rápida y ECG normal. Mantenga el patrón, con reevaluación.'
    },
    {
      patron: 'Síncope vasovagal', contexto: 'Varón de 24 años que se desmayó en un partido de fútbol. Su amigo dice: «se bajó la presión».',
      datos: [
        { t: 'Se recuperó en menos de un minuto', v: false },
        { t: 'Se desmayó mientras corría detrás del balón', v: true },
        { t: 'Notó palpitaciones justo antes', v: true },
        { t: 'No tuvo calor ni náuseas previas', v: true },
        { t: 'Su padre murió de forma súbita a los 40 años', v: true }
      ],
      reevaluar: true, final: 'Esfuerzo, palpitaciones, ausencia de pródromo y muerte súbita familiar son el guion del síncope arrítmico: ECG y traslado.'
    },
    {
      patron: 'Cólico renal', contexto: 'Varón de 30 años con dolor intenso en el flanco derecho. Tuvo cálculos hace un año.',
      datos: [
        { t: 'El dolor va del flanco a la ingle', v: false },
        { t: 'No se puede quedar quieto del dolor', v: false },
        { t: 'Vomitó una vez', v: false },
        { t: 'PA 132/84 y FC 96 lpm, bien perfundido', v: false }
      ],
      reevaluar: false, final: 'Paciente joven, estable, con antecedente de litiasis: el patrón se sostiene. Siga vigilando lo que lo violaría: síncope o hipotensión.'
    },
    {
      patron: 'Cólico renal', contexto: 'Varón de 72 años con dolor en el flanco izquierdo. Su esposa dice: «son los riñones otra vez».',
      datos: [
        { t: 'El dolor en el flanco es intenso y lo hace vomitar', v: false },
        { t: 'Se desmayó al levantarse para ir al baño', v: true },
        { t: 'PA 102/64 en un hipertenso que suele tener 160', v: true },
        { t: 'Fumador de toda la vida', v: true }
      ],
      reevaluar: true, final: 'Edad, síncope, hipotensión relativa y perfil vascular: el patrón del cólico cae y aparece el del aneurisma roto.'
    },
    {
      patron: 'Intoxicación etílica', contexto: 'Varón hallado en la vereda un sábado por la noche. Huele a alcohol.',
      datos: [
        { t: 'Aliento alcohólico y botella vacía al lado', v: false },
        { t: 'Piel fría y sudorosa', v: true },
        { t: 'Glucemia capilar de 42 mg/dL', v: true },
        { t: 'No mueve el brazo derecho', v: true }
      ],
      reevaluar: true, final: 'Diaforesis fría, glucemia baja y focalidad no pertenecen a la intoxicación etílica. Trate la hipoglucemia y busque ictus o trauma.'
    },
    {
      patron: 'Crisis asmática', contexto: 'Mujer de 28 años con asma conocida y sibilancias. Ya recibió dos nebulizaciones de salbutamol.',
      datos: [
        { t: 'Sibilancias bilaterales al llegar', v: false },
        { t: 'A los 20 minutos, el mismo trabajo respiratorio', v: true },
        { t: 'Murmullo abolido en el hemitórax derecho', v: true }
      ],
      reevaluar: true, final: 'Falta la respuesta esperada al broncodilatador y aparece un signo unilateral: neumotórax, tapón mucoso, cuerpo extraño o edema pulmonar.'
    },
    {
      patron: 'Hipoglucemia', contexto: 'Diabético de 66 años, inconsciente en su casa. Glucemia de 38 mg/dL. Recibe dextrosa.',
      datos: [
        { t: 'Glucemia de control a los 5 minutos: 142 mg/dL', v: false },
        { t: 'A los 10 minutos de la dextrosa sigue sin despertar', v: true },
        { t: 'Pupilas asimétricas', v: true }
      ],
      reevaluar: true, final: 'La dextrosa debía mejorar la conciencia en 5 a 10 minutos. Si no ocurre, busque otra causa de coma: ictus, trauma, intoxicación o sepsis.'
    },
    {
      patron: 'Anafilaxia', contexto: 'Mujer con urticaria generalizada, estridor e hipotensión tras una picadura. Recibe adrenalina intramuscular.',
      datos: [
        { t: 'A los pocos minutos, la PA sube', v: false },
        { t: 'El estridor disminuye', v: false },
        { t: 'Menos broncoespasmo a la auscultación', v: false }
      ],
      reevaluar: false, final: 'Se cumple la expectativa del tratamiento: mejoría en minutos. Mantenga el patrón y la vigilancia.'
    },
    {
      patron: 'Gastroenteritis', contexto: 'Tres trabajadores de un taller cerrado llaman por náuseas. Esa semana hubo muchos casos de gastroenteritis.',
      datos: [
        { t: 'Los tres comenzaron a la vez, en el mismo lugar', v: true },
        { t: 'Ninguno tiene diarrea', v: true },
        { t: 'Predomina la cefalea', v: true },
        { t: 'Tienen náuseas', v: false }
      ],
      reevaluar: true, final: 'Varios afectados a la vez, sin diarrea y con cefalea: el diagnóstico puede ser el lugar. Salga con ellos y piense en monóxido de carbono.'
    }
  ];

  function detector(el, api) {
    var h = api.h, F = api.fmt;
    var esc = api.barajar(ESCENAS).slice(0, 5), e = 0, puntos = 0, total = 0, tiempos = [];
    function escena() {
      el.innerHTML = '';
      if (e >= esc.length) {
        var medio = tiempos.reduce(function (a, b) { return a + b; }, 0) / (tiempos.length || 1);
        return api.fin(puntos / total, puntos + ' de ' + total + ' juicios correctos · tiempo medio por dato: ' + F(medio, 1) + ' s', true);
      }
      var s = esc[e], d = 0;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Escena ' + (e + 1) + ' de ' + esc.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Patrón reconocido: ' + s.patron + '</span>' + s.contexto }));
      var lista = h('div'); el.appendChild(lista);
      var zona = h('div'); el.appendChild(zona);
      function dato() {
        zona.innerHTML = '';
        if (d >= s.datos.length) return decidir();
        var x = s.datos[d], t0 = Date.now();
        zona.appendChild(h('div', { class: 'enunciado' }, 'Nuevo dato: ' + x.t));
        function juzgar(dijo) {
          tiempos.push((Date.now() - t0) / 1000);
          var ok = dijo === x.v; total++; if (ok) puntos++;
          lista.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (x.v ? '<b>No encaja.</b> ' : '<b>Encaja.</b> ') + x.t + (ok ? '' : ' <i>(usted marcó lo contrario)</i>') }));
          d++; dato();
        }
        zona.appendChild(h('div', { class: 'acciones' },
          h('button', { class: 'btn sec', onclick: function () { juzgar(false); } }, 'Encaja con el patrón'),
          h('button', { class: 'btn', onclick: function () { juzgar(true); } }, 'No encaja')));
      }
      function decidir() {
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Con todos los datos, ¿qué hace con el patrón?'));
        var ops = [['Mantener el patrón y seguir vigilando', false], ['Volver a diagnosticar la situación', true]].map(function (o) {
          return h('button', { class: 'opcion', onclick: function () {
            ops.forEach(function (b) { b.disabled = true; });
            var ok = o[1] === s.reevaluar; total++; if (ok) puntos++;
            this.classList.add(ok ? 'bien' : 'mal');
            zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + s.final }));
            zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { e++; escena(); } }, e + 1 < esc.length ? 'Siguiente escena' : 'Ver resultado')));
          } }, o[0]);
        });
        ops.forEach(function (b) { zona.appendChild(b); });
      }
      dato();
    }
    escena();
  }

  /* ---------- Pre-mortem en 30 segundos ----------
     causas: r = relevante para el plan; m = índice de su contramedida. */
  var PLANES = [
    {
      plan: 'Traslado de 3 horas por carretera de un paciente séptico con PA de 92/58 mmHg.',
      causas: [
        { t: 'Hipotensión progresiva', r: true, m: 0 },
        { t: 'Se agotó el oxígeno a mitad de camino', r: true, m: 1 },
        { t: 'Se perdió el acceso venoso', r: true, m: 2 },
        { t: 'El hospital no sabía que llegábamos', r: true, m: 3 },
        { t: 'El paciente no cumplía la regla NEXUS', r: false },
        { t: 'Se administró ácido tranexámico tarde', r: false }
      ],
      medidas: ['Reevaluación cada 10 minutos y plan de vasopresor si el protocolo lo permite', 'Oxígeno calculado para el doble del tiempo previsto', 'Dos accesos venosos antes de salir', 'Preaviso e identificar un hospital intermedio']
    },
    {
      plan: 'Intubación en la escena de un paciente con vía aérea comprometida.',
      causas: [
        { t: 'Desaturó durante el intento', r: true, m: 0 },
        { t: 'No vimos la glotis', r: true, m: 1 },
        { t: 'El tubo quedó en el esófago sin que lo notáramos', r: true, m: 2 },
        { t: 'Se retrasó la fibrinólisis', r: false },
        { t: 'Falló el torniquete', r: false }
      ],
      medidas: ['Mejor preoxigenación y un límite de SpO2 para abortar', 'Dispositivo supraglótico y plan quirúrgico preparados', 'Capnografía con onda para confirmar la posición del tubo']
    },
    {
      plan: 'Bajar por una escalera estrecha a un paciente obeso con la vía aérea comprometida.',
      causas: [
        { t: 'Vomitó en el giro de la escalera', r: true, m: 0 },
        { t: 'Nadie sostenía la cabeza en el tramo estrecho', r: true, m: 1 },
        { t: 'Nos detuvimos donde no había espacio para actuar', r: true, m: 2 },
        { t: 'La glucemia capilar estaba mal calibrada', r: false },
        { t: 'El ECG tenía artefactos', r: false }
      ],
      medidas: ['Aspiración preparada y a mano durante el descenso', 'Asignar antes de salir quién sostiene la cabeza', 'Definir de antemano dónde se detendrá el equipo']
    },
    {
      plan: 'Decisión de no traslado de un adulto con dolor abdominal leve y signos vitales normales.',
      causas: [
        { t: 'Tenía una enfermedad grave que no buscamos', r: true, m: 0 },
        { t: 'No reconoció los signos de alarma cuando aparecieron', r: true, m: 1 },
        { t: 'Estaba solo cuando empeoró', r: true, m: 2 },
        { t: 'No quedó constancia de lo que se le explicó', r: true, m: 3 },
        { t: 'Faltó la descompresión torácica', r: false }
      ],
      medidas: ['Evaluación estructurada con los diagnósticos que no pueden perderse', 'Signos de alarma por escrito y pedirle que los repita', 'Acompañante y una vía clara para volver a llamar', 'Registro de la información dada y del razonamiento']
    }
  ];

  function premortem(el, api) {
    var h = api.h;
    var planes = api.barajar(PLANES).slice(0, 2), n = 0, suma = 0;
    function vivo() { return document.body.contains(el); }
    function ronda() {
      el.innerHTML = '';
      if (n >= planes.length) return api.fin(suma / planes.length, 'Pre-mortem completados: ' + planes.length + ' · desempeño medio ' + Math.round(suma / planes.length * 100) + ' %', true);
      var P = planes[n], causas = api.barajar(P.causas), marc = {}, restante = 30, cerrado = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Plan ' + (n + 1) + ' de ' + planes.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">El plan</span>' + P.plan }));
      el.appendChild(h('div', { class: 'enunciado' }, '«Imaginemos que esto salió mal. ¿Qué fue lo más probable?» Marque las causas que pertenecen a este plan.'));
      var reloj = h('div', { class: 'cifra' }, h('small', null, 'Tiempo'), '30 s');
      el.appendChild(reloj);
      var bots = causas.map(function (c, k) {
        return h('button', { class: 'opcion', onclick: function () {
          if (cerrado) return;
          marc[k] = !marc[k]; this.classList.toggle('sel', marc[k]); this.innerHTML = (marc[k] ? '☑ ' : '☐ ') + c.t;
        } }, '☐ ' + c.t);
      });
      bots.forEach(function (b) { el.appendChild(b); });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () { cerrar(); } }, 'Listo');
      el.appendChild(h('div', { class: 'acciones' }, bt));
      el.appendChild(zona);
      var iv = setInterval(function () {
        if (!vivo()) { clearInterval(iv); return; }
        restante--; reloj.lastChild.textContent = restante + ' s';
        if (restante <= 0) cerrar();
      }, 1000);
      function cerrar() {
        if (cerrado) return; cerrado = true; clearInterval(iv); bt.disabled = true;
        var relevantes = causas.filter(function (c) { return c.r; }).length, aciertos = 0, falsos = 0;
        bots.forEach(function (b, k) {
          b.disabled = true;
          var c = causas[k];
          if (c.r && marc[k]) { aciertos++; b.classList.add('bien'); }
          else if (c.r) b.classList.add('mal');
          else if (marc[k]) { falsos++; b.classList.add('mal'); }
        });
        var notaCausas = Math.max(0, (aciertos - falsos) / relevantes);
        zona.appendChild(h('div', { class: 'fb ' + (notaCausas >= 0.8 ? 'bien' : 'info'), html: '<b>' + aciertos + ' de ' + relevantes + ' causas pertinentes' + (falsos ? ', ' + falsos + ' ajena' + (falsos > 1 ? 's' : '') + ' al plan' : '') + '.</b> ' + (restante <= 0 ? 'Se acabó el tiempo. ' : '') + 'Las causas en rojo sin marcar también formaban parte del pre-mortem.' }));
        /* Segunda parte: una contramedida para cada causa pertinente. */
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Asigne una contramedida a cada causa'));
        var sels = [];
        causas.forEach(function (c) {
          if (!c.r) return;
          var s = h('select', { 'aria-label': 'Contramedida para ' + c.t, style: 'width:100%' },
            h('option', { value: '' }, 'Elija una contramedida…'),
            api.barajar(P.medidas.map(function (_, j) { return j; })).map(function (j) { return h('option', { value: j }, P.medidas[j]); }));
          sels.push({ s: s, c: c });
          zona.appendChild(h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, c.t), s));
        });
        var aviso = h('span', { class: 'pregunta-n' });
        var bt2 = h('button', { class: 'btn', onclick: function () {
          if (sels.some(function (x) { return x.s.value === ''; })) { aviso.textContent = 'Asigne todas las contramedidas.'; return; }
          bt2.disabled = true; aviso.textContent = '';
          var bien = 0;
          sels.forEach(function (x) {
            x.s.disabled = true;
            var ok = +x.s.value === x.c.m; if (ok) bien++;
            x.s.parentNode.classList.add(ok ? 'bien' : 'mal');
            if (!ok) x.s.parentNode.appendChild(h('div', { class: 'porque' }, 'Correcto: ' + P.medidas[x.c.m] + '.'));
          });
          var nota = 0.5 * notaCausas + 0.5 * bien / sels.length;
          suma += nota;
          zona.appendChild(h('div', { class: 'fb info', html: 'Cada causa nombrada lleva a una medida concreta y a un plan alternativo. Un pre-mortem de 30 segundos es útil antes de una intubación, un traslado largo o una decisión de no traslado.' }));
          zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { n++; ronda(); } }, n + 1 < planes.length ? 'Siguiente plan' : 'Ver resultado')));
        } }, 'Comprobar contramedidas');
        zona.appendChild(h('div', { class: 'acciones' }, bt2, aviso));
      }
    }
    ronda();
  }

  TDC.registrar({
    numero: 11, parte: 'IV',
    titulo: 'Reconocimiento de patrones y toma de decisiones naturalista',
    mision: 'Detecte las expectativas violadas, simule el plan antes de ejecutarlo y use bien la sensación de alarma.',
    objetivo: 'Usar el reconocimiento de patrones de forma consciente, detectar las violaciones de expectativas que obligan a reevaluar y aplicar la simulación mental en la escena.',
    escena: 'En la escena usted reconoce situaciones antes de terminar la anamnesis. Ese reconocimiento es su mayor fortaleza y su mayor riesgo: cada patrón predice qué debería ver. Su tarea es notar <b>lo que falta o sobra</b> antes de que el patrón equivocado cierre el caso.',
    actividades: [
      {
        tipo: 'caso', titulo: 'Una familia entera con cefalea',
        presentacion: '<b>07:10, madrugada fría en una ciudad de altura.</b> Despacho: «mujer con dolor de cabeza y vómitos». Su tripulación viene de una semana con muchos casos de gastroenteritis viral.',
        fases: [
          {
            titulo: 'En el departamento',
            monitor: { 'SpO2 madre': '98 %', 'SpO2 niños': '98-99 %', 'SpO2 padre': '99 %' },
            datos: 'La madre, de 38 años, refiere cefalea intensa, náuseas y mareo; se desvaneció un momento en el baño al amanecer. Sus hijos de 8 y 12 años también tienen cefalea y el menor está somnoliento. El padre se sintió mal en la ducha, pero mejoró al salir a comprar pan. El perro está echado y no se levanta. Ventanas cerradas por el frío; calentador de agua a gas dentro del baño.<br><br>Su compañero propone: «Gastroenteritis familiar: antiemético para la madre y observación en casa».',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que violan la expectativa de una gastroenteritis.',
              opciones: ['Todos enfermaron a la vez y en el mismo lugar', 'No hay diarrea y predomina la cefalea', 'El padre mejoró al salir de la casa', 'El perro también está afectado', 'Hay un aparato a gas en un espacio cerrado, en invierno', 'La madre tiene náuseas', 'La SpO2 es normal en todos'],
              correctas: [0, 1, 2, 3, 4],
              explicacion: 'Esas cinco violaciones reconstruyen la situación: exposición común a un tóxico ambiental. Las náuseas encajan con ambos cuadros y la SpO2 no discrimina en esta intoxicación.' },
            experto: '“Una familia entera enferma a la vez: el diagnóstico puede ser el lugar.”'
          },
          {
            titulo: 'La escena también es un paciente',
            datos: 'Su hipótesis principal ahora es la intoxicación por monóxido de carbono.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace primero?',
              opciones: ['Atiendo a la madre en el baño, porque es la más grave', 'Abro una ventana y continúo la evaluación dentro de la casa', 'Evacúo a todos, perro y tripulación incluidos; ventilación y bomberos con detector', 'Antiemético a la madre y reevaluación en 15 minutos'],
              correcta: 2, parcial: [1],
              porOpcion: { 1: 'Ventilar ayuda, pero quedarse dentro mantiene expuestos a todos, incluida la tripulación.' },
              explicacion: 'Nivel 3 de conciencia situacional: proyectar el riesgo para la familia, la tripulación y los vecinos. Los bomberos midieron 250 ppm de monóxido de carbono en el baño.' },
            experto: '“Si es monóxido, nosotros también estamos expuestos.”'
          },
          {
            titulo: 'El oxímetro tranquiliza',
            datos: 'Ya en la calle, su compañero observa: «La SpO2 está en 98 a 99 % en todos; no pueden estar tan mal».',
            decision: { tipo: 'opcion', pregunta: '¿Qué responde?',
              opciones: ['El oxímetro lee la carboxihemoglobina como oxihemoglobina: oxígeno al 100 % con reservorio para todos', 'Tiene razón: basta oxígeno por cánula a quien lo pida', 'Retiro el oxígeno hasta tener la cooximetría para no falsearla'],
              correcta: 0,
              explicacion: 'La pulsioximetría convencional no sirve en esta intoxicación. El oxígeno al 100 % no espera la confirmación.' },
            experto: '“La SpO2 normal no descarta: el oxímetro no distingue la carboxihemoglobina.”'
          },
          {
            titulo: 'La cooximetría',
            monitor: { 'SpCO madre': '24 %', 'SpCO niños': '18 % y 15 %', 'SpCO padre': '10 %' },
            datos: 'El padre, que salió a comprar pan, se siente bien y quiere quedarse para cerrar el departamento.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo interpreta el 10 % del padre?',
              opciones: ['Descarta la intoxicación en él; puede quedarse', 'Sugiere que la fuente de monóxido era otra', 'No descarta: frente al laboratorio, el dispositivo detectó 15 % o más con sensibilidad de solo 48 %'],
              correcta: 2,
              explicacion: 'Un valor bajo no descarta la intoxicación. El padre salió de la casa y eso puede haber reducido la cifra; también recibe oxígeno y evaluación.' }
          },
          {
            titulo: 'Resumen de situación a los 10 minutos',
            datos: 'Todos están fuera y con oxígeno. Usted lidera la escena.',
            decision: { tipo: 'opcion', pregunta: '¿Qué resumen dice en voz alta?',
              opciones: ['«Cuatro afectados, ya evacuados y con oxígeno. Seguimos evaluando y luego vemos a dónde vamos.»', '«Cuatro afectados por probable monóxido, evacuados y con oxígeno al 100 %. Cambió: la madre perdió la conciencia y marca 24 %. Espero mejoría en la próxima hora; si alguien empeora, sale primero con preaviso por hiperbárica.»', '«Gastroenteritis familiar con exposición a gas. Todos estables. Trasladamos a la madre por los vómitos.»'],
              correcta: 1,
              porOpcion: { 0: 'Falta lo que cambió, la proyección y el plan si ocurre algo.' },
              explicacion: 'El resumen sigue la estructura «Tenemos… Lo que cambió es… Espero que… Si ocurre…, haremos…». Por la pérdida de conciencia, la madre se deriva para valorar oxigenoterapia hiperbárica, que en un ensayo aleatorizado redujo las secuelas cognitivas a las 6 semanas de 46 a 25 %.' },
            experto: '“La madre perdió la conciencia: hay que valorar oxigenoterapia hiperbárica.”'
          }
        ],
        cierre: 'Cuando varios pacientes del mismo lugar enferman a la vez, el diagnóstico es el lugar. El primer razonamiento, alimentado por la disponibilidad de los casos de la semana, reconoció un patrón equivocado; las violaciones de expectativas obligaron a reconstruir la historia antes de que ese patrón cerrara el caso.'
      },
      {
        tipo: 'personalizado', titulo: 'Detector de violaciones de expectativas', render: detector,
        instrucciones: 'Cada escena parte de un patrón ya reconocido. Los datos llegan de uno en uno: decida rápido si cada uno encaja con lo que el patrón predice. Al final, decida si mantiene el patrón o vuelve a diagnosticar. Algunas escenas son típicas: reevaluar todo por sistema también es un error.'
      },
      {
        tipo: 'clasificar', titulo: 'Los tres niveles de conciencia situacional',
        instrucciones: 'Clasifique cada acción o dato según el nivel de Endsley al que pertenece.',
        categorias: ['1. Percepción', '2. Comprensión', '3. Proyección'],
        items: [
          { texto: 'Ver el calentador a gas dentro del baño', cat: 0, porque: 'Percibir un elemento del entorno.' },
          { texto: 'Notar que el perro no se levanta', cat: 0, porque: 'Dato disponible que el primer razonamiento no percibió.' },
          { texto: 'Evaluar la escena en 360 grados antes de centrarse en el paciente', cat: 0, porque: 'Herramienta del nivel 1.' },
          { texto: 'Olor a gas y cables caídos en la entrada del edificio', cat: 0, porque: 'Riesgos de la escena: también forman parte del nivel 1.' },
          { texto: 'Entender que los síntomas son signos de una exposición común', cat: 1, porque: 'Comprender el significado en conjunto.' },
          { texto: 'Enunciar en voz alta la representación del problema', cat: 1, porque: 'Herramienta del nivel 2.' },
          { texto: 'Concluir que palidez, sudor frío y taquicardia forman un shock compensado', cat: 1, porque: 'Integrar señales en una configuración con significado.' },
          { texto: 'Prever que la tripulación y los vecinos también están en riesgo', cat: 2, porque: 'Proyectar la evolución de la situación.' },
          { texto: 'Preguntarse qué pasará en 5, 15 y 30 minutos', cat: 2, porque: 'Es la pregunta del nivel 3.' },
          { texto: '«Si la madre empeora, la trasladamos primero»', cat: 2, porque: 'Plan basado en una proyección.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: 'Pre-mortem en 30 segundos', render: premortem,
        instrucciones: 'Antes de ejecutar el plan, imagine que fracasó. Tiene 30 segundos para marcar las causas probables; después asigne una contramedida a cada una. Cuidado: algunas causas no pertenecen al plan.'
      },
      {
        tipo: 'numero', titulo: 'Cuánto pesa la sensación de alarma',
        instrucciones: 'Calcule con odds. Escriba solo el número.',
        problemas: [
          { enunciado: 'Niño febril con probabilidad de infección grave de 5 %. Usted siente que algo va mal pese a una impresión de enfermedad leve (LR+ 25,5). ¿Probabilidad posterior?', respuesta: 57, tolerancia: 2, unidad: '%', solucion: 'Odds 0,05/0,95 = 0,053; × 25,5 = 1,34; 1,34/2,34 = 57 %.' },
          { enunciado: 'Mismo LR, pero la probabilidad previa es de 2 %. ¿Probabilidad posterior?', respuesta: 34, tolerancia: 2, unidad: '%', solucion: 'Odds 0,0204 × 25,5 = 0,52; 0,52/1,52 = 34 %. Aun con previa baja, la alarma justifica una evaluación completa.' },
          { enunciado: 'Probabilidad previa de 20 % y sensación de alarma (LR+ 25,5). ¿Probabilidad posterior?', respuesta: 86, tolerancia: 2, unidad: '%', solucion: 'Odds 0,25 × 25,5 = 6,4; 6,4/7,4 = 86 %.' },
          { enunciado: 'En el estudio de Van den Bruel, actuar sobre la sensación habría evitado 2 casos no detectados a costa de 44 falsas alarmas. ¿Cuántas falsas alarmas por cada caso detectado?', respuesta: 22, tolerancia: 0.5, solucion: '44/2 = 22. Es un costo aceptable cuando lo que se evita es una infección grave no detectada.' },
          { enunciado: 'En urgencias, la impresión intuitiva predijo la gravedad con sensibilidad de 73,9 % y especificidad de 83,3 %. ¿LR+? (un decimal)', respuesta: 4.4, tolerancia: 0.2, decimales: 1, solucion: 'LR+ = 0,739/(1 − 0,833) = 0,739/0,167 = 4,4. Útil para la gravedad, pero acertó el diagnóstico final solo en 54 % de los casos.' },
          { enunciado: 'Mortalidad hospitalaria del infarto sin dolor torácico: 23,3 %; con dolor: 9,3 %. ¿Cuántas veces mayor? (un decimal)', respuesta: 2.5, tolerancia: 0.1, decimales: 1, solucion: '23,3/9,3 = 2,5. Los camaleones no son rarezas: un tercio de los infartos se presentó sin dolor torácico.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'El modelo de decisión primada por reconocimiento',
        instrucciones: 'Ordene el ciclo que Klein describió en los comandantes de bomberos.',
        pasos: ['Percibir la situación y preguntarse si es típica', 'Si no lo es, diagnosticarla hasta construir una historia coherente', 'Reconocer metas plausibles, señales relevantes, expectativas y acción típica', 'Simular mentalmente la acción y modificarla si falla', 'Actuar y vigilar las expectativas: si se violan, volver a diagnosticar'],
        explicacion: 'Las expectativas son la clave de la seguridad. El teniente que ordenó salir de la vivienda antes del colapso del piso no sabía qué pasaba: solo notó que el fuego no respondía al agua y que la sala estaba demasiado caliente y demasiado silenciosa.'
      },
      {
        tipo: 'quiz', titulo: 'Patrones, expectativas e intuición',
        preguntas: [
          { p: 'En la escena de la familia con cefalea, la segunda paramédica enumeró lo que no encajaba antes de actuar. ¿Qué variante del modelo de Klein usó?', opciones: ['Diagnóstico de la situación', 'Comparación formal de opciones', 'Satisfacción suficiente sin simular'], correcta: 0, explicacion: 'La situación parecía típica, pero las expectativas violadas la obligaron a construir otra historia. Después, la simulación del plan de quedarse en la casa mostró que ponía en riesgo a todos.' },
          { p: 'Asmático sin mejoría tras dos nebulizaciones, con murmullo abolido en el hemitórax derecho. ¿Qué indica el modelo de Klein?', opciones: ['Aumentar la dosis: el patrón se mantiene', 'Una expectativa violada: volver a diagnosticar', 'Esperar 20 minutos más la respuesta'], correcta: 1, explicacion: 'El broncoespasmo debía mejorar y un murmullo abolido unilateral no encaja. Piense en neumotórax, tapón mucoso, cuerpo extraño o edema pulmonar; la ecografía pulmonar ayuda.' },
          { p: 'Atiende una fractura de cadera en una anciana y deja de preguntar por qué se cayó. ¿Qué ocurrió?', opciones: ['Satisfacción suficiente racional, porque el tiempo apremia', 'Búsqueda satisfecha: dejó de buscar al hallar una explicación', 'Pre-mortem mal hecho, sin contramedidas'], correcta: 1, explicacion: 'La satisfacción suficiente es racional cuando el tiempo es crítico y la opción superó la simulación. Se vuelve sesgo cuando se deja de reunir información.' },
          { p: 'Un niño febril parece estar bien y usted se siente tranquilo. ¿Qué vale esa tranquilidad?', opciones: ['Permite descartar sin más datos', 'Vale lo mismo que la sensación de alarma', 'No sustituye a los datos objetivos'], correcta: 2, explicacion: 'La alarma es buena señal para activar; la tranquilidad es mala señal para descartar.' },
          { p: 'La hipoglucemia que se presenta con hemiparesia es, respecto del ictus, un…', opciones: ['Simulador: parece ictus, pero no lo es', 'Camaleón: es ictus, pero no lo parece', 'Falso negativo de la escala FAST'], correcta: 0, explicacion: 'El camaleón es la condición grave disfrazada, como el ictus que se manifiesta solo con mareo.' },
          { p: 'En aviación, 76,3 % de los errores de conciencia situacional ocurrió en el nivel 1. ¿Qué implica para la escena?', opciones: ['Que hay que interpretar mejor los datos obtenidos', 'Que casi siempre el dato estaba y nadie lo percibió', 'Que la proyección es el nivel más débil'], correcta: 1, explicacion: 'El problema suele ser no ver. De ahí la evaluación de la escena en 360 grados antes de centrarse en el paciente.' },
          { p: 'Tras naloxona en una sospecha de opioides, la FR y la conciencia no mejoran en pocos minutos. ¿Qué considera?', opciones: ['Coingestión, hipoxia prolongada u otra causa de coma', 'Que la dosis siempre fue insuficiente', 'Que el diagnóstico queda confirmado igual'], correcta: 0, explicacion: 'La respuesta al tratamiento es una prueba diagnóstica. Su ausencia es una de las violaciones más valiosas de la escena.' },
          { p: 'Siente que un paciente está mal, pero sus signos vitales son normales. ¿Qué hace con esa sensación?', opciones: ['La ignora hasta que cambie algún signo vital', 'Intenta nombrar sus señales y baja el umbral de traslado', 'La registra solo si el paciente empeora'], correcta: 1, explicacion: 'La alarma puede preceder a cualquier cambio en los signos vitales y basta para justificar el traslado. Nombrar sus señales permite comunicarlas y aprender de ellas.' },
          { p: 'Un tercio de los infartos se presentó sin dolor torácico. ¿Quiénes estaban más expuestos a esa presentación?', opciones: ['Los jóvenes deportistas y los fumadores', 'Los ancianos, las mujeres y los diabéticos', 'Los pacientes con infarto previo tratado'], correcta: 1, explicacion: 'Su mortalidad hospitalaria fue de 23,3 % frente a 9,3 % en quienes tuvieron dolor.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Cuatro productos del reconocimiento (Klein)', reverso: 'Metas plausibles · señales relevantes · expectativas · acción típica' },
          { frente: 'Simulador frente a camaleón', reverso: 'Simulador: parece, pero no es (hipoglucemia que parece ictus). Camaleón: es, pero no parece (ictus que solo da mareo).' },
          { frente: 'Tres niveles de conciencia situacional', reverso: '1. Percibir · 2. Comprender · 3. Proyectar a 5, 15 y 30 minutos' },
          { frente: 'Resumen de situación', reverso: '«Tenemos… Lo que cambió es… Espero que en los próximos minutos… Si ocurre…, haremos…» Cada 5 a 10 minutos o ante cualquier cambio.' },
          { frente: 'Pre-mortem en 30 segundos', reverso: '«Imaginemos que esto salió mal. ¿Qué fue lo más probable?» Una causa por persona, una medida por causa y un plan alternativo.' },
          { frente: 'Sensación de que algo va mal en niños', reverso: 'LR+ 25,5 para infección grave. Buena señal para activar; la tranquilidad no sirve para descartar.' },
          { frente: 'Señales de pérdida de la conciencia situacional', reverso: 'Fijación en una tarea · confusión sobre quién hace qué · silencio del líder · comunicaciones sin respuesta · sorpresa ante lo previsible' },
          { frente: 'Respuesta esperada a la dextrosa y al salbutamol', reverso: 'Dextrosa: mejoría de la conciencia en 5 a 10 minutos. Salbutamol: menos trabajo respiratorio en 10 a 15 minutos.' }
        ]
      }
    ]
  });
})();
