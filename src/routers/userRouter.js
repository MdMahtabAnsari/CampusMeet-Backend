const express = require('express');
const userController = require('../controllers/userController');
// const imageUploaderMiddleware = require('../middlewares/imageUploaderMiddleware');
const upload = require('../configs/multerConfig');
const userRouter = express.Router();

userRouter.post('/signup', upload.single('image'), userController.createUser);

module.exports = userRouter;