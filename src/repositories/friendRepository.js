const Friend = require('../models/friendModel');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');

class FriendRepository {

    async getFriendById(userId) {
        try {
            return await Friend.findOne({ user: userId });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async createFriend(userId) {
        try {
            return await Friend.create({ user: userId });
        }
        catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else if (error.name === 'MongoServerError') {
                throw new ConflictError('user');
            }
            else {
                throw new InternalServerError();
            }

        }
    }


    async addFriend(userId, friendId) {
        try {
            const friend = await Friend.findOne({ user: userId });
            if (!friend) {
                return await Friend.create({ user: userId, friends: [friendId] });
            }

            friend.friends.push(friendId);
            return await friend.save();
        }
        catch (error) {


            console.log(error);
            throw new InternalServerError();

        }
    }

    async removeFriend(userId, friendId) {
        try {
            const friend = await Friend.findOne({ user: userId });
            if (!friend) {
                return await Friend.create({ user: userId});
            }
            friend.friends = friend.friends.filter((friend) => friend.toString() !== friendId);
            return await friend.save();
        }
        catch (error) {


            console.log(error);
            throw new InternalServerError();


        }

    }
    async getFriendWithPopulate(userId) {
        try {
            return await Friend.findOne({ user: userId }).populate('friends', 'name email phone image');
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async getFriendByFriendId(userId, friendId) {
        try {
            // friends is an array of friend ids
            const friend = await Friend.findOne({ user: userId, friends: { $in: [friendId] } });
            return friend;
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllFriends(userId) {
        try {
            return await Friend.findOne({ user: userId });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

}

module.exports = FriendRepository;