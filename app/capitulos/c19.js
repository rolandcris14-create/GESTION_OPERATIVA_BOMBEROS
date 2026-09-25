/* Capítulo 19. La evaluación del paciente: del despacho al examen físico */
(function () {
  /* Entrevistas del simulador de anamnesis cronometrada.
     relato: fragmentos que el paciente dice si no se le interrumpe; el dato clave se obtiene si se escuchan más de "clave" fragmentos.
     preguntas: util = hipótesis cuya probabilidad cambia la respuesta (null si ninguna respuesta cambiaría la conducta). */
  var ENTREVISTAS = [
    {
      titulo: 'Caída en la cocina', quien: 'Paciente',
      contexto: 'Despacho: «caída de su propia altura, consciente». Hombre de 67 años sentado en el piso de la cocina, con dolor en la cadera derecha. La evaluación primaria no muestra amenazas inmediatas, pero el pulso radial es lento.',
      relato: ['Bueno… estaba aquí en la cocina, lavando los platos del almuerzo.', 'Mi esposa estaba en la sala.', 'Y de repente se me nubló la vista…', 'y desperté en el suelo. No sé cuánto tiempo pasó.', 'Después ya no me pude parar por la cadera.'],
      clave: 3,
      claveTxt: 'Perdió el conocimiento antes de caer: la caída es consecuencia de un síncope, no de un tropiezo. Sin la pregunta abierta, el dato queda oculto detrás de la etiqueta del despacho.',
      cerrada: '¿Se resbaló con algo?', respCerrada: 'Eh… sí, supongo que me caí. Me duele mucho la cadera.',
      preguntas: [
        { t: '¿Sintió palpitaciones o dolor en el pecho antes de caer?', r: 'No, dolor de pecho no.', util: 'síncope de causa cardíaca (negativo pertinente)' },
        { t: '¿Ha tenido mareos o desmayos estos días?', r: 'Dos veces esta semana me mareé.', util: 'síncope de causa arrítmica' },
        { t: '¿Qué medicamentos toma? ¿Alguno nuevo?', r: 'Una pastilla para la presión que me dieron hace unos 10 días.', util: 'bradicardia por fármacos' },
        { t: '¿Se golpeó la cabeza?', r: 'Creo que sí, aquí atrás.', util: 'lesión craneal asociada' },
        { t: '¿Cuánto tiempo lleva en el suelo?', r: 'Más de una hora.', util: 'rabdomiólisis, lesiones por presión e hipotermia' },
        { t: '¿Qué comió en el almuerzo?', r: 'Sopa y arroz, lo de siempre.', util: null },
        { t: '¿En qué año se jubiló?', r: 'Hace siete años.', util: null }
      ],
      resumenes: [
        { t: '«Entonces: se resbaló en la cocina mientras lavaba los platos, se golpeó la cadera y no se puede parar. ¿Es así?»', ok: false, r: 'No, no me resbalé: se me nubló la vista antes de caer.' },
        { t: '«Entonces: se le nubló la vista lavando los platos y despertó en el suelo; dos mareos esta semana, pastilla nueva para la presión, sin dolor de pecho. ¿Es así?»', ok: true, r: 'Sí, así fue.' },
        { t: '«Entonces: se cayó, le duele la cadera derecha y por lo demás se encuentra bien. ¿Es así?»', ok: false, r: 'Bueno… también me he mareado esta semana.' }
      ]
    },
    {
      titulo: 'Malestar general', quien: 'Paciente',
      contexto: 'Despacho: «malestar general». Mujer de 63 años con diabetes tipo 2, en una parroquia rural a 150 km del hospital con hemodinamia más cercano. Pálida y sudorosa.',
      relato: ['Desde la mañana me siento decaída, con náuseas.', 'Pensé que era algo que me cayó mal…', 'pero siento una pesadez aquí, en la boca del estómago,', 'desde que barrí el patio.', 'Y no se me quita.'],
      clave: 3,
      claveTxt: 'Pesadez epigástrica que empezó con el esfuerzo: en una mujer diabética de 63 años, posible síndrome coronario sin dolor torácico. La etiqueta «malestar general» casi lo oculta.',
      cerrada: '¿Ha tenido diarrea?', respCerrada: 'No, diarrea no. Solo náuseas.',
      preguntas: [
        { t: '¿La pesadez se va hacia el brazo, la mandíbula o la espalda?', r: 'No, se queda aquí.', util: 'síndrome coronario agudo' },
        { t: '¿Le falta el aire?', r: 'Un poco, cuando camino.', util: 'síndrome coronario e insuficiencia cardíaca' },
        { t: '¿Ha sentido un dolor desgarrante que pase a la espalda?', r: 'No, nada de eso.', util: 'disección aórtica (negativo pertinente)' },
        { t: '¿Qué medicinas toma y cuándo tomó la última?', r: 'Las pastillas del azúcar, esta mañana.', util: 'fármacos y control de la diabetes' },
        { t: '¿Ha tenido fiebre?', r: 'No.', util: 'causa infecciosa del malestar' },
        { t: '¿Le gusta vivir en el campo?', r: 'Sí, es tranquilo.', util: null },
        { t: '¿A qué se dedicaban sus padres?', r: 'Eran agricultores.', util: null }
      ],
      resumenes: [
        { t: '«Entonces: algo le cayó mal y tiene náuseas y decaimiento desde la mañana, sin diarrea ni fiebre. ¿Es así?»', ok: false, r: 'Sí… pero lo que más me molesta es la pesadez desde que barrí.' },
        { t: '«Entonces: tiene un malestar general desde la mañana y se siente sin fuerzas para nada. ¿Es así?»', ok: false, r: 'Sí, y esta pesadez en el estómago.' },
        { t: '«Entonces: decaída y con náuseas desde la mañana, y una pesadez en la boca del estómago desde que barrió, sin dolor desgarrante. ¿Es así?»', ok: true, r: 'Sí, eso es.' }
      ]
    },
    {
      titulo: 'El niño que no quiere caminar', quien: 'Madre',
      contexto: 'Niño de 4 años con fiebre, en brazos de su madre. Somnoliento, pero despierta al estímulo. Usted pregunta a la madre qué ha pasado.',
      relato: ['Desde la mañana tiene fiebre, llegó a 39 y algo.', 'Ha vomitado dos veces.', 'Pero no quiere caminar: dice que le duelen las piernas,', 'y tiene las manos y los pies fríos.', 'No sé… no parece él.'],
      clave: 3,
      claveTxt: 'Dolor de piernas, extremidades frías y una madre que lo nota distinto: señales que aparecen antes que el exantema en la enfermedad meningocócica. La preocupación de los padres es un dato con peso diagnóstico.',
      cerrada: '¿Cuánta fiebre tuvo?', respCerrada: '39 y algo.',
      preguntas: [
        { t: '¿Está más dormido de lo normal?', r: 'Sí, está como apagado.', util: 'infección grave (alteración de la conciencia)' },
        { t: '¿Le ha visto manchas en la piel?', r: 'No me fijé… no lo he desvestido.', util: 'exantema petequial: obliga a desvestirlo por completo' },
        { t: '¿Respira más rápido de lo normal?', r: 'Creo que sí.', util: 'taquipnea, señal de alarma' },
        { t: '¿Tiene alguna enfermedad o toma algún medicamento?', r: 'No, es sano.', util: 'antecedentes y fármacos' },
        { t: '¿Cuánto pesa?', r: 'Unos 16 kilos, creo.', util: 'dosis y volumen de líquidos (anexo G)' },
        { t: '¿En qué grado del preescolar está?', r: 'En el segundo año.', util: null },
        { t: '¿Qué dibujos animados le gustan?', r: 'Los de perritos.', util: null }
      ],
      resumenes: [
        { t: '«Entonces: fiebre desde la mañana, vómitos, dolor de piernas, manos y pies fríos, está más dormido y usted lo nota distinto. ¿Es así?»', ok: true, r: 'Sí. No parece él.' },
        { t: '«Entonces: fiebre alta y vómitos desde la mañana, seguramente un virus como los que hay ahora. ¿Es así?»', ok: false, r: 'Pero es que no parece él…' },
        { t: '«Entonces: fiebre de 39 y vómitos dos veces desde la mañana, sin otras molestias importantes. ¿Es así?»', ok: false, r: 'No… le duelen las piernas y tiene las manos frías.' }
      ]
    }
  ];

  function anamnesis(el, api) {
    var h = api.h, F = api.fmt;
    var lista = api.barajar(ENTREVISTAS).slice(0, 2), i = 0, puntos = 0;
    var timer = null;
    function parar() { if (timer) { clearInterval(timer); timer = null; } }

    function linea(chat, quien, txt, estilo) {
      chat.appendChild(h('div', { style: 'margin:4px 0;' + (estilo || '') }, h('b', null, quien + ': '), quien === 'Usted' ? '«' + txt + '»' : h('i', null, '«' + txt + '»')));
      chat.scrollTop = chat.scrollHeight;
    }

    function mostrar() {
      parar();
      el.innerHTML = '';
      if (i >= lista.length) {
        var nota = puntos / (lista.length * 3);
        return api.fin(nota, F(puntos, 1) + ' de ' + (lista.length * 3) + ' puntos en ' + lista.length + ' entrevistas (relato libre, preguntas dirigidas y resumen)', true);
      }
      var E = lista[i], mostrados = 0, seg = 0, interrumpio = false, tInt = null;
      var hechas = [], resumenOk = false;
      el.appendChild(h('div', { class: 'pregunta-n' }, 'Entrevista ' + (i + 1) + ' de ' + lista.length));
      el.appendChild(h('h3', { style: 'margin:4px 0' }, E.titulo));
      el.appendChild(h('div', { class: 'caja escena', style: 'margin:8px 0', html: E.contexto }));
      var reloj = h('b', null, '0 s');
      var etapa = h('div', { class: 'enunciado' }, 'Tiempo 1: relato libre');
      el.appendChild(h('div', { class: 'fila', style: 'justify-content:space-between' }, etapa, h('span', { class: 'cifra', style: 'margin:0' }, h('small', null, 'Cronómetro'), reloj)));
      var chat = h('div', { 'aria-live': 'polite', style: 'background:var(--fondo);border:1px solid var(--linea);border-radius:10px;padding:10px 12px;margin:8px 0;max-height:320px;overflow-y:auto;font-size:15px' });
      el.appendChild(chat);
      var ctrl = h('div', { class: 'acciones' }), zona = h('div');
      el.appendChild(ctrl); el.appendChild(zona);
      linea(chat, 'Usted', 'Cuénteme qué pasó.');

      var btInt = h('button', { class: 'btn sec', onclick: function () {
        parar(); interrumpio = true; tInt = seg;
        linea(chat, 'Usted', E.cerrada, 'color:var(--rojo)');
        linea(chat, E.quien, E.respCerrada);
        irDirigida();
      } }, 'Interrumpir con una pregunta cerrada');
      ctrl.appendChild(btInt);
      ctrl.appendChild(h('span', { class: 'pregunta-n' }, 'o espere en silencio mientras habla'));

      timer = setInterval(function () {
        if (!document.body.contains(el)) return parar();
        seg++; reloj.textContent = seg + ' s';
        if (seg % 3 === 0 && mostrados < E.relato.length) {
          linea(chat, E.quien, E.relato[mostrados]); mostrados++;
          if (mostrados === E.relato.length) {
            ctrl.innerHTML = '';
            setTimeout(function () {
              if (interrumpio) return;
              parar();
              chat.appendChild(h('div', { class: 'pregunta-n', style: 'margin:6px 0' }, E.quien + ' hace una pausa y lo mira: terminó su relato.'));
              irDirigida();
            }, 1500);
          }
        }
      }, 1000);

      function irDirigida() {
        ctrl.innerHTML = '';
        etapa.textContent = 'Tiempo 2: anamnesis dirigida';
        zona.innerHTML = '';
        zona.appendChild(h('div', { class: 'fb ' + (interrumpio ? 'mal' : 'bien'), html: interrumpio
          ? '<b>Interrumpió a los ' + tInt + ' s.</b> ' + (mostrados > E.clave ? 'Por suerte el dato clave ya había salido.' : 'El dato que estaba por dar se perdió.') + ' En consultas grabadas, la mediana de interrupción fue de 11 s, y los pacientes no interrumpidos necesitaron una mediana de 6 s para exponer su preocupación.'
          : '<b>Lo dejó terminar (' + seg + ' s).</b> Dejar terminar cuesta poco y evita perder el dato que estaba por dar.' }));
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, 'Elija hasta 4 preguntas. Cada una debe poder cambiar la probabilidad de alguna hipótesis.'));
        var cont = h('span', { class: 'pregunta-n' }, '0 de 4 preguntas');
        var fin = h('button', { class: 'btn', disabled: true, onclick: irResumen }, 'Terminar y resumir');
        var bots = E.preguntas.map(function (q, k) { return { q: q, k: k }; });
        bots = api.barajar(bots).map(function (x) {
          var b = h('button', { class: 'opcion', onclick: function () {
            if (hechas.length >= 4) return;
            b.disabled = true; b.classList.add('sel');
            hechas.push(x.q);
            linea(chat, 'Usted', x.q.t);
            linea(chat, E.quien, x.q.r);
            cont.textContent = hechas.length + ' de 4 preguntas';
            fin.disabled = false;
            if (hechas.length >= 4) { bots.forEach(function (y) { y.disabled = true; }); }
          } }, x.q.t);
          zona.appendChild(b); return b;
        });
        zona.appendChild(h('div', { class: 'acciones' }, fin, cont));
      }

      function irResumen() {
        etapa.textContent = 'Cierre: resumen en voz alta';
        zona.innerHTML = '';
        var utiles = hechas.filter(function (q) { return q.util; }).length, inutiles = hechas.length - utiles;
        zona.appendChild(h('div', { class: 'fb ' + (utiles >= 3 && !inutiles ? 'bien' : 'info') }, h('b', null, utiles + ' preguntas justificadas por una hipótesis' + (inutiles ? ' y ' + inutiles + ' sin efecto sobre la decisión.' : '.')),
          h('ul', { style: 'margin:6px 0 0;padding-left:20px' }, hechas.map(function (q) {
            return h('li', null, q.t + ' → ' + (q.util ? 'modifica: ' + q.util : 'ninguna respuesta cambiaría la conducta'));
          }))));
        zona.appendChild(h('div', { class: 'enunciado', style: 'margin-top:10px' }, '¿Con qué resumen cierra la entrevista?'));
        var rb = [];
        api.barajar(E.resumenes).forEach(function (R) {
          var b = h('button', { class: 'opcion', onclick: function () {
            rb.forEach(function (x) { x.b.disabled = true; if (x.R.ok) x.b.classList.add('bien'); });
            if (!R.ok) b.classList.add('mal');
            resumenOk = R.ok;
            linea(chat, 'Usted', R.t.replace(/[«»]/g, ''));
            linea(chat, E.quien, R.r);
            cerrar(utiles, inutiles);
          } }, R.t);
          rb.push({ b: b, R: R }); zona.appendChild(b);
        });
      }

      function cerrar(utiles, inutiles) {
        var pRel = interrumpio ? 0 : 1;
        var pPreg = Math.max(0, Math.min(utiles, 3) / 3 - 0.25 * inutiles);
        var pRes = resumenOk ? 1 : 0;
        var p = pRel + pPreg + pRes;
        puntos += p;
        zona.appendChild(h('div', { class: 'fb ' + (p >= 2.4 ? 'bien' : 'info') },
          h('b', null, 'Entrevista: ' + F(p, 1) + ' de 3 puntos'),
          h('ul', { style: 'margin:6px 0 0;padding-left:20px' },
            h('li', null, 'Relato libre completo: ' + (pRel ? 'sí' : 'no')),
            h('li', null, 'Preguntas dirigidas: ' + F(pPreg, 1) + ' (se esperan al menos 3 justificadas, sin preguntas de relleno)'),
            h('li', null, 'Resumen que el paciente confirma: ' + (pRes ? 'sí' : 'no, lo corrigió'))),
          h('div', { style: 'margin-top:6px' }, h('b', null, 'Dato clave: '), E.claveTxt)));
        zona.appendChild(h('div', { class: 'acciones' }, h('button', { class: 'btn', onclick: function () { i++; mostrar(); } }, i + 1 < lista.length ? 'Siguiente entrevista' : 'Ver resultado')));
      }
    }
    mostrar();
  }

  TDC.registrar({
    numero: 19, parte: 'VI',
    titulo: 'La evaluación del paciente: del despacho al examen físico',
    mision: 'Prepare tres hipótesis, deje hablar al paciente y pregunte solo lo que cambia la decisión.',
    objetivo: 'Recoger la información del paciente de forma estructurada y reproducible, en el orden que impone la gravedad, de modo que cada dato alimente una decisión.',
    escena: 'El despacho le entrega una etiqueta: «caída», «malestar general», «fiebre». Es una hipótesis ajena. Entre el trayecto y el examen físico, su tarea es convertirla en <b>tres hipótesis propias</b>, escuchar el relato sin interrumpir y elegir cada pregunta y cada signo por la decisión que puede cambiar.',
    actividades: [
      {
        tipo: 'caso', titulo: 'La caída que no fue un tropiezo',
        presentacion: '<b>Despacho:</b> «caída de su propia altura, consciente». Hombre de 67 años.',
        fases: [
          {
            titulo: 'En el trayecto',
            decision: { pregunta: '¿Qué hipótesis prepara?',
              opciones: ['Probable: fractura de cadera. Peligrosa: caída por síncope. Equipo que cambia la decisión: electrocardiógrafo', 'Probable: fractura de cadera. Peligrosa: fractura desplazada. Equipo que cambia la decisión: férula', 'Una sola: la del despacho, para no perder tiempo en la escena'],
              correcta: 0, explicacion: 'Una sola hipótesis actúa como ancla. La etiqueta del despacho encuadra el caso como traumatológico: es el sesgo de encuadre por el triaje. Antes de bajar, autochequeo HALTS y reparto de roles.' },
            experto: '“Lo más probable, una cadera. Lo más peligroso, que se haya caído porque se desmayó. Llevamos el electrocardiógrafo.”'
          },
          {
            titulo: 'La escena',
            datos: 'Escena segura. Está sentado en el piso de la cocina, con dolor en la cadera derecha. Lleva más de una hora en el suelo.',
            decision: { pregunta: '¿Por qué registra el tiempo en el suelo?',
              opciones: ['Por el riesgo de rabdomiólisis, lesiones por presión e hipotermia', 'Para calcular la hora exacta de la caída en el parte policial', 'No importa mientras el paciente esté consciente y orientado'],
              correcta: 0, explicacion: 'La escena también es un dato clínico, como la posición en que se encontró al paciente.' }
          },
          {
            titulo: 'Primera impresión',
            datos: 'Pálido, conversa, respira sin esfuerzo. La evaluación primaria no muestra amenazas inmediatas, pero el pulso radial es lento.',
            decision: { pregunta: 'Usted pregunta: «Cuénteme qué pasó». A los 8 segundos el paciente hace una pausa. ¿Qué hace?',
              opciones: ['Interrumpo: «¿Tropezó con algo?»', 'Espero y lo dejo terminar su relato', 'Paso directamente a explorar la cadera'],
              correcta: 1, explicacion: 'En consultas grabadas, el clínico interrumpió a los 11 segundos de mediana; los pacientes no interrumpidos necesitaron una mediana de 6 segundos para exponer su preocupación.' }
          },
          {
            titulo: 'El relato libre',
            datos: '«Estaba lavando los platos, se me nubló la vista y desperté en el suelo.»',
            decision: { pregunta: '¿Qué cambia este dato?',
              opciones: ['Nada: confirma una caída mecánica', 'Perdió el conocimiento antes de caer: es un síncope con caída', 'Sugiere un golpe en la cabeza con confusión posterior'],
              correcta: 1, explicacion: 'El paciente no tropezó. Sin la pregunta abierta, el dato habría quedado oculto detrás de la etiqueta.' },
            experto: '“No se cayó y perdió el conocimiento: perdió el conocimiento y se cayó. Cambia el caso.”'
          },
          {
            titulo: 'Anamnesis dirigida y fármacos',
            datos: 'Sin dolor torácico. Dos episodios de mareo esta semana. En la bolsa de medicamentos hay un betabloqueante iniciado hace 10 días.',
            decision: { pregunta: '¿Qué hallazgo de la bolsa importa más?',
              opciones: ['Ninguno: los fármacos no explican una caída', 'El betabloqueante nuevo: puede causar bradicardia y ocultar la taquicardia', 'Un analgésico de venta libre que toma a veces'],
              correcta: 1, explicacion: 'Los fármacos causan y enmascaran enfermedad (anexo H). Se revisan en la lista o en la bolsa, con la hora de la última dosis y la adherencia real.' }
          },
          {
            titulo: 'Signos vitales',
            monitor: { FC: '38 lpm', PA: '102/60' },
            datos: 'Su esposa dice que la presión habitual de él es 150/90.',
            decision: { pregunta: '¿Cómo lee la PA de 102/60 mmHg?',
              opciones: ['Normal para un adulto de su edad', 'Muy por debajo de su valor habitual: posible hipoperfusión', 'Probable error de medición: se repite en 30 minutos'],
              correcta: 1, explicacion: 'El mismo valor tiene significados distintos según el basal del paciente. Cada valor se dice en voz alta para el equipo.' }
          },
          {
            titulo: 'El complemento que cambia la decisión',
            decision: { pregunta: '¿Qué complemento prioriza ahora?',
              opciones: ['ECG de 12 derivaciones', 'Inmovilizar la cadera y dejar el ECG para el hospital', 'Escala de dolor antes de cualquier otro dato'],
              correcta: 0, explicacion: 'Síncope y bradicardia: el ECG es el complemento con capacidad de cambiar el destino. Muestra un bloqueo auriculoventricular completo.' }
          },
          {
            titulo: 'Examen físico',
            monitor: { ECG: 'BAV completo', FC: '38 lpm' },
            datos: 'Pierna derecha acortada y en rotación externa.',
            decision: { tipo: 'multiple', pregunta: '¿Qué más examina?',
              opciones: ['La cabeza, por el golpe', 'Pulsos distales, sensibilidad y fuerza en las cuatro extremidades', 'Las zonas sin lesión evidente', 'Solo la cadera: es lo que le duele'],
              correctas: [0, 1, 2],
              explicacion: 'En el traumatizado, tras la primaria se revisa todo el cuerpo en busca de lesiones ocultas. Se explica qué se examina, se descubre solo lo necesario y se cubre al paciente después.' }
          },
          {
            titulo: 'Síntesis y destino',
            decision: { pregunta: '¿Qué problema decide el destino?',
              opciones: ['La fractura de cadera: hospital con traumatología', 'El ritmo: hospital con estimulación cardíaca y parches colocados', 'Ninguno en especial: el hospital más cercano'],
              correcta: 1, explicacion: 'Síncope por bloqueo completo, con probable contribución del fármaco, y fractura de cadera secundaria. Preaviso y parches de estimulación colocados.' }
          }
        ],
        cierre: 'La etiqueta del despacho encuadró el caso como traumatológico. Las tres hipótesis del trayecto, el relato libre sin interrupciones, la bolsa de medicamentos y la presión habitual del paciente lo convirtieron en lo que era: un problema de ritmo.'
      },
      {
        tipo: 'personalizado', titulo: 'Anamnesis cronometrada', render: anamnesis,
        instrucciones: 'Dos entrevistas al azar, en tiempo real. El paciente habla por partes: puede esperar o interrumpirlo con una pregunta cerrada. Después elija hasta 4 preguntas dirigidas y cierre con un resumen que el paciente pueda confirmar.'
      },
      {
        tipo: 'clasificar', titulo: '¿Tranquiliza este valor?',
        instrucciones: 'Decida si cada dato puede leerse tal cual o si necesita contexto porque puede engañar.',
        categorias: ['Se lee tal cual', 'Necesita contexto o engaña'],
        items: [
          { texto: 'SpO2 de 96 % tras un incendio en una vivienda cerrada', cat: 1, porque: 'El oxímetro convencional lee la carboxihemoglobina como oxihemoglobina. Oxígeno al 100 % y traslado para medirla.' },
          { texto: 'PA de 110 mmHg en quien suele tener 160', cat: 1, porque: 'Puede ser hipoperfusión para ese paciente.' },
          { texto: 'FC de 70 en un adulto mayor hipotenso que toma betabloqueantes', cat: 1, porque: 'Los betabloqueantes impiden la taquicardia que alertaría del problema (anexo H).' },
          { texto: 'SpO2 de 92 % en un residente adaptado de la Sierra', cat: 1, porque: 'Se interpreta según la altitud de residencia y el valor habitual (anexo E).' },
          { texto: 'SpO2 normal en un paciente de piel negra con disnea', cat: 1, porque: 'La pulsioximetría sobrestima la saturación con más frecuencia en pacientes negros.' },
          { texto: 'FR de 20 anotada «a ojo» mientras se hablaba con el paciente', cat: 1, porque: 'La FR se cuenta durante 30 a 60 segundos y nunca se estima.' },
          { texto: '«No tengo dolor de pecho» en una mujer diabética de 63 años con náuseas', cat: 1, porque: 'Un negativo rara vez descarta: su LR negativo suele ser modesto y las presentaciones atípicas son frecuentes.' },
          { texto: 'Glucemia capilar de 38 mg/dL en un diabético confuso', cat: 0, porque: 'Explica la alteración de la conciencia y exige corrección inmediata.' },
          { texto: 'FR de 32 contada durante 60 segundos', cat: 0, porque: 'Medida con técnica fiable: taquipnea real.' }
        ]
      },
      {
        tipo: 'ordenar', titulo: 'Del despacho al resumen',
        instrucciones: 'Ordene la secuencia de la evaluación en un paciente que no está grave.',
        pasos: [
          'En el trayecto: tres hipótesis propias, autochequeo HALTS y reparto de roles',
          'Seguridad de la escena e informe a la central de pacientes, peligros y recursos',
          'Primera impresión: ¿está grave o puede estarlo en minutos?',
          'Evaluación primaria breve',
          'Relato libre con una pregunta amplia, sin interrumpir',
          'Anamnesis dirigida por hipótesis, empezando por lo más peligroso',
          'Revisión amplia por sistemas si la queja es vaga o se contempla no trasladar',
          'Resumen en voz alta que el paciente puede corregir'
        ],
        explicacion: 'En el paciente grave, los tres tiempos de la anamnesis se comprimen y ocurren en paralelo con la evaluación y el tratamiento; lo que falte se completa en el ciclo siguiente. Ante cualquier deterioro se vuelve a la evaluación primaria.'
      },
      {
        tipo: 'numero', titulo: 'Tiempos y cuentas de la evaluación',
        instrucciones: 'Escriba solo el número.',
        problemas: [
          { enunciado: 'Usted cuenta 11 respiraciones en 30 segundos. ¿Cuál es la frecuencia respiratoria?', respuesta: 22, tolerancia: 0, unidad: 'rpm', solucion: '11 × 2 = 22 rpm. Se cuenta durante 30 a 60 segundos y nunca se estima.' },
          { enunciado: 'Paciente inestable con un traslado de 40 minutos. Si repite los signos vitales completos cada 5 minutos, ¿cuántos juegos registra durante el trayecto?', respuesta: 8, tolerancia: 0, unidad: 'juegos', solucion: '40/5 = 8, además de los que siguen a cada intervención.' },
          { enunciado: 'Paciente estable con un traslado de 45 minutos, controles cada 15 minutos. ¿Cuántos juegos completos durante el trayecto?', respuesta: 3, tolerancia: 0, unidad: 'juegos', solucion: '45/15 = 3, además de los que siguen a cada intervención.' },
          { enunciado: 'Primer contacto a las 14:02 con un posible síndrome coronario agudo. ¿Hasta qué minuto después de las 14:00 tiene para el ECG de 12 derivaciones?', respuesta: 12, tolerancia: 0, unidad: 'min', solucion: 'En los primeros 10 minutos del contacto: antes de las 14:12.' },
          { enunciado: 'En el estudio clásico, la historia sola orientó el diagnóstico final en 66 de 80 pacientes. ¿Qué porcentaje es (un decimal)?', respuesta: 82.5, tolerancia: 0.2, decimales: 1, unidad: '%', solucion: '66/80 = 82,5 %. El examen físico aportó en 7 y los exámenes complementarios en otros 7.' }
        ]
      },
      {
        tipo: 'quiz', titulo: 'Evaluar sin perder datos',
        preguntas: [
          { p: '¿Por qué el trayecto debe producir tres hipótesis y no una?', opciones: ['Porque la hipótesis del despacho es ajena y una sola actúa como ancla', 'Porque el protocolo exige anotar tres diagnósticos', 'Porque con tres se acierta siempre al menos una vez'], correcta: 0, explicacion: 'La más peligrosa obliga a buscarla activamente, y la que cambia el equipo evita llegar sin el material necesario.' },
          { p: 'Tras un incendio en una vivienda cerrada, un paciente tiene SpO2 de 96 %. ¿Qué hace?', opciones: ['Nada especial: la oxigenación es normal', 'Oxígeno al 100 % y traslado para medir la carboxihemoglobina', 'Oxígeno solo si la SpO2 baja de 94 %'], correcta: 1, explicacion: 'La saturación puede ser normal con una intoxicación grave por monóxido de carbono (capítulo 11).' },
          { p: '¿Por qué se pregunta por la presión arterial habitual del paciente?', opciones: ['Para completar el formulario de antecedentes', 'Porque el mismo valor puede ser normal para uno e hipoperfusión para otro', 'Porque la presión medida en la escena no es fiable'], correcta: 1, explicacion: 'En el adulto mayor, además, los betabloqueantes impiden la taquicardia que alertaría del problema.' },
          { p: '¿Cuándo es obligatoria la revisión amplia por sistemas?', opciones: ['Solo en el paciente traumatizado grave', 'En todo paciente, siempre y completa', 'Con queja vaga, varias enfermedades crónicas o si se contempla no trasladar'], correcta: 2, explicacion: 'Busca datos que la hipótesis principal no explicaría: es el antídoto del cierre prematuro (capítulo 8).' },
          { p: 'La primera impresión, formada en segundos, responde una sola pregunta. ¿Cuál?', opciones: ['¿Cuál es el diagnóstico más probable?', '¿Está grave o puede estarlo en minutos?', '¿Necesita traslado o puede quedarse?'], correcta: 1, explicacion: 'Si la respuesta es sí, evaluación primaria formal; si es no, primaria breve y paso a la anamnesis.' },
          { p: 'Durante la anamnesis dirigida, ¿qué pregunta sobra?', opciones: ['La que ninguna respuesta posible haría cambiar la conducta', 'La que busca un diagnóstico peligroso poco probable', 'La que confirma un negativo pertinente'], correcta: 0, explicacion: 'Cada pregunta debe poder cambiar la probabilidad de alguna hipótesis (capítulo 5).' },
          { p: 'Al revisar los fármacos, ¿qué se pregunta además de la lista de recetas?', opciones: ['Solo la marca comercial de cada fármaco', 'Productos de venta libre, remedios caseros y plantas medicinales', 'Nada más: basta con la receta vigente'], correcta: 1, explicacion: 'Muchos pacientes no los mencionan si no se les pregunta. Se registran también la hora de la última dosis y la adherencia real.' },
          { p: 'La escena cambia mientras atiende: llega público y un familiar se altera. ¿Qué hace?', opciones: ['Continúa: la seguridad se evaluó al entrar', 'Reevalúa el peligro y, si no puede controlarse, sale', 'Pide al familiar que se calme y sigue con la anamnesis'], correcta: 1, explicacion: 'La seguridad se evalúa antes de entrar, durante la atención y antes de salir.' }
        ]
      },
      {
        tipo: 'tarjetas', titulo: 'Repaso rápido',
        tarjetas: [
          { frente: 'Las tres hipótesis del trayecto', reverso: 'La más probable · la más peligrosa · la que obligaría a llevar un equipo distinto' },
          { frente: 'Los tres tiempos de la anamnesis', reverso: 'Relato libre · anamnesis dirigida por hipótesis · revisión amplia. Cierre con resumen que el paciente corrige.' },
          { frente: 'Interrupción del relato', reverso: 'Mediana de interrupción: 11 s. Sin interrupción, los pacientes necesitaron una mediana de 6 s para exponer su preocupación.' },
          { frente: 'Caracterizar un síntoma', reverso: 'Inicio, localización, carácter, intensidad, irradiación, evolución, factores que lo modifican, síntomas acompañantes y episodios previos' },
          { frente: 'Frecuencia de los signos vitales', reverso: 'Inestable: al menos cada 5 minutos · estable: al menos cada 15 · en ambos, después de cada intervención' },
          { frente: 'Límites de la pulsioximetría', reverso: 'Sobrestima con más frecuencia en pacientes negros · lee la carboxihemoglobina como oxihemoglobina · depende de la altitud de residencia' },
          { frente: 'ECG en posible síndrome coronario', reverso: 'En los primeros 10 minutos del contacto' },
          { frente: 'Seguridad de la escena', reverso: 'Antes de entrar, durante la atención y antes de salir: qué peligro hay, cómo se controla y si el control sigue funcionando' }
        ]
      }
    ]
  });
})();
