const multer = require('multer');
const fs = require('fs');
const path = require('path');
const BadRequestError = require('../utils/errors/badRequestError');
const serverConfig = require('./serverConfig');

const currDir = process.cwd();
const uploadDir = path.join(currDir, 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdir(uploadDir, { recursive: true }, (err) => {
                if (err) {
                    return cb(err, null);
                }
                cb(null, uploadDir);
            });
        }
        else {
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new BadRequestError('Only images are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(serverConfig.MAX_FILE_SIZE) * 1024 * 1024
    },
    fileFilter: fileFilter,
});

module.exports = upload;