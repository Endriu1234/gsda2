const cacheValueProvider = require('../cache/cacheValueProvider');

const { createItem } = require('../redmine/itemCreator');

module.exports.createItemFromEmail = async function (plainText, upperedPlainText, subject, html, errorCallback) {
    const settings = await cacheValueProvider.getValue('items_from_emails_settings');

    if (settings.active) {
        console.log('tworzymy');

        const gsdaResultIndex = upperedPlainText.indexOf("GSDA RESULT");
        const gsdaCreateIndex = upperedPlainText.indexOf("GSDA CREATE");

        if (gsdaCreateIndex !== -1 && (gsdaResultIndex === -1 || gsdaCreateIndex < gsdaResultIndex)) {

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
                uploads: [{
                    filename: 'SOURCE_EMAIL.html',
                    content_type: 'text/html',
                    token: '',
                    content: Buffer.from(html, "utf-8")
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
    else
        console.log('NIE TWORZYMY');
}
