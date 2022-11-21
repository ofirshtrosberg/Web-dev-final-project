const mongoose = require("mongoose");

const ContactDetails = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model("ContactDetails", ContactDetails);

