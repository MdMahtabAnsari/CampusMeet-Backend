const mongoose = require('mongoose');

const serverConfig = require('./serverConfig');

const connectToDB = async () => {
    try {
        await mongoose.connect(serverConfig.DB_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
};
