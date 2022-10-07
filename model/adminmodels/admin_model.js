const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
    name:{
    
      type:String,
      //required:[true,'A user must have a name']
      
    },
    email:{
        type:String,
       // required:[true, 'A user must have a email'],
        //unique:true
    },
    password:{
        type:String,
        
        //required:true, 
       // minlength:8
       
    }
});



 adminSchema.methods.correctPassword = async function (password, adminpassword) {

  return await bcrypt.compare(password,adminpassword)
}
    const Admin = mongoose.model('Admin',adminSchema)


  module.exports = Admin;
