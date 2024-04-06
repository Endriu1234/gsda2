const emailHandler = require('./api/business/email/emailHandler');
require('./configuration/env_configuration/envConfigurationLoader').loadConfiguration();
const fs = require('fs');
const https = require("https");

const express = require('express');
const app = express();

const appConfiugrationLoader = require('./configuration/app_configuration/appConfigurationLoader');
const appRoutingLoader = require('./configuration/app_configuration/appRoutingLoader');
appConfiugrationLoader.loadAppConfiguration(app, __dirname);
appRoutingLoader.loadRouting(app, __dirname);

let options = {
    key: fs.readFileSync(__dirname + '/configuration/security_configuration/rootCA.key'),
    cert: fs.readFileSync(__dirname + '/configuration/security_configuration/pcaczaja_1.crt'),
    passphrase: process.env.SECURITY_PASSPHRASE
}

let httpsServer = https.createServer(options, app);

httpsServer.listen(process.env.APP_PORT, () => {
    const currTime = new Date(Date.now());
    console.log(`${currTime.toLocaleString()}: Serving on port ${process.env.APP_PORT} with configuration ${process.env.CONFIGURATION_NAME} `);

    if (process.env.EMAIL_COMMANDS)
        emailHandler.handleEmailCommands();
});

httpsServer.on('error', () => console.log('error https'));
httpsServer.on('listening', () => console.log('https listening'));
