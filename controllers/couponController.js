const express = require('express')
const mongoose = require('mongoose');
const Admin = require('./../model/adminmodels/admin_model')
const catg = require('./../model/adminmodels/add_category');
const User = require('../model/usermodel');
const product = require('../model/adminmodels/product')
const fs = require('fs');
const { populate } = require('./../model/adminmodels/admin_model');
const console = require('console');
const couponModel = require('./../model/adminmodels/coupon')
const { findByIdAndUpdate } = require('../model/adminmodels/product');



exports.renderaddCoupon = function (req, res, next) {
    try{
        res.render('admin/addCoupon', { layout: "adminLayout" })
    }catch (error){
next(error)
    }
    
  
}
//.....................................................................................................................//

exports.addCoupon = async function (req, res, next) {



    
    try {



        couponNameExist = await couponModel.find({ couponName: req.body.couponName }).lean();

        couponIdExist = await couponModel.find({ couponCode: req.body.couponCode }).lean();
       

        if (couponNameExist[0] || couponIdExist[0])
            return res.json({ message: "the coupon already exist" });

        const newCoupon = new couponModel({
            couponName: req.body.couponName,
            discountAmount: req.body.discountAmount,
            minAmount: req.body.minimumAmount,
            couponCode: req.body.couponCode,
            expiryDate: req.body.date,


        })
        newCoupon.save()
        res.redirect('/admin/addCoupon');

    } catch (error) {

       next(error)
    }

}
//............................................................//
exports.couponData = async function (req, res, next) {
    try{
        couponData = await couponModel.find().lean();

        res.render('admin/tableCoupon', { layout: "adminLayout", couponData })
    }catch(error){
        next(error)
    }
   
}
//...............................................................//
exports.renderEditCoupon = async function (req, res, next) {
    try{
        couponData = await couponModel.findOne({ _id: req.params.id }).lean();

        res.render('admin/editCoupon', { layout: "adminLayout", couponData })
    }catch(error){
        next(error)
    }

    
}
//.....................................................................//
exports.updateCoupon = async function (req, res, next) {

    
    try {
        await couponModel.findOneAndUpdate({ _id: req.params.id }, {
            $set:
            {
                couponName: req.body.couponName,
                discountAmount: req.body.discountAmount,
                minAmount: req.body.minimumAmount,
                couponCode: req.body.couponCode,
                expiryDate: req.body.date,



            }
        })
        res.redirect('/admin/viewCoupon');
    }

    catch (error) {
        next(error)
    }
}

//......................................................................//
exports.deleteCoupon = async function (req, res, next) {
    try {
        await couponModel.findOneAndDelete({ _id: req.params.id })
        res.redirect('/admin/dashboard')
    }
    catch (error) {
        next(error)
    }

}
//...................................................................//

exports.validateCoupon = async function (req, res, next) {

   
    let userId = req.session.userId;
    
    try{
        couponExist = await couponModel.findOne({ couponCode: req.body.couponId, users: userId }).lean();

        coupons = await couponModel.findOne({ couponCode: req.body.couponId }).lean();
       
        currentDate = new Date();
    
        if (coupons) {
            if (couponExist) {
    
                return res.json({ message: 'The coupon is used already' });
            }
            if (currentDate > coupons.expiryDate){
                return res.json({ message: "Sorry the coupon has expired" });
            }
                
    
    
    
            if (Number(req.body.total) < Number(coupons.minAmount)){
                return res.json({ message: "Less Than Minimum" });
            }
                
    
             
    
    
    
            let discountAmount = coupons.discountAmount;
            newTotal = req.body.total - coupons.discountAmount;
            
            req.session.coupon = coupons;
            return res.json({ message: "Succesfull", coupons, newTotal, discountAmount });
    
    
        }
    }
    catch(error){
        return res.json({ message: "Invalid Coupon" });
    }
   
}
//..........................................................................................//