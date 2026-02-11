/**
 * CARGADOR DE CARDS - GREGORIO DE LA FUENTE
 * 
 * Uso: 
 * 1. Incluir este script en tu página
 * 2. Añadir: <div id="gdlf-gallery" data-categoria="Murales"></div>
 * 3. Opcional: data-categoria="Murales|Surrealistas|Paisajes|Retratos|Bocetos|Artes Aplicadas"
 */

const GDLFGallery = {
    // Configuración
    config: {
        jsonUrl: 'datosObras.json',        // Ruta a tu JSON
        contenedorId: 'gdlf-gallery',      // ID del contenedor
        obrasPorPagina: 24,                // Para paginación
        debug: false                       // Modo desarrollo
    },

    // Estado interno
    estado: {
        todasLasObras: [],
        obrasFiltradas: [],
        paginaActual: 1,
        categoriaActiva: 'todas'
    },

    /**
     * Inicializa la galería
     */
    init: function(opciones = {}) {
        // Sobrescribir configuración
        Object.assign(this.config, opciones);
        
        // Obtener contenedor
        this.contenedor = document.getElementById(this.config.contenedorId);
        
        if (!this.contenedor) {
            console.error(`❌ No se encontró el contenedor #${this.config.contenedorId}`);
            return;
        }

        // Obtener categoría del atributo data
        this.estado.categoriaActiva = this.contenedor.dataset.categoria || 'todas';

        console.log('🖼️ Inicializando galería GDLF...');
        
        // Cargar JSON
        this.cargarJSON();
    },

    /**
     * Carga el archivo JSON
     */
    cargarJSON: function() {
        fetch(this.config.jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.estado.todasLasObras = data.obras || [];
                
                console.log(`✅ Cargadas ${this.estado.todasLasObras.length} obras`);
                
                // Aplicar filtro inicial
                this.filtrarObras();
                
                // Renderizar
                this.renderizar();
                
                // Inicializar eventos
                this.inicializarEventos();
            })
            .catch(error => {
                console.error('❌ Error cargando JSON:', error);
                this.mostrarError('No se pudo cargar el catálogo de obras');
            });
    },

    /**
     * Filtra obras por categoría
     */
    filtrarObras: function() {
        if (this.estado.categoriaActiva === 'todas') {
            this.estado.obrasFiltradas = [...this.estado.todasLasObras];
        } else {
            this.estado.obrasFiltradas = this.estado.todasLasObras.filter(
                obra => obra.categoria === this.estado.categoriaActiva
            );
        }
    },

    /**
     * Renderiza las cards en el DOM
     */
    renderizar: function() {
        const obras = this.estado.obrasFiltradas;
        
        if (obras.length === 0) {
            this.contenedor.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #f9f9f9;
                    border-radius: 12px;
                    color: #666;
                ">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">📭 No hay obras en esta categoría</p>
                    <p style="font-size: 0.9rem;">Categoría seleccionada: ${this.estado.categoriaActiva}</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="gdlf-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 1rem;
            ">
                <div>
                    <h2 style="margin: 0; font-size: 1.5rem;">
                        ${this.estado.categoriaActiva === 'todas' ? 'Todas las obras' : this.estado.categoriaActiva}
                    </h2>
                    <p style="margin: 0.25rem 0 0 0; color: #666;">
                        ${obras.length} obras documentadas
                    </p>
                </div>
                
                <!-- Selector de categoría rápido -->
                <select id="gdlf-categoria-select" style="
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    font-size: 0.9rem;
                ">
                    <option value="todas" ${this.estado.categoriaActiva === 'todas' ? 'selected' : ''}>Todas las categorías</option>
                    <option value="Murales" ${this.estado.categoriaActiva === 'Murales' ? 'selected' : ''}>Murales</option>
                    <option value="Surrealistas" ${this.estado.categoriaActiva === 'Surrealistas' ? 'selected' : ''}>Surrealistas</option>
                    <option value="Paisajes" ${this.estado.categoriaActiva === 'Paisajes' ? 'selected' : ''}>Paisajes</option>
                    <option value="Retratos" ${this.estado.categoriaActiva === 'Retratos' ? 'selected' : ''}>Retratos</option>
                    <option value="Bocetos" ${this.estado.categoriaActiva === 'Bocetos' ? 'selected' : ''}>Bocetos</option>
                    <option value="Artes Aplicadas" ${this.estado.categoriaActiva === 'Artes Aplicadas' ? 'selected' : ''}>Artes Aplicadas</option>
                </select>
            </div>
            
            <div class="gdlf-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 2rem;
            ">
        `;

        obras.forEach(obra => {
            const tituloMostrar = obra.tiene_titulo ? obra.titulo : 'Sin título';
            const sinTituloClass = !obra.tiene_titulo ? 'sin-titulo' : '';
            
            html += `
                <article class="gdlf-card ${sinTituloClass}" style="
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    border: 1px solid #eaeaea;
                    display: flex;
                    flex-direction: column;
                ">
                   
                <div style="
    position: relative;
    padding-top: 75%;
    background: #f5f5f5;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
">
    <img 
        src="${obra.archivo_thumbnail || 'https://via.placeholder.com/300x225?text=Sin+imagen'}"
        alt="${tituloMostrar} - Gregorio de la Fuente"
        loading="lazy"
        style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: calc(100% - 2rem);
            max-height: calc(100% - 2rem);
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: white;
        "
        onerror="this.src='https://via.placeholder.com/300x225?text=Error'"
    >
</div>
                    
                    <div style="padding: 2.5rem; flex-grow: 1;">
                        <span style="
                            display: inline-block;
                            padding: 0.25rem 0.75rem;
                            background: ${this.getColorCategoria(obra.categoria)};
                            color: white;
                            border-radius: 20px;
                            font-size: 0.75rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            margin-bottom: 0.75rem;
                        ">${obra.categoria}</span>
                        
                        <h3 style="
                            margin: 0 0 0.5rem 0;
                            font-size: 1.1rem;
                            font-weight: 600;
                            color: ${obra.tiene_titulo ? '#111' : '#999'};
                            font-style: ${obra.tiene_titulo ? 'normal' : 'italic'};
                        ">${tituloMostrar}</h3>
                        
                        <div style="
                            margin-top: 0.75rem;
                            font-size: 0.85rem;
                            color: #666;
                        ">
                            ${obra.año ? `<div><strong>Año:</strong> ${obra.año}</div>` : ''}
                            ${obra.tecnica ? `<div><strong>Técnica:</strong> ${obra.tecnica}</div>` : ''}
                            ${obra.dimensiones ? `<div><strong>Dimensiones:</strong> ${obra.dimensiones}</div>` : ''}
                            ${obra.ubicacion ? `<div><strong>Ubicación:</strong> ${obra.ubicacion}</div>` : ''}
                        </div>
                        
                        ${!obra.tiene_titulo ? `
                            <div style="
                                margin-top: 1rem;
                                padding: 0.5rem;
                                background: #fff4e5;
                                border-left: 3px solid #ff9800;
                                color: #663c00;
                                font-size: 0.75rem;
                                border-radius: 4px;
                            ">
                                ⚠️ Título pendiente de catalogación
                            </div>
                        ` : ''}
                    </div>
                </article>
            `;
        });

        html += `
            </div>
        `;

        this.contenedor.innerHTML = html;
    },

    /**
     * Obtiene color según categoría
     */
    getColorCategoria: function(categoria) {
        const colores = {
            'Murales': '#8B4513',
            'Surrealistas': '#4A4A8C',
            'Paisajes': '#2E7D5E',
            'Retratos': '#9B4D4D',
            'Bocetos': '#6B4E71',
            'Artes Aplicadas': '#666666'
        };
        return colores[categoria] || '#666666';
    },

    /**
     * Inicializa eventos (selector de categoría)
     */
    inicializarEventos: function() {
        const select = document.getElementById('gdlf-categoria-select');
        if (select) {
            select.addEventListener('change', (e) => {
                this.estado.categoriaActiva = e.target.value;
                this.filtrarObras();
                this.renderizar();
            });
        }
    },

    /**
     * Muestra error en el contenedor
     */
    mostrarError: function(mensaje) {
        this.contenedor.innerHTML = `
            <div style="
                text-align: center;
                padding: 4rem 2rem;
                background: #fff2f0;
                border: 1px solid #ffccc7;
                border-radius: 12px;
                color: #610b00;
            ">
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">❌ Error</p>
                <p style="font-size: 0.9rem;">${mensaje}</p>
            </div>
        `;
    }
};

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('gdlf-gallery')) {
        GDLFGallery.init();
    }
});

// Exponer globalmente (para uso manual)
window.GDLFGallery = GDLFGallery;