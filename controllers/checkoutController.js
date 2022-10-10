const addressModel = require('./../model/addressModel')

const User = require('./../model/addressModel')
const Cart = require('./../model/cartModel')
const products = require('./../model/adminmodels/product')
const orderModel = require('./../model/order')
const razorpayController = require('./../controllers/razorpayController')
const { rmSync } = require('fs')


exports.getcheckoutpage = async function (req, res, next) {
    let userId = req.session.userId
    let addressData = await addressModel.find({ userId: userId }).lean()
    // console.log(addressData, "for checkout pageg")
    let cartData = await Cart.findOne({ userId: userId }).populate('products.productId').lean()
    console.log("asasfdfhjjk;lkjhgfdsasdfghjklkjhgfdsasdfghjkjhgfdsdfghjkl")
    //  console.log(cartData, "cartData")
    res.render('checkOut', { userLoggedIn, addressData, cartData })
}

//..................................................................//
exports.getBillingAddres = async function (req, res, next) {
    try {
        let userId = req.session.userId
        let addressId = req.body.address
        console.log(addressId, "addressId")
        let address = await addressModel.findOne({ _id: addressId }).lean()
        // console.log(address, "addrsData")


        res.json({ message: "succecg vb hhhhhhhhhhgb gb gb vhgvcxb", address })
    }
    catch (error) {
        res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })
    }
}
//.......................................................................................................//
exports.confirmOrder = async function (req, res, next) {
    console.log(req.body.paymentmethod, "req.bodyhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    let userId = req.session.userId



    let cartData = await Cart.findOne({ userId: userId }).populate('products.productId')


    // console.log(cartData, "cartDaranweweeeeeeeeeee")

    const billingAddress = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        pincode: req.body.pincode,
        addres: req.body.address,
        city: req.body.city,
        state: req.body.state,
        landMark: req.body.landMark
    }
    const products = {
        product: cartData.products

    }


    orderData = await orderModel.create({
        userId: userId,
        billingAddress: billingAddress,
        products: cartData.products,
        grandTotal: cartData.grandTotal,
        paymentMethod: req.body.paymentmethod,
        status: 'pending'


    })
    console.log(orderData.grandTotal)
    totalAmount = orderData.grandTotal
    totalAmounts = totalAmount * 100

    orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();
    // console.log(req.session.orderId, "orderid")
    req.session.orderData = orderData
    //console.log("orderdata session", req.session)
    console.log(orderData.paymentMethod, "oppppp")
    // console.log(orderDataPopulated, "orderDataPopolated")
    if (orderData.paymentMethod == 'COD') {
        console.log("hello")
        req.session.orderData = null;
        req.session.confirmationData = { orderDataPopulated, totalAmount };
        res.json({ status: "COD", totalAmounts, orderData })
    } else {
        let orderData = req.session.orderData
        req.session.orderData = null;
        console.log("order data ajax:", orderData._id)
        console.log("amount data ajax:", totalAmounts)
        console.log("session data ajax:", req.session)
        razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)
        await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
        console.log("razordata returns;", razorData);
        razorId = process.env.RAZOR_PAY_ID;

        req.session.confirmationData = { orderDataPopulated, totalAmount };

        res.json({ message: 'success', totalAmounts, razorData, orderData })
    }
}
//................................................................................//
exports.verifyPay = async function (req, res, next) {
    console.log(req.body, "hihihihihihhhihhihh");
    success = await razorpayController.validate(req.body);
    if (success) {
        await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "success" });
        return res.json({ status: "true" });
    }
    else {
        await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
        return res.json({ status: "failed" });
    }
}

//...........................................................................................................//
exports.getCoD = async function (req, res, next) {
    const userId = req.session.userId

    res.render('orderConfirmation', { userLoggedIn })
}
//...........................................................................................................//
exports.viewallorders = async function (req, res, next) {
    const userId = req.session.userId
    console.log("hi")
    orderData = await orderModel.find({ userId: userId }).lean()
    console.log(orderData, "for view order")
}