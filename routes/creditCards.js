const express = require('express');
const usersController = require('../controllers/users');
const creditCardsController = require('../controllers/creditCards');
const router = express.Router();

router.use('/', usersController.authenticateUser);

router.get('/', creditCardsController.getCreditCard);
router.post('/', creditCardsController.addCreditCard);
router.put('/:cardId', creditCardsController.updateCreditCard);
router.delete('/:cardId', creditCardsController.deleteCreditCard);
  
module.exports = router;
