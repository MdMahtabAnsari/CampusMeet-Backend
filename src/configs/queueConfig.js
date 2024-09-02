const Queue = require("bull");
// const redis = require("./redisConfig");
const serverConfig = require("./serverConfig");

const redisConfig = {
  host: serverConfig.REDIS_HOST,
  port: serverConfig.REDIS_PORT,
  password: serverConfig.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false,
  },
};
const statusQueue = new Queue("status", { redis: redisConfig });

const otpQueue = new Queue("otp", { redis: redisConfig });

const userQueue = new Queue("user", { redis: redisConfig });

const imageQueue = new Queue("image", { redis: redisConfig });

const friendQueue = new Queue("friend", { redis: redisConfig });

statusQueue.on("error", (error) => {
  console.log("Error with status queue", error);
});

otpQueue.on("error", (error) => {
  console.log("Error with otp queue", error);
});

userQueue.on("error", (error) => {
  console.log("Error with user queue", error);
});

imageQueue.on("error", (error) => {
  console.log("Error with image queue", error);
});

friendQueue.on("error", (error) => {
  console.log("Error with friend queue", error);
});


module.exports = {
  statusQueue,
  otpQueue,
  userQueue,
  imageQueue,
  friendQueue,
};
