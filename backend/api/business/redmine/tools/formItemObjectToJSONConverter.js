const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.convertFormItemObjectToJSON = async function convertFormItemObjectToJSON(formItem) {

    const projects = await cacheValueProvider.getValue('redmine_projects');

    const redmineItem = { issue: {} };

    const project = projects.find(p => p.name === formItem.project);
    redmineItem.issue.project_id = project.id;
    redmineItem.issue.tracker_id = parseInt(formItem.tracker_id);
    redmineItem.issue.subject = formItem.subject;
    redmineItem.issue.description = formItem.description;

    if (formItem.assignee) {
        const users = await cacheValueProvider.getValue('redmine_users');
        const user = users.find(u => u.name === formItem.assignee);
        redmineItem.issue.assigned_to_id = user.id;
    }

    const customFields = await cacheValueProvider.getValue('redmine_custom_fields');
    const custom_fields = [];

    if (process.env.REDMINE_TMS_TASK_NAME && formItem.tms) {
        const tmsCustomField = customFields.find((i) => i.name === process.env.REDMINE_TMS_TASK_NAME);

        if (tmsCustomField)
            custom_fields.push({ id: tmsCustomField.id, value: formItem.tms });
    }

    if (process.env.REDMINE_CR_NAME && formItem.cr) {
        const crCustomField = customFields.find((i) => i.name === process.env.REDMINE_CR_NAME);

        if (crCustomField)
            custom_fields.push({ id: crCustomField.id, value: formItem.cr });
    }

    if (process.env.REDMINE_ISSUE_NAME && formItem.issue) {
        const issueCustomField = customFields.find((i) => i.name === process.env.REDMINE_ISSUE_NAME);

        if (issueCustomField)
            custom_fields.push({ id: issueCustomField.id, value: formItem.issue });
    }

    if (custom_fields.length > 0)
        redmineItem.issue.custom_fields = custom_fields;

    return JSON.stringify(redmineItem);
}