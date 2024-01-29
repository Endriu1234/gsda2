const redmineProjectValidator = require('../../../business/redmine/validation/redmineProjectValidator');
const cacheValueProvider = require('../../../business/cache/cacheValueProvider');
const { convertFormProjectObjectToJSON, convertFormVersionObjectToJSON } = require('../../../business/redmine/tools/formProjectObjectToJSONConverter');
const { convertFormProjectWikiObjectToJSON} = require('../../../business/redmine/tools/formProjectWikiObjectToJSONConverter');
const { postRedmineJsonData, getRedmineAddress, getRedmineData, putRedmineJsonData } = require('../../../business/redmine/tools/redmineConnectionTools');
const redmineDataProvider = require('../../../business/redmine/redmineDataProvider');

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
        const result = await postRedmineJsonData('projects.json', projectJson);

        if (result.success) {
            retVal.redmineLink = `${getRedmineAddress(`projects/${result.redmineResponse.data.project.id}`)}`;
            const wikiJson = await convertFormProjectWikiObjectToJSON(req.body);
            let wikiResult = await putRedmineJsonData(`projects/${result.redmineResponse.data.project.identifier}/wiki/wiki.json`, wikiJson);

            if (!wikiResult.success) {
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

module.exports.createRedmineVersion = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };
    
    const validationResult = await redmineProjectValidator.validateRedmineVersion(req.body);

    if (validationResult.isValid) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.filter(p => p.name === req.body.redmine_project);
        const versionJson = await convertFormVersionObjectToJSON(req.body);
        const result = await postRedmineJsonData(`projects/${project[0].id}/versions.json`, versionJson);

        if (result.success) {
            retVal.redmineLink = `${getRedmineAddress(`versions/${result.redmineResponse.data.version.id}`)}`;
            if (req.body.wiki_title && req.body.wiki_title.length > 0) {
                const wikiJson = await convertFormProjectWikiObjectToJSON(req.body);
                let wikiResult = await putRedmineJsonData(`projects/${project[0].id}/wiki/${req.body.wiki_title}.json`, wikiJson);

                if (!wikiResult.success) {
                    retVal.errorMessage = 'Redmine Version was created but without wiki. Something went wrong!';
                }
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Redmine Version not created. Save failed.';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return res.status(200).json(retVal);
}

module.exports.updateRedmineVersion = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };
    
    const validationResult = await redmineProjectValidator.validateRedmineVersion(req.body);

    if (validationResult.isValid) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.filter(p => p.name === req.body.redmine_project);
        const versions = await redmineDataProvider.getRedmineVersionsByProject(req.body.redmine_project);
        const version = versions.filter(v => v.name === req.body.name);
        const versionJson = await convertFormVersionObjectToJSON(req.body);
        const result = await putRedmineJsonData(`versions/${version[0].id}.json`, versionJson);

        if (result.success) {
            retVal.redmineLink = `${getRedmineAddress(`versions/${version[0].id}`)}`;
            if (req.body.wiki_title && req.body.wiki_title.length > 0) {
                const wikiJson = await convertFormProjectWikiObjectToJSON(req.body);
                                let wikiResult = await putRedmineJsonData(`projects/${project[0].id}/wiki/${req.body.wiki_title}.json`, wikiJson);

                if (!wikiResult.success) {
                    retVal.errorMessage = 'Redmine Version was updated but without wiki. Something went wrong!';
                }

                await cacheValueProvider.deleteValue('redmine_versions');
            }
        }
        else {
            retVal.success = false;
            retVal.errorMessage = 'Redmine Version not updated. Save failed.';
        }
    }
    else {
        retVal.success = false;
        retVal.errorMessage = validationResult.errorMsg;
    }

    return res.status(200).json(retVal);
}


