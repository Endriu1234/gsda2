const cacheValueProvider = require('../cache/cacheValueProvider');
const itemsFromTextCollector = require('./itemsFromTextCollector');
const { postFiles, putRedmineJsonData } = require('../redmine/tools/redmineConnectionTools');
const { sendEmail } = require('./emailSender');
const { closeItems } = require('../redmine/itemCloser');

const GSDA_ATTACH = "GSDA ATTACH";
module.exports.GSDA_ATTACH = GSDA_ATTACH;

module.exports.attachEmailToItem = async function (commandIndex, parsedEmail, plainText) {

    const retVal = {
        success: true,
        errorMessage: ''
    }
    const endOfCommandIndex = commandIndex + GSDA_ATTACH.length;
    const newLineIndex = plainText.indexOf('\n', commandIndex);

    let sendTo = [];

    if (newLineIndex >= endOfCommandIndex) {
        let alias = plainText.substring(endOfCommandIndex, newLineIndex).trim();

        if (!alias)
            alias = 'General';

        const allSettings = await cacheValueProvider.getValue('items_from_emails_settings');
        const settings = allSettings.find(s => s.name === alias && (s.type === 'attach' || s.type === 'both'));

        if (settings) {

            if (settings.sendAttachResultTo === 'sender') {
                sendTo = parsedEmail.from.value; 
            } else {
                sendTo = parsedEmail.from.value;
                if (parsedEmail.to && parsedEmail.to.value)
                    sendTo.push(...parsedEmail.to.value);
                if (parsedEmail.cc && parsedEmail.cc.value)
                    sendTo.push(...parsedEmail.cc.value);
            }

            const items = itemsFromTextCollector.collectItems(plainText, false);
            
            if (items.length > 0) {
                const attExt = parsedEmail.html ? ".html" : ".txt";
                const attName = parsedEmail.subject ? parsedEmail.subject.substring(0,100).replace(/ /g,"_") + attExt : 'SOURCE_EMAIL' + attExt
                const files = [{
                    originalname: attName,
                    mimetype: 'text/html',
                    token: '',
                    encoding: 'utf-8',
                    buffer: Buffer.from(parsedEmail.html ? parsedEmail.html : parsedEmail.text, "utf-8")
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

                    const attachResult = await putRedmineJsonData(`issues/${items[0]}`, data);

                    if (attachResult.success) {

                        const itemsToClose = [];

                        if (settings.closeItemsAfterAttach === 'latest')
                            itemsToClose.push(items[0]);
                        else if (settings.closeItemsAfterAttach === 'earliest')
                            itemsToClose.push(items[items.length - 1]);
                        else if (settings.closeItemsAfterAttach === 'all')
                            itemsToClose.push(...items);

                        if (itemsToClose.length > 0) {
                            const closeResult = await closeItems(itemsToClose);

                            if (!closeResult.success) {
                                retVal.success = closeResult.success;
                                retVal.retVal = closeResult.errorMessage;
                            }
                        }
                    }
                    else {
                        retVal.success = false;
                        retVal.errorMessage = 'Attaching files failed';
                    }
                }
                else {
                    retVal.success = false;
                    retVal.errorMessage = postFiles.errorMessage;
                }
            }
            else {
                retVal.success = false;
                retVal.errorMessage = 'Items to attach were not found';
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Alias Settings were not found';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'Incorrect Attach Command';
    }

    if (retVal.success) {
        const emailSendResult = await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, 'GSDA RESULT: attachment added');

        if (!emailSendResult.success) {
            retVal.success = emailSendResult.success;
            retVal.errorMessage = retVal.errorMessage;
        }
    }
    else {
        await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, `GSDA RESULT: attachment adding failed: ${retVal.errorMessage}`);
    }

    return retVal;
}

