const mongoose = require("mongoose");

// represents the Products collection 
const Product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: false
  },
  isAvailable: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("products", Product);

