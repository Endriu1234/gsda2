const itemControllers = require('../../../controllers/softdev/item/itemController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/get-item-by-id', authController.checkAuth, itemControllers.getItemById);
router.get('/get-potential-redmine-items-from-sdproject', authController.checkAuth, itemControllers.getPotentialRedmineItemsFromSDProject);

module.exports = router;