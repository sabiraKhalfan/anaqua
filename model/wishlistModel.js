const mongoose = require("mongoose");


const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        // required:true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }


        }
    ]

});

const wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist;