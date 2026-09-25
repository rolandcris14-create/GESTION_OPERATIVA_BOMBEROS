# Laboratorio de Decisiones Clínicas

Aplicación web interactiva para practicar cada capítulo del manual *Toma de Decisiones Clínicas y Método Clínico en Emergencias Prehospitalarias* (The ResusLab, 2026).

## Cómo abrirla
Abra `index.html` en cualquier navegador (funciona sin servidor y sin conexión, salvo las fuentes tipográficas). Para publicarla, suba la carpeta `app/` a cualquier alojamiento estático (GitHub Pages, Netlify) o incrústela en Thinkific como lección multimedia.

## Diseño didáctico
Cada capítulo sigue el mismo ciclo, pensado para fijar el conocimiento en la tarea real de la ambulancia:

| Principio | Cómo se aplica |
| --- | --- |
| Práctica de recuperación | Preguntas de aplicación y cálculos: el alumno produce la respuesta, no la relee. |
| Simulación en contexto | Casos por fases con monitor de signos vitales: la información llega como en la escena y el alumno decide en cada tiempo. |
| Retroalimentación inmediata | Cada decisión muestra el porqué y el razonamiento experto en voz alta del manual. |
| Error seguro | Las opciones incorrectas reproducen los errores típicos (doble conteo, multiplicar probabilidades, anclaje) y se explican. |
| Herramienta del capítulo | Un simulador propio por capítulo (calculadora bayesiana, escalas, registro de calibración, punto de parada, transferencia...). |
| Dominio | Se aprueba con 80 % de promedio, igual que el curso; las actividades se pueden repetir y se guarda la mejor nota. |
| Repaso espaciado | Cada capítulo cierra con tarjetas de repaso que vuelven al final del mazo si no se recuerdan. |

## Estructura
- `motor.js`: motor común con los tipos de actividad `caso`, `quiz`, `numero`, `clasificar`, `ordenar`, `tarjetas` y `personalizado`, más el progreso guardado en el navegador.
- `capitulos/cNN.js`: contenido y simulador de cada capítulo. Para corregir o ampliar un capítulo basta editar su archivo.
- `estilo.css`: identidad visual de The ResusLab (rojo #B3151B, Montserrat e Inter), con modo oscuro y diseño para móvil.

Herramienta formativa: no sustituye los protocolos locales ni el juicio clínico.
