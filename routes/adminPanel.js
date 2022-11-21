const express = require('express');
const multer = require('multer');
const upload = require('../common')
const adminPanelController = require('../controllers/adminPanel');
const usersController = require('../controllers/users');
const router = express.Router();

router.use('/', usersController.authenticateUser);
router.use('/', usersController.authenticateAdmin);

router.get('/', adminPanelController.getAdminPanelPage);

module.exports = router;
