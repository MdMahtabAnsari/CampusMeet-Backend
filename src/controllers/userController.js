const UserService = require('../services/userService');
const AppError = require('../utils/errors/appError');
const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const file = req.file;
        console.log(file);
        const response = await userService.createUser({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            image: file?.path
        });
        res.status(201).json({
            message: "Successfully registered the user",
            success: true,
            data: response,
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

const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const response = await userService.getUserByEmail(email);
        res.status(200).json({
            message: "Successfully retrieved the user",
            success: true,
            data: response,
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

const updateUser = async (req, res) => {
    try {
        const user = req.body;
        const id = req?.user?.id;
        const file = req.file;
        const response = await userService.updateUserbyId(id, {
            name: user.name,
            phone: user.phone,
            email: user.email,
            image: file?.path
        });
        res.status(200).json({
            message: "Successfully updated the user",
            success: true,
            data: response,
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
}

const getUser = async(req,res) => {
    try {
        const id = req?.user?.id;
        console.log("getUser",id);
        const response = await userService.getUserById(id);
        console.log("getUser",response);
        res.status(200).json({
            message: "Successfully retrieved the user",
            success: true,
            data: response,
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
}
const getFilteredUsers = async(req,res) => {
    try {
        const id = req?.user?.id;
        const response = await userService.getFilteredUsers(id);
        res.status(200).json({
            message: "Successfully retrieved the users",
            success: true,
            data: response,
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
}

module.exports = {
    createUser,
    getUserByEmail,
    updateUser,
    getUser,
    getFilteredUsers
};