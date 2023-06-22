require ('dotenv').config();
const mysql = require('mysql');

const createConnection = () => {
    const config = mysql.createConnection({
        host: 'atp.fhstp.ac.at',
        port: 8007,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "cc221012",
    });

    config.connect(function(err) {
        if (err) {
            console.error("Error connecting to database. Retrying...");
            setTimeout(createConnection, 5000); // retry after 5 seconds
            return;
        }
        console.log("Connected to database!");
    });

    return config;
}

const config = createConnection();

module.exports = { config }
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