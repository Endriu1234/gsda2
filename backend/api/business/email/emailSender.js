const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.GSDA_EMAIL_HOST,
    secureConnection: process.env.GSDA_EMAIL_SMTP_SECURE_CONN,
    tls: {
        rejectUnauthorized: process.env.GSDA_EMAIL_SMTP_REJECT_UNAUTH
    },
    port: process.env.GSDA_EMAIL_SMTP_PORT,
    auth: {
        user: process.env.GSDA_EMAIL_USER,
        pass: process.env.GSDA_EMAIL_PASSWORD
    }
}));

module.exports.sendEmail = async function (subject, sendToArray, text, htmlText) {
    const retVal = {
        success: true,
        errorMessage: ''
    }

    if (subject && subject.length > 0) {

        if (sendToArray && sendToArray.length > 0) {

            sendTo = '';

            for (const adressObj of sendToArray) {
                if (sendTo)
                    sendTo = sendTo + ', ' + adressObj.address;
                else
                    sendTo = adressObj.address;
            }

            if (text && text.length > 0) {

                if (!htmlText)
                    htmlText = `<p>${text}</p>`


                const info = await transporter.sendMail({
                    from: `"GSDA" <${process.env.GSDA_EMAIL_USER}>`,
                    to: sendTo,
                    subject: subject,
                    text: text,
                    html: htmlText,
                });

                console.dir(info);
                console.log("Message sent: %s", info.messageId);
            }
            else {
                retVal.success = false;
                retVal.errorMessage = 'Email Text not provided';
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Send To array not provided';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'Subject for email not provided';
    }

    return retVal;
}