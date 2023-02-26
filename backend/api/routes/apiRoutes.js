const itemsRoutes = require('../../api/routes/redmine/items/itemsRoutes');
const projectsRoutes = require('../../api/routes/softdev/projects/projectsRoutes');
const express = require('express');
const router = express.Router();

router.use('/redmine/items/', itemsRoutes);
router.use('/softdev/projects/', projectsRoutes);

module.exports = router;