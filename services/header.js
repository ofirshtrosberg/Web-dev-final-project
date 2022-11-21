const Category = require("../models/Categories");
const Product = require("../models/product");

async function getAllCategories() {
    const allCategories = await Category.find().select('_id');
    //other option- get from products:
    // const allCategories = await Product.collection.distinct('category')
    return allCategories;
}

async function addCategory(id) {
    const category = new Category({_id: id});
    await category.save();
}

async function deleteCategory(id) {
    await Category.findByIdAndDelete(id);
}

module.exports = { getAllCategories, addCategory, deleteCategory }