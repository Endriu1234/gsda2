const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { htmlToText } = require('html-to-text');
const { createItemFromEmail, GSDA_CREATE } = require('./createItemFromEmail');
const { attachEmailToItem, GSDA_ATTACH } = require('./attachEmailToItem');
const { createReportFromEmail } = require('./createReportFromEmail');

module.exports.handleEmailCommands = function () {

    try {

        const imapConfig = {
            user: process.env.GSDA_EMAIL_USER,
            password: process.env.GSDA_EMAIL_PASSWORD,
            host: process.env.GSDA_EMAIL_HOST,
            port: process.env.GSDA_EMAIL_PORT,
            tls: process.env.GSDA_EMAIL_TLS,
            keepalive: {
                idleInterval: 60 * 1000
            }
        };

        const imap = new Imap(imapConfig);

        imap.once('ready', () => {
            imap.openBox(process.env.GSDA_EMAIL_BOX, false, () => {
                handleEmails(imap, true);
            });
        });

        imap.once('error', err => {
            console.log(`emailHandler.js (!): ${err}`);
            console.dir(err);
            imap.end();
        });

        imap.once('end', () => {
            console.log('emailHandler.js: imap connection ended');
        });

        imap.connect();
    }
    catch (error) {
        console.log(`emailHandler.js: ${error}`);

        try {
            imap.end();
        }
        catch (error2) {
            console.log(`emailHandler.js: ${error2}`);
        }
    }
}

function handleEmails(imap, initEmailRecieveListening) {
    imap.search(['ALL'],
        (error1, results) => {

            if (error1) {
                console.log(`emailHandler.js -> handleEmails(): ${error1}`);
                imap.end();
                return;
            }

            if (!results || results.length === 0) {
                if (initEmailRecieveListening)
                    imap.on('mail', mail => handleEmails(imap, false));

                return;
            }

            const f = imap.fetch(results, { bodies: '' });

            f.on('message', msg => {
                msg.on('body', stream => {

                    simpleParser(stream, async (error2, parsed) => {
                        if (error2) {
                            console.log(`emailHandler.js -> handleEmails(1): ${error2}`);
                            imap.end();
                            return;
                        }

                        const options = {
                            selectors: [
                                { selector: 'img', format: 'skip' }
                            ]
                        };
                        
                        const plainText = parsed.html ? htmlToText(parsed.html, options) : parsed.text;
                        const upperedPlainText = plainText.toUpperCase();

                        const gsdaResultIndex = upperedPlainText.trimStart().slice(0,upperedPlainText.indexOf('\n')).indexOf("GSDA RESULT");
                        const gsdaCreateIndex = upperedPlainText.trimStart().slice(0,upperedPlainText.indexOf('\n')).indexOf(GSDA_CREATE);
                        const gsdAttachIndex = upperedPlainText.trimStart().slice(0,upperedPlainText.indexOf('\n')).indexOf(GSDA_ATTACH);
                        const gsdaReportIndex = upperedPlainText.trimStart().slice(0,upperedPlainText.indexOf('\n')).indexOf("GSDA REPORT");
                        
                        if (gsdaCreateIndex !== -1 && (gsdaResultIndex === -1 || gsdaCreateIndex < gsdaResultIndex)) {
                            createItemFromEmail(gsdaCreateIndex, parsed, plainText);
                        }
                        else if (gsdAttachIndex !== -1 && (gsdaResultIndex === -1 || gsdAttachIndex < gsdaResultIndex)) {
                            const attachResult = await attachEmailToItem(gsdAttachIndex, parsed, plainText);

                            if (!attachResult.success)
                                console.log(attachResult.errorMessage);
                        }
                        else if (gsdaReportIndex !== -1 && (gsdaResultIndex === -1 || gsdaReportIndex < gsdaResultIndex)) {
                            createReportFromEmail(plainText, upperedPlainText, parsed.subject, parsed.html, errorCallback);
                        }
                    });
                });

                msg.once('attributes', attrs => {
                    const { uid } = attrs;
                    const success = imap.setFlags(uid, ['\\Deleted'], (error6) => {
                        if (error6) {
                            console.log(`emailHandler.js -> once 'attributes': ${error6}`);
                            imap.end();
                        }
                    });

                    imap.expunge([uid], (error7) => {
                        if (error7) {
                            console.log(`emailHandler.js -> once 'attributes': ${error7}`);
                            imap.end();
                        }
                    });

                    // if (success !== true) {
                    //     console.log(`emailHandler.js -> handleEmails(3): ${imap.LastErrorText}`);
                    // }
                });
            });

            f.once('error', error3 => {
                console.log(`emailHandler.js -> handleEmails(4): ${error3}`);
                imap.end();

                return Promise.reject(error3);

            });
            f.once('end', () => {
                if (initEmailRecieveListening)
                    imap.on('mail', mail => handleEmails(imap, false));
            });
        });

}

