const storesService = require('../services/stores');
const headerService = require('../services/header')

async function getStoresPage (req, res){
    try{
    const allCategories = await headerService.getAllCategories();
    const storesNames = await storesService.storesNames();
    if(req.session.userId != undefined){
        res.render('storesPage.ejs', {
            AllCategories: allCategories,
            user: req.session.userId,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            storesNames: storesNames
        });
    }else
        res.render('storesPage.ejs', {AllCategories: allCategories, isAdmin: false, storesNames: storesNames});
    }
    catch (e) {
        res.status(500).send(e);
    }
       
}

async function getMarkers(req, res){
    try{
        const stores = await storesService.getMarkers();
        res.send(stores);
    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = { getStoresPage, getMarkers };
