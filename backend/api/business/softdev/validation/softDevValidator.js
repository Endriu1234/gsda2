module.exports.checkCRMatchPattern = (cr) => {
    return new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(cr);
}