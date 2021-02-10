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