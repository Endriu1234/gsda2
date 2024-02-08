const redmineItemValidator = require('./validation/redmineItemValidator');
const { convertFormItemObjectToJSON } = require('./tools/formItemObjectToJSONConverter');
const { postRedmineJsonData, postFiles, getRedmineAddress, deleteFile } = require('./tools/redmineConnectionTools');

module.exports.createItem = async function (values) {

    const retVal = {
        success: true,
        errorMessage: ''
    };

    const validationResult = await redmineItemValidator.validateRedmineItem(values);

    if (validationResult.isValid) {

        if (values.files && values.files.length > 0) {
            const fileResult = await postFiles(values.files);

            if (!fileResult.success)
                values.files = null;
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
        if (values.files && values.files.length > 0) {
            for (const file of values.files) {
                await deleteFile(file.path);
            }
        }
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return retVal;
}