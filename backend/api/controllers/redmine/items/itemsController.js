const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const redmineItemValidator = require('../../../business/redmine/validation/redmineItemValidator');
const redmineDataProvider = require('../../../business/redmine/redmineDataProvider');
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

module.exports.getRedmineVersions = async (req, res) => {
    
    if (!req.query.redmineProject) {
        return res.status(402).json('Error');
    }

    const versions = await redmineDataProvider.getRedmineVersionsByProject(req.query.redmineProject);

    return res.status(200).json(versions);
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
}

module.exports.getPotentialRedmineItemsFromRedmineProject = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    if (!req.query.sourceRedmineProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing sourceRedmineProject";
    }

    if (!req.query.targetRedmineProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing targetRedmineProject";
    }
    
    let retRecords = [];

    const showClosed = req.query.showClosed === 'true';
    const redmineTargetItems = await redmineDataProvider.getRedmineItemsFromProject(req.query.targetRedmineProject, false);
    const redmineSourceItems = await redmineDataProvider.getRedmineItemsFromProject(req.query.sourceRedmineProject, !showClosed);
    
    if (redmineSourceItems && redmineSourceItems.issues) {
        for (const item of redmineSourceItems.issues) {
            let target = redmineTargetItems.issues.find((r) => {
                return r.subject && item.subject && 
                (r.subject === item.subject 
                    || r.subject.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'') === item.subject.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''))
                && r.description && item.description &&
                (r.description === item.description
                    || r.description.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'') === item.description.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''))
            })
            let retStruct = {
                SELECTED: target ? false : true,
                REDMINE_PROJECT: req.query.targetRedmineProject,
                TRACKER: item.tracker ? item.tracker.name : '',
                STATUS: item.status ? item.status.name : '',
                SUBJECT: item.subject,
                DESCRIPTION: item.description,
                ISSUE: redmineDataProvider.getCustomFieldValue(item, process.env.REDMINE_ISSUE_NAME),
                CR: redmineDataProvider.getCustomFieldValue(item, process.env.REDMINE_CR_NAME),
                TMS: redmineDataProvider.getCustomFieldValue(item, process.env.REDMINE_TMS_TASK_NAME),
                ASSIGNEE: item.assigned_to ? item.assigned_to.name : '',
                REDMINE_LINK: target ? `${getRedmineAddress(`issues/${target.id}`)}` : '',
                REDMINE_VERSION: req.query.redmine_version ? req.query.redmine_version : ''
            }
            retRecords.push(retStruct);
        }
    }
    
    retVal.records = req.query.showCreated === 'true' ? retRecords : retRecords.filter((record) => { return record.REDMINE_LINK === null || record.REDMINE_LINK.length <= 0 });

    return res.status(200).json(retVal);
}
