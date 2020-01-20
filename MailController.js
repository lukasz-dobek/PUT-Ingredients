const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

exports.sendEmail = function(mail, subject, htmlMessage) {
    
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let mailOptions = {
        from: '"Ingr Adm"',
        to: mail,
        subject: subject,
        html: htmlMessage,
};

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);

        });
}