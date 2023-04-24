const softDevValidator = require('../../../business/softdev/validation/softDevValidator');
const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');

module.exports.checkCR = async (req, res) => {
    const retVal = {};
    retVal.cr = req.query.cr;
    retVal.valid = false;

    if (req.query.cr && softDevValidator.checkCRMatchPattern(req.query.cr)) {
        let isCRInDb = await softDevDataProvider.isChangeRequestInDB(req.query.cr.toUpperCase());
        if (isCRInDb && isCRInDb.length > 0 && isCRInDb[0].EXISTENCE === 1)
            retVal.valid = true;
    }

    return res.status(200).json(retVal);
}