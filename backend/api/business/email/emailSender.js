const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport(smtpTransport({
            host: process.env.GSDA_EMAIL_HOST,
            secureConnection: false,
            tls: {
                rejectUnauthorized: false
            },
            port: process.env.GSDA_EMAIL_SMTP_PORT,
            auth: {
                user: process.env.GSDA_EMAIL_USER,
                pass: process.env.GSDA_EMAIL_PASSWORD
            }
        }));
    }

    return transporter;
}

module.exports.sendEmail = async function (subject, sendToArray, text, htmlText) {
    const retVal = {
        success: true,
        errorMessage: ''
    }

    try {
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


                    const info = await getTransporter().sendMail({
                        from: `"GSDA" <${process.env.GSDA_EMAIL_USER}>`,
                        to: sendTo,
                        subject: subject,
                        text: text,
                        html: htmlText,
                    });

                    if (!info && !info.accepted && !info.accepted.length == 0) {
                        retVal.success = false;
                        retVal.errorMessage = 'Something went wrong during saving email';
                    }
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
    }
    catch (error) {
        console.log(error);
        retVal.success = false;
        retVal.errorMessage = 'Error was thrown during sending email';
    }

    return retVal;
}