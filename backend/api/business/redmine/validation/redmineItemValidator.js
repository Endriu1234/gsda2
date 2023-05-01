const cacheValueProvider = require('../../cache/cacheValueProvider');
const softDevValidator = require('../../softdev/validation/softDevValidator');
const softDevDataProvider = require('../../softdev/softDevDataProvider');

module.exports.validateRedmineItem = async (item) => {

    const retVal = {
        isValid: true,
        errorMsg: ''
    };

    if (!item) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Item. Item is missing.';
        return retVal;
    }

    const projects = await cacheValueProvider.getValue('redmine_projects');

    if (projects.filter(p => p.name === item.project).length == 0) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Item. Project is required.';
        return retVal;
    }

    const trackers = await cacheValueProvider.getValue('redmine_trackers');

    if (trackers.filter(t => t.name === item.tracker).length == 0) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Item. No tracker provided.';
        return retVal;
    }

    if (!item.subject || item.subject.length === 0) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Item. No tracker provided.';
        return retVal;
    }


    if (!item.description || item.description === 0) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Item. Description is required.';
        return retVal;
    }

    if (item.assignee) {
        const users = await cacheValueProvider.getValue('redmine_users');

        if (users.filter(u => u.name === item.assignee).length == 0) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. Wrong assignee provided.';
            return retVal;
        }
    }

    if (item.cr) {
        let isCRValid = false;
        if (softDevValidator.checkCRMatchPattern(item.cr.trim().toUpperCase())) {
            let isCRInDb = await softDevDataProvider.isChangeRequestInDB(item.cr.trim().toUpperCase());
            if (isCRInDb && isCRInDb.length > 0 && isCRInDb[0].EXISTENCE === 1)
                isCRValid = true;
        }

        if (!isCRValid) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. No proper CR provided.';
            return retVal;
        }
    }

    if (item.issue) {
        let isValid = false;
        if (softDevValidator.checkIssueMatchPattern(item.issue.trim())) {
            let isIssueInDb = await softDevDataProvider.isChangeRequestInDB(item.issue.trim().toUpperCase());
            if (isIssueInDb && isIssueInDb.length > 0 && isIssueInDb[0].EXISTENCE === 1)
                isValid = true;
        }
        if (!isValid) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. No proper Issue provided.';
            return retVal;
        }
    }

    if (item.tms) {
        let isValid = false;
        if (softDevValidator.checkTmsMatchPattern(item.tms.trim())) {
            let isTmsInDb = await softDevDataProvider.isChangeRequestInDB(item.tms.trim().toUpperCase());
            if (isTmsInDb && isTmsInDb.length > 0 && isTmsInDb[0].EXISTENCE === 1)
                isValid = true;
        }
        if (!isValid) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. No proper TMS provided.';
            return retVal;
        }
    }

    return retVal;
}