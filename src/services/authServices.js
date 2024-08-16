const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const NotFoundError = require('../utils/errors/notFoundError');
const InternalServerError = require('../utils/errors/internalServerError');
const BadRequestError = require('../utils/errors/badRequestError');
const AppError = require('../utils/errors/appError');
const jwt = require('jsonwebtoken');
const serverConfig = require('../configs/serverConfig');
const userEmail = require('../utils/emails/userEmail');



class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signIn(email, password) {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                throw new NotFoundError('User');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new BadRequestError('Invalid Password');
            }
            const token = jwt.sign({ email: user.email, id: user._id, phone: user.phone }, serverConfig.JWT_SECRET, { expiresIn: `${serverConfig.JWT_EXPIRES_IN}d` });
            return {
                token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: user.image
                }
            };


        }
        catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    async updatePassword(email, password) {
        try {
            const updatedUser = await this.userRepository.updatePassword(email, password);
            if (!updatedUser) {
                throw new NotFoundError('User');
            }
            userEmail.changedPasswordEmail({ to: updatedUser.email, name: updatedUser.name });
            return {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                image: updatedUser.image
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new InternalServerError();
            }
        }
    }
}

module.exports = AuthService;