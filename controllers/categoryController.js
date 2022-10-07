const express = require('express')
const mongoose = require('mongoose');
const Admin = require('./../model/adminmodels/admin_model')
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product')
const fs = require('fs');
const { populate } = require('./../model/adminmodels/admin_model');
const console = require('console');

//-----------------------------------------------------------------------------//
//rendering add category page

exports.getaddCategory = function (req, res, next) {
    res.render('admin/addCategory', { layout: "adminLayout", admin: true })
}
//adding a new category
exports.addCategory = (req, res) => {
    try {

        const newcat = new catg({
            name: req.body.name
        })
        newcat.save().

            res.res.redirect('/admin/viewCategory')

    } catch (err) {
        res.send(err)
        res.redirect('/admin/dashboard')
    }
}

//---------------------------------------------------------------------------//
exports.getAdminCategory = async (req, res, next) => {
    try {
        let data = await catg.find().lean();

        res.render('admin/viewcategory', { layout: "adminLayout", admin: true, data })
    }
    catch (err) {
        res.send(err)
    }

}
//----------------------------------------------------------------------------//
exports.DeleteCategory = async (req, res) => {

    try {
        await catg.findByIdAndDelete(req.params.id);
        res.redirect('/admin/viewCategory')
        console.log(req.params.id)
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
//-----------------------------------------------------------------------------------------//

//rendering edit category
exports.geteditCategory = async (req, res, next) => {
    let id = req.params.id;
    let data = await catg.findOne({ _id: id }).lean();
    console.log("data", data)
    res.render('admin/edit_category', { layout: "adminLayout", admin: true, data })
}

//edit a category
exports.editCategory = async (req, res) => {
    try {
        let data = await catg.find().lean();
        console.log(req.params.id)
        console.log(req.body)
        const updateObject = await catg.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/viewCategory')
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err });
    }
}


//...........................................................................................//

