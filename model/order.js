const { timeStamp } = require('console');
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    billingAddress: [
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
        }],
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
    orderId: String,
    paymentMethod: String,
    status: String,
    date: Date


})

const orderModel = mongoose.model('orders', orderSchema)
module.exports = orderModel;