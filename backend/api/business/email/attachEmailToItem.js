const { set } = require('lodash');
const cacheValueProvider = require('../cache/cacheValueProvider');
const itemsFromTextCollector = require('./itemsFromTextCollector');
const { postFiles, putRedmineJsonData } = require('../redmine/tools/redmineConnectionTools');
const { sendEmail } = require('./emailSender');

const GSDA_ATTACH = "GSDA ATTACH";
module.exports.GSDA_ATTACH = GSDA_ATTACH;

module.exports.attachEmailToItem = async function (commandIndex, parsedEmail, plainText, errorCallback) {

    const endOfCommandIndex = commandIndex + GSDA_ATTACH.length;
    const newLineIndex = plainText.indexOf('\n', commandIndex);

    if (newLineIndex >= endOfCommandIndex) {
        let alias = plainText.substring(endOfCommandIndex, newLineIndex).trim();

        if (!alias)
            alias = 'General';

        const allSettings = await cacheValueProvider.getValue('items_from_emails_settings');
        const settings = allSettings.find(s => s.name === alias && (s.type === 'attach' || s.type === 'both'));

        if (settings) {

            const items = itemsFromTextCollector.collectItems(plainText, true);

            if (items.length > 0) {
                const files = [{
                    originalname: 'SOURCE_EMAIL.html',
                    mimetype: 'text/html',
                    token: '',
                    encoding: 'utf-8',
                    buffer: Buffer.from(parsedEmail.html, "utf-8")
                }]

                const postResult = postFiles(files);

                if ((await postResult).success) {

                    const data = {
                        issue: {
                            uploads: []
                        }
                    };

                    for (const file of files) {
                        data.issue.uploads.push({
                            token: file.token,
                            filename: file.originalname.indexOf(' ') >= 0 ? file.filename : file.originalname,
                            content_type: file.mimetype
                        });
                    }

                    console.log(`updatowany item: ${items[0]}`);

                    const attachResult = await putRedmineJsonData(`issues/${items[0]}`, data);

                    if (attachResult.success) {
                        console.dir(parsedEmail.from);
                        const emailSendResult = sendEmail(parsedEmail.subject, parsedEmail.from.value, 'GSDA RESULT: attachment added');
                        console.log('resulatat emailowy: ');
                        console.dir(emailSendResult);
                    }
                    else
                        errorCallback('Attaching files failed');

                }
                else
                    errorCallback(postFiles.errorMessage);
            }
            else
                errorCallback('Items to attach were not found');

        }
        else
            errorCallback('Alias Settings were not found');
    }
    else
        errorCallback('Incorrect Attach Command');
}

