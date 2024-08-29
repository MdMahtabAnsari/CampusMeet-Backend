const express = require('express');
const meetingController = require('../controllers/meetingController');
const authValidator = require('../validators/authValidator');
const meetingRouter = express.Router();

// create
meetingRouter.post('/create', authValidator.isLoggedIn, meetingController.createMeeting);
// Join Metting
meetingRouter.get('/participants/join/:meetingId', authValidator.isLoggedIn, meetingController.participantsJoinMeeting);
meetingRouter.get('/creator/join/:meetingId', authValidator.isLoggedIn, meetingController.creatorJoinMeeting);
// status
meetingRouter.put('/update-status/:status/:meetingId', authValidator.isLoggedIn, meetingController.updateMeetingStatus);
meetingRouter.get('/participant/:status', authValidator.isLoggedIn, meetingController.getMeetingByParticipantIdWithStatus);
meetingRouter.get('/creator/:status', authValidator.isLoggedIn, meetingController.getMeetingByStatusAndUserId);
// get meeting by status and meeting id
meetingRouter.get('/participant/:status/:meetingId', authValidator.isLoggedIn, meetingController.getMeetingByParticipantIdWithStatusAndMeetingId);
meetingRouter.get('/creator/:status/:meetingId', authValidator.isLoggedIn, meetingController.getMeetingByStatusAndUserIdAndMeetingId);
meetingRouter.get('/:meetingId', authValidator.isLoggedIn, meetingController.getMeetingByIdAndUserId);

// update
meetingRouter.put('/update/:meetingId', authValidator.isLoggedIn, meetingController.updateMeeting);


module.exports = meetingRouter;