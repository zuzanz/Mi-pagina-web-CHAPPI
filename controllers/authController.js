const db = require('../config/db');

//Exportar LoginForm
exports.loginForm = (req,res) => {
    res.render('login', {error:null});
};

//Validamos la Autenticación
exports.autenticar = (req,res) => {
    const { usuario, clave } = req.body;

    db.query('select * from usuarios_login where usuario = ? and clave = ?;', [usuario, clave], (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            res.send('Login OK, Bienvenido!');
        }else{
            res.render('login', {error: 'Usuario o Clave Incorrecto!'});
        }
    });
};