const serverConfig = require('./serverConfig');

const redisConfig = {
    host: serverConfig.REDIS_HOST,
    port: serverConfig.REDIS_PORT,
    password: serverConfig.REDIS_PASSWORD
};

module.exports = redisConfig;