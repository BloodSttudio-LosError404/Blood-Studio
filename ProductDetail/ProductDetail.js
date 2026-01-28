// Codigo del js para el carrito en la pagina de detalle de producto

// 1. Definimos el producto que se muestra actualmente en la página
// Nota: El ID debe ser único para que el carrito no se confunda
const productoActual = {
    id: 10,
    nombre: "Duo en Tom & Jerry",
    precio: 899,
    img: "/img/Catalogo/Sudaderas/DuoTomJerry.png"
};

// 2. Esperamos a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btn-add-to-cart");

    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(productoActual);
            // Opcional: Feedback al usuario
            alert("¡Producto añadido al carrito!");
            actualizarNumeroCarrito(); // Para que el número del header suba
        });
    }
    
    // Inicializar el número del carrito al cargar la página
    actualizarNumeroCarrito();
});

/** * Estas funciones deben ser espejos de las que usas en tu tienda
 * para que la "memoria" (localStorage) sea la misma.
 */
function agregarAlCarrito(producto) {
    // Revisar si hay algo en el local storage
    let memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    
    // Buscar si el producto ya existe en el carrito
    const indiceProducto = memoria.findIndex(item => item.id === producto.id);

    if (indiceProducto === -1) {
        // Si no existe, lo agregamos con cantidad 1
        const nuevoProducto = { ...producto, cantidad: 1 };
        memoria.push(nuevoProducto);
    } else {
        // Si ya existe, aumentamos la cantidad
        memoria[indiceProducto].cantidad++;
    }

    // Guardamos de nuevo en localStorage
    localStorage.setItem("Articulos", JSON.stringify(memoria));
}

function actualizarNumeroCarrito() {
    const cuentaCarritoElement = document.getElementById("cuenta-carrito");
    if (cuentaCarritoElement) {
        const memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
        const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
        cuentaCarritoElement.innerText = cuenta;
    }
}


// Codigo del js para el selector de color y talla en la pagina de detalle de producto

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btn-add-to-cart");
    const colores = document.querySelectorAll("#color-selector .dot");
    const tallas = document.querySelectorAll("#size-selector .pill");

    let colorSeleccionado = null;
    let tallaSeleccionada = null;

    // --- Lógica de Selección Visual ---

    // Selección de Color
    colores.forEach(dot => {
        dot.addEventListener("click", () => {
            colores.forEach(d => d.style.border = "none"); // Limpiar selección anterior
            dot.style.border = "2px solid #000"; // Resaltar seleccionado
            colorSeleccionado = dot.getAttribute("data-color");
        });
    });

    // Selección de Talla
    tallas.forEach(pill => {
        pill.addEventListener("click", () => {
            tallas.forEach(p => p.style.backgroundColor = ""); // Limpiar otros
            tallas.forEach(p => p.style.color = "");
            pill.style.backgroundColor = "#ffc8a2"; // Color de tu diseño
            pill.style.color = "white";
            tallaSeleccionada = pill.getAttribute("data-size");
        });
    });

    // --- Botón Añadir al Carrito ---

    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            // VALIDACIÓN: Si no ha seleccionado ambos, avisamos
            if (!colorSeleccionado || !tallaSeleccionada) {
                alert("Por favor, selecciona una talla y un color antes de continuar.");
                return;
            }

            const productoParaCarrito = {
                id: 10, 
                nombre: `Duo Tom & Jerry (${colorSeleccionado} - ${tallaSeleccionada})`,
                precio: 899,
                img: "/img/Catalogo/Sudaderas/DuoTomJerry.png",
                color: colorSeleccionado,
                talla: tallaSeleccionada
            };

            agregarAlCarrito(productoParaCarrito);
            alert(`¡Agregado! Color: ${colorSeleccionado}, Talla: ${tallaSeleccionada}`);
            actualizarNumeroCarrito();
        });
    }
    
    actualizarNumeroCarrito();
});

// Mantén tus funciones agregarAlCarrito() y actualizarNumeroCarrito() igual que antes




// 1.  "Base de Datos" 
const baseDeDatos = [
    { id: 1, nombre: "Veloziraptor", precio: 111111, img: "/img/productos/1.jpg", descripcion: "Descripción de la Veloziraptor..." },
    { id: 10, nombre: "Duo en Tom & Jerry", precio: 899, img: "/img/Catalogo/Sudaderas/DuoTomJerry.png", descripcion: "Dúo de sudaderas icónicas..." },
    // ... agrega el resto de tus productos aquí
];

document.addEventListener("DOMContentLoaded", () => {
    // 2. Obtener el ID de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(queryParams.get("id"));

    // 3. Buscar el producto en la base de datos
    const producto = baseDeDatos.find(p => p.id === idProducto);

    if (producto) {
        cargarDatosProducto(producto);
    } else {
        console.error("Producto no encontrado");
        // Opcional: redireccionar a la tienda si no existe el ID
    }
});

// 4. Función para inyectar la información en el HTML
function cargarDatosProducto(producto) {
    document.getElementById("nombre-producto").innerText = producto.nombre;
    document.getElementById("precio-producto").innerText = `$${producto.precio}.00`;
    document.getElementById("img-producto").src = producto.img;
    
    // Si tienes un contenedor de descripción:
    if(document.getElementById("descripcion-producto")) {
        document.getElementById("descripcion-producto").innerText = producto.descripcion;
    }

    // Configurar el botón de añadir al carrito con el producto encontrado
    configurarBotonCarrito(producto);
}

function configurarBotonCarrito(producto) {
    const btnAgregar = document.getElementById("btn-add-to-cart");
    btnAgregar.onclick = () => {
        // Aquí recuperas la talla y color que seleccionó el usuario
        const talla = document.querySelector(".pill.selected")?.dataset.size;
        const color = document.querySelector(".dot.selected")?.dataset.color;

        if (!talla || !color) {
            alert("Selecciona talla y color");
            return;
        }

        const productoFinal = {
            ...producto,
            nombre: `${producto.nombre} (${color} - ${talla})`,
            talla,
            color
        };

        agregarAlCarrito(productoFinal);
        actualizarNumeroCarrito();
        alert("¡Agregado al carrito!");
    };
}