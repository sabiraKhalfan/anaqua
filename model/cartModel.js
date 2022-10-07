

const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        //required: true
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,

        },


    }],
    grandTotal: {
        type: Number,

    },
},

    { timeStamp: true })


const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart