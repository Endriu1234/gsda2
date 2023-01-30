const itemsController = require('../../../controllers/redmine/items/itemsController');

const express = require('express');
const router = express.Router();

router.use('/get-redmine-trackers', itemsController.getRedmineTrackers);
router.use('/get-redmine-users', itemsController.getRedmineUsers);


module.exports = router;