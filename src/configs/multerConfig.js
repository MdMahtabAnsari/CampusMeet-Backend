const multer = require('multer');
const fs = require('fs');
const path = require('path');
const BadRequestError = require('../utils/errors/badRequestError');
const serverConfig = require('./serverConfig');

const currDir = process.cwd();
const uploadDir = path.join(currDir, 'uploads');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.promises.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (err) {
            cb(err, uploadDir);
        }
    }
    ,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new BadRequestError("File type not allowed"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(serverConfig.MAX_FILE_SIZE) * 1024 * 1024 // 1MB in bytes 
    }
});

module.exports = upload;