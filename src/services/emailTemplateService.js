const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const mjml = require('mjml');

class EmailTemplateService {
    constructor() {
        this.handlebars = handlebars;
        this.fs = fs;
        this.path = path;
        this.mjml = mjml;
    }

    async generateEmailTemplate(template, data) {
        try {
            const templatePath = this.path.join(__dirname, `../views/templates/${template}.mjml`);
            const templateFile = this.fs.readFileSync(templatePath, 'utf8');
            const templateHTML = this.mjml(templateFile).html;
            const templateData = this.handlebars.compile(templateHTML);
            const emailTemplate = templateData(data);

            return emailTemplate;
        } catch (error) {
            console.error('Error generating email template:', error);
            throw new Error('Error generating email template');
        }
    }
}

module.exports = EmailTemplateService;
