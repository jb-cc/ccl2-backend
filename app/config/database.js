// configuration for database connection


require('dotenv').config();
const mysql = require('mysql');

let config;

const handleDisconnect = () => {
    config = mysql.createConnection({
        host: 'atp.fhstp.ac.at',
        port: 8007,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'cc221012',
    });

    config.connect(function(err) {
        if (err) {
            console.error('Error when connecting to database:', err);
            handleDisconnect(); // If error, try reconnecting after 2 seconds
        } else {
            console.log('Connected to database!');
        }
    });

    config.on('error', function(err) {
        console.error('Database error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // If connection was lost, try reconnecting
            handleDisconnect();
            console.log('Reconnected to database!')
        } else {
            throw err;
        }
    });
};


// I had the issue that the connection to the database was lost after a few minutes of inactivity, so I added this code to keep the connection alive
// Ping database to keep connection alive
// taken from https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
setInterval(function () {
    config.ping(function (err) {
        if (err) throw err;
        console.log('database responded to ping');
    });
}, 10000);


handleDisconnect();

module.exports = { config };
