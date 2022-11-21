const mongoose = require("mongoose");

const CreditCards = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cardType: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardCVV: {
    type: Number,
    required: true
  },
  cardExpirationDate: {
    type: String,
    required: true
  },
  cardOwnerName: {
    type: String,
    required: true
  },
  cardOwnerId: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model("CreditCards", CreditCards);

