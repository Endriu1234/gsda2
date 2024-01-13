const express = require('express');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');


function configurePATH() {
    process.env['PATH'] = `${process.env.ORACLE_CLIENT_PATH};` + process.env['PATH'];
}

async function connectToMongo() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => { console.log("Database connected") });

    await mongoose.connect(process.env.MONGO_DB_ADRESS, {});
}

function setupMiddleWares(app) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(mongoSanitize(
        {
            replaceWith: '_' // 
        }
    ));
}

let multerOnDisk = null;

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

module.exports.getFileStorage = () => {
    if (!multerOnDisk) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                let error = null;

                const isValid = MIME_TYPE_MAP[file.mimetype];
                if (!isValid)
                    error = new Error('Wrong file type');

                cb(error, process.env.USER_FILES_PATH);
            },
            filename: (req, file, cb) => {
                const name = file.originalname.toLowerCase().split(' ').join('_');
                const ext = MIME_TYPE_MAP[file.mimetype];
                cb(null, name + '_' + Date.now() + '.' + ext);
            }
        });

        multerOnDisk = multer(storage);
    }

    return multerOnDisk;
}

module.exports.loadAppConfiguration = (app, directory) => {
    configurePATH();
    connectToMongo();
    setupMiddleWares(app);
}