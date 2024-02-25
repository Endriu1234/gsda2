const authController = require('../../../controllers/auth/authController');
const userPreferencesController = require('../../../controllers/gsda/user_preferences/userPreferencesController');

const express = require('express');
const router = express.Router();


router.get('/get-user-preferences', authController.checkAuth, userPreferencesController.getUserPreferences);
router.post('/save-user-preferences', authController.checkAuth, userPreferencesController.saveUserPreferences);

module.exports = router;