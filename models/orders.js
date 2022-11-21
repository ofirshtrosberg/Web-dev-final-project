const mongoose = require("mongoose");
const order = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    products: {
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    cardId:{
        type: [mongoose.Schema.Types.ObjectId],
        required:true,
    },   
    contactDetails:{
        type: mongoose.Schema.Types.ObjectId,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("order", order);