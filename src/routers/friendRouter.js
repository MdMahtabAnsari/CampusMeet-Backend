const express = require('express');

const friendController = require('../controllers/friendController');
const authValidator = require('../validators/authValidator');

const friendRouter = express.Router();

friendRouter.get('/', authValidator.isLoggedIn, friendController.getFriends);
friendRouter.delete('/unfriend/:friendId', authValidator.isLoggedIn, friendController.removeFriend);

module.exports = friendRouter;
