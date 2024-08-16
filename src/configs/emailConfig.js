const nodemailer = require('nodemailer');
const serverConfig = require('./serverConfig');

const transporter = nodemailer.createTransport({
    host: serverConfig.SMTP_HOST,
    port: serverConfig.SMTP_PORT,
    secure: false,
    auth: {
        user: serverConfig.SMTP_USER,
        pass: serverConfig.SMTP_PASSWORD
    }
});

transporter.verify((error) => {
    if (error) {
        throw new Error('Error verifying the transporter');
    } else {
        console.log('Transporter is ready to send emails');
    }
});



module.exports = transporter;