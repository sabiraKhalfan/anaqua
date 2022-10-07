const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {

    type: String,
    //required:[true,'A user must have a name']

  },
  email: {
    type: String,
    // required:[true, 'A user must have a email'],
    //unique:true
  },
  password: {
    type: String,

    //required:true, 
    // minlength:8

  },
  phone: {
    type: Number

    //required:true, 
    // minlength:8

  },
  repeatpassword: {
    type: String,
    //required:[true,'Please Confirm Your password']
  },
  // token: {
  //   type: String

  // },
  status: {
    type: Boolean,
    default: true
  },
  otpVerified: {
    type: Boolean,
    default: false
  }

});
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //console.log(this.password)
  this.repeatpassword = undefined;
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {

  return await bcrypt.compare(candidatePassword, userPassword)
}
const User = mongoose.model('User', userSchema)
module.exports = User;


