// Trigger below script: mongosh --host 127.0.0.1 --port 27017 --file dbInitScript.js 
// params:
const mongoDBAddress = 'mongodb://127.0.0.1:27017/gsda_dev';
const removeCollectionsBeforeInitialization = true;

// functions:
removeCollection = (collectionName) => {
    console.log(`Removing collection: ${collectionName}`);

    if (!db.getCollectionNames().includes(collectionName))
        console.log(`Cannot remove ${collectionName} because it does not exists`);
    else {
        db[collectionName].drop();
        collectionRemoved = !db.getCollectionNames().includes(collectionName);
        console.log(`${collectionName} removal result: ${collectionRemoved}`);
    }
}


createCollection = (collectionName, index, indexOptions) => {
    console.log(`Creating collection: ${collectionName}`);

    collectionAlreadyExists = db.getCollectionNames().includes(collectionName);

    if (collectionAlreadyExists)
        console.log(`Cannot create ${collectionName} because it already exists`);
    else {
        db.createCollection(collectionName);
        collectionCreated = db.getCollectionNames().includes(collectionName);

        if (collectionCreated && index && indexOptions)
            db[collectionName].createIndex(index, indexOptions);



        console.log(`${collectionName} creation result: ${collectionCreated}`);
    }
}

insertManyIntoCollection = (collectionName, arrayOfValues) => {
    try {
        db[collectionName].insertMany(arrayOfValues);
    } catch (e) {
        console.log(`Error occured while inserting many into ${collectionName}`);
        console.dir(e);
    }

}

// Start of script:
console.log('Script Started');

db = connect(mongoDBAddress);

// 1. Handling formsData collection:
itemsFromEmailsSettingsName = 'itemsFromEmailsSettings';
console.log(`Handling ${itemsFromEmailsSettingsName} collection`);

if (removeCollectionsBeforeInitialization) {
    removeCollection(itemsFromEmailsSettingsName);
}

itemsFromEmailsSettingsCollectionIndex = {
    name: "text"
};

itemsFromEmailsSettingsCollectionIndexOptions = {
    unique: false
}

createCollection(itemsFromEmailsSettingsName, itemsFromEmailsSettingsCollectionIndex, itemsFromEmailsSettingsCollectionIndexOptions);

const itemsFromEmailsSettingsRecords = [
    {
        name: 'General',
        active: false,
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'gsda'
    },
    {
        name: 'Alias 1',
        active: false,
        tracker: 'Performance',
        project: 'Batch Creation 1',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Alias 2',
        active: false,
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Perf Create',
        active: false,
        tracker: 'Performance',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Perf 2',
        active: false,
        tracker: 'Performance',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'dd',
        active: true,
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: true,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Other',
        active: false,
        tracker: 'Bug',
        project: 'Batch Creation 1',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'vvv',
        active: false,
        tracker: 'Email',
        project: 'Batch Creation 2',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Food',
        active: true,
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Pawel Zolynia',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Bannana',
        active: false,
        tracker: 'Email',
        project: 'Demo',
        version: '',
        user: 'Damian Madej',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: true,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Alias 3',
        active: false,
        tracker: 'Bug',
        project: 'Batch Creation 2',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Alias 4',
        active: false,
        tracker: 'Feature',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Alias 5',
        active: true,
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Damian Madej',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    },
    {
        name: 'Alias 6',
        active: false,
        tracker: 'Feature',
        project: 'Batch Creation 3',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        modifiedBy: 'aczaja'
    }
];

insertManyIntoCollection(itemsFromEmailsSettingsName, itemsFromEmailsSettingsRecords);

// End of script
console.log('Script Finished');

