const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const userPreferences = require('../../../model/gsda/user_preferences/userPreferences');
const { validateUserPreferences } = require('../../../business/user_preferences/userPreferencesValidator');

module.exports.getUserPreferences = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    const users_preferences  = await cacheValueProvider.getValue('user_preferences');

    if (users_preferences) {
        const user_preferences = users_preferences.find(up => { 
            return up.formId === req.query.formId && up.user === req.authData.user; 
        });

        if (user_preferences) {
            retVal.records = {
                formId: user_preferences.formId,
                user: user_preferences.user,
                setupValues: {
                    rememberProject: user_preferences.setupValues.rememberProject,
                    rememberVersion: user_preferences.setupValues.rememberVersion,
                    rememberTracker: user_preferences.setupValues.rememberTracker,
                    rememberUser: user_preferences.setupValues.rememberUser
                },
                currentValues: {
                    project: user_preferences.currentValues.project,
                    version: user_preferences.currentValues.version,
                    tracker: user_preferences.currentValues.tracker,
                    user: user_preferences.currentValues.user
                }
            }
        } else {
            console.log('Cannot find User Preferences for: ' + req.authData.user);
            retVal.errorMessage = 'Cannot find User Preferences';
        }
    }

    return res.status(200).json(retVal);
}

module.exports.saveUserPreferences = async (req, res) => {
    const retVal = {
        success: false,
        errorMessage: ''
    };

    try {
        const validationResult = await validateUserPreferences(req.body);

        if (validationResult.success) {

            req.body.user = req.authData.user;

            await userPreferences.findOneAndUpdate(
                { formId: req.body.formId, user: req.body.user }, 
                req.body, 
                { new: true, upsert: true }
            );

            cacheValueProvider.deleteValue('user_preferences');
            retVal.success = true;
        }
        else {
            console.log("error: " + validationResult.errorMessage);
            retVal.errorMessage = validationResult.errorMessage;
        }
    }
    catch (err) {
        console.dir(err);
        retVal.errorMessage = err;
    }

    return res.status(200).json(retVal);
}