const headerService = require("../services/header");
const userProductsService = require("../services/userProducts");
const creditCardsService = require("../services/creditCards");
const orderService = require("../services/orders");
const contactDetailsService = require("../services/contactDetails");
var ObjectId = require("mongoose").Types.ObjectId;
async function shoppingBagPage(req, res) {
  try {
    const allCategories = await headerService.getAllCategories();
    const userid = req.session.userId;
    if (req.session.userId != undefined) {
      const userShoppingBag = await userProductsService.getUesrProductList(userid, "shoppingBag");
      if (!userShoppingBag) {
        await userProductsService.createUserProductList(userid, "shoppingBag");
      }
      const totalPrice = await userProductsService.getTotalPrice(userid, "shoppingBag");
      const shoppingBagProducts = await userProductsService.getUserProducts(
        req.session.userId,
        "shoppingBag"
      );
      const contactDetails = await contactDetailsService.getContactDetailsForUser(userid);
      
      const isAdmin = (req.session.role != undefined)? req.session.role:false;
      res.render("shoppingBag.ejs", {
        AllCategories: allCategories,
        user: req.session.userId,
        username: req.session.username,
        ShoppingBagProducts: shoppingBagProducts,
        TotalPrice: totalPrice,
        isAdmin: req.session.isAdmin,
        ContactDetails: contactDetails,
      });
    } else
      res.render("shoppingBag.ejs", {
        AllCategories: allCategories,
        ShoppingBagProducts: [],
        TotalPrice: 0,
        isAdmin: false,
        ContactDetails: [],
      });
  } catch (e) {
    res.status(500).send(e);
  }
}
async function deleteProduct(req, res) {
  const { productToDelete } = req.query;
  try {
    const productsAfterDelete = await userProductsService.deleteProduct(req.session.userId, productToDelete, "shoppingBag");
    res.json(productsAfterDelete);
  } catch (e) {
    res.status(500).send(e);
  }
}
async function addOrder(req, res) {
  const userid = req.session.userId;
  const { cardType, cardNumber, cardCVV, expirationDate, ownerFullName, ownerId, contactDetails} = req.body;
  try {
    const cardId = await creditCardsService.addCreditCard(userid, cardType, cardNumber, cardCVV, expirationDate, ownerId, ownerFullName);
    const products = await userProductsService.getUesrProductListProducts(userid, "shoppingBag");
    const productsIds = products["products"];
    const totalPrice = await userProductsService.getTotalPrice(userid,"shoppingBag");
    await userProductsService.deleteShoppingBag(userid);
   
    await orderService.createOrder(userid, productsIds,totalPrice, cardId, contactDetails);
    
  } catch (e) {
    res.status(500).send(e);
  }
  res.redirect("/shoppingBag");
}
module.exports = { shoppingBagPage, deleteProduct, addOrder };
