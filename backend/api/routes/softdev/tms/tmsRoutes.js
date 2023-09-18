const tmsControllers = require('../../../controllers/softdev/tms/tmsController');
const authController = require('../../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.get('/check-tms', authController.checkAuth, tmsControllers.checkTms);
router.get('/get-tms-clients', authController.checkAuth, tmsControllers.getTmsClients);
router.get('/get-potential-redmine-items-from-tms', authController.checkAuth, tmsControllers.getPotentialRedmineItemsFromTms)

module.exports = router;