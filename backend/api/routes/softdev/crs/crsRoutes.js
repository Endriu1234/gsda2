const crsControllers = require('../../../controllers/softdev/crs/crsController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/check-cr', authController.checkAuth, crsControllers.checkCR);

module.exports = router;