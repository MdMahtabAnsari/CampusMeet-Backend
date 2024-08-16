const mongoose = require('mongoose');

const serverConfig = require('./serverConfig');

const connectToDB = async () => {
    try {
        await mongoose.connect(serverConfig.DB_URI);
        console.log('Connected to the database');
    } catch (error) {
        throw error;
    }
};

module.exports = {
    connectToDB
};
