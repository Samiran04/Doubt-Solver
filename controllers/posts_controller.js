const Post = require('../models/post');

module.exports.create = function(req, res){

    Post.create({
        content: req.body.content,
        user: req.user.id
    }, function(err, post){
        if(err)
        {
            console.log('Error while creating Post',err);
            return;
        }
        
        return res.redirect('back');
    });
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){
            post.remove();
        }

        return res.redirect('back');
    }catch(err)
    {
        console.log('Error while deleting post',err);
        return;
    }

}