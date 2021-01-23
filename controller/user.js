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