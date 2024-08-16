const UserRepository = require('../repositories/userRepository');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const fs = require('fs');
const userEmail = require('../utils/emails/userEmail');
const queueConfig = require('../configs/queueConfig');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(user) {

        try {
            const image = user.image;
            delete user.image;
            const newUser = await this.userRepository.createUser(user);
            userEmail.welcomeEmail({ to: newUser.email, name: newUser.name });
            if (image) {
                queueConfig.imageQueue.add({ image: image, id: newUser._id });
            }
            return {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                image: newUser.image
            }

        }
        catch (error) {

            if (fs.existsSync(user.image)) {
                fs.unlinkSync(user.image);
            }

            if (error instanceof AppError) {
                throw error;
            }
            else {
                console.log(error);
                throw new InternalServerError();
            }
        }
    }


    async getUserByEmail(email) {
        try {
            return await this.userRepository.getUserByEmail(email);
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

    async getUserById(id) {
        try {
            return await this.userRepository.getUserById(id);
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


module.exports = UserService;