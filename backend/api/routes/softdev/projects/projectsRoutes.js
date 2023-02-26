const projectController = require('../../../controllers/softdev/projects/projectsController');

const express = require('express');
const router = express.Router();

router.use('/get-softdev-projects', projectController.getSoftDevProjects);

module.exports = router;    