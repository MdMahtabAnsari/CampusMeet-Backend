const User = require('../models/userModel');
const BadRequestError = require('../utils/errors/badRequestError');
const InternalServerError = require('../utils/errors/internalServerError');
const ConflictError = require('../utils/errors/conflictError');

class UserRepository {
    async createUser(user) {
        try {
            return await User.create(user);
        }
        catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else if (error.name === 'MongoServerError') {
                throw new ConflictError('Email or Phone number');
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({ email: email });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async getUserById(id) {
        try {
            return await User.findById(id);
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }
    async getAllUsers() {
        try {
            return await User.find();
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async updatePassword(email, password) {
        try {
            return await User.findOneAndUpdate({ email: email }, { password: password }, { new: true });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }
    }

    async updateImageById(id, image) {
        try {
            return await User.findByIdAndUpdate(id, { image: image }, { new: true });
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError();
        }

    }

}

module.exports = UserRepository;