const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../model/user');

passport.use(new LocalStrategy({
    usernameField:'email',
    },function(email,password,done){
        User.findOne({email:email},function(err,user){
            if(err)
            {
                console.log('Error while finding data for authentication');
                return done(err);
            }
            if(!user||user.password!=password)
            {
                console.log('Invalid Password');
                return done(null,false);
            }
            return done(null,user);
        });
    }
));

passport.serializeUser(function(user,done){
    return done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error while finding data for authentication');
            return done(err);
        }
        return done(null,user);
    });
});