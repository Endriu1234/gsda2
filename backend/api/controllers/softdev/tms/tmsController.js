const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const softDevValidator = require('../../../business/softdev/validation/softDevValidator');
const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');
const redmineDataProvider = require('../../../business/redmine/redmineDataProvider');
const { getRedmineAddress } = require('../../../business/redmine/tools/redmineConnectionTools');

module.exports.checkTms = async (req, res) => {
    const retVal = {};
    retVal.tms = req.query.tms;
    retVal.valid = false;

    if (req.query.tms && softDevValidator.checkTmsMatchPattern(req.query.tms)) {
        retVal.valid = await softDevValidator.checkTmsTasksExistanceInDb(req.query.tms);
    }

    return res.status(200).json(retVal);
}

module.exports.getTmsClients = async (req, res) => {
    const tmsClients = await cacheValueProvider.getValue('tms_clients');
    return res.status(200).json(tmsClients);
}

module.exports.getPotentialRedmineItemsFromTms = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null
    };

    if (!req.query.iTMSClient) {
        retVal.success = false;
        retVal.errorMessage = "Missing iTMSClient";
    }

    if (!req.query.targetRedmineProject) {
        retVal.success = false;
        retVal.errorMessage = "Missing targetRedmineProject";
    }
    
    let retRecords = [];

    const showClosed = req.query.showClosed === 'true';
    const showCreated = req.query.showCreated === 'true';
    const showInClientBin = req.query.showInClientBin === 'true';
    let fromDate = '0001-01-01 00:00';
    let toDate = '3000-01-01 23:59';
    const tmsUserLogin = await softDevDataProvider.getTmsLoginByName(req.query.userToiTMS);
    const redmineTargetItems = await redmineDataProvider.getRedmineItemsFromProject(req.query.targetRedmineProject, false);
    const redmineVersion = req.query.redmine_version ? req.query.redmine_version : ''; 
    
    if (req.query.fromDate) {
        try {
            let tmpDate = new Date(req.query.fromDate);
            fromDate = tmpDate.toISOString().substring(0, 10) + " 00:00";
        } catch {
            fromDate = '0001-01-01 00:00';
            console.log("tmsController. Incorrect fromDate: " + req.query.fromDate);
        } 
    }

    if (req.query.toDate) {
        try {
            let tmpDate = new Date(req.query.toDate);
            toDate = tmpDate.toISOString().substring(0, 10) + " 23:59";
        } catch {
            toDate = '3000-01-01 23:59';
            console.log("tmsController. Incorrect toDate: " + req.query.fromDate);
        } 
    }

    const queryResults = await softDevDataProvider.getTMSProjectPotentialRedmineItems(req.query.iTMSClient, req.query.targetRedmineProject, showClosed, showInClientBin, fromDate, toDate, tmsUserLogin?tmsUserLogin:'', redmineVersion);

    if (queryResults && queryResults.length > 0) {
        for (let tms of queryResults) {
            let target = redmineTargetItems.issues.find((r) => {
                let tms_custom = redmineDataProvider.getCustomFieldValue(r, process.env.REDMINE_TMS_TASK_NAME);
                return tms_custom && tms_custom === tms.TMS
                    && r.description && tms.DESCRIPTION &&
                    (r.description === tms.DESCRIPTION
                        || r.description.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'') === tms.DESCRIPTION.replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''))
            })
            
            let retStruct = {
                SELECTED: target ? false : true,
                REDMINE_PROJECT: tms.REDMINE_PROJECT,
                REDMINE_VERSION: tms.REDMINE_VERSION,
                TRACKER: tms.TRACKER,
                STATUS: tms.STATUS ? tms.STATUS : '',
                SUBJECT: target ? target.subject : tms.SUBJECT,
                DESCRIPTION: tms.DESCRIPTION,
                ISSUE: tms.ISSUE,
                CR: tms.CR,
                TMS: tms.TMS,
                ASSIGNEE: await redmineDataProvider.getRedmineUserByTmsUser(tms.ASSIGNEE),
                REDMINE_LINK: target ? `${getRedmineAddress(`issues/${target.id}`)}` : ''
            }
            retRecords.push(retStruct);
        }
    }
    
    retVal.records = showCreated ? retRecords : retRecords.filter((record) => { return record.REDMINE_LINK === null || record.REDMINE_LINK.length <= 0 });
    
    return res.status(200).json(retVal);
}