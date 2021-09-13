const NodeGeoCoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GROCODER_API_KEY,
    formatter: null
};
console.log('provider: ' + options.provider);
const geocoder = NodeGeoCoder(options);

module.exports = geocoder;