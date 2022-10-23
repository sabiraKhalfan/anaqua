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
const orderModel = require('./../model/order')

exports.getAdmin = function (req, res, next) {
    try{
        res.render('admin/signin', { layout: "adminLayout", admin: true })
    }
   catch (error){
   next(error)
   }

}
exports.getAdminDashboard = async function (req, res, next) {
    try{

    
    let delivered = await orderModel.find({ status: 'delivered' }, { status: 1, _id: 0 }).lean()
   // console.log(delivered, "delivereddd dd cosanui ==");
    let deliveredCount = delivered.length


    let shipped = await orderModel.find({ status: 'shipped' }, { status: 1, _id: 0 }).lean()
    let shippedCount = shipped.length

    let cancelled = await orderModel.find({ status: 'cancelled' }, { status: 1, _id: 0 }).lean()
    let cancelledCount = cancelled.length

    let placed = await orderModel.find({ status: 'placed' }, { status: 1, _id: 0 }).lean()
    let placedCount = placed.length

    let orderData = await orderModel.find().populate('products.productId').lean()
   
    const deliveredOrder = orderData.filter(e=>e.status=='delivered')
   
    const TotalRevenue = deliveredOrder.reduce((accr,crr)=>accr+crr.grandTotal,0)
 
    const eachDaySale = await orderModel.aggregate([{$match:{status:"delivered"}},{$group: {_id: {day: {$dayOfMonth: "$createdAt"},month: {$month: "$createdAt"}, year:{$year: "$createdAt"}},total: {$sum: "$grandTotal"}}}]).sort({createdAt:-1})

    res.render('admin/dashboard', { layout: "adminLayout", admin: true, deliveredCount, shippedCount, cancelledCount, placedCount ,TotalRevenue,eachDaySale})
    }
    catch (error){
        next(error)
    }
}


//..............................................................................//

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
    catch (error) {
        next(error)
    }

}
// get All Users
exports.getAdminUsers = async function (req, res, next) {

    try {
        let allUsers = await User.find().lean()
        //console.log(allUsers)
        res.render('admin/users', { layout: "adminLayout", admin: true, allUsers })
    }
    catch (error) {
       
        next(error)
    }


}
//..........................................................................................................//
//block and unblock user

exports.blockUser = async function (req, res, next) {
try{
    const userid = req.params.id
    //console.log(req.params.id)
    await User.findByIdAndUpdate(req.params.id, { $set: { status: false } })
    res.redirect('/admin/users')
}catch (error){
    next(error)
}
  

}
//.....................................................................................................//
exports.unblockUser = async function (req, res, next) {
    try{
        await User.findByIdAndUpdate(req.params.id, { $set: { status: true } })
        res.redirect('/admin/users')
    }
   
catch (error){
    next(error)
}
}
//......................................................................................................//
exports.toLogout = function (req, res, next) {
    try{
        req.session.admin = false;
        res.redirect('/admin/login')
    }
    catch (error){
        next(error)
    }
    
}
//................................................................................//

exports.viewSalesReport =async function(req,res,next){
   // console.log("hiiiiiiiiiiiiii")
    let data =await orderModel.find({status:"delivered"}).populate('products.productId' ).lean()
   // console.log(data,"1111")
    res.render('admin/salesReport',{layout:false,data})
}
    
