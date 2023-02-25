const crsControllers = require('../../../controllers/softdev/crs/crsController');

const express = require('express');
const router = express.Router();

router.get('/check-cr', crsControllers.checkCR);

module.exports = router;