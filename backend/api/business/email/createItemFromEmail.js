const cacheValueProvider = require('../cache/cacheValueProvider');
const issuesFromEmailCollector = require('./issuesFromEmailCollector');
const crsFromEmailCollector = require('./crsFromEmailCollector');
const { sendEmail } = require('./emailSender');
const { createItem } = require('../redmine/itemCreator');
const { getTextileAndPicFromHtml/*, insertAtBeginningHtml*/ } = require('./tools/emailHtmlToTexttileHelper');

const GSDA_CREATE = "GSDA CREATE";
const CREATE = 'create';
const BOTH = 'both';
module.exports.GSDA_CREATE = GSDA_CREATE;

module.exports.createItemFromEmail = async function (commandIndex, parsedEmail, plainText) {

    const retVal = {
        success: true,
        errorMessage: ''
    }

    const endOfCommandIndex = commandIndex + GSDA_CREATE.length;
    const newLineIndex = plainText.indexOf('\n', commandIndex);

    let sendTo = [];
    let creationType = CREATE;
    let itemCreationResult = undefined;
    let newLine = "<br>";

    if (newLineIndex >= endOfCommandIndex) {
        let alias = plainText.substring(endOfCommandIndex, newLineIndex).trim();

        if (!alias)
            alias = 'General';

        const allSettings = await cacheValueProvider.getValue('items_from_emails_settings');
        const settings = allSettings.find(s => s.name === alias && (s.type === CREATE || s.type === BOTH));

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

            let descriptionText = plainText;
            let files = [];

            if (settings.parsingMode) {
                if (settings.parsingMode === 'parsedHtml') {
                    const objTxtPic = getTextileAndPicFromHtml(parsedEmail.html);

                    if (objTxtPic) {
                        if (objTxtPic.textile && objTxtPic.textile.length > 0) {
                            descriptionText = objTxtPic.textile;
                        }

                        if (objTxtPic.pictures && objTxtPic.pictures.length > 0) {
                            objTxtPic.pictures.map(txtPic => {
                                files.push({
                                    originalname: txtPic.name,
                                    mimetype: txtPic.mimetype,
                                    token: '',
                                    encoding: 'utf-8',
                                    buffer: txtPic.picture
                                })
                            })
                        }
                    }
                } else if (settings.parsingMode === 'plainAndHtmlAttachment') {
                    files.push({
                        originalname: attName,
                        mimetype: 'text/html',
                        token: '',
                        encoding: 'utf-8',
                        buffer: Buffer.from(parsedEmail.html ? parsedEmail.html : parsedEmail.text, "utf-8")
                    });
                }
            }

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
                description: descriptionText,
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
        let htmlTextResponse = parsedEmail.html ? /*insertAtBeginningHtml(parsedEmail.html, */`<p>GSDA RESULT: item created</p><a href="${itemCreationResult.redmineLink}" target="_blank">${itemCreationResult.redmineLink}</a><br><br><br><br>`/*)*/ : '';       
        const emailSendResult = await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, `GSDA RESULT: item created ${newLine} ${itemCreationResult.redmineLink}`, htmlTextResponse);

        if (!emailSendResult.success) {
            retVal.success = emailSendResult.success;
            retVal.errorMessage = retVal.errorMessage;
        }
    }
    else {
        await sendEmail(parsedEmail.subject, sendTo.length > 0 ? sendTo : parsedEmail.from.value, `GSDA RESULT: item creation failed: ${retVal.errorMessage}`);
    }
}
