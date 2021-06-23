require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV.trim() !== 'production',
    port: process.env.PORT || 8000,
    apiUrl: process.env.API_URL,
    apiKeyToken: process.env.ADMIN_API_KEY_TOKEN
}

module.exports = { config: config };