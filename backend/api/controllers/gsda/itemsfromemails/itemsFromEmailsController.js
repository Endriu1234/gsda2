const emailHandler = require('../../../business/email/emailHandler');
const ItemsFromEmailsSettings = require('../../../model/gsda/itemsfromemails/ItemsFromEmailsSettings');
const cacheValueProvider = require('../../../business/cache/cacheValueProvider');

module.exports.getItemsFromEmailsSettings = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    const result = await ItemsFromEmailsSettings.find()
        .then(result => {
            if (result && result.length > 0) {

                retVal.records = [];

                result.forEach(record => {
                    retVal.records.push({
                        name: record.name,
                        active: record.active,
                        type: record.type,
                        tracker: record.tracker,
                        project: record.project,
                        version: record.version,
                        user: record.user,
                        parsingMode: record.parsingMode,
                        findIssues: record.findIssues,
                        findCRs: record.findCRs,
                        addAttachments: record.addAttachments,
                        closeItemsAfterAttach: record.closeItemsAfterAttach,
                        sendAttachResultTo: record.sendAttachResultTo,
                        modifiedBy: record.modifiedBy
                    })
                });

            }
            else {
                console.log('Cannot find Items From Emails Settings');
                retVal.success = false;
                retVal.errorMessage = 'Cannot find Items From Emails Settings';
            }
        })
        .catch(error => {
            console.log(error);
            retVal.success = false;
            retVal.errorMessage = error;
        });

    return res.status(200).json(retVal);
}



module.exports.saveItemsFromEmailsSettings = async (req, res) => {

    const retVal = {
        success: false,
        errorMessage: ''
    };

    try {
        if (req.body.values) {

            req.body.values.modifiedBy = req.authData.user;

            if (req.body.editedSetting) {
                await ItemsFromEmailsSettings.findOneAndUpdate(
                    { name: req.body.editedSetting.name, type: req.body.editedSetting.type }, req.body.values);
            }
            else {
                await ItemsFromEmailsSettings.insertOne(req.body.values);
            }

            cacheValueProvider.deleteValue('items_from_emails_settings');
            retVal.success = true;
        }
        else {
            retVal.errorMessage = 'Incorrect Data provided for Items From Emails Save';
        }
    }
    catch (err) {
        retVal.errorMessage = err;
    }

    emailHandler.test();

    return res.status(200).json(retVal);
}

module.exports.deleteSettings = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    const result = await ItemsFromEmailsSettings.findOneAndDelete({ name: req.body.name, type: req.body.type });
    return res.status(200).json(retVal);
}
