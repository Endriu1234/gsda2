const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { htmlToText } = require('html-to-text');
const { createItemFromEmail } = require('./createItemFromEmail');
const { attachEmailToItem, GSDA_ATTACH } = require('./attachEmailToItem');
const { createReportFromEmail } = require('./createReportFromEmail');

const imapConfig = {
    user: process.env.GSDA_EMAIL_USER,
    password: process.env.GSDA_EMAIL_PASSWORD,
    host: process.env.GSDA_EMAIL_HOST,
    port: process.env.GSDA_EMAIL_PORT,
    tls: process.env.GSDA_EMAIL_TLS
};

function RunEmailAction(action, errorCallback) {
    const imap = new Imap(imapConfig);

    try {
        imap.once('ready', () => action(imap));

        imap.once('error', err => {
            console.log(err);
        });

        imap.once('end', () => {
            console.log('Connection ended');
        });

        imap.connect();
    }
    catch (error) {
        console.log(error);

        if (errorCallback)
            errorCallback(error);

        try {
            imap.destroy();
        }
        catch (error2) {
            console.log(error2);

            if (errorCallback)
                errorCallback(error2);
        }
    }
}

module.exports.getEmailBoxes = function (successCallback, errorCallback) {
    RunEmailAction((imap, errorCallback) => {
        imap.getBoxes((error, boxes) => {

            if (error) {
                if (errorCallback)
                    errorCallback(error);
            }
            else if (successCallback)
                successCallback(boxes);

            imap.end();
        });
    });
}

module.exports.getEmails = function (successCallback, errorCallback) {
    RunEmailAction((imap, errorCallback) => {
        imap.getBoxes((error, boxes) => {

            if (error) {
                if (errorCallback)
                    errorCallback(error);
            }
            else if (successCallback)
                successCallback(boxes);

            imap.end();
        });
    });
}

module.exports.test = function () {
    const successCallback = (success) => {
        console.log(`Success Test: ${success}`);
    }
    const errorCallback = (error) => {
        console.log(`Test error: ${error}`);
    }

    RunEmailAction((imap, errorCallback) => {
        imap.openBox('gsda', false, () => {
            imap.search(['ALL'],
                (error1, results) => {

                    if (!results || results.length === 0)
                        return;

                    console.log(`START`);
                    if (error1) {
                        console.log('error1');
                        console.dir(error1);

                        if (errorCallback)
                            errorCallback(error1);
                    }
                    else {

                        const f = imap.fetch(results, { bodies: '' });

                        f.on('message', msg => {
                            msg.on('body', stream => {

                                simpleParser(stream, async (error2, parsed) => {
                                    if (error2) {
                                        console.log(error2);

                                        if (errorCallback)
                                            errorCallback(error2);
                                    }
                                    const options = {
                                        selectors: [
                                            { selector: 'img', format: 'skip' }
                                        ]
                                    };

                                    console.log("sparsowny email:");
                                    console.dir(parsed.from.value);

                                    const plainText = htmlToText(parsed.html, options);
                                    const upperedPlainText = plainText.toUpperCase();

                                    const gsdaResultIndex = upperedPlainText.indexOf("GSDA RESULT");
                                    const gsdaCreateIndex = upperedPlainText.indexOf("GSDA CREATE");
                                    const gsdAttachIndex = upperedPlainText.indexOf(GSDA_ATTACH);
                                    const gsdaRepprtIndex = upperedPlainText.indexOf("GSDA REPORT");

                                    if (gsdaCreateIndex !== -1 && (gsdaResultIndex === -1 || gsdaCreateIndex < gsdaResultIndex)) {
                                        createItemFromEmail(plainText, upperedPlainText, parsed.subject, parsed.html, errorCallback);
                                    }
                                    else if (gsdAttachIndex !== -1 && (gsdaResultIndex === -1 || gsdAttachIndex < gsdaResultIndex)) {
                                        attachEmailToItem(gsdAttachIndex, parsed, plainText, errorCallback);
                                    }
                                    else if (gsdaRepprtIndex !== -1 && (gsdaResultIndex === -1 || gsdaRepprtIndex < gsdaResultIndex)) {
                                        createReportFromEmail(plainText, upperedPlainText, parsed.subject, parsed.html, errorCallback);
                                    }
                                });
                            });

                            msg.once('attributes', attrs => {
                                // const { uid } = attrs;
                                // const success = imap.addFlags(uid, ['\\Deleted'], (error6) => {
                                //     if (error6) {

                                //         console.log(error6);

                                //         if (errorCallback)
                                //             errorCallback(error6);
                                //     }
                                // });

                                // if (success !== true) {
                                //     console.log(imap.LastErrorText);

                                //     if (errorCallback)
                                //         errorCallback(imap.LastErrorText);
                                // }
                            });
                        });

                        f.once('error', error3 => {
                            console.log(error3);

                            if (errorCallback)
                                errorCallback(error3);

                            return Promise.reject(error3);

                        });
                        f.once('end', () => {
                            imap.closeBox(true, (error7) => {
                                console.log(error7);

                                if (errorCallback)
                                    errorCallback(error7);
                            });

                            imap.end();
                        });
                    }
                });
        });
    });
}
