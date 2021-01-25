const { render } = require('ejs');
const User=require('../model/user');

module.exports.sign_in=function(req,res){
    return res.render('sign_in',{
        title:"Codeial|Sign In"
    });
}

module.exports.sign_up=function(req,res){
    return res.render('sign_up',{
        title:"Codeial|Sign Up"
    });
}

module.exports.create=function(req,res)
{
    console.log(req.body.password);
    console.log(req.body.confirm_password);
    if(req.body.password!=req.body.confirm_password)
        return res.redirect('back');
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error while finding data in DB',err);return}
        if(!user)
        {
            User.create(req.body,function(err,obj){
                if(err){console.log('Error while inserting data in DB',err);return}
            });
            return res.render('../views/sign_in.ejs');
        }
    });
}

module.exports.createSession=function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error while searching data in DB',err);return}
        if(user)
        {
            if(req.body.password==user.password)
            {
                res.cookie('user_id',user.id);
                return res.redirect('profile');
            }
            else
            {
                return res.redirect('back');
            }
        }
        else
        {
            return res.redirect('back');
        }
    });
}

module.exports.profile=function(req,res){
    if(req.cookies.user_id)
    {
        User.findOne({_id:req.cookies.user_id},function(err,user){
            if(err){console.log('Error while searching data in DB',err);return}
            if(user)
            {
                return res.render('user_profile',{
                    user:user
                });
            }
            else
            {
                return res.redirect('/user/sign-in');
            }
        });
    }
    else
    {
        return res.redirect('/user/sign-in');
    }
}