// ============================================
// EXTRACTOR DE OBRAS - GREGORIO DE LA FUENTE
// ============================================
// Cómo usar:
// 1. Abre cada página (murales, surrealistas, paisajes, etc.)
// 2. Pega esto en la consola del navegador (F12)
// 3. Copia el JSON generado
// ============================================

(function() {
    'use strict';

    // Configuración
    const DEBUG = true;
    
    // Detectar automáticamente la categoría desde el título de la página
    function detectarCategoria() {
        const titulo = document.title.toLowerCase();
        const bodyHTML = document.body.innerHTML;
        
        if (titulo.includes('mural') || bodyHTML.includes('murales')) return 'Murales';
        if (titulo.includes('surreal') || bodyHTML.includes('surrealista')) return 'Surrealistas';
        if (titulo.includes('paisaje') || bodyHTML.includes('paisajes')) return 'Paisajes';
        if (titulo.includes('retrato') || bodyHTML.includes('retratos')) return 'Retratos';
        if (titulo.includes('boceto') || bodyHTML.includes('bocetos')) return 'Bocetos';
        if (titulo.includes('otras') || bodyHTML.includes('artes aplicadas')) return 'Artes Aplicadas';
        return 'Sin categoría';
    }

    // Buscar TODAS las tablas que contienen obras
    function encontrarObras() {
        const obras = [];
        const categoriaGlobal = detectarCategoria();
        
        console.log(`🔍 Categoría detectada: ${categoriaGlobal}`);
        
        // Seleccionar todas las tablas con borde negro (formato característico)
        const tablas = document.querySelectorAll('table[bgcolor="#000000"], table[bgcolor="black"]');
        
        tablas.forEach((tabla, index) => {
            try {
                // Buscar thumbnail
                const thumbnailLink = tabla.querySelector('a[href*=".jpg"], a[rel="lightbox"]');
                if (!thumbnailLink) return;
                
                // URL de la imagen grande
                const imagenGrande = thumbnailLink.getAttribute('href') || '';
                
                // URL del thumbnail (con _r)
                const thumbnailImg = thumbnailLink.querySelector('img');
                const thumbnailSrc = thumbnailImg ? thumbnailImg.src : '';
                
                // Dimensiones del thumbnail
                const ancho = thumbnailImg ? thumbnailImg.width : null;
                const alto = thumbnailImg ? thumbnailImg.height : null;
                
                // Buscar título (en la fila siguiente o dentro de la tabla)
                let titulo = '';
                let tituloElement = null;
                
                // Buscar en la celda de título (patrón: bgcolor="#FFFFFF" class="Arial_11")
                const filas = tabla.querySelectorAll('tr');
                filas.forEach(fila => {
                    const celdas = fila.querySelectorAll('td');
                    celdas.forEach(celda => {
                        if (celda.bgColor === '#FFFFFF' || celda.style.backgroundColor === 'white' || 
                            (celda.className && celda.className.includes('Arial_11'))) {
                            const texto = celda.innerText.trim();
                            if (texto && texto !== 'Titulo obra' && texto !== 'Título Obra') {
                                titulo = texto;
                                tituloElement = celda;
                            }
                        }
                    });
                });
                
                // Si no encontró, buscar en el texto del link o alt
                if (!titulo && thumbnailImg) {
                    titulo = thumbnailImg.alt || '';
                }
                
                // Extraer nombre del archivo
                const nombreArchivo = imagenGrande.split('/').pop() || '';
                const nombreBase = nombreArchivo.replace('_r.jpg', '').replace('.jpg', '');
                
                // Detectar si es thumbnail (contiene _r)
                const esThumbnail = thumbnailSrc.includes('_r.jpg');
                
                // Construir objeto obra
                const obra = {
                    id: `gdlf-${categoriaGlobal}-${index + 1}`.toLowerCase().replace(/\s+/g, '-'),
                    titulo: titulo || 'Sin título',
                    titulo_original: tituloElement ? tituloElement.innerText.trim() : '',
                    categoria: categoriaGlobal,
                    archivo_original: imagenGrande,
                    archivo_thumbnail: thumbnailSrc,
                    nombre_archivo: nombreArchivo,
                    nombre_base: nombreBase,
                    dimensiones_thumbnail: ancho && alto ? `${ancho}x${alto}` : null,
                    es_placeholder: titulo === 'Titulo obra' || titulo === 'Título Obra',
                    tiene_titulo: !(titulo === 'Titulo obra' || titulo === 'Título Obra' || titulo === 'Sin título'),
                    tecnica: null,
                    año: null,
                    dimensiones: null,
                    ubicacion: null
                };
                
                // Intentar extraer metadatos adicionales del texto
                if (obra.tiene_titulo && obra.titulo) {
                    // Buscar años (1943, 1952, etc.)
                    const años = obra.titulo.match(/\b(19|20)\d{2}\b/g);
                    if (años) obra.año = años[0];
                    
                    // Buscar técnicas (fresco, mosaico, óleo, etc.)
                    const tecnicas = ['fresco', 'mosaico', 'óleo', 'témpera', 'esmalte', 'cerámica', 'cloisonné'];
                    tecnicas.forEach(tec => {
                        if (obra.titulo.toLowerCase().includes(tec)) {
                            obra.tecnica = tec;
                        }
                    });
                    
                    // Buscar dimensiones (patrón: 120x60 cm, 48x48cm, etc.)
                    const dims = obra.titulo.match(/\b(\d+)[xX](\d+)\s*(cm)?\b/);
                    if (dims) {
                        obra.dimensiones = `${dims[1]}x${dims[2]} cm`;
                    }
                }
                
                obras.push(obra);
                
                if (DEBUG) {
                    console.log(`✅ Obra ${obras.length}: ${obra.titulo || 'Sin título'}`);
                }
                
            } catch (e) {
                console.error('Error procesando tabla:', e);
            }
        });
        
        return obras;
    }

    // Ejecutar extracción
    console.log('='.repeat(50));
    console.log('🖼️ EXTRACTOR DE OBRAS - GREGORIO DE LA FUENTE');
    console.log('='.repeat(50));
    
    const obras = encontrarObras();
    
    // Resultado final
    const resultado = {
        metadata: {
            pagina: window.location.href,
            categoria: detectarCategoria(),
            fecha_extraccion: new Date().toISOString(),
            total_obras: obras.length
        },
        obras: obras
    };
    
    console.log('\n📊 RESUMEN:');
    console.log(`Categoría: ${resultado.metadata.categoria}`);
    console.log(`Total obras: ${resultado.metadata.total_obras}`);
    console.log(`Con título: ${obras.filter(o => o.tiene_titulo).length}`);
    console.log(`Sin título: ${obras.filter(o => !o.tiene_titulo).length}`);
    console.log('\n📋 JSON generado:');
    
    // Mostrar JSON para copiar
    const jsonString = JSON.stringify(resultado, null, 2);
    console.log(jsonString);
    
    // Copiar al portapapeles automáticamente
    try {
        const el = document.createElement('textarea');
        el.value = jsonString;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        console.log('\n✅ JSON copiado al portapapeles');
    } catch (e) {
        console.log('\n⚠️ Copia manualmente el JSON de arriba');
    }
    
    return resultado;
})();