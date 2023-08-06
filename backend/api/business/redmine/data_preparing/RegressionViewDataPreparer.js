const cacheValueProvider = require('../../cache/cacheValueProvider');
const { getRedmineData, getRedmineAddress } = require('../tools/redmineConnectionTools');
const redmineDataProvider = require('../redmineDataProvider');


class RegressionViewDataPreparer {

    constructor(softDevProjectIssues, redmineProject, displayCreated) {
        this.softDevProjectIssues = softDevProjectIssues;
        this.redmineProject = redmineProject;
        this.displayCreated = displayCreated;
    }

    async prepare() {

        let itemsPerIssue = await redmineDataProvider.getRedmineItemsPerIssues(this.redmineProject);

        if (itemsPerIssue) {
            if (this.displayCreated === 'true') {
                for (const softDevIssue of this.softDevProjectIssues) {
                    if (itemsPerIssue[softDevIssue.ISSUE_ID] !== undefined)
                        softDevIssue.REDMINE_LINK = `${getRedmineAddress(`issues/${itemsPerIssue[softDevIssue.ISSUE_ID][0].id}`)}`;
                }
            }
            else {
                this.softDevProjectIssues = this.softDevProjectIssues.filter(softDevIssue => itemsPerIssue[softDevIssue.ISSUE_ID] === undefined);
            }
        }

        return this.softDevProjectIssues;
    }
}

module.exports = RegressionViewDataPreparer;
