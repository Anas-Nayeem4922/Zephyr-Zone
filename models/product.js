const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

});

module.exports = mongoose.model("Product", productSchema);