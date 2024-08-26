const Meeting = require('../models/meetingModel');
const BadRequestError = require('../utils/errors/badRequestError');
const InternalServerError = require('../utils/errors/internalServerError');

class MeetingRepository {
    async createMeeting(meeting) {
        try {
            return await Meeting.create(meeting);
        }
        catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async getMeetingByStatus(status) {
        try {
            return await Meeting.find({ status });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async updateMeetingStatus(id, status) {
        try {
            return await Meeting.findByIdAndUpdate(id, { status: status }, { new: true });
        }
        catch (error) {
            console.log(error);

            throw new InternalServerError();

        }
    }

    async getMeetingByParticipantIdWithStatus(participantId, status) {
        try {
            const meetings = await Meeting.find({ participants: { $in: [participantId] }, status: status });
            return meetings;
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async getMeetingByParticipantIdWithStatusWithPopulate(participantId, status) {
        try {
            const meetings = await Meeting.find({ participants: { $in: [participantId] }, status: status }).populate('participants' , 'name email phone image').populate('createdBy', 'name email phone image');
            return meetings;
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    

    async getMeetingById(id) {
        try {
           
            return await Meeting.findById(id);
        }
        catch (error) {
            console.log(error);


            throw new InternalServerError();

        }
    }
    async getMeetingByStatusAndUserId(status, userId) {
        try {
            return await Meeting.find({ createdBy: userId, status: status });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getMeetingByStatusAndUserIdWithPopulate(status, userId) {
        try {
            return await Meeting.find({ createdBy: userId, status: status }).populate('participants', 'name email phone image').populate('createdBy', 'name email phone image');
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    
    
    async updateMeeting(meeting, id) {
        try {
            return await Meeting.findByIdAndUpdate(id, meeting, { new: true });
        }
        catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else {
                throw new InternalServerError();
            }
        }

    }
    async getMeetingByIdAndStatus(id, status) {
        try {
            return await Meeting.findOne({ _id: id, status: status });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
}

module.exports = MeetingRepository;