const getProviders = 'SELECT * FROM providers';
const checkNameExists = 'SELECT p FROM providers p WHERE p.name = $1';
const addProvider = 'INSERT INTO providers (name, description, url, zipcode, services) VALUES ($1, $2, $3, $4, $5)';

module.exports = {
    getProviders,
    checkNameExists,
    addProvider,
};