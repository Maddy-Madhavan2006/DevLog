const mysql = require('mysql2');
require('dotenv').config();

// We use createPool instead of createConnection for stability
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    // --- POOL SETTINGS TO PREVENT 'PROTOCOL_CONNECTION_LOST' ---
    waitForConnections: true,
    connectionLimit: 10,     // Max 10 connections at once
    queueLimit: 0,
    enableKeepAlive: true,   // Sends a 'heartbeat' to TiDB
    keepAliveInitialDelay: 10000 // 10 seconds
});

// For Pools, we check the connection using getConnection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Successfully connected to TiDB Cloud via Connection Pool!');
        connection.release(); // Always release the connection back to the pool
    }
});

module.exports = pool.promise(); // Export the pool with promise support for async/await