const pool = require('../db.js');
const queries = require('./queries.js');

const getProviders = (req, res) => {
    pool.query(queries.getProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

module.export = {
    getProviders,
};