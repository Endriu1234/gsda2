const cacheValueProvider = require('../../cache/cacheValueProvider');
const redmineDataProvider = require('../redmineDataProvider');

module.exports.convertFormItemObjectToJSON = async function convertFormItemObjectToJSON(formItem) {

    const redmineItem = { issue: {} };

    const projects = await cacheValueProvider.getValue('redmine_projects');
    const project = projects.find(p => p.name === formItem.project);
    redmineItem.issue.project_id = project.id;

    if (formItem.version) {
        const versions = await redmineDataProvider.getRedmineVersionsByProject(formItem.project);
        const version = versions.find(v => v.name === formItem.version);
        redmineItem.issue.fixed_version_id = version.id;

        const devProjects = await cacheValueProvider.getValue('softdev_projects');
        const devProject = devProjects.find(p => p.PRODUCT_VERSION_NAME === formItem.version);
        if (devProject) {
            let tmpDate = new Date(devProject.PRODUCT_DEV_START);
            redmineItem.issue.start_date = new Date(tmpDate.getTime() - (tmpDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
            tmpDate = new Date(devProject.PRODUCT_DEV_END);
            redmineItem.issue.due_date = new Date(tmpDate.getTime() - (tmpDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
        }
    }

    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    const tracker = trackers.find(t => t.name === formItem.tracker);
    redmineItem.issue.tracker_id = parseInt(tracker.id);

    redmineItem.issue.subject = formItem.subject;
    redmineItem.issue.description = formItem.description;

    if (formItem.user) {
        const users = await cacheValueProvider.getValue('redmine_users');
        const user = users.find(u => u.name === formItem.user);
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

    if (formItem.est_time) {
        redmineItem.issue.estimated_hours = formItem.est_time;
    }

    if (custom_fields.length > 0)
        redmineItem.issue.custom_fields = custom_fields;

    if (formItem && formItem.files && formItem.files.length > 0) {

        redmineItem.issue.uploads = [];

        for (const file of formItem.files) {
            redmineItem.issue.uploads.push({
                token: file.token,
                filename: file.originalname,
                content_type: file.mimetype
            });
        }
    }

    return redmineItem;
}