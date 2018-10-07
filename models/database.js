var mysql   = require('mysql');

var connection  = mysql.createConnection({
    host     : 'mysql',
    user     : 'root',
    password : 'secret',
    database : 'shopee'
});

connection.connect(function(err){
    if (err) throw err;
    
});

module.exports = connection;