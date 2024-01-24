const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const ItemsFromEmailsSettings = new Schema({
    name: String,
    active: Boolean,
    type: String,
    tracker: String,
    project: String,
    version: String,
    user: String,
    parsingMode: String,
    findIssues: String,
    findCRs: String,
    addAttachments: Boolean,
    closeItemsAfterAttach: String,
    sendAttachResultTo: String,
    modifiedBy: String
}, opts);

module.exports = mongoose.model('ItemsFromEmailsSettings', ItemsFromEmailsSettings, 'itemsFromEmailsSettings');
