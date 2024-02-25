const { getRedmineAddress } = require("../redmine/tools/redmineConnectionTools");

module.exports.collectItems = function (text, onlyFirst) {
    retVal = [];

    if (text) {

        const redmineAddress = getRedmineAddress('issues/');
        const redmineAddressLength = redmineAddress.length;
        let indexOfAddress = -1;
        let itemId = null;

        while (true) {

            indexOfAddress = text.indexOf(redmineAddress);

            if (indexOfAddress > -1) {
                text = text.substring(indexOfAddress + redmineAddressLength);
                itemId = getFirstNumber(text);

                if (itemId && !retVal.includes(itemId))
                    retVal.push(itemId);
            }

            if (onlyFirst || indexOfAddress < 0)
                break;
        }
    }


    return retVal;
}

function getFirstNumber(text) {
    let retVal = null;

    for (let i = 0; i < text.length; i++) {

        if (text[i] >= '0' && text[i] <= '9')
            continue;
        else {

            if (i > 0)
                retVal = text.substring(0, i);

            break;
        }
    };

    return retVal;
};