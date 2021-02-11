const User = require('../models/user');
const Post = require('../models/post');

module.exports.home=function(req,res){
    
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home',
        {
            title: 'Codial|Home',
            posts: posts
        });
    });

}