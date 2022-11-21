const express = require('express');
const shoppingBagController = require('../controllers/shoppingBag');
const usersController = require('../controllers/users');
const router = express.Router();

router.use("/", usersController.onlyUsersAuthentication);

router.get('/',  shoppingBagController.shoppingBagPage);
router.get('/deleteProduct', shoppingBagController.deleteProduct);//!maybe post/delete
router.post('/addOrder', shoppingBagController.addOrder);
module.exports = router;