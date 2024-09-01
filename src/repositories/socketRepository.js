const redis = require("../configs/redisConfig");
const UserRepository = require("../repositories/userRepository");
const InternalServerError = require("../utils/errors/internalServerError");
const AppError = require("../utils/errors/appError");
const NotFoundError = require("../utils/errors/notFoundError");

class SocketRepository {
  constructor() {
    this.redis = redis;
    this.userRepository = new UserRepository();
  }
  async saveSocketId(userId, socketId) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundError("User");
      }
      const key = `socket:users:${userId}`;
      await this.redis.set(key, socketId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
    }
  }

  async getSocketId(userId) {
    try {
      const key = `socket:users:${userId}`;
      const socketId = await this.redis.get(key);
      return socketId;
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }
  }

  async deleteSocketId(userId) {
    try {
      const key = `socket:users:${userId}`;
      await this.redis.del(key);
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }
  }

  async getUserId(socketId) {
    try {
      const keys = await this.redis.keys("socket:users:*");
      for (let key of keys) {
        const value = await this.redis.get(key);
        if (value === socketId) {
          const userId = key.split(":")[2];
          return userId;
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }
  }
  async deleteUserId(socketId) {
    try {
      const keys = await this.redis.keys("socket:users:*");
     
      for (let key of keys) {
        const value = await this.redis.get(key);
       
        if (value === socketId) {
          await this.redis.del(key);
          return;
        }
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }
}

module.exports = SocketRepository;
