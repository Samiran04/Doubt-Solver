const Friend = require('../models/friendship');
const User = require('../models/user');

module.exports.sendRequest = async function(req, res)
{
    try{
        let actionA = await Friend.create({
            requester: req.user._id,
            receiver: req.query.id,
            status: 1,
            friends: false
        });
    
        let actionB = await Friend.create({
            requester: req.query.id,
            receiver: req.user._id,
            status: 2,
            friends: false
        });
    
        let userA = await User.findByIdAndUpdate(req.user._id, {
            $push: {friends: actionA._id}
        });
    
        let userB = await User.findByIdAndUpdate(req.query.id, {
            $push: {friends: actionB._id}
        });
    
        return res.json(200, {
            message: 'Friend Request Sended'
        });
    }catch(err)
    {
        console.log(err);
        return
    }
}

module.exports.friendsAction = async function(req, res)
{

    try{
        if(req.query.status == 1 || req.query.status == 3)
        {
            let actionA = await Friend.findOneAndRemove({
                requester: req.user._id,
                receiver: req.query.id,
            });

            let actionB = await Friend.findOneAndRemove({
                requester: req.query.id,
                receiver: req.user._id,
            });

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {friends: actionA._id}
            });

            await User.findOneAndUpdate({_id: req.query.id},{
                $pull: {friends: actionB._id}
            });

            return res.json(200, {
                message: 'Request cancled or Unfriend'
            });
        }
        else if(req.query.status == 2)
        {
            await Friend.findOneAndUpdate({
                requester: req.user._id,
                receiver: req.query.id
            }, {
                $set: {status: 3, friends: true}
            });

            await Friend.findOneAndUpdate({
                requester: req.query.id,
                receiver: req.user._id
            }, {
                $set: {status: 3, friends: true}
            });

            return res.json(200, {
                message: 'Friend Request Accepted'
            });
        }
    }catch(err)
    {
        console.log(err);
        return;
    }
}