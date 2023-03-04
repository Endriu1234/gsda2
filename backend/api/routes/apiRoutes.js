const itemsRoutes = require('../../api/routes/redmine/items/itemsRoutes');
const projectsRoutes = require('../../api/routes/softdev/projects/projectsRoutes');
const crsRoutes = require('../../api/routes/softdev/crs/crsRoutes');
const issuesRoutes = require('../../api/routes/softdev/issues/issuesRoutes');
const tmsRoutes = require('../../api/routes/softdev/tms/tmsRoutes');
const express = require('express');
const router = express.Router();

router.use('/redmine/items/', itemsRoutes);
router.use('/softdev/projects/', projectsRoutes);
router.use('/softdev/crs/', crsRoutes);
router.use('/softdev/issues/', issuesRoutes);
router.use('/softdev/tms/', tmsRoutes);

module.exports = router;