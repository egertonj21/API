const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log(`Database successfully connected!`);
    }
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {db, query};