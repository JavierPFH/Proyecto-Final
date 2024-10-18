const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Configuración de sesión
app.use(session({
    secret: 'mysecret', // Cambiar a cadena segura en prod
    resave: false,
    saveUninitialized: true
}));

// Middleware para el procesamiento de datos POST
app.use(express.urlencoded({ extended: true }));

// Verificar el inicio de sesión (implementar MSAL o recoger de la BBDD)
function login(data) {
    const users = [
        { email: 'usuario@example.com', password: '$2b$10$0BoHh9c9u/XTI59J2KZLseSM9LwwF.S62V2vOx71gSQ4CffwKmCQi' } // Contraseña: password
    ];

    return users.filter(user => user.email === data.email);
}

// Ruta para el formulario de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login.ejs', { login: req.session.logged });
});

// Ruta para procesar el formulario de inicio de sesión
app.post('/login', async (req, res) => {
    const data = req.body;
    const consulta = login(data);
    if (consulta.length === 1 && bcrypt.compareSync(data.password, consulta[0].password)) {
        req.session.logged = true;
        req.session.name = 'Usuario';

        res.render('login.ejs', {
            login: req.session.logged,
            message: `Bienvenido, ${req.session.name}!`
        });
    } else {
        res.render('login.ejs', {
            login: false,
            message: 'Inicio de sesión incorrecto'
        });
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.logged = false;
    res.redirect('/login');
});

app.set('view engine', 'ejs');

// Página principal
app.get('/', (req, res) => {
    res.render('index.ejs', { login: req.session.logged });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
