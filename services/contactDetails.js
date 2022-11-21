const ContactDetails = require("../models/contactDetails");

async function addContactDetails(userId, description, phoneNumber, address) {
    const contactDetails = new ContactDetails(
                                    {userId: userId, 
                                    description: description,  
                                    phoneNumber: phoneNumber, 
                                    address: address});
    await contactDetails.save();
    return contactDetails;
}

async function deleteContactDetails(contactDetailsId) {
    await ContactDetails.deleteOne({_id: contactDetailsId});
}

async function updateContactDetails(contactDetailsId, updateObj) {
    await ContactDetails.findOneAndUpdate({_id: contactDetailsId}, updateObj);
}

async function getContactDetailsById(id) {
    return await ContactDetails.findById(id);
}

async function getContactDetailsForUser(userId) {
    const contactDetails = await ContactDetails.find({userId: userId});
    return contactDetails;
}

async function getAllContactDetails(userId) {
    return await ContactDetails.find({userId: userId});
}

module.exports = { addContactDetails, deleteContactDetails, updateContactDetails, getContactDetailsForUser, getAllContactDetails, getContactDetailsById };

