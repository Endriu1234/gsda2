const cacheValueProvider = require('../../../business/cache/cacheValueProvider');

module.exports.getSoftDevProjects = async (req, res) => {
    const projects = await cacheValueProvider.getValue('softdev_projects');
    return res.status(200).json(projects);
}