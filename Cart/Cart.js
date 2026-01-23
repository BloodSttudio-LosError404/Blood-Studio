const contenedorTarjetas = document.getElementById("cart-container");

function crearTarjetasProductosCarrito() {
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    console.log(productos);
    if (productos && productos.length > 0) {
        productos.forEach((producto) => {
            const nuevoProducto = document.createElement("div");
            nuevoProducto.classList = "tarjeta-producto";
            nuevoProducto.innerHTML = `
    /* por definir */<img src="./img/productos/${producto.id}.jpg" alt="Producto 1">
    <h3>${producto.nombre}</h3>
    <p>$${producto.precio}</p>
    <div>
    <button>-</button>
    <span class="cantidad">0</span>
    <button>+</button>
    </div>
    `;
            contenedorTarjetas.appendChild(nuevoProducto);
            nuevoProducto
        });
    }
}
crearTarjetasProductosCarrito();


// Para agregar productos al carrito y que se muetsren en el header
const cuentaCarritoElement = document.getElementById("Cuesta carrito");
function actualizarNumeroCarrito(){
    const memoria = JSON.parse(localStorage.getItem("Articulos"));
    const cuenta = memoria.reduce((acum, current) => acum+current.cuenta,0);
    cuentaCarritoElement.innerText=cuenta;
}

