'user strict';

var mysql = require('mysql2');

var connection = mysql.createConnection({
    host     : '172.19.0.2',
    user     : 'order_user',
    password : 'order_user_baby',
    database : 'webapp'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;