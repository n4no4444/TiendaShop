// admin.js

// --- Control de acceso: solo admin puede ver esta página ---
document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario || usuario.usuario !== 'admin') {
        window.location.href = '../pages/cuenta.html'; // Redirige si no es admin
        return;
    }

    // --- Utilidades para productos en localStorage ---
    function obtenerProductos() {
        return JSON.parse(localStorage.getItem('productos')) || [];
    }
    function guardarProductos(productos) {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    // --- Sincroniza productos de logica.js con localStorage ---
    if (typeof productos !== 'undefined' && !localStorage.getItem('productos')) {
        guardarProductos(productos);
    }

    // --- Renderizar lista de productos ---
    function renderizarListaAdmin() {
        const lista = document.getElementById('admin-lista-productos');
        const productos = obtenerProductos();
        if (!lista) return;
        lista.innerHTML = '';
        if (productos.length === 0) {
            lista.innerHTML = '<p>No hay productos.</p>';
            return;
        }
        productos.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'card mb-2 p-2 d-flex flex-row align-items-center justify-content-between';
            card.innerHTML = `
        <img src="${p.imagen}" style="width:50px;height:50px;object-fit:cover;" class="rounded me-2" alt="${p.titulo}">
        <div class="flex-grow-1 ms-2">
          <h6 class="mb-1">${p.titulo} N.${p.volumen}</h6>
          <small class="text-muted">${p.editorial} | ${p.autor}</small><br>
          <span class="fw-bold">${p.precio.toLocaleString('es-CL',{style:'currency',currency:'CLP'})}</span>
        </div>
        <div class="d-flex flex-column gap-1">
          <button class="btn btn-sm btn-warning btn-editar" data-idx="${idx}">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-idx="${idx}">Eliminar</button>
        </div>
      `;
            lista.appendChild(card);
        });
        // Eventos editar
        lista.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                cargarProductoEnFormulario(parseInt(this.getAttribute('data-idx')));
            });
        });
        // Eventos eliminar
        lista.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('¿Eliminar este producto?')) {
                    eliminarProducto(parseInt(this.getAttribute('data-idx')));
                }
            });
        });
    }

    // --- Agregar o editar producto ---
    document.getElementById('form-producto').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('producto-id').value;
        const nuevo = {
            id: id ? parseInt(id) : Date.now(),
            titulo: document.getElementById('producto-titulo').value,
            volumen: parseInt(document.getElementById('producto-volumen').value),
            autor: document.getElementById('producto-autor').value,
            editorial: document.getElementById('producto-editorial').value,
            imagen: document.getElementById('producto-imagen').value,
            precio: parseInt(document.getElementById('producto-precio').value)
        };
        let productos = obtenerProductos();
        if (id) {
            // Editar
            const idx = productos.findIndex(p => p.id === nuevo.id);
            if (idx !== -1) productos[idx] = nuevo;
        } else {
            // Agregar
            productos.push(nuevo);
        }
        guardarProductos(productos);
        this.reset();
        document.getElementById('btn-cancelar').style.display = 'none';
        renderizarListaAdmin();
    });

    // --- Cargar producto en formulario para editar ---
    function cargarProductoEnFormulario(idx) {
        const productos = obtenerProductos();
        const p = productos[idx];
        document.getElementById('producto-id').value = p.id;
        document.getElementById('producto-titulo').value = p.titulo;
        document.getElementById('producto-volumen').value = p.volumen;
        document.getElementById('producto-autor').value = p.autor;
        document.getElementById('producto-editorial').value = p.editorial;
        document.getElementById('producto-imagen').value = p.imagen;
        document.getElementById('producto-precio').value = p.precio;
        document.getElementById('btn-cancelar').style.display = '';
    }

    document.getElementById('btn-cancelar').addEventListener('click', function() {
        document.getElementById('form-producto').reset();
        document.getElementById('producto-id').value = '';
        this.style.display = 'none';
    });

    // --- Eliminar producto ---
    function eliminarProducto(idx) {
        let productos = obtenerProductos();
        productos.splice(idx, 1);
        guardarProductos(productos);
        renderizarListaAdmin();
    }

    // --- Inicialización ---
    document.addEventListener('DOMContentLoaded', renderizarListaAdmin);
});
