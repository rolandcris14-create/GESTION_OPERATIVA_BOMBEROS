# ECOE de Atención Prehospitalaria (CBCM)

Aplicación para la evaluación práctica de paramédicos del Cuerpo de Bomberos del Cantón Morona: sorteo del caso, despacho para el evaluado, área confidencial para el instructor con guía del caso y cronómetro, rúbrica con calificación 2/1/0/NA y acta imprimible en PDF.

## Cómo abrirla
Abra `index.html` en el navegador de la tableta. Necesita conexión para Tailwind y marked (CDN).

## Datos
`datos.js` contiene los 27 casos y el bloque común B1–B6. Se genera a partir de los documentos fuente; no se edita a mano:

```
python3 generar_datos.py Rubricas_evaluacion_practica_APH_CBCM.md Banco_casos_ECOE_APH_CBCM_confidencial.md > datos.js
```

## Reglas de calificación
- Porcentaje = puntos obtenidos ÷ (criterios aplicables × 2) × 100; NA se excluye.
- COMPETENTE: 80 % o más y todos los criterios críticos en 2.
- El bloque común se suma en todas las estaciones excepto A0101.

**Confidencial:** `datos.js` incluye el banco de casos; no publique esta carpeta donde los evaluados puedan verla.
