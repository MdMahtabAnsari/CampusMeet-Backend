const Redis = require("ioredis");
const serverConfig = require("./serverConfig");

const redis = new Redis({
  host: serverConfig.REDIS_HOST,
  port: serverConfig.REDIS_PORT,
  password: serverConfig.REDIS_PASSWORD,
});

module.exports = redis;
