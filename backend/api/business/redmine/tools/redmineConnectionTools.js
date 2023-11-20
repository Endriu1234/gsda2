const axios = require('axios');

function getRedmineApiConfiguration() {
    const config = {
        'X-Redmine-API-Key': process.env.REDMINE_API_KEY,
        'Content-Type': 'application/json'
    };
    return { headers: config };
};

module.exports.getRedmineApiConfiguration = getRedmineApiConfiguration;

function getRedmineAddress(endPoint) {

    if (endPoint)
        return `${process.env.REDMINE_ADDRESS}/${endPoint}`;

    return `${process.env.REDMINE_ADDRESS}/`;
};

function logError(error) {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}

module.exports.getRedmineAddress = getRedmineAddress;

module.exports.getRedmineData = async (endPoint, isPaginated) => {
    let dataToReturn = undefined;

    if (isPaginated) {
        const limitPrefix = endPoint.includes("?") ? "&" : "?";
        let result = await axios.get(`${getRedmineAddress(endPoint)}${limitPrefix}limit=100`, getRedmineApiConfiguration()).catch(logError);

        if (result) {
            dataToReturn = result.data;
            let colectionName = Object.keys(dataToReturn)[0];

            while ((result.data.limit + result.data.offset) < result.data.total_count) {
                let url = `${getRedmineAddress(endPoint)}${limitPrefix}limit=100&offset=${result.data.limit + result.data.offset}`;
                result = await axios.get(url, getRedmineApiConfiguration()).catch(logError);
                dataToReturn[colectionName] = dataToReturn[colectionName].concat(result.data[colectionName]);
            }
        }
    }
    else {
        const result = await axios.get(getRedmineAddress(endPoint), getRedmineApiConfiguration()).catch(logError);
        if (result) {
            dataToReturn = result.data;
        }
    }

    return dataToReturn;
}

module.exports.postRedmineJsonData = async (endpoint, jsonData) => {
    const retVal = {
        success: true,
        redmineLink: ''
    }

    retVal.redmineResponse = await axios.post(getRedmineAddress(endpoint), jsonData, getRedmineApiConfiguration()).catch((error) => {
        retVal.success = false;
        logError(error);
    });

    return retVal;
}

module.exports.putRedmineJsonData = async (endpoint, jsonData) => {
    const retVal = {
        success: true,
        redmineLink: ''
    }

    retVal.redmineResponse = await axios.put(getRedmineAddress(endpoint), jsonData, getRedmineApiConfiguration()).catch((error) => {
        retVal.success = false;
        logError(error);
    });

    return retVal;
}