const issuesControllers = require('../../../controllers/softdev/issues/issuesController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/check-issue', authController.checkAuth, issuesControllers.checkIssue);

module.exports = router;