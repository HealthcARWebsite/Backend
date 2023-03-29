const pool = require('../db.js');
const queries = require('./queries.js');

// Imports the nodemailer library to send users emails
const nodemailer = require('nodemailer');

// Imports the accept-language-parser library to know what language to use
const acceptLanguage = require('accept-language-parser');

// Gets all providers from database
const getAllProviders = (req, res) => {
    pool.query(queries.getAllEnProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
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

// Allows users to submit a possible new provider to be added to the website 
const addProvider = (req, res) => {
    const providerData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        organization: req.body.organization,
        message: req.body.message
    };
  
    // Send email to admin team
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
  
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'dms019@uark.edu',
        subject: process.env.SUBJECT,
        text: `
            Name: ${providerData.name}\n
            Email: ${providerData.email}\n
            Phone: ${providerData.phone}\n
            Organization: ${providerData.organization}\n
            Message: ${providerData.message} 
        `
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

// Sends an email to users that press the email results button and takes a screenshot of screen
const emailResults = async (req, res) => {
    const userEmailAddress = req.body.emailAddress;
  
    const message = {
        from: process.env.EMAIL_USER,
        to: userEmailAddress,
        subject: 'HealthcAR Results',
        html: `
            <p>Hello,</p>
            <p>
                Thank you for choosing HealthcAR, the road to accessbile healthcare in the state of Arkansas! 
                We at HealthcAR make it a priorty to deliver low-cost healthcare clinic information to people 
                around the state of Arkansas.
            </p>
            <p>
                Privacy more than ever before is a top concern for many people. We at HealtcAR take pride 
                in collecting zero user data so our users can feel at ease when using our website. 
            </p>
            <p> 
                You are recieving this email because you have requested to have your results emailed to you. 
                Your results are attached to this email.
            </p>
            <p>
                Furthermore, if you would like to request another provider be added to HealthcAR, please 
                navigate to the HealtcAR website and click on the button that says add provider and
                fill out the form of the providers information. Our team will then review the provider 
                credentials and make it available to others after review.
            </p>
            <p>
                Again, thank you for choosing HealthcAR! 
            </p>
            <p>
                Sincerely, <br>
                The HealthcAR Team
            </p>
            <img src="cid:webpage-screenshot"/>
        `
    };

    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
  
    transporter.sendMail(message, (error, info) => {
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
    getZipCodes,
    addProvider,
    emailResults,
};