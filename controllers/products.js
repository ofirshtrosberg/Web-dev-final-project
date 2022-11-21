const headerService = require("../services/header");
const {
  getAllProducts,
  getProductById,
  getProductsByAttribute,
  getProductsBySearch,
  getProductsNames,
  deleteProductById,
  updateProductById,
  addProduct,
} = require("../services/products");
const userProductsService = require("../services/userProducts");
const awsService = require("../services/aws");
const { shoppingBagPage } = require("./shoppingBag");
const fs = require("fs");
const util = require("util");
const { redirect } = require("express/lib/response");
const unlinkFile = util.promisify(fs.unlink);

const uploadProductImg = async (req, res) => {
  const fileName = req.file.filename;
  const productId = req.params.id;
  const fileBuff = fs.createReadStream(req.file.path);

  try {
    const imgUrl = await awsService.uploadImgToS3(fileName, fileBuff);
    await unlinkFile(req.file.path);
    await updateProductById(productId, { imgUrl: imgUrl });
    res.redirect("/adminPanel");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const createProduct = async (req, res) => {
  const { name, price, category, color, description, isAvailable } = req.body;
  try {
    const newProductId = await addProduct(
      name,
      price,
      category,
      color,
      description,
      isAvailable
    );
    res.status(200).json({ id: newProductId });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updateObj = req.body;
  try {
    await updateProductById(productId, updateObj);
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await deleteProductById(id);
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const getProductsNamesByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await getProductsNames(category);
    res.status(200).json(products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const getProductsByQuery = async (req, res) => {
    const { category, search, color, page } = req.query;
    if (category || color) {
        const products = await getProductsByAttribute(
            parseInt(page),
            category,
            color
        );
        res.json(products);
        return;
    }
    if (search) {
        const products = await getProductsBySearch(search);
        res.json(products);
    }
};

const getProductsPage = async (req, res) => {
    try {
        const products = await getAllProducts();

    //need to determine how we get the categories
    const allCategories = await headerService.getAllCategories();

        if (req.session.userId != undefined) {
            res.render("productsPage.ejs", {
                products,
                AllCategories: allCategories,
                user: req.session.userId,
                username: req.session.username,
                isAdmin: req.session.isAdmin
            });
        } else {
            res.render("productsPage.ejs", {
                products,
                AllCategories: allCategories,
                user: false,
                isAdmin: false,
            });
        }
    } catch (e) {
        res.status(500).send(e);
    }
};

const getProductsPageByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

        const categoryProducts = await getProductsByAttribute(
            1,
            categoryName.toLowerCase()
        );

        const allCategories = await headerService.getAllCategories();

    if (req.session.userId != undefined) {
      res.render("productsPage.ejs", {
        products: categoryProducts,
        AllCategories: allCategories,
        user: req.session.userId,
        username: req.session.username,
        isAdmin: req.session.isAdmin,
      });
    } else {
      res.render("productsPage.ejs", {
        products: categoryProducts,
        AllCategories: allCategories,
        user: false,
        isAdmin: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(e);
  }
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await getProductById(productId);
    res.json(product);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const getProductPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await getProductById(productId);
    const allCategories = await headerService.getAllCategories();
    if (!product) {
      res.render("pageNotFound.ejs", {
        AllCategories: allCategories,
        user: req.session.userId,
        username: req.session.username,
        isAdmin: req.session.isAdmin,
      });
    } else if (req.session.userId != undefined) {
      res.render("productPage.ejs", {
        product,
        AllCategories: allCategories,
        user: req.session.userId,
        username: req.session.username,
        isAdmin: req.session.isAdmin,
      });
    } else {
      res.render("productPage.ejs", {
        product,
        AllCategories: allCategories,
        user: false,
        isAdmin: false,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userid = req.session.userId;
    const userShoppingBag = await userProductsService.getUesrProductList(
      userid,
      "shoppingBag"
    );
    if (!userShoppingBag) {
      await userProductsService.createUserProductList(userid, "shoppingBag");
    }
    const foundProduct = await userProductsService.findProductInList(
      userid,
      productId,
      "shoppingBag"
    );
    if (!foundProduct) {
      await userProductsService.addProductToList(
        userid,
        productId,
        "shoppingBag"
      );
    }
    // res.status(200).send()
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
const addProductToWishList = async (req, res) => {
  try {
    const { productId } = req.params;
    const userid = req.session.userId;
    const userShoppingBag = await userProductsService.getUesrProductList(
      userid,
      "wishList"
    );
    if (!userShoppingBag) {
      await userProductsService.createUserProductList(userid, "wishList");
    }
    const foundProduct = await userProductsService.findProductInList(
      userid,
      productId,
      "wishList"
    );
    if (!foundProduct) {
      await userProductsService.addProductToList(
        req.session.userId,
        productId,
        "wishList"
      );
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = {
  getProductsPage,
  getProductPage,
  getProductsByQuery,
  getProductsPageByCategory,
  addProductToCart,
  addProductToWishList,
  getProductsNamesByCategory,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  uploadProductImg,
};
