// Connecting to Heroku database 
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// pool.connect();


// Connecting to local postgres database
const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "providers",
    password: "Razorback@5150",
    port: 5432
});

module.exports = pool