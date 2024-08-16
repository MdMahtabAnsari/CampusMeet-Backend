const transporter = require('../configs/emailConfig');
const serverConfig = require('../configs/serverConfig');

class EmailService {
    constructor() {
        this.transporter = transporter;
        this.serverConfig = serverConfig;
    }

    async sendEmail(emailData) {
        try {
            await this.transporter.sendMail({
                from: this.serverConfig.ADMIN_EMAIL,
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        }
    }
}

module.exports = EmailService;