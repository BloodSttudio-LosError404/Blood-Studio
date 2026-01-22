const contenedorTarjetas = document.getElementById("cart-container");

function crearTarjetasProductosCarrito() {
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    console.log(productos);
    if (productos && productos.length > 0) {
        productos.forEach((producto) => {
            const nuevaBicicleta = document.createElement("div");
            nuevaBicicleta.classList = "tarjeta-producto";
            nuevaBicicleta.innerHTML = `
    /* por definir */<img src="./img/productos/${producto.id}.jpg" alt="Bicicleta 1">
    <h3>${producto.nombre}</h3>
    <p>$${producto.precio}</p>
    <div>
    <button>-</button>
    <span class="cantidad">0</span>
    <button>+</button>
    </div>
    `;
            contenedorTarjetas.appendChild(nuevaBicicleta);
            nuevaBicicleta
        });
    }
}
crearTarjetasProductosCarrito();