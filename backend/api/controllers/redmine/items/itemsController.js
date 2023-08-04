const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const redmineItemValidator = require('../../../business/redmine/validation/redmineItemValidator');
const { convertFormItemObjectToJSON } = require('../../../business/redmine/tools/formItemObjectToJSONConverter');
const { postRedmineJsonData, getRedmineAddress } = require('../../../business/redmine/tools/redmineConnectionTools');


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
        const itemJson = await convertFormItemObjectToJSON(req.body);
        const result = await postRedmineJsonData('issues.json', itemJson);

        if (!result.success) {
            retVal.success = false;
            retVal.errorMessage = 'Redmine Item not created. Save failed.';
        }
        else
            retVal.redmineLink = `${getRedmineAddress(`issues/${result.redmineResponse.data.issue.id}`)}`;
    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return res.status(200).json(retVal);

    return res.status(200).json(retVal);
}