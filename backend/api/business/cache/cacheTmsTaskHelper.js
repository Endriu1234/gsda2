const cacheValueProvider = require('./cacheValueProvider');

let tmsTasks = [];

module.exports.addValidatedTmsTask = function (tmsTask) {
    if (typeof tmsTask === 'string' && !tmsTasks.includes(tmsTask)) {
        tmsTasks.push(tmsTask.trim().toUpperCase());
    }
}

module.exports.getTmsTasks = function() {
    return tmsTasks;
}

module.exports.clearValues = function() {
    tmsTasks.length = 0;
}

module.exports.addValidatedTmsTasksToCache = async function(tms) {
    const tmsTasks = tms.split(';');
    if (tmsTasks) {
        const tmsTasksCache = await cacheValueProvider.getValue('tms_tasks');
        for (let task of tmsTasks) {
            if (!tmsTasksCache.includes(task)) {
                this.addValidatedTmsTask(task);
                await cacheValueProvider.deleteValue('tms_tasks');
            }
        }
    }
}