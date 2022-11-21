const express = require('express');
const aboutUsController = require('../controllers/aboutUs');
const router = express.Router();

router.get('/',  aboutUsController.aboutUsPage);

module.exports = router;