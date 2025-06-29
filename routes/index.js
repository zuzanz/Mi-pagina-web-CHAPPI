const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Páginas públicas
router.get('/', (req, res) => res.render('inicio'));
router.get('/login', (req, res) => res.render('login'));
router.get('/registro', (req, res) => res.render('registro'));
router.get('/contacto', (req, res) => res.render('contacto'));

// Registro de usuario
router.post('/registro', (req, res) => {
    const { nombre, usuario, clave, correo, telefono } = req.body;
    if (!nombre || !usuario || !clave) return res.send('Faltan datos obligatorios.');

    db.query(
        `INSERT INTO clientes (nombre, usuario, clave, correo, telefono) VALUES (?, ?, ?, ?, ?)`,
        [nombre, usuario, clave, correo, telefono],
        (err) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.send('No se pudo registrar el usuario.');
            }
            res.render('registro_exitoso', { nombre });
        }
    );
});

// Login y sesión
router.post('/login', (req, res) => {
    const { usuario, clave } = req.body;
    db.query('SELECT * FROM clientes WHERE usuario = ? AND clave = ?', [usuario, clave], (err, results) => {
        if (err || results.length === 0) return res.send('Credenciales incorrectas.');
        req.session.usuario = results[0];
        res.redirect('/panel');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Panel y productos (protegidos)
router.get('/panel', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('panel', { usuario: req.session.usuario });
});

router.get('/productos', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.send('Error al cargar productos.');
        res.render('productos', { productos: results });
    });
});

// Agregar producto
router.get('/agregar-producto', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('agregar');
});

router.post('/agregar-producto', upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, imagen_url } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : imagen_url;

    if (!nombre || !descripcion || !precio) return res.send('Todos los campos son obligatorios.');

    db.query(
        'INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio, imagen],
        (err) => {
            if (err) return res.send('Error al guardar el producto.');
            res.redirect('/productos');
        }
    );
});

// Modificar producto
router.get('/modificar-producto', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.send('Error al obtener productos.');
        res.render('modificar', { productos: results });
    });
});

router.post('/modificar-producto/:id', (req, res) => {
    const { nombre, descripcion, precio, imagen_url } = req.body;
    const productoId = req.params.id;

    db.query(
        'UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen_url=? WHERE id=?',
        [nombre, descripcion, precio, imagen_url, productoId],
        (err) => {
            if (err) return res.send('Error al modificar el producto.');
            res.redirect('/productos');
        }
    );
});

// Eliminar producto
router.get('/eliminar-producto', (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.send('Error al obtener productos.');
        res.render('eliminar', { productos: results });
    });
});

router.post('/eliminar-producto/:id', (req, res) => {
    const productoId = req.params.id;
    db.query('DELETE FROM productos WHERE id=?', [productoId], (err) => {
        if (err) return res.send('Error al eliminar el producto.');
        res.redirect('/productos');
    });
});
//////////
router.post('/enviar_mensaje', (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.send('Todos los campos son obligatorios.');
    }

    res.render('confirmacion', { nombre });
});

module.exports = router;
//////

