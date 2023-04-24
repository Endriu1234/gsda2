const cacheValueProvider = require('../../cache/cacheValueProvider');
const softDevValidator = require('../../softdev/validation/softDevValidator');
const softDevDataProvider = require('../../softdev/softDevDataProvider');

module.exports.validateRedmineItem = async (req, res, next) => {

    if (!req.body.item) {
        req.flash('error', 'Cannot add Redmine Item. Item is missing.');
        return res.redirect(req.originalUrl);
    }

    const projects = await cacheValueProvider.getValue('redmine_projects');

    if (projects.filter(p => p.name === req.body.item.project).length == 0) {
        req.flash('error', 'Cannot add Redmine Item. Project is required.');
        return res.redirect(req.originalUrl);
    }

    const trackers = await cacheValueProvider.getValue('redmine_trackers');

    if (trackers.filter(t => t.id === parseInt(req.body.item.tracker_id)).length == 0) {
        req.flash('error', 'Cannot add Redmine Item. No tracker provided.');
        return res.redirect(req.originalUrl);
    }

    if (!req.body.item.subject || req.body.item.subject.length === 0)
        throw new ExpressError('No proper subject provided');

    if (!req.body.item.description || req.body.item.description === 0) {
        req.flash('error', 'Cannot add Redmine Item. Description is required.');
        return res.redirect(req.originalUrl);
    }

    if (req.body.item.assignee) {
        const users = await cacheValueProvider.getValue('redmine_users');

        if (users.filter(u => u.name === req.body.item.assignee).length == 0) {
            req.flash('error', 'Cannot add Redmine Item. Wrong assignee provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.cr) {
        let isCRValid = false;
        if (softDevValidator.checkCRMatchPattern(req.body.item.cr.trim().toUpperCase())) {
            let isCRInDb = await softDevDataProvider.isChangeRequestInDB(req.body.item.cr.trim().toUpperCase());
            if (isCRInDb && isCRInDb.length > 0 && isCRInDb[0].EXISTENCE === 1)
                isCRValid = true;
        }
        
        if (!isCRValid) {
            req.flash('error', 'Cannot add Redmine Item. No proper CR provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.issue) {
        let isValid = false;
        if (softDevValidator.checkIssueMatchPattern(req.body.item.issue.trim())) {
            let isIssueInDb = await softDevDataProvider.isChangeRequestInDB(req.body.item.issue.trim().toUpperCase());
            if (isIssueInDb && isIssueInDb.length > 0 && isIssueInDb[0].EXISTENCE === 1)
                isValid = true;
        }
        if (!isValid) {
            req.flash('error', 'Cannot add Redmine Item. No proper Issue provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.tms) {
        let isValid = false;
        if (softDevValidator.checkTmsMatchPattern(req.body.item.tms.trim())) {
            let isTmsInDb = await softDevDataProvider.isChangeRequestInDB(req.body.item.tms.trim().toUpperCase());
            if (isTmsInDb && isTmsInDb.length > 0 && isTmsInDb[0].EXISTENCE === 1)
                isValid = true;
        }
        if (!isValid) {
            req.flash('error', 'Cannot add Redmine Item. No proper TMS provided.');
            return res.redirect(req.originalUrl);
        }
    }

    next();
}