require('dotenv').config();

const config = {
    dec: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 8000,
    apiUrl: process.env.API_URL,
    apiKeyToken: process.env.API_KEY_TOKEN
}

module.exports = { config: config };