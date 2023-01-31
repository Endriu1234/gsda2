const itemsController = require('../../../controllers/redmine/items/itemsController');

const express = require('express');
const router = express.Router();

router.use('/get-redmine-trackers', itemsController.getRedmineTrackers);
router.use('/get-redmine-users', itemsController.getRedmineUsers);
router.use('/get-redmine-projects', itemsController.getRedmineProjects);


module.exports = router;