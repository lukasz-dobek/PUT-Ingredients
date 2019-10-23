var nodeMailer = require('nodemailer');

exports.sendEmail = function(mail, subject, htmlMessage) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ingredientsapp300@gmail.com',
            pass: 'Cashew_123'
        }
    });
    let mailOptions = {
        from: '"Ingr Adm" <ingredientsapp300@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: subject,
        // 'Ingredients - Dokończ proces rejestracji', // Subject line
        // text: 'test123', // plain text body
        html: htmlMessage,
        //`<a href="http://localhost:3000/${url}">Kliknij, aby ukończyć proces rejestracji!</a>` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);

        });
}