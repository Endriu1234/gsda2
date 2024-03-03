
module.exports.collectCrs = function(text, onlyFirst) {
    let retVal = [];
    let val = text.trim().toUpperCase().match(/CR-[A-Z]{3,4}-[\d]{1,9}I[T|S]/g);

    if (val) {
        if (onlyFirst) {
            retVal.push(val[0]);
        } else {
            retVal = val;
        }
    }

    return retVal;
}
