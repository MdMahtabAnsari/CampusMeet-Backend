const Queue = require('bull');
const serverConfig = require('./serverConfig');

const statusQueue = new Queue('status', {
    redis: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        password: serverConfig.REDIS_PASSWORD
    }
});

const otpQueue = new Queue('otp', {
    redis: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        password: serverConfig.REDIS_PASSWORD
    }
});

const userQueue = new Queue('user', {
    redis: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        password: serverConfig.REDIS_PASSWORD
    }
});

const imageQueue = new Queue('image', {
    redis: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        password: serverConfig.REDIS_PASSWORD
    }
});

module.exports = {
    statusQueue,
    otpQueue,
    userQueue,
    imageQueue
};
