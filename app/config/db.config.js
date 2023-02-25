const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect();

function createUserTable(callback) {
  	const createTableQuery = `
    	CREATE TABLE IF NOT EXISTS users (
      	id SERIAL PRIMARY KEY,
      	name TEXT NOT NULL
    	);
  	`;

  	client.query(createTableQuery, (err, result) => {
    	if (err) 
      		throw err;
    	console.log('Table created successfully');
    	callback();
  	});
}


function insertUserData(callback) {
    const insertDataQuery = `
      	INSERT INTO users (name)
      	VALUES ('John Doe'), ('Jane Doe');
    `;

    client.query(insertDataQuery, (err, result) => {
    	if (err)
    		throw err;
      	console.log('Data inserted successfully');
      	callback();
    });
}

module.exports = {
    createUserTable,
    insertUserData,
	client
};

//module.exports = client;
