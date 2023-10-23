const softDevDataProvider = require('../softDevDataProvider');

module.exports.checkCRMatchPattern = (cr) => {
    return new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(cr.trim().toUpperCase());
}

module.exports.checkIssueMatchPattern = (issue) => {
    return new RegExp("^(I|i)(S|s)(S|s)-[a-zA-Z]+-\\d{1,6}[a-zA-Z]{2}$").test(issue.trim());
}

module.exports.checkTmsMatchPattern = (tms) => {
    return new RegExp("^(([a-zA-Z0-9]+-\\d{5});*)*$").test(tms.trim());
}

module.exports.checkTmsClientMatchPattern = (tms) => {
    return new RegExp("^[a-zA-Z0-9]+$").test(tms.trim());
}

module.exports.checkTmsTasksExistanceInDb = async (tms) => {
    let tmsExist = false;
    const tmsTasks = tms.split(';');
    if (tmsTasks) {
        tmsExist = true;
        for (let task of tmsTasks) {
            let isTmsInDb = await softDevDataProvider.isTmsInDB(task);
            if (!isTmsInDb || isTmsInDb.length <= 0 || !(isTmsInDb[0].EXISTENCE === 1)) {
                tmsExist = false;
                break;
            }
        }
    }

    return tmsExist;
}