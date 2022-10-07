const express = require('express')
const mongoose = require('mongoose');
const Admin = require('./../model/adminmodels/admin_model')
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product')
const fs = require('fs');
const { populate } = require('./../model/adminmodels/admin_model');
const console = require('console');
const { findByIdAndUpdate } = require('../model/adminmodels/product');


//rendering a product page


exports.getaddProduct = async function (req, res, next) {


    const categorydata = await catg.find().lean()
    res.render('admin/addProduct', { layout: "adminLayout", admin: true, categorydata })
}


//add a product

exports.addProduct = async function (req, res, next) {

    try {
        const files = req.files
        let imageArray = files.map(el => el.filename)


        const categorydata = await catg.find().lean()
        //console.log(categorydata)
        const newproduct = new product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            sellingprice: req.body.sellingprice,
            image: imageArray

        })
        newproduct.save()



        res.redirect('/admin/dashboard')


    }
    catch (err) {
        res.status(404).json({ status: 'fail', message: err });
    }

}


//.............................................................................................//

//rendering product edit page

exports.geteditProduct = async function (req, res, next) {
    let productdata = await product.find().populate('category').lean()
    //console.log("productdata", productdata)
    res.render('admin/view_products', { layout: "adminLayout", admin: true, productdata })
}

//edit product details

exports.editProduct = async function (req, res, next) {
    let id = req.params.id
    let categories = await catg.find().lean();
    let productdata = await product.findOne({ _id: id }).populate('category').lean()
    //console.log("productdata", productdata)
    res.render('admin/edit_product', { layout: "adminLayout", admin: true, productdata, categories })

}

//..........................................................................................................//
//updating a product

exports.updateProduct = async function (req, res, next) {
    try {

        const files = req.files
        let imageArray = files.map(el => el.filename)
        //console.log("image", imageArray)

        //  console.log(req.body, req.params.id)
        if (imageArray[0]) {
            let imageData = await product.findOne({ _id: req.params.id }).lean()

            for (let i = 0; i < imageData.image.length; i++) {

                fs.unlink('public/multerimages/' + imageData.image[i], (err => {
                    if (err) console.log(err);
                    else {
                        console.log("\nDeleted file: ");
                    }
                }));
            }
            await product.findByIdAndUpdate({ _id: req.params.id }, {
                $set:
                {
                    name: req.body.name,
                    category: req.body.category,
                    discription: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    sellingprice: req.body.sellingprice,
                    image: imageArray


                }
            })
        }
        else {

            await product.findByIdAndUpdate({ _id: req.params.id }, {
                $set:
                {
                    name: req.body.name,
                    category: req.body.category,
                    discription: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    sellingprice: req.body.sellingprice,
                }
            })
        }

        res.redirect('/admin/viewProducts')


    } catch (err) {

        res.status(404).json({ status: 'fail', message: err });
        res.redirect('/admin/dashboard')
    }
}
//....................................................................................//

exports.deleteProduct = async function (req, res, next) {
    let imageData = await product.findOne({ _id: id }).lean()

    imageData.image.map(function (el) {

        fs.unlink('public/multerimages/' + imageData.image[el], (err => {
            if (err) console.log(err);
            else {
                console.log("\nDeleted file: ");
            }
        }));

    })
    await product.findByIdAndDelete({ _id: id })
    res.redirect('/admin/viewProducts')


}
//...........................................................................................................//
