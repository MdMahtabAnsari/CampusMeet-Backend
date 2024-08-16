const express = require('express');
const otpController = require('../controllers/otpController');
const otpRouter = express.Router();

otpRouter.post('/create', otpController.createOtp);
otpRouter.post('/verify', otpController.verifyOtp);

module.exports = otpRouter;