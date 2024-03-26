const collectorTypes = Object.freeze({ 
    LATEST: 0, 
    EARLIEST: 1, 
    ALL: 2
}); 

module.exports.collectorTypeEnum = collectorTypes;

module.exports.collectCrsAsArray = function(text, collectorType) {
    let retVal = [];
    let val = text.trim().toUpperCase().match(/CR-[A-Z]{3,4}-[\d]{1,9}I[T|S]/g);

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

module.exports.collectCrsAsString = function(text, collectorType) {
    let retVal = '';

    let valTbl = this.collectCrsAsArray(text, collectorType);

    if (valTbl && valTbl.length > 0) {
        retVal = valTbl.join(';');
    }

    return retVal;
}