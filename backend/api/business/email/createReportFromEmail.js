const cacheValueProvider = require('../cache/cacheValueProvider');

const { createItem } = require('../redmine/itemCreator');

module.exports.createReportFromEmail = async function (plainText, upperedPlainText, subject, parsedEmail/*, errorCallback*/) {
    const settings = await cacheValueProvider.getValue('items_from_emails_settings');

    if (settings.active) {

        const attExt = parsedEmail.html ? ".html" : ".txt";
        const attName = subject ? subject.substring(0,100).replace(/ /g,"_") + attExt : 'SOURCE_EMAIL' + attExt;
        const itemData = {
            project: settings.project,
            tracker: settings.tracker,
            subject: (subject ? subject : 'Email w/o subject'),
            description: plainText,
            issue: '',
            user: settings.user,
            cr: '',
            tms: '',
            version: settings.version,
            est_time: '',
            files: [{
                originalname: attName,
                mimetype: 'text/html',
                token: '',
                encoding: 'utf-8',
                buffer: Buffer.from(parsedEmail.html ? parsedEmail.html : parsedEmail.text, "utf-8")
            }]
        };

        const itemCreationResult = await createItem(itemData);

        if (!itemCreationResult.success) {
            console.log(itemCreationResult.errorMessage);

            if (errorCallback)
                errorCallback(itemCreationResult.errorMessage);
        }
    }
}