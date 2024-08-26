const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../configs/multerConfig');
const authValidator = require('../validators/authValidator');
const userRouter = express.Router();

userRouter.post('/signup', upload.single('image'), userController.createUser);
userRouter.put('/update', authValidator.isLoggedIn,upload.single('image'), userController.updateUser);
userRouter.get('/me', authValidator.isLoggedIn, userController.getUser);
userRouter.get('/all', authValidator.isLoggedIn, userController.getFilteredUsers);
module.exports = userRouter;