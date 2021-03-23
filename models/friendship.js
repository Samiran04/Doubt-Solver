const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        enum: [1, 2, 3]
    }
}, {timestamps: true});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;