const Noti = require('../models/notification');
const count_noti = require('../config/count_noti');

module.exports.open = async function(req, res){
    try{
        let notis = await Noti.find({actionUser: req.user._id}).populate('user');

        for(let noti of notis){
            noti.flag = true;
            noti.save();
        }

        let notiCount = await count_noti.count(req.user);

        return res.render('notification', {
            notis: notis,
            notiCount: notiCount
        });

    }catch(err){
        console.log('Notification error', err);
        return;
    }
}