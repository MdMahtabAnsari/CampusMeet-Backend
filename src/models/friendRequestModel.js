const { use } = require('bcrypt/promises');
const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'Sender is required']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'Receiver is required']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected',"cancelled"],
        default: 'pending'
    }
}, { timestamps: true });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;