const emailHandler = require('../../../business/email/emailHandler');
const ItemsFromEmailsSettings = require('../../../model/gsda/itemsfromemails/ItemsFromEmailsSettings');
const cacheValueProvider = require('../../../business/cache/cacheValueProvider');

module.exports.getItemsFromEmailsSettings = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        active: false,
        tracker: '',
        project: '',
        version: '',
        user: '',
        parsingMode: '',
        addAttachments: false,
        modifiedBy: ''
    };

    if (req.query.formId) {

        const result = await ItemsFromEmailsSettings.findOne({ formId: req.query.formId })
            .then(result => {
                if (result) {
                    retVal.active = result.values.active;
                    retVal.tracker = result.values.tracker;
                    retVal.project = result.values.project;
                    retVal.version = result.values.version;
                    retVal.user = result.values.user;
                    retVal.parsingMode = result.values.parsingMode;
                    retVal.addAttachments = result.values.addAttachments;
                    retVal.modifiedBy = result.values.modifiedBy;
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
    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'Cannot retrieve Items From Emails Settings because formId was not provided';
    }

    return res.status(200).json(retVal);
}



module.exports.saveItemsFromEmailsSettings = async (req, res) => {

    const retVal = {
        success: false,
        errorMessage: ''
    };

    try {

        if (req.body.formId && req.body.values
            && req.body.values) {

            req.body.values.modifiedBy = req.authData.user;

            await ItemsFromEmailsSettings.findOneAndUpdate({ formId: req.body.formId }, { values: req.body.values });
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
