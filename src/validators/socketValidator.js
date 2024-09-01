const jwt = require("jsonwebtoken");
const serverConfig = require("../configs/serverConfig");
const UnauthorizedError = require("../utils/errors/unAuthorizedError");
const InternalServerError = require("../utils/errors/internalServerError");
const AppError = require("../utils/errors/appError");

// make a middleware that user have valid token to make socket connection and its comes in cookies with name authToken

const validateSocketConnection = (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie.split("=")[1];
    if (!token) {
      throw new UnauthorizedError();
    }
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

module.exports = {
  validateSocketConnection,
};
