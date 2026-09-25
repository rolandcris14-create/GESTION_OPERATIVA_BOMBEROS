/* Capítulo 12. Vías de evaluación estructurada y patologías tiempo-dependientes */
(function () {

  /* ---------- Barrido de 60 segundos ----------
     si: diagnósticos que no pueden perderse (tabla 12.3); no: diagnósticos benignos o frecuentes. */
  var SINTOMAS = [
    { s: 'Dolor torácico', v: 'Varón de 52 años con dolor torácico desde hace 40 minutos.',
      si: ['Síndrome coronario agudo', 'Disección aórtica', 'Tromboembolismo pulmonar', 'Neumotórax a tensión', 'Taponamiento', 'Rotura esofágica'],
      no: ['Dolor musculoesquelético', 'Reflujo gastroesofágico', 'Crisis de ansiedad'],
      datos: 'ECG de 12 derivaciones, PA en ambos brazos, pulsos, SpO2, auscultación y ecografía si está disponible.' },
    { s: 'Disnea', v: 'Mujer de 60 años con disnea de inicio hace una hora.',
      si: ['Tromboembolismo pulmonar', 'Edema pulmonar', 'Neumotórax', 'Anafilaxia', 'Obstrucción de la vía aérea', 'Acidosis metabólica'],
      no: ['Crisis de ansiedad', 'Resfriado común', 'Desacondicionamiento físico'],
      datos: 'SpO2, capnografía, glucemia, auscultación y ecografía pulmonar.' },
    { s: 'Cefalea', v: 'Varón de 45 años con cefalea intensa desde esta mañana.',
      si: ['Hemorragia subaracnoidea', 'Meningitis o encefalitis', 'Monóxido de carbono', 'Disección arterial', 'Trombosis venosa', 'Emergencia hipertensiva'],
      no: ['Cefalea tensional', 'Migraña conocida', 'Sinusitis'],
      datos: 'Inicio súbito, fiebre, rigidez, focalidad y otros afectados en el mismo lugar.' },
    { s: 'Mareo o vértigo', v: 'Varón de 61 años con mareo intenso y vómitos desde hace una hora.',
      si: ['Ictus de circulación posterior', 'Arritmia', 'Hemorragia oculta', 'Hipoglucemia', 'Intoxicación'],
      no: ['Vértigo posicional benigno', 'Cinetosis', 'Ansiedad'],
      datos: 'Marcha y sedestación, nistagmo, BE-FAST, ECG y glucemia.' },
    { s: 'Síncope', v: 'Mujer de 72 años que se desmayó mientras caminaba.',
      si: ['Arritmia', 'Tromboembolismo pulmonar', 'Hemorragia (ectópico, aneurisma, digestiva)', 'Disección aórtica', 'Estenosis aórtica', 'Miocardiopatía hipertrófica'],
      no: ['Síncope vasovagal', 'Síncope situacional por tos', 'Crisis de ansiedad'],
      datos: 'ECG, relación con el esfuerzo, antecedentes familiares, embarazo y soplos.' },
    { s: 'Dolor abdominal', v: 'Varón de 67 años con dolor abdominal intenso desde hace dos horas.',
      si: ['Aneurisma roto', 'Embarazo ectópico', 'Isquemia mesentérica', 'Perforación', 'Infarto inferior', 'Cetoacidosis'],
      no: ['Gastroenteritis', 'Estreñimiento', 'Dispepsia'],
      datos: 'Edad, síncope, embarazo, dolor desproporcionado a la exploración, glucemia y ECG.' },
    { s: 'Alteración de la conciencia', v: 'Mujer de 70 años hallada confusa en su casa por su vecina.',
      si: ['Hipoglucemia', 'Hipoxia', 'Sepsis', 'Ictus', 'Intoxicación', 'Traumatismo craneal', 'Estado epiléptico no convulsivo', 'Hipotermia'],
      no: ['Cansancio por falta de sueño', 'Trastorno funcional', 'Tristeza'],
      datos: 'Glucemia, SpO2, temperatura, pupilas y búsqueda de trauma.' },
    { s: 'Dolor de espalda', v: 'Varón de 58 años con dolor de espalda intenso desde ayer.',
      si: ['Aneurisma de aorta', 'Disección aórtica', 'Absceso epidural', 'Compresión medular', 'Síndrome de cola de caballo'],
      no: ['Lumbalgia mecánica', 'Contractura muscular', 'Mala postura'],
      datos: 'Edad, fiebre, déficit neurológico, retención urinaria y pulsos.' },
    { s: 'Debilidad en el anciano', v: 'Varón de 83 años: «está débil, no se levanta de la cama».',
      si: ['Sepsis', 'Infarto', 'Ictus', 'Hiperpotasemia', 'Hemorragia', 'Deshidratación'],
      no: ['Envejecimiento normal', 'Falta de ánimo', 'Pereza'],
      datos: 'Signos vitales completos, ECG, glucemia y NEWS2.' }
  ];

  function barrido(el, api) {
    var h = api.h;
    var rondas = api.barajar(SINTOMAS).slice(0, 3), r = 0, suma = 0;
    function vivo() { return document.body.contains(el); }
    function ronda() {
      el.innerHTML = '';
      if (r >= rondas.length) return api.fin(suma / rondas.length, 'Barridos completados: ' + rondas.length + ' · precisión media ' + Math.round(suma / rondas.length * 100) + ' %', true);
      var S = rondas[r], lista = api.barajar(S.si.map(function (t) { return { t: t, si: true }; }).concat(S.no.map(function (t) { return { t: t, si: false }; })));
      var marc = {}, restante = 60, cerrado = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Barrido ' + (r + 1) + ' de ' + rondas.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">Síntoma guía: ' + S.s + '</span>' + S.v }));
      var reloj = h('div', { class: 'cifra' }, h('small', null, 'Tiempo restante'), '60 s');
      el.appendChild(h('div', { class: 'fila' }, reloj, h('span', { class: 'pregunta-n' }, 'Marque solo los diagnósticos que no pueden perderse.')));
      var bots = lista.map(function (x, k) {
        return h('button', { class: 'opcion', onclick: function () {
          if (cerrado) return;
          marc[k] = !marc[k]; this.classList.toggle('sel', marc[k]); this.innerHTML = (marc[k] ? '☑ ' : '☐ ') + x.t;
        } }, '☐ ' + x.t);
      });
      bots.forEach(function (b) { el.appendChild(b); });
      var bt = h('button', { class: 'btn', onclick: function () { cerrar(); } }, 'Terminar el barrido');
      var zona = h('div');
      el.appendChild(h('div', { class: 'acciones' }, bt));
      el.appendChild(zona);
      var iv = setInterval(function () {
        if (!vivo()) { clearInterval(iv); return; }
        restante--; reloj.lastChild.textContent = restante + ' s';
        if (restante <= 0) cerrar();
      }, 1000);
      function cerrar() {
        if (cerrado) return; cerrado = true; clearInterval(iv); bt.disabled = true;
        var bien = 0, omit = 0, sobra = 0;
        bots.forEach(function (b, k) {
          b.disabled = true;
          var x = lista[k], m = !!marc[k];
          if (m === x.si) bien++;
          if (x.si && m) b.classList.add('bien');
          else if (x.si) { omit++; b.classList.add('mal'); b.innerHTML = '☐ ' + x.t + ' <b>(omitido)</b>'; }
          else if (m) { sobra++; b.classList.add('mal'); b.innerHTML = '☑ ' + x.t + ' <b>(benigno o frecuente)</b>'; }
        });
        var nota = bien / lista.length;
        suma += nota;
        zona.appendChild(h('div', { class: 'fb ' + (nota === 1 ? 'bien' : nota >= 0.8 ? 'info' : 'mal'), html: '<b>' + bien + ' de ' + lista.length + ' decisiones correctas' + (restante <= 0 ? ' (tiempo agotado)' : ', en ' + (60 - restante) + ' s') + '.</b> ' +
          (omit ? 'Omitió ' + omit + ' diagnóstico' + (omit > 1 ? 's' : '') + ' que no puede perderse. ' : '') +
          (sobra ? 'Incluyó ' + sobra + ' diagnóstico' + (sobra > 1 ? 's' : '') + ' benigno' + (sobra > 1 ? 's' : '') + ': se acepta solo después de descartar lo grave. ' : '') }));
        zona.appendChild(h('div', { class: 'experto', html: 'Datos y pruebas en la escena: ' + S.datos + ' Para cada diagnóstico: ¿qué dato lo haría probable? ¿Lo busqué? Los huecos son las acciones siguientes.' }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { r++; ronda(); } }, r + 1 < rondas.length ? 'Siguiente síntoma' : 'Ver resultado')));
      }
    }
    ronda();
  }

  /* ---------- Cuánto cuesta el retraso ---------- */
  var MODELOS = {
    iam: { n: 'Infarto con elevación del ST y angioplastia primaria' },
    trombec: { n: 'Ictus tratado con trombectomía' },
    ictus: { n: 'Ictus isquémico sin tratamiento' },
    sepsis: { n: 'Sepsis: paquete inicial y antibióticos' },
    paro: { n: 'Paro cardíaco extrahospitalario sin intervenciones' }
  };
  var DILEMAS = [
    { t: 'Infarto con elevación del ST: el ECG ya es diagnóstico y la hemodinamia está activada. Su compañero quiere repetir el ECG antes de salir (unos 5 minutos).', ok: 1, fb: 'La repetición no aporta una decisión nueva: se hace en ruta.' },
    { t: 'Paciente con hemiparesia de inicio hace 40 minutos. Antes de activar el código ictus, ¿mide la glucemia capilar?', ok: 0, fb: 'Cuesta segundos y descarta un simulador del ictus: la hipoglucemia.' },
    { t: 'Trauma penetrante de torso con hipotensión. Se plantea completar en la escena una inmovilización detallada de 10 minutos.', ok: 1, fb: 'En la hemorragia no compresible cada minuto importa: la escena se reduce a las intervenciones que salvan la vida.' },
    { t: 'Trauma torácico con hipotensión e hipoxemia progresivas y sospecha fundada de neumotórax a tensión. ¿Descomprime antes de salir?', ok: 0, fb: 'Es una intervención que salva la vida en minutos: se hace donde se detecta.' },
    { t: 'Dolor torácico con sospecha de síndrome coronario, primer contacto hace 3 minutos. ¿Hace el ECG de 12 derivaciones antes de arrancar?', ok: 0, fb: 'El ECG en los 10 minutos siguientes al primer contacto decide la activación de la hemodinamia y el destino.' },
    { t: 'Sospecha de sepsis con traslado corto. Se propone esperar en la escena a completar todos los antecedentes con la familia (15 minutos).', ok: 1, fb: 'Cada hora de demora del paquete inicial se asoció con más mortalidad: reconocimiento, preaviso y traslado; los antecedentes se completan en paralelo o por teléfono.' }
  ];

  function costoRetraso(el, api) {
    var h = api.h, F = api.fmt;
    var modelo = 'iam', basal = 5, minutos = 120, explorado = false;
    var sel = h('select', { 'aria-label': 'Condición', onchange: function () { modelo = sel.value; explorado = true; calc(); } },
      Object.keys(MODELOS).map(function (k) { return h('option', { value: k }, MODELOS[k].n); }));
    el.appendChild(h('div', { class: 'enunciado' }, 'Paso 1. Calculadora'));
    el.appendChild(h('div', { class: 'fila' }, h('b', null, 'Condición:'), sel));
    var vMin = h('b', null, ''), vBas = h('b', null, '');
    var rMin = h('input', { type: 'range', min: 0, max: 360, step: 5, value: minutos, 'aria-label': 'Minutos de retraso', oninput: function () { minutos = +rMin.value; explorado = true; calc(); } });
    var rBas = h('input', { type: 'range', min: 1, max: 15, step: 0.5, value: basal, 'aria-label': 'Riesgo basal', oninput: function () { basal = +rBas.value; explorado = true; calc(); } });
    var filaBas = h('div', null, h('div', { style: 'margin-top:10px' }, 'Riesgo basal de muerte al año: ', vBas), rBas);
    el.appendChild(h('div', { style: 'margin-top:10px' }, 'Retraso: ', vMin));
    el.appendChild(rMin);
    el.appendChild(filaBas);
    var salida = h('div'); el.appendChild(salida);
    function calc() {
      vMin.textContent = minutos + ' min'; vBas.textContent = F(basal, 1) + ' %';
      filaBas.style.display = modelo === 'iam' ? '' : 'none';
      salida.innerHTML = '';
      var c = [];
      if (modelo === 'iam') {
        var n = minutos / 30, R = basal * Math.pow(1.075, n);
        c = [['Periodos de 30 min', F(n, 1)], ['Riesgo con retraso', F(R, 1) + ' %'], ['Muertes extra por 100', F(R - basal, 1)]];
        salida.appendChild(h('div', { class: 'pregunta-n' }, 'R retraso ≈ R basal × 1,075^n: cada 30 minutos aumenta en 7,5 % el riesgo relativo de muerte al año.'));
      } else if (modelo === 'trombec') {
        c = [['Pacientes con más discapacidad', F(minutos / 9, 1) + ' de cada 100']];
        salida.appendChild(h('div', { class: 'pregunta-n' }, 'Por cada 9 minutos de retraso en la reperfusión, 1 de cada 100 pacientes tratados queda con mayor discapacidad.'));
      } else if (modelo === 'ictus') {
        c = [['Neuronas perdidas', F(1.9 * minutos, 0) + ' millones'], ['Envejecimiento equivalente', F(3.6 * minutos / 60, 1) + ' años']];
        salida.appendChild(h('div', { class: 'pregunta-n' }, 'Unos 1,9 millones de neuronas por minuto; cada hora equivale a unos 3,6 años de envejecimiento normal.'));
      } else if (modelo === 'sepsis') {
        var hs = minutos / 60;
        c = [['Horas de demora', F(hs, 1)], ['Odds de muerte multiplicadas por', F(Math.pow(1.04, hs), 2)]];
        salida.appendChild(h('div', { class: 'pregunta-n' }, 'OR 1,04 por hora de demora en completar el paquete inicial y administrar antibióticos.'));
      } else {
        var m = Math.min(minutos, 10);
        c = [['Supervivencia perdida', F(5.5 * m, 1) + ' puntos'], ['Por retraso de RCP', F(2.3 * m, 1)], ['Por desfibrilación', F(1.1 * m, 1)], ['Por soporte avanzado', F(2.1 * m, 1)]];
        salida.appendChild(h('div', { class: 'pregunta-n' }, 'Sin intervenciones, la supervivencia estimada cae unos 5,5 puntos porcentuales por minuto: 2,3 por la RCP, 1,1 por la desfibrilación y 2,1 por el soporte avanzado.' + (minutos > 10 ? ' La estimación lineal se muestra solo hasta 10 minutos.' : '')));
      }
      salida.appendChild(h('div', null, c.map(function (x) { return h('span', { class: 'cifra' }, h('small', null, x[0]), x[1]); })));
      salida.appendChild(h('div', { class: 'pregunta-n' }, 'Cifras aproximadas: sirven para comparar con el tiempo que consume cada acción en la escena.'));
    }
    calc();

    /* Paso 2: dos cálculos. Paso 3: decidir si cada acción se hace en la escena o en ruta. */
    var puntos = 0, total = 0;
    var paso2 = h('div', { style: 'margin-top:18px' });
    el.appendChild(paso2);
    var CALCS = [
      { t: 'Infarto con riesgo basal de muerte al año de 4 % y 90 minutos de retraso en la reperfusión. ¿Riesgo con retraso? (un decimal, en %)', r: 4 * Math.pow(1.075, 3), tol: 0.15, s: '4 × 1,075^3 = 4 × 1,24 = 5,0 %: 1 muerte adicional por cada 100 pacientes.' },
      { t: 'Sepsis con 6 horas de demora y OR 1,04 por hora. ¿Por cuánto se multiplican las odds de muerte? (dos decimales)', r: Math.pow(1.04, 6), tol: 0.02, s: '1,04^6 = 1,27.' }
    ];
    var ci = 0;
    function pintarCalc() {
      paso2.innerHTML = '';
      paso2.appendChild(h('div', { class: 'enunciado' }, 'Paso 2. Dos cálculos (puede usar la calculadora)'));
      if (ci >= CALCS.length) return pintarDilemas();
      var q = CALCS[ci];
      paso2.appendChild(h('div', null, q.t));
      var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Respuesta' }), z = h('div');
      var b = h('button', { class: 'btn', onclick: function () {
        var v = api.num(inp.value); if (isNaN(v)) return;
        b.disabled = true; inp.disabled = true;
        var ok = Math.abs(v - q.r) <= q.tol; total++; if (ok) puntos++;
        z.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>Revise.</b> ') + q.s }));
        z.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ci++; pintarCalc(); } }, 'Siguiente')));
      } }, 'Comprobar');
      paso2.appendChild(h('div', { class: 'fila', style: 'margin-top:8px' }, inp, b));
      paso2.appendChild(z);
    }
    var dil = api.barajar(DILEMAS).slice(0, 4), di = 0;
    function pintarDilemas() {
      paso2.innerHTML = '';
      paso2.appendChild(h('div', { class: 'enunciado' }, 'Paso 3. ¿Cada minuto tiene un propósito? (' + (di + 1) + ' de ' + dil.length + ')'));
      var D = dil[di], z = h('div');
      paso2.appendChild(h('div', null, D.t));
      var ops = ['Sí, en la escena', 'No: en ruta, en paralelo o se omite'].map(function (t, j) {
        return h('button', { class: 'opcion', onclick: function () {
          ops.forEach(function (x) { x.disabled = true; });
          var ok = j === D.ok; total++; if (ok) puntos++;
          ops[D.ok].classList.add('bien'); if (!ok) this.classList.add('mal');
          z.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: (ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + D.fb }));
          di++;
          if (di < dil.length) z.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: pintarDilemas }, 'Siguiente')));
          else api.fin(puntos / total, puntos + ' de ' + total + ' respuestas correctas' + (explorado ? '' : ' (pruebe también la calculadora con otras condiciones)'), true);
        } }, t);
      });
      ops.forEach(function (b) { paso2.appendChild(b); });
      paso2.appendChild(z);
    }
    pintarCalc();
  }

  TDC.registrar({
    numero: 12, parte: 'IV',
    titulo: 'Vías de evaluación estructurada y patologías tiempo-dependientes',
    mision: 'Barra los diagnósticos que no pueden perderse contra reloj y dé un propósito a cada minuto de escena.',
    objetivo: 'Aplicar una evaluación estructurada que priorice la detección de las patologías letales y dependientes del tiempo, integrando pruebas en el punto de atención.',
    escena: 'En la escena, el diagnóstico más probable rara vez es el más peligroso. Su tarea es ordenar la búsqueda por <b>probabilidad y costo de omitir</b>, repetir la evaluación primaria ante cualquier deterioro y no gastar minutos en lo que no cambia la decisión.',
    actividades: [
      {
        tipo: 'caso', titulo: 'El mareo del conductor',
        presentacion: '<b>14:20.</b> Despacho: «mareo, posible vértigo». Un taxista de 61 años detuvo el vehículo por un mareo intenso con vómitos. Es hipertenso, diabético y fumador.',
        fases: [
          {
            titulo: 'Primer impulso',
            monitor: { PA: '188/102', FC: '78 lpm sinusal', Glucemia: '138 mg/dL' },
            datos: 'Su compañero propone: «Vértigo periférico con hipertensión reactiva al malestar. Antiemético y al hospital más cercano».',
            decision: { tipo: 'opcion', pregunta: '¿Qué pregunta ordena primero su evaluación?',
              opciones: ['¿Qué antiemético tolera mejor el paciente?', '¿Central o periférico? ¿Puede sentarse y caminar sin apoyo?', '¿Cuánto tardamos al hospital más cercano?'],
              correcta: 1,
              explicacion: 'Ante el mareo, el ictus de circulación posterior encabeza la lista de diagnósticos que no pueden perderse. La marcha y la sedestación son la exploración más rentable.' },
            experto: '“Mareo con vómitos en un hombre de 61 años con factores de riesgo: primero, ¿central o periférico?”'
          },
          {
            titulo: 'Exploración',
            datos: 'Necesita apoyarse en la puerta para no caer hacia la derecha; «todo da vueltas» de forma continua desde hace una hora. BE-FAST: sin asimetría facial, sin deriva del brazo, habla normal; no puede mantenerse sentado sin apoyo. Nistagmo que bate a la izquierda en la mirada izquierda y a la derecha en la mirada derecha. Audición conservada.',
            decision: { tipo: 'multiple', pregunta: 'Marque los datos que sostienen un origen central.',
              opciones: ['No se mantiene sentado sin apoyo: ataxia troncal', 'Nistagmo que cambia de dirección con la mirada', 'Perfil vascular: hipertenso, diabético y fumador', 'Cara, brazo y habla normales', 'Glucemia de 138 mg/dL'],
              correctas: [0, 1, 2],
              explicacion: 'Tres datos sostenían el ictus de circulación posterior. Cara, brazo y habla normales no descartan la circulación posterior; la glucemia normal solo aparta un simulador.' },
            experto: '“No se sostiene sentado: ataxia troncal. El nistagmo cambia de dirección: origen central.”'
          },
          {
            titulo: '¿Cuánto tranquiliza el FAST negativo?',
            datos: 'Su compañero insiste: «Si cara, brazo y habla están bien, no es un ictus».',
            decision: { tipo: 'probabilidad', pregunta: 'Probabilidad previa de ictus de 30 %. La ausencia de paresia facial, deriva del brazo y alteración del habla tiene LR 0,39. ¿Probabilidad posterior?', rango: [11, 17],
              explicacion: 'Odds 0,43 × 0,39 = 0,17 → 14 %. Sigue muy por encima de cualquier umbral aceptable para una enfermedad tratable y dependiente del tiempo. La nemotecnia FAST no detectó 14 % de los ictus isquémicos; añadir equilibrio y visión lo redujo a 4,4 %.' },
            experto: '“Cara, brazo y habla normales no descartan la circulación posterior.”'
          },
          {
            titulo: 'Destino',
            datos: 'El hospital más cercano está a 10 minutos y no tiene unidad de ictus. El centro con trombectomía está más lejos.',
            decision: { tipo: 'opcion', pregunta: '¿Qué decide?',
              opciones: ['Observar 20 minutos en la escena por si el vértigo cede', 'Hospital más cercano, por cercanía, y que allí decidan', 'Código ictus por BE-FAST positivo en el equilibrio: centro con trombectomía, preaviso y hora de inicio'],
              correcta: 2,
              explicacion: 'En urgencias, el ictus con mareo tuvo unas 14 veces más probabilidades de pasar inadvertido que el ictus con síntomas motores. En la oclusión basilar, dos ensayos aleatorizados mostraron beneficio funcional de la trombectomía.' },
            experto: '“Código ictus y centro con trombectomía: una oclusión basilar no espera.”'
          },
          {
            titulo: 'La presión arterial',
            monitor: { PA: '188/102', FC: '78 lpm' },
            decision: { tipo: 'opcion', pregunta: '¿Qué hace con la PA?',
              opciones: ['No la reduzco en la escena salvo indicación del protocolo; la vigilo', 'La bajo en la escena para prevenir una hemorragia', 'Doy un ansiolítico para que baje sola'],
              correcta: 0,
              explicacion: 'Sin reducir la PA en la escena. La decisión que cambia el pronóstico es el destino, no la cifra.' },
            experto: '“188/102 no se trata en la escena salvo indicación del protocolo.”'
          }
        ],
        cierre: 'La angiotomografía mostró una oclusión de la arteria basilar; se realizó trombectomía a las 3 horas del inicio y el paciente se fue de alta con una ataxia leve. Un FAST negativo no descarta un ictus. En el paciente con mareo, preguntarse si puede sentarse y caminar sin apoyo es la exploración más rentable de la escena.'
      },
      {
        tipo: 'personalizado', titulo: 'Barrido de 60 segundos', render: barrido,
        instrucciones: 'Aparece un síntoma guía. En 60 segundos, marque los diagnósticos que no pueden perderse y deje sin marcar los benignos o frecuentes. Después verá los datos y pruebas que la escena exige para cada uno.'
      },
      {
        tipo: 'clasificar', titulo: 'Probabilidad frente a costo de omitir',
        instrucciones: 'Ubique cada hipótesis en el cuadrante de estrategia que le corresponde.',
        categorias: ['Tratar lo probable', 'Tratar y confirmar', 'No perseguir en la escena', 'Descartar de forma activa'],
        items: [
          { texto: 'Síndrome coronario agudo en un dolor torácico opresivo con diaforesis', cat: 1, porque: 'Probabilidad moderada o alta y costo alto: ECG seriado y destino con hemodinamia.' },
          { texto: 'Disección aórtica en un dolor torácico sin rasgos de alto riesgo, antes de dar antitrombóticos', cat: 3, porque: 'Probabilidad baja y costo muy alto: se descarta de forma activa.' },
          { texto: 'Tromboembolismo pulmonar en un dolor torácico con SpO2 limítrofe', cat: 3, porque: 'Baja a moderada y costo alto: búsqueda activa con Wells, PERC y SpO2.' },
          { texto: 'Gastroenteritis en un joven estable con diarrea y un familiar con el mismo cuadro', cat: 0, porque: 'Probable y de bajo costo si se omite, una vez descartado lo grave.' },
          { texto: 'Hipoglucemia en un diabético conocido con conducta anormal', cat: 1, porque: 'Probable y grave: se mide y se trata en segundos.' },
          { texto: 'Monóxido de carbono en una cefalea aislada en invierno', cat: 3, porque: 'Poco probable, pero letal para todos: preguntar por otros afectados y aparatos a gas.' },
          { texto: 'Hemorragia subaracnoidea en una cefalea que no fue súbita', cat: 3, porque: 'Baja probabilidad y costo muy alto: preguntar por el inicio en trueno, la rigidez y la focalidad.' },
          { texto: 'Una causa rara y benigna de mareo, como la cinetosis, en un paciente que no viajaba', cat: 2, porque: 'Improbable y sin consecuencias: no se persigue en la escena.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Simulador o camaleón?',
        instrucciones: 'Simulador: parece la enfermedad, pero no lo es. Camaleón: es la enfermedad grave, pero no lo parece.',
        categorias: ['Simulador', 'Camaleón'],
        items: [
          { texto: 'Hipoglucemia con hemiparesia, respecto del ictus', cat: 0, porque: 'Por eso la glucemia precede a la activación del código ictus.' },
          { texto: 'Ictus que se manifiesta solo con mareo o una caída', cat: 1, porque: 'La enfermedad grave disfrazada.' },
          { texto: 'Pericarditis con elevación difusa y cóncava del ST, respecto del infarto', cat: 0, porque: 'Sin cambios recíprocos y con descenso del PR.' },
          { texto: 'Infarto que se presenta como epigastralgia en una mujer diabética', cat: 1, porque: 'Ancianos, mujeres y diabéticos son los más expuestos.' },
          { texto: 'Golpe de calor con fiebre y taquicardia, respecto de la sepsis', cat: 0, porque: 'Exposición o esfuerzo y piel caliente sin foco infeccioso.' },
          { texto: 'Sepsis en un anciano con hipotermia y confusión, sin fiebre', cat: 1, porque: 'Ante la duda, se trata como sepsis.' },
          { texto: 'Cólico renal, respecto del aneurisma de aorta roto', cat: 0, porque: 'Joven, estable, con litiasis previa.' },
          { texto: 'Aneurisma de aorta roto que se presenta como síncope o dolor en el flanco', cat: 1, porque: 'La edad y la hipotensión relativa lo delatan.' },
          { texto: 'Tromboembolismo pulmonar que se presenta como taquicardia aislada o síncope', cat: 1, porque: 'Hipoxemia sin explicación: búsquelo.' },
          { texto: 'Ansiedad, respecto del tromboembolismo pulmonar', cat: 0, porque: 'Parece un tromboembolismo, pero con SpO2 normal y sin hallazgos focales.' }
        ]
      },
      {
        tipo: 'personalizado', titulo: 'Cuánto cuesta el retraso', render: costoRetraso,
        instrucciones: 'Explore la calculadora con cada condición y distintos retrasos. Después resuelva dos cálculos y decida si cuatro acciones merecen los minutos de escena que consumen.'
      },
      {
        tipo: 'ordenar', titulo: 'La evaluación primaria',
        instrucciones: 'Ordene la evaluación primaria como regla de alta sensibilidad.',
        pasos: ['Sangrado externo que mata en minutos: presión directa, torniquete o empaquetamiento', 'Obstrucción o riesgo de aspiración: posición, aspiración, dispositivos', 'Hipoxemia, neumotórax a tensión, hipoventilación: oxígeno titulado, descompresión, ventilación', 'Shock, hemorragia interna, arritmia: acceso vascular, control de la hemorragia, monitor', 'Glucemia, conciencia, focalidad y pupilas: corrección y Glasgow desglosado', 'Lesiones ocultas y temperatura: desvestir y proteger del frío'],
        explicacion: 'Es un ciclo, no un paso inicial: ante cualquier deterioro se vuelve a ella, y después de cada intervención crítica se revisa la letra tratada y la anterior.'
      },
      {
        tipo: 'quiz', titulo: 'Evaluar contra el tiempo',
        preguntas: [
          { p: 'Varón de 45 años con cefalea súbita e intensa. ¿Qué lista de diagnósticos que no pueden perderse corresponde?', opciones: ['Hemorragia subaracnoidea, disección, trombosis venosa, emergencia hipertensiva, meningitis', 'Migraña, cefalea tensional, sinusitis, contractura cervical, ansiedad', 'Hemorragia subaracnoidea, migraña con aura, sinusitis y cefalea tensional'], correcta: 0, explicacion: 'Más monóxido de carbono si hay otros afectados. La cefalea en trueno obliga a trasladar a un centro con tomografía.' },
          { p: 'A la luz de Newgard et al., ¿qué significa la «hora de oro» en trauma?', opciones: ['Que todo paciente debe llegar al hospital antes de 60 minutos', 'Que el tiempo no pesa igual en todos: cada minuto debe tener propósito', 'Que el tiempo en la escena no influye en la supervivencia'], correcta: 1, explicacion: 'En la hemorragia no compresible y el trauma penetrante de torso cada minuto importa; en otros pacientes, un procedimiento con propósito claro no empeora el pronóstico.' },
          { p: 'Mujer de 72 años con síncope mientras caminaba. ¿Qué evaluación prioriza?', opciones: ['Glucemia y observación, porque es probablemente vasovagal', 'ECG, soplo sistólico, SpO2, signos de sangrado, dolor y glucemia', 'Escala de Glasgow y pupilas, porque es un problema neurológico'], correcta: 1, explicacion: 'Arritmia, estenosis aórtica, tromboembolismo, hemorragia e infarto. El síncope durante el esfuerzo es un dato de alto riesgo cardíaco.' },
          { p: 'Varón de 30 años, alto y delgado, con dolor pleurítico, disnea súbita y SpO2 de 93 %. ¿Cómo ordena el diferencial?', opciones: ['Pericarditis, dolor musculoesquelético, neumotórax, tromboembolismo', 'Tromboembolismo, pericarditis, neumotórax, dolor musculoesquelético', 'Neumotórax, tromboembolismo, pericarditis, dolor musculoesquelético'], correcta: 2, explicacion: 'Por probabilidad y costo de omisión. Auscultación, ecografía si está disponible y SpO2 seriada; el neumotórax a tensión se vigila por la fisiología.' },
          { p: 'El ECG ya es diagnóstico de infarto y la hemodinamia está activada. ¿Cuándo repite el ECG?', opciones: ['En la escena, antes de salir, para confirmarlo', 'En ruta: repetirlo antes de salir no aporta una decisión', 'No se repite nunca: basta el primero'], correcta: 1, explicacion: 'La prueba se hace cuando cambia el destino o el tratamiento; si no, se hace en ruta.' },
          { p: 'Un paciente se deteriora tras la intubación, mientras usted estaba centrado en el diagnóstico. ¿Qué hace primero?', opciones: ['Continuar la evaluación secundaria donde la dejó', 'Volver a la evaluación primaria: vía aérea y respiración', 'Pedir una ecografía antes de tocar nada'], correcta: 1, explicacion: 'La intubación puede convertir un neumotórax simple en uno a tensión. Tras cada intervención crítica se revisa la letra tratada y la anterior.' },
          { p: 'Cooximetría de pulso de 8 % en una familia con cefalea. ¿Qué concluye?', opciones: ['Descarta la intoxicación por monóxido', 'Confirma una exposición leve', 'Un valor bajo no descarta: la sensibilidad es limitada'], correcta: 2, explicacion: 'Como toda prueba en el punto de atención, se interpreta con sus limitaciones (capítulo 11).' },
          { p: '¿A quién se le mide la glucemia capilar de rutina?', opciones: ['A todo paciente con alteración de la conciencia, convulsión, focalidad o conducta anormal', 'Solo a los diabéticos conocidos con alteración de la conciencia', 'A quien tenga dolor torácico, síncope o disnea'], correcta: 0, explicacion: 'Cuesta segundos y cambia la decisión: tratar la hipoglucemia y activar o no el código ictus.' },
          { p: 'Sospecha de sepsis con hipotermia en un anciano confuso. ¿Qué es respecto de la sepsis?', opciones: ['Un simulador: la ausencia de fiebre la descarta', 'Un camaleón: ante la duda, se trata como sepsis', 'Un caso sin relación con la sepsis'], correcta: 1, explicacion: 'Temperatura, contexto, foco probable y signos vitales completos separan simuladores y camaleones.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Dos ejes para ordenar el diferencial', reverso: 'Probabilidad y costo de omitir (letalidad, dependencia del tiempo, posibilidad de tratamiento)' },
          { frente: 'Costo del retraso en la angioplastia primaria', reverso: 'Cada 30 minutos: +7,5 % de riesgo relativo de muerte al año. R retraso ≈ R basal × 1,075^n' },
          { frente: 'Ictus sin tratamiento', reverso: 'Unos 1,9 millones de neuronas por minuto; cada hora, unos 3,6 años de envejecimiento' },
          { frente: 'Paro sin intervenciones', reverso: 'La supervivencia cae unos 5,5 puntos por minuto: 2,3 RCP, 1,1 desfibrilación, 2,1 soporte avanzado' },
          { frente: 'Barrido de 60 segundos', reverso: 'Para cada diagnóstico que no puede perderse: ¿qué dato lo haría probable? ¿Lo busqué? Los huecos son las acciones siguientes.' },
          { frente: 'Dos preguntas contra simuladores y camaleones', reverso: 'Ante lo grave: ¿qué otra cosa se ve exactamente así? Ante lo benigno: ¿qué enfermedad grave puede verse así de benigna?' },
          { frente: 'FAST frente a BE-FAST', reverso: 'FAST no detectó 14 % de los ictus isquémicos; con equilibrio y visión, 4,4 %.' },
          { frente: 'Anafilaxia mortal: mediana del inicio al paro', reverso: '5 minutos en reacciones iatrogénicas, 15 en venenos y 30 en alimentos' }
        ]
      }
    ]
  });
})();
