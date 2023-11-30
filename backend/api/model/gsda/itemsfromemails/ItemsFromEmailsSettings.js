const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const ItemsFromEmailsSettings = new Schema({
    formId: String,
    values: {
        enabled: Boolean,
        tracker: String,
        project: String
    }
}, opts);

module.exports = mongoose.model('ItemsFromEmailsSettings', ItemsFromEmailsSettings, 'forms');
