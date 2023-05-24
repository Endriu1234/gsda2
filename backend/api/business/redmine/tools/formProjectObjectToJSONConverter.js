const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.convertFormProjectObjectToJSON = async function convertFormProjectObjectToJSON(formProject) {
    const redmineProject = { project: {} };

    redmineProject.project.name = formProject.name;
    redmineProject.project.identifier = formProject.identifier;
    redmineProject.project.is_public = false;
    redmineProject.project.inherit_members = false;
    if (formProject.inherit_public) {
        redmineProject.project.is_public = formProject.inherit_public.value.filter(v => v === "Public").length > 0 ? true : false;
        redmineProject.project.inherit_members = formProject.inherit_public.value.filter(v => v === "Inherit members").length > 0 ? true : false;
    }

    if (formProject.description)
        redmineProject.project.description = formProject.description;

    if (formProject.parent_project) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.find(p => p.name === formProject.parent_project);
        redmineProject.project.parent_id = project.id;
    }

    return JSON.stringify(redmineProject);
}
