const nodemailer = require('nodemailer');

const enviar = async(to, subject, html) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodemailerADL@gmail.com',
            pass: 'desafiolatam',
        },
    })

    let mailOptions = {
        from: '"🏆" <nodemailerADL@gmail.com>',
        to,
        subject,
        html
    }

    const enviarMensaje = await transporter.sendMail(mailOptions);
    return enviarMensaje;
}

module.exports = enviar;