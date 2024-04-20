const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }]
});

module.exports = mongoose.model("Order", orderSchema);
