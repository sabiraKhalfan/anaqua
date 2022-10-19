const { timeStamp } = require('console');
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    billingAddress:
    {
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: Number,
        pincode: Number,
        address: String,
        city: String,
        state: String,
        landMark: String
    },
    products:

        [{
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
    grandTotal: Number,

    discountAmount: {
        type: Number,
        default: 0
    },
    subTotal:{
        type: Number
    },
    paymentMethod: String,
    status: String,



}, { timestamps: true })

const orderModel = mongoose.model('orders', orderSchema)
module.exports = orderModel;