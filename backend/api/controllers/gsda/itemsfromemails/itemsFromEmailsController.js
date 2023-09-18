module.exports.getItemsFromEmailsSettings = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    return res.status(200).json(projects);
}

module.exports.saveItemsFromEmailsSettings = async (req, res) => {
    const retVal = {
        success: true,
        errorMessage: ''
    };

    console.log('Server saveItemsFromEmailsSettings() controller');

    return res.status(200).json(retVal);
}
