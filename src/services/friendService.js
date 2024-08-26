const FriendRepository = require('../repositories/friendRepository');
const UserRepository = require('../repositories/userRepository');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const NotFoundError = require('../utils/errors/notFoundError');
const friendEmail = require('../utils/emails/friendEmail');

class FriendService {
    constructor() {
        this.friendRepository = new FriendRepository();
        this.userRepository = new UserRepository();
    }

    async getFriendById(userId) {
        try {
            const friend = await this.friendRepository.getFriendWithPopulate(userId);
            if (!friend) {
                throw new NotFoundError('Friend');
            }
            
            return friend;
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

    async removeFriend(userId, friendId) {
        try {
            const isFriend = await this.friendRepository.getFriendByFriendId(userId, friendId) && await this.friendRepository.getFriendByFriendId(friendId, userId);
            if (!isFriend) {
                throw new NotFoundError('Friend');
            }
            const friend = await this.friendRepository.removeFriend(userId, friendId);
            await this.friendRepository.removeFriend(friendId, userId);
            const userDetail = await this.userRepository.getUserById(userId);
            const friendDetail = await this.userRepository.getUserById(friendId);
            
            friendEmail.unFriendEmail({
                to: friendDetail.email,
                receiverName: friendDetail.name,
                senderName: userDetail.name,
                senderEmail: userDetail.email,
                senderPhone: userDetail.phone
            });
            return {
                _id: friendDetail._id,
            };
           
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

module.exports = FriendService;