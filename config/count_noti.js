const Noti = require('../models/notification');

module.exports.count = async function(user){
    try{
        const notis = await Noti.find({actionUser: user._id});

        let c = 0;

        for(let noti of notis){
            if(noti.flag == false)
                c++;
        }

        return c;
    }catch(err){
        console.log('*******Error in count noti', err);
        return;
    }
}