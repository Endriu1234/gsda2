const softDevValidator = require('../../../business/softdev/validation/softDevValidator');
const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');

module.exports.checkIssue = async (req, res) => {
    const retVal = {};
    retVal.issue = req.query.issue;
    retVal.valid = false;

    if (req.query.issue && softDevValidator.checkIssueMatchPattern(req.query.issue)) {
        let isIssueInDb = await softDevDataProvider.isIssueInDB(req.query.issue);
        if (isIssueInDb && isIssueInDb.length > 0 && isIssueInDb[0].EXISTENCE === 1)
            retVal.valid = true;
    }

    return res.status(200).json(retVal);
}