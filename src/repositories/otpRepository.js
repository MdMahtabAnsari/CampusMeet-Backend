const Otp = require('../models/otpModel');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');

class OtpRepository {

    async createOtp(otp) {
        try {
            return await Otp.create(otp);
        } catch (error) {
            console.error('Error creating otp:', error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((error) => error.message);
                throw new BadRequestError(errors);
            }
            else if (error.name === 'MongoServerError') {
                throw new ConflictError('Email');
            }
            else {
                throw new InternalServerError();
            }

        }
    }

    async getOtpByEmail(email) {
        try {
            return await Otp.findOne({ email });
        } catch (error) {
            console.error('Error getting otp:', error);
            throw new InternalServerError();
        }
    }

    async deleteOtpByEmail(email) {
        try {
            return await Otp.deleteOne({ email });
        } catch (error) {
            console.error('Error deleting otp:', error);
            throw new InternalServerError();
        }
    }
}


module.exports = OtpRepository;