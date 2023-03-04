module.exports.checkCRMatchPattern = (cr) => {
    return new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(cr.trim().toUpperCase());
}

module.exports.checkIssueMatchPattern = (issue) => {
    return new RegExp("^(I|i)(S|s)(S|s)-[a-zA-Z]+-\\d{1,6}[a-zA-Z]{2}$").test(issue.trim());
}

module.exports.checkTmsMatchPattern = (tms) => {
    return new RegExp("^[a-zA-Z]+-\\d{5}$").test(tms.trim());
}