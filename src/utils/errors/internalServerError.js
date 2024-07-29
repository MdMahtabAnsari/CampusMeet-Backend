const appError = require('./appError');

class InternalServerError extends appError {
    constructor() {
        super("The server encountered an error and could not complete your request", 500);
    }
}

module.exports = InternalServerError;