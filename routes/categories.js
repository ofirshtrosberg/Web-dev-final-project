const express = require('express');
const router = express.Router(); 
const categoriesControler = require('../controllers/categories');
const usersController = require('../controllers/users');

router.use('/', usersController.authenticateUser);
router.use('/', usersController.authenticateAdmin);

router.get("/", categoriesControler.getAllCategories);
router.post("/:id", categoriesControler.addCategory);
router.delete("/:id", categoriesControler.deleteCategory);

module.exports = router;

