const Account = require("../models/accounts");


async function getAccountByUserId(userId) {
    const account = await Account.findOne({ userId: userId}).exec();
    return account;
}

async function addAccount(userId) {
    const account = new Account({ userId: userId });
    await account.save();
    return account;
}

async function deleteAccount(userId) {
    await Account.deleteOne({userId: userId});
}

async function updateAccount(userId, updateObj) {
    await Account.findOneAndUpdate({userId: userId}, {$set : updateObj}).exec();
}

module.exports = { getAccountByUserId, addAccount, deleteAccount, updateAccount };