const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
        //required:[true,'A user must have a name']

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        //required: true
    },
    description: {
        type: String
    }, stock: {
        type: Number,
        // required: true
    },
    price: {
        type: Number
        //required: true,
    },
    sellingprice: {
        type: Number
    },
    image: {
        type: Array
    }

},
    { timestamps: true },
);



const Product = mongoose.model('Product', productSchema)

module.exports = Product;
