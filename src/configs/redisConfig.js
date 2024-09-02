const Redis = require("ioredis");
const serverConfig = require("./serverConfig");

const redis = new Redis({
  host: serverConfig.REDIS_HOST,
  port: serverConfig.REDIS_PORT,
  password: serverConfig.REDIS_PASSWORD,
 
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Handle successful connection
redis.on("connect", () => {
  console.log("Connected to Redis");
});

// Handle Redis connection closure
redis.on("close", () => {
  console.log("Redis connection closed");
});

module.exports = redis;
