// logica.js

// Lista de productos disponibles en catálogo
const productos = [
    {
        id: 1,
        titulo: "One Piece",
        volumen: 1,
        autor: "Eiichiro Oda",
        editorial: "Ivrea Ar",
        imagen: "/img/OnePiece_1_IVREAAR.jpg",
        precio: 9990
    },
    {
        id: 2,
        titulo: "Dorohedoro",
        volumen: 1,
        autor: "Q Hayashida",
        editorial: "Panini",
        imagen: "/img/Dorohedoro_1_PANINI.jpg",
        precio: 10990
    },
    {
        id: 3,
        titulo: "Buenas Noches PunPun",
        volumen: 1,
        autor: "Inio Asano",
        editorial: "Ivrea Ar",
        imagen: "/img/BuenasNochesPunpun_IVREAAR.jpg",
        precio: 9990
    },
    {
        id: 4,
        titulo: "Los Diarios De La Boticaria",
        volumen: 1,
        autor: "Maria V. Giner",
        editorial: "Panini",
        imagen: "/img/LosDiariosDeLaBoticaria_1_PANINI.jpg",
        precio: 10990
    },
    {
        id: 5,
        titulo: "Vagabond",
        volumen: 1,
        autor: "Takehiko Inoue",
        editorial: "Ivrea Ar",
        imagen: "/img/Vagabond_1_IVREAAR.jpg",
        precio: 9990
    },
    {
        id: 6,
        titulo: "Atelier of Witch Hat",
        volumen: 1,
        autor: "Kamome Shirahama",
        editorial: "Milky Way",
        imagen: "/img/AtelierOfWitchHat_1_MILKYWAY.jpg",
        precio: 12990
    },
    {
        id: 7,
        titulo: "Chainsaw Man",
        volumen: 1,
        autor: "Tatsuki Fujimoto",
        editorial: "Ivrea Ar",
        imagen: "/img/ChainsawMan_1_IVREAAR.jpg",
        precio: 9990
    },
    {
        id: 8,
        titulo: "Dandadan",
        volumen: 1,
        autor: "Yukinobu Tatsu",
        editorial: "Ivrea Ar",
        imagen: "/img/Dandadan_1_IVREAAR.jpg",
        precio: 9990
    },
];

// Función para formatear precio a string con $
function formatearPrecio(precio) {
    return `$${precio.toLocaleString('es-CL')}`;
}

// --- Obtener usuario logueado desde cuenta.js si existe ---
function getUsuarioLogueado() {
    if (typeof obtenerUsuarioLogueado === 'function') {
        return obtenerUsuarioLogueado();
    }
    return localStorage.getItem('usuarioLogueado');
}

// --- Guardar carrito por usuario si está logueado ---
function guardarCarrito(carrito) {
    const usuario = getUsuarioLogueado();
    if (usuario) {
        if (typeof guardarCarritoUsuario === 'function') {
            guardarCarritoUsuario(usuario, carrito);
        } else {
            localStorage.setItem('carrito_' + usuario, JSON.stringify(carrito));
        }
    } else {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
}

// --- Obtener carrito por usuario si está logueado ---
function obtenerCarrito() {
    const usuario = getUsuarioLogueado();
    if (usuario) {
        if (typeof obtenerCarritoUsuario === 'function') {
            return obtenerCarritoUsuario(usuario);
        } else {
            return JSON.parse(localStorage.getItem('carrito_' + usuario)) || [];
        }
    } else {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }
}

// --- Obtener productos desde localStorage si existen, si no usar los hardcodeados ---
function getProductosCatalogo() {
    return JSON.parse(localStorage.getItem('productos')) || productos;
}

// --- Renderiza el catálogo en el contenedor con id "lista-productos" ---
function renderizarCatalogo() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    getProductosCatalogo().forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col-3';
        card.innerHTML = `
    <div class="card h-100 product-card">
    <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.titulo} Vol.${producto.volumen}">
      <div class="card-body">
        <h5 class="card-title">${producto.titulo} N.${producto.volumen}</h5>
        <p class="card-text">Editorial ${producto.editorial}</p>
        <p class="card-text">${formatearPrecio(producto.precio)}</p>
        <a href="#" class="btn main-color text-white w-100 btn-agregar" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    </div>
    `;

        contenedor.appendChild(card);
    });

    // Agregar evento click a todos los botones "Agregar al carrito"
    const botonesAgregar = contenedor.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// --- Función para agregar un producto al carrito ---
function agregarAlCarrito(event) {
    event.preventDefault();
    const idProducto = parseInt(event.currentTarget.getAttribute('data-id'));
    // Buscar el producto en el catálogo actualizado, no en la lista estática
    const producto = getProductosCatalogo().find(p => p.id === idProducto);
    if (!producto) return;

    // Obtener carrito desde localStorage o por usuario
    let carrito = obtenerCarrito();

    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === producto.id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    // Guardar carrito actualizado
    guardarCarrito(carrito);

    alert(`${producto.titulo} agregado al carrito.`);
    // Opcional: actualizar la vista del carrito si tienes un contenedor para eso
}

// --- Renderiza el carrito en el contenedor con id "lista-carrito" ---
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    // Contenedor vertical y total a la derecha
    const wrapper = document.createElement('div');
    wrapper.className = 'd-flex flex-row align-items-start justify-content-between';

    // Lista de productos (vertical)
    const lista = document.createElement('div');
    lista.className = 'd-flex flex-column gap-2';
    lista.style.minWidth = '320px';
    lista.style.maxWidth = '420px';

    let total = 0;
    carrito.forEach((producto, idx) => {
        total += producto.precio * producto.cantidad;
        const card = document.createElement('div');
        card.className = 'card mb-2 py-2 px-5 d-flex flex-row align-items-center justify-content-between';
        card.style.width = '100%';
        card.innerHTML = `
      <img src="${producto.imagen}" style="width:60px;height:60px;object-fit:cover;" class="rounded me-2" alt="${producto.titulo}">
      <div class="flex-grow-1 ms-2">
        <h6 class="mb-1">${producto.titulo} N.${producto.volumen}</h6>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary btn-restar" data-idx="${idx}">-</button>
          <span class="mx-1">${producto.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary btn-sumar" data-idx="${idx}">+</button>
        </div>
        <small class="text-muted">${formatearPrecio(producto.precio)} c/u</small>
      </div>
      <div class="text-end">
        <strong>${formatearPrecio(producto.precio * producto.cantidad)}</strong>
      </div>
    `;
        lista.appendChild(card);
    });

    // Apartado de total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'card p-3 ms-3';
    totalDiv.style.minWidth = '180px';
    totalDiv.innerHTML = `
    <h5 class="mb-3">Total</h5>
    <div class="fs-4 fw-bold">${formatearPrecio(total)}</div>
    <button class="btn main-color text-white w-100 mt-3">Finalizar Compra</button>
  `;

    wrapper.appendChild(lista);
    wrapper.appendChild(totalDiv);
    contenedor.appendChild(wrapper);

    // Eventos para sumar/restar cantidad
    lista.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            let carrito = obtenerCarrito();
            carrito[idx].cantidad += 1;
            guardarCarrito(carrito);
            renderizarCarrito();
        });
    });
    lista.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            let carrito = obtenerCarrito();
            if (carrito[idx].cantidad > 1) {
                carrito[idx].cantidad -= 1;
            } else {
                carrito.splice(idx, 1);
            }
            guardarCarrito(carrito);
            renderizarCarrito();
        });
    });
}

// --- Inicializar productos en localStorage si no existen ---
if (!localStorage.getItem('productos') || JSON.parse(localStorage.getItem('productos')).length === 0) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Ejecutar renderizado del catálogo cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    renderizarCarrito(); // si tienes contenedor para carrito en la página actual
});

// --- Actualiza catálogo automáticamente si cambia localStorage (productos) ---
window.addEventListener('storage', function(e) {
    if (e.key === 'productos') {
        renderizarCatalogo();
    }
});
