const express = require('express');
const contactUsController = require('../controllers/contactUs');
const router = express.Router();

router.get('/',  contactUsController.contactUsPage);

module.exports = router;