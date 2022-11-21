const express = require('express');
const wishListController = require('../controllers/wishList');
const usersController = require('../controllers/users');
const router = express.Router();

router.use("/", usersController.onlyUsersAuthentication);

router.get('/',  wishListController.wishListPage);
router.get('/deleteProduct', wishListController.deleteProduct);//!meybe delete/post
router.get('/addProduct', wishListController. addProductToBag);//!maybe post
module.exports = router;