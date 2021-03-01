const Post = require('../models/post');

module.exports.create = function(req, res){

    Post.create({
        content: req.body.content,
        user: req.user.id
    }, function(err, post){
        if(err)
        {
            console.log('Error while creating Post',err);
            req.flash('error', err);
            return;
        }
        
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
    });
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){
            post.remove();
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
        console.log('Error while deleting post',err);
        return;
    }

}