const Product = require("../models/product");
var ObjectId = require("mongoose").Types.ObjectId;

const page = 1;
const itemsPerPage = 50;

async function deleteProductById(id) {
    await Product.findByIdAndDelete(id);
}

async function addProduct(name, price, category, color, description, isAvailable) {
    const product = new Product({
        name: name,
        price: price,
        category: category,
        description: description,
        color: color,
        isAvailable: isAvailable
    });

    await product.save();
    return product._id;
}

async function getProductsNames(category) {
    const products = await Product.find({ category: category }).select("name");
    return products;
}


async function getAllProducts(page = 1) {
    const products = await Product.find().skip((page - 1) * itemsPerPage).limit(itemsPerPage)
    const productsWithSimpleId = products.map(product => {
        return JSON.parse(JSON.stringify(product._doc))
    })
    return productsWithSimpleId;
}

async function getProductsByAttribute(page, categoryName, color) {
    if (color && color !== 'all' && categoryName) {
        const products = await Product.find({
            category:
                { $regex: categoryName, $options: 'i' }, color
        }).skip((page - 1) * itemsPerPage).limit(itemsPerPage)
        return products;
    }
    if (categoryName) {
        const products = await Product.find({
            category:
                { $regex: categoryName, $options: 'i' }
        }).skip((page - 1) * itemsPerPage).limit(itemsPerPage)
        return products;
    }
    if (color && color !== 'all') {
        const products = await Product.find({ color }).skip((page - 1) * itemsPerPage).limit(itemsPerPage)
        return products;
    }

    const allProducts = await getAllProducts(page)
    return allProducts;
}

async function getProductById(productId) {
    const product = await Product.findById(productId)
    return product;
}

async function getProductsBySearch(searchValue) {
    const query = {
        $or: [{ name: { $regex: searchValue, $options: 'i' } },
        { description: { $regex: searchValue, $options: 'i' } }]
    }
    const products = await Product.find(query).skip((page - 1) * itemsPerPage).limit(itemsPerPage)
    return products
}

async function updateProductById(productId, updateObj) {
    await Product.findByIdAndUpdate(productId, updateObj);
}
async function getProductPrice(productId){
    const productObjectId = new ObjectId(productId);
    const foundProduct = await Product.findOne({_id: productObjectId});
    if(foundProduct)
        return foundProduct["price"];
    else
        return 0;
}
module.exports = { addProduct, getAllProducts, getProductById, getProductsByAttribute, getProductsBySearch, getProductsNames, deleteProductById, updateProductById, getProductPrice }