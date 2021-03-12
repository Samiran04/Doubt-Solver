const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    try{
        
        let posts = await Post.find({}).sort('createdAt').populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        
        return res.json(200, {
            message: 'Users Details',
            posts: posts
        })

    }catch(err)
    {
        console.log('Error',err);
        return res.json(500, {
            message: 'Serever Error'
        });
    }
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){
            post.remove();
            
            Comment.deleteMany({posts: req.params.id});

            return res.json(200, {
                message: 'Posts Deleted'
            });
        }
        else{
            return res.json(401, {
                message: 'User not autherised or post not found'
            });
        }

    }catch(err)
    {
        console.log('--Error while deleting post--',err);
        return res.json(500, {
            message: 'Server Error'
        });
    }

}