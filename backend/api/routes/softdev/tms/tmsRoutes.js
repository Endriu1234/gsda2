const tmsControllers = require('../../../controllers/softdev/tms/tmsController');

const express = require('express');
const router = express.Router();

router.get('/check-tms', tmsControllers.checkTms);

module.exports = router;