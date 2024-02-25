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
        type: 'create',
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        closeItemsAfterAttach: 'none',
        sendAttachResultTo: 'none',
        modifiedBy: 'gsda'
    },
    {
        name: 'Alias 1',
        active: false,
        type: 'create',
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        closeItemsAfterAttach: 'none',
        sendAttachResultTo: 'none',
        modifiedBy: 'gsda'
    },
    {
        name: 'Creation 1',
        active: false,
        type: 'create',
        tracker: 'Email',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        closeItemsAfterAttach: 'none',
        sendAttachResultTo: 'none',
        modifiedBy: 'gsda'
    },
    {
        name: 'Both alias 1',
        active: false,
        type: 'both',
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        closeItemsAfterAttach: 'all',
        sendAttachResultTo: 'all',
        modifiedBy: 'gsda'
    },
    {
        name: 'Attach Alias 1',
        active: false,
        type: 'attach',
        tracker: 'Bug',
        project: 'Demo',
        version: '',
        user: 'Andrzej Czaja',
        parsingMode: 'plainAndHtmlAttachment',
        findIssues: 'latest',
        findCRs: 'latest',
        addAttachments: false,
        closeItemsAfterAttach: 'latest',
        sendAttachResultTo: 'sender',
        modifiedBy: 'gsda'
    }
];

insertManyIntoCollection(itemsFromEmailsSettingsName, itemsFromEmailsSettingsRecords);

//********************************************************************* */
//              USER PREFERENCES
//********************************************************************* */

let userPreferencesName = 'userPreferences';
console.log(`Handling ${userPreferencesName} collection`);

if (removeCollectionsBeforeInitialization) {
    removeCollection(userPreferencesName);
}

let userPreferencesCollectionIndex = {
    formId: "text"
};

let userPreferencesCollectionIndexOptions = {
    unique: false
}

createCollection(userPreferencesName, userPreferencesCollectionIndex, userPreferencesCollectionIndexOptions);

// End of script
console.log('Script Finished');

