const FriendService = require('../services/friendService');
const AppError = require('../utils/errors/appError');
const friendService = new FriendService();

const getFriends = async (req, res) => {
    try{
        const userId = req.user.id;
        const response = await friendService.getFriendById(userId);
        res.status(200).json({
            message: "Friends fetched successfully",
            success: true,
            data: response,
            error: {},
        });
    }
    catch(error){
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else{
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

const removeFriend = async (req, res) => {
    try{
        const userId = req.user.id;
        const friendId = req.params.friendId;
        const response = await friendService.removeFriend(userId, friendId);
        res.status(200).json({
            message: "Friend removed successfully",
            success: true,
            data: response,
            error: {},
        });
    }
    catch(error){
        if(error instanceof AppError){
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                error: error.status
            });
        }
        else{
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
    getFriends,
    removeFriend
}

