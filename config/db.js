const mysql = require('mysql2');

//CONFIG MYSQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
});

//VALIDAR CONEXIÓN
connection.connect((err) =>{
    if(err) throw err;
    console.log('Conectado OK!');
});

module.exports = connection;