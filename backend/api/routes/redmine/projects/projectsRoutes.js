const projectsController = require('../../../controllers/redmine/projects/projectsController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/check-identifier', authController.checkAuth, projectsController.checkIdentifier);
router.post('/create-redmine-project', authController.checkAuth, projectsController.createRedmineProject);

module.exports = router;