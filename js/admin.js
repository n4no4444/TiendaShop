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



    // --- Inicialización ---
    document.addEventListener('DOMContentLoaded', renderizarListaAdmin);
});
