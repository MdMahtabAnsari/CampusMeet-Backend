const SocketRepository = require("../repositories/socketRepository");
const InternalServerError = require("../utils/errors/internalServerError");
const AppError = require("../utils/errors/appError");

class SocketService {
  constructor() {
    this.socketRepository = new SocketRepository();
  }
  async handleSokcet(socket) {
    try {
      const userId = socket.userId;
      await this.socketRepository.saveSocketId(userId, socket.id);
      socket.on("disconnect", async () => {
        await this.socketRepository.deleteUserId(socket.id);
        console.log("User disconnected");
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.log(error);
      throw new InternalServerError();
    }
  }
}

module.exports = SocketService;
