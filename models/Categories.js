const mongoose = require("mongoose");

const Category = new mongoose.Schema({
    _id: String
});

module.exports = mongoose.model("Category", Category);