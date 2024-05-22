const authController = require('../../../controllers/auth/authController');
const setupController = require('../../../controllers/redmine/setup/setupController');

const express = require('express');
const router = express.Router();

router.get('/refresh-cache', authController.checkAuth, setupController.refreshCache);
router.get('/refresh-versions', authController.checkAuth, setupController.refreshVersions);
router.get('/refresh-sd-projects', authController.checkAuth, setupController.refreshSDProjects);
router.get('/refresh-redmine-projects', authController.checkAuth, setupController.refreshRedmineProjects);
router.get('/refresh-custom-fields', authController.checkAuth, setupController.refreshCustomFields);
router.get('/refresh-email-settings', authController.checkAuth, setupController.refreshEmailSettings);
router.get('/refresh-user-preferences', authController.checkAuth, setupController.refreshUserPreferences);

module.exports = router;