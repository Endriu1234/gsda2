const projectController = require('../../../controllers/softdev/projects/projectsController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.use('/get-softdev-projects', authController.checkAuth, projectController.getSoftDevProjects);

module.exports = router;    