const authController = require('../../../controllers/auth/authController');
const setupController = require('../../../controllers/redmine/setup/setupController');

const express = require('express');
const router = express.Router();

router.get('/refresh-cache', authController.checkAuth, setupController.refreshCache);

module.exports = router;