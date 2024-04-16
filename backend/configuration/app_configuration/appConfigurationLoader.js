const express = require('express');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


function configurePATH() {
    process.env['PATH'] = `${process.env.ORACLE_CLIENT_PATH};` + process.env['PATH'];
}

async function connectToMongo() {
    mongoose.set('strictQuery', false);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => { console.log("Database connected") });

    await mongoose.connect(process.env.MONGO_DB_ADRESS, {});
}

function setupMiddleWares(app, directory) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(mongoSanitize(
        {
            replaceWith: '_' // 
        }
    ));

    const path = directory + "/app";
    app.use(express.static(path));
}

let multerOnDisk = null;

function getFileExtension(fileName) {
    const tbl = fileName.split(".");
    if (tbl.length === 1 || (tbl[0] === "" && tbl.length === 2)) {
        return "";
    }
    return tbl.pop();
}

function getFileWithoutExtension(fileName) {
    const tbl = fileName.split(".");
    if (tbl.length === 1 || (tbl[0] === "" && tbl.length === 2)) {
        return "";
    }
    return (fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
}

module.exports.getFileStorage = () => {
    if (!multerOnDisk) {
        const storage = multer.diskStorage({ //diskStorage //memoryStorage
            destination: (req, file, cb) => {
                cb(null, process.env.USER_FILES_PATH);
            },
            filename: (req, file, cb) => {
                const fullName = file.originalname.toLowerCase().split(' ').join('_');
                const name = getFileWithoutExtension(fullName);
                const ext = getFileExtension(fullName);
                const newName = name + '_' + Date.now() + '.' + ext;
                if (file.originalname.indexOf(' ') >= 0)
                    req.body.description = req.body.description.replace(new RegExp(file.originalname, 'g'), newName);
                cb(null, newName);
            }
        });

        multerOnDisk = multer({
            storage: storage,
        });
    }

    return multerOnDisk;
}

module.exports.loadAppConfiguration = (app, directory) => {
    configurePATH();
    connectToMongo();
    setupMiddleWares(app, directory);
}