const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalPassport({
    usernameField:'email'
},function(email,password,done){
    User.findOne({email:email},function(err,user){
        if(err)
        {
            console.log('Error while autehntication',err);
            return done(err);
        }
        if(!user||user.password!=password)
        {
            return done(null,false);
        }
        return done(null,user);
    });
}));

passport.serializeUser(function(user,done){
    return done(null,user);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,id){
        if(err)
        {
            console.log('Error while autehntication',err);
            return done(err);
        }
        return done(null,id);
    });
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.checkAuthtenticatedUser = function(req,res,next){
    if(req.isAuthenticated())
    {
        res.locals.user=req.user;
    }
    return next();
}

module.exports = passport;