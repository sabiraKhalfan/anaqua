const express = require('express')
const mongoose = require('mongoose');
const Admin = require('./../model/adminmodels/admin_model')
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product')
const fs = require('fs');
const { populate } = require('./../model/adminmodels/admin_model');
const console = require('console');
const session = require('express-session')


exports.getAdmin = function (req, res, next) {
    res.render('admin/signin', { layout: "adminLayout", admin: true })

}
exports.getAdminDashboard = function (req, res, next) {
    res.render('admin/dashboard', { layout: "adminLayout", admin: true })
}

//--------------------------------------------------------------------------------------//
//admin Login
exports.adminLogin = async function (req, res, next) {


    try {
        // get admin data from database
        const admin1 = await Admin.findOne({ email: req.body.email })
        //console.log(admin1, 'testend')
        const { email, password } = admin1
        //compare input
        if (email == req.body.email && password === req.body.password) {

            req.session.admin = true;
            res.redirect('/admin/dashboard');


        }

        else {
            res.send("Incorrect Crediantials! Try again")
        }

    }
    catch (err) {
        res.send(err)
    }

}
// get All Users
exports.getAdminUsers = async function (req, res, next) {

    try {
        let allUsers = await User.find().lean()
        //console.log(allUsers)
        res.render('admin/users', { layout: "adminLayout", admin: true, allUsers })
    }
    catch (err) {
        res.status(404).json({ status: 'fail', message: err });
    }


}
//..........................................................................................................//
//block and unblock user

exports.blockUser = async function (req, res, next) {

    const userid = req.params.id
    console.log(req.params.id)
    await User.findByIdAndUpdate(req.params.id, { $set: { status: false } })
    res.redirect('/admin/users')

}

exports.unblockUser = async function (req, res, next) {
    await User.findByIdAndUpdate(req.params.id, { $set: { status: true } })
    res.redirect('/admin/users')

}
//......................................................................................................//
exports.toLogout = function (req, res, next) {
    req.session.admin = false;
    res.redirect('/admin/login')
}
