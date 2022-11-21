const express = require('express');
const stores = require('../controllers/stores');
const router = express.Router();

router.get('/', stores.getStoresPage)
router.get('/markers', stores.getMarkers)

module.exports = router;