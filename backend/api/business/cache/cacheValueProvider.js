const ItemsFromEmailsSettings = require('../../model/gsda/itemsfromemails/ItemsFromEmailsSettings');
const { getRedmineData } = require('../redmine/tools/redmineConnectionTools');
const softDevDataProvider = require('../softdev/softDevDataProvider');
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
        const settings = await ItemsFromEmailsSettings.findOne({ formId: 'ITEMS_FROM_EMAILS_SETTINGS_FORMID' });
        return { ...settings.values };
    }
}

module.exports.deleteValue = async (key) => {

    return cache.del(key);
}

module.exports.clearCache = async () => {
    console.log('Clearing cache');
    cache.flushAll();
}