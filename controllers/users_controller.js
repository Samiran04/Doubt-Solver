const User = require('../models/user');
const Friend = require('../models/friendship');
const Password = require('../models/reset_password');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { find } = require('../models/user');
const Chat = require('../models/chat');
const count_noti = require('../config/count_noti');

module.exports.profile = async function (req, res)
{
    let status = 0;

    let user = await User.findById(req.params.id);

    let notiCount = await count_noti.count(req.user);

    if(req.user._id != req.params.id)
    {
        let friend = await Friend.findOne({
            requester: req.user._id,
            receiver: req.params.id
        });

        if(friend)
        {
            status = friend.status;
        }
    }

    if(user){
        return res.render('user_profile',{
            title:'User Profile',
            curr_user: user,
            profile_user: req.user,
            status: status,
            notiCount: notiCount
        });
    }
    else
    {
        return res.render('home', {
            notiCount: notiCount
        });
    }

}

module.exports.signUp = async function(req,res)
{
    if(req.user)
    {
        return res.redirect('/');
    }

    return res.render('user_sign_up');
}

module.exports.signIn = async function(req,res){
    if(req.user)
    {
        return res.redirect('/');
    }

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

                Password.create({
                    user: user._id,
                    access_token: crypto.randomBytes(20).toString('hex'),
                    is_valid: false
                }, function(err, user){
                    if(err){console.log(err); return}

                    return res.redirect('/users/sign-in');
                });

            });
        }
        else{
            return res.redirect('back');
        }
    });
}

module.exports.createSession = function(req, res){
    req.flash('success', 'You have successfully loged in');
    return res.redirect('/');
}

module.exports.distroySession = function(req,res){
    req.logout();
    req.flash('success', 'You are loged out');
    return res.redirect('/');
}

module.exports.update = async function(req, res)
{

    if(req.user.id == req.params.id)
    {
        try{
            let user = await User.findById(req.params.id);
            User.uploadAvatar(req, res, function(err){
                if(err){console.log('****Multer error'); return}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file)
                {
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                console.log(user.avatar);

                user.save();

                return res.redirect('back');
            })

        }catch{
            console.log('Error while updating profile');
            return;
        }
    }else{
        return res.status(401).send('Unauthorised');
    }
}

module.exports.search = async function(req, res){
    try{
        let users = await User.find({name: req.body.name});

        let notiCount = await count_noti.count(req.user);

        return res.render('user_search', {
            users: users,
            notiCount: notiCount
        });
    }catch(err){
        console.log('**********Error in user search', err);
        return;
    }
}

module.exports.chatRoom = async function(req, res){
    try{
        /*let user = await User.findById(req.user._id).populate({
            path: 'friends',
            populate: {
                path: 'receiver'
            }
        });*/

        let user = await Chat.find({email: req.user.email}).populate('receiver');

        let notiCount = await count_noti.count(req.user);

        return res.render('_chat_room',{
            friends: user,
            notiCount: notiCount
        });
    }catch(err){
        console.log('*********Error in chat room', err);
        return;
    }
}

module.exports.chat = async function(req, res){
    try{
        let user = await Chat.find({email: req.user.email}).populate('receiver');

        let curr_user = await User.findById(req.query.curr_user);

        let roomName = curr_user.email + req.user.email;

        let notiCount = await count_noti.count(req.user);

        if(curr_user.email > req.user.email)
            roomName = req.user.email + curr_user.email;

        let currMessage = await Chat.findOneAndUpdate({roomName: roomName, email: req.user.email}, {
            $set: {flag: false}
        });

        return res.render('_chat_room',{
            friends: user,
            curr_user: curr_user,
            currMessage: currMessage,
            notiCount: notiCount
        });
    }catch(err){
        console.log('*********Error in chat', err);
        return;
    }
}