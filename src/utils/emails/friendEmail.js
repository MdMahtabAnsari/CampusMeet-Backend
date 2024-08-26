const queueConfig = require('../../configs/queueConfig');
const EmailTemplateService = require('../../services/emailTemplateService');

const emailTemplateService = new EmailTemplateService();

const friendRequestEmail = async (friendRequestData) => {
    try {

        const friendRequestTemplate = await emailTemplateService.generateEmailTemplate('friendRequestEmail', {
            name: friendRequestData.receiverName,
            friendName: friendRequestData.senderName,
            friendEmail: friendRequestData.senderEmail,
            friendPhone: friendRequestData.senderPhone,
            year: new Date().getFullYear()

        });
        const emailData = {
            to: friendRequestData.to,
            subject: 'Friend Request',
            html: friendRequestTemplate
        }
        queueConfig.friendQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing friend request:', error);
        throw error;
    }
}

const friendAcceptEmail = async (friendRequestData) => {
    try {
        const friendAcceptTemplate = await emailTemplateService.generateEmailTemplate('friendAcceptEmail', {
            name: friendRequestData.receiverName,
            friendName: friendRequestData.senderName,
            friendEmail: friendRequestData.senderEmail,
            friendPhone: friendRequestData.senderPhone,
            year: new Date().getFullYear()

        });
        const emailData = {
            to: friendRequestData.to,
            subject: 'Friend Request Accepted',
            html: friendAcceptTemplate
        }
        queueConfig.friendQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing friend request:', error);
        throw error;
    }
}

const friendRejectEmail = async (friendRequestData) => {
    try {
        const friendRejectTemplate = await emailTemplateService.generateEmailTemplate('friendRejectEmail', {
            name: friendRequestData.receiverName,
            friendName: friendRequestData.senderName,
            friendEmail: friendRequestData.senderEmail,
            friendPhone: friendRequestData.senderPhone,
            year: new Date().getFullYear()

        });
        const emailData = {
            to: friendRequestData.to,
            subject: 'Friend Request Rejected',
            html: friendRejectTemplate
        }
        queueConfig.friendQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing friend request:', error);
        throw error;
    }
}

const unFriendEmail = async (friendRequestData) => {
    try {
        const unFriendTemplate = await emailTemplateService.generateEmailTemplate('unFriendEmail', {
            name: friendRequestData.receiverName,
            friendName: friendRequestData.senderName,
            friendEmail: friendRequestData.senderEmail,
            friendPhone: friendRequestData.senderPhone,
            year: new Date().getFullYear()

        });
        const emailData = {
            to: friendRequestData.to,
            subject: 'Friend Removed',
            html: unFriendTemplate
        }
        queueConfig.friendQueue.add(emailData);
    }
    catch (error) {
        console.error('Error processing friend request:', error);
        throw error;
    }
}

module.exports = {
    friendRequestEmail,
    friendAcceptEmail,
    friendRejectEmail,
    unFriendEmail
};
