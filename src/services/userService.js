const UserRepository = require("../repositories/userRepository");
const FriendRepository = require("../repositories/friendRepository");
const FriendRequestRepository = require("../repositories/friendRequestRepository");
const AppError = require("../utils/errors/appError");
const InternalServerError = require("../utils/errors/internalServerError");
const NotFoundError = require("../utils/errors/notFoundError");
const fs = require("fs");
const userEmail = require("../utils/emails/userEmail");
const queueConfig = require("../configs/queueConfig");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.friendRepository = new FriendRepository();
    this.friendRequestRepository = new FriendRequestRepository();
  }

  async createUser(user) {
    try {
      const newUser = await this.userRepository.createUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
      });
      await this.friendRepository.createFriend(newUser._id);
      userEmail.welcomeEmail({ to: newUser.email, name: newUser.name });
      if (user.image) {
        queueConfig.imageQueue.add({ image: user.image, id: newUser._id });
      }
      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        image: newUser.image,
      };
    } catch (error) {
      if (fs.existsSync(user.image)) {
        fs.unlinkSync(user.image);
      }

      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new NotFoundError("User");
      }
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }
  async updateUserbyId(id, user) {
    try {
      const updatedUser = await this.userRepository.updateUserById(id, {
        name: user.name,
        phone: user.phone,
        email: user.email,
      });
      if (!updatedUser) {
        throw new NotFoundError("User");
      }
      if (user.image) {
        queueConfig.imageQueue.add(
          { image: user.image, id: updatedUser._id },
          {
            removeOnComplete: true,
          }
        );
      }
      userEmail.updateEmail({
        to: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
      });
      return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
      };
    } catch (error) {
      if (fs.existsSync(user.image)) {
        fs.unlinkSync(user.image);
      }
      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }

  async getFilteredUsers(id) {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new NotFoundError("User");
      }
      const users = await this.userRepository.getAllUsers();
      if (users.length === 0) {
        return [];
      }
      const friends = await this.friendRepository.getAllFriends(id);
      const friendRequests =
        await this.friendRequestRepository.getAllFriendRequestByReceiver(id);
      const friendRequestsSent =
        await this.friendRequestRepository.getAllFriendRequestBySender(id);
      const friendIds = friends.friends.map((friend) => friend.toString());
      const friendRequestIds = friendRequests.map((friendRequest) =>
        friendRequest.sender.toString()
      );
      const friendRequestSentIds = friendRequestsSent.map((friendRequest) =>
        friendRequest.receiver.toString()
      );
      const filteredUsers = users.filter(
        (user) =>
          user._id.toString() !== id &&
          !friendIds.includes(user._id.toString()) &&
          !friendRequestIds.includes(user._id.toString()) &&
          !friendRequestSentIds.includes(user._id.toString())
      );
      return filteredUsers.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        };
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerError();
      }
    }
  }
}

module.exports = UserService;
