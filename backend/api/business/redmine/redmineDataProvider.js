const cacheValueProvider = require('../cache/cacheValueProvider');
const { getRedmineData } = require('./tools/redmineConnectionTools');

module.exports.getRedmineItemsPerIssues = async (redmineProject, onlyOpen = true) => {
    const custom_fields = await cacheValueProvider.getValue('redmine_custom_fields');
    const issueCustomField = custom_fields.find((i) => i.name === process.env.REDMINE_ISSUE_NAME);
    
    if (issueCustomField) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.find(p => p.name === redmineProject);

        if (project) {
            const onlyOpenQuery = onlyOpen ? 'open' : '*'
            const currentProjectItems = await getRedmineData(`issues.json?project_id=${project.id}&status_id=${onlyOpenQuery}`, false);
            const itemsPerIssue = {};

            for (const item of currentProjectItems.issues) {
                let itemIssueField = item.custom_fields.find(c => c.id === issueCustomField.id);

                if (itemIssueField && itemIssueField.value) {
                    if (itemsPerIssue[itemIssueField.value] == undefined)
                        itemsPerIssue[itemIssueField.value] = [item];
                    else
                        itemsPerIssue[itemIssueField.value].push(item);
                }
            }

            return itemsPerIssue;
        }
    }
}

module.exports.getRedmineItemsFromProject = async (redmineProject, onlyOpen = true) => {

        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.find(p => p.name === redmineProject);

        if (project) {
            const onlyOpenQuery = onlyOpen ? 'open' : '*';
            const currentProjectItems = await getRedmineData(`issues.json?project_id=${project.id}&status_id=${onlyOpenQuery}&limit=1000`, false);
           
            return currentProjectItems;
        }

        return undefined;
}

module.exports.getCustomFieldValue = (redmineIssue, customName)  => {
    let value = '';

    if (redmineIssue && customName && redmineIssue.custom_fields) {
        const custom = redmineIssue.custom_fields.find(cf => cf.name === customName);
        if (custom) {
            value = custom.value;
        }
    }

    return value;
}