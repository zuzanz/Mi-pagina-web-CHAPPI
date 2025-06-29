const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const routes = require('./routes/index'); // Verifica que este archivo está importado correctamente

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// //Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Configurar sesiones
app.use(session({
    secret: 'mi_secreto_seguro',
    resave: false,
    saveUninitialized: true,
}));
////////
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
////////
app.use(express.static('public'));
///////
app.use('/', routes); // Usar rutas definidas en index.js

app.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
