const headerService = require('../services/header')
async function contactUsPage(req, res){    
    try {
        const allCategories = await headerService.getAllCategories();
        const isAdmin = (req.session.role != undefined)? req.session.role:false;
        if(req.session.userId != undefined){
            res.render('contactUs.ejs', {AllCategories: allCategories, user: req.session.userId, username: req.session.username, isAdmin: isAdmin});
        }else
            res.render('contactUs.ejs', {AllCategories: allCategories, isAdmin: isAdmin});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { contactUsPage };