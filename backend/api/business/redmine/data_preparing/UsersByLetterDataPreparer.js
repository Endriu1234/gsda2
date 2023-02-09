const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.getUsersByLetter = async () => {
    const users = await cacheValueProvider.getValue('redmine_users');
    usersByLetter = [];
    letter = '';
    usersTmp = [];

    if (users) {
        users.forEach(element => {
            if (element.name[0] !== letter) {
                if (letter !== '') {
                    usersByLetter.push({
                        letter: letter, 
                        redmineUsers: usersTmp.slice() });
                }
                letter = element.name[0];
                usersTmp.length = 0;
            }
            usersTmp.push(element);
        });
        if (letter !== '') {
            usersByLetter.push({
                letter: letter, 
                redmineUsers: usersTmp.slice() });
        }
    }

    return usersByLetter;
}