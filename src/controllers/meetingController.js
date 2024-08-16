const MeetingService = require('../services/meetingService');
const AppError = require('../utils/errors/appError');
const meetingService = new MeetingService();

const createMeeting = async (req, res) => {
    try {
        const meeting = req.body;
        meeting.participants = meeting.participants ? meeting.participants.split(',') : [];
        const id = req.user.id;
        const response = await meetingService.createMeeting({
            title: meeting.title,
            description: meeting.description,
            type: meeting.type,
            date: meeting.date,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
            participants: meeting.participants,
            createdBy: id
        });
        res.status(201).json({
            message: "Successfully created the meeting",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}



const updateMeetingStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.params?.status;
        const meetingId = req.params?.meetingId;
        const response = await meetingService.updateMeetingStatus({
            createdBy: userId,
            status: status,
            id: meetingId
        });
        res.status(200).json({
            message: "Successfully updated the meeting status",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const getMeetingByParticipantIdWithStatus = async (req, res) => {
    try {
        const status = req.params?.status;
        const userId = req.user?.id;
        const response = await meetingService.getMeetingByParticipantIdWithStatus(userId, status);
        res.status(200).json({
            message: "Successfully retrieved the meetings",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const getMeetingByStatusAndUserId = async (req, res) => {
    try {
        const status = req.params?.status;
        const userId = req.user?.id;
        const response = await meetingService.getMeetingByStatusAndUserId(status, userId);
        res.status(200).json({
            message: "Successfully retrieved the meetings",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const participantsJoinMeeting = async (req, res) => {
    try {
        const meetingId = req.params?.meetingId;
        const participantId = req.user?.id;
        const response = await meetingService.participantsJoinMeeting(meetingId, participantId);
        res.status(200).json({
            message: "Successfully joined the meeting",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const updateMeeting = async (req, res) => {
    try {
        const meeting = req.body;
        const id = req.user?.id;
        const response = await meetingService.updateMeeting(meeting, id);
        res.status(200).json({
            message: "Successfully updated the meeting",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const creatorJoinMeeting = async (req, res) => {
    try {
        const meetingId = req.params?.meetingId;
        const creatorId = req.user?.id;
        const response = await meetingService.creatorJoinMeeting(meetingId, creatorId);
        res.status(200).json({
            message: "Successfully joined the meeting",
            success: true,
            data: response,
            error: {},
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

module.exports = {
    createMeeting,
    updateMeetingStatus,
    getMeetingByParticipantIdWithStatus,
    getMeetingByStatusAndUserId,
    participantsJoinMeeting,
    updateMeeting,
    creatorJoinMeeting

};