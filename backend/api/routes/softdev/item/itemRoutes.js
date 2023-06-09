const itemControllers = require('../../../controllers/softdev/item/itemController');

const express = require('express');
const router = express.Router();

router.get('/get-item-by-id', itemControllers.getItemById);
router.get('/get-potential-redmine-items-from-sdproject', itemControllers.getPotentialRedmineItemsFromSDProject);

module.exports = router;