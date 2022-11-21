const mongoose = require("mongoose");
const stores = new mongoose.Schema({
    name: String,
    location: {
        lat:{
            type: String,
            required: true,
        },
        lon:{
            type: String,
            required: true,
        }
    },
})

module.exports = mongoose.model("Stores", stores);