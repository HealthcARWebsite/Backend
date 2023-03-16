const pool = require('../db.js');
const queries = require('./queries.js');

// Imports the nodemailer library to send users emails
const nodemailer = require('nodemailer');

// Gets all providers from database
const getAllProviders = (req, res) => {
    pool.query(queries.getAllProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

// Adds providers to the database
const addProviders = (req, res) => {
    const { name, description, url, zipcode, services } = req.body;

    // Check if name exists
    pool.query(queries.checkNameExists, [name], (error, results) => {
        if (error)
            throw error;
        if (results.rows.length)
            res.send('Name already exists.');
        
        // If name does not exist add provider to database
        pool.query(queries.addProviders, [name, description, url, zipcode, services], (error, results) => {
            if (error) 
                throw error;
            res.status(201).send('Provider created Successfully.');
            console.log('Provider created');
        });
    });
};

// Gets providers zipcodes and orders them by closest to furthest
const getZipCodes = async (req, res) => {
    const requestedZipCode = req.params.zipcode;
    try {
        pool.query(queries.getZipCodes, [requestedZipCode], (error, results) => {
            if (error)
                throw error
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } 
};

// Sends email to user 
const sendEmail = (req, res) => {
    //const userEmailAddress = req.body.emailAddress;
    const webpageContent = 'Hello world this is a test! Test 1';
  
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'Health-cAR@outlook.com',
            pass: 'healthcar@123'
        }
    });
  
    const mailOptions = {
        from: 'Health-cAR@outlook.com',
        to: 'dms019@uark.edu',   //userEmailAddress,
        subject: 'Test 1',
        text: webpageContent
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error: Could not send email');
        } 
        else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
};

module.exports = {
    getAllProviders,
    addProviders,
    getZipCodes,
    sendEmail,
};