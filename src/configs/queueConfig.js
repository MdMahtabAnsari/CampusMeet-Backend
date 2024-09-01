const Queue = require("bull");
const redis = require('./redisConfig')

// const redisConfig = {
//   host: serverConfig.REDIS_HOST,
//   port: serverConfig.REDIS_PORT,
//   password: serverConfig.REDIS_PASSWORD,
// };
const statusQueue = new Queue("status", {
  redis: redis,
});

const otpQueue = new Queue("otp", {
  redis: redis,
});

const userQueue = new Queue("user", {
  redis: redis,
});

const imageQueue = new Queue("image", {
  redis: redis,
});

const friendQueue = new Queue("friend", {
  redis: redis,
});

module.exports = {
  statusQueue,
  otpQueue,
  userQueue,
  imageQueue,
  friendQueue,
};
