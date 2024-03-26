const cacheValueProvider = require('../cache/cacheValueProvider');
const issuesFromEmailCollector = require('./issuesFromEmailCollector');
const crsFromEmailCollector = require('./crsFromEmailCollector');
const { sendEmail } = require('./emailSender');
const { createItem } = require('../redmine/itemCreator');

const GSDA_CREATE = "GSDA CREATE";
module.exports.GSDA_CREATE = GSDA_CREATE;

module.exports.createItemFromEmail = async function (commandIndex, parsedEmail, plainText, errorCallback) {

    const retVal = {
        success: true,
        errorMessage: ''
    }

    const endOfCommandIndex = commandIndex + GSDA_CREATE.length;
    const newLineIndex = plainText.indexOf('\n', commandIndex);

    let sendTo = [];
    let itemCreationResult = undefined;
    let newLine = "<br>";

    if (newLineIndex >= endOfCommandIndex) {
        let alias = plainText.substring(endOfCommandIndex, newLineIndex).trim();

        if (!alias)
            alias = 'General';

        const allSettings = await cacheValueProvider.getValue('items_from_emails_settings');
        const settings = allSettings.find(s => s.name === alias && (s.type === 'create' || s.type === 'both'));

        if (settings) {

            sendTo = parsedEmail.from.value;
            if (parsedEmail.to && parsedEmail.to.value)
                sendTo.push(...parsedEmail.to.value);
            if (parsedEmail.cc && parsedEmail.cc.value)
                sendTo.push(...parsedEmail.cc.value);

            newLine = parsedEmail.html ? "<br>" : "\n";
            const attExt = parsedEmail.html ? ".html" : ".txt";
            const attName = parsedEmail.subject ? parsedEmail.subject.substring(0,100).replace(/ /g,"_") + attExt : 'SOURCE_EMAIL' + attExt;
            let crs = '';
            if (settings.findCRs === 'all') {
                crs = crsFromEmailCollector.collectCrsAsString(plainText, crsFromEmailCollector.collectorTypeEnum.ALL);
            } else if (settings.findCRs === 'latest') {
                crs = crsFromEmailCollector.collectCrsAsString(plainText, crsFromEmailCollector.collectorTypeEnum.LATEST);
            } else if (settings.findCRs === 'earliest') {
                crs = crsFromEmailCollector.collectCrsAsString(plainText, crsFromEmailCollector.collectorTypeEnum.EARLIEST);
            }
            let issues = '';
            if (settings.findIssues === 'all') {
                issues = issuesFromEmailCollector.collectIssuesAsString(plainText, issuesFromEmailCollector.collectorTypeEnum.ALL);
            } else if (settings.findIssues === 'latest') {
                issues = issuesFromEmailCollector.collectIssuesAsString(plainText, issuesFromEmailCollector.collectorTypeEnum.LATEST);
            } else if (settings.findIssues === 'earliest') {
                issues = issuesFromEmailCollector.collectIssuesAsString(plainText, issuesFromEmailCollector.collectorTypeEnum.EARLIEST);
            }

            let files = [];
            if (settings.addAttachments && parsedEmail.attachments && parsedEmail.attachments.length > 0) {
                parsedEmail.attachments.map(att => {
                    files.push({
                        originalname: att.filename,
                        mimetype: att.contentType,
                        token: '',
                        encoding: 'utf-8',
                        buffer: att.content
                    });
                });
            }

            const itemData = {
                project: settings.project,
                tracker: settings.tracker,
                subject: (parsedEmail.subject ? parsedEmail.subject : 'Email w/o subject'),
                description: plainText,
                issue: issues,
                user: settings.user,
                cr: crs,
                tms: '',
                version: settings.version,
                est_time: '',
                files: files
            };

            itemCreationResult = await createItem(itemData);

            if (!itemCreationResult.success) {

                retVal.success = false;
                retVal.errorMessage = 'Problem with adding to Redmine';

                /*if (errorCallback)
                    errorCallback(itemCreationResult.errorMessage);*/
            }
        } else {
            retVal.success = false;
            retVal.errorMessage = 'Alias Settings were not found';
        }
    } else {
        retVal.success = false;
        retVal.errorMessage = 'Incorrect Attach Command';
    }

    if (retVal.success) {
        const emailSendResult = await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, `GSDA RESULT: item created ${newLine} ${itemCreationResult.redmineLink}`);

        if (!emailSendResult.success) {
            retVal.success = emailSendResult.success;
            retVal.errorMessage = retVal.errorMessage;
        }
    }
    else {
        await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, `GSDA RESULT: item creation failed: ${retVal.errorMessage}`);
    }
}
