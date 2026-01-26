let currentOffset = 0;
const track = document.getElementById('product-track');

// 1. Cargar productos desde el JSON
async function cargarProductos() {
    try {
        const response = await fetch('../src/data/products.catalog.json'); // Asegúrate que el nombre sea exacto
        const data = await response.json();

        // ACCESO CORRECTO: Entramos a la propiedad 'products' del objeto
        if (data && data.products) {
            renderizarProductos(data.products);
        } else {
            console.error("No se encontró la lista de productos en el JSON");
        }
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }
}

function renderizarProductos(lista) {
    const track = document.getElementById('product-track');
    
    track.innerHTML = lista.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.image.src}" alt="${p.image.alt}">
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                <p class="description">${p.description}</p>
                
                <div class="card-footer">
                    <div class="price-badge">$${p.price.toFixed(2)}</div>
                    <div class="reviews">
                        <span class="star-icon">⭐</span>
                        <span class="rating-text">${p.rating} (${p.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Función para mover el carrusel
function moveSlide(direction) {
    const cardWidth = document.querySelector('.product-card').offsetWidth + 20;
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

    currentOffset += direction * cardWidth;

    // Limites para que no se salga del contenido
    if (currentOffset < 0) currentOffset = 0;
    if (currentOffset > maxScroll) currentOffset = maxScroll;

    track.style.transform = `translateX(-${currentOffset}px)`;
}

// Iniciar
cargarProductos();
