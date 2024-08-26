const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: [true, 'User is already exists']
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
}, { timestamps: true });


const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
