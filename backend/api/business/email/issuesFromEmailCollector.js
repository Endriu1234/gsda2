
const collectorTypes = Object.freeze({ 
    LATEST: 0, 
    EARLIEST: 1, 
    ALL: 2
}); 

module.exports.collectorTypeEnum = collectorTypes;

module.exports.collectIssuesAsArray = function(text, collectorType) {
    let retVal = [];
    let val = text.trim().toUpperCase().match(/ISS-[A-Z]+-\d{1,6}[A-Z]{2}/g);

    if (val) {
        if (collectorType === collectorTypes.LATEST) {
            retVal.push(val[0]);
        } else if (collectorType === collectorTypes.EARLIEST) {
            retVal.push(val[val.length - 1]);
        } else {
            retVal = val;
        }
    }

    return retVal;
}

module.exports.collectIssuesAsString = function(text, collectorType) {
    let retVal = '';

    let valTbl = this.collectIssuesAsArray(text, collectorType);

    if (valTbl && valTbl.length > 0) {
        retVal = valTbl.join(';');
    }

    return retVal;
}