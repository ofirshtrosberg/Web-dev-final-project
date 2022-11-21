const headerService = require('../services/header')
async function homepage(req, res){    
    try {
        const allCategories = await headerService.getAllCategories();
        if(req.session.userId != undefined){
            res.render('homePage.ejs', {
                AllCategories: allCategories,
                user: req.session.userId,
                username: req.session.username,
                isAdmin: req.session.isAdmin
            });
        }else
            res.render('homePage.ejs', {AllCategories: allCategories, isAdmin: false});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { homepage };