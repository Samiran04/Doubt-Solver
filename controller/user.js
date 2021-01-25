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