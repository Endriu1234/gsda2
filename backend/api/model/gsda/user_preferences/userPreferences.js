const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const userPreferences = new Schema({
    formId: String,
    user: String,
    setupValues: {
        rememberProject: Boolean,
        rememberVersion: Boolean,
        rememberTracker: Boolean,
        rememberUser: Boolean
    },
    currentValues: {
        project: String,
        version: String,
        tracker: String,
        user: String
    }
}, opts);

module.exports = mongoose.model('userPreferences', userPreferences, 'userPreferences');
