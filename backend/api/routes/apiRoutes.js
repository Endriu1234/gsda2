const itemsRoutes = require('../../api/routes/redmine/items/itemsRoutes');
const crsRoutes = require('../../api/routes/softdev/crs/crsRoutes');
const express = require('express');
const router = express.Router();

router.use('/redmine/items/', itemsRoutes);
router.use('/softdev/crs/', crsRoutes);

module.exports = router;