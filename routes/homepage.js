const express = require('express');
const homepageController = require('../controllers/homePage');
const router = express.Router();

router.get('/',  homepageController.homepage);

module.exports = router;