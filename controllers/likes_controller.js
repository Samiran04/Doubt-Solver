const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');
const Noti = require('../models/notification');

module.exports.likesAction = async function(req, res)
{
    try{
        let likeable, notiType;

        let deleted = false;

        if(req.query.type == 'Post')
        {
            likeable = await Post.findById(req.query.id).populate('likes');
            notiType = 'postLike';
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
            notiType = 'commentLike';
        }

        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;

            await Noti.findOneAndDelete({hostId: existingLike._id});
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

            if(req.user._id != req.query.user){
                let newNoti = await Noti.create({
                    user: req.user._id,
                    actionUser: req.query.user,
                    flag: false,
                    postId: req.query.postId
                });

                newNoti.notiType = notiType;
                newNoti.hostId = newLike._id;
                newNoti.save();

                console.log(newNoti.postId);
            }
        }

        return res.json(200, {
            message: 'Request Successful',
            data: {
                deleted: deleted
            }
        });
    }catch(err){
        console.log(err);
        return;
    }
}