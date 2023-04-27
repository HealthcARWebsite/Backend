const pool = require('../db.js');
const queries = require('./queries.js');

// Imports the nodemailer library to send users emails
const nodemailer = require('nodemailer');

// Imports the accept-language-parser library to know what language to use
const acceptLanguage = require('accept-language-parser');

// Gets all providers from database depending on the users language preference and also zipcode search 
const getAllProviders = async (req, res) => {
    const preferredLanguages = acceptLanguage.parse(req.headers['accept-language']);
    const requestedZipCode = req.query.zipCode;

    let query;
    let providers;
    for (const lang of preferredLanguages) {
        if (lang.code === 'en') {
            query = queries.getAllEnProviders;
            try {
                const result = await pool.query(query);
                providers = result.rows.map(provider => {
                    return {
                        name: provider.name,
                        description: provider.description,
                        url: provider.url,
                        zipcode: provider.zipcode
                    };
                });

                if (requestedZipCode) {
                    const zipCodes = await getEnZipCodes(requestedZipCode);
                    providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                    providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
                }

                res.status(200).json(providers);
                return;
            } 
            catch (error) {
                console.error('Error executing query', error);
                res.status(500).json({ message: 'An error occurred' });
                return;
            }
        } 
        else if (lang.code === 'es') {
            query = queries.getAllEsProviders;
            try {
                const result = await pool.query(query);
                providers = result.rows.map(provider => {
                    return {
                        name: provider.name,
                        description: provider.es_description,
                        url: provider.url,
                        zipcode: provider.zipcode
                    };
                });

                if (requestedZipCode) {
                    const zipCodes = await getEsZipCodes(requestedZipCode);
                    providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                    providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
                }

                res.status(200).json(providers);
                return;
            } 
            catch (error) {
                console.error('Error executing query', error);
                res.status(500).json({ message: 'An error occurred' });
                return;
            }
        } 
        else if (lang.code === 'mh') {
            // query = queries.getAllMhProviders;
            query = queries.getAllEnProviders;
            try {
                const result = await pool.query(query);
                providers = result.rows.map(provider => {
                    return {
                        name: provider.name,
                        description: provider.description,
                        url: provider.url,
                        zipcode: provider.zipcode
                    };
                });

                if (requestedZipCode) {
                    const zipCodes = await getEnZipCodes(requestedZipCode);
                    providers = providers.filter(provider => zipCodes.includes(provider.zipcode));
                    providers.sort((a, b) => zipCodes.indexOf(a.zipcode) - zipCodes.indexOf(b.zipcode)); 
                }

                res.status(200).json(providers);
                return;
            } 
            catch (error) {
                console.error('Error executing query', error);
                res.status(500).json({ message: 'An error occurred' });
                return;
            }
        }
    }
    res.status(400).json({ message: 'Unsupported language preference' });
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
    const requestedZipCode = req.body.zipCode;
    const userEmailAddress = req.body.emailAddress.email; 
    const preferredLanguages = acceptLanguage.parse(req.headers['accept-language']);
    
    try {
        // Initializes clinic array
        const clinics = []; 

        for (const lang of preferredLanguages) {
            if (lang.code === 'en') {
                const results = await pool.query(queries.getEnZipCodes, [requestedZipCode]);
        
                /// Check if results.rows is undefined or empty
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
            }
            else if (lang.code === 'es') {
                const results = await pool.query(queries.getEsZipCodes, [requestedZipCode]);
        
                /// Check if results.rows is undefined or empty
                if (!results.rows || results.rows.length === 0) 
                    return res.status(404).json({ message: 'No clinics found' });
        
                // Push the clinic information objects to the clinics array
                results.rows.forEach(row => {
                    clinics.push({
                        name: row.name,
                        description: row.es_description,
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
                            <p>Hola,</p>
                            <p>
                                Gracias por escoger  HealthcAR, el camino hacia atención médica accesible en el estado de Arkansas. 
                                Nuestra prioridad es proporcionar información sobre atención médica a bajo costo. 
                            </p>
                            <p>
                                La privacidad es más importante que nunca , nosotros en HealthcAR nos enorgullece que conectamos 
                                cero información sobre nuestros usuarios. 
                            </p>
                            <p> 
                                Estás recibiendo este e-mail por que haz  solicitado que tus resultados fueron enviados por correo 
                                electrónico. Tus resultados están incluidos en este e-mail. 
                            </p>
                            <p>
                                Además,  si quisieras que otro proveedor sea agregado a HealthcAR, por favor visitar nuestro sitio y 
                                selecciona el botón que dice "agregar proveedor " y llena la información sobre este proveedor. Nuestro equipo revisará la información proporcionáramos a otros usuarios. 
                            </p>
                            <p>
                                Una vez más gracias por usar HealthcAR, 
                            </p>
                            <p>
                                Sinceramente, <br>
                                Equipo HealthcAR
                            </p>

                            <h1>Proveedores</h1>
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
            }
            else if (lang.code === 'mh') {
                const results = await pool.query(queries.getEnZipCodes, [requestedZipCode]);
        
                /// Check if results.rows is undefined or empty
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
            }
        }
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Allows users to submit a request to add new providers via email
const addProvider = (req, res) => {
    const providerData = req.body;
    
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

module.exports = {
    getAllProviders,
    getEnZipCodes,
    getEsZipCodes,
    getMhZipCodes,
    emailResults,
    addProvider,
};