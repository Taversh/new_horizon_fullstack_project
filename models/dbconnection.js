const mysql = require('mysql2');

dbConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "auth_db"
});


module.exports = dbConnection.promise();