const express = require('express');
const meetingController = require('../controllers/meetingController');
const authValidator = require('../validators/authValidator');
const meetingRouter = express.Router();

// create
meetingRouter.post('/create', authValidator.isLoggedIn, meetingController.createMeeting);

// status
meetingRouter.put('/update-status/:status/:meetingId', authValidator.isLoggedIn, meetingController.updateMeetingStatus);
meetingRouter.get('/participant/:status', authValidator.isLoggedIn, meetingController.getMeetingByParticipantIdWithStatus);
meetingRouter.get('/creator/:status', authValidator.isLoggedIn, meetingController.getMeetingByStatusAndUserId);
// Join meeting
meetingRouter.get('/participants/join/:meetingId', authValidator.isLoggedIn, meetingController.participantsJoinMeeting);
meetingRouter.get('/creator/join/:meetingId', authValidator.isLoggedIn, meetingController.creatorJoinMeeting);
// update
meetingRouter.put('/update', authValidator.isLoggedIn, meetingController.updateMeeting);


module.exports = meetingRouter;