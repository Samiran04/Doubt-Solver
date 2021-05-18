const Noti = require('../models/notification');

module.exports.open = async function(req, res){
    try{
        let notis = await Noti.find({actionUser: req.user._id}).populate('user');

        for(let noti of notis){
            noti.flag = true;
            noti.save();
        }

        return res.render('notification', {
            notis: notis
        });

    }catch(err){
        console.log('Notification error', err);
        return;
    }
}