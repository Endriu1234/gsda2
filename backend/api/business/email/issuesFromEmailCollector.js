
module.exports.collectIssues = function(text, onlyFirst) {
    let retVal = [];
    let val = text.trim().toUpperCase().match(/ISS-[A-Z]+-\d{1,6}[A-Z]{2}/g);

    if (val) {
        if (onlyFirst) {
            retVal.push(val[0]);
        } else {
            retVal = val;
        }
    }

    return retVal;
}