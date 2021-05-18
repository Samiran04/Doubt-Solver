const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    actionUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notiType: {
        type: String,
        enum: ['comment', 'commentLike', 'postLike', 'message']
    },
    flag: {
        type: Boolean,
        required: true
    },
    content: {
        type: String
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {timestamps: true});

const Noti = mongoose.model('Noti', notiSchema);

module.exports = Noti;