const { set } = require('lodash');
const cacheValueProvider = require('../cache/cacheValueProvider');
const itemsFromTextCollector = require('./itemsFromTextCollector');

const GSDA_ATTACH = "GSDA ATTACH";
module.exports.GSDA_ATTACH = GSDA_ATTACH;

module.exports.attachEmailToItem = async function (commandIndex, plainText, upperedPlainText, subject, html, errorCallback) {

    const endOfCommandIndex = commandIndex + GSDA_ATTACH.length;
    const newLineIndex = plainText.indexOf('\n', commandIndex);

    if (newLineIndex >= endOfCommandIndex) {
        let alias = plainText.substring(endOfCommandIndex, newLineIndex).trim();

        if (!alias)
            alias = 'General';

        const allSettings = await cacheValueProvider.getValue('items_from_emails_settings');
        const settings = allSettings.find(s => s.name === alias && (s.type === 'attach' || s.type === 'both'));

        if (settings) {
            console.log('znaleziono alias: ');
            console.dir(settings);

            const items = itemsFromTextCollector.collectItems(plainText, true);
            console.log('Znaleziono Itemy:');
            console.dir(items);

        }
        else
            console.log('Alias Settings were not found');
    }
    else
        console.log('Incorrect Attach Command');


    //  if (settings.active) {

    // const itemData = {
    //     project: settings.project,
    //     tracker: settings.tracker,
    //     subject: (subject ? subject : 'Email w/o subject'),
    //     description: plainText,
    //     issue: '',
    //     user: settings.user,
    //     cr: '',
    //     tms: '',
    //     version: settings.version,
    //     est_time: '',
    //     files: [{
    //         originalname: 'SOURCE_EMAIL.html',
    //         mimetype: 'text/html',
    //         token: '',
    //         encoding: 'utf-8',
    //         buffer: Buffer.from(html, "utf-8")
    //     }]
    //        };

    //      const itemCreationResult = await createItem(itemData);

    //      if (!itemCreationResult.success) {
    //           console.log(itemCreationResult.errorMessage);

    //           if (errorCallback)
    //errorCallback(itemCreationResult.errorMessage);
    //     }
}

