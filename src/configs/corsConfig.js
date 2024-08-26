const serverConfig = require('./serverConfig');

const corsConfig = {
    origin: serverConfig.CORS_ORIGIN,
    credentials: serverConfig.CORS_CREDENTIALS === 'true'? true : false,
    methods: serverConfig.CORS_METHODS.split(','),
    allowedHeaders: serverConfig.CORS_HEADERS.split(','),
    

};

module.exports = corsConfig;