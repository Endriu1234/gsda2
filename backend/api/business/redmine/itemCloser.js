const cacheValueProvider = require('../cache/cacheValueProvider');
const { putRedmineJsonData } = require('./tools/redmineConnectionTools');

module.exports.closeItems = async function (items) {
    const retVal = {
        success: true,
        errorMessage: ''
    }

    if (items && items.length > 0) {
        const issue_statuses = await cacheValueProvider.getValue('redmine_issue_statuses');
        const closedStatus = issue_statuses.find((i) => i.name === process.env.REDMINE_ISSUE_CLOSED_STATE);

        if (closedStatus) {

            const data = {
                issue: {
                    status_id: parseInt(closedStatus.id)
                }
            }

            for (const itemId of items) {
                const attachResult = await putRedmineJsonData(`issues/${itemId}`, data, true);

                if (!attachResult.success) {
                    retVal.success = false;
                    retVal.errorMessage = `Problem with closing item ${itemId}`;
                }
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Closed status not found';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'Items to close not provided';
    }

    return retVal;
}