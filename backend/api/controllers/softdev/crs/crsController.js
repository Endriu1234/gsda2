const softDevValidator = require('../../../business//softdev/validation/softDevValidator');

module.exports.checkCR = async (req, res) => {
    const retVal = {};
    retVal.cr = req.query.cr;
    retVal.valid = false;

    if (req.query.cr && softDevValidator.checkCRMatchPattern(req.query.cr)) {
        if (req.query.cr.includes('55'))
            retVal.valid = true;
    }


    return res.status(200).json(retVal);
}