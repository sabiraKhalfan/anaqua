const express = require('express')
const mongoose = require('mongoose');
const Admin = require('./../model/adminmodels/admin_model')
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product')
const fs = require('fs');
const orderModel = require('./../model/order')
const { populate } = require('./../model/adminmodels/admin_model');
const console = require('console');
const { findByIdAndUpdate } = require('../model/adminmodels/product');
const { CanceledError } = require('axios');
const couponModel = require('./../model/adminmodels/coupon')


exports.getAllOrder = async function (req, res, next) {
    try{
        const orderData = await orderModel.find().populate('userId').sort({createdAt:-1}).populate("products.productId").lean()
        // console.log(orderData, "orderData.products...............")
        res.render('admin/viewOrdersAdmin', { layout: "adminLayout", orderData })
    }catch(error){
        next(error)
    }
  
}
//........................................................................................................//
exports.renderEditStatus = async function (req, res, next) {

    orderId = req.params.id
try{
    orderData = await orderModel.findOne({ _id: orderId }).lean()
   // console.log(orderData.status)
    let placed, shipped, delivered
    if (orderData.status == 'placed') {
        placed = true

    }
    else if (orderData.status == 'shipped') {
        shipped = true
    }
    else if (orderData.status == 'deliverd') {
        delivered = true
    }

   
   
    res.render('admin/editOrderStatus', { layout: "adminLayout", orderData, orderId, placed, shipped, delivered })
}catch(error){
    next(error)
}
    
}
//.........................................................................//
exports.viewMore = async function (req, res, next) {
    try{
   
        orderId = req.params.id
        let cancelled = false;
       
        //console.log("hi")
        
        let orderData = await orderModel.findOne({ _id: orderId }).populate('products.productId').lean()
    console.log(orderData,"orderData")
        if (orderData.status == 'cancelled') {
            cancelled = true
        }
       
    
        res.render("admin/viewMore", { layout: "adminLayout", orderData, cancelled })
    }catch(error){
        next(error)
    }
   
}
//...............................................................................................//
exports.editOrderStatus = async function (req, res, next) {
    orderId = req.params.id
    try{
        await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: req.body.status } })
        res.redirect('/admin/viewOrders');
    }
    catch(error){
        next(error)
    }


    
}
//.............................................................................................................//
exports.getInvoice = async function(req,res,next){
orderId=req.params.id
//console.log(orderId,"orderId")
    let invoiceData = await orderModel.findOne({ _id: orderId }).populate('products.productId').lean()
    
   /// console.log(invoiceData,"invoicedata")
    res.render('invoice',{userLoggedIn, invoiceData})
}