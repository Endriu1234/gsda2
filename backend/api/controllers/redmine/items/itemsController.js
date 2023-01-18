const cacheValueProvider = require('../../../business/cache/cacheValueProvider');

module.exports.getRedmineTrackers = async (req, res) => {
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    return res.status(200).json(trackers);
}