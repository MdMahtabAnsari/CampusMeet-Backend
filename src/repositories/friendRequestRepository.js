const FriendRequest = require('../models/friendRequestModel');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');

class FriendRequestRepository {
    

    async createFriendRequest(sender, receiver) {
        try {
            return await FriendRequest.create({ sender: sender, receiver: receiver });
        }
        catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else {
                throw new InternalServerError();
            }
        }
    }
    async getFriendRequestBySenderAndReceiverAndStatus(sender, receiver, status) {
        try {
            return await FriendRequest.findOne({ sender: sender, receiver: receiver, status: status });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async updateFriendRequestStatus(sender, receiver, status) {
        try {
            return await FriendRequest.findOneAndUpdate({ sender: sender, receiver: receiver,status:'pending' }, { status: status }, { new: true });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllFriendRequestByReceiverWithPopulate(receiverId) {
        try {
            return await FriendRequest.find({ receiver: receiverId, status: 'pending' }).populate('sender', 'name email phone image');
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllFriendRequestByReceiver(receiverId) {
        try {
            return await FriendRequest.find({ receiver: receiverId, status: 'pending' });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllFriendRequestBySenderWithPopulate(senderId) {
        try {
            return await FriendRequest.find({ sender: senderId, status: 'pending' }).populate('receiver', 'name email phone image');
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllFriendRequestBySender(senderId) {
        try {
            return await FriendRequest.find({ sender: senderId, status: 'pending' });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async cancelFriendRequest(sender, receiver) {
        try {
            return await FriendRequest.findOneAndUpdate({ sender: sender, receiver: receiver, status: 'pending' }, { status: 'cancelled' }, { new: true });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    

    
}

module.exports = FriendRequestRepository;