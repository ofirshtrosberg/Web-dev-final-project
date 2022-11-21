const headerService = require('../services/header')
const userProductsService = require("../services/userProducts");
const productsService = require("../services/products");
const contactDetailsService = require("../services/contactDetails");
const ordersService = require("../services/orders");
const orders = require('../models/orders');

async function ordersGraphPage(req, res) {
    try {
        const allCategories = await headerService.getAllCategories();
        if (req.session.userId != undefined) {
            res.render('ordersGraph.ejs', { AllCategories: allCategories, user: req.session.userId, username: req.session.username, isAdmin: req.session.isAdmin });
        } else
            res.render('ordersGraph.ejs', { AllCategories: allCategories, isAdmin: false });
    }
    catch (e) {
        res.status(500).send(e);
    }
}

async function getOrdersPage(req, res) {
    try {
        const allCategories = await headerService.getAllCategories();
        res.render('ordersPage.ejs', { AllCategories: allCategories, user: req.session.userId, username: req.session.username, isAdmin: req.session.isAdmin });
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getOrderPage(req, res) {
    const orderId = req.params.id;
    try {
        const order = await ordersService.getOrderById(orderId);
        const allCategories = await headerService.getAllCategories();
        const products = await Promise.all(order.products.map(id => productsService.getProductById(id)));
        res.render('order.ejs', {AllCategories: allCategories, user: req.session.userId, username: req.session.username, isAdmin: req.session.isAdmin, order: order, products: products});
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getAllOrdersForUser(req, res) {
    const userId = req.session.userId;
    try {
        const orders = await ordersService.getAllOrdersForUser(userId);
        res.status(200).json(orders);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function getOrdersTotalPriceByMonthAndYear(req, res) {
    var ordersPrices;
    try {
        ordersPrices = await ordersService.getOrdersTotalPriceByMonthAndYear();
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
    return ordersPrices;
}
async function getOrdersTotalPriceByYear(req, res) {
    var ordersAmounts;
    try {
        ordersAmounts = await ordersService.getOrdersTotalPriceByYear();
    }
    catch (e) {
        res.status(500).send(e);
    }
    return ordersAmounts;
}

async function getGraphsDetails(req, res) {
    var graphsDetails = [];
    var ordersPricesForMonthAndYear;
    var ordersPricesForYear;
    try {
        ordersPricesForMonthAndYear = await getOrdersTotalPriceByMonthAndYear(req, res);
        ordersPricesForYear = await getOrdersTotalPriceByYear(req, res);
    }
    catch (e) {
        res.status(500).send(e);
    }
    graphsDetails.push(ordersPricesForMonthAndYear);
    graphsDetails.push(ordersPricesForYear);
    res.json(graphsDetails);
}
module.exports = { ordersGraphPage, getAllOrdersForUser, getOrdersTotalPriceByYear, getOrdersTotalPriceByMonthAndYear, getGraphsDetails, getOrderPage, getOrdersPage };