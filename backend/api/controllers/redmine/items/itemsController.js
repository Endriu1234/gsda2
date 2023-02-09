const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const usersByLetterPreparer = require('../../../business/redmine/data_preparing/UsersByLetterDataPreparer');

module.exports.getRedmineTrackers = async (req, res) => {
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    return res.status(200).json(trackers);
}

module.exports.getRedmineUsers = async (req, res) => {
    const users = await cacheValueProvider.getValue('redmine_users');
    return res.status(200).json(users);
}

module.exports.getRedmineUsersByLetter = async (req, res) => {
    const usersByLetter = await usersByLetterPreparer.getUsersByLetter();
    return res.status(200).json(usersByLetter);
}

module.exports.getRedmineProjects = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    return res.status(200).json(projects);
}