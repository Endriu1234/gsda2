const issuesControllers = require('../../../controllers/softdev/issues/issuesController');

const express = require('express');
const router = express.Router();

router.get('/check-issue', issuesControllers.checkIssue);

module.exports = router;