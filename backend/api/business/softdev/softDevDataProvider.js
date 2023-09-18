const cacheValueProvider = require('../cache/cacheValueProvider');
const softdevQueries = require('./queries/softdevQueries');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function executeSoftDevQuery(query, bindParams) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.SOFTDEV_DB_USER,
            password: process.env.SOFTDEV_DB_PASS,
            connectString: `${process.env.SOFTDEV_DB_HOST}:${process.env.SOFT_DEV_DB_PORT}/${process.env.SOFT_DEV_DB_SID}`
        });

        const result = await connection.execute(query, bindParams ? bindParams : []);
        return result.rows;

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports.getVersions = async () => {

    return await executeSoftDevQuery(softdevQueries.getSDActiveProjectsQuery());
};

module.exports.getTmsLocalUsers = async () => {

    return await executeSoftDevQuery(softdevQueries.getTmsLocalUsersQuery());
}

module.exports.getTmsClients = async () => {

    return await executeSoftDevQuery(softdevQueries.getTmsClientsQuery());
}

module.exports.getRegressionsFromVersion = async (softDevProjectName) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const project = softDevProjects.find(p => p.PRODUCT_VERSION_NAME === softDevProjectName);

    if (project) {
        return await executeSoftDevQuery(softdevQueries.getSDRegressionQuery(project.PRODUCT_VERSION_NAME.endsWith('_Packet')), [project.PRODUCT_VERSION_ID]);
    }
}

module.exports.getSDProjectPotentialRedmineItems = async (softDevProjectName, targetRedmineProject, itemLevel) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const project = softDevProjects.find(p => p.PROJECT_NAME === softDevProjectName);
    
    if (project) {
        if (itemLevel === 'issue')
            return await executeSoftDevQuery(softdevQueries.getSDProjectPotentialRedmineItemsByIssueQuery(project.PRODUCT_VERSION_NAME.endsWith('_Packet')), [targetRedmineProject, project.PRODUCT_VERSION_ID]);
        else if (itemLevel === 'cr')
            return await executeSoftDevQuery(softdevQueries.getSDProjectPotentialRedmineItemsByCrQuery(project.PRODUCT_VERSION_NAME.endsWith('_Packet')), [targetRedmineProject, project.PRODUCT_VERSION_ID]);
        else
            return await executeSoftDevQuery(softdevQueries.getSDProjectPotentialRedmineItemsByPossibleCrQuery(project.PRODUCT_VERSION_NAME.endsWith('_Packet')), [targetRedmineProject, project.PRODUCT_VERSION_ID]);
    }
}

module.exports.getTMSProjectPotentialRedmineItems = async (iTMSClient, targetRedmineProject, showClosed, showInClientBin, fromDate, toDate, TmsUser) => {

    return await executeSoftDevQuery(softdevQueries.getTmsProjectPotentialRedmineItems(showClosed, showInClientBin), [targetRedmineProject, iTMSClient, fromDate, toDate, TmsUser]);
}

module.exports.isChangeRequestInDB = async (changeRequest) => {
    return await executeSoftDevQuery(softdevQueries.getCRValidationQuery(), [changeRequest]);
}

module.exports.isIssueInDB = async (issue) => {
    return await executeSoftDevQuery(softdevQueries.getIssueValidationQuery(), [issue]);
}

module.exports.isTmsInDB = async (tms) => {
    let tmsTable = tms.split("-");

    return await executeSoftDevQuery(softdevQueries.getTmsValidationQuery(), [tmsTable.at(0), tmsTable.at(1)]);
}

module.exports.isTmsClientInDB = async (tms) => {

    return await executeSoftDevQuery(softdevQueries.getTmsClientValidationQuery(), [tms]);
}

module.exports.getItemById = async (id) => {
    if (id) {
        if (id.startsWith('ISS')) {
            return await executeSoftDevQuery(softdevQueries.getItemDataByIssue(), [id]);
        }

        if (id.startsWith('CR')) {
            return await executeSoftDevQuery(softdevQueries.getItemDataByCR(), [id]);
        }

        let tmsTable = id.split("-");
        return await executeSoftDevQuery(softdevQueries.getItemDataByTms(), [tmsTable.at(0), tmsTable.at(1)]);
    }
}

module.exports.getTmsLoginByName = async (name) => {
    const users = await cacheValueProvider.getValue('tms_users');
    const user = users.find(u => u.NAME === name);

    return user ? user.TMS_LOGIN : '';
}