const itemControllers = require('../../../controllers/softdev/item/itemController');

const express = require('express');
const router = express.Router();

router.get('/get-item-by-id', itemControllers.getItemById);

module.exports = router;