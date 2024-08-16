const upload = require('../configs/multerConfig');
const multer = require('multer');
const AppError = require('../utils/errors/appError')

const imageUploader = (req, res, next) => {
    upload(req, res, (error) => {
        console.log(error);
        if (error instanceof multer.MulterError) {
            res.status(400).json({
                message: error.message,
                success: false,
                data: {},
                error: "error"
            });
        }
        else if (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    success: false,
                    data: {},
                    error: error.status
                });
            }
            else {
                res.status(500).json({
                    message: "Internal Server Error",
                    success: false,
                    data: {},
                    error: "error"
                });
            }
        }
        else {
            next();
        }
    });
}

module.exports = {
    imageUploader
};