const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const redmineItemValidator = require('../../../business/redmine/validation/redmineItemValidator');

module.exports.getRedmineTrackers = async (req, res) => {
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    return res.status(200).json(trackers);
}

module.exports.getRedmineUsers = async (req, res) => {
    const users = await cacheValueProvider.getValue('redmine_users');
    return res.status(200).json(users);
}

module.exports.getRedmineProjects = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    return res.status(200).json(projects);
}

module.exports.createRedmineItem = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    const validationResult = await redmineItemValidator.validateRedmineItem(req.body);

    if (validationResult.isValid) {

    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return res.status(200).json(retVal);
}