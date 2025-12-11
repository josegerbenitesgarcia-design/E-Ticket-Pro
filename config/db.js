const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'QWEasd123',
    database: process.env.DB_NAME || 'E_Ticket_Pro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();
console.log("Conectado a la base de datos E_Ticket_Pro...");

module.exports = promisePool;