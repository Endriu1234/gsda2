const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const ItemsFromEmailsSettings = new Schema({
    formId: String,
    values: {
        active: Boolean,
        tracker: String,
        project: String,
        version: String,
        user: String,
        parsingMode: String,
        addAttachments: Boolean,
        modifiedBy: String
    }
}, opts);

module.exports = mongoose.model('ItemsFromEmailsSettings', ItemsFromEmailsSettings, 'forms');
