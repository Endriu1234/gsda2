const itemsController = require('../../../controllers/redmine/items/itemsController');
const authController = require('../../../controllers/auth/authController');
const fileStorage = require('../../../../configuration/app_configuration/appConfigurationLoader');

const express = require('express');
const router = express.Router();

router.get('/get-redmine-trackers', authController.checkAuth, itemsController.getRedmineTrackers);
router.get('/get-redmine-users', authController.checkAuth, itemsController.getRedmineUsers);
router.get('/get-redmine-projects', authController.checkAuth, itemsController.getRedmineProjects);
router.post('/create-redmine-item', authController.checkAuth, fileStorage.getFileStorage().array('files', process.env.USER_FILES_LIMIT), itemsController.createRedmineItem);
router.get('/get-potential-redmine-items-from-rmproject', authController.checkAuth, itemsController.getPotentialRedmineItemsFromRedmineProject);
router.get('/get-redmine-versions', authController.checkAuth, itemsController.getRedmineVersions);
router.post('/save-redmine-attachement', authController.checkAuth, itemsController.saveRedmineAttachement);

module.exports = router;