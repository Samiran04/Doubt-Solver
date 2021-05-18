const Comment = require('../models/comment');
const Post = require('../models/post');
const Noti = require('../models/notification');
const queue = require('../config/kue');
const commentsMailer = require('../mailer/comments_mailer');
const commentEmailWorker = require('../workers/comment-email-workers');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user.id
            });

            if(req.user._id != req.query.user){
                let newNoti = await Noti.create({
                    user: req.user._id,
                    actionUser: req.query.user,
                    flag: false,
                    postId: post._id
                });

                newNoti.notiType = 'comment';
                newNoti.content = req.body.content;
                newNoti.hostId = comment._id;
                newNoti.save();
            }
    
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();

            let job = await queue.create('emails', comment).save(function(err){
                if(err){console.log('Error in pushing job in queue', err); return;}

                console.log(job.id);
            })

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Comment created'
                });
            }
        }
    
        return res.redirect('back');

    }
    catch(err){
        console.log('Error',err);
    }
}

module.exports.destroy = async function(req, res){

    try{

        let comment = await Comment.findById(req.params.id);

        if(comment && comment.user == req.user.id)
        {
            let postId = comment.post;
            
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, {$pull :{comments: req.params.id}});

            await Noti.findOneAndDelete({hostId: comment._id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        commentId: req.params.id
                    },
                    message: 'Comment deleted'
                });
            }
        }

        return res.redirect('back');
    }
    catch(err)
    {
        console.log('Error while deleting comments',err);
        return;
    }
}