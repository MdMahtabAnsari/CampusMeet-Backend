const UserRepository = require('../repositories/userRepository');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(user) {
        try {
            return await this.userRepository.createUser(user);
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