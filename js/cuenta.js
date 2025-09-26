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