const cacheValueProvider = require('../../cache/cacheValueProvider');
const { getRedmineData } = require('../../../business/redmine/tools/redmineConnectionTools');

module.exports.validateRedmineProject = async (project) => {

    const retVal = {
        isValid: true,
        errorMsg: ''
    };

    if (!project) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Project. Project is missing.';
        return retVal;
    }

    if (!project.name || project.name === 0) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Project. Name is required.';
        return retVal;
    }

    if (!project.identifier || project.identifier === 0 || !new RegExp("^[_\\-0-9a-z]{1,100}$").test(project.identifier)) {
        retVal.isValid = false;
        retVal.errorMsg = 'Cannot add Redmine Project. Identifier is missing.';
        return retVal;
    } else {
        const rmIdentifier = await getRedmineData(`projects/${project.identifier}.json`, false);
        if (rmIdentifier) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Project. Identifier is not unique.';
            return retVal;
        }
    }

    if (project.parent_project) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        if (projects.filter(p => p.name === project.parent_project).length == 0) {
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Project. Wrong Parent Project provided.';
            return retVal;
        }
    }   
    
    if (project.inherit_public 
        && project.inherit_public.value.filter(v => v === "Inherit members").length > 0
        && !project.parent_project) {
            
            retVal.isValid = false;
            retVal.errorMsg = 'Cannot add Redmine Project. No Parent Project provided.';
            return retVal;
    }

    return retVal;
}