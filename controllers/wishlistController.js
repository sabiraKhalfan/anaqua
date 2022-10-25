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
        try {
            wishlistDatas = await Wishlist.find({ userId: userId }).populate('products.productId').lean()
            //console.log( wishlistDatas,"wisglistsatassssssssssssssss")

            res.render('wishlist', { wishlistDatas})

        }
        catch (error) {
            next(error);
        }



    },
    addWishlist: async (req, res) => {


        


        try {


            const wishlistItem = await Wishlist.findOne({ userId: req.session.userId }).lean()

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

           

            await Wishlist.updateOne({ userId: req.session.userId, "products.productId": req.session.userId })
          
            return res.json({ message: 'Item is added to Wishlist'})


        } catch (error) {
            next(error)
        }



    },
    deleteWishlist: async (req, res) => {

        const productId = req.body.prodId

       // console.log("hi from delete", productId)
        deletes = await Wishlist.updateOne({ userId: req.session.userId }, { $pull: { products: { productId: req.body.prodId } } })
        res.json({})
    }
}
