const contenedorTarjetas = document.getElementById("product-items-container");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const envioElement = document.getElementById("envio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const vaciarCarritoElement = document.getElementById("vaciar");
const inputCupon = document.querySelector(".cupon input");
const botonCupon = document.querySelector(".aplicar-cupon");

const envio = 0;
let descuentoAplicado = 0;

function guardarCupones() {
    const cupones = [
        {
            codigo: "BLOOM10",
            descuento: 0.10,
            activo: true,
            minimoCompra: 1500
        }
        
    ];
     localStorage.setItem("Cupones", JSON.stringify(cupones));
}


function crearTarjetasProductosCarrito() {
    contenedorTarjetas.innerHTML = "";
    const productos = JSON.parse(localStorage.getItem("Articulos"));

    if (productos && productos.length > 0) {
        productos.forEach((producto) => {
            const nuevoProducto = document.createElement("div");
            nuevoProducto.classList = "tarjeta-producto";

            nuevoProducto.innerHTML = `
                <img src="./img/productos/${producto.id}.jpg" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <div>
                    <button>-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button>+</button>
                </div>
            `;

            contenedorTarjetas.appendChild(nuevoProducto);

            nuevoProducto
                .getElementsByTagName("button")[1]
                .addEventListener("click", (e) => {
                    agregarAlCarrito(producto);
                    crearTarjetasProductosCarrito();
                    actualizarTotales();
                });

            nuevoProducto
                .getElementsByTagName("button")[0]
                .addEventListener("click", (e) => {
                    restarAlCarrito(producto);
                    crearTarjetasProductosCarrito();
                    actualizarTotales();
                });
        });
    }

    revisarMensajeVacio();
}

crearTarjetasProductosCarrito();
actualizarTotales();

function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    let unidades = 0;
    let precio = 0;

    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            unidades += producto.cantidad;
            precio += producto.precio * producto.cantidad;
        });
    }
    precio = precio - (precio * descuentoAplicado);

    unidadesElement.innerText = unidades;
    precioElement.innerText = `$${precio}`;
    envioElement.innerText = `$${envio}`;
}

function revisarMensajeVacio() {
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    carritoVacioElement.style.display = (productos && productos.length > 0) ? "none" : "block";
}

vaciarCarritoElement.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    localStorage.removeItem("Articulos");
    descuentoAplicado = 0;
    botonCupon.disabled = false;
    inputCupon.disabled = false;
    inputCupon.value = "";
    crearTarjetasProductosCarrito();
    actualizarTotales();
}
botonCupon.addEventListener("click", aplicarCupon);

function obtenerTotalCarrito() {
    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    let total = 0;

    productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    return total;
}

function aplicarCupon() {
    const codigoIngresado = inputCupon.value.trim().toUpperCase();
    const cupones = JSON.parse(localStorage.getItem("Cupones")) || [];

    if (!codigoIngresado) {
        alert("Ingresa un cupón");
        return;
    }
    const cupon = cupones.find(c => c.codigo === codigoIngresado);
    if (!cupon || !cupon.activo) {
        alert("Cupón inválido o desactivado");
        return;
    }
    const totalCarrito = obtenerTotalCarrito();
    if (totalCarrito < cupon.minimoCompra) {
        alert(`Compra mínima requerida: $${cupon.minimoCompra}`);
        return;
    }
    descuentoAplicado = cupon.descuento;
    alert(`Cupón aplicado: ${cupon.descuento * 100}%`);
    botonCupon.disabled = true;
    inputCupon.disabled = true;
    actualizarTotales();
}
const cuentaCarritoElement = document.getElementById("shopping_cart");

function actualizarNumeroCarrito() {
    const memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    cuentaCarritoElement.innerText = cuenta;
}
