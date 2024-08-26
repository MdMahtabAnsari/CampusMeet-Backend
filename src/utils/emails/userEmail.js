const queueConfig = require('../../configs/queueConfig');
const EmailTemplateService = require('../../services/emailTemplateService');
const emailTemplateService = new EmailTemplateService();

const changedPasswordEmail = async (changedPasswordData) => {
    try {

        const changedPasswordTemplate = await emailTemplateService.generateEmailTemplate('changedPasswordEmail', {
            name: changedPasswordData.name
        });
        const emailData = {
            to: changedPasswordData.to,
            subject: 'Password Changed Successfully',
            html: changedPasswordTemplate
        }
        queueConfig.userQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing changed password:', error);
        throw error;
    }
}

const welcomeEmail = async (userData) => {
    try {
        const welcomeTemplate = await emailTemplateService.generateEmailTemplate('welcomeEmail', {
            name: userData.name
        });
        const emailData = {
            to: userData.to,
            subject: 'Welcome to our platform',
            html: welcomeTemplate
        }
        queueConfig.userQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing welcome email:', error);
        throw error;
    }
}

const updateEmail = async (userData) => {
    try {
        const updateTemplate = await emailTemplateService.generateEmailTemplate('updateEmail', {
            name: userData.name,
            email: userData.to,
            phone: userData.phone
        });
        const emailData = {
            to: userData.to,
            subject: 'Profile Updated',
            html: updateTemplate
        }
        queueConfig.userQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing update email:', error);
        throw error;
    }
}



module.exports = {
    changedPasswordEmail,
    welcomeEmail,
    updateEmail
};