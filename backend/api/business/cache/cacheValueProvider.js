const ItemsFromEmailsSettings = require('../../model/gsda/itemsfromemails/ItemsFromEmailsSettings');
const UserPreferences = require('../../model/gsda/user_preferences/userPreferences');
const { getRedmineData } = require('../redmine/tools/redmineConnectionTools');
const softDevDataProvider = require('../softdev/softDevDataProvider');
const { getTmsTasks } = require('./cacheTmsTaskHelper');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL, checkperiod: process.env.CACHE_TTL * 0.2, useClones: false });

module.exports.getValue = async (key) => {

    let value = cache.get(key);

    if (value === undefined) {
        let retriveDataFun = reqisteredCaches[key];

        if (retriveDataFun !== undefined) {
            value = await retriveDataFun();
            cache.set(key, value);
            console.log(`Retriving ${key} from source`);
        }
        else
            console.log(`Cannot find retrive function for ${key}`);
    }
    else
        console.log(`Retriving ${key} from cache`);

    return value;
}

const reqisteredCaches = {
    'redmine_projects': async () => {
        const result = await getRedmineData('projects.json', true);
        return result.projects.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_trackers': async () => {
        const result = await getRedmineData('trackers.json');
        return result.trackers.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_users': async () => {
        const result = await getRedmineData('users.json', true);
        result.users.forEach(user => user.name = `${user.firstname} ${user.lastname}`);
        return result.users.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_custom_fields': async () => {
        const result = await getRedmineData('custom_fields.json');
        return result.custom_fields;
    },
    'redmine_issue_statuses': async () => {
        const result = await getRedmineData('issue_statuses.json');
        return result.issue_statuses;
    },
    'softdev_projects': async () => {
        const result = await softDevDataProvider.getVersions();
        return result.sort((a, b) => a.PRODUCT_VERSION_NAME.localeCompare(b.PRODUCT_VERSION_NAME));
    },
    'tms_users': async () => {
        const result = await softDevDataProvider.getTmsLocalUsers();
        result.forEach(user => user.NAME = `${user.FIRST_NAME} ${user.LAST_NAME}`);
        return result.sort((a, b) => a.NAME.localeCompare(b.NAME))
    },
    'tms_clients': async () => {
        const result = await softDevDataProvider.getTmsClients();
        return result.sort((a, b) => a.TMS_CLIENT.localeCompare(b.TMS_CLIENT))
    },
    'tms_tasks': () => {
        const result = getTmsTasks();
        return result;
    },
    'redmine_versions': async () => {
        const projects = await this.getValue('redmine_projects');
        let results = [];
        for (const project of projects) {
            const versions = await getRedmineData(`projects/${project.id}/versions.json`, false);
            if (versions && versions.versions && versions.versions.length > 0) {
                const versionTmp = versions.versions.filter((version) => { return version.status === 'open' });
                versionTmp.forEach((version) => version.currentProject = { id: project.id, name: project.name });
                versionTmp.forEach(async (version) => {
                    if (version.wiki_page_title && version.wiki_page_title.length > 0) {
                        const wiki = await getRedmineData(`projects/${version.project.id}/wiki/${version.wiki_page_title}.json`, false);
                        if (wiki && wiki.wiki_page && wiki.wiki_page.text)
                            version.wiki = wiki.wiki_page.text;
                    }
                })
                results.push(...versionTmp);
            }
        }

        jsonObject = results.map(JSON.stringify);
        uniqueSet = new Set(jsonObject);
        results = Array.from(uniqueSet).map(JSON.parse);

        return results.sort((a, b) => a.name.localeCompare(b.name))
    },
    'items_from_emails_settings': async () => {
        const settings = await ItemsFromEmailsSettings.find({ active: true });
        const retVal = [];

        settings.forEach(m => {

            const setting = {};

            Object.keys(m._doc).forEach(key => {

                if (key !== '_id' && key !== '__v') {
                    const value = m._doc[key];

                    if (value)
                        setting[key] = m._doc[key];
                }
            });

            retVal.push(setting);
        });

        return retVal;
    },
    'user_preferences': async () => {
        const settings = await UserPreferences.find();
        const retVal = [];

        settings.forEach(m => {

            const setting = {};

            Object.keys(m._doc).forEach(key => {

                if (key !== '_id' && key !== '__v') {
                    const value = m._doc[key];

                    if (value)
                        setting[key] = m._doc[key];
                }
            });

            retVal.push(setting);
        });

        return retVal;
    }
}

module.exports.deleteValue = async (key) => {

    return cache.del(key);
}

module.exports.clearCache = async () => {
    console.log('Clearing cache');
    cache.flushAll();
}

module.exports.refreshProjects = async() => {
    this.deleteValue('redmine_projects');
    await this.getValue('redmine_projects');
}

module.exports.refreshTrackers = async() => {
    this.deleteValue('redmine_trackers');
    await this.getValue('redmine_trackers');
}

module.exports.refreshUsers = async() => {
    this.deleteValue('redmine_users');
    await this.getValue('redmine_users');
}

module.exports.refreshCustomFields = async() => {
    this.deleteValue('redmine_custom_fields');
    await this.getValue('redmine_custom_fields');
}

module.exports.refreshIssueStatuses = async() => {
    this.deleteValue('redmine_issue_statuses');
    await this.getValue('redmine_issue_statuses');
}

module.exports.refreshSDProjects = async() => {
    this.deleteValue('softdev_projects');
    await this.getValue('softdev_projects');
}

module.exports.refreshTmsUsers = async() => {
    this.deleteValue('tms_users');
    await this.getValue('tms_users');
}

module.exports.refreshTmsClients = async() => {
    this.deleteValue('tms_clients');
    await this.getValue('tms_clients');
}

module.exports.refreshVersions = async() => {
    this.deleteValue('redmine_versions');
    await this.getValue('redmine_versions');
}

module.exports.refreshEmailSettings = async() => {
    this.deleteValue('items_from_emails_settings');
    await this.getValue('items_from_emails_settings');
}

module.exports.refreshUserPreferences = async() => {
    this.deleteValue('user_preferences');
    await this.getValue('user_preferences');
}