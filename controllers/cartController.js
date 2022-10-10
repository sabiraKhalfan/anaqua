const express = require('express')
const mongoose = require('mongoose');
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product');
const Cart = require('../model/cartModel');
const { response } = require('express');
const total = require('../controllers/cartFunctions/subTotal');
const { request } = require('http');
const { totalmem } = require('os');
const { findOne } = require('../model/usermodel');

exports.viewCart = async function (req, res, next) {
    let user_Id = req.session.userId;
    const cart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()

    console.log(cart, 'cart');
    res.render('cart', { cart })
}




//........................................................................................................//

exports.viewShop = async function (req, res, next) {
    res.render('product')
}

//.........................................................................................................//

exports.addTocart = async function (req, res) {
    try {
        console.log(req.session);
        let user_Id = req.session.userId;
        const productId = req.body.productId;
        const oldprod = await product.findById(productId)
        const total = (oldprod.sellingprice * req.body.quantity)
        const oldCart = await Cart.findOne({ userId: user_Id })

        if (oldCart) {
            const grandTotal = oldCart.products.reduce((acc, crr) => {
                return acc + crr.total
            }, 0)
            const oldProduct = oldCart.products.find(e => e.productId == productId)

            if (oldProduct) {
                if (oldProduct.quantity == 1 && req.body.quantity == -1) {
                    console.log('pull');
                    await Cart.updateOne({ 'products.productId': productId }, { "$pull": { products: { '_id': oldProduct._id } } })
                    await Cart.findByIdAndUpdate(oldCart._id, { $inc: { grandTotal: total } })
                } else {

                    const cart = await Cart.updateOne({ 'products.productId': productId }, { '$inc': { 'products.$.quantity': req.body.quantity, 'products.$.total': total } })
                    await Cart.findByIdAndUpdate(oldCart._id, { $inc: { grandTotal: total } })
                    console.log(cart)
                }


            } else {

                const products = {
                    productId: productId,
                    quantity: req.body.quantity,
                    total: total
                }
                const cart = await Cart.findByIdAndUpdate(oldCart._id, { $push: { products: products }, $inc: { grandTotal: total } })
            }
        } else {

            const products = {
                productId: productId,
                quantity: req.body.quantity,
                total: total
            }

            const cart = await new Cart({ userId: user_Id, products, grandTotal: total })
            cart.save()
            console.log(cart)
        }
        const cartData = await Cart.findOne({ userId: user_Id }).lean()
        console.log(cartData, "gdataTotal")
        const oldProduct = cartData.products.find(e => e.productId == productId)
        res.json({ status: "success", productTotals: cartData.grandTotal, total: oldProduct.total })

    }

    catch (error) {
        console.log(error)

        // res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })

    }

}
//.................................................................................................................//
exports.removeProduct = async function (req, res) {
    try {
        const userId = req.session.userId

        const productId = req.body.product

        console.log(productId, "productID");

        const pullAmount = await Cart.findOne({ userId: userId, "products.productId": productId }).populate("products.productId").lean();
        console.log(pullAmount,
            'qwertyuioasdfghjkdfghjkghj');
        const substractPrice = pullAmount.products[req.body.index].total;
        newGrandTotal = pullAmount.grandTotal - substractPrice;
        await Cart.findOneAndUpdate({ userId: userId }, { grandTotal: newGrandTotal });
        await Cart.updateOne({
            userId: userId
        }, {
            $pull: {
                products: {
                    productId: productId,

                }

            }
        })

        // console.log(pullAmount, "pullAmount")
        // if (pullAmount) {
        //     const deletecart = await pullAmount.products.find(e => e.products == productId)
        //     console.log(deletecart, "deletecrt")
        //     const grandTotal = deletecart.total 
        //     console.log(grandTotal, "grandtotal")
        //     await Cart.findByIdAndUpdate(pullAmount._id, { $inc: { grandTotal } })

        // }
        // else {

        // }

        return res.status(200).json({ message: 'server success' })

    } catch (error) {
        return res.status(401).json({ message: 'server failure' })
    }
}

//................................................................................................//

// exports.removeProduct = async (req, res, next) => {
//     try {

//         const productId = req.body.productId
//         const userId = req.session.userId
//         const pullAmount = await Cart.findOne({ userId: userId }).populate({ path: 'products' })
//         console.log(pullAmount, "pullAmount")
//         const cart = await Cart.updateOne({ userId: userId }, { $pull: { 'products.productId': { productId: req.body.productId } } })
//         const deletecart = await pullAmount.products.find(e => e.products == productId)
//         console.log(deletecart, "deletecart")
//         const grandTotal = deletecart.total * -1
//         console.log(grandTotal, "grandtotal")
//         await Cart.findByIdAndUpdate(pullAmount._id, { $inc: { total } })

//         //console.log(deletecart.price);
//         res.json({ message: "deleted successfully" })
//     } catch (error) {
//         return res.status(401).json({ message: 'server failure' })


//     }
// }








