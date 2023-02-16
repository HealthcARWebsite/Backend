// Imports the express library 
const express = require('express');

// Imports the cors library
const cors = require('cors');

// Imports the bodyParser library
const bodyParser = require('body-parser');

// Imports the models folder 
const db = require("./app/models");

// Instantiates the app
const app = express();

// Middleware functions
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


// Sets up database connection
db.sequelize.sync()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Failed to connect with database: " + err.message);
    });





// Assigns either the local machines predefined port or port 4001
const PORT = process.env.PORT || 4001;

// Invokes the app's `.listen()` method 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});