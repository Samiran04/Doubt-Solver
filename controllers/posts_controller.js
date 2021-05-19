const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Chat = require('../models/chat');
const fs = require('fs');
const path = require('path');
const count_noti = require('../config/count_noti');

module.exports.create = async function(req, res){

    try{
        let post = await Post.create({
            content: 'DEFAULT',
            user: req.user._id
        });
        Post.uploadPost(req, res, function(err){

            if(err){console.log('****Multer error', err); return}

            let content

            if(req.file)
            {
                content = Post.postPath + '/' + req.file.filename;
            }

            post.content = content;

            post.save();

            req.flash('success', 'Post Created');

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post Created"
                });
            }
            return res.redirect('back');
        })

    }catch{
        console.log('Error while updating profile');
        return;
    }
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){

            if(post.content)
            {
                fs.unlinkSync(path.join(__dirname, '..', post.content));
            }

            post.remove();
            Comment.deleteMany({posts: req.params.id});
            req.flash('success', 'Post Deleted');
            if(req.xhr)
            {
                return res.status(200).json({
                    data: {
                        postId: req.params.id
                    },
                    message: 'Post Deleted'
                });
            }
        }

        return res.redirect('back');
    }catch(err)
    {
        req.flash('error', 'Post');
        console.log('--Error while deleting post--',err);
        return;
    }

}

module.exports.postPage = async function(req, res){
    try{
        let post = await Post.findById(req.query.Id).sort('createdAt').populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('user');

        let notiCount = await count_noti.count(req.user);

        return res.render('_post_page', {
            post: post,
            notiCount: notiCount
        })

    }catch(err){
        console.log('**/***Error in post page', err);
        return;
    }
}