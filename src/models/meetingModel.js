const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    type: {
        type: String,
        enum: ['1V1', 'Group'],
        required: [true, 'Type is required']
    },
    date: {
        type: String,
        required: [true, 'Date is required'],

    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],

    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],

    },
    status: {
        type: String,
        enum: ['upcoming', 'in-progress', 'completed', 'cancelled'],
        default: 'upcoming',
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required']
    },
    link: {
        type: String,
        required: [true, 'Link is required']
    }


}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
