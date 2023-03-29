const getAllEnProviders = 'SELECT name, description, url, zipcode FROM providers';
const getAllEsProviders = 'SELECT name, description, url, zipcode FROM providers';
const getAllMhProviders = 'SELECT name, description, url, zipcode FROM providers';
//const getZipCodes = 'SELECT * FROM providers ORDER BY ABS(zipcode - $1) ASC';
const getZipCodes = `
    SELECT name, description, url, zipcode FROM providers 
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
    getZipCodes,
};