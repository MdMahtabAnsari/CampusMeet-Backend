const cloudinary = require('cloudinary').v2;
const serverConfig = require('./serverConfig');

cloudinary.config({
    cloud_name: serverConfig.CLOUD_NAME,
    api_key: serverConfig.CLOUD_API_KEY,
    api_secret: serverConfig.CLOUD_API_SECRET,
});

module.exports = cloudinary;
