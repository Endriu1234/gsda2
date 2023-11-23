const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const { htmlToText } = require('html-to-text');
const { createItem } = require('../redmine/itemCreator');

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
    const successCallback = () => {
        console.log('Success Test');
    }
    const errorCallback = () => {
        console.log('Error Test');
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
                        console.log('resutls');
                        console.dir(results);

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

                                    // console.dir(parsed);


                                    const plainText = htmlToText(parsed.html, options);
                                    const upperedPlainText = plainText.toUpperCase();

                                    const gsdaResultIndex = upperedPlainText.indexOf("GSDA RESULT");
                                    const gsdaCreateIndex = upperedPlainText.indexOf("GSDA CREATE");

                                    console.log(`!! Analiza ${parsed.subject}`);

                                    if (gsdaCreateIndex !== -1 && (gsdaResultIndex === -1 || gsdaCreateIndex < gsdaResultIndex)) {
                                        console.log('TWORZYMY');



                                        const itemData = {
                                            project: 'Batch Creation 1',
                                            tracker: 'Deficiency',
                                            subject: (parsed.subject ? parsed.subject : 'Email w/o subject'),
                                            description: plainText,
                                            issue: '',
                                            user: '',
                                            cr: '',
                                            tms: '',
                                            version: '',
                                            est_time: '',
                                            uploads: [{
                                                filename: 'SOURCE_EMAIL.html',
                                                content_type: 'text/html',
                                                token: '',
                                                content: Buffer.from(parsed.html, "utf-8")
                                            }]
                                        };

                                        const itemCreationResult = await createItem(itemData);

                                        if (!itemCreationResult.success) {
                                            console.log(itemCreationResult.errorMessage);

                                            if (errorCallback)
                                                errorCallback(itemCreationResult.errorMessage);
                                        }

                                    }
                                    else
                                        console.log('Nie tworzymy ')
                                    // fs.writeFile(`email${Date.now().toString()}.html`, parsed.html, (error5) => {
                                    //     if (error5) {
                                    //         console.log(error5);
                                    //         throw error5;
                                    //     }
                                    // });

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
