const Password = require('../models/reset_password');
const User = require('../models/user');
const queue = require('../config/kue');
const passwordMailer = require('../mailer/reset_password_mailer');
const passwordEmailWorker = require('../workers/reset-password-email-workers');

module.exports.getPage = function(req, res){
    return res.render('passwordPage');
}
module.exports.checkMail = async function(req, res){
    
    try{
        let user = await User.findOne({email: req.body.email});

        if(user)
        {
            let access_token = await Password.findOneAndUpdate({user: user._id}, {
                $set: {is_valid: true}
            });

            access_token = await access_token.populate('user', 'name email').execPopulate();

            let job = await queue.create('password-emails', access_token).save(function(err){
                if(err){console.log('Error in pushing job in queue', err); return;}

                console.log(job.id);
            });

            return res.render('mail_confirm');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        return;
    }
}

module.exports.checkAccess = async function(req, res){
    try{
        let access_token = await Password.findOne({access_token: req.params.access_token});

        if(access_token && access_token.is_valid){
            return res.render('changePassword',{
                access_token: access_token
            });
        }else{
            return res.json(500, {
                message: 'Access Token is invalid or it has expired'
            });
        }

    }catch(err){
        console.log(err);
        return;
    }
}

module.exports.changePassword = async function(req, res){
    if(req.body.password != req.body.confirmPassword)
    {
        return res.redirect('back');
    }else{
        let getToken = await Password.findOne({access_token: req.params.access_token});

        if(getToken){
            let user = await User.findByIdAndUpdate(getToken.user, {
                $set: {password: req.body.password}
            });

            getToken.is_valid = false;
            getToken.save();

            return res.redirect('/users/sign-in');
        }else{
            return res.json(500, {
                message: 'Invaid User'
            })
        }
    }
}