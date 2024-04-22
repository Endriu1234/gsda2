const path = require('path');

module.exports.loadConfiguration = () => {

    if (process.env.NODE_ENV && 'production'.localeCompare(process.env.NODE_ENV.trim()) === 0)
        require('dotenv').config({ path: path.join(__dirname, 'configurations/prod_config.cfg') });
    else
        require('dotenv').config({ path: path.join(__dirname, 'configurations/dev_config.cfg') });
};
