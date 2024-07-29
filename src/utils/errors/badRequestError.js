const AppError = require("./appError");

class BadRequestError extends AppError {
    constructor(invalidParams) {
        if (Array.isArray(invalidParams)) {
            const message = invalidParams.join("\n");
            super(
                `The request has the following invalid parameters:\n${message}`,
                400
            );
        } else {
            super(invalidParams, 400);
        }
    }
}

module.exports = BadRequestError;