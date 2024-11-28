const otherControllers = require('../../../controllers/softdev/other/otherController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/get-data-from-queries', authController.checkAuth, otherControllers.getDataFromSDQuery);

module.exports = router;