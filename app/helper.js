// Haversine formula to calculate the distance between two zipcodes
// function haversineFormula(zipcode1, zipcode2) {
//     const R = 3958.8; // radius of the Earth in miles
//     const lat1 = zipcode1.latitude;
//     const lon1 = zipcode1.longitude;
//     const lat2 = zipcode2.latitude;
//     const lon2 = zipcode2.longitude;
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance;
// }

// // Helper function to convert degrees to radians
// function toRadians(degrees) {
//     return degrees * Math.PI / 180;
// }

// module.exports = {
//     haversineFormula,
// }



//----------------------------------------------------------------'
// Extra code i was testing
//----------------------------------------------------------------''
//const getZipCodes = 'SELECT * FROM providers WHERE zipcode = $1';
// const checkZipCodeExists = 'SELECT z FROM providers z WHERE z.zipcode = $1';
// const getAllZipCodes = 'SELECT zipcode FROM providers';



// // Gets providers zipcodes
// const getZipCodes = async (req, res) => {
//     try {
//         const { zipcode } = req.body;
//         const requestedZipCode = req.params.zipcode;
//         pool.query(queries.checkZipCodeExists, [zipcode], (error, results) => {
//             if (error) 
//                 throw error;
//             if (queries.checkZipCodeExists) {
//                 pool.query(queries.getZipCodes, [requestedZipCode], (error, results) => {
//                     if (error) 
//                         throw error;
//                     res.status(200).json(results.rows);
//                 });
//             }
//         });
//     } 
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }










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
