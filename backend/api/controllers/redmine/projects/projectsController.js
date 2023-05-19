const redmineProjectValidator = require('../../../business/redmine/validation/redmineProjectValidator');
const { convertFormProjectObjectToJSON} = require('../../../business/redmine/tools/formProjectObjectToJSONConverter');
const { convertFormProjectWikiObjectToJSON} = require('../../../business/redmine/tools/formProjectWikiObjectToJSONConverter');
const { postRedmineJsonData, getRedmineAddress, getRedmineData, putRedmineJsonData } = require('../../../business/redmine/tools/redmineConnectionTools');

module.exports.checkIdentifier = async (req, res) => {
    const retVal = {};
    retVal.identifier = req.query.identifier;
    retVal.valid = false;
    
    const rmIdentifier = await getRedmineData(`projects/${req.query.identifier}.json`, false);
    
    if (!rmIdentifier) {
        retVal.valid = true;
    }

    return res.status(200).json(retVal);
}

module.exports.createRedmineProject = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    const validationResult = await redmineProjectValidator.validateRedmineProject(req.body);

    if (validationResult.isValid) {
        const projectJson = await convertFormProjectObjectToJSON(req.body);
        let result = await postRedmineJsonData('projects.json', projectJson);

        if (result.success) {
            retVal.redmineLink = `${getRedmineAddress(`projects/${result.redmineResponse.data.project.id}`)}`;
            const wikiJson = await convertFormProjectWikiObjectToJSON(req.body);
            result = await putRedmineJsonData(`projects/${result.redmineResponse.data.project.identifier}/wiki/wiki.json`, wikiJson);

            if (!result) {
                retVal.errorMessage = 'Redmine Project was created but without wiki. Something went wrong!';
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Redmine Project not created. Save failed.';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return res.status(200).json(retVal);
}


