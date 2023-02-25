// Imports the express library 
const express = require('express');

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Imports the controller 
const controller = require('./controller.js');

router.get('/', () => controller.getProviders);
router.post('/', () => controller.addProvider);

module.exports = router;