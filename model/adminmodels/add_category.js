const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String
    //required:[true,'A user must have a name']

  }
},
  { timestamps: true },
);

const Catg = mongoose.model('Category', categorySchema)


module.exports = Catg;
