const express = require('express');
const authController = require('../controllers/authController');
const otpValidator = require('../validators/otpValidator');

const authRouter = express.Router();

authRouter.post('/signin', authController.signIn);
authRouter.delete('/signout', authController.signOut);
authRouter.post('/resetPassword', otpValidator.tokenValidator, authController.updatePassword);



module.exports = authRouter;