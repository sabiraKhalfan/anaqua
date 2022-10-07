const addressModel = require('./../model/addressModel')

const User = require('./../model/addressModel')
const Cart = require('./../model/cartModel')
const products = require('./../model/adminmodels/product')


exports.getcheckoutpage = async function (req, res, next) {
    let userId = req.session.userId
    let addressData = await addressModel.find({ userId: userId }).lean()
    console.log(addressData, "for checkout pageg")
    let cartData = await Cart.findOne({ userId: userId }).populate('products.productId').lean()
    console.log("asasfdfhjjk;lkjhgfdsasdfghjklkjhgfdsasdfghjkjhgfdsdfghjkl")
    console.log(cartData, "cartData")
    res.render('checkOut', { userLoggedIn, addressData, cartData })
}

//..................................................................//
exports.getBillingAddres = async function (req, res, next) {
    try {
        let userId = req.session.userId
        let addressId = req.body.address
        console.log(addressId, "addressId")
        let address = await addressModel.findOne({ _id: addressId }).lean()
        console.log(address, "addrsData")


        res.json({ message: "resposse ethi", address })
    }
    catch (error) {
        res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })
    }



}
