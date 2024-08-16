const EmailService = require('../services/emailService');
const queueConfig = require('../configs/queueConfig');
const emailService = new EmailService();

const otpProcess = async () => {
    queueConfig.otpQueue.process(async (job) => {
        try {
            await emailService.sendEmail(job.data);
        }
        catch (error) {
            throw error;
        }
    });
}

module.exports = otpProcess;