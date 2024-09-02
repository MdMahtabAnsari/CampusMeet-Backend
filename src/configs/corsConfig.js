const serverConfig = require('./serverConfig');

const corsConfig = {
    origin: serverConfig.CORS_ORIGIN,
    credentials: serverConfig.CORS_CREDENTIALS === 'true',
    methods: serverConfig.CORS_METHODS,
    allowedHeaders: serverConfig.CORS_HEADERS,
    

};

module.exports = corsConfig;