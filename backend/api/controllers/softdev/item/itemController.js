const { errorMonitor } = require('node-cache');
const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');
const redmineDataProvider = require('../../../business/redmine/redmineDataProvider')
const { getRedmineAddress } = require('../../../business/redmine/tools/redmineConnectionTools');
const cacheTmsHelper = require('../../../business/cache/cacheTmsTaskHelper');

module.exports.getItemById = async (req, res) => {
    const retVal = {};

    if (req.query.id) {
        let item = await softDevDataProvider.getItemById(req.query.id.toUpperCase());
        if (item && item.length > 0) {
            retVal.cr_id = item[0].CR_ID;
            retVal.issue_id = item[0].ISSUE_ID;
            retVal.tms_id = item[0].TMS_ID;
            retVal.item_summary = item[0].ITEM_SUMMARY;
            retVal.item_description = item[0].ITEM_DESCRIPTION;
        }
    }

    return res.status(200).json(retVal);
}

module.exports.getPotentialRedmineItemsFromSDProject = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    if (!req.query.sourceSoftDevProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing sourceSoftDevProject";
    }

    if (!req.query.targetRedmineProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing targetRedmineProject";
    }

    if (!req.query.itemLevel) {
        retVal.success = false;
        retVal.errorMessage = "Missing itemLevel";
    }

    const redmineVersion = req.query.redmine_version ? req.query.redmine_version : '';
    const queryResults = await softDevDataProvider.getSDProjectPotentialRedmineItems(req.query.sourceSoftDevProject, req.query.targetRedmineProject, redmineVersion, req.query.itemLevel);
    const redmineItems = (req.query.itemLevel === 'issue') ? await redmineDataProvider.getRedmineItemsPerIssues(req.query.targetRedmineProject, false) : await redmineDataProvider.getRedmineItemsFromProject(req.query.targetRedmineProject, false);
    
    if (redmineItems) {
        if (!(req.query.itemLevel === 'cr')) {
            for (const softDevRecord of queryResults) {
                if (redmineItems[softDevRecord.ISSUE] !== undefined
                    && (redmineItems[softDevRecord.ISSUE][0].subject === softDevRecord.SUBJECT 
                        || redmineItems[softDevRecord.ISSUE][0].subject.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'') === softDevRecord.SUBJECT.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''))
                    && (redmineItems[softDevRecord.ISSUE][0].description === softDevRecord.DESCRIPTION
                        || redmineItems[softDevRecord.ISSUE][0].description.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'') === softDevRecord.DESCRIPTION.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''))) {
                    
                    softDevRecord.REDMINE_LINK = `${getRedmineAddress(`issues/${redmineItems[softDevRecord.ISSUE][0].id}`)}`;
                    softDevRecord.SELECTED = false;
                }
            }
        } else {
            for (const softDevRecord of queryResults) {
                let target = redmineItems.issues.find((r) => {
                    return redmineDataProvider.getCustomFieldValue(r, process.env.REDMINE_CR_NAME) === softDevRecord.CR;
                });

                if (target) {
                    softDevRecord.REDMINE_LINK = `${getRedmineAddress(`issues/${target.id}`)}`;
                    softDevRecord.SELECTED = false;
                }
            }
        }
    }

    queryResults.map((record) => {
        record.TMS ? cacheTmsHelper.addValidatedTmsTasksToCache(record.TMS) : null;
    });
    retVal.records = req.query.showCreated === 'true' ? queryResults : queryResults.filter((record) => { return record.REDMINE_LINK === null || record.REDMINE_LINK.length <= 0 });

    return res.status(200).json(retVal);

}

module.exports.getPotentialRedmineItemsFromIds = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    if (!req.query.AllIds) {
        retVal.success = false;
        retVal.errorMessage = "Missing Ids";
    }

    if (!req.query.targetRedmineProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing targetRedmineProject";
    }

    let error = '';
    const tmpIds = req.query.AllIds.replace(/\s/g,';').replace(/\|/g,';').replace(/,/g,';').replace(/(;)\1+/g,';');
    const tblIds = tmpIds.split(';');
    let tblIssues = [];
    let tblCrs = [];
    let tblTms = [];

    for (let id of tblIds) {
        if (id && id.length > 0) {
            if (id.startsWith('ISS')) {
                if (!new RegExp("^(I|i)(S|s)(S|s)-[a-zA-Z]+-\\d{1,6}[a-zA-Z]{2}$").test(id)) { error = 'One of the issues is incorrect'; break; };
                tblIssues.push(id);
            } else if (id.startsWith('CR')) {
                if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(id)) { error = 'One of the CRs is incorrect'; break; };
                tblCrs.push(id);
            } else {
                if (!new RegExp("^[a-zA-Z0-9]+-\\d{5}$").test(id)) { error = 'One of the TMS tasks is incorrect'; break; };
                tblTms.push(id);
            }
        }
    }

    if (error.length > 0) {
        retVal.success = false;
        retVal.errorMessage = error;
    }

    const redmineItems = await redmineDataProvider.getRedmineItemsFromProject(req.query.targetRedmineProject, false);
    const redmineVersion = req.query.redmine_version ? req.query.redmine_version : '';
    let queryResults = [];

    if (tblCrs.length > 0) {
        const crsQueryResults = await softDevDataProvider.getIdsByCrsPotentialRedmineItems(tblCrs, req.query.targetRedmineProject, redmineVersion);

        for (const softDevRecord of crsQueryResults) {
            let target = redmineItems.issues.find((r) => {
                return redmineDataProvider.getCustomFieldValue(r, process.env.REDMINE_CR_NAME) === softDevRecord.CR
            });

            if (target) {
                softDevRecord.REDMINE_LINK = `${getRedmineAddress(`issues/${target.id}`)}`;
                softDevRecord.SELECTED = false;
            }
        }

        queryResults.push(...crsQueryResults);
    }
    if (tblIssues.length > 0) {
        const issQueryResults = await softDevDataProvider.getIdsByIssuesPotentialRedmineItems(tblIssues, req.query.targetRedmineProject, redmineVersion);

        for (const softDevRecord of issQueryResults) {
            let target = redmineItems.issues.find((r) => {
                return redmineDataProvider.getCustomFieldValue(r, process.env.REDMINE_ISSUE_NAME) === softDevRecord.ISSUE;
            });
            
            if (target) {
                softDevRecord.REDMINE_LINK = `${getRedmineAddress(`issues/${target.id}`)}`;
                softDevRecord.SELECTED = false;
            }
        }

        queryResults.push(...issQueryResults);
    }
    if (tblTms.length > 0) {
        const tmsQueryResults = await softDevDataProvider.getIdsByTmsTasksPotentialRedmineItems(tblTms, req.query.targetRedmineProject, redmineVersion);

        for (const softDevRecord of tmsQueryResults) {
            let target = redmineItems.issues.find((r) => {
                return redmineDataProvider.getCustomFieldValue(r, process.env.REDMINE_TMS_TASK_NAME) === softDevRecord.TMS
            });

            if (target) {
                softDevRecord.REDMINE_LINK = `${getRedmineAddress(`issues/${target.id}`)}`;
                softDevRecord.SELECTED = false;
            }
        }

        queryResults.push(...tmsQueryResults);
    }

    queryResults.map((record) => {
        record.TMS ? cacheTmsHelper.addValidatedTmsTasksToCache(record.TMS) : null;
    });
    retVal.records = req.query.showCreated === 'true' ? queryResults : queryResults.filter((record) => { return record.REDMINE_LINK === null || record.REDMINE_LINK.length <= 0 });
    
    return res.status(200).json(retVal);

}

