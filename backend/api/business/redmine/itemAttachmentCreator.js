const redmineItemValidator = require('./validation/redmineItemValidator');
const { convertFormItemObjectToJSON } = require('./tools/formItemObjectToJSONConverter');
const { postRedmineJsonData, postFiles, getRedmineAddress, deleteFile } = require('./tools/redmineConnectionTools');

module.exports.attachToItem = async function (itemId, files) {

    const retVal = {
        success: true,
        errorMessage: ''
    };

    const validationResult = {};

    await redmineItemValidator.validateFiles(validationResult, files, true);

    if (validationResult.isValid) {

        const fileResult = await postFiles(files);

        if (fileResult.success) {

        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Files update failed'
        }



        const itemJson = await convertFormItemObjectToJSON(values);
        const result = await postRedmineJsonData('issues.json', itemJson);

        if (!result.success) {
            retVal.success = false;
            retVal.errorMessage = 'Redmine Item not created. Save failed.';
        }
        else
            retVal.redmineLink = `${getRedmineAddress(`issues/${result.redmineResponse.data.issue.id}`)}`;
    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return retVal;
}