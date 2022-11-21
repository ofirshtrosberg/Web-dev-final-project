const express = require('express');
const usersController = require('../controllers/users');
const contactDetailsController = require('../controllers/contactDetails');
const router = express.Router();

router.use('/', usersController.authenticateUser);

router.get('/', contactDetailsController.getAllContactDetails);
router.post('/', contactDetailsController.addContactDetails);
router.put('/:contactDetailsId', contactDetailsController.updateContactDetails);
router.delete('/:contactDetailsId', contactDetailsController.deleteContactDetails);
  
module.exports = router;
