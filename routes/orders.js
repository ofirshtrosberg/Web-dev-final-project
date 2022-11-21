const express = require('express');
const ordersController = require('../controllers/orders');
const usersController = require('../controllers/users');
const router = express.Router();

router.use('/', usersController.authenticateUser);

router.get('/graphs', usersController.authenticateAdmin,  ordersController.ordersGraphPage);
router.get('/detailsForGraphs', usersController.authenticateAdmin, ordersController.getGraphsDetails);
router.get('/', ordersController.getAllOrdersForUser);
router.get('/getOrderPage/:id', ordersController.getOrderPage);
router.get('/getOrdersPage', ordersController.getOrdersPage);

module.exports = router;