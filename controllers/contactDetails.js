const contactDetailsService = require('../services/contactDetails');

async function addContactDetails(req, res) {
    const userId = req.session.userId;
    const { description, phoneNumber, address } = req.body;

    try {
        await contactDetailsService.addContactDetails(userId, description, phoneNumber, address);
        res.status(200).send("OK");
    } catch(e) {
        res.status(500).send(e);
    }
}

async function updateContactDetails(req, res) {
    const updateObj = req.body;
    const id = req.params.contactDetailsId
    try {
        await contactDetailsService.updateContactDetails(id, updateObj);
        res.status(200).send("OK");
    } catch(e) {
        res.status(500).send(e);
    }
}

async function getAllContactDetails(req, res) {
    const userId = req.session.userId;
    try {
        const allContactDetails = await contactDetailsService.getAllContactDetails(userId);
        res.json(allContactDetails);
    } catch(e) {
        res.status(500).send(e);
    }
}

async function deleteContactDetails(req, res) {
    const contactDetailsId = req.params.contactDetailsId;
    try {
        await contactDetailsService.deleteContactDetails(contactDetailsId);
        res.status(200).send("OK");
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = { addContactDetails, updateContactDetails, getAllContactDetails, deleteContactDetails };