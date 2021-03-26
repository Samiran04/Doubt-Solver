const queue = require('../config/kue');

const passwordMailer = require('../mailer/reset_password_mailer');

queue.process('password-emails', function(job, done){
    console.log('emails worker is processing a job', job.data);

    passwordMailer.createMail(job.data);

    done();
});