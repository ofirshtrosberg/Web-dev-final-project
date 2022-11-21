const UserProducts = require("../models/userProducts");
const Product = require("../models/product");
const User = require("../models/users");
const userProducts = require("../models/userProducts");
const productService = require("./products");


var ObjectId = require("mongoose").Types.ObjectId;

async function getUserProducts(userid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const userProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType: productsListType,
  }).select("-_id -userid -productsListType");
  const user_products_arr = userProducts["products"];
  var products_details = [];
  for (let i = 0; i < user_products_arr.length; i++) {
    var found_product = await Product.findOne({ _id: user_products_arr[i] });
    if (found_product) {
      products_details.push(found_product);
    }
  }
  return products_details;
}

async function getUesrProductList(userid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const userProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType,
  });
  return userProducts;
}
async function getUesrProductListProducts(userid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const userProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType,
  }).select("products -_id");
  return userProducts;
}

async function createUserProductList(userid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const userProductList = new userProducts({
    productsListType,
    userid: userObjectId,
    products: [],
    totalPrice: 0,
  });
  await userProductList.save();
}
async function findProductInList(userid, productid, productsListType) {
  const userObjectId = new ObjectId(userid);
  // maybe cast is not needed
  const userProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType: productsListType,
  }).select("-_id -userid -productsListType");
  const user_products_arr = userProducts["products"];
  for (let i = 0; i < user_products_arr.length; i++) {
    if (productid == user_products_arr[i]) return true;
  }
  return false;
}
async function getTotalPrice(userid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const userProductsList = await UserProducts.findOne({
    userid: userObjectId,
    productsListType,
  }).select("products -_id");
  const userProductsListIds = userProductsList["products"];
  var totalPrice = 0;
  for (let index = 0; index < userProductsListIds.length; index++) {
    const productId = userProductsListIds[index];
    const productPrice = await productService.getProductPrice(productId);
    totalPrice += productPrice;
  }
  return totalPrice;
}
async function addProductToList(userid, productid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const productObjectId = new ObjectId(productid);
  const isProductExsist = await Product.findOne({ _id: productObjectId });
  if (isProductExsist) {
    // should handle a case where the userId is not already in this collection
    await UserProducts.updateOne(
      { userid: userObjectId, productsListType },
      { $push: { products: productObjectId } }
    );
  }
}
async function deleteProduct(userid, productid, productsListType) {
  const userObjectId = new ObjectId(userid);
  const productObjectId = new ObjectId(productid);

  const userProductsListId = await UserProducts.findOne({
    userid: userObjectId,
    productsListType: productsListType,
  }).select("_id");
  await UserProducts.updateOne(
    { _id: userProductsListId["_id"] },
    { $pull: { products: productObjectId } }
  );

  // return the left products and the totalPrice
  var foundUserProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType: productsListType,
  }).select("-_id -productsListType -userid");


  const user_products_arr = foundUserProducts["products"];
  var products_details = [];
  for (let i = 0; i < user_products_arr.length; i++) {
    var found_product = await Product.findOne({ _id: user_products_arr[i] });
    if (found_product) {
      products_details.push(found_product);
    }
  }
  const totalPrice = await getTotalPrice(userid, productsListType);
  const result = { products: products_details, totalPrice: totalPrice };
  return result;
}
async function deleteShoppingBag(userid) {
  const userObjectId = new ObjectId(userid);
  const userProducts = await UserProducts.findOne({
    userid: userObjectId,
    productsListType: "shoppingBag",
  });
  const productIds = userProducts["products"];
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    await Product.findOneAndUpdate(
      { _id: productId },
      { isAvailable: false, price: 0 }
    );
  }
  await userProducts.deleteOne({
    userid: userObjectId,
    productsListType: "shoppingBag",
  });
}
async function watchProduct(userid, productid) {}
module.exports = {
  getUserProducts,
  getUesrProductList,
  getUesrProductListProducts,
  createUserProductList,
  findProductInList,
  getTotalPrice,
  addProductToList,
  deleteProduct,
  watchProduct,
  deleteShoppingBag,
};
