const getAllEnProviders = 'SELECT * FROM providers';
const getAllEsProviders = 'SELECT * FROM providers';
const getAllMsProviders = 'SELECT * FROM providers';
const getZipCodes = 'SELECT * FROM providers ORDER BY ABS(zipcode - $1) ASC';
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