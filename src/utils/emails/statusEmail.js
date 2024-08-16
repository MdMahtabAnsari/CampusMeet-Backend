const UserRepository = require('../../repositories/userRepository');
const queueConfig = require('../../configs/queueConfig');
const EmailTemplateService = require('../../services/emailTemplateService');
const userRepository = new UserRepository();
const emailTemplateService = new EmailTemplateService();

const cancelEmail = async (meeting) => {
    try {
        if (meeting.status == 'cancelled') {
            if (meeting.participants.length > 0) {


                for (const participant of meeting.participants) {
                    const user = await userRepository.getUserById(participant);
                    const cancelTemplate = await emailTemplateService.generateEmailTemplate('cancelEmail', {
                        name: user.name,
                        title: meeting.title,
                        date: meeting.date,
                        startTime: meeting.startTime,
                        endTime: meeting.endTime
                    });
                    const emailData = {
                        to: user.email,
                        subject: 'Meeting Cancelled',
                        html: cancelTemplate
                    }

                    queueConfig.statusQueue.add(emailData);

                }
            }
            else {
                if (meeting.type == 'Broadcast') {
                    const users = await userRepository.getAllUsers();
                    for (const user of users) {
                        const cancelTemplate = await emailTemplateService.generateEmailTemplate('cancelEmail', {
                            name: user.name,
                            title: meeting.title,
                            date: meeting.date,
                            startTime: meeting.startTime,
                            endTime: meeting.endTime
                        });
                        const emailData = {
                            to: user.email,
                            subject: 'Meeting Cancelled',
                            html: cancelTemplate
                        }
                        queueConfig.statusQueue.add(emailData);


                    }
                }
            }
        }
    }
    catch (error) {
        console.error('Error processing meetings:', error);
        throw error;
    }
}

module.exports = {
    cancelEmail
};