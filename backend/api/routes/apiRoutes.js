const itemsRoutes = require('../../api/routes/redmine/items/itemsRoutes');
const express = require('express');
const router = express.Router();

router.use('/redmine/items/', itemsRoutes);

module.exports = router;