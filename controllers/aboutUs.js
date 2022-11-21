const headerService = require('../services/header')

async function aboutUsPage(req, res){    
    try {
        const allCategories = await headerService.getAllCategories();
        const isAdmin = (req.session.role != undefined)? req.session.role:false;
        if(req.session.userId != undefined){
            res.render('aboutUs.ejs', {AllCategories: allCategories, user: req.session.userId, username: req.session.username, isAdmin: isAdmin});
        }else
            res.render('aboutUs.ejs', {AllCategories: allCategories, isAdmin: isAdmin});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { aboutUsPage };