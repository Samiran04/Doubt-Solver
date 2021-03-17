const nodemailer = require('../config/nodemailer');


exports.createMail = (comment) => {
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from : 'realcodeial@gmail.com',
        to: comment.user.email,
        subject: 'Testing Nodemailer',
        html: htmlString
    }, (err, info) => {
        if(err)
        {console.log('Error in mailer',err); return}

        console.log('Mail Delivered', info);
        return;
    });
}