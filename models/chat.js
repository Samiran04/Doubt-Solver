const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    message: [
        {
            type: Object,
            obj: {
                msg: String,
                messageType: String
            }
        }
    ],
    flag: {
        type: Boolean
    },
    last: {
        type: Date
    }
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;