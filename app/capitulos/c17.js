/* Capítulo 17. Síntesis operativa: casos integradores */
(function () {
  /* Pasos del ciclo de decisión en la escena (17.1). */
  var CICLO = ['Despacho', 'Escena', 'Representación', 'Probabilidad previa', 'Hallazgos', 'Umbral', 'Punto de parada', 'Reevaluación', 'Transferencia'];

  /* Escenarios del turno integrador. Cada decisión indica el paso del ciclo (índice de CICLO) y los capítulos que integra.
     tipo: 'opcion' {opciones, correcta} · 'multiple' {opciones, correctas} · 'numero' {respuesta, tolerancia, unidad}. */
  var ESCENARIOS = [
    {
      titulo: 'Paro cardíaco en la sala de estar',
      intro: '07:50. Varón de 67 años encontrado por su esposa en el suelo; lo había visto bien 25 minutos antes. Nadie inició la reanimación y el equipo llegó 12 minutos después de la llamada. Insuficiencia cardíaca avanzada; había dicho a su familia que no quería «ser conectado a máquinas». Asistolia. Tras 20 minutos de soporte vital avanzado de buena calidad, sin recuperación de la circulación; capnografía de 8 mmHg; ecografía en la pausa de pulso sin movimiento cardíaco ni derrame.',
      pasos: [
        { paso: 4, caps: '6 y 13', tipo: 'multiple', q: '¿Qué criterios de la regla de terminación de soporte vital básico cumple este paciente?',
          opciones: ['Paro no presenciado por el equipo', 'Ninguna descarga administrada', 'Sin recuperación de la circulación antes del traslado', 'Capnografía menor de 10 mmHg a los 20 minutos'],
          correctas: [0, 1, 2],
          exp: 'Cumple los tres criterios; con la regla, 0,5 % de los pacientes en que recomendó terminar sobrevivió. La capnografía no forma parte de la regla y las guías desaconsejan usarla como criterio aislado.' },
        { paso: 4, caps: '5', tipo: 'opcion', q: '¿Cómo pesa la ecografía sin actividad cardíaca?',
          opciones: ['Supervivencia muy baja pero no nula; se limita a la pausa de pulso y se graba', 'Confirma la muerte con certeza: basta para terminar sin más', 'No aporta nada y debe evitarse siempre durante el paro'],
          correcta: 0,
          exp: 'La ausencia de actividad cardíaca se asoció con 0,6 % de supervivencia en un estudio multicéntrico. Su uso prolonga las pausas de compresión, por eso se limita a la pausa de pulso de menos de 10 segundos.' },
        { paso: 6, caps: '8, 9 y 15', tipo: 'opcion', q: 'Un compañero dice: «ya llevamos 20 minutos, parar ahora es tirar todo ese esfuerzo». ¿Qué examina PAUSA?',
          opciones: ['Disponibilidad por un paro reciente del turno', 'Costo hundido y miedo a la queja; y si hay hipotermia, ahogamiento, embarazo o intoxicación', 'Efecto de encuadre del despacho sobre el ritmo inicial'],
          correcta: 1,
          exp: 'Los 20 minutos invertidos no cambian el pronóstico: es costo hundido. El punto de parada verifica además que no haya una circunstancia especial que excluya la regla. Aquí no la hay.' },
        { paso: 5, caps: '13', tipo: 'opcion', q: '¿Qué decide?',
          opciones: ['Traslado con compresiones para que decida el hospital', 'Continuar 20 minutos más por si aparece un ritmo', 'Terminar según el protocolo con la dirección médica y acompañar a la esposa'],
          correcta: 2,
          exp: 'Regla aplicada dentro de su población, pruebas con sus límites y valores del paciente que coinciden con el pronóstico. Se registra la hora del fallecimiento y la tripulación hace después una conversación breve sobre el caso.' }
      ]
    },
    {
      titulo: 'Variante: fibrilación ventricular presenciada',
      intro: 'Varón de 67 años con insuficiencia cardíaca avanzada. Esta vez su esposa presenció el colapso e inició la reanimación, y el ritmo inicial fue una fibrilación ventricular que persiste tras las descargas.',
      pasos: [
        { paso: 4, caps: '6 y 13', tipo: 'opcion', q: '¿Aplica alguna regla de terminación de la reanimación?',
          opciones: ['Sí, la de soporte vital básico', 'Solo la de soporte vital avanzado', 'Ninguna: hubo testigo, reanimación por testigo y descargas'],
          correcta: 2,
          exp: 'La regla básica exige que no se haya administrado ninguna descarga; la avanzada añade que el paro no fuera presenciado y que nadie iniciara la reanimación. Aquí no se cumple ninguna.' },
        { paso: 5, caps: '12 y 13', tipo: 'opcion', q: '¿Qué considera?',
          opciones: ['Terminar a los 20 minutos igual que en el caso original', 'Otras opciones según el protocolo y traslado a un centro avanzado', 'Suspender las descargas y observar la evolución del ritmo'],
          correcta: 1,
          exp: 'La fibrilación ventricular persistente abre otras opciones según el protocolo del servicio y obliga a considerar el traslado a un centro con capacidad avanzada.' },
        { paso: 6, caps: '13 y 15', tipo: 'multiple', q: '¿Qué circunstancias excluyen aplicar la regla de terminación?',
          opciones: ['Hipotermia', 'Ahogamiento', 'Embarazo', 'Intoxicación', 'Paro presenciado por el equipo', 'Edad mayor de 65 años'],
          correctas: [0, 1, 2, 3, 4],
          exp: 'También la electrocución, la fibrilación ventricular persistente o recurrente, la recuperación transitoria de la circulación, una voluntad expresa del paciente en sentido contrario o dudas razonables sobre la calidad de la reanimación. La edad no excluye la regla.' }
      ]
    },
    {
      titulo: 'Mujer de 70 años con disnea súbita',
      intro: 'Disnea súbita, SpO2 de 88 %, FC de 120 lpm, sin fiebre y con la pierna izquierda edematosa desde hace 3 días. El tromboembolismo pulmonar es su diagnóstico más probable.',
      pasos: [
        { paso: 3, caps: '6', tipo: 'numero', q: 'Calcule los criterios de Wells (puntos).', respuesta: 7.5, tolerancia: 0.01, unidad: 'puntos', decimales: 1,
          exp: 'Signos de trombosis venosa: 3; FC mayor de 100: 1,5; tromboembolismo como diagnóstico más probable: 3. Total 7,5: tromboembolismo probable.' },
        { paso: 4, caps: '6', tipo: 'opcion', q: '¿Puede usar los criterios PERC para descartar en la escena?',
          opciones: ['Sí, porque la sospecha clínica todavía es moderada', 'No: tiene más de 50 años, SpO2 menor de 95 % y taquicardia', 'Sí, si el ECG es normal y no tiene hemoptisis'],
          correcta: 1,
          exp: 'PERC solo sirve con sospecha baja y cuando se cumplen todos sus criterios. Aplicarlo a medias o fuera de su población es un error típico (capítulo 7).' },
        { paso: 8, caps: '12 y 13', tipo: 'opcion', q: '¿Qué plan y destino propone?',
          opciones: ['Oxígeno titulado, acceso venoso, ECG y preaviso a un hospital con angiotomografía', 'Hospital más cercano sin preaviso, porque aún no hay diagnóstico', 'Control por su médico de cabecera en las próximas 24 horas'],
          correcta: 0,
          exp: 'El destino se elige por la capacidad que necesita: angiotomografía y posibilidad de tratar un tromboembolismo de alto riesgo si hay deterioro.' }
      ]
    },
    {
      titulo: 'Mujer de 26 años con síncope y dolor abdominal',
      intro: 'Despacho: «se desmayó en su trabajo, ya está consciente». Pálida, con dolor en la parte baja del abdomen desde la mañana. Afirma: «no estoy embarazada, me cuido». FC 108 lpm sentada, PA 104/68 mmHg. Al ponerse de pie refiere mareo intenso. Dolor en el hombro derecho. Última menstruación hace siete semanas.',
      pasos: [
        { paso: 2, caps: '10', tipo: 'opcion', q: '¿Qué representación del problema formula?',
          opciones: ['Síncope vasovagal en una mujer joven y nerviosa', 'Mujer en edad fértil con dolor abdominal agudo y síncope', 'Gastroenteritis con deshidratación leve y mareo'],
          correcta: 1,
          exp: 'La representación activa el guion correcto: el embarazo ectópico roto hasta que se demuestre lo contrario (capítulo 10).' },
        { paso: 4, caps: '2 y 5', tipo: 'multiple', q: '¿Qué hallazgos aumentan la probabilidad de un ectópico roto?',
          opciones: ['Intolerancia ortostática al incorporarse', 'Dolor en el hombro derecho', 'Taquicardia en una mujer joven y sana', 'La afirmación «no estoy embarazada»'],
          correctas: [0, 1, 2],
          exp: 'El mareo al incorporarse y la taquicardia sugieren pérdida de volumen; el dolor en el hombro, irritación diafragmática por hemoperitoneo. La negación del embarazo no resta.' },
        { paso: 6, caps: '8 y 15', tipo: 'opcion', q: 'En el punto de parada, ¿qué hace con «no estoy embarazada»?',
          opciones: ['Lo registra como dato no fiable: no descarta el embarazo', 'Descarta el embarazo y busca otra causa del síncope', 'Le pide que lo repita delante del compañero como testigo'],
          correcta: 0,
          exp: 'La negación del embarazo no es un dato fiable. Umbral bajo para trasladar con preaviso; en la transferencia se da el diagnóstico de trabajo y se sigue el diagnóstico final.' }
      ]
    },
    {
      titulo: 'Anciana disneica: sin ecografía y en ritmo sinusal',
      intro: 'La mujer de 81 años del caso 1 (disnea nocturna, crepitantes bilaterales, edema de tobillos, PA 176/98 mmHg), pero no hay ecógrafo y el ECG muestra ritmo sinusal. Usted había partido de una probabilidad de insuficiencia cardíaca de alrededor de 45 %.',
      pasos: [
        { paso: 5, caps: '13', tipo: 'opcion', q: '¿Inicia la CPAP?',
          opciones: ['No: sin ecografía el diagnóstico no está confirmado', 'Sí: cerca de 45 % supera el umbral bajo de la CPAP', 'Solo si la SpO2 cae por debajo de 80 % en el traslado'],
          correcta: 1,
          exp: 'Sin fibrilación ni ecografía, la probabilidad queda cerca de la estimación inicial, que ya supera el umbral bajo de una intervención de beneficio grande y daño bajo.' },
        { paso: 5, caps: '13', tipo: 'opcion', q: '¿Y la nitroglicerina?',
          opciones: ['Solo si la PA elevada y los signos de congestión la respaldan', 'Siempre, porque trata el mismo diagnóstico que la CPAP', 'Nunca sin ecografía que confirme las líneas B'],
          correcta: 0,
          exp: 'Lo que cambia es la confianza para las intervenciones de umbral más alto. Antes de administrarla se verifican en voz alta hipotensión, infarto de ventrículo derecho, estenosis aórtica grave e inhibidores de la fosfodiesterasa.' },
        { paso: 5, caps: '13', tipo: 'opcion', q: '¿Y la furosemida?',
          opciones: ['Se administra en la escena para ganar tiempo', 'Se difiere al hospital: umbral alto', 'Se administra si la CPAP no funciona en 5 minutos'],
          correcta: 1,
          exp: 'Beneficio prehospitalario marginal y, en series prehospitalarias, una proporción considerable de quienes la recibieron por sospecha de edema tenía otro diagnóstico.' }
      ]
    },
    {
      titulo: 'Niño febril que juega',
      intro: 'Niño de 4 años con fiebre de 39 °C, activo, que juega, con buena perfusión, sin exantema y con padres tranquilos.',
      pasos: [
        { paso: 3, caps: '3 y 11', tipo: 'opcion', q: '¿Cómo queda la probabilidad de infección grave?',
          opciones: ['Alta: toda fiebre de 39 °C en un niño es grave', 'Baja: la tasa base es baja y las señales de alarma están ausentes', 'Imposible de estimar sin analítica'],
          correcta: 1,
          exp: 'La infección grave es poco frecuente en los niños febriles; lo que la sube son las señales de alarma, y aquí no hay ninguna.' },
        { paso: 5, caps: '13 y 20', tipo: 'opcion', q: '¿Qué decide?',
          opciones: ['Traslado con antibiótico como en el niño con petequias', 'Alta sin instrucciones: no hay señales de alarma', 'Evaluación ambulatoria con instrucciones claras para volver a llamar'],
          correcta: 2,
          exp: 'La decisión cambia porque cambian los datos, no la tasa base.' },
        { paso: 8, caps: '20', tipo: 'multiple', q: '¿Qué señales deben motivar una nueva llamada?',
          opciones: ['Somnolencia', 'Manchas que no desaparecen a la presión', 'Dificultad para respirar', 'Extremidades frías', 'Dolor intenso en las piernas'],
          correctas: [0, 1, 2, 3, 4],
          exp: 'Las cinco. La red de seguridad incluye además qué hacer, dónde y cuándo buscar ayuda y el control previsto (capítulo 20).' }
      ]
    }
  ];

  function turno(el, api) {
    var h = api.h, F = api.fmt;
    var casos = api.barajar(ESCENARIOS).slice(0, 3);
    var ci = 0, si = 0, puntos = 0, total = 0, porCaso = [];

    function tira(paso) {
      var d = h('div', { style: 'display:flex;flex-wrap:wrap;gap:4px;margin:8px 0 10px', 'aria-label': 'Ciclo de decisión, paso actual: ' + CICLO[paso] });
      CICLO.forEach(function (p, k) {
        d.appendChild(h('span', { style: 'font-size:11.5px;padding:3px 8px;border-radius:999px;border:1px solid var(--linea);' +
          (k === paso ? 'background:var(--tinta);color:var(--fondo);border-color:var(--tinta);font-weight:700' : 'color:var(--gris)') }, (k + 1) + '. ' + p));
      });
      return d;
    }

    function mostrar() {
      el.innerHTML = '';
      if (ci >= casos.length) {
        var nota = total ? puntos / total : 0;
        var lista = h('ul', null, porCaso.map(function (c) { return h('li', null, c.t + ': ' + F(c.p, c.p % 1 ? 1 : 0) + ' de ' + c.n); }));
        el.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : 'info') }, h('b', null, 'Turno terminado.'), lista,
          h('div', null, 'Cada vez que repita la actividad recibirá otra combinación de casos.')));
        return api.fin(nota, F(puntos, puntos % 1 ? 1 : 0) + ' de ' + total + ' decisiones acertadas en 3 casos', true);
      }
      var esc = casos[ci], st = esc.pasos[si];
      if (si === 0) porCaso[ci] = { t: esc.titulo, p: 0, n: esc.pasos.length };
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Caso ' + (ci + 1) + ' de ' + casos.length + ' · decisión ' + (si + 1) + ' de ' + esc.pasos.length));
      el.appendChild(h('h3', { style: 'margin:4px 0' }, esc.titulo));
      el.appendChild(h('div', { class: 'caja escena', style: 'margin:8px 0', html: esc.intro }));
      el.appendChild(tira(st.paso));
      el.appendChild(h('div', { class: 'enunciado', html: st.q }));
      var zona = h('div'), fbx = h('div');
      el.appendChild(zona); el.appendChild(fbx);

      function cerrar(nota, html) {
        puntos += nota; total++; porCaso[ci].p += nota;
        var cls = nota === 1 ? 'bien' : nota >= 0.6 ? 'info' : 'mal';
        fbx.appendChild(h('div', { class: 'fb ' + cls, html: html + ' <span class="pregunta-n">Integra los capítulos ' + st.caps + '.</span>' }));
        var ultimo = si + 1 >= esc.pasos.length;
        fbx.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () {
          if (ultimo) { ci++; si = 0; } else si++;
          mostrar();
        } }, ultimo ? (ci + 1 < casos.length ? 'Siguiente caso' : 'Ver resultado del turno') : 'Siguiente decisión')));
      }

      if (st.tipo === 'opcion') {
        var orden = api.barajar(st.opciones.map(function (_, k) { return k; }));
        var bots = [];
        orden.forEach(function (k) {
          var b = h('button', { class: 'opcion', html: st.opciones[k], onclick: function () {
            bots.forEach(function (x) { x.b.disabled = true; if (x.k === st.correcta) x.b.classList.add('bien'); });
            var ok = k === st.correcta;
            if (!ok) b.classList.add('mal');
            cerrar(ok ? 1 : 0, (ok ? '<b>Decisión acertada.</b> ' : '<b>No.</b> ') + st.exp);
          } });
          bots.push({ b: b, k: k }); zona.appendChild(b);
        });
      } else if (st.tipo === 'multiple') {
        var marcadas = {};
        var bm = st.opciones.map(function (o, k) {
          var b = h('button', { class: 'opcion', html: '☐ ' + o, onclick: function () {
            marcadas[k] = !marcadas[k];
            b.classList.toggle('sel', marcadas[k]);
            b.innerHTML = (marcadas[k] ? '☑ ' : '☐ ') + o;
          } });
          zona.appendChild(b); return b;
        });
        var conf = h('button', { class: 'btn', onclick: function () {
          conf.disabled = true;
          var bien = 0;
          bm.forEach(function (b, k) {
            b.disabled = true;
            var debe = st.correctas.indexOf(k) >= 0, esta = !!marcadas[k];
            if (debe === esta) bien++;
            if (debe) b.classList.add('bien'); else if (esta) b.classList.add('mal');
          });
          var n = bien / st.opciones.length;
          cerrar(n, '<b>' + bien + ' de ' + st.opciones.length + ' elecciones correctas.</b> ' + st.exp);
        } }, 'Confirmar');
        zona.appendChild(h('div', { class: 'acciones' }, conf));
      } else {
        var inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Respuesta', placeholder: 'Respuesta' });
        var bt = h('button', { class: 'btn', onclick: function () {
          var v = api.num(inp.value); if (isNaN(v)) { inp.focus(); return; }
          bt.disabled = true; inp.disabled = true;
          var ok = Math.abs(v - st.respuesta) <= st.tolerancia;
          cerrar(ok ? 1 : 0, (ok ? '<b>Correcto.</b> ' : '<b>Revise el cálculo.</b> Respuesta: ' + F(st.respuesta, st.decimales || 0) + ' ' + (st.unidad || '') + '. ') + st.exp);
        } }, 'Comprobar');
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !bt.disabled) bt.click(); });
        zona.appendChild(h('div', { class: 'fila' }, inp, h('span', null, st.unidad || ''), bt));
      }
    }
    mostrar();
  }

  TDC.registrar({
    numero: 17, parte: 'V',
    titulo: 'Síntesis operativa: casos integradores',
    mision: 'Recorra el ciclo completo de decisión: probabilidad, umbral, punto de parada, acción y transferencia.',
    objetivo: 'Integrar en una secuencia única los componentes probabilísticos, cognitivos y de seguridad para tomar y justificar decisiones completas.',
    escena: 'Turno nocturno en una unidad de soporte vital avanzado. En pocas horas atenderá a una anciana que se ahoga, a un niño febril que <b>«no parece él»</b> y a un paro cardíaco en una sala de estar. En cada llamada recorrerá el mismo ciclo: hipótesis, probabilidad, umbral, punto de parada, acción, reevaluación y transferencia.',
    actividades: [
      {
        tipo: 'caso', titulo: 'La anciana que se ahoga de noche',
        presentacion: '<b>03:30. Despacho:</b> «dificultad respiratoria». Mujer de 81 años, hipertensa, con fibrilación auricular y exfumadora. La familia la describe como «enferma de EPOC», aunque nunca se hizo una espirometría. Tres días de resfriado.',
        fases: [
          {
            titulo: 'Llegada: la etiqueta de la familia',
            monitor: { FR: '32 rpm', SpO2: '84 % aire', FC: '124 irreg.', PA: '176/98', T: '37,9 °C' },
            datos: 'Sentada al borde de la cama, no tolera acostarse. Crepitantes bilaterales hasta campos medios, sibilancias leves y edema de tobillos.',
            decision: { pregunta: '¿Cómo registra la etiqueta «EPOC»?',
              opciones: ['Como diagnóstico de base que orienta el tratamiento', 'Como dato no verificado, con el diferencial abierto', 'La descarto: la familia no es una fuente fiable'],
              correcta: 1, explicacion: 'Sin espirometría, la EPOC es una etiqueta heredada: se registra, pero no ancla el razonamiento (capítulo 8). Descartarla también es un error: es un dato más.' },
            experto: '“Anciana con insuficiencia respiratoria hipoxémica aguda nocturna, hipertensa, en fibrilación auricular rápida y con febrícula. La EPOC es referida, no confirmada.”'
          },
          {
            titulo: 'Diferencial',
            decision: { tipo: 'multiple', pregunta: '¿Qué hipótesis mantiene abiertas?',
              opciones: ['Insuficiencia cardíaca aguda con edema pulmonar', 'Neumonía', 'Exacerbación de EPOC', 'Tromboembolismo pulmonar', 'Síndrome coronario agudo como desencadenante', 'Crisis de ansiedad'],
              correctas: [0, 1, 2, 3, 4],
              explicacion: 'Las cinco primeras forman el diferencial del caso. Una crisis de ansiedad no explica una SpO2 de 84 %.' }
          },
          {
            titulo: 'El ECG',
            datos: 'ECG: fibrilación auricular rápida sin elevación del ST. Usted parte de una probabilidad de insuficiencia cardíaca de alrededor de 45 %, la estimación de partida en un anciano con disnea aguda. La fibrilación auricular tiene un LR+ de 3,8.',
            decision: { tipo: 'probabilidad', pregunta: '¿Qué probabilidad de insuficiencia cardíaca estima ahora?', rango: [70, 82],
              explicacion: 'Odds 0,82 × 3,8 = 3,1 → 76 % (capítulo 5).' }
          },
          {
            titulo: 'Los crepitantes',
            datos: 'Su compañero propone multiplicar también el LR de los crepitantes (2,8).',
            decision: { pregunta: '¿Qué hace?',
              opciones: ['Lo multiplico: es un hallazgo de otro momento de la exploración', 'No lo multiplico: comparte mecanismo con la congestión y la neumonía también lo produce', 'Lo uso en lugar del ECG, porque es más directo'],
              correcta: 1, explicacion: 'Multiplicarlo sería doble conteo (capítulo 5). Los crepitantes no separan bien la insuficiencia cardíaca de la neumonía.' }
          },
          {
            titulo: 'Ecografía pulmonar',
            datos: 'Líneas B bilaterales difusas. LR+ de la ecografía pulmonar para insuficiencia cardíaca: 8,8.',
            decision: { pregunta: '¿Dónde queda la probabilidad?',
              opciones: ['Alrededor de 85 %', 'Por encima de 95 %', 'Igual: la decisión ya estaba tomada'],
              correcta: 1, explicacion: 'Odds 3,1 × 8,8 = 27 → 96 %. Imagen y prueba eléctrica son dominios distintos, por eso se encadenan. El protocolo BLUE clasificó correctamente la causa de la insuficiencia respiratoria aguda en 90,5 % de los pacientes.' },
            experto: '“Con la fibrilación estaba en 76 %; con las líneas B, por encima de 95 %.”'
          },
          {
            titulo: 'Punto de parada',
            datos: 'Antes de tratar, la tripulación hace PAUSA en voz alta.',
            decision: { pregunta: '¿Qué dato no encaja con un edema pulmonar puro?',
              opciones: ['La PA de 176/98 mmHg', 'La febrícula tras tres días de resfriado', 'El edema de tobillos'],
              correcta: 1, explicacion: 'La febrícula sugiere que una neumonía desencadenó la descompensación. Ambos diagnósticos pueden coexistir: no es uno u otro (capítulo 15).' }
          },
          {
            titulo: 'Decisiones por umbral',
            decision: { tipo: 'multiple', pregunta: '¿Qué hace en la escena? Marque todas las correctas.',
              opciones: ['Iniciar CPAP', 'Nitroglicerina tras verificar en voz alta sus contraindicaciones', 'Furosemida intravenosa antes de salir', 'Esperar a descartar la neumonía antes de tratar'],
              correctas: [0, 1],
              explicacion: 'El umbral pertenece a la intervención, no al diagnóstico. CPAP: reduce la mortalidad hospitalaria (RR 0,65) y la intubación (RR 0,49) con daño bajo; umbral bajo. Nitroglicerina: umbral moderado, con PA alta y sin hipotensión, infarto de ventrículo derecho, estenosis aórtica grave ni inhibidores de la fosfodiesterasa. Furosemida: beneficio marginal y frecuentes diagnósticos erróneos; umbral alto, se difiere (capítulo 13).' },
            experto: '“Estamos por encima del umbral: CPAP ya. Verifico contraindicaciones y doy nitroglicerina. La furosemida, en el hospital.”'
          },
          {
            titulo: 'Variante: la presión cae',
            monitor: { PA: '86/50', Piel: 'fría' },
            datos: 'Imagine que la PA fuera de 86/50 mmHg con piel fría.',
            decision: { pregunta: '¿Qué cambia?',
              opciones: ['Nada: mismo diagnóstico, mismo tratamiento', 'Nitroglicerina contraindicada, CPAP con cautela y destino con soporte hemodinámico', 'Se retira la CPAP y se administra furosemida'],
              correcta: 1, explicacion: 'El cuadro pasa a shock cardiogénico. La CPAP exige cautela por su efecto sobre el retorno venoso. El diagnóstico sería el mismo; los umbrales, no.' }
          },
          {
            titulo: 'Preaviso y transferencia',
            datos: 'Destino: hospital con cuidados intensivos.',
            decision: { pregunta: '¿Qué diagnóstico de trabajo transmite?',
              opciones: ['Exacerbación de EPOC con sobreinfección respiratoria', 'Disnea en estudio, sin diagnóstico por ahora', 'Edema pulmonar hipertensivo en FA rápida, probable desencadenante infeccioso; EPOC no confirmada'],
              correcta: 2, explicacion: 'Se transmiten el diagnóstico de trabajo, el desencadenante probable y la advertencia sobre la etiqueta no verificada, para que no se herede en el hospital.' }
          }
        ],
        cierre: 'Probabilidad explícita, ponderación sin doble conteo, POCUS como prueba bayesiana, umbrales distintos para cada intervención y control de una etiqueta heredada. Sin ecografía, la fibrilación auricular sola deja la probabilidad cerca de 76 %, por encima del umbral bajo de la CPAP: la ecografía refuerza la decisión, pero su ausencia no la impide.'
      },
      {
        tipo: 'caso', titulo: 'El niño que «no parece él»',
        presentacion: '<b>20:40.</b> Niño de 4 años con fiebre de 39,2 °C desde la mañana, vómitos y dolor en las piernas: no quiere caminar. La madre insiste: «no parece él».',
        fases: [
          {
            titulo: 'Primera impresión',
            monitor: { FC: '168 lpm', FR: '36 rpm', SpO2: '95 %', PA: '88/50', Glucemia: '74 mg/dL' },
            datos: 'Somnoliento, pero despierta al estímulo. Manos y pies fríos, relleno capilar central de 4 segundos.',
            decision: { pregunta: 'Su compañero comenta: «otro cuadro viral; esta semana llevamos cinco». ¿Qué sesgo reconoce?',
              opciones: ['Costo hundido: ya invirtieron tiempo en esta llamada', 'Disponibilidad: los muchos niños febriles leves pesan más que este niño', 'Confirmación de la impresión de la madre'],
              correcta: 1, explicacion: 'La mayoría de los niños febriles no tiene una infección grave, y eso vuelve tentador el «otro viral» (capítulo 8). Por eso son imprescindibles las señales de alarma.' }
          },
          {
            titulo: 'La preocupación de la madre',
            datos: 'Parta de una probabilidad de infección grave de 2 %. La sensación de que algo va mal tuvo un LR+ de 25,5.',
            decision: { tipo: 'probabilidad', pregunta: '¿Qué probabilidad deja esa sensación?', rango: [28, 40],
              explicacion: 'Odds 0,02/0,98 = 0,020; × 25,5 = 0,52 → 34 %. La intuición se usa como alarma, no como descarte.' },
            experto: '“Tasa base baja, pero la madre y yo notamos lo mismo: algo va mal. Eso solo ya me lleva a un tercio.”'
          },
          {
            titulo: 'Desvestir por completo',
            datos: 'Al desvestirlo por completo aparecen dos petequias en el abdomen que no desaparecen a la presión.',
            decision: { tipo: 'multiple', pregunta: '¿Qué señales de alarma de mayor peso presenta este niño?',
              opciones: ['Preocupación de los padres', 'Mala perfusión periférica', 'Taquipnea', 'Exantema petequial', 'Glucemia de 74 mg/dL', 'SpO2 de 95 %'],
              correctas: [0, 1, 2, 3],
              explicacion: 'Junto con la intuición del clínico de que algo va mal, figuran entre las señales de mayor peso. La exploración completa reveló el dato clave.' }
          },
          {
            titulo: 'La fisiología',
            decision: { pregunta: 'FC 168, relleno capilar de 4 s, extremidades frías y PA 88/50 mmHg. ¿Cómo lo interpreta?',
              opciones: ['Sin shock: la PA se mantiene', 'Shock compensado', 'Deshidratación leve por los vómitos'],
              correcta: 1, explicacion: 'En el niño la PA se mantiene hasta fases tardías. En la enfermedad meningocócica, dolor de piernas, extremidades frías y color anormal de la piel aparecen hacia la hora 8; el exantema hemorrágico, la rigidez de nuca y la alteración de la conciencia, entre las horas 13 y 22.' }
          },
          {
            titulo: 'Umbral terapéutico',
            datos: 'El traslado al centro con capacidad pediátrica no es inmediato.',
            decision: { pregunta: '¿Qué hace?',
              opciones: ['Antibiótico según el protocolo local, bolos de 10 a 20 mL/kg reevaluando tras cada uno y traslado', 'Esperar al hospital para el antibiótico: no hay ensayos que lo respalden antes del ingreso', 'Bolos rápidos repetidos sin reevaluar y traslado'],
              correcta: 0, explicacion: 'Beneficio grande y daño pequeño: umbral bajo. La falta de ensayos aleatorizados no invierte el balance esperado. Sin acceso a cuidados intensivos, los bolos aumentaron la mortalidad en un ensayo africano: prudencia y reevaluación estrecha.' },
            experto: '“Sospecha de sepsis meningocócica con shock compensado. Antibiótico ahora, bolo y reevalúo. Preaviso pediátrico.”'
          },
          {
            titulo: 'Hablar con los padres',
            decision: { pregunta: '¿Qué le dice a la madre?',
              opciones: ['«Tranquila, seguro es un virus; lo llevamos solo por precaución.»', '«Puede ser una infección grave. Le damos un antibiótico ahora y lo llevamos a un hospital de niños. Hizo bien en llamar.»', '«No se preocupe, nosotros nos encargamos; espere afuera, por favor.»'],
              correcta: 1, explicacion: 'Se informa con claridad y se valida la preocupación de la madre, que fue uno de los datos decisivos.' }
          },
          {
            titulo: 'Variante para practicar',
            datos: 'Otro niño de 4 años con 39 °C, activo, que juega, con buena perfusión, sin exantema y con padres tranquilos.',
            decision: { pregunta: '¿Qué decide?',
              opciones: ['Traslado con antibiótico igual que el anterior', 'Evaluación ambulatoria con señales claras para volver a llamar', 'Alta sin instrucciones, porque no hay alarma'],
              correcta: 1, explicacion: 'Sin señales de alarma, la probabilidad es baja. Se instruye volver a llamar ante somnolencia, manchas que no desaparecen a la presión, dificultad para respirar, extremidades frías o dolor intenso en las piernas.' }
          }
        ],
        cierre: 'Tasa base baja contrarrestada por señales de alarma de peso, intuición usada como alarma y no como descarte, exploración completa que revela el dato clave y umbral terapéutico bajo con incertidumbre explícita sobre la evidencia. Los paramédicos reconocen poca experiencia con niños: el umbral de derivación debe ser bajo.'
      },
      {
        tipo: 'personalizado', titulo: 'Turno integrador: casos al azar', render: turno,
        instrucciones: 'Cada turno le asigna 3 casos al azar. En cada decisión, la tira superior marca en qué paso del ciclo está y la retroalimentación indica qué capítulos integra. Repita la actividad para practicar con otros casos.'
      },
      {
        tipo: 'ordenar', titulo: 'El ciclo de decisión en la escena',
        instrucciones: 'Ordene los pasos del ciclo tal como se recorren en cada atención.',
        pasos: [
          'Despacho como hipótesis: ¿qué etiqueta traigo y qué otras causas son posibles?',
          'Escena y evaluación primaria: ¿hay una amenaza inmediata?',
          'Representación del problema: ¿cómo resumo el caso en una frase?',
          'Probabilidad previa: ¿qué probabilidad tiene cada hipótesis importante?',
          'Hallazgos y pruebas: ¿cuánto pesa cada dato y es fiable?',
          'Umbral: ¿la probabilidad justifica actuar, probar o esperar?',
          'Punto de parada: ¿qué puede estar mal en mi razonamiento?',
          'Reevaluación: ¿hacia dónde va el paciente?',
          'Transferencia y retroalimentación: ¿qué transmito y cómo sabré si acerté?'
        ],
        explicacion: 'El ciclo se recorre varias veces en cada atención: cada reevaluación puede cambiar la representación del problema y obliga a recalcular la probabilidad. No alarga la atención: ordena el tiempo que ya se usa.'
      },
      {
        tipo: 'clasificar', titulo: 'El umbral pertenece a la intervención',
        instrucciones: 'Clasifique cada intervención según su umbral de acción en la escena (capítulo 13).',
        categorias: ['Umbral bajo: actuar', 'Umbral moderado: verificar antes', 'Umbral alto: diferir'],
        items: [
          { texto: 'CPAP en sospecha de edema pulmonar cardiogénico', cat: 0, porque: 'Beneficio grande demostrado y daño bajo si el diagnóstico es otro.' },
          { texto: 'Nitroglicerina en edema pulmonar hipertensivo', cat: 1, porque: 'Alivio rápido, pero hipotensión si hay infarto de ventrículo derecho, estenosis aórtica o inhibidores de la fosfodiesterasa.' },
          { texto: 'Furosemida en sospecha de edema pulmonar', cat: 2, porque: 'Beneficio prehospitalario marginal y frecuentes diagnósticos erróneos.' },
          { texto: 'Antibiótico en sospecha de sepsis meningocócica con traslado no inmediato', cat: 0, porque: 'Beneficio grande y daño pequeño.' },
          { texto: 'Antibiótico en sospecha de sepsis sin shock, con traslado corto', cat: 2, porque: 'En 2.672 pacientes se administraron 26 minutos antes sin cambio en la mortalidad a 28 días. Se priorizan reconocimiento, preaviso y traslado.' },
          { texto: 'Descompresión torácica con hipotensión o hipoxemia progresivas', cat: 0, porque: 'Umbral muy bajo: descomprimir ante sospecha fundada.' },
          { texto: 'Ácido tranexámico en trauma con hemorragia dentro de las 3 horas', cat: 0, porque: 'Umbral cercano a 8 % en la primera hora. Después de 3 horas, no se administra.' },
          { texto: 'Fibrinólisis en infarto con elevación del ST sin angioplastia posible a tiempo', cat: 1, porque: 'ECG diagnóstico y lista de contraindicaciones verificada antes de administrar.' }
        ]
      },
      {
        tipo: 'numero', titulo: 'Los números de los casos',
        instrucciones: 'Calcule con odds cuando corresponda. Escriba solo el número.',
        problemas: [
          { enunciado: 'Anciana disneica con probabilidad previa de insuficiencia cardíaca de 45 %. Fibrilación auricular en el ECG (LR+ 3,8). ¿Probabilidad posterior?', respuesta: 76, tolerancia: 2, unidad: '%', solucion: 'Odds 0,45/0,55 = 0,82; × 3,8 = 3,1; 3,1/4,1 = 76 %.' },
          { enunciado: 'A la misma paciente se le suman líneas B bilaterales (LR+ 8,8). ¿Probabilidad posterior?', respuesta: 96, tolerancia: 1.5, unidad: '%', solucion: 'Odds 3,1 × 8,8 = 27,4; 27,4/28,4 = 96 %.' },
          { enunciado: 'Niño febril con probabilidad previa de infección grave de 2 %. Sensación de que algo va mal (LR+ 25,5). ¿Probabilidad posterior?', respuesta: 34, tolerancia: 2, unidad: '%', solucion: 'Odds 0,020 × 25,5 = 0,52; 0,52/1,52 = 34 %.' },
          { enunciado: 'Mujer de 70 años con disnea súbita, FC 120, pierna izquierda edematosa desde hace 3 días y tromboembolismo como diagnóstico más probable. ¿Puntos de Wells?', respuesta: 7.5, tolerancia: 0.01, decimales: 1, unidad: 'puntos', solucion: '3 + 1,5 + 3 = 7,5: tromboembolismo probable.' },
          { enunciado: 'Mujer de 45 años con FC de 108, cirugía de rodilla hace dos semanas, sin signos de trombosis venosa y con una alternativa igual de probable. ¿Puntos de Wells?', respuesta: 3, tolerancia: 0.01, unidad: 'puntos', solucion: 'FC mayor de 100: 1,5; cirugía reciente: 1,5. Total 3: improbable en el esquema de dos niveles, pero no cumple PERC (capítulo 7).' },
          { enunciado: 'En la validación de la regla de terminación, la regla recomendó terminar en 776 pacientes y 4 sobrevivieron al alta. ¿Qué porcentaje es (un decimal)?', respuesta: 0.5, tolerancia: 0.06, decimales: 1, unidad: '%', solucion: '4/776 = 0,5 %.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Preguntas de integración',
        preguntas: [
          { p: 'En el caso de la anciana, ¿por qué se inicia la CPAP y se difiere la furosemida si ambas tratan el mismo diagnóstico?', opciones: ['Porque la furosemida está contraindicada en la fibrilación auricular', 'Porque sus umbrales son distintos: el umbral pertenece a la intervención', 'Porque la CPAP confirma el diagnóstico y la furosemida no lo hace'], correcta: 1, explicacion: 'La CPAP tiene beneficio grande y daño bajo si el diagnóstico es otro; la furosemida aporta poco en la escena y puede dañar si el diagnóstico es erróneo.' },
          { p: 'Misma paciente, sin ecografía y con ritmo sinusal. ¿Cambia la decisión de iniciar la CPAP?', opciones: ['No: cerca de 45 % sigue por encima de su umbral bajo', 'Sí: sin fibrilación ni ecografía no se justifica', 'Sí: hay que esperar a la radiografía del hospital'], correcta: 0, explicacion: 'Cambia la confianza para intervenciones de umbral más alto, como la nitroglicerina, no la CPAP.' },
          { p: 'Recorriendo el ciclo con la mujer de 26 años con síncope y dolor abdominal, ¿en qué paso se trata «no estoy embarazada» como dato no fiable?', opciones: ['Despacho como hipótesis', 'Punto de parada', 'Transferencia'], correcta: 1, explicacion: 'El punto de parada pregunta qué puede estar mal en el razonamiento. El umbral para trasladar con preaviso es bajo.' },
          { p: 'En el paro de la sala de estar, ¿cuál de estos datos habría impedido aplicar la regla de terminación?', opciones: ['Capnografía de 8 mmHg a los 20 minutos', 'Edad de 67 años', 'Sospecha de hipotermia'], correcta: 2, explicacion: 'Hipotermia, ahogamiento, embarazo, intoxicación, electrocución, FV persistente, paro presenciado por el equipo o recuperación transitoria de la circulación excluyen la regla.' },
          { p: 'La capnografía es de 8 mmHg a los 20 minutos de reanimación. ¿Basta para terminar?', opciones: ['Sí: por debajo de 10 mmHg todos murieron en una serie clásica', 'No: las guías desaconsejan usarla como criterio aislado', 'Sí, si además el ritmo es asistolia'], correcta: 1, explicacion: 'Es un dato de peso, pero se integra con la regla, la ecografía, las causas reversibles y los valores del paciente.' },
          { p: '¿Cómo se cierra un análisis posterior de 10 minutos tras un caso crítico?', opciones: ['Asignando la responsabilidad del error a una persona', 'Preguntando cómo está cada miembro del equipo', 'Con la firma del informe de incidente por el líder'], correcta: 1, explicacion: 'Antes: cronología de hechos, diagnóstico de trabajo con su probabilidad en cada momento, sesgos y emociones, condiciones del sistema, y qué se hará distinto y cómo se conocerá el desenlace.' },
          { p: '¿Qué relación tiene el ciclo de decisión con el protocolo?', opciones: ['El ciclo reemplaza al protocolo en los casos complejos', 'Son la misma herramienta con distinto nombre', 'El ciclo define el problema y decide cuándo aplica el protocolo'], correcta: 2, explicacion: 'El protocolo dice qué hacer una vez definido el problema. Quien domina el ciclo reconoce cuándo el paciente no pertenece al protocolo.' },
          { p: '¿Qué frase marca en voz alta el paso de umbral?', opciones: ['«Mi hipótesis principal es…, y la peligrosa que no descarto es…»', '«Con este dato, la probabilidad sube o baja a…»', '«Estamos por encima del umbral: hacemos…»'], correcta: 2, explicacion: 'Las tres frases de transición sincronizan a la tripulación en los cambios de fase del ciclo.' },
          { p: 'En una llamada típica, ¿cuándo se construyen la representación del problema y la probabilidad previa?', opciones: ['Entre el minuto 2 y el 5, mientras se completan los signos vitales', 'En los primeros 60 a 90 segundos, antes de la evaluación primaria', 'Al final, cuando ya están todas las pruebas disponibles'], correcta: 0, explicacion: 'Los primeros 60 a 90 segundos son para la escena y la evaluación primaria; las pruebas y la decisión de destino ocupan los minutos siguientes.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Los 9 pasos del ciclo de decisión', reverso: 'Despacho como hipótesis · escena y primaria · representación · probabilidad previa · hallazgos y pruebas · umbral · punto de parada · reevaluación · transferencia y retroalimentación' },
          { frente: 'Tres frases de transición', reverso: '«Mi hipótesis principal es…, y la peligrosa que no descarto es…» · «Con este dato, la probabilidad sube o baja a…» · «Estamos por encima del umbral: hacemos…»' },
          { frente: 'CPAP, nitroglicerina y furosemida en el edema pulmonar', reverso: 'Umbral bajo: iniciar · umbral moderado: verificar contraindicaciones · umbral alto: diferir al hospital' },
          { frente: 'Contraindicaciones de la nitroglicerina que se verifican en voz alta', reverso: 'Hipotensión, infarto de ventrículo derecho, estenosis aórtica grave e inhibidores de la fosfodiesterasa' },
          { frente: 'Regla de terminación de soporte vital básico', reverso: 'Paro no presenciado por el equipo, sin descargas y sin recuperación de la circulación. La versión avanzada añade: sin testigos y sin reanimación por testigos.' },
          { frente: 'Señales de alarma de mayor peso en el niño febril', reverso: 'Preocupación de los padres, intuición del clínico, mala perfusión periférica, taquipnea y exantema petequial' },
          { frente: 'Líquidos en el niño con sepsis', reverso: 'Bolos de 10 a 20 mL/kg con reevaluación tras cada bolo; prudencia extrema sin cuidados intensivos' },
          { frente: 'Análisis posterior de 10 minutos', reverso: 'Cronología · diagnóstico y probabilidad en cada momento · sesgos y emociones · condiciones del sistema · qué haremos distinto y cómo conoceremos el desenlace · ¿cómo está cada uno?' }
        ]
      }
    ]
  });
})();
