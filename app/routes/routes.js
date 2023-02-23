// Imports the express library 
const express = require('express');

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

module.exports = router;