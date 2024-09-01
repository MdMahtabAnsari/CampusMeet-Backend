const AuthService = require('../services/authServices');
const AppError = require('../utils/errors/appError');
const serverConfig = require('../configs/serverConfig');

const authService = new AuthService();

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.signIn(email, password);
        res.cookie('authToken', response.token, {
            httpOnly: serverConfig.HTTP_ONLY_COOKIE === 'true',
            secure: serverConfig.COOKIE_SECURE === 'true',
            expires: new Date(Date.now() + parseInt(serverConfig.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000), //days to milliseconds,
            sameSite: serverConfig.SAME_SITE_COOKIE

        }).status(200).json({
            message: "Successfully logged in",
            success: true,
            data: response.user,
            error: {},
        });

    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
                success: false,
                data: {},
                error: "error"
            });
        }
    }
};

const signOut = async (req, res) => {
    try {
        res.clearCookie('authToken').status(200).json({
            message: "Successfully logged out",
            success: true,
            data: {},
            error: {},
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            data: {},
            error: "error"
        });
    }

};

const updatePassword = async (req, res) => {
    try {
        const email = req?.user?.email;
        const password = req.body.password
        const response = await authService.updatePassword(email, password);
        res.clearCookie('otpToken').status(200).json({
            message: "Password updated successfully",
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
};

module.exports = {
    signIn,
    updatePassword,
    signOut
};
