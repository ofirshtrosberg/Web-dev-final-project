const express = require('express');
const twitter = require('../controllers/twitter');
const router = express.Router();

router.post("/", twitter.newTweet)


module.exports = router;