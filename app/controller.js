const pool = require('../db.js');
const queries = require('./queries.js');

const getProviders = (req, res) => {
    pool.query(queries.getProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

const addProvider = (req, res) => {
    const { name, description, url, zipcode, services } = req.body;

    // Check if name exists
    pool.query(queries.checkNameExists, [name], (error, results) => {
        if (results.rows.length)
            res.send('Name already exists.');
        
        // If name does not exist add provider to database
        pool.query(queries.addProvider, [name, description, url, zipcode, services], (error, results) => {
            if (error) 
                throw error;
            res.status(201).send('Provider created Successfully.');
            console.log('Provider created');
        });
    });
};

module.export = {
    getProviders,
    addProvider,
};