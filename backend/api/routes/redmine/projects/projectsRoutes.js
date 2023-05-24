const projectsController = require('../../../controllers/redmine/projects/projectsController');

const express = require('express');
const router = express.Router();

router.get('/check-identifier', projectsController.checkIdentifier);
router.post('/create-redmine-project', projectsController.createRedmineProject);

module.exports = router;