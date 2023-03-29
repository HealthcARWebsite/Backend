// Imports the express library 
const express = require('express');

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Imports the controller 
const controller = require('./controller.js');

// Routes
router.get('/get-providers', controller.getAllProviders);
router.post('/contact-us', controller.addProvider);
router.post('/email', controller.emailResults)

module.exports = router;