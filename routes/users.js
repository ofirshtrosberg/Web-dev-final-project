const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();


// locahost:8081/users POST
router.post('/', usersController.addUser);
// locahost:8081/users/ GET
router.get('/', usersController.getUsers);
// locahost:8081/users/login POST
router.post('/login', usersController.login);
router.get('/logout', usersController.authenticateUser, usersController.logout);
router.get('/getUser', usersController.getUser);
router.put('/', usersController.authenticateUser, usersController.updateUser);
router.put('/role/:id', usersController.authenticateAdmin, usersController.updateRole);

module.exports = router;
