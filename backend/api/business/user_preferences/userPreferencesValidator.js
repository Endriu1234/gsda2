const cacheValueProvider = require('../cache/cacheValueProvider');

module.exports.validateUserPreferences = async function (body) {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    if (body) {
        const trackers = await cacheValueProvider.getValue('redmine_trackers');
        const users = await cacheValueProvider.getValue('redmine_users');
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const versions = await cacheValueProvider.getValue('redmine_versions');;

        if (!body.formId) {
            retVal.success = false;
            retVal.errorMessage = 'Form Id not provided';
        } else if ((body.currentValues.project && body.currentValues.project.length > 0 && !body.setupValues.rememberProject)) {
            retVal.success = false;
            retVal.errorMessage = 'Inconsistent Project values';
        } else if (body.currentValues.project && body.currentValues.project.length > 0
                    && !projects.filter(p => p.name === body.currentValues.project)) {
            retVal.success = false;
            retVal.errorMessage = 'Incorrect Project';
        } else if ((body.currentValues.version && body.currentValues.version.length > 0 && !body.setupValues.rememberVersion)) {
            retVal.success = false;
            retVal.errorMessage = 'Inconsistent Version values';
        } else if (body.currentValues.version && body.currentValues.version.length > 0
                    && !versions.filter(v => v.name === body.currentValues.version)) {
            retVal.success = false;
            retVal.errorMessage = 'Incorrect Version';
        } else if ((body.currentValues.tracker && body.currentValues.tracker.length > 0 && !body.setupValues.rememberTracker)) {
            retVal.success = false;
            retVal.errorMessage = 'Inconsistent Tracker values';
        } else if (body.currentValues.tracker && body.currentValues.tracker.length > 0
                    && !trackers.filter(t => t.name === body.currentValues.tracker)) {
            retVal.success = false;
            retVal.errorMessage = 'Incorrect Tracker';
        } else if ((body.currentValues.user && body.currentValues.user.length > 0 && !body.setupValues.rememberUser)) {
            retVal.success = false;
            retVal.errorMessage = 'Inconsistent User values';
        } else if (body.currentValues.user && body.currentValues.user.length > 0
                    && !users.filter(u => u.name === body.currentValues.user)) {
            retVal.success = false;
            retVal.errorMessage = 'Incorrect User';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'User Preferences not provided';
    }

    return retVal;
}