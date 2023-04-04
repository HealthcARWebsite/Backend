const pool = require('../db.js');
const queries = require('./queries.js');

// Imports the nodemailer library to send users emails
const nodemailer = require('nodemailer');

// Imports the accept-language-parser library to know what language to use
const acceptLanguage = require('accept-language-parser');

// Gets all providers from database depending on the users language preference and also zipcode search 
const getAllProviders = async (req, res) => {
    const preferredLanguages = acceptLanguage.parse(req.headers['accept-language']);
    const requestedZipCode = req.body.zipcode;

    let query;
    if (preferredLanguages.length > 0 && preferredLanguages[0].code === 'en') {
        query = queries.getAllEnProviders;

        try {
            const result = await pool.query(query);
            let providers = result.rows;
    
            if (requestedZipCode) {
                const zipCodes = await getEnZipCodes(requestedZipCode);
                providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
            }
    
            res.status(200).json(providers);
        } 
        catch (error) {
            console.error('Error executing query', error);
            res.status(500).send('An error occurred');
        }
    } 
    else if (preferredLanguages.length > 0 && preferredLanguages[1].code === 'es') {
        query = queries.getAllEsProviders;

        try {
            const result = await pool.query(query);
            let providers = result.rows;
    
            if (requestedZipCode) {
                const zipCodes = await getEsZipCodes(requestedZipCode);
                providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
            }
    
            res.status(200).json(providers);
        } 
        catch (error) {
            console.error('Error executing query', error);
            res.status(500).send('An error occurred');
        }
    }
    else if (preferredLanguages.length > 0 && preferredLanguages[2].code === 'mh') {
        query = queries.getAllMhProviders;

        try {
            const result = await pool.query(query);
            let providers = result.rows;
    
            if (requestedZipCode) {
                const zipCodes = await getMhZipCodes(requestedZipCode);
                providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
            }
    
            res.status(200).json(providers);
        } 
        catch (error) {
            console.error('Error executing query', error);
            res.status(500).send('An error occurred');
        }
    }
};

// Helper function to get the users requested zipcode from the database in english
const getEnZipCodes = async (requestedZipCode) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getEnZipCodes, [requestedZipCode], (error, results) => {
            if (error) {
                console.error(error);
                reject(new Error('Error retrieving zip codes'));
            } 
            else {
                const zipCodes = results.rows.map((row) => row.zipcode);
                resolve(zipCodes);
            }
        });
    });
};

// Helper function to get the users requested zipcode from the database in espanol
const getEsZipCodes = async (requestedZipCode) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getEsZipCodes, [requestedZipCode], (error, results) => {
            if (error) {
                console.error(error);
                reject(new Error('Error retrieving zip codes'));
            } 
            else {
                const zipCodes = results.rows.map((row) => row.zipcode);
                resolve(zipCodes);
            }
        });
    });
};

// Helper function to get the users requested zipcode from the database in marshallese
const getMhZipCodes = async (requestedZipCode) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getMhZipCodes, [requestedZipCode], (error, results) => {
            if (error) {
                console.error(error);
                reject(new Error('Error retrieving zip codes'));
            } 
            else {
                const zipCodes = results.rows.map((row) => row.zipcode);
                resolve(zipCodes);
            }
        });
    });
};

// Gets providers zipcodes and orders them by closest to furthest
// const getZipCodes = async (req, res) => {
//     const requestedZipCode = req.body.zipcode;
//     try {
//         pool.query(queries.getZipCodes, [requestedZipCode], (error, results) => {
//             if (error)
//                 throw error
//             res.status(200).json(results.rows);
//         });
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     } 
// };

// This function sets up the nodemailer info to send emails
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
  
    // Define the email message
    const message = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };
  
    // Send the email
    try {
        const info = await transporter.sendMail(message);
        console.log(`Email sent successfully: ${info.messageId}`);
    } 
    catch (error) {
        console.error(error);
    }
};

// Sends an email to users that press the email results button 
const emailResults = async (req, res) => {
    const requestedZipCode = req.body.zipcode;
    const userEmailAddress = req.body.emailAddress;
    
    try {
        // Initializes clinic array
        const clinics = []; 
        
        // Calls getZipCodes query
        pool.query(queries.getEnZipCodes, [requestedZipCode], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
  
            // Check if results.rows is undefined or empty
            if (!results.rows || results.rows.length === 0) 
                return res.status(404).json({ message: 'No clinics found' });
    
            // Push the clinic information objects to the clinics array
            results.rows.forEach(row => {
                clinics.push({
                    name: row.name,
                    description: row.description,
                    url: row.url,
                    zipcode: row.zipcode
                });
            });
    
            // Render the template with the clinics data
            const html = `
                <html>
                    <head>
                        <style>
                            table {
                                font-family: arial, sans-serif;
                                border-collapse: collapse;
                                width: 100%;
                            }
                            
                            td, th {
                                border: 1px solid #dddddd;
                                text-align: left;
                                padding: 8px;
                            }
                            
                            tr:nth-child(even) {
                                background-color: #dddddd;
                            }
                        </style>
                    </head>
                    <body>
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

                        <h1>Providers</h1>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>URL</th>
                                <th>Zipcode</th>
                            </tr>
                            ${clinics.map(clinic => `
                            <tr>
                                <td>${clinic.name}</td>
                                <td>${clinic.description}</td>
                                <td>${clinic.url}</td>
                                <td>${clinic.zipcode}</td>
                            </tr>
                            `).join('')}
                        </table>
                    </body>
                </html>
            `;

            // Send the HTML email with the clinics data
            sendEmail(userEmailAddress, 'HealthcAR Results', html);
  
            // Send a success response
            return res.status(200).json({ message: 'Email sent successfully' });
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Allows users to submit a request to add new providers via email
const addProvider = (req, res) => {
    const providerData = req.body;
    // const providerData = JSON.parse(req.body);
    
    if (!providerData.name || !providerData.message) {
        return res.status(400).json({
            success: false,
            message: 'Error: Name and message fields are required'
        });
    }
  
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
  
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
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
            return res.status(500).json({
                success: false,
                message: 'Error: Could not send email'
            });
        } 
        else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({
                success: true,
                message: 'Email sent successfully'
            });
        }
    });
};

// Sends an email to users that press the email results button 
// const emailResults = async (req, res) => {
//     const userEmailAddress = req.body.emailAddress;

//     const message = {
//         from: process.env.EMAIL_USER,
//         to: userEmailAddress,
//         subject: 'HealthcAR Results',
//         html: `
//             <p>Hello,</p>
//             <p>
//                 Thank you for choosing HealthcAR, the road to accessbile healthcare in the state of Arkansas! 
//                 We at HealthcAR make it a priorty to deliver low-cost healthcare clinic information to people 
//                 around the state of Arkansas.
//             </p>
//             <p>
//                 Privacy more than ever before is a top concern for many people. We at HealtcAR take pride 
//                 in collecting zero user data so our users can feel at ease when using our website. 
//             </p>
//             <p> 
//                 You are recieving this email because you have requested to have your results emailed to you. 
//                 Your results are attached to this email.
//             </p>
//             <p>
//                 Furthermore, if you would like to request another provider be added to HealthcAR, please 
//                 navigate to the HealtcAR website and click on the button that says add provider and
//                 fill out the form of the providers information. Our team will then review the provider 
//                 credentials and make it available to others after review.
//             </p>
//             <p>
//                 Again, thank you for choosing HealthcAR! 
//             </p>
//             <p>
//                 Sincerely, <br>
//                 The HealthcAR Team
//             </p>
//         `
//     };

    // const transporter = nodemailer.createTransport({
    //     service: process.env.SERVICE,
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
  
//     transporter.sendMail(message, (error, info) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send('Error: Could not send email');
//         } 
//         else {
//             console.log('Email sent: ' + info.response);
//             res.status(200).send('Email sent successfully');
//         }
//     });
// };


module.exports = {
    getAllProviders,
    getEnZipCodes,
    getEsZipCodes,
    getMhZipCodes,
    addProvider,
    emailResults,
};