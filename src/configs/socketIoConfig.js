// src/socketManager.js
const { Server } = require("socket.io");
const InternalServerError = require("../utils/errors/internalServerError");
const corsConfig = require("./corsConfig");
const { validateSocketConnection } = require("../validators/socketValidator");
const SocketService = require("../services/socketService");
const socketService = new SocketService();
const AppError = require("../utils/errors/appError");

let io;
function socketInit(server) {
  try {
    io = new Server(server, {
      cors: {
        origin: corsConfig.origin,
        credentials: corsConfig.credentials,
        methods: corsConfig.methods.split(","),
      },
    });
    io.use(validateSocketConnection);
    io.on("connection", (socket) => {
      console.log("A user connected");
      socketService.handleSokcet(socket);
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log(error);
    throw new InternalServerError();
  }
}

function getIO() {
  if (!io) {
    console.log("Socket.io not initialized");
    throw new InternalServerError();
  }
  return io;
}

module.exports = { socketInit, getIO };
