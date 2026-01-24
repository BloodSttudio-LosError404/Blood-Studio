// 1. SELECCIÓN DE ELEMENTOS
const contenedorTarjetas = document.getElementById("product-items-container");
const unidadesElement = document.getElementById("unidades"); // Subtotal
const envioElement = document.getElementById("envio");
const precioElement = document.getElementById("precio"); // Total final
const carritoVacioElement = document.getElementById("carrito-vacio");
const vaciarCarritoElement = document.getElementById("vaciar");
const inputCupon = document.querySelector(".cupon input");
const botonCupon = document.querySelector(".aplicar-cupon");

// 2. CONFIGURACIÓN DE CUPONES (Let porque el valor cambia)
const CUPONES_VALIDOS = {
    "BLOOM10": 0.10,
    "VERANO5": 0.05

};
let descuentoAplicado = 0; 

// 3. RENDERIZAR PRODUCTOS
function crearTarjetasProductosCarrito() {
    contenedorTarjetas.innerHTML = "";
    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];

    if (productos.length > 0) {
        carritoVacioElement.classList.add("escondido");

        productos.forEach((producto) => {
            const nuevoProducto = document.createElement("div");
            nuevoProducto.classList = "tarjeta-producto";
            nuevoProducto.innerHTML = `
                <img src="./img/productos/${producto.id}.jpg" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <div>
                    <button class="btn-restar">-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button class="btn-sumar">+</button>
                </div>
            `;
            contenedorTarjetas.appendChild(nuevoProducto);

            // Eventos
            nuevoProducto.querySelector(".btn-sumar").addEventListener("click", () => cambiarCantidad(producto.id, 1));
            nuevoProducto.querySelector(".btn-restar").addEventListener("click", () => cambiarCantidad(producto.id, -1));
        });
    } else {
        carritoVacioElement.classList.remove("escondido");
    }
    actualizarTotales();
}

// 4. CAMBIAR CANTIDAD
function cambiarCantidad(id, cambio) {
    let productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    const indice = productos.findIndex(p => p.id === id);

    if (indice !== -1) {
        productos[indice].cantidad += cambio;
        if (productos[indice].cantidad <= 0) {
            productos.splice(indice, 1);
        }
        localStorage.setItem("Articulos", JSON.stringify(productos));
        crearTarjetasProductosCarrito();
    }
}

// 5. ACTUALIZAR TOTALES
function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    let subtotal = 0;
    let costoEnvio = productos.length > 0 ? 100 : 0; 

    productos.forEach(p => {
        subtotal += (p.precio * p.cantidad);
    });

    let ahorro = subtotal * descuentoAplicado;
    let totalFinal = subtotal - ahorro + costoEnvio;

    // Inyectar en HTML (usando toFixed para centavos)
    unidadesElement.innerText = `$${subtotal.toFixed(2)}`;
    envioElement.innerText = `$${costoEnvio.toFixed(2)}`;
    precioElement.innerText = `$${totalFinal.toFixed(2)}`;
}

// 6. BOTÓN CUPÓN
botonCupon.addEventListener("click", () => {
    const codigo = inputCupon.value.trim().toUpperCase();
    if (CUPONES_VALIDOS[codigo]) {
        descuentoAplicado = CUPONES_VALIDOS[codigo];
        alert("¡Cupón aplicado!");
    } else {
        descuentoAplicado = 0;
        alert("Código no válido");
    }
    actualizarTotales();
});

// 7. VACIAR TODO
vaciarCarritoElement.addEventListener("click", () => {
    localStorage.removeItem("Articulos");
    descuentoAplicado = 0;
    inputCupon.value = "";
    crearTarjetasProductosCarrito();
});

// Inicializar
crearTarjetasProductosCarrito();

// Para agregar productos al carrito y que se muetsren en el header
const cuentaCarritoElement = document.getElementById("Cuesta carrito");
function actualizarNumeroCarrito() {
    const memoria = JSON.parse(localStorage.getItem("Articulos"));
    const cuenta = memoria.reduce((acum, current) => acum + current.cuenta, 0);
    cuentaCarritoElement.innerText = cuenta;
}

