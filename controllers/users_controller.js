const User = require('../models/user');
const passport = require('passport');

module.exports.profile = function (req,res)
{
    return res.render('user_profile');
}

module.exports.signUp = function(req,res)
{
    return res.render('user_sign_up');
}

module.exports.signIn = function(req,res){
    return res.render('user_sign_in');
}

module.exports.create = function (req,res)
{

    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('/users/sign-up');
    }
    
    User.findOne({email:req.email},function(err,user){
        if(err)
        {
            console.log('Error while inserting data',err);
            return;
        }

        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err)
                {
                    console.log('Error while inserting data',err);
                    return;
                }
                console.log(user);
            });
            return res.redirect('/users/sign-in');
        }
        else{
            return res.redirect('back');
        }
    });
}

module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.distroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}