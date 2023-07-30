const express = require('express');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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

module.exports.loadAppConfiguration = (app, directory) => {
    configurePATH();
    connectToMongo();
    setupMiddleWares(app);
}