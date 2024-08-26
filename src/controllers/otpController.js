const OtpService = require('../services/otpService');
const AppError = require('../utils/errors/appError');
const serverConfig = require('../configs/serverConfig');
const otpService = new OtpService();

const createOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const response = await otpService.createOtp(email);
        res.status(200).json({
            message: "OTP sent successfully to the email",
            success: true,
            data: response,
            error: {},
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        } else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

const verifyOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const response = await otpService.verifyOtp(email, otp);
        res.cookie('otpToken', response.token, {
            httpOnly: serverConfig.HTTP_ONLY_COOKIE === 'true',
            secure: serverConfig.COOKIE_SECURE === 'true',
            expires: new Date(Date.now() + parseInt(serverConfig.OTP_EXPIRES_IN) * 60 * 1000) //minutes to milliseconds,
        }).status(200).json({
            message: "OTP verified successfully",
            success: true,
            data: {
                email: response.email
            },
            error: {},
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        } else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
}

module.exports = {
    createOtp,
    verifyOtp
}