const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
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
    ]
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;