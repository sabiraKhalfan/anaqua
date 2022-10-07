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

        let user_Id = req.session.userId;
        const productId = req.body.productId;
        const quantity = req.body.quantity

        const data = await product.findById(req.body.productId).lean()
        const total = data.sellingprice * req.body.quantity

        const oldCart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()
        if (oldCart) {
            const oldProduct = oldCart.products.find(e => e.productId._id == req.body.productId)
            if (oldProduct) {
                if (oldProduct.quantity == 1 && req.body.quantity == -1) {
                    await Cart.updateOne({ 'product.productId': req.body.productId }, { "$pull": { 'products.productId': { '_id': oldProduct._id } } })
                    await Cart.findByIdAndUpdate(oldCart._id, { $inc: { grandTotal: total } })
                }
                else {


                    await Cart.updateOne({ userId: req.session.userId, "products.productId": req.body.productId }, { '$inc': { "products.$.quantity": quantity, "products.$.total": total } })


                }


            } else {
                const products = {
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    total: total

                }

                await Cart.findOneAndUpdate({ userId: user_Id }, { $push: { products } })
            }



        } else {

            const products = {
                productId: req.body.productId,
                quantity: req.body.quantity,
                total: total,
            }

            const cart = new Cart({ userId: req.session.userId, products, total: total })
            cart.save()

        }
        const newCart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()
        grandTotal = newCart.products.reduce((acc, curr) => {
            acc += curr.total;
            return acc
        }, 0)
        console.log(grandTotal, "qwertyuio   qwertyuioqwertyuiowerty");
        await Cart.findOneAndUpdate({ userId: user_Id }, { grandTotal: grandTotal })

        return res.status(200).json({ message: "Hurray! Product Added", newCart, grandTotal });

    }

    catch (error) {

        res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })

    }

}
//.................................................................................................................//
exports.removeProduct = async function (req, res) {
    try {




        const userId = req.session.userId

        const productId = req.body.product

        console.log(productId, "productID");


        await Cart.updateOne({
            userId: userId
        }, {
            $pull: {
                products: {
                    productId: productId
                }
            }
        })



        return res.status(200).json({ message: 'server success' })

    } catch (error) {

        return res.status(401).json({ message: 'server failure' })


    }




}
//...........................................................................................................//
exports.updateQty = async function (req, res, next) {


    const productId = req.body.productId
    console.log(productId)
    let user_Id = req.session.userId;
    console.log(req.session.userId)
    console.log(user_Id)



    const quantity = req.body.quantity

    console.log(quantity, "quantity")



    console.log(updateqty, "asdfghjgfdsdfghjkhgfdsdfgh")
    await Cart.updateOne({ userId: user_Id, 'products.productId': productId }, { '$inc': { 'products.$.quantity': quantity } })


    const cart = await Cart.findOne({ userId: user_Id, 'products.productId': productId }).populate('products.productId').lean()
    const data = 1;

    // cart.count = cart.products.length

    // console.log(cart.count, "cart.count")

    // cart.products.forEach(function (element) {
    //     console.log(element)

    //     if (element.productId._id == productId) {

    //         productTotal = element.productId.sellingprice * element.quantity;
    //     }

    // })

    //             acc += (curr.productId.price - curr.productId.discount) * curr.quantity;
    //             return acc
    //         })
    //         return total;

    console.log(cart, "sdfghjkl;dfghjklsfdghjkl")
    // console.log(productTotal)
    res.json({ message: 'success', totals: cart, productTotal })


}


            //................................................................................................................................//
        //     exports.addTocart = async function (req, res, next) {

        //         let user_Id = req.session.userId

        //         const data = await product.findById(req.body.productId).lean()
        //         const total = (data.sellingprice * 1) * req.body.quantity

        //         const cart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()
        //         console.log("cart")
        //         if (cart) {


        //             const data = await product.findById(req.body.productId).lean()
        //             if (data) {
        //                 console.log("hello")

        //                 await Cart.updateOne({ userId: req.session.userId, "products.productId": req.body.productId }, { '$inc': { "products.$.quantity": 1 }, 'products.$.total': total })
        //             }



        //             else {


        //                 const products = {
        //                     productId: req.body.productId,
        //                     quantity: req.body.quantity,


        //                 }


        //                 await Cart.findByIdAndUpdate({ userId: user_Id }, { $push: { products: products } })
        //             }
        //         } else {
        //             const products = {
        //                 productId: req.body.productId,
        //                 quantity: req.body.quantity,
        //                 total: total

        //             }
        //             const cart = new Cart({ userId: req.session.userId, products })
        //             cart.save()

        //         }
        //         const newCart = await Cart.findOne({ userId: user_Id }).populate('products.productId').lean()
        //         return res.status(200).json({ newCart })

        //     }
        //     //////////////ent = async function (req, res, next) {



        //     try {
        //         const userId = req.session.userId
        //         let productId = req.body.product
        //         let count = req.body.quantity
        //         const products = await product.findById(productId);
        //         console.log(products, "productssssssssssssssssssssssss")


        //         exports.incremice = products.sellingprice
        //         console.log(price, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
        //         let cart = await Cart.findOne({ userId: userId }).lean()
        //         let total = price * count
        //         console.log(total, total)
        //         //increment quantity
        //         const updateQty = await Cart.updateOne({ userId: userId, 'products.productId': productId, },
        //             {
        //                 'products.$.quantity': count,
        //                 'products.$.total': total

        //             })

        //         res.json({
        //             msg: 'ethi',
        //             cart: cart,
        //             total


        //         })
        //         const productData = await Cart.findOne().populate('products.productId').lean()



        //     } catch (error) {
        //         console.log('update quantity error block', error)
        //     }

        // }











