/* Capítulo 20. Del juicio clínico a la transferencia del cuidado */
(function () {
  var LETRAS = [
    ['I', 'Identificación'], ['M', 'Mecanismo o motivo'], ['I', 'Información clínica o lesiones'], ['S', 'Signos vitales y tendencia'],
    ['T', 'Tratamiento y respuesta'], ['A', 'Alergias'], ['M', 'Medicación'], ['B', 'Antecedentes'], ['O', 'Otros datos']
  ];

  /* Fragmentos de transferencia. En cada letra, el primero es el correcto; "fallo" explica por qué falla cada distractor. */
  var ENTREGAS = [
    {
      titulo: 'Infarto inferior a 150 km de la hemodinamia',
      resumen: 'Mujer de 63 años con diabetes tipo 2, despacho «malestar general». Pesadez epigástrica desde que barrió el patio. ECG con elevación del ST en II, III y aVF, descenso en I y aVL y elevación en V4R. Fibrinólisis tras consulta a la dirección médica; sin nitratos. Su hija la acompaña.',
      slots: [
        [{ t: 'Rosa, 63 años.' }, { t: 'La diabética de la parroquia.', fallo: 'Etiqueta en lugar de identificación.' }, { t: 'Paciente con malestar general.', fallo: 'Repite la etiqueta del despacho.' }],
        [{ t: 'Decaída y con náuseas desde la mañana; pesadez epigástrica desde que barrió el patio.' }, { t: 'Malestar general, probable gastroenteritis.', fallo: 'Transmite una etiqueta no verificada.' }, { t: 'Se queja de todo desde la mañana, algo exagerada.', fallo: 'Lenguaje con juicio.' }],
        [{ t: 'ECG: ST elevado en II, III y aVF, descenso en I y aVL, ST elevado en V4R. Sin dolor desgarrante, sin diferencia de presión entre brazos ni déficit de pulsos.' }, { t: 'Infarto inferior confirmado y disección descartada.', fallo: 'Mezcla interpretación con hallazgo y no da los datos que la sostienen.' }, { t: 'ECG alterado, ya lo verán ustedes.', fallo: 'Omite el hallazgo crítico.' }],
        [{ t: 'Al contacto: FR 22, SpO2 94 %, FC 52, PA 94/60, alerta, glucemia 212. Última toma: FC 56, PA 98/62.' }, { t: 'Signos vitales estables.', fallo: 'Sin valores ni tendencia, y la paciente no estaba estable.' }, { t: 'FC 52, PA 94/60 y lactato normal.', fallo: 'Incluye un valor que no se midió.' }],
        [{ t: 'Fibrinólisis a las 10:40 tras consulta a la dirección médica y lista de contraindicaciones verificada; sin nitratos por afectación del ventrículo derecho.' }, { t: 'El tratamiento habitual del infarto.', fallo: 'No dice qué se hizo, a qué hora ni con qué respuesta.' }, { t: 'Nitroglicerina sublingual y fibrinólisis.', fallo: 'Registra un tratamiento que no se dio, y que estaba contraindicado.' }],
        [{ t: 'Sin alergias conocidas, según la paciente y su hija.' }, { t: 'Sin alergias, supongo.', fallo: 'Suposición presentada como dato.' }, { t: 'Pesadez epigástrica.', fallo: 'Dato en la letra equivocada.' }],
        [{ t: 'Antidiabéticos orales, última dosis esta mañana.' }, { t: 'Lo de siempre.', fallo: 'No informa nada.' }, { t: 'Fibrinólisis a las 10:40.', fallo: 'Dato en la letra equivocada: es tratamiento.' }],
        [{ t: 'Diabetes tipo 2.' }, { t: 'Diabética descuidada.', fallo: 'Lenguaje con juicio.' }, { t: 'Sin antecedentes.', fallo: 'Falso: tiene diabetes.' }],
        [{ t: 'Vive en una parroquia rural; su hija la acompaña. Pendiente: ECG a los 60 a 90 minutos de la fibrinólisis.' }, { t: 'Nada más.', fallo: 'Omite el contexto y lo pendiente.' }, { t: 'La hija es muy ansiosa y exagera.', fallo: 'Lenguaje con juicio.' }]
      ]
    },
    {
      titulo: 'La caída que fue un síncope',
      resumen: 'Hombre de 67 años. Se le nubló la vista lavando los platos y despertó en el suelo; más de una hora caído. Betabloqueante iniciado hace 10 días. FC 38, PA 102/60 (habitual 150/90). ECG con bloqueo auriculoventricular completo. Pierna derecha acortada y en rotación externa; golpe en la cabeza. Parches de estimulación colocados.',
      slots: [
        [{ t: 'Hernán, 67 años.' }, { t: 'El abuelito de la caída.', fallo: 'Etiqueta en lugar de identificación.' }, { t: 'Paciente de traumatología.', fallo: 'Hereda el encuadre del despacho.' }],
        [{ t: 'Síncope mientras lavaba los platos, con caída posterior; más de una hora en el suelo.' }, { t: 'Caída de su propia altura, mecánica.', fallo: 'Repite la etiqueta del despacho: no fue mecánica.' }, { t: 'Se cayó, como suele pasar a esta edad.', fallo: 'Lenguaje con juicio y sin información.' }],
        [{ t: 'ECG: bloqueo auriculoventricular completo. Pierna derecha acortada y en rotación externa. Golpe en la cabeza. Dos mareos esta semana.' }, { t: 'Fractura de cadera derecha.', fallo: 'Omite el problema que decide el destino: el ritmo.' }, { t: 'Bloqueo causado por el betabloqueante, confirmado.', fallo: 'Presenta una interpretación como hecho.' }],
        [{ t: 'Al contacto: FC 38, PA 102/60 (habitual 150/90 según su esposa), consciente. Última toma: FC 40, PA 100/62.' }, { t: 'FC 38 y PA 102/60, normal para él.', fallo: 'Ignora el basal: está muy por debajo de su presión habitual.' }, { t: 'Signos vitales aceptables para la edad.', fallo: 'Sin valores ni tendencia.' }],
        [{ t: 'Parches de estimulación colocados; inmovilización de la cadera.' }, { t: 'Tratamiento de la fractura.', fallo: 'Omite los parches, la intervención crítica.' }, { t: 'Estimulación sin respuesta.', fallo: 'Registra algo que no ocurrió.' }],
        [{ t: 'Sin alergias conocidas, según su esposa.' }, { t: 'No es alérgico, creo.', fallo: 'Suposición presentada como dato.' }, { t: 'Betabloqueante.', fallo: 'Dato en la letra equivocada.' }],
        [{ t: 'Betabloqueante iniciado hace 10 días; hora de la última dosis según la bolsa de medicamentos.' }, { t: 'Lo de la presión.', fallo: 'Impreciso: omite el fármaco y el inicio reciente.' }, { t: 'Nada importante.', fallo: 'Falso y peligroso: el fármaco es clave.' }],
        [{ t: 'Presión arterial alta en tratamiento.' }, { t: 'Anciano frágil, como siempre.', fallo: 'Lenguaje con juicio.' }, { t: 'Sin antecedentes.', fallo: 'Falso: está en tratamiento para la presión.' }],
        [{ t: 'Vive con su esposa. No verificado: tiempo exacto en el suelo.' }, { t: 'Nada más.', fallo: 'No declara lo que no se verificó.' }, { t: 'La esposa no sabe nada.', fallo: 'Juicio en lugar de hecho.' }]
      ]
    }
  ];

  function transferencia(el, api) {
    var h = api.h;
    var E = ENTREGAS[Math.floor(Math.random() * ENTREGAS.length)];
    var elec = {}, corregido = false;
    el.appendChild(h('h3', { style: 'margin:4px 0' }, E.titulo));
    el.appendChild(h('div', { class: 'caja escena', style: 'margin:8px 0', html: '<span class="rot">Lo que usted sabe del caso</span>' + E.resumen }));
    el.appendChild(h('div', { class: 'enunciado' }, 'Elija un fragmento para cada letra.'));
    var filas = LETRAS.map(function (L, k) {
      var orden = api.barajar([0, 1, 2]);
      var bots = orden.map(function (o) {
        var b = h('button', { class: 'opcion', style: 'font-size:14.5px;padding:8px 12px', onclick: function () {
          if (corregido) return;
          elec[k] = o;
          bots.forEach(function (x) { x.classList.toggle('sel', x === b); });
        } }, E.slots[k][o].t);
        b._o = o; return b;
      });
      var f = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, h('span', { style: 'display:inline-block;min-width:28px;color:var(--rojo);font-family:Montserrat,sans-serif' }, L[0]), L[1]), bots);
      el.appendChild(f); return { f: f, bots: bots };
    });
    var aviso = h('span', { class: 'pregunta-n' }), zona = h('div');
    var bt = h('button', { class: 'btn', onclick: function () {
      if (Object.keys(elec).length < LETRAS.length) { aviso.textContent = 'Complete las nueve letras.'; return; }
      corregido = true; bt.disabled = true; aviso.textContent = '';
      var bien = 0, fallos = [];
      filas.forEach(function (F, k) {
        var ok = elec[k] === 0; if (ok) bien++;
        F.f.classList.add(ok ? 'bien' : 'mal');
        F.bots.forEach(function (b) { b.disabled = true; if (b._o === 0) b.classList.add('bien'); else if (b._o === elec[k]) b.classList.add('mal'); });
        if (!ok) F.f.appendChild(h('div', { class: 'porque' }, h('b', null, 'Falla: '), E.slots[k][elec[k]].fallo));
      });
      var texto = LETRAS.map(function (L, k) { return L[0] + ': ' + E.slots[k][0].t; }).join(' ');
      zona.appendChild(h('div', { class: 'fb ' + (bien === 9 ? 'bien' : 'info') }, h('b', null, bien + ' de 9 letras correctas. '), 'Entrega modelo: ', h('i', null, texto)));
      zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:12px' }, 'Terminó la entrega verbal. ¿Qué hace ahora?'));
      var ops = [
        { t: 'Me retiro: la entrega estructurada ya transmitió todo', ok: false },
        { t: 'Confirmo que quien recibe repitió los datos críticos y dejo el registro escrito', ok: true },
        { t: 'Repito toda la entrega una segunda vez, más despacio', ok: false }
      ];
      var bo = [];
      api.barajar(ops).forEach(function (o) {
        var b = h('button', { class: 'opcion', onclick: function () {
          bo.forEach(function (x) { x.b.disabled = true; if (x.o.ok) x.b.classList.add('bien'); });
          if (!o.ok) b.classList.add('mal');
          zona.appendChild(h('div', { class: 'fb ' + (o.ok ? 'bien' : 'mal'), html: (o.ok ? '<b>Correcto.</b> ' : '<b>No.</b> ') + 'Aun con formato estructurado, el personal receptor retuvo con exactitud solo 49,2 % de la información verbal. La entrega se hace sin mover al paciente, en su presencia, separando hallazgos de interpretaciones y declarando lo no verificado.' }));
          api.fin((bien + (o.ok ? 1 : 0)) / 10, bien + ' de 9 letras correctas' + (o.ok ? ' y cierre correcto' : ' y cierre incorrecto'), true);
        } }, o.t);
        bo.push({ b: b, o: o }); zona.appendChild(b);
      });
    } }, 'Corregir la entrega');
    el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
    el.appendChild(zona);
  }

  /* Rúbrica de 20.9 */
  var DOMINIOS = ['Preparación', 'Escena', 'Evaluación primaria', 'Relación y relato libre', 'Anamnesis dirigida y amplia', 'Signos vitales y complementos', 'Examen físico', 'Síntesis', 'Plan y decisión compartida', 'Reevaluación', 'Transferencia y registro'];
  var CRITICOS = ['Entrar en una escena insegura', 'No reconocer o no tratar una amenaza vital de la evaluación primaria', 'Administrar un fármaco sin verificar indicación, dosis y alergias', 'Decidir no trasladar sin evaluar la capacidad', 'No reevaluar tras un deterioro', 'Omitir en la transferencia una intervención crítica'];
  var VINETAS = [
    {
      titulo: 'Dolor epigástrico en un hombre diabético de 70 años',
      obs: [
        'En el trayecto dice: «seguro es una gastritis». No menciona otra hipótesis. Asigna los roles al llegar.',
        'Verifica la seguridad e informa a la central que hay un paciente y que no necesita recursos.',
        'Evaluación primaria en orden, sin amenazas vitales; reevalúa tras colocar oxígeno.',
        'Se presenta y se sienta a la altura del paciente, pero lo interrumpe a los 5 segundos con preguntas cerradas.',
        'Pregunta por irradiación, disnea y fármacos, y registra «sin dolor torácico» como negativo pertinente. No pregunta por alergias.',
        'Cuenta la FR, verbaliza cada valor, pregunta la presión habitual y obtiene un ECG a los 7 minutos del contacto.',
        'Examen dirigido de tórax y abdomen; explica qué examina y cubre al paciente después.',
        'En voz alta: «lo más probable, un síndrome coronario; lo peligroso que no descarto, una disección; necesita ECG seriado; puede hacer arritmias».',
        'Explica el plan, obtiene el consentimiento y elige un hospital con hemodinamia. No formula ninguna contingencia.',
        'Signos vitales cada 5 minutos; cuando la FC baja a 48, reabre la síntesis.',
        'Entrega con IMIST-AMBO en 70 segundos, lenguaje neutro, horas registradas.'
      ],
      puntos: [1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2], criticos: [],
      nota: 'No administró fármacos, por lo que la omisión de las alergias baja el dominio 5 pero no es criterio crítico. Suma 18: aprueba justo, y los cuatro dominios con 1 se discuten con las preguntas de la práctica reflexiva.'
    },
    {
      titulo: 'Mujer de 24 años con dolor abdominal que quiere quedarse',
      obs: [
        'Verbaliza la hipótesis más probable y la más peligrosa, un embarazo ectópico, y asigna los roles.',
        'Verifica la seguridad, cuenta a los pacientes y confirma que no hacen falta recursos.',
        'Evaluación primaria completa, sin amenazas vitales.',
        'Se presenta, se sienta a su altura y la deja terminar su relato.',
        'Preguntas dirigidas por hipótesis, antecedentes, fármacos, alergias y última menstruación.',
        'Un único juego completo de signos vitales, verbalizados. No hay segunda toma.',
        'Examen abdominal completo y respetuoso.',
        'Enuncia el diagnóstico de trabajo y la alternativa peligrosa, sin describir el riesgo.',
        'La paciente dice que prefiere quedarse; el equipo lo acepta sin evaluar su capacidad. Deja la red de seguridad por escrito.',
        'No hay reevaluación antes de retirarse.',
        'Deja por escrito la evaluación y la red de seguridad; no registra lo que no evaluó.'
      ],
      puntos: [2, 2, 2, 2, 2, 1, 2, 1, 1, 0, 1], criticos: [3],
      nota: 'Suma 16 y, además, decidió no trasladar sin evaluar la capacidad: criterio crítico. No aprueba, sea cual sea el puntaje. Faltaron también el segundo juego de signos vitales y la reevaluación.'
    },
    {
      titulo: 'Motociclista con neumotórax a tensión',
      obs: [
        'Verbaliza las hipótesis de trauma torácico y abdominal y asigna los roles antes de bajar.',
        'Espera al control del tránsito, cuenta a los pacientes y pide una segunda unidad.',
        'Reconoce el neumotórax a tensión y lo descomprime; vuelve a evaluar la respiración y la circulación.',
        'El paciente está confuso; se presenta y explica cada paso aunque no pueda relatar.',
        'Obtiene antecedentes, fármacos y alergias del acompañante.',
        'Signos vitales completos, verbalizados, con capnografía.',
        'Revisión de todo el cuerpo con pulsos, sensibilidad y fuerza en las cuatro extremidades.',
        'Enuncia el diagnóstico de trabajo, la hemorragia como alternativa peligrosa, los problemas y el riesgo.',
        'Justifica la descompresión, define el centro de trauma con preaviso y formula «si reaparece la hipotensión, redescomprimimos».',
        'Reevalúa cada 5 minutos y tras cada intervención.',
        'Entrega ordenada y con lenguaje neutro, pero no menciona la descompresión.'
      ],
      puntos: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], criticos: [5],
      nota: 'Suma 21 de 22, pero omitió en la transferencia una intervención crítica: la descompresión. No aprueba. El puntaje alto no compensa un criterio crítico.'
    }
  ];

  function rubrica(el, api) {
    var h = api.h, F = api.fmt;
    var lista = api.barajar(VINETAS).slice(0, 2), i = 0, acum = 0;
    function mostrar() {
      el.innerHTML = '';
      if (i >= lista.length) return api.fin(acum / lista.length, 'Concordancia media con la puntuación experta: ' + Math.round(acum / lista.length * 100) + ' %', true);
      var V = lista[i], pts = {}, crit = {}, veredicto = null, corregido = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Simulación ' + (i + 1) + ' de ' + lista.length));
      el.appendChild(h('h3', { style: 'margin:4px 0 8px' }, V.titulo));
      var total = h('b', null, '0');
      var filas = DOMINIOS.map(function (d, k) {
        var bots = [0, 1, 2].map(function (v) {
          return h('button', { 'aria-label': d + ': ' + v + ' puntos', onclick: function () {
            if (corregido) return;
            pts[k] = v;
            bots.forEach(function (b, bi) { b.classList.toggle('sel', bi === v); });
            var s = 0; for (var x in pts) s += pts[x]; total.textContent = s;
          } }, String(v));
        });
        var f = h('div', { class: 'item-clas' }, h('div', { class: 'txt' }, (k + 1) + '. ' + d), h('div', { style: 'font-size:14.5px;margin-bottom:6px' }, V.obs[k]), h('div', { class: 'bots' }, bots));
        el.appendChild(f); return f;
      });
      el.appendChild(h('div', { class: 'fila', style: 'margin:8px 0' }, h('span', { class: 'cifra' }, h('small', null, 'Su puntaje'), total, ' de 22')));
      el.appendChild(h('div', { class: 'enunciado' }, 'Criterios críticos observados (marque los que haya)'));
      var bc = CRITICOS.map(function (c, k) {
        var b = h('button', { class: 'opcion', html: '☐ ' + c, onclick: function () {
          if (corregido) return;
          crit[k] = !crit[k]; b.classList.toggle('sel', crit[k]); b.innerHTML = (crit[k] ? '☑ ' : '☐ ') + c;
        } });
        el.appendChild(b); return b;
      });
      el.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Veredicto'));
      var bv = ['Aprueba', 'No aprueba'].map(function (t, k) {
        return h('button', { class: 'btn sec', onclick: function () {
          if (corregido) return;
          veredicto = k === 0;
          bv.forEach(function (b, bi) { b.style.boxShadow = bi === k ? 'inset 0 0 0 2px var(--tinta)' : ''; b.style.fontWeight = bi === k ? '800' : ''; });
        } }, t);
      });
      el.appendChild(h('div', { class: 'acciones', style: 'margin-top:4px' }, bv));
      var aviso = h('span', { class: 'pregunta-n' }), zona = h('div');
      var bt = h('button', { class: 'btn', onclick: function () {
        if (Object.keys(pts).length < DOMINIOS.length || veredicto === null) { aviso.textContent = 'Puntúe los 11 dominios y elija un veredicto.'; return; }
        corregido = true; bt.disabled = true; aviso.textContent = '';
        var conc = 0;
        filas.forEach(function (f, k) {
          var d = Math.abs(pts[k] - V.puntos[k]);
          conc += d === 0 ? 1 : d === 1 ? 0.5 : 0;
          f.classList.add(d === 0 ? 'bien' : 'mal');
          if (d) f.appendChild(h('div', { class: 'porque' }, h('b', null, 'Puntuación experta: ' + V.puntos[k] + '.')));
        });
        var critOk = CRITICOS.every(function (_, k) { return !!crit[k] === (V.criticos.indexOf(k) >= 0); });
        bc.forEach(function (b, k) { b.disabled = true; if (V.criticos.indexOf(k) >= 0) b.classList.add('bien'); else if (crit[k]) b.classList.add('mal'); });
        var sumaExp = V.puntos.reduce(function (a, b) { return a + b; }, 0);
        var aprueba = sumaExp >= 18 && !V.criticos.length;
        var verOk = veredicto === aprueba;
        var nota = (conc + (critOk ? 2 : 0) + (verOk ? 2 : 0)) / (DOMINIOS.length + 4);
        acum += nota;
        zona.appendChild(h('div', { class: 'fb ' + (nota >= 0.8 ? 'bien' : 'info'), html: '<b>Concordancia: ' + Math.round(nota * 100) + ' %.</b> Puntaje experto: ' + sumaExp + ' de 22. Criterios críticos: ' + (critOk ? 'bien identificados' : 'no coinciden') + '. Veredicto: ' + (verOk ? 'correcto' : 'incorrecto') + ' (' + (aprueba ? 'aprueba' : 'no aprueba') + '). ' + V.nota }));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; mostrar(); } }, i + 1 < lista.length ? 'Siguiente simulación' : 'Ver resultado')));
      } }, 'Comparar con el evaluador experto');
      el.appendChild(h('div', { class: 'acciones' }, bt, aviso));
      el.appendChild(zona);
    }
    mostrar();
  }

  TDC.registrar({
    numero: 20, parte: 'VI',
    titulo: 'Del juicio clínico a la transferencia del cuidado',
    mision: 'Sintetice en cuatro preguntas, decida el traslado, entregue con IMIST-AMBO y evalúe con la rúbrica.',
    objetivo: 'Convertir la información recogida en un juicio explícito sobre el diagnóstico, los problemas y el riesgo; acordar y ejecutar un plan con el paciente y el equipo; reevaluarlo, y transferir la responsabilidad del cuidado sin pérdida de información.',
    escena: 'Ya tiene los datos. Ahora debe detenerse unos segundos, decir en voz alta qué es lo más probable y lo más peligroso, acordar un plan con una contingencia concreta y, al llegar, entregar al paciente <b>sin que se pierda lo importante</b>, porque quien recibe retiene menos de la mitad de lo que oye.',
    actividades: [
      {
        tipo: 'caso', titulo: 'Malestar general a 150 km de la hemodinamia',
        presentacion: 'Mujer de 63 años con diabetes tipo 2 en una parroquia rural a 150 km del hospital con hemodinamia más cercano. <b>Despacho:</b> «malestar general». La hija dice que desde la mañana está «decaída y con náuseas».',
        fases: [
          {
            titulo: 'Preparar',
            decision: { pregunta: '¿Qué tres hipótesis prepara en el trayecto?',
              opciones: ['Gastroenteritis, síndrome coronario sin dolor típico y electrocardiógrafo como equipo decisivo', 'Gastroenteritis, intoxicación alimentaria y deshidratación, con suero preparado', 'Una sola, «malestar general», hasta ver a la paciente'],
              correcta: 0, explicacion: 'La edad, el sexo femenino y la diabetes se asocian con infartos sin dolor torácico. La etiqueta del despacho se trata como hipótesis ajena.' }
          },
          {
            titulo: 'Evaluar',
            monitor: { FR: '22', SpO2: '94 %', FC: '52', PA: '94/60', Glucemia: '212', T: '36,6 °C' },
            datos: 'Pálida y sudorosa, alerta. Relato libre: «siento una pesadez en la boca del estómago desde que barrí el patio».',
            decision: { pregunta: '¿Cuándo obtiene el ECG de 12 derivaciones?',
              opciones: ['Solo si aparece dolor torácico', 'En los primeros 10 minutos del contacto', 'Al llegar al hospital'],
              correcta: 1, explicacion: 'Lo obtiene a los 8 minutos del contacto: elevación del ST en II, III y aVF con descenso especular en I y aVL.' }
          },
          {
            titulo: 'La hipotensión',
            datos: 'Con el infarto inferior y la PA de 94/60 mmHg…',
            decision: { pregunta: '¿Qué hace?',
              opciones: ['Nitroglicerina para la pesadez', 'Registrar derivaciones derechas', 'Repetir el ECG en 30 minutos'],
              correcta: 1, explicacion: 'Muestran elevación del ST en V4R: extensión al ventrículo derecho. Se evitan los nitratos.' }
          },
          {
            titulo: 'Sintetizar: las cuatro preguntas',
            decision: { tipo: 'multiple', pregunta: '¿Qué respuestas son correctas?',
              opciones: ['Lo más probable: infarto inferior con extensión al ventrículo derecho', 'Lo más peligroso sin descartar: disección aórtica que comprometa la coronaria derecha', 'Lo que necesita ahora: tratar la bradicardia con hipotensión y reperfundir', 'Lo que puede pasar: bloqueo completo o shock', 'Lo más peligroso: gastroenteritis con deshidratación'],
              correctas: [0, 1, 2, 3],
              explicacion: 'La síntesis se dice en voz alta y el líder pide objeciones. La disección se busca de forma activa: dolor desgarrante, diferencia de presión entre brazos y déficit de pulsos. Son negativos.' },
            experto: '“Infarto inferior con ventrículo derecho. Lo peligroso que busqué, la disección, no aparece. Ahora: bradicardia, hipotensión y reperfusión. Riesgo: bloqueo o shock. ¿Alguien ve algo distinto?”'
          },
          {
            titulo: 'Actuar',
            datos: 'Tiempo previsto hasta la angioplastia: más de 120 minutos.',
            decision: { pregunta: '¿Qué plan de reperfusión?',
              opciones: ['Traslado sin reperfundir: la angioplastia es siempre superior', 'Fibrinólisis sin contraindicaciones, tras consultar a la dirección médica', 'Fibrinólisis y nitroglicerina para el dolor'],
              correcta: 1, explicacion: 'La guía recomienda la fibrinólisis cuando el tiempo a la angioplastia supera 120 minutos y no hay contraindicaciones. Se aplica el umbral del capítulo 13.' }
          },
          {
            titulo: 'La contingencia',
            decision: { pregunta: '¿Qué contingencia está bien formulada?',
              opciones: ['«Estaremos atentos a cualquier cambio en el camino.»', '«Si empeora, vemos qué hacer en ese momento.»', '«Si la FC baja de 40 con hipotensión, estimulación según protocolo.»'],
              correcta: 2, explicacion: 'Una contingencia es «si ocurre X, haremos Y». Sin ella, el equipo improvisa justo cuando la carga cognitiva es máxima (capítulo 7).' }
          },
          {
            titulo: 'Explicar y verificar',
            decision: { pregunta: '¿Cómo comprueba que la paciente y su hija entendieron el plan?',
              opciones: ['Les pregunto: «¿Entendieron?»', 'Les pido que me lo expliquen con sus palabras', 'Les entrego un folleto sobre el infarto'],
              correcta: 1, explicacion: 'La técnica de enseñar de vuelta fue eficaz en 19 de 20 estudios. La pregunta cerrada suele responderse con un sí por cortesía.' }
          },
          {
            titulo: 'Reevaluar',
            decision: { pregunta: '¿Qué plan de reevaluación sigue?',
              opciones: ['Signos cada 5 minutos y ECG a los 60 a 90 minutos de la fibrinólisis', 'Signos cada 15 minutos y ECG al llegar al hospital', 'Solo monitorización continua, sin tomas completas'],
              correcta: 0, explicacion: 'El ECG a los 60 a 90 minutos valora la reperfusión. Un dato que no encaja reabre la síntesis.' }
          },
          {
            titulo: 'Transferir y aprender',
            decision: { pregunta: 'En la revisión posterior, ¿qué casi engaña al equipo?',
              opciones: ['La glucemia de 212 mg/dL', 'La SpO2 de 94 %', 'La etiqueta «malestar general» y la falta de dolor torácico'],
              correcta: 2, explicacion: 'Entrega con IMIST-AMBO, ECG impreso y registro escrito. Identificar qué casi engañó alimenta la calibración.' }
          }
        ],
        cierre: 'Las cuatro preguntas de la síntesis convirtieron un «malestar general» en un infarto inferior con extensión al ventrículo derecho. El plan incluyó umbral, contingencia, enseñar de vuelta y reevaluación a intervalos fijos, y la transferencia llevó por escrito lo que la memoria de quien recibe no retiene.'
      },
      {
        tipo: 'personalizado', titulo: 'Arme la transferencia IMIST-AMBO', render: transferencia,
        instrucciones: 'Un caso al azar. Para cada letra, elija el fragmento que transmite hechos verificados, en lenguaje neutro y en su lugar. Los distractores contienen etiquetas heredadas, juicios, valores no medidos o datos fuera de lugar.'
      },
      {
        tipo: 'personalizado', titulo: 'Evalúe con la rúbrica de desempeño', render: rubrica,
        instrucciones: 'Dos simulaciones al azar. Puntúe cada dominio con 0 (no lo realiza), 1 (incompleto o tardío) o 2 (completo y a tiempo), marque los criterios críticos y dé un veredicto. Aprueba quien obtiene 18 o más de 22 sin criterios críticos.'
      },
      {
        tipo: 'clasificar', titulo: 'Lenguaje del registro',
        instrucciones: 'Se describen hechos y conductas, no juicios. Clasifique cada anotación.',
        categorias: ['Con juicio', 'Neutro y preciso', 'Ambiguo o impreciso'],
        items: [
          { texto: '«Borracho conocido, agresivo, dice que le duele la cabeza.»', cat: 0, porque: 'Neutro: «Hombre de 45 años con aliento etílico, cefalea y agitación; refiere consumo frecuente de alcohol».' },
          { texto: '«Hombre de 45 años con aliento etílico, cefalea y agitación.»', cat: 1, porque: 'Describe hechos observables.' },
          { texto: '«Paciente psiquiátrica que exagera el dolor.»', cat: 0, porque: 'El lenguaje estigmatizante generó actitudes más negativas y un manejo menos intenso del dolor.' },
          { texto: '«Mujer de 30 años con trastorno de ansiedad; dolor abdominal de 8 sobre 10.»', cat: 1, porque: 'Diagnóstico y dato medido, sin calificar.' },
          { texto: '«Abuelo confuso, como siempre.»', cat: 0, porque: 'Neutro: «su hija refiere que hoy está más desorientado que en su estado habitual».' },
          { texto: '«Rechaza la toma de glucemia tras recibir la explicación.»', cat: 1, porque: 'Registra lo que no se hizo y por qué, describiendo la conducta.' },
          { texto: '«PCR a las 10:15.»', cat: 2, porque: 'Puede leerse como paro cardiorrespiratorio, proteína C reactiva o reacción en cadena de la polimerasa.' },
          { texto: '«Antecedente de IM.»', cat: 2, porque: '«IM» puede ser infarto de miocardio o vía intramuscular.' },
          { texto: '«FR 20» anotada sin haberla contado', cat: 2, porque: 'Un valor que no se midió no se escribe; si se estimó, se marca como estimado.' },
          { texto: '«Paciente poco colaborador.»', cat: 0, porque: 'Califica en lugar de describir qué hizo el paciente.' }
        ]
      },
      {
        tipo: 'clasificar', titulo: '¿Trasladar o dejar en casa?',
        instrucciones: 'El traslado está indicado si se cumple cualquiera de sus condiciones. No trasladar exige que se cumplan todas las del no traslado.',
        categorias: ['Trasladar', 'Puede quedarse con red de seguridad'],
        items: [
          { texto: 'El diagnóstico de trabajo requiere pruebas hospitalarias', cat: 0, porque: 'Primera condición de traslado.' },
          { texto: 'Signos vitales normales, pero usted está preocupado sin saber por qué', cat: 0, porque: 'La preocupación del clínico puede preceder a cualquier cambio en los signos vitales.' },
          { texto: 'El tratamiento no produjo la respuesta esperada', cat: 0, porque: 'La respuesta al tratamiento es una prueba diagnóstica.' },
          { texto: 'Mujer que vive sola a 3 horas del centro de salud, dolor abdominal leve y un único control normal', cat: 0, porque: 'Falta la tendencia y no tiene acceso real a un control: la red de seguridad es inviable.' },
          { texto: 'Paciente con diagnóstico de bajo riesgo, pero el control ambulatorio es inviable por la distancia y el costo del transporte', cat: 0, porque: 'Un plan solo es seguro si el paciente puede cumplirlo.' },
          { texto: 'Capacidad demostrada, dos tomas estables, diagnóstico de bajo riesgo con alternativas peligrosas descartadas, control accesible y plan verificado con enseñar de vuelta', cat: 1, porque: 'Cumple todas las condiciones del no traslado. Recibe por escrito la evaluación y la red de seguridad.' },
          { texto: 'Niño de 4 años con fiebre, activo, que juega, bien perfundido, sin exantema, con padres tranquilos que repiten las señales de alarma', cat: 1, porque: 'Sin señales de alarma: evaluación ambulatoria con instrucciones claras (capítulo 17).' },
          { texto: 'El paciente, con un cuadro leve, pide ser trasladado', cat: 0, porque: 'La solicitud del paciente es por sí sola una indicación de traslado.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Juicio, plan y entrega',
        preguntas: [
          { p: '¿Por qué el diferencial mínimo incluye una hipótesis de otro sistema orgánico?', opciones: ['Porque así lo exige el formulario de registro', 'Porque obliga a mirar fuera del órgano que eligió la primera impresión', 'Porque la hipótesis más probable suele ser errónea'], correcta: 1, explicacion: 'Es la forma más directa de romper el anclaje (capítulo 15).' },
          { p: 'Mujer que vive sola a 3 horas del centro de salud, dolor abdominal leve y signos normales en un único control. Quiere quedarse. ¿Es candidata a no traslado?', opciones: ['Sí, porque los signos vitales son normales', 'Sí, si firma la negativa', 'No: falta la tendencia y no tiene acceso real a un control'], correcta: 2, explicacion: 'Se recomienda el traslado; si lo rechaza con capacidad demostrada, negativa informada (anexo E).' },
          { p: '¿Qué aporta la técnica de enseñar de vuelta frente a preguntar «¿entendió?»?', opciones: ['Revela lo que realmente entendió, porque el «sí» suele ser cortesía', 'Nada distinto, pero queda mejor en el registro', 'Acorta la explicación del plan'], correcta: 0, explicacion: 'Fue eficaz en 19 de 20 estudios, desde el recuerdo de la información hasta los reingresos.' },
          { p: '¿Por qué no basta una entrega verbal bien estructurada?', opciones: ['Porque el personal receptor retuvo con exactitud menos de la mitad de lo entregado', 'Porque IMIST-AMBO no está validado', 'Porque el paciente no puede escucharla'], correcta: 0, explicacion: 'Se complementa con el registro escrito y con la confirmación de los datos críticos por quien recibe.' },
          { p: '¿Qué cuatro componentes tiene la red de seguridad?', opciones: ['Diagnóstico, tratamiento, destino y firma del paciente', 'Signos de alarma concretos, qué hacer, dónde y cuándo buscar ayuda, y el control previsto', 'Teléfono de la central, receta, reposo y dieta'], correcta: 1, explicacion: 'Se adapta a la persona y se entrega también por escrito.' },
          { p: 'Su compañero no coincide con su síntesis. ¿Cómo lo trata?', opciones: ['Como una falta de disciplina en la tripulación', 'Como un dato: falta información o él vio algo que usted no', 'Decide el de mayor antigüedad y se continúa'], correcta: 1, explicacion: 'El líder pide objeciones de forma explícita (capítulos 15 y 16).' },
          { p: 'Consultar a la dirección médica en un caso complejo significa…', opciones: ['Delegar la decisión y su responsabilidad', 'Sumar información a la decisión', 'Reconocer que el equipo no está capacitado'], correcta: 1, explicacion: 'También al centro de información toxicológica o al especialista que conoce al paciente.' },
          { p: 'Un paciente preocupa al equipo sin una explicación clara y sus signos vitales son normales. ¿Qué indica?', opciones: ['Que es un paciente de bajo riesgo: los números mandan', 'Que la preocupación es un dato de la síntesis y justifica escalar', 'Que hay que repetir los signos vitales en una hora'], correcta: 1, explicacion: 'La preocupación del clínico puede aparecer antes que cualquier cambio en los signos vitales.' },
          { p: 'Cuando el paciente no se traslada, ¿también hay transferencia?', opciones: ['No: la atención termina en la escena', 'Sí: recibe por escrito evaluación, diagnóstico, motivo del no traslado y red de seguridad', 'Solo si el paciente la solicita'], correcta: 1, explicacion: 'Así la información llega a su próximo profesional de salud.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Las cuatro preguntas de la síntesis', reverso: '¿Qué es lo más probable? ¿Qué es lo más peligroso que no he descartado? ¿Qué necesita ahora? ¿Qué pasará y qué ocurrirá si me equivoco?' },
          { frente: 'Diferencial mínimo', reverso: 'La hipótesis más probable, la más peligrosa y una de otro sistema orgánico' },
          { frente: 'Formato de una contingencia', reverso: '«Si ocurre X, haremos Y»' },
          { frente: 'Condiciones de traslado (basta una)', reverso: 'Requiere pruebas o tratamiento hospitalario · peligroso sin descartar · riesgo inaceptable o clínico preocupado · sin respuesta al tratamiento · el paciente lo pide · sin alternativa segura de seguimiento' },
          { frente: 'IMIST-AMBO', reverso: 'Identificación · Mecanismo o motivo · Información clínica · Signos vitales · Tratamiento · Alergias · Medicación · antecedentes (Background) · Otros' },
          { frente: 'Cinco reglas del registro', reverso: 'Solo lo obtenido · horas de cada hito · lo que no se hizo y por qué · sin abreviaturas ambiguas · conductas, no calificativos' },
          { frente: 'Rúbrica de desempeño', reverso: '11 dominios de 0 a 2. Aprueba con 18 o más de 22 y sin criterios críticos.' },
          { frente: 'Criterios críticos de la rúbrica', reverso: 'Escena insegura · amenaza vital no tratada · fármaco sin verificar · no traslado sin evaluar capacidad · no reevaluar tras deterioro · omitir una intervención crítica en la entrega' },
          { frente: 'Retención en la transferencia verbal', reverso: 'Solo 49,2 % de la información, aun con formato estructurado: siempre con registro escrito' }
        ]
      }
    ]
  });
})();
