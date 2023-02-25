// Imports the express library 
const express = require('express');

const client = require('../config/db.config.js')

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Splash page route
router.get('/', (req, res) => {
    res.send('Splash page');
});

// Providers page route
router.get('/providers', (req, res) => {
    res.send('Providers');
});

app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        if (err) 
            throw err;
        res.send(result.rows);
    });
});

module.exports = router;