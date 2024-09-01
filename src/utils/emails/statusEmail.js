const UserRepository = require('../../repositories/userRepository');
const queueConfig = require('../../configs/queueConfig');
const EmailTemplateService = require('../../services/emailTemplateService');
const userRepository = new UserRepository();
const emailTemplateService = new EmailTemplateService();

const cancelEmail = async (meeting) => {
    try {
        if (meeting.status == 'cancelled' && meeting.participants.length > 0) {

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

                queueConfig.statusQueue.add(emailData,{
                    removeOnComplete: true,
                });

            }

        }
    }
    catch (error) {
        console.error('Error processing meetings:', error);
        throw error;
    }
}

const upComingEmail = async (meeting) => {
    try {
        if (meeting.status == 'upcoming' && meeting.participants.length > 0) {

            for (const participant of meeting.participants) {
                const user = await userRepository.getUserById(participant);
                const upComingTemplate = await emailTemplateService.generateEmailTemplate('upcomingEmail', {
                    name: user.name,
                    title: meeting.title,
                    date: meeting.date,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime
                });
                const emailData = {
                    to: user.email,
                    subject: 'Meeting Upcoming',
                    html: upComingTemplate
                }

                queueConfig.statusQueue.add(emailData,{
                    removeOnComplete: true,
                });
            }
        }
    }
    catch (error) {
        console.error('Error processing meetings:', error);
        throw error;
    }
}

const inProgressEmail = async (meeting) => {
    try {
        if (meeting.status == 'inprogress' && meeting.participants.length > 0) {

            for (const participant of meeting.participants) {
                const user = await userRepository.getUserById(participant);
                const inProgressTemplate = await emailTemplateService.generateEmailTemplate('inprogressEmail', {
                    name: user.name,
                    title: meeting.title,
                    date: meeting.date,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime
                });
                const emailData = {
                    to: user.email,
                    subject: 'Meeting In Progress',
                    html: inProgressTemplate
                }

                queueConfig.statusQueue.add(emailData);

            }
        }
    }
    catch (error) {
        console.error('Error processing meetings:', error);
        throw error;
    }
}

const updateMeetingEmail = async (meeting) => {
    try {
        if (meeting.participants.length > 0) {

            for (const participant of meeting.participants) {
                const user = await userRepository.getUserById(participant);
                const updateTemplate = await emailTemplateService.generateEmailTemplate('updateMeetingEmail', {
                    name: user.name,
                    title: meeting.title,
                    date: meeting.date,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime
                });
                const emailData = {
                    to: user.email,
                    subject: 'Meeting Updated',
                    html: updateTemplate
                }

                queueConfig.statusQueue.add(emailData);

            }
        }
    }
    catch (error) {
        console.error('Error processing meetings:', error);
        throw error;
    }
}

module.exports = {
    cancelEmail,
    upComingEmail,
    inProgressEmail,
    updateMeetingEmail
};