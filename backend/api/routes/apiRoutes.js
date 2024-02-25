const itemsRoutes = require('../../api/routes/redmine/items/itemsRoutes');
const rmProjectsRoutes = require('../../api/routes/redmine/projects/projectsRoutes');
const projectsRoutes = require('../../api/routes/softdev/projects/projectsRoutes');
const crsRoutes = require('../../api/routes/softdev/crs/crsRoutes');
const issuesRoutes = require('../../api/routes/softdev/issues/issuesRoutes');
const tmsRoutes = require('../../api/routes/softdev/tms/tmsRoutes');
const itemsSdRoutes = require('../../api/routes/softdev/item/itemRoutes');
const authRoutes = require('./auth/authRoutes');
const itemsFromEmailsRoutes = require('./gsda/itemsfromemails/itemsFromEmailsRoutes');
const userPreferencesRoutes = require('./gsda/user_preferences/userPreferencesRoutes');

const express = require('express');
const router = express.Router();

router.use('/redmine/items/', itemsRoutes);
router.use('/redmine/projects/', rmProjectsRoutes);
router.use('/softdev/projects/', projectsRoutes);
router.use('/softdev/crs/', crsRoutes);
router.use('/softdev/issues/', issuesRoutes);
router.use('/softdev/tms/', tmsRoutes);
router.use('/softdev/items', itemsSdRoutes);
router.use('/auth/', authRoutes);
router.use('/gsda/items-from-emails', itemsFromEmailsRoutes);
router.use('/gsda/user-preferences', userPreferencesRoutes);

module.exports = router;