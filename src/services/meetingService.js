const MeetingRepository = require('../repositories/meetingRepository');
const BadRequestError = require('../utils/errors/badRequestError');
const randomstring = require('randomstring');
const serverConfig = require('../configs/serverConfig');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const UnAuthorizedError = require('../utils/errors/unAuthorizedError');
const moment = require('moment');
const statusEmail = require('../utils/emails/statusEmail');


class MeetingService {
    constructor() {
        this.meetingRepository = new MeetingRepository();
    }

    async createMeeting(meeting) {
        try {

            const date = moment(meeting.date, 'DD/MM/YYYY');
            if (!date.isValid()) {
                throw new BadRequestError('Invalid date format. Date should be in DD/MM/YYYY format only');
            }
            const startTime = moment(meeting.startTime, 'hh:mm A');
            if (!startTime.isValid()) {
                throw new BadRequestError('Invalid start time format. Start time should be in HH:MM AM/PM format only');
            }
            const endTime = moment(meeting.endTime, 'hh:mm A');
            if (!endTime.isValid()) {
                throw new BadRequestError('Invalid end time format. End time should be in HH:MM AM/PM format only');
            }
            const startTimeCheck = moment(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A');
            if (startTimeCheck.isBefore(moment())) {
                throw new BadRequestError('Meeting date and time should be in future');
            }
            const endTimeCheck = moment(`${meeting.date} ${meeting.endTime}`, 'DD/MM/YYYY hh:mm A');
            if (endTimeCheck.isBefore(startTimeCheck)) {
                throw new BadRequestError('End time should be after start time');
            }
            if (meeting.type === '1V1' && meeting.participants.length !== 1) {
                throw new BadRequestError('1V1 meeting should have only one participant');
            }
            if (meeting.type === 'Group' && meeting.participants.length < 2) {
                throw new BadRequestError('Group meeting should have atleast two participants');
            }

            meeting.link = randomstring.generate(parseInt(serverConfig.STRING_LENGTH));
            return await this.meetingRepository.createMeeting(meeting);


        }
        catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async updateMeetingStatus(statusBody) {
        try {
            const meeting = await this.meetingRepository.getMeetingById(statusBody.id);
            if (meeting.createdBy != statusBody.createdBy) {
                throw new UnAuthorizedError('You are not authorized to update this meeting');
            }
            const updatedMeeting = await this.meetingRepository.updateMeetingStatus(statusBody.id, statusBody.status);
            if (updatedMeeting.status == 'cancelled') {
                statusEmail.cancelEmail(updatedMeeting);
            }
            return updatedMeeting;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async getMeetingByParticipantIdWithStatus(participantId, status) {
        try {
            const meetings = await this.meetingRepository.getMeetingByParticipantIdWithStatus(participantId, status);
            return meetings.map(meeting => {
                return {
                    _id: meeting._id,
                    title: meeting.title,
                    description: meeting.description,
                    type: meeting.type,
                    date: meeting.date,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime,
                    status: meeting.status,
                    createdBy: meeting.createdBy,
                    link: meeting.link
                }
            });

        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }


    async getMeetingByStatusAndUserId(status, userId) {
        try {
            return await this.meetingRepository.getMeetingByStatusAndUserId(status, userId);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async participantsJoinMeeting(meetingId, participantId) {
        try {
            const meeting = await this.meetingRepository.getMeetingById(meetingId);
            if (!meeting) {
                throw new BadRequestError('Meeting not found');
            }
            if (meeting.status != 'in-progress') {
                throw new BadRequestError('Creator has not started the meeting yet');
            }
            if (meeting.type == '1V1' && meeting.participants[0] != participantId) {
                throw new UnAuthorizedError('You are not authorized to join this meeting');
            }
            if (meeting.type == 'Group' && !meeting.participants.includes(participantId)) {
                throw new UnAuthorizedError('You are not authorized to join this meeting');
            }

            return {
                link: meeting.link
            }


        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async creatorJoinMeeting(meetingId, userId) {
        try {
            const meeting = await this.meetingRepository.getMeetingById(meetingId);
            if (!meeting) {
                throw new BadRequestError('Meeting not found');
            }
            console.log(meeting.createdBy, userId);
            if (meeting.createdBy != userId) {
                throw new UnAuthorizedError('You are not authorized to join this meeting');
            }
            const dateTime = moment(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A');
            if (dateTime.isAfter(moment())) {
                throw new BadRequestError('Meeting date and time should be in past to join the meeting');
            }
            await this.meetingRepository.updateMeetingStatus(meetingId, 'in-progress');
            return {
                link: meeting.link
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async updateMeeting(meeting, id) {
        try {
            const existMeeting = await this.meetingRepository.getMeetingById(meeting._id);
            if (!existMeeting) {
                throw new BadRequestError('Meeting not found');
            }
            if (existMeeting.createdBy !== id) {
                throw new UnAuthorizedError('You are not authorized to update this meeting');
            }


            const date = moment(meeting.date, 'DD/MM/YYYY');
            if (!date.isValid()) {
                throw new BadRequestError('Invalid date format. Date should be in DD/MM/YYYY format only');
            }
            const startTime = moment(meeting.startTime, 'hh:mm A');
            if (!startTime.isValid()) {
                throw new BadRequestError('Invalid start time format. Start time should be in HH:MM AM/PM format only');
            }
            const endTime = moment(meeting.endTime, 'hh:mm A');
            if (!endTime.isValid()) {
                throw new BadRequestError('Invalid end time format. End time should be in HH:MM AM/PM format only');
            }

            const startTimeCheck = moment(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A');
            if (startTimeCheck.isBefore(moment())) {
                throw new BadRequestError('Meeting date and time should be in future');
            }
            const endTimeCheck = moment(`${meeting.date} ${meeting.endTime}`, 'DD/MM/YYYY hh:mm A');
            if (endTimeCheck.isBefore(startTimeCheck)) {
                throw new BadRequestError('End time should be after start time');
            }

            if (meeting.type === '1V1' && meeting.participants.length !== 1) {
                throw new BadRequestError('1V1 meeting should have only one participant');
            }
            if (meeting.type === 'Group' && meeting.participants.length < 2) {
                throw new BadRequestError('Group meeting should have atleast two participants');
            }

            meeting.link = randomstring.generate(parseInt(serverConfig.STRING_LENGTH));
            return await this.meetingRepository.updateMeeting(meeting, id);

        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }
}

module.exports = MeetingService;