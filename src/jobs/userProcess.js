const EmailService = require('../services/emailService');
const queueConfig = require('../configs/queueConfig');
const emailService = new EmailService();

const userProcess = async () => {
    queueConfig.userQueue.process(async (job) => {
        try {
            await emailService.sendEmail(job.data);
        }
        catch (error) {
            throw error;
        }
    });
}

module.exports = userProcess;