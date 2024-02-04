const cacheValueProvider = require('../cache/cacheValueProvider');

const { createItem } = require('../redmine/itemCreator');

module.exports.createReportFromEmail = async function (plainText, upperedPlainText, subject, html, errorCallback) {
    const settings = await cacheValueProvider.getValue('items_from_emails_settings');

    if (settings.active) {

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
                originalname: 'SOURCE_EMAIL.html',
                mimetype: 'text/html',
                token: '',
                encoding: 'utf-8',
                buffer: Buffer.from(html, "utf-8")
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