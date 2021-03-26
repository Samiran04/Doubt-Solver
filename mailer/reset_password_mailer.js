const nodemailer = require('../config/nodemailer');


exports.createMail = (access_token) => {
    let htmlString = nodemailer.renderTemplate({access_token: access_token}, '/reset-password/new_password.ejs');

    nodemailer.transporter.sendMail({
        from : 'realcodeial@gmail.com',
        to: access_token.user.email,
        subject: 'Reset Password Request',
        html: htmlString
    }, (err, info) => {
        if(err)
        {console.log('Error in mailer',err); return}

        console.log('Mail Delivered', info);
        return;
    });
}