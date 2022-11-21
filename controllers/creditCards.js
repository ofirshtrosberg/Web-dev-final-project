const creditCardsService = require('../services/creditCards')

async function getCreditCard(req, res) {
    const userId = req.session.userId;
    try {
        const cards = await creditCardsService.getCreditCard(userId);
        res.status(200).json(cards);
    } catch(e) {
        res.status(500).send(e);
    }
}

async function addCreditCard(req, res) {
    const userId = req.session.userId;
    const { cardType, cardNumber, cardCVV, cardExpirationDate, cardOwnerName, cardOwnerId } = req.body;
    try {
        await creditCardsService.addCreditCard(userId, cardType, cardNumber, cardCVV, cardExpirationDate, cardOwnerId, cardOwnerName);
        res.status(200).send("OK");
    } catch(e) {
        res.status(500).send(e);
    }
}

async function updateCreditCard(req, res) {
    const userId = req.session.userId;
    const cardId = req.params.cardId;
    try {
        await creditCardsService.updateCreditCard(userId, cardId, req.body);
        res.status(200).send("OK");
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function deleteCreditCard(req, res) {
    const userId = req.session.userId;
    const cardId = req.params.cardId;
    try {
        await creditCardsService.deleteCreditCard(userId, cardId);
        res.status(200).send("OK");
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = { addCreditCard, getCreditCard, deleteCreditCard, updateCreditCard }