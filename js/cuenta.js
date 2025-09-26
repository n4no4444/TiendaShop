// cuenta.js

console.log('cuenta.js cargado');

// Inicializar usuario admin por defecto si no existe
function inicializarAdmin() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (!usuarios.find(u => u.usuario === 'admin')) {
        usuarios.push({ usuario: 'admin', email: 'admin', password: 'Contraseña' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Guardar datos de usuario en localStorage
function guardarUsuarioNuevo(datos) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(datos);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}
// Buscar usuario por usuario o email
function buscarUsuario(login) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.find(u => u.usuario === login || u.email === login);
}

// Guardar carrito asociado al usuario
function guardarCarritoUsuario(usuario, carrito) {
    localStorage.setItem('carrito_' + usuario, JSON.stringify(carrito));
}

// Obtener carrito asociado al usuario
function obtenerCarritoUsuario(usuario) {
    return JSON.parse(localStorage.getItem('carrito_' + usuario)) || [];
}
