const MeetingRepository = require('../repositories/meetingRepository');
const FriendRepository = require('../repositories/friendRepository');
const UserRepository = require('../repositories/userRepository');
const BadRequestError = require('../utils/errors/badRequestError');
const randomstring = require('randomstring');
const serverConfig = require('../configs/serverConfig');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const UnAuthorizedError = require('../utils/errors/unAuthorizedError');
const NotFoundError = require('../utils/errors/notFoundError');
const moment = require('moment-timezone');
const statusEmail = require('../utils/emails/statusEmail');



class MeetingService {
    constructor() {
        this.meetingRepository = new MeetingRepository();
        this.friendRepository = new FriendRepository();
        this.userRepository = new UserRepository();
    }

    async validateMeeting(meeting) {
        try {
            const timeZone = "Asia/Kolkata";
            const date = moment.tz(meeting.date, 'DD/MM/YYYY', timeZone);
            if (!date.isValid()) {
                throw new BadRequestError('Invalid date format. Date should be in DD/MM/YYYY format only');
            }
            const startTime = moment.tz(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A', timeZone);
            if (!startTime.isValid()) {
                throw new BadRequestError('Invalid start time format. Start time should be in HH:MM AM/PM format only');
            }
            const endTime = moment.tz(`${meeting.date} ${meeting.endTime}`, 'DD/MM/YYYY hh:mm A', timeZone);
            if (!endTime.isValid()) {
                throw new BadRequestError('Invalid end time format. End time should be in HH:MM AM/PM format only');
            }
            if (startTime.isBefore(moment.tz(timeZone))) {
                throw new BadRequestError('Meeting date and time should be in future');
            }
    
            if (endTime.isBefore(startTime)) {
                throw new BadRequestError('End time should be after start time');
            }
            if (!Array.isArray(meeting.participants)) {

                throw new BadRequestError('Participants should be an array');
            }
            if (meeting.participants.includes(meeting.createdBy)) {
                throw new BadRequestError('Creator should not be in participants list');
            }
            if (meeting.type === '1V1' && meeting.participants.length !== 1) {
                throw new BadRequestError('1V1 meeting should have only one participant');
            }
            if (meeting.type === 'Group' && meeting.participants.length < 2) {
                throw new BadRequestError('Group meeting should have atleast two participants');
            }
            if (meeting.type === 'Group' && meeting.participants.length > 99) {
                throw new BadRequestError('Group meeting should have atmost 99 participants');
            }
            const friends = await this.friendRepository.getFriendById(meeting.createdBy);


            if (!friends || friends.friends.length === 0) {
                throw new BadRequestError('You do not have any friends to create a meeting');
            }
            const friendSet = new Set(friends.friends.map(friend => friend.toString()));
            for (let i = 0; i < meeting.participants.length; i++) {
                if (!friendSet.has(meeting.participants[i])) {
                    throw new BadRequestError('You can only create meeting with your friends');
                }
            }

            meeting.link = randomstring.generate(parseInt(serverConfig.STRING_LENGTH));
            return meeting;
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
    async createMeeting(meeting) {
        try {

            const validatedMeeting = await this.validateMeeting(meeting);
            const createdMeeting = await this.meetingRepository.createMeeting(validatedMeeting);
            statusEmail.upComingEmail(createdMeeting);
            return createdMeeting;


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
            if (!meeting) {
                throw new NotFoundError('Meeting');
            }
            if (meeting.createdBy != statusBody.createdBy) {
                throw new UnAuthorizedError('You are not authorized to update this meeting');
            }
            if (meeting.status == 'completed' || meeting.status == 'cancelled') {
                throw new BadRequestError('Meeting status cannot be updated');
            }
            if (statusBody.status == meeting.status) {
                throw new BadRequestError(`Meeting status is already ${statusBody.status}`);
            }
            if (meeting.status == 'upcoming' && statusBody.status == 'completed') {
                throw new BadRequestError('Meeting status cannot be updated to completed without starting the meeting');
            }
            if (meeting.status == 'in-progress' && statusBody.status == 'upcoming') {
                throw new BadRequestError('Meeting status cannot be updated to upcoming after starting the meeting');
            }
            if (meeting.status == 'in-progress' && statusBody.status == 'cancelled') {
                throw new BadRequestError('Meeting status cannot be updated to cancelled after starting the meeting');
            }
            const timeZone = "Asia/Kolkata";
            const dateTime = moment.tz(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A', timeZone);
            const now = moment.tz(timeZone);
            if (meeting.status == 'upcoming' && statusBody.status == 'in-progress' && dateTime.isAfter(now)) {
                throw new BadRequestError('Meeting date and time should be in past to start the meeting');
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
            const meetings = await this.meetingRepository.getMeetingByParticipantIdWithStatusWithPopulate(participantId, status);
            return meetings;

        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }


    async getMeetingByStatusAndUserId(status, userId) {
        try {
            const meetings = await this.meetingRepository.getMeetingByStatusAndUserIdWithPopulate(status, userId);
            return meetings;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }

    async participantsJoinMeeting(meetingId, participantId) {
        try {
            const meeting = await this.meetingRepository.getMeetingById(meetingId);
            if (!meeting) {
                throw new NotFoundError('Meeting');
            }
            if (meeting.status != 'in-progress') {
                throw new BadRequestError('Creator has not started the meeting yet');
            }
            if (meeting.type == '1V1' && meeting.participants[0] != participantId) {
                throw new UnAuthorizedError('You are not authorized to join this meeting');
            }
            if (meeting.type == 'Group'  && !meeting.participants.includes(participantId)) {
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
                throw new NotFoundError('Meeting');
            }
            if (meeting.createdBy != userId) {
                throw new UnAuthorizedError('You are not authorized to join this meeting');
            }
            if (meeting.status == 'in-progress') {
                return {
                    _id: meeting._id,
                    link: meeting.link
                }
            }
            const timeZone = "Asia/Kolkata";
            const dateTime = moment.tz(`${meeting.date} ${meeting.startTime}`, 'DD/MM/YYYY hh:mm A', timeZone);
            const now = moment.tz(timeZone);
            if (dateTime.isAfter(now)) {
                throw new BadRequestError('Meeting date and time should be in past to join the meeting');
            }
            await this.meetingRepository.updateMeetingStatus(meetingId, 'in-progress');
            statusEmail.inProgressEmail(meeting);

            return {
                _id: meeting._id,
                link: meeting.link
            }
        }
        catch (error) {

            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
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
            if (existMeeting.createdBy != id) {
                throw new UnAuthorizedError('You are not authorized to update this meeting');
            }
            if (existMeeting.status == 'completed' || existMeeting.status == 'cancelled') {
                throw new BadRequestError('Meeting status cannot be updated');
            }
            if(existMeeting.status == 'in-progress'){
                throw new BadRequestError('Meeting status cannot be updated');
            }
            const validatedMeeting = await this.validateMeeting(meeting);
            const updatedMeeting = await this.meetingRepository.updateMeeting(validatedMeeting, meeting._id);
            statusEmail.updateMeetingEmail(updatedMeeting);
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

    async getMeetingByParticipantIdWithStatusAndMeetingId(participantId, status, meetingId) {
        try{
            const meeting = await this.meetingRepository.getMeetingByIdAndStatus(meetingId, status);
            if(!meeting){
                throw new NotFoundError('Meeting');
            }
            if(!meeting.participants.includes(participantId)){
                throw new UnAuthorizedError('You are not authorized to view this meeting');
            }
            return meeting;
        }
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            else{
                throw new InternalServerError();
            }
        }
    }
    async getMeetingByStatusAndUserIdAndMeetingId(status, userId, meetingId) {
        try{
            const meeting = await this.meetingRepository.getMeetingByIdAndStatus(meetingId, status);
            if(!meeting){
                throw new NotFoundError('Meeting');
            }
            if(meeting.createdBy != userId){
                throw new UnAuthorizedError('You are not authorized to view this meeting');
            }
            return meeting;
        }
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            else{
                throw new InternalServerError();
            }
        }
    }
    async getMeetingByIdAndCreatorId(meetingId, creatorId){
        try{
            const meeting = await this.meetingRepository.getMeetingByIdAndCreatorIdWithPopulate(meetingId, creatorId);
            if(!meeting){
                throw new NotFoundError('Meeting');
            }
            return meeting;
        }
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            else{
                throw new InternalServerError();
            }
        }
    }

}

module.exports = MeetingService;