const OtpRepository = require('../repositories/otpRepository');
const UserRepository = require('../repositories/userRepository');
const AppError = require('../utils/errors/appError');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');
const randomstring = require('randomstring');
const serverConfig = require('../configs/serverConfig');
const bcrypt = require('bcrypt');
const otpEmail = require('../utils/emails/otpEmail');
const jwt = require('jsonwebtoken');

class OtpService {

    constructor() {
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
    }

    async createOtp(email) {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                throw new BadRequestError('USER_NOT_FOUND');
            }
            const otp = {
                email: email,
                otp: randomstring.generate({
                    length: parseInt(serverConfig.OTP_LENGTH),
                    charset: serverConfig.OTP_TYPE
                }),

            };

            const generatedOtp = await this.otpRepository.createOtp(otp);
            otpEmail({ to: email, otp: otp.otp });
            return {
                email: generatedOtp.email,
            };
        } catch (error) {

            if (error instanceof AppError) {
                throw error;
            } else {
                throw new InternalServerError();
            }
        }
    }
    async verifyOtp(email, otp) {
        try {
            const otpData = await this.otpRepository.getOtpByEmail(email);
            if (!otpData) {
                throw new BadRequestError('OTP_NOT_FOUND');
            }
            const isMatch = await bcrypt.compare(otp, otpData.otp);
            if (!isMatch) {
                throw new BadRequestError('OTP_MISMATCH');
            }
            const token = jwt.sign({ email: otpData.email }, serverConfig.JWT_SECRET, { expiresIn: `${serverConfig.OTP_EXPIRES_IN}m` });
            return {
                token: token
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new InternalServerError();
            }
        }
    }


}

module.exports = OtpService;