const mongoose = require("mongoose");

const userProducts = new mongoose.Schema({
    productsListType: {
        type: String,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
}, {
    versionKey: false
}
);

module.exports = mongoose.model("userProducts", userProducts);