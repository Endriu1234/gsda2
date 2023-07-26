const authControllers = require('../../controllers/auth/authController');

const express = require('express');
const router = express.Router();

router.post('/login', authControllers.login);

module.exports = router;