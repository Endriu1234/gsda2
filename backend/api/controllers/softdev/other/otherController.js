const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');

module.exports.getDataFromSDQuery = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: '',
        records: null,
        columns: null
    };

    if (!req.query.sdQuery) {
        retVal.success = false;
        retVal.errorMessage = "Missing Query!";
    }

    if (retVal.success) {
        const queryResults = await softDevDataProvider.getSDDatafromQuery(req.query.sdQuery);

        if (queryResults) {
            const queryRows = queryResults.rows;
            const queryColumns = queryResults.metaData;

            retVal.columns = queryColumns;
            retVal.records = queryRows;
        } else {
            retVal.errorMessage = "No results.";
        }
    }

    return res.status(200).json(retVal);

}
