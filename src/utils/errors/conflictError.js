const AppError = require('./appError');

class ConflictError extends AppError {
    constructor(message) {
        super(`${message} already exist`, 409);
    }
}

module.exports = ConflictError;