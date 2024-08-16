const core = require('node-cron');
const MeetingRepository = require('../repositories/meetingRepository');
const serverConfig = require('../configs/serverConfig');
const moment = require('moment');
const statusEmail = require('../utils/emails/statusEmail');
const meetingRepository = new MeetingRepository();

const scheduler = () => {
    core.schedule(serverConfig.CORN_SCHEDULE, async () => {
        try {
            const meetings = await meetingRepository.getMeetingByStatus('upcoming');

            for (const meeting of meetings) {
                const endTimeCheck = moment(`${meeting.date} ${meeting.endTime}`, 'DD/MM/YYYY hh:mm A');
                if (endTimeCheck.isBefore(moment())) {
                    const updatedMeeting = await meetingRepository.updateMeetingStatus(meeting._id, 'cancelled');
                    statusEmail.cancelEmail(updatedMeeting);
                }
            }
        } catch (error) {
            console.error('Error processing meetings:', error);
        }
    });
}

module.exports = scheduler;
