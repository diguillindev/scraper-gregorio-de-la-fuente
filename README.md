
🖼️ GDLF-Archivo: Extractor y Visualizador - Gregorio de la Fuente
Herramienta de extracción, normalización y visualización del archivo digital del pintor y muralista chileno Gregorio de la Fuente (1910-1999).

https://img.shields.io/badge/estado-producci%C3%B3n-success
https://img.shields.io/badge/licencia-MIT-blue
https://img.shields.io/badge/tecnolog%C3%ADa-vanilla_JS-f7df1e
https://img.shields.io/badge/patrimonio-cultural_chileno-8B4513

📋 Descripción general
Este repositorio contiene un sistema de extracción y visualización diseñado para rescatar, normalizar y exhibir el archivo digital de Gregorio de la Fuente, construido originalmente entre 2000 y 2005 con HTML estático y tablas.

El problema:
Más de 350 obras de arte documentadas en HTML obsoleto, con títulos incompletos, estructura inconsistente y riesgo de pérdida inminente.

La solución:
Scripts de extracción que convierten HTML legacy en JSON estructurado + visualizador dinámico que carga los datos desde un archivo externo.

No es un ejercicio académico. Es un rescate en producción.

🛠️ Tecnologías
JavaScript vanilla – 100% nativo, cero dependencias

Fetch API – Carga asíncrona de JSON

CSS Grid / Flexbox – Visualización responsive

DOM Parsing – Extracción desde HTML legacy (2000)

Sin jQuery, sin frameworks, sin plugins. Código transferible.

📁 Estructura del repositorio
text
gdlf-archivo/
│
├── /scraper/               # Scripts de extracción
│   ├── extractor.js       # Extrae datos desde HTML
│   └── normalizador.js    # Limpia y estandariza campos
│
├── /api/                  
│   └── obras.json        # Catálogo completo (353 obras)
│
├── /visualizador/         # Galería dinámica
│   ├── cargador-cards.js # Carga JSON y genera cards
│   ├── estilos-cards.css # Estilos responsive
│   └── index.html        # Página de ejemplo
│
└── README.md
🚀 Scripts principales
1. Extractor desde consola
js
// 1. Abre cualquier página del sitio original
// 2. Pega extractor.js en la consola (F12)
// 3. Obtienes JSON listo para copiar
const obras = extraerObras();
console.log(JSON.stringify(obras, null, 2));
// Se copia automáticamente al portapapeles
2. Visualizador con JSON externo
html
<!-- Una línea en tu HTML -->
<div id="gdlf-gallery" data-categoria="Murales"></div>
<script src="visualizador/cargador-cards.js"></script>
<!-- El script carga obras.json y genera las cards -->
📊 Estado del archivo
Categoría	Obras	Títulos	Pendiente
Murales	36	36	0
Surrealistas	122	14	108
Paisajes	96	7	89
Retratos	28	13	15
Bocetos	50	0	50
Artes Aplicadas	21	0	21
Total	353	70	283
Período documentado: 1930–2005
Premios: 27 registros
Exposiciones: 21 registros
Bibliografía: 25 publicaciones

