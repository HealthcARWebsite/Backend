// Imports the express library 
const express = require('express');

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Imports the controller 
const controller = require('./controller.js');

// router.get('/', controller.getProviders);

// // Providers page route
// router.get('/providers', (req, res) => {
//     res.send('Providers');
// });

// app.get('/users', (req, res) => {
//     client.query('SELECT * FROM users', (err, result) => {
//         if (err) 
//             throw err;
//         res.send(result.rows);
//     });
// });

module.exports = router;