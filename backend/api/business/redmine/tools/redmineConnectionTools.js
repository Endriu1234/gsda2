const axios = require('axios');
const fs = require('fs');

function getRedmineApiConfiguration() {
    return getRedmineApiConfiguration('application/json');
};

function getRedmineApiConfiguration(contentType) {
    const config = {
        'X-Redmine-API-Key': process.env.REDMINE_API_KEY,
        'Content-Type': contentType
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

module.exports.deleteFile = async (filePath) => {
    fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        console.log(err ? 'no access!' : 'can read/write');
    });
    fs.unlink(filePath, function(err) {
        if(err && err.code == 'ENOENT') {
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            console.error("Error occurred while trying to remove file");
            console.log(err);
        } else {
            console.info(`removed`);
        }
    });
}

const readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (error, fileContent) => {
        if (error != null) {
          reject(error);
          return;
        }
  
        resolve(fileContent);
      });
    });
  };

module.exports.postFiles = async (files) => {
    const retVal = {
        success: true,
        errorMessage: ''
    }

    if (files && files.length > 0) {
        for (const file of files) {

            if (!retVal.success)
                break;

            const buffer = await readFile(file.path);

            const result = await axios.post(getRedmineAddress(`uploads.json?filename=${file.filename}`), buffer,
                getRedmineApiConfiguration('application/octet-stream')).catch((error) => {
                    retVal.success = false;
                    retVal.errorMessage = error;
                    logError(error);
                });


            if (result && result.data && result.data.upload && result.data.upload.token) {
                file.token = result.data.upload.token;
                await this.deleteFile(file.path);    //this could be wrong aproach (delete independently on result?)
            }
            else {
                retVal.success = false;
                retVal.errorMessage = 'Lack of token';
                break;
            }
        }
    }

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