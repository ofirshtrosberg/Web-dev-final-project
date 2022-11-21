const categoriesService = require('../services/header');

async function getAllCategories(req, res) {
    try {
        const categories = await categoriesService.getAllCategories();
        return res.status(200).json(categories);

    } catch(e) {
        res.status(500).send(e);
    }
}

async function addCategory(req, res) {
    const categoryId = req.params.id;
    try {
        await categoriesService.addCategory(categoryId);
        res.status(200).send("OK");
    } catch (e) {
        if(e.toString().includes("duplicate key error"))
            res.status(400).send("Category already exists");
        else{
            res.status(500).send(e);
        }
    }
}

async function deleteCategory(req, res) {
    const categoryId = req.params.id;
    try {
        await categoriesService.deleteCategory(categoryId);
        res.status(200).send("OK");
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { getAllCategories, addCategory, deleteCategory }