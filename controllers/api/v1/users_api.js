const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: 'Invalid User'
            });
        }

        else{
            return res.json(200, {
                message: 'You are loged in and take care of your token now',
                data: {
                    token: jwt.sign(user.toJSON(), 'Codeial', {expiresIn: '1000000'})
                }
            })
        }
    }catch{
        console.log('******JWT Error');
        return res.json(500, {
            message: 'Error in JWT'
        });
    }
}