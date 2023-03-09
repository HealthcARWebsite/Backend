const pool = require('../db.js');
const queries = require('./queries.js');
const helper = require('./helper.js');
const geolib = require('geolib');

// Gets all providers from database
const getProviders = (req, res) => {
    pool.query(queries.getProviders, (error, results) => {
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

// Gets providers zipcodes
const getZipCodes = async (req, res) => {
    try {
        const { name, description, url, zipcode, services } = req.body;
        const requestedZipCode = req.params.zipcode;
        pool.query(queries.checkZipCodeExists, [zipcode], (error, results) => {
            if (queries.checkZipCodeExists) {
                pool.query(queries.getZipCodes, [requestedZipCode], (error, results) => {
                    res.status(200).json(results.rows);
                });
            }
            else if (!queries.checkZipCodeExists) {
                res.send('dfdfsd');
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }






    //const requestedZipcode = req.params.zipcode;

    // try {
    //     // Check if the requested zipcode exists in the database
    //     const { rows } = await pool.query('SELECT * FROM providers WHERE zipcode = $1', [requestedZipcode]);

    //     if (rows.length > 0) {
    //         // If the requested zipcode exists, return the relevant data
    //         return res.status(200).json(rows);
    //     } else {
    //         // If the requested zipcode does not exist, find the nearest zipcode using the Haversine formula

    //         // Get all the zipcodes from the database
    //         const allZipcodes = await pool.query('SELECT zipcode FROM providers');

    //         // Calculate the distances between the requested zipcode and all the zipcodes in the database
    //         const distances = allZipcodes.rows.map(zipcode => {
    //             const distance = helper.haversineFormula(requestedZipcode, zipcode);
    //             return {
    //                 zipcode: zipcode.zipcode,
    //                 distance: distance
    //             }
    //         });

    //         // Sort the distances in ascending order by distance
    //         distances.sort((a, b) => a.distance - b.distance);

    //         // Return the nearest zipcode to the user
    //         return res.status(200).json(distances[0]);
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return res.status(500).json({ error: 'Internal server error' });
    // }









    // const { zipcode } = req.params;
    // try {
    //     // Query the database for all zipcodes and their coordinates
    //     const zipcodes = await queries.getAllZipCodes; 
    
    //     // Calculate the distances between the user-inputted zipcode and each zipcode in the database
    //     const distances = zipcodes.map((z) => {
    //       const distance = geolib.getDistance(
    //         { latitude: z.latitude, longitude: z.longitude },
    //         { latitude: req.body.latitude, longitude: req.body.longitude }
    //       );
    //       return { zipcode: z.zipcode, distance };
    //     });
    
    //     // Sort the distances array in ascending order of distance
    //     distances.sort((a, b) => a.distance - b.distance);
    
    //     // Return the closest zipcode in the database
    //     const closestZipcode = distances[0].zipcode;
    //     res.json({ closestZipcode });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error finding closest zipcode' });
    //   }








};

module.exports = {
    getProviders,
    addProviders,
    getZipCodes,
};