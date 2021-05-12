const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const POST_PATH = path.join('/uploads/posts');

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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', POST_PATH))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})

Schema.statics.uploadPost = multer({ storage: storage }).single('post');
Schema.statics.postPath = POST_PATH;

const Post = mongoose.model('Post', Schema);

module.exports = Post;