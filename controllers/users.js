const usersService = require('../services/users')
const headerService = require('../services/header')


async function authenticateAdmin(req, res, next) {
    const isAdmin = req.session.isAdmin;

    if (!isAdmin) {
        res.status(403).send("you are not allowed to get here");
    } else {
        next();
    }
}

async function onlyUsersAuthentication(req, res, next) {
    const isAdmin = req.session.isAdmin;
    // const { isAdmin } = req.session;

    if (isAdmin || (req.session.userId == undefined)) {
        const allCategories = await headerService.getAllCategories();
        res.render("pageNotFound.ejs", { AllCategories: allCategories, isAdmin: false })
    } else {
        next();
    }
}

async function authenticateUser(req, res, next) {
    const userId = req.session.userId;
    if (userId != undefined) {
        try {
            const user = await usersService.getUser({ _id: userId });
            if (user) {
                next();
            }
            else
                res.status(403).send("you are not allowed to get here");
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
    else {
        res.status(403).send("you are not allowed to get here");
    }
}

async function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

async function addUser(req, res) {
    const { username, password, role } = req.body;
    try {
        const newUser = await usersService.addUser(username, password, role);
        req.session.userId = newUser._id;
        req.session.username = newUser.username;
        res.redirect('/');
    }
    catch (e) {
        res.status(500).send(e);
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    const user = await usersService.getUserByUsernameAndPassword(username, password);
    if (user) {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAdmin = user.role.includes("admin");
        res.send("OK");
    }
    else
        res.status(401).send("user not found");
}

async function getUsers(req, res) {
    try {
        const users = await usersService.getUsers();
        users.map(user => delete user["password"]);
        res.json(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
}

async function getUser(req, res) {
    let filters = {};
    if (req.query.id)
        filters = { _id: req.query.id };
    if (req.query.username)
        filters = { ...filters, ...{ username: req.query.username } };

    try {
        const user = await usersService.getUser(filters);
        if (user) {
            delete user["password"];
            res.json(user);
        }
        else
            res.json({});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

async function updateUser(req, res) {
    const userId = req.session.userId;
    const { username, password, role } = req.body;

    try {
        await usersService.updateUser(userId, username, password, role);
        res.status(200).send('OK');
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

async function updateRole(req, res) {
    const userId = req.params.id;
    const role = req.body.role;
    const updateObj = {role: [role] }
    try {
        await usersService.updateRoleById(userId, updateObj);
        res.status(200).send('OK');
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

module.exports = { addUser, getUsers, getUser, updateUser, login, logout, authenticateUser, authenticateAdmin, updateRole, onlyUsersAuthentication };
