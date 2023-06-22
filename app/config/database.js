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
            setTimeout(handleDisconnect, 2000); // If error, try reconnecting after 2 seconds
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

handleDisconnect();

module.exports = { config };

//
// =====================================OLD CONFIG=====================================
// require ('dotenv').config();
// const mysql = require('mysql');
//
// const config = mysql.createConnection({
//     host: 'atp.fhstp.ac.at',
//     port: 8007,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: "cc221012",
// });
//
// config.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to database!");
// });
//
// module.exports = {config}