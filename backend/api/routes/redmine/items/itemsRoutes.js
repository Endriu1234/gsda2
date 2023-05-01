const itemsController = require('../../../controllers/redmine/items/itemsController');

const express = require('express');
const router = express.Router();

router.get('/get-redmine-trackers', itemsController.getRedmineTrackers);
router.get('/get-redmine-users', itemsController.getRedmineUsers);
router.get('/get-redmine-projects', itemsController.getRedmineProjects);
router.post('/create-redmine-item', itemsController.createRedmineItem);


module.exports = router;