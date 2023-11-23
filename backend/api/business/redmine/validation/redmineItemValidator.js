const cacheValueProvider = require('../../cache/cacheValueProvider');
const softDevValidator = require('../../softdev/validation/softDevValidator');
const softDevDataProvider = require('../../softdev/softDevDataProvider');
const redmineDataProvider = require('../redmineDataProvider');

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

    if (item.version) {
        const versions = await redmineDataProvider.getRedmineVersionsByProject(item.project);
        if (versions.filter(v => v.name === item.version).length == 0) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. Version is incorrect.';
            return retVal;
        }
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

    if (item.user) {
        const users = await cacheValueProvider.getValue('redmine_users');

        if (users.filter(u => u.name === item.user).length == 0) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. Wrong user provided.';
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
            let isIssueInDb = await softDevDataProvider.isIssueInDB(item.issue.trim().toUpperCase());

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
            isValid = await softDevValidator.checkTmsTasksExistanceInDb(item.tms.trim().toUpperCase());
        }
        if (!isValid) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Item. No proper TMS provided.';
            return retVal;
        }
    }

    if (item.uploads) {

        if (item.uploads.length === 0) {
            retVal.isValid = false;
            retVal.errorMsg = 'No attachments were provided';
            return retVal;
        }

        for (const attachment of item.uploads) {

            if (!attachment.content_type || attachment.content_type.length === 0) {
                retVal.isValid = false;
                retVal.errorMsg = 'There is an attachment w/o content type';
                return retVal;
            }

            if (!attachment.filename || attachment.filename.length === 0) {
                retVal.isValid = false;
                retVal.errorMsg = 'There is an attachment w/o file name';
                return retVal;
            }

            if (!attachment.content) {
                retVal.isValid = false;
                retVal.errorMsg = 'There is an attachment w/o content';
                return retVal;
            }
        }
    }

    return retVal;
}