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
// Estado de sesión
function usuarioEstaLogueado() {
    return !!localStorage.getItem('usuarioLogueado');
}

function obtenerUsuarioLogueado() {
    return localStorage.getItem('usuarioLogueado');
}

function setUsuarioLogueado(usuario) {
    localStorage.setItem('usuarioLogueado', usuario);
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
}

// Renderizar formulario de login
function renderizarLogin() {
    const main = document.getElementById('main-cuenta');
    main.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="mb-4 text-center">Iniciar Sesión</h2>
              <form id="form-login">
                <div class="mb-3">
                  <label for="login" class="form-label">Usuario o Correo</label>
                  <input type="text" class="form-control" id="login" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" class="form-control" id="password" required />
                </div>
                <button type="submit" class="btn main-color text-white w-100">Ingresar</button>
              </form>
              <div class="text-center mt-3">
                <a href="#" id="link-registrarse">Aún no tengo una cuenta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    document.getElementById('form-login').addEventListener('submit', function(e) {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const usuario = buscarUsuario(login);
        if (usuario && usuario.password === password) {
            setUsuarioLogueado(usuario.usuario);
            renderizarCuenta();
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
    document.getElementById('link-registrarse').addEventListener('click', function(e) {
        e.preventDefault();
        renderizarRegistro();
    });
}

// Renderizar formulario de registro
function renderizarRegistro() {
    const main = document.getElementById('main-cuenta');
    main.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="mb-4 text-center">Crear Cuenta</h2>
              <form id="form-registro">
                <div class="mb-3">
                  <label for="usuario" class="form-label">Usuario</label>
                  <input type="text" class="form-control" id="usuario" required />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" id="email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" class="form-control" id="password" required />
                </div>
                <button type="submit" class="btn main-color text-white w-100">Registrarse</button>
              </form>
              <div class="text-center mt-3">
                <a href="#" id="link-login">Ya tengo una cuenta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    document.getElementById('form-registro').addEventListener('submit', function(e) {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (buscarUsuario(usuario) || buscarUsuario(email)) {
            alert('El usuario o correo ya existe');
            return;
        }
        guardarUsuarioNuevo({ usuario, email, password });
        setUsuarioLogueado(usuario);
        renderizarCuenta();
    });
    document.getElementById('link-login').addEventListener('click', function(e) {
        e.preventDefault();
        renderizarLogin();
    });
}

// Renderizar información de la cuenta
function renderizarCuenta() {
    const main = document.getElementById('main-cuenta');
    const usuario = buscarUsuario(obtenerUsuarioLogueado());
    if (!usuario) {
        // Si el usuario no existe, cerrar sesión y mostrar login
        cerrarSesion();
        renderizarLogin();
        return;
    }
    const carrito = obtenerCarritoUsuario(usuario.usuario);
    main.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h2 class="mb-4">Mi Cuenta</h2>
              <p><strong>Usuario:</strong> ${usuario.usuario}</p>
              <p><strong>Email:</strong> ${usuario.email}</p>
              <h5 class="mt-4">Carrito asociado</h5>
              <ul class="list-group mb-3" id="lista-carrito-cuenta">
                ${carrito.length === 0 ? '<li class="list-group-item">Carrito vacío</li>' : carrito.map(p => `<li class="list-group-item">${p.titulo} x${p.cantidad}</li>`).join('')}
              </ul>
              <button id="cerrar-sesion" class="btn btn-danger mt-3">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    document.getElementById('cerrar-sesion').addEventListener('click', function() {
        cerrarSesion();
        renderizarLogin();
    });
}

// Redirección automática a admin.html si el usuario es admin
window.addEventListener('DOMContentLoaded', () => {
    if (typeof getUsuarioLogueado === 'function' && getUsuarioLogueado() === 'admin') {
        if (!window.location.pathname.endsWith('admin.html')) {
            window.location.href = 'pages/admin.html';
        }
    }
});

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    inicializarAdmin();
    if (usuarioEstaLogueado()) {
        console.log('Usuario logueado, renderizando cuenta');
        renderizarCuenta();
    } else {
        console.log('Usuario no logueado, renderizando login');
        renderizarLogin();
    }
});
