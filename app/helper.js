// Haversine formula to calculate the distance between two zipcodes
function haversineFormula(zipcode1, zipcode2) {
    const R = 3958.8; // radius of the Earth in miles
    const lat1 = zipcode1.latitude;
    const lon1 = zipcode1.longitude;
    const lat2 = zipcode2.latitude;
    const lon2 = zipcode2.longitude;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

module.exports = {
    haversineFormula,
}