const express = require('express');
const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');
const User = require('../model/usermodel');
const addressModel = require('./../model/addressModel')


exports.getuserProfile = async function (req, res, next) {

    const userId = req.session.userId

    const user = await User.findOne({ _id: req.session.userId }).lean()
    const addressData = await addressModel.findOne({ userId: userId }).lean()
    res.render("userProfile", { userLoggedIn, user, addressData })

    console.log(addressData, "this is address data")
}
///.....................................................................................................//

exports.updateProfile = async function (req, res, next) {
    try {
        const userId = req.session.userId

        console.log(req.body.name)

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
    let userId = req.session.userId
    const userData = await User.findOne({ _id: userId }).lean()
    let addressData = await addressModel.find({ userId: userId._id }).lean()

    res.render('addaddress', { userLoggedIn, userData, addressData })

}
//.............................................................................................................
exports.updatepwd = async function (req, res, next) {
    let userId = req.session.userId
    oldpwd = req.body.password
    console.log(userId, "session")
    console.log(oldpwd, "oldpwd")
    let userData = await User.findOne({ _id: req.session.userId })
    console.log(userData, "user")
    let correct = await bcrypt.compare(req.body.password, userData.password)
    console.log(correct, "comparepassword")
    if (correct == true) {
        let newpassword = await bcrypt.hash(req.body.password, 10)
        console.log(newpassword, "newpwd")
        await User.updateOne({ _id: userId }, { $set: { 'password': newpassword } })
    } else {
        console.log("incorrect ")
    }
    res.json({})


}
//....................................................................................................//
exports.addaddress = async function (req, res, next) {
    console.log("this is the body of the add address");
    console.log(req.body);
    const userId = req.session.userId
    //console.log("this is the uesr id of the user that is logged in  now");
    //console.log(userId);
    req.body.userId = userId
    await addressModel.create(req.body);

    res.redirect("/profile")
}
//...................................................................................................//
exports.editAddress = async function (req, res, next) {
    console.log("this is body,:", req.body)
    let userId = req.session.userId
    let addressId = req.params.id
    console.log(addressId);
    await addressModel.findOneAndUpdate({ _id: addressId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "phoneNumber": req.body.phoneNumber, "address": req.body.address, "city": req.body.city, "state": req.body.state, "landmark": req.body.landmark } })
    res.redirect('/profile')
}
//...........................................................................................//
exports.getmanageaddress = async function (req, res, next) {
    let userId = req.session.userId
    let addressData = await addressModel.find({ userId: userId }).lean()
    console.log(addressData, "address data")
    res.render('manageaddress', { userLoggedIn, addressData })
}
//...............................................................................................//
exports.deleteAddress = async function (req, res, next) {

    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")


    console.log("delete address", deleteId)
    await addressModel.findOneAndDelete({ _id: deleteId })
    res.redirect('/profile')

}

