const dotenv = require('dotenv');
dotenv.config();

const serverConfig = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN,
    COOKIE_SECURE: process.env.COOKIE_SECURE,
    HTTP_ONLY_COOKIE: process.env.HTTP_ONLY_COOKIE,
    DEFAULT_AVATAR: process.env.DEFAULT_AVATAR,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    STRING_LENGTH: process.env.STRING_LENGTH,
    CORN_SCHEDULE: process.env.CORN_SCHEDULE,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    OTP_EXPIRES_IN: process.env.OTP_EXPIRES_IN,
    OTP_LENGTH: process.env.OTP_LENGTH,
    OTP_TYPE: process.env.OTP_TYPE,
};

module.exports = serverConfig;
// The serverConfig object is exported so that it can be imported in other files. This way, the configuration is centralized and can be easily updated.

