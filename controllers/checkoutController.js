const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const addressModel = require('./../model/addressModel')
const Cart = require('./../model/cartModel')
const orderModel = require('./../model/order')
const Razorpay = require("razorpay");
const crypto = require("crypto");
const couponModel = require('./../model/adminmodels/coupon')
const { couponData } = require('./couponController')
exports.getcheckoutpage = async function (req, res, next) {
    try{
        let userId = req.session.userId
        let addressData = await addressModel.find({ userId: userId }).lean()
        // console.log(addressData, "for checkout pageg")
        let cartData = await Cart.findOne({ userId: userId }).populate('products.productId').lean()
       
        if (!cartData.products.length) return res.redirect('/cart')
    
        let couponData = await couponModel.find().lean()
       
        res.render('checkOut', { userLoggedIn, addressData, cartData, couponData })
    }catch(error){
        next(error)
    }

    
}

//..................................................................//
exports.getBillingAddres = async function (req, res, next) {
    try {
        let userId = req.session.userId
        let addressId = req.body.address
        console.log(addressId, "addressId")
        let address = await addressModel.findOne({ _id: addressId }).lean()
      


        res.json({ message: "success ", address })
    }
    catch (error) {
        res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })
    }
}
//.......................................................................................................//
exports.confirmOrder = async function (req, res, next) {
    const { paymentMethod, address } = req.body
    const userId = req.session.userId
    try {
        const billingAddress = await addressModel.findById(address)
        var { _id, products, grandTotal } = await Cart.findOne({ userId })
    


       // console.log(req.session.coupon,"req.session.coupon")
       let subTotal =grandTotal

        if(req.session.coupon){


            var discountAmount = req.session.coupon.discountAmount;
            var grandTotal =grandTotal- discountAmount;

            await couponModel.findOneAndUpdate({_id:req.session.coupon._id},{$set:{users:userId}})
        }
        
        if (paymentMethod == 'COD') {
            const newOrder = await new orderModel({ userId, billingAddress, products, grandTotal, subTotal,discountAmount, paymentMethod, status: 'placed' });
            newOrder.save()
            await Cart.findOneAndDelete({ userId: req.session.userId })
            req.session.confirmationData = {
                paymentMethod: "COD",
                totalAmount: newOrder.grandTotal,
            }
            res.json({ status: 'COD' });
            



        } 
        else {
            const newOrder = await new orderModel({ userId, billingAddress, products, grandTotal, discountAmount,subTotal,paymentMethod, status: 'placed' });
            newOrder.save()
             await Cart.findOneAndDelete({ userId: req.session.userId })
           // console.log(process.env.RAZOR_PAY_ID, process.env.RAZOR_PAY_SECRET_KEY)
            var instance = new Razorpay({
                key_id: process.env.RAZOR_PAY_ID,
                key_secret: process.env.RAZOR_PAY_SECRET_KEY,
            });
            var options = {
                amount: newOrder.grandTotal * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11"
            };
            instance.orders.create(options, function (err, order) {
            
                res.json({ order, id: newOrder._id },)
            });
           
        
    }

     
    } catch (error) {
        console.log(error)
    }

}
//................................................................................//
exports.verifyPay = async function (req, res, next) {
    console.log(req.body)
    try {

        if (req.body.failed) {
            await orderModel.findByIdAndDelete(req.body.id)

            return res.json({ message: "oops something went wrong" })
        }
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;


        const expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET_KEY)
            .update(body.toString())
            .digest('hex');
        //console.log("sig received ", req.body.response.razorpay_signature);
       // console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature) {
            response = { "signatureIsValid": "true" }
            await Cart.findOneAndDelete({ userId: req.session.userId })
            req.session.confirmationData = {
                paymentMethod: "online payment",
                totalAmount: req.body.rData.order.amount / 100,
            }
            res.json({ response: { status: true } });
        }
    } catch (error) {
        console.log(error)
    }
}

//...........................................................................................................//
exports.getCoD = async function (req, res, next) {
    try{
        const userId = req.session.userId
        const orderdata = req.session.confirmationData
      
    
        res.render('orderConfirmation', { userLoggedIn, orderdata })
    }catch(error){
        next(error)
    }
    
}
//...........................................................................................................//
exports.viewallorders = async function (req, res, next) {
    try{  const userId = req.session.userId

        orderData = await orderModel.find({ userId: userId }).populate('products.productId').lean()
        for (let i = 0; i < orderData.length; i++) {
            if (orderData[i].status == "cancelled")
                orderData[i].cancelled = true;
            else if (orderData[i].status == "delivered") {
                orderData[i].delivered = true;
            }
    
        }
       
        res.render('viewMyOrders', { userLoggedIn, orderData })
    }catch (error)
    {
        next(error)
    }

    }
  
//................................................................................................................//
exports.viewOrderDetails = async function (req, res, next) {
    try{
        const userId = req.session.userId
        orderId = req.params.id
   
        orderData = await orderModel.findOne({ _id: orderId }).populate('products.productId').lean()
      
   // console.log(orderData,"orderDataaaaaaaaaaaaaaaaaaa")
        res.render('viewDetailOrder', { userLoggedIn, orderData })
    } catch(error)
    {
        next(error)
    }
  
}
//...........................................................................................................//
exports.cancelOrder = async function (req, res, next) {
    try{
        const orderId = req.params.id
   
        await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: 'cancelled' } })
        res.redirect('/vieworders')
    }catch(error){
        next(error)
    }
    
}
//.......................................................................................//



