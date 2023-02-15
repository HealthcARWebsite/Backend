// Imports the express library 
const express = require('express');

// Instantiates the app
const app = express();

// Assigns either the local machines predefined port or port 4001
const PORT = process.env.PORT || 4001;

// Invokes the app's `.listen()` method 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`)
});