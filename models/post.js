const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
},{
    timestamps: true
});

const Post = mongoose.model('Post', Schema);

module.exports = Post;