const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

// function createProviderTable(callback) {
//     const createTableQuery = `
//         CREATE TABLE providers (
//         name TEXT PRIMARY KEY,
//         description TEXT,
//         url TEXT,
//         zipcode INTEGER,
//         services TEXT[]
//         );
//     `;

//     pool.query(createTableQuery, (err, result) => {
//         if (err) 
//             throw err;
//         console.log('Table created successfully');
//         callback();
//     });
// };


module.exports = {
    pool,
    //createProviderTable,
};

//module.exports = pool