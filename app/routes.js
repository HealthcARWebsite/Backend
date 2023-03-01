// Imports the express library 
const express = require('express');

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Imports the controller 
const controller = require('./controller.js');

// Routes
router.get('/', controller.getProviders);
router.get('/zipcode/:zipcode', controller.getZipCodes);
router.post('/', controller.addProviders);

module.exports = router;