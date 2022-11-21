const express = require('express');
const productsController = require('../controllers/products');
const usersController = require('../controllers/users');
const productsRouter = express.Router();
const multer = require('multer'); 
const upload = require('../common')

productsRouter.get('/', productsController.getProductsPage);

productsRouter.get('/query', productsController.getProductsByQuery);
productsRouter.get('/category/:categoryName', productsController.getProductsPageByCategory);
productsRouter.get('/addToCart/:productId', productsController.addProductToCart);
productsRouter.get('/addToWishList/:productId', productsController.addProductToWishList)

productsRouter.get('/:id', productsController.getProductPage); 
productsRouter.get('/:id/addToCart/:productId',usersController.onlyUsersAuthentication, productsController.addProductToCart);
productsRouter.get('/:id/addToWishList/:productId',usersController.onlyUsersAuthentication, productsController.addProductToWishList);
productsRouter.get('/getProductsNames/:category', productsController.getProductsNamesByCategory);
productsRouter.get('/product/:id', productsController.getProduct);
productsRouter.delete('/:id', usersController.authenticateAdmin, productsController.deleteProduct);
productsRouter.put('/:id', usersController.authenticateAdmin, productsController.updateProduct);
productsRouter.post('/product', usersController.authenticateAdmin, productsController.createProduct);
productsRouter.post('/uploadImg/:id', usersController.authenticateAdmin, upload.single("image"), productsController.uploadProductImg)

module.exports = productsRouter;
