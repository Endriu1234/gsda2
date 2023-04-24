const softDevDataProvider = require('../../../business/softdev/softDevDataProvider');

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