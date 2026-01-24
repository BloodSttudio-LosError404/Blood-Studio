const contenedorTarjetas = document.getElementById("cart-container");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const envioElement = document.getElementById("envio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const vaciarCarritoElement = document.getElementById("vaciar");

function crearTarjetasProductosCarrito() {
    contenedorTarjetas.innerHTML = "";
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
    <span class="cantidad">${producto.cantidad}</span>
    <button>+</button>
    </div>
    `;
            contenedorTarjetas.appendChild(nuevoProducto);
            nuevoProducto
                .getElementsByTagName("button")[1]
                .addEventListener("click", (e) => {
                    agregarAlCarrito(producto);
                    const cuantaElement =e.target.parentElementByTagName("span")[0];
                    cuentaCarritoElement.innerText = agregarAlCarrito(producto);
                    actualizarTotales();
        });
            nuevoProducto
                .getElementsByTagName("button")[0]
                .addEventListener("click", (e) => restarAlCarrito(producto))
                crearTarjetasProductosCarrito();
                actualizarTotales();
                
                
        });

    }

}
crearTarjetasProductosCarrito();
actualizarTotales();

function actualizarTotales(){
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    let unidades =0;
    let precio =0;
    if(productos && productos.lengt>0){
        productos.forEach(producto =>{
            unidades += producto.cantidad;
            precio += (producto.precio * producto.cantidad)+ envio;

        })
        unidadesElement.innerText = unidades;
        
        precioElement.innerText = precio;
    }
}

function revisarMeensajeVacio(){
    const productos = JSON.parse(localStorage.getItem("Articulos"));
    carritoVacioElement.classList.toggle("escondido",productos && productos.length>0);
    totales.classList.toggle("escondido",!(productos && productos.length>0));
}
revisarMeensajeVacio();

vaciarCarritoElement.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){
    localStorage.removeItem("Articulos");
    actualizarTotales();
    crearTarjetasProductosCarrito();

}

// Para agregar productos al carrito y que se muetsren en el header
const cuentaCarritoElement = document.getElementById("Cuesta carrito");
function actualizarNumeroCarrito() {
    const memoria = JSON.parse(localStorage.getItem("Articulos"));
    const cuenta = memoria.reduce((acum, current) => acum + current.cuenta, 0);
    cuentaCarritoElement.innerText = cuenta;
}

