const UserRepository = require('../repositories/userRepository');
const FriendRequestRepository = require('../repositories/friendRequestRepository');
const FriendRepository = require('../repositories/friendRepository');
const NotFoundError = require('../utils/errors/notFoundError');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');
const friendEmail = require('../utils/emails/friendEmail');

class FriendRequestService {
    constructor() {
        this.userRepository = new UserRepository();
        this.friendRequestRepository = new FriendRequestRepository();
        this.friendRepository = new FriendRepository();
    }

    async sendFriendRequest(senderId, receiverId) {
        try {
            const sender = await this.userRepository.getUserById(senderId);
            if (!sender) {
                throw new NotFoundError('Sender');
            }
            const receiver = await this.userRepository.getUserById(receiverId);
            if (!receiver) {
                throw new NotFoundError('Receiver');
            }
            if (senderId === receiverId) {
                throw new BadRequestError('You cannot send a friend request to yourself');
            }
            const isAlreadyFriend = await this.friendRepository.getFriendByFriendId(senderId, receiverId);
            if (isAlreadyFriend) {
                throw new ConflictError('You are already friends');
            }
            const isAlreadyFriendRequest = await this.friendRequestRepository.getFriendRequestBySenderAndReceiverAndStatus(senderId, receiverId, 'pending');
            if (isAlreadyFriendRequest) {
                throw new ConflictError('Friend request already sent');
            }
            const isAlreadyReciverFriendRequest = await this.friendRequestRepository.getFriendRequestBySenderAndReceiverAndStatus(receiverId, senderId, 'pending');
            if (isAlreadyReciverFriendRequest) {
                throw new ConflictError('Friend request already sent by receiver');
            }
            const friendRequest = await this.friendRequestRepository.createFriendRequest(senderId, receiverId);
            friendEmail.friendRequestEmail({
                to: receiver.email,
                receiverName: receiver.name,
                senderName: sender.name,
                senderEmail: sender.email,
                senderPhone: sender.phone
            });
            return friendRequest;

        }
        catch (error) {

            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }

    }
    async acceptFriendRequest(senderId, receiverId) {
        try {
            const sender = await this.userRepository.getUserById(senderId);
            if (!sender) {
                throw new NotFoundError('Sender');
            }
            const receiver = await this.userRepository.getUserById(receiverId);
            if (!receiver) {
                throw new NotFoundError('Receiver');
            }
            const friendRequest = await this.friendRequestRepository.getFriendRequestBySenderAndReceiverAndStatus(senderId, receiverId, 'pending');
            if (!friendRequest) {
                throw new NotFoundError('Friend request');
            }
            const isAlreadyFriend = await this.friendRepository.getFriendByFriendId(senderId, receiverId);
            if (isAlreadyFriend) {
                await this.friendRequestRepository.updateFriendRequestStatus(senderId, receiverId, 'Rejected');
                throw new ConflictError('You are already friends');
            }
            const acceptRequest = await this.friendRequestRepository.updateFriendRequestStatus(senderId, receiverId, 'accepted');
            await this.friendRepository.addFriend(senderId, receiverId);
            await this.friendRepository.addFriend(receiverId, senderId);
            friendEmail.friendAcceptEmail({
                to: sender.email,
                receiverName: sender.name,
                senderName: receiver.name,
                senderEmail: receiver.email,
                senderPhone: receiver.phone
            });
            return acceptRequest;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }

    async rejectFriendRequest(senderId, receiverId) {
        try {
            const sender = await this.userRepository.getUserById(senderId);
            if (!sender) {
                throw new NotFoundError('Sender');
            }
            const receiver = await this.userRepository.getUserById(receiverId);
            if (!receiver) {
                throw new NotFoundError('Receiver');
            }
            const friendRequest = await this.friendRequestRepository.getFriendRequestBySenderAndReceiverAndStatus(senderId, receiverId, 'pending');
            if (!friendRequest) {
                throw new NotFoundError('Friend request');
            }
            const rejectRequest = await this.friendRequestRepository.updateFriendRequestStatus(senderId, receiverId, 'rejected');
            friendEmail.friendRejectEmail({
                to: sender.email,
                receiverName: sender.name,
                senderName: receiver.name,
                senderEmail: receiver.email,
                senderPhone: receiver.phone
            });
            return rejectRequest;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }

    async getAllFriendRequestByReceiver(receiverId) {
        try {
            const friendRequests = await this.friendRequestRepository.getAllFriendRequestByReceiverWithPopulate(receiverId);
            return friendRequests;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }
    async getAllFriendReqestBySender(senderId) {
        try {
            const friendRequests = await this.friendRequestRepository.getAllFriendRequestBySenderWithPopulate(senderId);
            return friendRequests;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }
    async cancelFriendRequest(senderId, receiverId) {
        try {
            const sender = await this.userRepository.getUserById(senderId);
            if (!sender) {
                throw new NotFoundError('Sender');
            }
            const receiver = await this.userRepository.getUserById(receiverId);
            if (!receiver) {
                throw new NotFoundError('Receiver');
            }
            const friendRequest = await this.friendRequestRepository.getFriendRequestBySenderAndReceiverAndStatus(senderId, receiverId, 'pending');
            if (!friendRequest) {
                throw new NotFoundError('Friend request');
            }
            const cancelRequest = await this.friendRequestRepository.cancelFriendRequest(senderId, receiverId);
            return cancelRequest;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }
}

module.exports = FriendRequestService;