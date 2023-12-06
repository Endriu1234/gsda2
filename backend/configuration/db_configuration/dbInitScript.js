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
formsDataCollectionName = 'forms';
console.log(`Handling ${formsDataCollectionName} collection`);

if (removeCollectionsBeforeInitialization) {
    removeCollection(formsDataCollectionName);
}

formsDataCollectionIndex = {
    formId: "text"
};

formsDataCollectionIndexOptions = {
    unique: true
}

createCollection(formsDataCollectionName, formsDataCollectionIndex, formsDataCollectionIndexOptions);

const formsDataRecords = [
    {
        formId: 'ITEMS_FROM_EMAILS_SETTINGS_FORMID',
        values: {
            active: false,
            tracker: 'Bug',
            project: 'Demo',
            version: '',
            user: 'Andrzej Czaja',
            parsingMode: 'plainAndHtmlAttachment',
            addAttachments: false,
            modifiedBy: 'gsda'
        }
    }
];

insertManyIntoCollection(formsDataCollectionName, formsDataRecords);

// End of script
console.log('Script Finished');

