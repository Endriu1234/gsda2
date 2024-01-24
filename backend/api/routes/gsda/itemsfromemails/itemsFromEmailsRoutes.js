const authController = require('../../../controllers/auth/authController');
const itemsFromEmailsController = require('../../../controllers/gsda/itemsfromemails/itemsFromEmailsController');

const express = require('express');
const router = express.Router();


router.get('/get-items-from-emails-settings', authController.checkAuth, itemsFromEmailsController.getItemsFromEmailsSettings);
router.post('/save-items-from-emails-settings', authController.checkAuth, itemsFromEmailsController.saveItemsFromEmailsSettings);
router.post('/delete-settings', authController.checkAuth, itemsFromEmailsController.deleteSettings);

module.exports = router;