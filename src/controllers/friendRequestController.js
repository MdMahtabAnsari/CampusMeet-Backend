const FriendRequestService = require('../services/friendRequestService');
const AppError = require('../utils/errors/appError');
const friendRequestService = new FriendRequestService();

const sendFriendRequest = async (req, res) => {

    try {
        const senderId = req.user.id;
        const receiverId = req.params.receiverId;
        console.log("receiverId",receiverId);
        const response = await friendRequestService.sendFriendRequest(senderId, receiverId);
        res.status(200).json({
            message: "Friend request sent successfully",
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

const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.senderId;
        const response = await friendRequestService.acceptFriendRequest(senderId, receiverId);
        res.status(200).json({
            message: "Friend request accepted successfully",
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

const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const senderId = req.params.senderId;
        const response = await friendRequestService.rejectFriendRequest(senderId, receiverId);
        res.status(200).json({
            message: "Friend request rejected successfully",
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

async function getAllFriendRequestByReceiver(req, res) {
    try {
        const receiverId = req?.user?.id;
        const response = await friendRequestService.getAllFriendRequestByReceiver(receiverId);
        res.status(200).json({
            message: "Friend requests fetched successfully",
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

async function getAllFriendRequestBySender(req, res) {
    try {
        const senderId = req?.user?.id;
        const response = await friendRequestService.getAllFriendReqestBySender(senderId);
        res.status(200).json({
            message: "Friend requests fetched successfully",
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

async function cancelFriendRequest(req, res) {
    try {
        const senderId = req?.user?.id;
        const receiverId = req.params.receiverId;
        const response = await friendRequestService.cancelFriendRequest(senderId, receiverId);
        res.status(200).json({
            message: "Friend request cancelled successfully",
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
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getAllFriendRequestByReceiver,
    getAllFriendRequestBySender,
    cancelFriendRequest
};

