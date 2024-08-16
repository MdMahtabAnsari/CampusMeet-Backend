const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const serverConfig = require('../configs/serverConfig');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'otp already exists']
    },
    otp: {
        type: String,
        required: [true, 'Otp is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

otpSchema.pre('save', async function (next) {
    try {
        if (this.isModified('otp')) {
            this.otp = await bcrypt.hash(this.otp, parseInt(serverConfig.SALT_ROUNDS));
        }
        next();
    } catch (error) {
        next(error);
    }
});






const Otp = mongoose.model('Otp', otpSchema);

Otp.collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: parseInt(serverConfig.OTP_EXPIRES_IN) * 60 });

module.exports = Otp;
