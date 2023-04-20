// Querys to get all providers from each language
const getAllEnProviders = 'SELECT name, description, url, zipcode FROM providers';
const getAllEsProviders = 'SELECT name, Es_description, url, zipcode FROM providers';
const getAllMhProviders = 'SELECT name, Mh_description, url, zipcode FROM providers';

// Query to get english zipcodes 
const getEnZipCodes = `
    SELECT name, description, url, zipcode FROM providers 
    ORDER BY CASE 
    WHEN zipcode ~ '^[0-9]+$' 
    THEN ABS(zipcode::integer - $1::integer) 
    ELSE 999999 END, 
    zipcode ASC
`;

// Query to get spanish zipcodes
const getEsZipCodes = `
    SELECT name, Es_description, url, zipcode FROM providers 
    ORDER BY CASE 
    WHEN zipcode ~ '^[0-9]+$' 
    THEN ABS(zipcode::integer - $1::integer) 
    ELSE 999999 END, 
    zipcode ASC
`;

// Query to get marshallese zipcodes
const getMhZipCodes = `
    SELECT name, Mh_description, url, zipcode FROM providers 
    ORDER BY CASE 
    WHEN zipcode ~ '^[0-9]+$' 
    THEN ABS(zipcode::integer - $1::integer) 
    ELSE 999999 END, 
    zipcode ASC
`;

module.exports = {
    getAllEnProviders,
    getAllEsProviders,
    getAllMhProviders,
    getEnZipCodes,
    getEsZipCodes,
    getMhZipCodes,
};