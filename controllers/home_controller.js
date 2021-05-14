const User = require('../models/user');
const Post = require('../models/post');
const Chat = require('../models/chat');

module.exports.home= async function(req, res){

    try{
        
        let posts = await Post.find({}).sort('createdAt').populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        });

        let messages = await Chat.find({email: req.user.email}), count = 0;

        for(let message of messages){
            if(message.flag)
                count++;
        }
    
        let users = await User.find({});

        let friends;

        if(req.user)
        {
            getUser = await User.findById(req.user._id).populate({
                path: 'friends',
                populate: {
                    path: 'receiver'
                }
            });

            friends = getUser.friends;
        }
        
        return res.render('home',{
            title: 'Codeila|Home',
            posts: posts,
            all_users: users,
            friends: friends,
            count: count
        });

    }catch(err)
    {
        console.log('Error',err);
        return;
    }

}