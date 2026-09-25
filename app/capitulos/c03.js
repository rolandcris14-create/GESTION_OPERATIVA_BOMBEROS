/* Capítulo 3. Probabilidad, riesgo e incertidumbre: pensar en frecuencias */
(function () {

  /* Escenarios del árbol de frecuencias naturales (todas las cifras proceden de los capítulos 3 y 6). */
  var ARBOLES = [
    { t: 'Cribado en población de baja prevalencia', d: 'Una prueba con sensibilidad de 90 % y tasa de falsos positivos de 9 % se aplica a una población con prevalencia de 1 %.', p: 0.01, se: 0.90, fp: 0.09,
      leccion: 'Es el problema que solo 21 % de 160 ginecólogos resolvió con probabilidades condicionales, y 87 % tras entrenarse en frecuencias naturales.' },
    { t: 'El problema de Casscells', d: 'Enfermedad con prevalencia de 1 por 1.000 y una prueba con 5 % de falsos positivos. Suponga que detecta a todos los enfermos.', p: 0.001, se: 1, fp: 0.05,
      leccion: 'La respuesta más frecuente de los médicos fue 95 %, en 1978 y otra vez en 2014. La correcta está cerca de 2 %.' },
    { t: 'Escala de oclusión de gran vaso', d: '20 % de los pacientes con sospecha de ictus tiene una oclusión de gran vaso. La escala prehospitalaria tiene sensibilidad de 85 % y especificidad de 68 %.', p: 0.20, se: 0.85, fp: 0.32,
      leccion: 'Seis de cada diez positivos no tienen oclusión: toda derivación directa debe pesar ese costo (capítulo 6).' },
    { t: 'Troponina en el punto de atención', d: 'Prevalencia de infarto de 5 % en la población atendida. Troponina con sensibilidad de 90 % y especificidad de 95 %.', p: 0.05, se: 0.90, fp: 0.05,
      leccion: 'Un positivo aislado en baja prevalencia equivale a lanzar una moneda. Por eso el descarte prehospitalario combina la troponina con un puntaje clínico y un tiempo mínimo desde el inicio.' },
    { t: 'qSOFA en la ambulancia', d: '10 % de los pacientes con infección atendidos tiene sepsis grave o shock séptico. qSOFA prehospitalario: sensibilidad 16,3 %, especificidad 97,3 %.', p: 0.10, se: 0.163, fp: 0.027,
      leccion: 'Un positivo pesa, pero de 100 pacientes graves 84 tienen qSOFA negativo: no sirve para tranquilizar.' }
  ];

  function arbolFrecuencias(el, api) {
    var h = api.h, F = api.fmt;
    var esc = api.barajar(ARBOLES).slice(0, 3), i = 0, bien = 0, total = 0, N = 1000;
    var nodo = 'border:1px solid var(--linea);border-radius:8px;padding:6px 4px;text-align:center;font-size:13px;background:var(--panel);min-width:0';
    var pos = 'border:1px solid var(--ambar-borde);border-radius:8px;padding:6px 4px;text-align:center;font-size:13px;background:var(--ambar-fondo);min-width:0';
    function campo(rot) { return h('input', { type: 'text', inputmode: 'decimal', 'aria-label': rot, style: 'width:100%;max-width:70px;text-align:center;padding:6px 4px;margin-top:4px' }); }
    function pintar() {
      el.innerHTML = '';
      if (i >= esc.length) return api.fin(bien / total, bien + ' de ' + total + ' valores correctos en ' + esc.length + ' árboles', true);
      var E = esc[i];
      var enf = N * E.p, vp = enf * E.se, fpos = (N - enf) * E.fp, vpp = vp / (vp + fpos) * 100;
      var sol = { enf: enf, vp: vp, fp: fpos, vpp: vpp };
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Árbol ' + (i + 1) + ' de ' + esc.length));
      el.appendChild(h('div', { class: 'caja escena', html: '<span class="rot">' + E.t + '</span>' + E.d + ' Imagine 1.000 pacientes.' }));
      var I = { enf: campo('Con la condición'), vp: campo('Positivos con la condición'), fp: campo('Positivos sin la condición'), vpp: campo('Valor predictivo positivo') };
      var sanos = h('b', null, '?'), fn = h('b', null, '?'), vn = h('b', null, '?');
      var arbol = h('div', { style: 'display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0' },
        h('div', { style: nodo + ';grid-column:1 / 5;font-weight:700' }, '1.000 pacientes'),
        h('div', { style: nodo + ';grid-column:1 / 3' }, 'Con la condición', h('br'), I.enf),
        h('div', { style: nodo + ';grid-column:3 / 5' }, 'Sin la condición', h('br'), sanos),
        h('div', { style: pos }, 'Positivos', h('br'), I.vp),
        h('div', { style: nodo }, 'Negativos', h('br'), fn),
        h('div', { style: pos }, 'Positivos', h('br'), I.fp),
        h('div', { style: nodo }, 'Negativos', h('br'), vn));
      el.appendChild(arbol);
      el.appendChild(h('div', { class: 'fila' }, h('span', null, 'De todos los positivos, ¿qué % tiene la condición?'), I.vpp, h('span', null, '%')));
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        var faltan = Object.keys(I).some(function (k) { return isNaN(api.num(I[k].value)); });
        if (faltan) { aviso.textContent = 'Complete los cuatro valores.'; return; }
        aviso.textContent = ''; bt.disabled = true;
        var aciertos = 0;
        Object.keys(I).forEach(function (k) {
          var v = api.num(I[k].value), tol = k === 'vpp' ? 2 : Math.max(1, sol[k] * 0.02);
          var ok = Math.abs(v - sol[k]) <= tol + 1e-9; if (ok) aciertos++;
          I[k].disabled = true;
          I[k].style.borderColor = ok ? 'var(--verde)' : 'var(--rojo)';
          I[k].style.borderWidth = '2px';
          if (!ok) I[k].value = F(sol[k]);
        });
        bien += aciertos; total += 4;
        sanos.textContent = F(N - enf); fn.textContent = F(enf - vp); vn.textContent = F(N - enf - fpos);
        var todos = vp + fpos;
        zona.appendChild(h('div', { class: 'fb ' + (aciertos === 4 ? 'bien' : aciertos >= 2 ? 'info' : 'mal'), html:
          '<b>' + aciertos + ' de 4 correctos.</b> De ' + F(todos) + ' positivos, ' + F(vp) + ' tienen la condición: VPP ' + F(vpp) + ' %. ' +
          'Valor predictivo negativo: ' + F((N - enf - fpos) / (N - todos) * 100, 1) + ' %. ' + E.leccion }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; pintar(); } }, i + 1 < esc.length ? 'Siguiente árbol' : 'Ver resultado')));
      } }, 'Comprobar');
      var aviso = h('span', { class: 'pregunta-n' });
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    pintar();
  }

  /* Pictograma de 1.000 pacientes: del riesgo relativo al NNT o NNH. Datos de la tabla 3.5. */
  var EFECTOS = [
    { t: 'Aspirina en el infarto (ISIS-2)', d: 'mortalidad vascular a 5 semanas', rc: 0.118, rt: 0.094 },
    { t: 'Ácido tranexámico en la primera hora (CRASH-2)', d: 'muerte por hemorragia', rc: 0.077, rt: 0.053 },
    { t: 'Ácido tranexámico después de 3 horas (CRASH-2)', d: 'muerte por hemorragia', rc: 0.031, rt: 0.044 },
    { t: 'Fibrinólisis prehospitalaria (STREAM)', d: 'hemorragia intracraneal', rc: 0.002, rt: 0.010 },
    { t: 'Tratamiento con reducción relativa de 25 % en un paciente grave', d: 'muerte', rc: 0.40, rt: 0.30 },
    { t: 'El mismo tratamiento en un paciente de bajo riesgo', d: 'muerte', rc: 0.04, rt: 0.03 },
    { t: 'Ácido tranexámico en hemorragia grave (reducción relativa cercana a 15 %)', d: 'muerte por hemorragia', rc: 0.20, rt: 0.17 }
  ];

  function pictograma(el, api) {
    var h = api.h, F = api.fmt;
    var esc = api.barajar(EFECTOS).slice(0, 5), i = 0, bien = 0;
    function rejilla(rojos, extra, claseExtra) {
      var g = h('div', { role: 'img', 'aria-label': '1.000 pacientes: ' + rojos + ' con el desenlace' + (extra ? ' y ' + extra + ' ' + claseExtra : ''), style: 'display:grid;grid-template-columns:repeat(40,1fr);gap:2px;max-width:340px;margin:10px 0' });
      for (var k = 0; k < 1000; k++) {
        var color = k < rojos ? 'var(--rojo)' : k < rojos + extra ? (claseExtra === 'evitados' ? 'var(--verde)' : 'var(--ambar-borde)') : 'var(--linea)';
        g.appendChild(h('span', { style: 'display:block;aspect-ratio:1;border-radius:50%;background:' + color }));
      }
      return g;
    }
    function pintar() {
      el.innerHTML = '';
      if (i >= esc.length) return api.fin(bien / esc.length, bien + ' de ' + esc.length + ' NNT o NNH bien calculados', true);
      var E = esc[i], dano = E.rt > E.rc, dif = Math.abs(E.rc - E.rt), nn = 1 / dif;
      var rrr = (1 - E.rt / E.rc) * 100, rr = E.rt / E.rc;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Escenario ' + (i + 1) + ' de ' + esc.length));
      el.appendChild(h('div', { class: 'enunciado' }, E.t));
      el.appendChild(h('div', { class: 'datos', html: 'Desenlace: <b>' + E.d + '</b>. Riesgo sin tratamiento: <b>' + F(E.rc * 100, 1) + ' %</b>. Con tratamiento: <b>' + F(E.rt * 100, 1) + ' %</b>.<br>' +
        'El titular diría: «' + (dano ? 'multiplica el riesgo por ' + F(rr, 1) : 'reduce el riesgo un ' + F(rrr) + ' %') + '».' }));
      var dib = h('div'); dib.appendChild(rejilla(Math.round(E.rc * 1000), 0));
      el.appendChild(dib);
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Cada punto es un paciente. En rojo, los que sufren el desenlace sin tratamiento.'));
      var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'NNT o NNH', style: 'width:100px' });
      var zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        var v = api.num(inp.value); if (isNaN(v)) { inp.focus(); return; }
        bt.disabled = true; inp.disabled = true;
        var ok = Math.abs(v - nn) <= Math.max(1, nn * 0.06); if (ok) bien++;
        dib.innerHTML = '';
        var n1 = Math.round(Math.min(E.rc, E.rt) * 1000), n2 = Math.round(dif * 1000);
        dib.appendChild(rejilla(n1, n2, dano ? 'dañados' : 'evitados'));
        var ley = dano
          ? '<span style="color:var(--rojo)">●</span> ' + n1 + ' lo sufren igual · <span style="color:var(--ambar-borde)">●</span> ' + n2 + ' daños añadidos por el tratamiento'
          : '<span style="color:var(--rojo)">●</span> ' + n1 + ' lo sufren aun tratados · <span style="color:var(--verde)">●</span> ' + n2 + ' lo evitan gracias al tratamiento';
        zona.appendChild(h('div', { class: 'pregunta-n', html: ley }));
        zona.appendChild(h('div', { class: 'fb ' + (ok ? 'bien' : 'mal'), html: '<b>' + (ok ? 'Correcto.' : 'Revise el cálculo.') + '</b> ' +
          (dano ? 'Aumento absoluto' : 'Reducción absoluta') + ': ' + F(E.rc * 100, 1) + ' − ' + F(E.rt * 100, 1) + ' = ' + F(dif * 100, 1) + ' puntos. ' +
          (dano ? 'NNH' : 'NNT') + ' = 1/' + F(dif, 3) + ' ≈ ' + F(nn) + '. ' +
          'En frecuencias: de cada 1.000 pacientes tratados, unos ' + n2 + (dano ? ' sufren un daño que no habrían sufrido.' : ' evitan el desenlace.') +
          (E.rc < 0.05 && !dano ? ' Con riesgo basal bajo, el mismo efecto relativo produce poco beneficio absoluto.' : '') }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; pintar(); } }, i + 1 < esc.length ? 'Siguiente escenario' : 'Ver resultado')));
      } }, 'Comprobar');
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !bt.disabled) bt.click(); });
      el.appendChild(h('div', { class: 'fila' }, h('span', null, 'NNT o NNH, según corresponda:'), inp, bt));
      el.appendChild(zona);
    }
    pintar();
  }

  TDC.registrar({
    numero: 3, parte: 'II',
    titulo: 'Probabilidad, riesgo e incertidumbre: pensar en frecuencias',
    mision: 'Estime probabilidades explícitas, piense en frecuencias naturales y traduzca el riesgo relativo a NNT.',
    objetivo: 'Estimar y justificar una probabilidad pre-test explícita, y traducir estadísticas condicionales a frecuencias naturales para decidir y comunicar riesgo.',
    escena: 'Dos llamadas en la misma noche con el mismo texto de despacho. Antes de cada dato nuevo usted debe poder decir <b>una cifra</b>: cuántos de cada 10 pacientes como este tienen la condición. Después tendrá que explicarlo a una familia asustada sin porcentajes condicionales.',
    actividades: [
      {
        tipo: 'caso', titulo: 'Dos pacientes, el mismo dolor',
        presentacion: '<b>Despacho, dos llamadas:</b> «dolor torácico opresivo de 30 minutos». Para ambos pacientes parta de una probabilidad de síndrome coronario agudo (SCA) de 15 %.',
        fases: [
          {
            titulo: 'Paciente A',
            monitor: { FC: '96 lpm', PA: '148/90', SpO2: '97 %', ECG: 'sin elevación del ST' },
            datos: 'Mujer de 58 años, diabética tipo 2. Opresión retroesternal irradiada a <b>ambos brazos</b>, con náuseas, <b>sudoración</b> y disnea leve. ECG: ritmo sinusal, ondas T aplanadas inespecíficas.',
            decision: { tipo: 'probabilidad', pregunta: 'Irradiación a ambos brazos (LR 4,1) y sudoración (LR 2,0). ¿Qué probabilidad de SCA estima?', rango: [40, 60],
              explicacion: 'Odds 0,18 × 4,1 = 0,72 → 42 %; la sudoración la acerca a 55 o 60 %.' },
            experto: '“Parto de 15 %. La irradiación a ambos brazos es de los datos de más peso y la sudoración suma algo: estoy por encima de 40 %.”'
          },
          {
            titulo: 'Paciente B',
            monitor: { FC: '84 lpm', PA: '138/84', SpO2: '99 %', ECG: 'normal' },
            datos: 'Varón de 45 años, fumador, hipertenso, dislipidémico, padre infartado a los 50 años. Dolor punzante en el hemitórax izquierdo que <b>aumenta al inspirar</b> y <b>al presionar la pared</b>, iniciado tras levantar pesas. Murmullo vesicular simétrico.',
            decision: { tipo: 'probabilidad', pregunta: 'Dolor pleurítico (LR 0,2) y reproducible a la palpación (LR 0,3). ¿Qué probabilidad de SCA estima?', rango: [1, 5],
              explicacion: 'El cálculo nominal da 1 a 3 %; como ambos hallazgos están correlacionados, el valor real se sitúa hacia el extremo superior.' }
          },
          {
            titulo: 'La opinión del compañero',
            datos: '«B es el de más riesgo: tiene los cuatro factores. A parece un dolor gástrico.»',
            decision: { tipo: 'opcion', pregunta: '¿Qué error de razonamiento comete?',
              opciones: ['Negligencia de la tasa base: olvida que el SCA es raro', 'Heurística de representatividad: sigue al prototipo y no al peso de los datos', 'Ninguno: los factores de riesgo son el mejor predictor del SCA agudo'],
              correcta: 1,
              explicacion: 'Los factores de riesgo estiman el riesgo a largo plazo, pero aportan poco al diagnóstico agudo: algo en menores de 40 años, escaso entre 40 y 65, casi nada después.' }
          },
          {
            titulo: 'Decisión para A',
            decision: { tipo: 'opcion', pregunta: '¿Qué corresponde para la paciente A?',
              opciones: ['Prioridad baja al hospital más cercano: el ECG no muestra elevación del ST', 'Antiácido en la escena y reevaluar a los 30 minutos', 'Aspirina, ECG seriados cada 10 a 15 minutos, preaviso y centro con intervencionismo'],
              correcta: 2,
              explicacion: 'Un ECG no diagnóstico no descarta. Las mujeres menores de 55 años, la disnea como síntoma principal y el ECG no diagnóstico se asociaron con más altas erróneas.' },
            experto: '“Diabética y mujer: grupo con más riesgo de que se nos pase. Aspirina, ECG seriados y hemodinamia.”'
          },
          {
            titulo: 'Decisión para B',
            decision: { tipo: 'multiple', pregunta: 'Marque lo que corresponde para el paciente B.',
              opciones: ['Buscar causas pleurales y parietales; auscultar para neumotórax', 'Aplicar los criterios PERC para tromboembolismo', 'Activar el código de infarto por sus cuatro factores de riesgo', 'Decidir el destino según protocolo'],
              correctas: [0, 1, 3],
              explicacion: 'B cumple todos los criterios PERC; con sospecha clínica baja, la probabilidad de tromboembolismo queda por debajo del umbral de estudio.' },
            experto: '“Pleurítico y reproducible: bajo de 5 %, aunque tenga cuatro factores de riesgo. Ahora la pregunta es otra: ¿neumotórax, tromboembolismo?”'
          },
          {
            titulo: 'Hablar con la hija de A',
            datos: 'La hija pregunta: «¿Es grave? ¿Por qué no la llevan al hospital de al lado?».',
            decision: { tipo: 'opcion', pregunta: '¿Qué le dice?',
              opciones: ['«De cada 10 personas con un dolor como el de su madre, unas 4 a 6 tienen un problema del corazón que necesita tratamiento urgente»', '«Su madre tiene una probabilidad condicional de 40 a 60 % de síndrome coronario agudo»', '«Seguramente no es nada, pero por si acaso la llevamos lejos»'],
              correcta: 0,
              explicacion: 'Las frecuencias naturales con denominador concreto se entienden mejor que cualquier porcentaje condicional.' }
          }
        ],
        cierre: 'El prototipo engaña en ambas direcciones. El peso de los datos concretos, no el retrato del paciente típico, decide la prioridad. La mujer diabética con disnea y náuseas pertenece al grupo con mayor riesgo de alta errónea, y la impresión global no basta para descartar un infarto.'
      },
      {
        tipo: 'personalizado', titulo: 'Árbol de frecuencias naturales', render: arbolFrecuencias,
        instrucciones: 'Convierta cada enunciado en 1.000 pacientes concretos: cuántos tienen la condición, cuántos de ellos dan positivo y cuántos sanos dan positivo. Después responda la única pregunta que importa en la escena: ¿qué significa un positivo? Tolerancia: 1 paciente o 2 puntos porcentuales.'
      },
      {
        tipo: 'personalizado', titulo: '1.000 pacientes: del titular al NNT', render: pictograma,
        instrucciones: 'Cada escenario trae el riesgo sin y con tratamiento. Calcule el NNT (si el tratamiento beneficia) o el NNH (si daña) y observe en el pictograma cuántos pacientes cambian realmente de destino.'
      },
      {
        tipo: 'numero', titulo: 'Probabilidad y odds',
        instrucciones: 'Convierta. Escriba solo el número; use coma o punto decimal.',
        problemas: [
          { enunciado: 'Probabilidad de 30 %. ¿Odds? (dos decimales)', respuesta: 0.43, tolerancia: 0.01, decimales: 2, solucion: '0,30/0,70 = 0,43.' },
          { enunciado: 'Odds de 3. ¿Probabilidad?', respuesta: 75, tolerancia: 0.5, unidad: '%', solucion: '3/(1 + 3) = 0,75.' },
          { enunciado: 'Probabilidad de 80 %. ¿Odds?', respuesta: 4, tolerancia: 0.05, solucion: '0,80/0,20 = 4: «4 contra 1».' },
          { enunciado: 'Odds de 1,71. ¿Probabilidad?', respuesta: 63, tolerancia: 1, unidad: '%', solucion: '1,71/2,71 = 63 %.' },
          { enunciado: 'Probabilidad de 5 %. ¿Odds? (tres decimales)', respuesta: 0.053, tolerancia: 0.003, decimales: 3, solucion: '0,05/0,95 = 0,053: por debajo de 10 %, odds y probabilidad casi coinciden.' },
          { enunciado: 'Odds de 0,25. ¿Probabilidad?', respuesta: 20, tolerancia: 0.5, unidad: '%', solucion: '0,25/1,25 = 20 %: «1 contra 4».' },
          { enunciado: 'Probabilidad de 90 %. ¿Odds?', respuesta: 9, tolerancia: 0.1, solucion: '0,90/0,10 = 9. Por encima de 20 %, odds y probabilidad divergen rápido.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Tasa base bien usada?',
        instrucciones: 'Decida si cada razonamiento elige bien la clase de referencia o cae en la negligencia de la tasa base.',
        categorias: ['Razonamiento correcto', 'Negligencia de la tasa base'],
        items: [
          { texto: 'Tres convivientes con cefalea y un calentador a gas: pone la intoxicación por monóxido de carbono como primera hipótesis', cat: 0, porque: 'Otra clase de referencia, otra tasa base.' },
          { texto: 'Mujer de 25 años con dolor opresivo: parte de 2 a 5 % de síndrome coronario agudo y lo revisa cuando llega el ECG', cat: 0, porque: 'Tasa base ajustada por los rasgos de peso y enunciada como rango revisable.' },
          { texto: 'Troponina positiva en una población con 5 % de prevalencia: la interpreta como una moneda al aire', cat: 0, porque: 'VPP de 49 %: es la lectura correcta.' },
          { texto: 'Aplica un criterio de cribado de sepsis a todos los pacientes con fiebre leve y trata cada positivo como sepsis', cat: 1, porque: 'En baja prevalencia, la mayoría de las alarmas serán falsas.' },
          { texto: 'Acepta un resultado negativo como descarte en un paciente con probabilidad previa alta', cat: 1, porque: 'Incluso una buena prueba deja una probabilidad residual relevante.' },
          { texto: '«Siempre es ansiedad»: usa las llamadas anteriores de la misma paciente para bajar la probabilidad de hoy', cat: 1, porque: 'Cada episodio tiene su propia probabilidad.' },
          { texto: 'Despacho «posible infarto» en una mujer de 23 años con ansiedad: baja la probabilidad antes de evaluarla', cat: 1, porque: 'Negligencia de la tasa base al revés: la etiqueta de ansiedad no debe restar antes de evaluar.' },
          { texto: 'Un hallazgo con LR de 2 en una condición de 1 de cada 1.000: la considera ya probable', cat: 1, porque: 'LR 2 no convierte 1 de cada 1.000 en probable; LR 20 sí la volvería relevante.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Decidir y comunicar con números',
        preguntas: [
          { p: 'El despacho informa «posible infarto» en una mujer de 23 años con antecedente de ansiedad. ¿Cómo entra esa información?',
            opciones: ['Como evidencia débil de segunda mano: la probabilidad se construye con datos propios', 'Como motivo para bajar la probabilidad: probablemente es ansiedad', 'Como motivo para activar el código de infarto de inmediato'], correcta: 0,
            explicacion: 'La edad fija una tasa base baja, pero hay que considerar tromboembolismo, disección coronaria espontánea o arritmia.' },
          { p: '¿Qué significa decir que un paciente tiene 30 % de probabilidad de neumonía?',
            opciones: ['Que tiene un tercio de los signos de neumonía', 'Que de cada 10 pacientes con ese mismo cuadro, unos 3 la tienen', 'Que la neumonía afecta a 30 % de su pulmón'], correcta: 1,
            explicacion: 'La probabilidad describe la incertidumbre del clínico, no al paciente, que tiene o no tiene la enfermedad.' },
          { p: 'Su compañero dice que la neumonía es «posible». ¿Por qué conviene pedirle una cifra?',
            opciones: ['Porque las cifras siempre son más exactas que el juicio', 'Porque la ley exige registrar porcentajes', 'Porque las palabras reciben interpretaciones numéricas muy distintas entre clínicos'], correcta: 2,
            explicacion: 'Una cifra, aunque sea un rango, se puede discutir, actualizar y auditar. Convención práctica: posible, 20 a 50 %.' },
          { p: 'Un fármaco «reduce la mortalidad un 50 %». ¿Qué pregunta hace antes de entusiasmarse?',
            opciones: ['¿Sobre qué riesgo basal?', '¿Cuántos pacientes tenía el estudio?', '¿Cuánto cuesta?'], correcta: 0,
            explicacion: 'El riesgo relativo impresiona más que el absoluto; los médicos se inclinan más a tratar cuando se presenta en términos relativos.' },
          { p: 'Varón de 70 años con dolor torácico. ¿Cuánto pesan sus factores de riesgo coronario en el diagnóstico agudo?',
            opciones: ['Mucho: son la base de la estimación', 'Casi nada después de los 65 años', 'Lo mismo que en un paciente de 35 años'], correcta: 1,
            explicacion: 'Modificaron la probabilidad de forma apreciable en menores de 40 años, poco entre 40 y 65, y casi nada después.' },
          { p: 'qSOFA negativo en un paciente con infección en la ambulancia. ¿Qué concluye?',
            opciones: ['Descarta la sepsis grave', 'Reduce la probabilidad a menos de 5 %', 'Casi nada: 84 de cada 100 pacientes graves tienen qSOFA negativo'], correcta: 2,
            explicacion: 'Especificidad alta, sensibilidad de 16,3 %: pesa cuando es positivo y no sirve para tranquilizar.' },
          { p: 'La hija de un paciente pregunta qué significa su qSOFA positivo. ¿Qué le responde?',
            opciones: ['«De cada 10 pacientes con infección y este resultado, unos 4 tienen una infección grave; por eso vamos con prioridad»', '«Es un 40 % de valor predictivo positivo»', '«Significa que tiene sepsis con seguridad»'], correcta: 0,
            explicacion: 'Y añadir que, aunque hubiera salido normal, lo vigilarían: muchos pacientes graves lo tienen normal al principio.' },
          { p: 'En CRASH-2, el ácido tranexámico redujo la muerte por hemorragia en la primera hora, pero la aumentó después de 3 horas. ¿Qué enseña?',
            opciones: ['Que el estudio no es fiable', 'Que el tiempo desde la lesión es una variable de decisión tan importante como el diagnóstico', 'Que debe darse siempre, porque el efecto medio es positivo'], correcta: 1,
            explicacion: 'NNT de unos 42 en la primera hora; NNH de unos 77 después de 3 horas.' },
          { p: '¿Qué dice la evidencia sobre el juicio global del clínico para el infarto?',
            opciones: ['Es suficiente para descartarlo si es experto', 'Supera a cualquier prueba en la escena', 'No basta por sí solo para confirmar ni para descartar'], correcta: 2,
            explicacion: 'Integra señales difíciles de verbalizar, pero es una de cinco fuentes de la probabilidad previa.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Conversión probabilidad ↔ odds', reverso: 'odds = p/(1 − p) · p = odds/(1 + odds)' },
          { frente: 'Equivalencias rápidas', reverso: '50 % = 1 · 67 % = 2 · 75 % = 3 · 80 % = 4 · 90 % = 9. Por debajo de 10 %, casi iguales' },
          { frente: 'Escala verbal acordada', reverso: 'Muy improbable < 5 % · improbable 5 a 20 % · posible 20 a 50 % · probable 50 a 80 % · muy probable > 80 %' },
          { frente: 'Cinco fuentes de la probabilidad pre-test', reverso: 'Prevalencia de base · espectro y ámbito · datos del paciente · despacho · juicio global' },
          { frente: 'Frecuencias naturales en cuatro pasos', reverso: 'Imaginar 1.000 pacientes · aplicar la prevalencia · aplicar Se y falsos positivos · VP/todos los positivos' },
          { frente: 'Tres preguntas contra la negligencia de la tasa base', reverso: '¿Clase de referencia? · ¿Tasa base en esa clase (orden de magnitud)? · ¿Cuánto pesa el dato nuevo?' },
          { frente: 'Medidas de efecto', reverso: 'RAR = RC − RT · RR = RT/RC · RRR = 1 − RR · NNT = 1/RAR' },
          { frente: 'NNT según el riesgo basal', reverso: 'NNT = 1/(RC × RRR): el mismo efecto relativo beneficia más al paciente más grave' },
          { frente: 'Leer un ensayo en cuatro números', reverso: 'Riesgo control · riesgo tratado · diferencia absoluta con su IC · NNT o NNH' }
        ]
      }
    ]
  });
})();
