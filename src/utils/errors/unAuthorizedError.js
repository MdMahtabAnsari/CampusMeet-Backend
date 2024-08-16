const AppError = require('./appError');

class UnAuthorizedError extends AppError {
    constructor(message) {
        if (!message) {
            super("Unauthorized access", 401);
        }
        else {
            super(message, 401);
        }

    }
}

module.exports = UnAuthorizedError;