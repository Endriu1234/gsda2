const redmineItemValidator = require('./validation/redmineItemValidator');
const { convertFormItemObjectToJSON } = require('./tools/formItemObjectToJSONConverter');
const { postRedmineJsonData, postFiles, getRedmineAddress } = require('./tools/redmineConnectionTools');

module.exports.createItem = async function (values) {

    const retVal = {
        success: true,
        errorMessage: ''
    };

    const validationResult = await redmineItemValidator.validateRedmineItem(values);

    if (validationResult.isValid) {

        if (values.uploads) {
            const fileResult = await postFiles(values.uploads);

            if (!fileResult.success)
                values.uploads = null;
        }
        const itemJson = await convertFormItemObjectToJSON(values);
        console.log('dane do wyslania:');
        console.dir(itemJson);
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