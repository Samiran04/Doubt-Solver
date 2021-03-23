const User = require('../models/user');
const Post = require('../models/post');

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
            friends: friends
        });

    }catch(err)
    {
        console.log('Error',err);
        return;
    }

}