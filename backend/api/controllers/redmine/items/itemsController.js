const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const redmineDataProvider = require('../../../business/redmine/redmineDataProvider');
const { getRedmineAddress } = require('../../../business/redmine/tools/redmineConnectionTools');
const { createItem } = require('../../../business/redmine/itemCreator');
const cacheTmsHelper = require('../../../business/cache/cacheTmsTaskHelper');


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

    let versions = await redmineDataProvider.getRedmineVersionsByProject(req.query.redmineProject);
    versions = addEmptyVersion(versions);

    return res.status(200).json(versions);
}

module.exports.createRedmineItem = async (req, res) => {

    req.body.files = req.files;
    const retVal = await createItem(req.body);
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
                        || r.subject.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '') === item.subject.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, ''))
                    && r.description && item.description &&
                    (r.description === item.description
                        || r.description.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '') === item.description.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, ''))
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
                REDMINE_VERSION: req.query.redmine_version ? req.query.redmine_version : '',
                CR_EST_HOURS: redmineSourceItems.estimated_hours
            }
            retRecords.push(retStruct);
        }
    }

    retRecords.map((record) => {
        record.TMS ? cacheTmsHelper.addValidatedTmsTasksToCache(record.TMS) : null;
    });
    retVal.records = req.query.showCreated === 'true' ? retRecords : retRecords.filter((record) => { return record.REDMINE_LINK === null || record.REDMINE_LINK.length <= 0 });

    return res.status(200).json(retVal);
}

module.exports.saveRedmineAttachement = async (req, res) => {

    console.dir(req.body);

    return res.status(200).json(req.body);
}

function addEmptyVersion(versions /*array*/) {
    let rv = {
        id: 0,
        name: '',
        description: '',
        project: {
            id: 0,
            name: ''
        },
        status: '',
        due_date: new Date(),
        sharing: '',
        wiki_page_title: '',
        created_on: new Date(),
        updated_on: new Date(),
        currentProject: {
            id: 0,
            name: ''
        },
        wiki: ''
    };
    
    versions.unshift(rv);

    return versions;
}
