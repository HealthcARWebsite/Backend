// Imports the express library 
const express = require('express');

// Imports client from db.config (basically allows a connection between backend and database)
const client = require('./app/config/db.config.js');

// Imports the cors library
const cors = require('cors');

// Imports the bodyParser library
const bodyParser = require('body-parser');

// Imports the dotenv library
const dotenv = require('dotenv').config();

// Imports the models folder 
const db = require("./app/models");

// Imports the routes folder
//const r = require("./app/routes");

// Instantiates the app
const app = express();

// Middleware functions
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// Routes
//app.use('/app/routes', r);

// Simple test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello I am working' });
});

// test of getting clinics from database
// app.get('/clinics', async (req, res) => {
//     try {
//         const clinics = await client.query('SELECT * FROM clinics')
//         res.json(cinics.rows)
//     } catch (err) {
//         console.error(err);
//     }
// });


// Assigns either the local machines predefined port or port 4001
const PORT = process.env.PORT || 4001;

// Invokes the app's `.listen()` method 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});