/* Capítulo 5. Cocientes de verosimilitud y Teorema de Bayes aplicados a la escena y al POCUS */
(function () {
  var U = TDC.util;

  /* Hallazgos del Anexo A usados por el simulador (LR numéricos). "grupo" marca los que expresan el mismo fenómeno. */
  var HALLAZGOS = {
    ic: {
      nombre: 'Insuficiencia cardíaca en disnea aguda', previa: 40,
      items: [
        { t: 'Ecografía pulmonar con líneas B', lr: 8.8, dom: 'Imagen', g: 'eco' },
        { t: 'Ecografía pulmonar sin líneas B', lr: 0.13, dom: 'Imagen', g: 'eco' },
        { t: 'Fibrilación auricular en el ECG', lr: 3.8, dom: 'Prueba eléctrica' },
        { t: 'Antecedente de insuficiencia cardíaca', lr: 5.8, dom: 'Antecedentes' },
        { t: 'Tercer ruido', lr: 11, dom: 'Exploración', g: 'congestion' },
        { t: 'Ingurgitación yugular', lr: 5.1, dom: 'Exploración', g: 'congestion' },
        { t: 'Crepitantes', lr: 2.8, dom: 'Exploración', g: 'congestion' }
      ]
    },
    ntx: {
      nombre: 'Neumotórax traumático', previa: 60,
      items: [
        { t: 'Ausencia de deslizamiento pleural', lr: 4.5, dom: 'Ecografía', g: 'pleura' },
        { t: 'Punto pulmón', lr: 100, dom: 'Ecografía', g: 'pleura', nota: 'Especificidad cercana a 100 %: se modela con LR 100.' },
        { t: 'Ecografía negativa (deslizamiento presente)', lr: 0.09, dom: 'Ecografía', g: 'pleura' },
        { t: 'Radiografía en decúbito negativa', lr: 0.53, dom: 'Radiografía' }
      ]
    },
    fast: {
      nombre: 'Lesión toracoabdominal en trauma cerrado', previa: 60,
      items: [
        { t: 'FAST positiva', lr: 18.5, dom: 'Ecografía', g: 'fast' },
        { t: 'FAST negativa', lr: 0.27, dom: 'Ecografía', g: 'fast' }
      ]
    }
  };

  function simulador(el, api) {
    var h = api.h, B = api.bayes, F = api.fmt;
    var cond = 'ic', previa = 40, sel = {};
    var cont = h('div');
    var selCond = h('select', { 'aria-label': 'Condición', onchange: function () { cond = selCond.value; previa = HALLAZGOS[cond].previa; sel = {}; pintar(); } },
      Object.keys(HALLAZGOS).map(function (k) { return h('option', { value: k }, HALLAZGOS[k].nombre); }));
    el.appendChild(h('div', { class: 'fila' }, h('b', null, 'Condición:'), selCond));
    el.appendChild(cont);
    var explorado = false;
    function pintar() {
      cont.innerHTML = '';
      var H = HALLAZGOS[cond];
      var vp = h('b', null, previa + ' %');
      var r = h('input', { type: 'range', min: 1, max: 99, value: previa, 'aria-label': 'Probabilidad previa', oninput: function () { previa = +r.value; vp.textContent = previa + ' %'; calc(); } });
      cont.appendChild(h('div', { style: 'margin-top:12px' }, h('span', null, 'Probabilidad previa (clínica): '), vp));
      cont.appendChild(r);
      cont.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Hallazgos disponibles (Anexo A)'));
      H.items.forEach(function (it, k) {
        var b = h('button', { class: 'opcion' + (sel[k] ? ' sel' : ''), onclick: function () { sel[k] = !sel[k]; explorado = true; pintar(); } },
          (sel[k] ? '☑ ' : '☐ ') + it.t + ' · LR ' + F(it.lr, it.lr < 1 ? 2 : 1) + ' · ' + it.dom);
        cont.appendChild(b);
      });
      var salida = h('div'); cont.appendChild(salida);
      function calc() {
        salida.innerHTML = '';
        var elegidos = H.items.filter(function (_, k) { return sel[k]; });
        var p = previa / 100, o = B.odds(p), lr = 1, grupos = {}, doble = false, contradic = false;
        elegidos.forEach(function (it) {
          lr *= it.lr;
          if (it.g) { if (grupos[it.g]) { doble = true; if ((grupos[it.g] > 1) !== (it.lr > 1)) contradic = true; } grupos[it.g] = it.lr; }
        });
        var post = B.prob(o * lr);
        salida.appendChild(api.barraProb([{ p: p, t: 'Previa ' + previa + ' %' }, { p: post, t: 'Posterior ' + F(post * 100) + ' %', clase: 'post' }]));
        salida.appendChild(h('div', null,
          h('span', { class: 'cifra' }, h('small', null, '1. Odds previas'), F(o, 2)),
          h('span', { class: 'cifra' }, h('small', null, '2. × LR combinado ' + F(lr, lr < 1 ? 3 : 1)), F(o * lr, 2)),
          h('span', { class: 'cifra' }, h('small', null, '3. Probabilidad posterior'), F(post * 100) + ' %')));
        if (elegidos.length === 1) {
          var l = elegidos[0].lr, delta = Math.log(l) / Math.log(10) * 45;
          salida.appendChild(h('div', { class: 'fb info' }, 'Aproximación de McGee: ' + (delta >= 0 ? '+' : '') + F(delta) + ' puntos → ' + F(Math.max(0, Math.min(100, previa + delta))) + ' %. ' +
            (previa < 10 || previa > 90 ? 'Fuera de 10 a 90 %: aquí la aproximación falla, use odds.' : 'Error esperado: 5 a 10 puntos.')));
        }
        if (contradic) salida.appendChild(h('div', { class: 'fb mal', html: '<b>Resultados incompatibles.</b> Ha marcado a la vez un resultado positivo y uno negativo de la misma prueba.' }));
        else if (doble) salida.appendChild(h('div', { class: 'fb mal', html: '<b>Doble conteo.</b> Ha multiplicado hallazgos que expresan el mismo fenómeno. Quédese con el de mayor peso de ese dominio y combínelo con datos de otros dominios.' }));
        else if (post > 0.95 && elegidos.length > 1 && elegidos.every(function (x) { return x.lr < 10; })) salida.appendChild(h('div', { class: 'fb info' }, 'Señal de sobreestimación: más de 95 % con hallazgos modestos. Revise si dependen unos de otros.'));
        var nota = elegidos.filter(function (x) { return x.nota; })[0];
        if (nota) salida.appendChild(h('div', { class: 'pregunta-n' }, nota.nota));
      }
      calc();
      cont.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', disabled: !explorado, onclick: function () { api.fin(1, 'Simulador explorado. Pruebe ahora los retos de cálculo.', true); } }, 'Marcar como explorado')));
    }
    pintar();
  }

  /* Reto contra reloj: estimar con McGee y comparar con el cálculo exacto. */
  function retoMcGee(el, api) {
    var h = api.h, B = api.bayes, F = api.fmt;
    var LRS = [0.1, 0.2, 0.5, 2, 5, 10], PREV = [20, 25, 30, 40, 45, 50, 60, 70];
    var ronda = 0, total = 6, bien = 0;
    function nueva() {
      el.innerHTML = '';
      if (ronda >= total) return api.fin(bien / total, bien + ' de ' + total + ' estimaciones dentro de 10 puntos del valor exacto');
      var p = PREV[Math.floor(Math.random() * PREV.length)], lr = LRS[Math.floor(Math.random() * LRS.length)];
      var exacto = B.post(p / 100, lr) * 100, t0 = Date.now();
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Ronda ' + (ronda + 1) + ' de ' + total + ' · responda sin calculadora'));
      el.appendChild(h('div', { class: 'enunciado' }, 'Probabilidad previa ' + p + ' % y hallazgo con LR ' + F(lr, lr < 1 ? 1 : 0) + '. ¿Probabilidad posterior?'));
      var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Probabilidad posterior en %' });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        var v = api.num(inp.value); if (isNaN(v)) return;
        bt.disabled = true; inp.disabled = true;
        var seg = (Date.now() - t0) / 1000, ok = Math.abs(v - exacto) <= 10;
        if (ok) bien++;
        var d = { 0.1: -45, 0.2: -30, 0.5: -15, 2: 15, 5: 30, 10: 45 }[lr];
        zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: '<b>' + (ok ? 'Dentro del margen.' : 'Fuera del margen.') + '</b> Exacto: ' + F(exacto) + ' %. McGee: ' + p + (d > 0 ? ' + ' : ' − ') + Math.abs(d) + ' = ' + (p + d) + ' %. Tiempo: ' + F(seg, 1) + ' s.' +
          ((p + d) > 100 || (p + d) < 0 ? ' Cerca de los extremos la escala se comprime: use odds.' : '') }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { ronda++; nueva(); } }, 'Siguiente')));
      } }, 'Comprobar');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !bt.disabled) bt.click(); });
      el.appendChild(h('div', { class: 'fila' }, inp, '%', bt));
      el.appendChild(h('div', { class: 'pregunta-n', style: 'margin-top:8px' }, 'Recuerde: «2, 5, 10: 15, 30, 45».'));
      el.appendChild(zona);
      inp.focus();
    }
    nueva();
  }

  TDC.registrar({
    numero: 5, parte: 'II',
    titulo: 'Cocientes de verosimilitud y Teorema de Bayes aplicados a la escena y al POCUS',
    mision: 'Mueva la probabilidad con cada hallazgo, sin doble conteo, y decida con el POCUS.',
    objetivo: 'Convertir una probabilidad pre-test en post-test mediante cocientes de verosimilitud, combinar hallazgos con criterio e integrar el POCUS como una prueba de peso probabilístico conocido.',
    escena: 'Usted trabaja en una ambulancia con ecógrafo portátil. Cada dato que recoge pesa algo en la balanza diagnóstica: su tarea es saber <b>cuánto</b>, combinarlo sin contar dos veces la misma evidencia y detenerse cuando ningún hallazgo más cambiará la decisión.',
    actividades: [
      {
        tipo: 'personalizado', titulo: 'Simulador bayesiano de la escena', render: simulador,
        instrucciones: 'Elija una condición, ajuste la probabilidad previa y active hallazgos. Observe la plantilla de tres líneas, la aproximación de McGee y qué ocurre si combina hallazgos del mismo fenómeno (por ejemplo, tercer ruido, ingurgitación y crepitantes).'
      },
      {
        tipo: 'numero', titulo: 'Plantilla de tres líneas',
        instrucciones: 'Calcule con odds. Escriba el resultado final en porcentaje (sin el signo).',
        problemas: [
          { enunciado: 'Probabilidad previa de 30 % y hallazgo con LR 4. ¿Probabilidad posterior?', respuesta: 63, tolerancia: 2, unidad: '%', solucion: 'Odds 0,30/0,70 = 0,43; × 4 = 1,71; 1,71/2,71 = 63 %.' },
          { enunciado: 'Con los datos de Maw et al. (Se 0,88; Es 0,90), ¿cuál es el LR+ de la ecografía pulmonar para insuficiencia cardíaca?', respuesta: 8.8, tolerancia: 0.2, decimales: 1, solucion: 'LR+ = Se/(1 − Es) = 0,88/0,10 = 8,8.' },
          { enunciado: 'Y el LR− de esa misma prueba (dos decimales).', respuesta: 0.13, tolerancia: 0.01, decimales: 2, solucion: 'LR− = (1 − Se)/Es = 0,12/0,90 = 0,13.' },
          { enunciado: 'Anciano disneico con probabilidad previa de insuficiencia cardíaca de 40 %. La ecografía pulmonar es <b>negativa</b> (LR 0,13). ¿Probabilidad posterior?', respuesta: 8, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,67 × 0,13 = 0,087; 0,087/1,087 = 8 %.' },
          { enunciado: 'Politraumatizado hipotenso con probabilidad previa de hemorragia intraabdominal de 60 %. FAST negativa (LR 0,27). ¿Probabilidad posterior?', respuesta: 29, tolerancia: 2, unidad: '%', solucion: 'Odds 1,5 × 0,27 = 0,41; 0,41/1,41 = 29 %. No está descartada: centro de trauma con preaviso y FAST seriada.' },
          { enunciado: 'Mujer de 78 años, previa de insuficiencia cardíaca 45 %. Fibrilación auricular (LR 3,8) y líneas B (LR 8,8), de dominios distintos. ¿Probabilidad posterior?', respuesta: 96, tolerancia: 1.5, unidad: '%', solucion: 'Odds 0,82 × 3,8 × 8,8 = 27,4; 27,4/28,4 = 96 %.' }
        ]
      },
      { tipo: 'personalizado', titulo: 'Reto McGee: cálculo mental', render: retoMcGee,
        instrucciones: 'En la escena no hay calculadora. Estime la probabilidad posterior sumando o restando puntos. Se acepta un error de hasta 10 puntos.' },
      {
        tipo: 'clasificar', titulo: '¿Se pueden multiplicar?',
        instrucciones: 'Para cada par de hallazgos, decida si es legítimo encadenar sus LR o si sería doble conteo.',
        categorias: ['Combinar', 'Doble conteo'],
        items: [
          { texto: 'Fibrilación auricular en el ECG + líneas B en la ecografía (insuficiencia cardíaca)', cat: 0, porque: 'Dominios distintos: prueba eléctrica e imagen.' },
          { texto: 'Crepitantes + matidez + egofonía (neumonía)', cat: 1, porque: 'Los tres reflejan la misma consolidación. Use la regla de Heckerling.' },
          { texto: 'Ausencia de deslizamiento pleural + punto pulmón (neumotórax)', cat: 1, porque: 'El punto pulmón solo existe donde falta el deslizamiento.' },
          { texto: 'Tercer ruido + ingurgitación yugular + crepitantes (insuficiencia cardíaca)', cat: 1, porque: 'Tres expresiones de la misma congestión: elija la de más peso.' },
          { texto: 'Antecedente de insuficiencia cardíaca + ecografía pulmonar con líneas B', cat: 0, porque: 'Antecedentes e imagen: dominios distintos.' },
          { texto: 'Regla de Heckerling con 5 hallazgos + LR de los crepitantes', cat: 1, porque: 'Los crepitantes ya están incluidos en la regla.' },
          { texto: 'Déficit de pulso + radiografía con mediastino ensanchado (disección aórtica)', cat: 0, porque: 'Exploración e imagen: fenómenos distintos, se pueden encadenar con prudencia.' }
        ]
      },
      {
        tipo: 'caso', titulo: 'Caída de altura: el pulmón que no se deslizaba',
        presentacion: '<b>Despacho:</b> obrero de 35 años que cae desde un andamio de 5 metros sobre el costado derecho. Traslado estimado al centro de trauma: 30 minutos.',
        fases: [
          {
            titulo: 'Llegada y evaluación primaria',
            monitor: { FR: '30 rpm', SpO2: '91 % (reservorio)', FC: '124 lpm', PA: '102/68' },
            datos: 'Dolor torácico derecho y disnea. Murmullo disminuido a la derecha, difícil de valorar por el ruido de la obra. Enfisema subcutáneo leve. Tráquea aparentemente central.',
            decision: { tipo: 'probabilidad', pregunta: '¿Qué probabilidad de neumotórax estima ahora?', rango: [50, 70],
              explicacion: 'Mecanismo, dolor, disnea, asimetría y enfisema sitúan la probabilidad en torno a 60 %.' }
          },
          {
            titulo: 'Un signo tentador',
            datos: 'Su compañero comenta: «La tráquea está central, así que no puede ser un neumotórax importante».',
            decision: { tipo: 'opcion', pregunta: '¿Cómo usa la tráquea central?',
              opciones: ['Reduzco la probabilidad a 30 %', 'No la modifico: es un signo tardío y sin fiabilidad', 'La subo: la tráquea central indica neumotórax simple'],
              correcta: 1, explicacion: 'La desviación traqueal es tardía y su concordancia entre observadores es prácticamente nula (capítulo 2). Un signo sin fiabilidad no resta.' },
            experto: '“Asimetría, enfisema y disnea: estoy en 60 % para neumotórax; la tráquea no me sirve.”'
          },
          {
            titulo: 'Ecografía en la ambulancia',
            datos: 'Cara anterior derecha: <b>sin deslizamiento pleural</b> en dos espacios. Línea axilar: <b>punto pulmón</b>. Izquierda: deslizamiento normal. Receso costodiafragmático derecho: pequeña cantidad de <b>líquido</b>.',
            decision: { tipo: 'opcion', pregunta: '¿Cómo actualiza la probabilidad de neumotórax?',
              opciones: ['Multiplico LR de ausencia de deslizamiento (4,5) por el del punto pulmón', 'Uso el punto pulmón: casi 100 % de especificidad lleva la probabilidad por encima de 99 %', 'Solo uso la ausencia de deslizamiento: 87 %'],
              correcta: 1, parcial: [2],
              explicacion: 'La ausencia de deslizamiento sola llevaría de 60 a 87 %; el punto pulmón, por encima de 99 %. No se multiplican: el punto pulmón solo existe donde falta el deslizamiento.' },
            experto: '“Sin deslizamiento y con punto pulmón: neumotórax confirmado. No sumo los dos signos.”'
          },
          {
            titulo: 'El hallazgo inesperado',
            datos: '¿Qué hace con el líquido en el receso costodiafragmático derecho?',
            decision: { tipo: 'opcion', pregunta: 'Elija la interpretación correcta.',
              opciones: ['Lo ignoro: la prioridad es el neumotórax', 'Abre una hipótesis nueva: hemotórax asociado', 'Confirma que el neumotórax es a tensión'],
              correcta: 1, explicacion: 'Un hallazgo inesperado abre una hipótesis, no se descarta. La hipotensión puede tener más de una causa.' }
          },
          {
            titulo: 'Deterioro a los 8 minutos',
            monitor: { PA: '78/50', FC: '140 lpm', SpO2: '84 %' },
            datos: 'El neumotórax ya está confirmado. La pregunta ahora es otra.',
            decision: { tipo: 'opcion', pregunta: '¿Qué hace?',
              opciones: ['Repito la ecografía para ver si el neumotórax creció', 'Descompresión con aguja en el 4.º o 5.º espacio, línea axilar anterior', 'Descompresión en el 2.º espacio, línea medioclavicular', 'Aumento el ritmo de fluidos y acelero el traslado'],
              correcta: 1, parcial: [2],
              porOpcion: { 0: 'Esperar más imágenes retrasa una intervención que salva la vida.', 2: 'Descomprimir es correcto, pero el grosor de la pared produce más fallos en el 2.º espacio.' },
              explicacion: 'Hipotensión e hipoxemia progresivas con neumotórax confirmado: fisiología de tensión. El umbral para descomprimir es bajo (capítulo 13) y la decisión la da la fisiología, no la imagen.' },
            experto: '“Hipotensión e hipoxemia progresivas con neumotórax confirmado: fisiología de tensión.”'
          },
          {
            titulo: 'Preaviso al centro de trauma',
            monitor: { PA: '98/62', SpO2: '94 %' },
            datos: 'Sale aire a presión y en 3 minutos mejora.',
            decision: { tipo: 'opcion', pregunta: '¿Qué diagnóstico de trabajo transmite?',
              opciones: ['Neumotórax resuelto, paciente estable', 'Neumotórax a tensión derecho descomprimido con hemotórax asociado; vigilar recidiva de la tensión y hemorragia', 'Trauma torácico, sin más datos'],
              correcta: 1, explicacion: 'Se transmiten ambos hallazgos y las hipótesis abiertas. En urgencias el tubo de tórax drenó 800 mL de sangre.' }
          }
        ],
        cierre: 'El POCUS convirtió una sospecha de 60 % en una certeza práctica, y la decisión de descomprimir se tomó por la fisiología, no por la imagen. El signo sin fiabilidad no restó, los correlacionados no se sumaron dos veces y el hallazgo inesperado abrió una hipótesis nueva.'
      },
      {
        tipo: 'quiz', titulo: '¿Vale la pena buscar un hallazgo más?',
        preguntas: [
          { p: 'Paciente con criterios claros de infarto con elevación del ST (probabilidad ≈ 90 %). ¿Busca un hallazgo con LR 0,5 antes de activar reperfusión?', opciones: ['Sí, podría descartar', 'No: lo dejaría en ≈ 82 % y la decisión no cambia', 'Sí, si se tarda menos de 20 minutos'], correcta: 1, explicacion: 'Si ningún resultado cruza el umbral de acción, buscarlo solo consume tiempo.' },
          { p: 'Con probabilidad previa <b>baja</b>, ¿qué tipo de hallazgo sirve?', opciones: ['Los que descartan con fuerza (LR− muy bajo)', 'Los que confirman con fuerza (LR+ alto)', 'Cualquiera con LR cercano a 1'], correcta: 1, explicacion: 'Solo un LR+ alto podría llevar a actuar.' },
          { p: 'Probabilidad previa 80 %, hallazgo negativo con LR 0,2. ¿Qué concluye?', opciones: ['Descartado: baja a menos de 10 %', 'Baja a ≈ 44 %: el paciente sigue en riesgo', 'No cambia nada'], correcta: 1, explicacion: 'Con probabilidad alta, un negativo moderado no descarta.' },
          { p: 'Un compañero calcula: «30 % por un LR de 5 da 150 %». ¿Cuál es el error?', opciones: ['Usó el LR equivocado', 'Multiplicó la probabilidad en lugar de las odds; el resultado correcto es 68 %', 'Debió dividir por 5'], correcta: 1, explicacion: 'Odds 0,43 × 5 = 2,14 → 68 %. El LR solo multiplica odds.' },
          { p: '¿Cuándo <b>no</b> debe hacerse una ecografía en la escena?', opciones: ['Cuando el resultado no puede cambiar la conducta, retrasa una intervención crítica o el operador no tiene competencia verificada', 'Siempre que el traslado dure menos de 30 minutos', 'Nunca: más información siempre ayuda'], correcta: 0, explicacion: 'Incluye no prolongar las pausas de compresión más allá de 10 segundos.' },
          { p: 'Previa de neumonía 25 %, T 38,5 °C, FC 110, crepitantes y murmullo disminuido, sin asma. ¿Probabilidad?', opciones: ['≈ 73 % con Heckerling (LR 8,2)', '≈ 97 % multiplicando Heckerling por el LR de los crepitantes', '≈ 50 %'], correcta: 0, explicacion: 'Odds 0,33 × 8,2 = 2,7 → 73 %. No se multiplican además los hallazgos incluidos en la regla.' },
          { p: 'En el POCUS de neumotórax, ¿qué signo <b>descarta</b> en la zona explorada?', opciones: ['Punto pulmón', 'Deslizamiento pleural presente', 'Líneas B'], correcta: 1, explicacion: 'El punto pulmón confirma; el deslizamiento presente descarta en esa zona.' },
          { p: 'La ausencia de deslizamiento pleural puede ser un falso positivo en…', opciones: ['Enfisema subcutáneo', 'Intubación selectiva del bronquio contralateral, apnea, adherencias o bullas', 'Hemotórax'], correcta: 1, explicacion: 'El enfisema subcutáneo produce falsos negativos al impedir ver.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Integrar el POCUS en la decisión',
        instrucciones: 'Ordene los cinco pasos.',
        pasos: ['Formular una pregunta binaria antes de apoyar la sonda', 'Estimar la probabilidad previa con la clínica', 'Explorar dentro de un tiempo límite sin interrumpir intervenciones críticas', 'Traducir el hallazgo en un LR y actualizar la probabilidad', 'Decidir, registrar las imágenes y someterlas a revisión de calidad'],
        explicacion: 'Sin pregunta previa ni probabilidad clínica, la imagen no tiene contra qué actualizarse.'
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'LR+ y LR− a partir de Se y Es', reverso: 'LR+ = Se/(1 − Es) · LR− = (1 − Se)/Es' },
          { frente: 'Regla de McGee', reverso: '«2, 5, 10: 15, 30, 45». LR 0,5 / 0,2 / 0,1 restan 15, 30 y 45 puntos. Válida entre 10 y 90 %.' },
          { frente: 'Plantilla de tres líneas', reverso: '1. Odds = p/(1 − p) · 2. × LR · 3. p = odds/(1 + odds)' },
          { frente: 'LR que produce cambios grandes, a menudo concluyentes', reverso: 'Mayor de 10 o menor de 0,1' },
          { frente: 'Cuatro reglas contra el doble conteo', reverso: 'Combinaciones validadas · dominios distintos · solo 2 o 3 hallazgos de más peso · ante la duda, acercar a 1' },
          { frente: 'Ecografía pulmonar en insuficiencia cardíaca aguda', reverso: 'Se 0,88 · Es 0,90 · LR+ 8,8 · LR− 0,13' },
          { frente: 'FAST en trauma cerrado', reverso: 'LR+ 18,5 · LR− 0,27: una FAST negativa no descarta' }
        ]
      }
    ]
  });
})();
