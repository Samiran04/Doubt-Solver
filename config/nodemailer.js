const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//this is for how the mail has to be send
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'realcodeial@gmail.com',
        pass: 'codeial123'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
        path.join(__dirname, '../views/mailer', relativePath),
        data,
        function(err, template){
            if(err){console.log('Error int nodemailer file', err); return}
            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}