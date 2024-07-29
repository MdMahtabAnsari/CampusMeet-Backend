const dotenv = require('dotenv');
dotenv.config();

const serverConfig = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
};

module.exports = serverConfig;
// The serverConfig object is exported so that it can be imported in other files. This way, the configuration is centralized and can be easily updated.

