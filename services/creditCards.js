const CreditCard = require("../models/creditCards");

async function addCreditCard(userId, cardType, cardNumber, cardCVV, cardExpirationDate, cardOwnerId, cardOwnerName) {
    const creditCard = new CreditCard({
        userId: userId, 
        cardType: cardType,
        cardNumber: cardNumber, 
        cardCVV: cardCVV,
        cardExpirationDate: cardExpirationDate, 
        cardOwnerId: cardOwnerId,
        cardOwnerName: cardOwnerName
    });
    await creditCard.save();
    return creditCard["_id"];
}

async function updateCreditCard(userId, creditCardId, updateObj) {
    const filter = {_id: creditCardId, userId: userId};
    await CreditCard.findOneAndUpdate(filter, updateObj);
}

async function getCreditCard(userId) {
    const filter = {userId: userId};
    const card = await CreditCard.find(filter);
    return card;
}

async function deleteCreditCard(userId, cardId) {
    const filter = {_id: cardId, userId: userId};
    await CreditCard.findOneAndDelete(filter);
}

module.exports = { addCreditCard, updateCreditCard, getCreditCard, deleteCreditCard }