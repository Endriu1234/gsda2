const itemsController = require('../../../controllers/redmine/items/itemsController');

const express = require('express');
const router = express.Router();

router.use('/get-redmine-trackers', itemsController.getRedmineTrackers);

module.exports = router;