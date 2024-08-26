const express = require('express');
const friendRequestController = require('../controllers/friendRequestController');
const authValidator = require('../validators/authValidator');
const friendRequestRouter = express.Router();

friendRequestRouter.post('/send/:receiverId', authValidator.isLoggedIn, friendRequestController.sendFriendRequest);
friendRequestRouter.post('/accept/:senderId', authValidator.isLoggedIn, friendRequestController.acceptFriendRequest);
friendRequestRouter.post('/reject/:senderId', authValidator.isLoggedIn, friendRequestController.rejectFriendRequest);
friendRequestRouter.delete('/cancel/:receiverId', authValidator.isLoggedIn, friendRequestController.cancelFriendRequest);
friendRequestRouter.get('/received', authValidator.isLoggedIn, friendRequestController.getAllFriendRequestByReceiver);
friendRequestRouter.get('/sent', authValidator.isLoggedIn, friendRequestController.getAllFriendRequestBySender);

module.exports = friendRequestRouter;

