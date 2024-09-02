const Queue = require("bull");
// const redis = require("./redisConfig");
const serverConfig = require("./serverConfig");

const redisConfig = {
  host: serverConfig.REDIS_HOST,
  port: serverConfig.REDIS_PORT,
  password: serverConfig.REDIS_PASSWORD,
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

statusQueue.on("completed", (job) => {
  console.log("Status job completed",job.data);
});

otpQueue.on("completed", (job) => {
  console.log("OTP job completed", job.data);
});

userQueue.on("completed", (job) => {
  console.log("User job completed", job.data);
});

imageQueue.on("completed", (job) => {
  console.log("Image job completed", job.data );
});

friendQueue.on("completed", (job) => {
  console.log("Friend job completed", job.data);
});

statusQueue.on("failed", (job) => {
  console.log("Status job failed", job.data);
});

otpQueue.on("failed", (job) => {
  console.log("OTP job failed",job.data);
});

userQueue.on("failed", (job) => {
  console.log("User job failed", job.data);
});

imageQueue.on("failed", (job) => {
  console.log("Image job failed",job.data );
});

friendQueue.on("failed", (job) => {
  console.log("Friend job failed", job.data);
});


module.exports = {
  statusQueue,
  otpQueue,
  userQueue,
  imageQueue,
  friendQueue,
};
