const cacheValueProvider = require('../../../business/cache/cacheValueProvider');

module.exports.refreshCache = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshCustomFields();
        await cacheValueProvider.refreshEmailSettings();
        await cacheValueProvider.refreshIssueStatuses();
        await cacheValueProvider.refreshProjects();
        await cacheValueProvider.refreshSDProjects();
        await cacheValueProvider.refreshTmsClients();
        await cacheValueProvider.refreshTmsUsers();
        await cacheValueProvider.refreshTrackers();
        await cacheValueProvider.refreshUserPreferences();
        await cacheValueProvider.refreshUsers();
        await cacheValueProvider.refreshVersions();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}