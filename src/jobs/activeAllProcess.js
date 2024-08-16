const otpProcess = require('./otpProcess');
const statusProcess = require('./statusProcess');
const scheduler = require('./scheduler');
const userProcess = require('./userProcess');
const imageProcess = require('./imageProcess');

const activeAllProcess = async () => {
    try {
        scheduler();
        statusProcess();
        otpProcess();
        userProcess();
        imageProcess();
    }
    catch (error) {
        console.error('Error processing all jobs:', error);
        throw error;
    }
}

module.exports = activeAllProcess;