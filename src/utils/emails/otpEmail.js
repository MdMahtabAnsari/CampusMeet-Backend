const queueConfig = require('../../configs/queueConfig');
const EmailTemplateService = require('../../services/emailTemplateService');
const serverConfig = require('../../configs/serverConfig');
const emailTemplateService = new EmailTemplateService();
const otpEmail = async (otpData) => {
    try {

        const otpTemplate = await emailTemplateService.generateEmailTemplate('otpEmail', {
            otp: otpData.otp,
            expire_in: serverConfig.OTP_EXPIRES_IN
        });
        const emailData = {
            to: otpData.to,
            subject: 'OTP for Verification',
            html: otpTemplate
        }
        queueConfig.otpQueue.add(emailData,{
            removeOnComplete: true,
        });
    }
    catch (error) {
        console.error('Error processing OTP:', error);
        throw error;
    }
}

module.exports = otpEmail;
