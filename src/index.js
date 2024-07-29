const express = require('express');
const cookieParser = require('cookie-parser');
const dbConfig = require('./configs/dbConfig');
const serverConfig = require('./configs/serverConfig');
const userRouter = require('./routers/userRouter');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users', userRouter);


app.listen(serverConfig.PORT, async () => {
    await dbConfig.connectToDB();
    console.log(`Server running on port ${serverConfig.PORT}`);
});

