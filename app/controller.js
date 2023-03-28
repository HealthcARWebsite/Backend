const pool = require('../db.js');
const queries = require('./queries.js');

// Imports the nodemailer library to send users emails
const nodemailer = require('nodemailer');

// Imports the puppeteer library to take screenshot of results
const puppeteer = require('puppeteer');

// Gets all english providers from database
const getAllEnProviders = (req, res) => {
    pool.query(queries.getAllEnProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

// Gets all espanol providers from database
const getAllEsProviders = (req, res) => {
    pool.query(queries.getAllEsProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

// Gets all marshallese providers from database
const getAllMsProviders = (req, res) => {
    pool.query(queries.getAllMsProviders, (error, results) => {
        if (error) 
            throw error;
        res.status(200).json(results.rows);
    });
};

// Adds providers to the database // Can be deleted later
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
        subject: 'New Provider Submission',
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

// Constant variable for sendEmail function
const url = 'http://localhost:3000/providers/en/';

// Sends an email to users that press the email results button and takes a screenshot of screen
const sendEmail = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    const userEmailAddress = req.body.emailAddress;
    
    // Take a screenshot of the webpage and save it as a PDF file
    const pdfBuffer = await page.pdf({format: 'A4'});
  
    // Close the browser
    await browser.close();
  
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
        `,
        attachments: [
            {
                filename: 'webpage-screenshot.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
                contentDisposition: 'attachment',
                cid: 'webpage-screenshot'
            }
        ]
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
    getAllEnProviders,
    getAllEsProviders,
    getAllMsProviders,
    addProviders,
    getZipCodes,
    sendEmail,
    addProvider,
};