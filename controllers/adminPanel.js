const awsService = require('../services/aws')
const headerService = require('../services/header')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

async function getAdminPanelPage(req, res){    
    try {
        const userId = req.session.userId;
        const allCategories = await headerService.getAllCategories();
        res.render('adminPanel.ejs', {AllCategories:allCategories, user: userId, username: req.session.username, isAdmin: req.session.isAdmin});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { getAdminPanelPage };