const tmsControllers = require('../../../controllers/softdev/tms/tmsController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/check-tms', authController.checkAuth, tmsControllers.checkTms);

module.exports = router;