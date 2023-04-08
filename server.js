// Imports the express library 
const express = require('express');

// Imports the cors library
const cors = require('cors');

// Imports the bodyParser library
const bodyParser = require('body-parser');

// Imports the dotenv library
const dotenv = require('dotenv').config();

// Imports pool from db.js (basically allows a connection between backend and database)
const pool = require('./db.js');

const providerRoutes = require('./app/routes.js');

// Instantiates the app
const app = express();

// Middleware functions
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use('/providers/', providerRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello I am working' });
});

// Assigns either the local machines predefined port or port 4001
const PORT = process.env.PORT || 4001;

// Invokes the app's `.listen()` method 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});