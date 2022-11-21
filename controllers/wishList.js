const headerService = require("../services/header");
const userProductsService = require("../services/userProducts");

async function wishListPage(req, res) {
  try {
    const userid = req.session.userId;
    const allCategories = await headerService.getAllCategories();
    if (req.session.userId != undefined) {
      const userWishList = await userProductsService.getUesrProductList(
        userid,
        "wishList"
      );
      if (!userWishList) {
        await userProductsService.createUserProductList(userid, "wishList");
      }
      const wishListProducts = await userProductsService.getUserProducts(
        req.session.userId,
        "wishList"
      );

      res.render("wishList.ejs", {
        AllCategories: allCategories,
        user: req.session.userId,
        username: req.session.username,
        WishListProducts: wishListProducts,
        isAdmin: req.session.isAdmin
      });
    } else
      res.render("wishList.ejs", {
        AllCategories: allCategories,
        WishListProducts: [],
        isAdmin: false
      });
  } catch (e) {
    res.status(500).send(e);
  }
}
async function deleteProduct(req, res) {
  const { productToDelete } = req.query;
  try {
    const productsAfterDelete = await userProductsService.deleteProduct(
      req.session.userId,
      productToDelete,
      "wishList"
    );
    res.json(productsAfterDelete);
  } catch (e) {
    res.status(500).send(e);
  }
}
async function addProductToBag(req, res) {
  const { productToAdd } = req.query;
  try {
    const userid = req.session.userId;
    const userShoppingBag = await userProductsService.getUesrProductList(
      userid,
      "shoppingBag"
    );
    if (!userShoppingBag) {
      await userProductsService.createUserProductList(userid, "shoppingBag");
    }
    const foundProduct = await userProductsService.findProductInList(userid, productToAdd, "shoppingBag");
    if (!foundProduct) {
      await userProductsService.addProductToList(req.session.userId, productToAdd, "shoppingBag");
    }
    res.status(200);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = { wishListPage, deleteProduct, addProductToBag };
