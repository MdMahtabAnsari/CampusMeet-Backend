const express = require('express');
const cookieParser = require('cookie-parser');
const dbConfig = require('./configs/dbConfig');
const serverConfig = require('./configs/serverConfig');
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const meetingRouter = require('./routers/meetingRouter');
const otpRouter = require('./routers/otpRouter');
const friendRequestRouter = require('./routers/friendRequestRouter');
const friendRouter = require('./routers/friendRouter');
const activeAllProcess = require('./jobs/activeAllProcess');
const AppError = require('./utils/errors/appError');
const multer = require('multer');
const cors = require('cors');
const corsConfig = require('./configs/corsConfig');


const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/meetings', meetingRouter);
app.use('/otp', otpRouter);
app.use('/friendRequests', friendRequestRouter);
app.use('/friends', friendRouter);

// check if the server is running
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// handle all the errors

app.use((error, req, res, next) => {
    console.log(error);
    if (error instanceof multer.MulterError) {
        res.status(400).json({
            message: error.message,
            success: false,
            data: {},
            error: "error"
        });
    }

    else if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            success: false,
            data: {},
            error: error.status
        });
    }
    else {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            data: {},
            error: "error"
        });
    }
}
);

app.listen(serverConfig.PORT, async () => {
    try {
        console.log(corsConfig);
        await dbConfig.connectToDB();
        console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
        activeAllProcess();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});

