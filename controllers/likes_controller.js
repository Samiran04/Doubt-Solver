const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');
const Noti = require('../models/notification');

module.exports.likesAction = async function(req, res)
{
    try{
        let likeable, newNoti;

        let deleted = false;
        if(req.user._id != req.query.user){
                newNoti = await Noti.create({
                user: req.user._id,
                actionUser: req.query.user,
                flag: false
            });
        }

        if(req.query.type == 'Post')
        {
            likeable = await Post.findById(req.query.id).populate('likes');

            if(newNoti){
                newNoti.notiType = 'postLike';
                newNoti.save();
            }
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
            if(newNoti){
                newNoti.notiType = 'commentLike';
                newNoti.save();
            }
        }

        console.log(newNoti.notiType);

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
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
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