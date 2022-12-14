const express = require('express');
const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');
const User = require('../model/usermodel');
const addressModel = require('./../model/addressModel')


exports.getuserProfile = async function (req, res, next) {
    try{
        const userId = req.session.userId

        const user = await User.findOne({ _id: req.session.userId }).lean()
        const addressData = await addressModel.findOne({ userId: userId }).lean()
        res.render("userProfile", { userLoggedIn, user, addressData })
    
        //console.log(addressData, "this is address data")
    }catch(error){
        next(error)
    }

    
}
///.....................................................................................................//

exports.updateProfile = async function (req, res, next) {
    try {
        const userId = req.session.userId

       // console.log(req.body.name)

        const data = await User.findOneAndUpdate({ _id: req.session.userId }, { $set: { name: req.body.name } })



        const newData = await User.findOne({ _id: req.session.userId })

        res.status(200).json({ message: "success", data: newData })

    }
    catch (error) {

        res.status(401).json({ message: "Oops! Process failed", error: `error is : ${error}` })


    }

}
//............................................................................................................//
exports.getaddaddress = async function (req, res, next) {
    try{
        let userId = req.session.userId
        const userData = await User.findOne({ _id: userId }).lean()
        let addressData = await addressModel.find({ userId: userId._id }).lean()
    
        res.render('addaddress', { userLoggedIn, userData, addressData })
    
    }catch(error){
        next(error)
    }
  
}
//.............................................................................................................
exports.updatepwd = async function (req, res, next) {
    try {
        let userId = req.session.userId
        oldpwd = req.body.password
      
        let userData = await User.findOne({ _id: req.session.userId })
     
        let correct = await bcrypt.compare(req.body.password, userData.password)
        
        if (correct == true) {
            let newpassword = await bcrypt.hash(req.body.password, 10)
           
            await User.updateOne({ _id: userId }, { $set: { 'password': newpassword } })
        } else {
            console.log("incorrect ")
        }
        res.json({})

    }
    catch {
        res.json(error)
    }


}
//....................................................................................................//
exports.addaddress = async function (req, res, next) {
   try{
    const userId = req.session.userId
   
    req.body.userId = userId
    await addressModel.create(req.body);

    res.redirect("/profile")
   }catch(error){
    next(error)
   }

}
//...................................................................................................//
exports.editAddress = async function (req, res, next) {
   
    let userId = req.session.userId
    let addressId = req.params.id
   try{

   
    await addressModel.findOneAndUpdate({ _id: addressId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "phoneNumber": req.body.phoneNumber, "address": req.body.address, "city": req.body.city, "state": req.body.state, "landmark": req.body.landmark } })
    res.redirect('/profile')
}catch(error){
    next(error)
}
}
//...........................................................................................//
exports.getmanageaddress = async function (req, res, next) {
    try{
        let userId = req.session.userId
        let addressData = await addressModel.find({ userId: userId }).lean()
        
        res.render('manageaddress', { userLoggedIn, addressData })
    }catch(error){
        next(error)
    }
  
}
//...............................................................................................//
exports.deleteAddress = async function (req, res, next) {
try{
    await addressModel.findOneAndDelete({ _id: deleteId })
    res.redirect('/profile')
}catch(error){
    next(error)
}
   

}
//.............................................................................................//
