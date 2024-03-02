const cacheValueProvider = require('../cache/cacheValueProvider');

module.exports.validateEmailAlias = async function (body) {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    if (body.values) {
        const trackers = await cacheValueProvider.getValue('redmine_trackers');
        const users = await cacheValueProvider.getValue('redmine_users');
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const versions = await cacheValueProvider.getValue('redmine_versions');;


        if (!body.values.type || !(body.values.type === 'create' || body.values.type === 'attach' || body.values.type === 'both')) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Type were not provided';
        }
        else if (!body.values.parsingMode || !(body.values.parsingMode === 'plain' || body.values.parsingMode === 'plainAndHtmlAttachment' || body.values.parsingMode === 'parsedHtml')) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Parsing Mode were not provided';
        }
        else if (!body.values.hasOwnProperty('active')) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Active were not provided';
        }
        else if (body.values.type !== 'attach' && !body.values.hasOwnProperty('addAttachments')) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Add Attachments were not provided';
        }
        else if (body.values.type !== 'attach'
            && (!body.values.findIssues
                || !(body.values.findIssues === 'none'
                    || body.values.findIssues === 'latest'
                    || body.values.findIssues === 'earliest'
                    || body.values.findIssues === 'all'))) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Find Issues was not provided';
        }
        else if (body.values.type !== 'attach'
            && (!body.values.findCRs
                || !(body.values.findCRs === 'none'
                    || body.values.findCRs === 'latest'
                    || body.values.findCRs === 'earliest'
                    || body.values.findCRs === 'all'))) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Find CRs was not provided';
        }
        else if (body.values.type !== 'create'
            && (!body.values.closeItemsAfterAttach
                || !(body.values.closeItemsAfterAttach === 'none'
                    || body.values.closeItemsAfterAttach === 'latest'
                    || body.values.closeItemsAfterAttach === 'earliest'
                    || body.values.closeItemsAfterAttach === 'all'))) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Close Items After Attach was not provided';
        }
        else if (body.values.type !== 'create'
            && (!body.values.sendAttachResultTo
                || !(body.values.sendAttachResultTo === 'none'
                    || body.values.sendAttachResultTo === 'sender'
                    || body.values.sendAttachResultTo === 'all'))) {
            retVal.success = false;
            retVal.errorMessage = 'Alias Send Attach Result To was not provided';
        } else if (body.values.type !== 'attach'
            && (!body.values.tracker || trackers.filter(t => t.name === body.values.tracker).length !== 1)) {

            retVal.success = false;
            retVal.errorMessage = 'Alias Tracker was not provided';
        } else if (body.values.type !== 'attach'
            && (!body.values.tracker || !trackers.find(t => t.name === body.values.tracker))) {

            retVal.success = false;
            retVal.errorMessage = 'Alias Tracker was not provided';
        }
        else if (body.values.type !== 'attach'
            && (!body.values.user || !users.find(t => t.name === body.values.user))) {

            retVal.success = false;
            retVal.errorMessage = 'Alias User was not provided';
        }
        else if (body.values.type !== 'attach'
            && (!body.values.project || !projects.find(p => p.name === body.values.project))) {

            retVal.success = false;
            retVal.errorMessage = 'Alias Project was not provided';
        }
        else if (body.values.type !== 'attach'
            && (body.values.version && !versions.find(v => v.name === body.values.version && v.currentProject.name === body.values.project))) {

            retVal.success = false;
            retVal.errorMessage = 'Alias Version was not provided';
        }
        else if (!body.values.name) {
            const allSettings = await ItemsFromEmailsSettings.find({ name: body.values.name, type: body.values.type });

            if (body.editedSetting) {
                if (allSettings.length !== 1) {
                    retVal.success = false;
                    retVal.errorMessage = 'Edited alias name does not exist';
                }
            }
            else if (allSettings.length === 0) {
                retVal.success = false;
                retVal.errorMessage = 'Alias name alredy exist';
            }
        }

    }
    else {
        retVal.success = false;
        retVal.errorMessage = 'Alias values were not provided';
    }

    return retVal;
}