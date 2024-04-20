const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "Order",
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);