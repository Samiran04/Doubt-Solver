const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '791946035005-68kp6o2749pgakci2aqbljr7huf3am9m.apps.googleusercontent.com',
    clientSecret: 'qsLoAVKIf_ghRjPiUvlGJZsu',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
}, function(accessToken, refreshToken, profile, done){
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err)
        {
            console.log('Error while finding email in google oauth', err);
            return;
        }
        if(user)
        {
            return done(null, user);
        }
        else
        {
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err)
                {
                    console.log('Error while creating ID with google oauth', err);
                    return;
                }

                return done(null, user);
            })
        }
    });
}))

module.exports = passport;