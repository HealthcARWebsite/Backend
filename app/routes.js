// Imports the express library 
const express = require('express');

// Instiates the Router middleware to use as routing system
const router = express.Router();

// Imports the controller 
const controller = require('./controller.js');

// Routes
router.get('/en', controller.getAllEnProviders);
router.get('/es', controller.getAllEsProviders);
router.get('/ms', controller.getAllMsProviders);
router.get('/en/zipcode/:zipcode', controller.getZipCodes);
router.get('/es/zipcode/:zipcode', controller.getZipCodes);
router.get('/ms/zipcode/:zipcode', controller.getZipCodes);
router.post('/en/email/', controller.sendEmail);
router.post('/es/email', controller.sendEmail);
router.post('/ms/email', controller.sendEmail);
router.post('/', controller.addProviders);   // Can be deleted later

module.exports = router;