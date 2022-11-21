const accountsService = require('../services/accounts')
const usersService = require('../services/users')
const awsService = require('../services/aws')
const contactDetailsService = require('../services/contactDetails')
const headerService = require('../services/header')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);


async function getAccountPage(req, res){    
    try {
        const userId = req.session.userId;
        var account = await accountsService.getAccountByUserId(userId);
        const allCategories = await headerService.getAllCategories();
        var contactDetails = await contactDetailsService.getContactDetailsForUser(userId);
        if(!account) {
            account = await accountsService.addAccount(userId);
        }
        res.render('account.ejs', {AllCategories:allCategories, account: account, user: userId, username: req.session.username, contactDetails: contactDetails, isAdmin: req.session.isAdmin});
    }
    catch (e) {
        res.status(500).send(e);
    }
}

async function deleteAccount(req, res) {
    try {
        const userId = req.session.userId;
        await accountsService.deleteAccount(userId);
        await usersService.deleteUser(userId);
        req.session.destroy();
        res.status(200).send("OK");
    }
    catch(e) {
        res.status(500).send(e);
    }
}

async function uploadProfilePicture(req, res) {
    const fileName = req.file.filename;
    const userId = req.session.userId;
    const fileBuff = fs.createReadStream(req.file.path);

    try {
        const imgUrl = await awsService.uploadImgToS3(fileName, fileBuff);
        await unlinkFile(req.file.path);
        await accountsService.updateAccount(userId, {profilePictureUrl: imgUrl});
        res.redirect('/accounts/account');
    }
    catch(e) {
        res.status(500).send(e);
    }
}

async function updateAccount(req, res) {
    const updateObj = req.body;
    const userId = req.session.userId;

    try{
        await accountsService.updateAccount(userId, updateObj);
        res.status(200);
    }
    catch(e) {
        res.status(500).send(e);
    }

}

module.exports = { getAccountPage, deleteAccount, uploadProfilePicture, updateAccount };