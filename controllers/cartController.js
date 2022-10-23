const express = require('express')
const mongoose = require('mongoose');
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product');
const Cart = require('../model/cartModel');
const { response } = require('express');
const { request } = require('http');
const { totalmem } = require('os');
const { findOne } = require('../model/usermodel');

exports.viewCart = async function (req, res, next) {
    try{
        let user_Id = req.session.userId;
        let userLoggedIn = req.session.loggedIn
        const cart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()
            
       // console.log(cart, 'cart');
        res.render('cart', { cart,userLoggedIn })
    }
    catch (error)
    {
        next(error)
    }
   
}




//........................................................................................................//

exports.viewShop = async function (req, res, next) {
    try{
        const products = await product.find().populate('category').lean()
        res.render('product', { products })
    }catch (error)
    {
        next (error)
    }
   
}

//.........................................................................................................//

exports.addTocart = async function (req, res) {
    try {
        // console.log(req.session);
        console.log(req.body, "requestbody")
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
                    return res.json({ pull: true })
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

        }
        const cartData = await Cart.findOne({ userId: user_Id }).lean()
        const oldProduct = cartData.products.find(e => e.productId == productId)
        res.json({ status: "success", productTotals: cartData.grandTotal, total: oldProduct.total })

    }

    catch (error) {
       console.log(error)

    }

}
//.................................................................................................................//
exports.removeProduct = async function (req, res) {
    try {
        const userId = req.session.userId

        const productId = req.body.product

       // console.log(productId, "productID");

        const pullAmount = await Cart.findOne({ userId: userId, "products.productId": productId }).populate("products.productId").lean();

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



        return res.status(200).json({ message: 'Deleted successfully' })

    } catch (error) {
        return res.status(401).json({ message: 'failure' })
    }
}

//................................................................................................//









