const mongoose = require('mongoose');
const serverConfig = require('../configs/serverConfig');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]{2,30}$/.test(v);
            },
            message: props => `${props.value} is not a valid name`
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email address`
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function (v) {
                // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password`
        },
    },
    image: {
        type: String,
        default: serverConfig.DEFAULT_AVATAR
    }


}, { timestamps: true });


userSchema.pre('save', async function (next) {
    try{
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, parseInt(serverConfig.BCRYPT_SALT));
        next();
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;