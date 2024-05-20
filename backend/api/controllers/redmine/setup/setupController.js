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

module.exports.refreshVersions = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshVersions();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}

module.exports.refreshSDProjects = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshSDProjects();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}

module.exports.refreshRedmineProjects = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshProjects();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}

module.exports.refreshCustomFields = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshCustomFields();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}

module.exports.refreshEmailSettings = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshEmailSettings();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}

module.exports.refreshUserPreferences = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    try {
        await cacheValueProvider.refreshUserPreferences();
    } catch (error) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    return res.status(200).json(retVal);
}