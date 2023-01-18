const path = require('path');

module.exports.loadConfiguration = () => {
    console.log(__dirname);
    if (process.env.NODE_ENV !== 'production')
        require('dotenv').config({ path: path.join(__dirname, 'configurations/dev_config.cfg') });
    else
        require('dotenv').config({ path: path.join(__dirname, 'configurations/prod_config.cfg') });
};
