const softDevValidator = require('../../../business/softdev/validation/softDevValidator');
const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');

module.exports.checkTms = async (req, res) => {
    const retVal = {};
    retVal.tms = req.query.tms;
    retVal.valid = false;

    if (req.query.tms && softDevValidator.checkTmsMatchPattern(req.query.tms)) {
        let isTmsInDb = await softDevDataProvider.isTmsInDB(req.query.tms);
        if (isTmsInDb && isTmsInDb.length > 0 && isTmsInDb[0].EXISTENCE === 1)
            retVal.valid = true;
    }

    return res.status(200).json(retVal);
}