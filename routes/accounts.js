const express = require('express');
const multer = require('multer');
const upload = require('../common')
const profilesController = require('../controllers/accounts');
const usersController = require('../controllers/users');
const router = express.Router();

router.use('/', usersController.authenticateUser);

router.get('/account', profilesController.getAccountPage);
router.delete('/deleteAccount', profilesController.deleteAccount); //!meybe delete/post?
router.post('/uploadProfile', upload.single("image"), profilesController.uploadProfilePicture);
router.put('/account', profilesController.updateAccount);
  
module.exports = router;
