const cacheValueProvider = require('../cache/cacheValueProvider');
const softdevQueries = require('./queries/softdevQueries');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function executeSoftDevQuery(query) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.SOFTDEV_DB_USER,
            password: process.env.SOFTDEV_DB_PASS,
            connectString: `${process.env.SOFTDEV_DB_HOST}:${process.env.SOFT_DEV_DB_PORT}/${process.env.SOFT_DEV_DB_SID}`
        });

        const result = await connection.execute(query);
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

module.exports.getRegressionsFromVersion = async (softDevProjectName) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const project = softDevProjects.find(p => p.PRODUCT_VERSION_NAME === softDevProjectName);

    if (project) {
        return await executeSoftDevQuery(softdevQueries.getSDRegressionQuery(project.PRODUCT_VERSION_NAME.endsWith('_Packet'), project.PRODUCT_VERSION_ID));
    }
}

module.exports.isChangeRequestInDB = async (changeRequest) => {
    return await executeSoftDevQuery(softdevQueries.getCRValidationQuery(changeRequest));
}

module.exports.isIssueInDB = async (issue) => {
    return await executeSoftDevQuery(softdevQueries.getIssueValidationQuery(issue));
}

module.exports.isTmsInDB = async (tms) => {
    let tmsTable = tms.split("-");
    
    return await executeSoftDevQuery(softdevQueries.getTmsValidationQuery(tmsTable.at(0), tmsTable.at(1)));
}