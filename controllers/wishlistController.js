const express = require('express')
const mongoose = require('mongoose');
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product');
const Cart = require('../model/cartModel');
const Wishlist = require('../model/wishlistModel')





module.exports = {
    getwishlist: async (req, res) => {
        const userId = req.session.userId
        wishlistDatas = await Wishlist.findOne(
            { userId: userId }
        ).populate("products.productId").lean()
        console.log(wishlistDatas)

        res.render('wishlist', { wishlistDatas })

    },
    addWishlist: async (req, res) => {


        // if (!req.session.loggedIn) {
        //     return res.json({ logged: false })
        // }


        try {


            const wishlistItem = await Wishlist.findOne({ userId: req.session.userId }).lean()
            console.log(wishlistItem, "wishlist item")
            if (wishlistItem) {

                productExist = await Wishlist.findOne({ userId: req.session.userId, "products.productId": req.body.productId }).lean()
                if (productExist) {
                    return res.json({ message: "product already added to wishlist" });
                } else {
                    await Wishlist.findOneAndUpdate({ userId: req.session.userId }, { $push: { products: { productId: req.body.productId } } });
                }


            }

            else {


                await Wishlist.create({ userId: req.session.userId, products: { productId: req.body.productId } })
            }

            const wishlistDatas = await Wishlist.findOne({ userId: req.session.userId }).populate("products.productId").lean()

            console.log(wishlistDatas, "data.......................")


            await Wishlist.updateOne({ userId: req.session.userId, "products.productId": req.session.userId })
            return res.json({ message: 'Item is added to Wishlist' })


        } catch (error) {

            return res.json({ message: 'server faiure', error: error })



        }
    },
    deleteWishlist: async (req, res) => {

        const productId = req.body.prodId

        console.log("hi from delete", productId)
        deletes = await Wishlist.updateOne({ userId: req.session.userId }, { $pull: { products: { productId: req.body.prodId } } })
        res.json({})
    }
}
