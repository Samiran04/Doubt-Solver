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
    }
}, {timestamps: true});

const Noti = mongoose.model('Noti', notiSchema);

module.exports = Noti;