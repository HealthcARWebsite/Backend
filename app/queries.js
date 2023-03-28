const getAllEnProviders = 'SELECT name, description, url, zipcode FROM providers';
const getAllEsProviders = 'SELECT name, description, url, zipcode FROM providers';
const getAllMsProviders = 'SELECT name, description, url, zipcode FROM providers';
//const getZipCodes = 'SELECT * FROM providers ORDER BY ABS(zipcode - $1) ASC';
const getZipCodes = `
    SELECT name, description, url, zipcode FROM providers 
    ORDER BY CASE 
    WHEN zipcode ~ '^[0-9]+$' 
    THEN ABS(zipcode::integer - $1::integer) 
    ELSE 999999 END, 
    zipcode ASC
`;
const checkNameExists = 'SELECT p FROM providers p WHERE p.name = $1'; // Can be deleted later
const addProviders = 'INSERT INTO providers (name, description, url, zipcode, services) VALUES ($1, $2, $3, $4, $5)'; // Can be deleted later

module.exports = {
    getAllEnProviders,
    getAllEsProviders,
    getAllMsProviders,
    checkNameExists,
    addProviders,
    getZipCodes,
};