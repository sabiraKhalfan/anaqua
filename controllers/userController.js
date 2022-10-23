
const User = require('./../model/usermodel')

const Product = require('../model/adminmodels/product')
const Cart = require('./../model/cartModel')
const Wishlist = require('./../model/wishlistModel')
const twilioControler = require('./../controllers/twilioControler')
const categoryModel = require('./../model/adminmodels/add_category')



exports.indexRouter = async function (req, res, next) {
  const userId = req.session.userId
  const product = await Product.find().populate('category').lean()
  //console.log(product)
  const category = await categoryModel.find().lean()
  const cart = await Cart.findOne({ userId: userId }).populate('products.productId').lean()

  const wishlist = await Wishlist.findOne({ userId: userId }).populate('products.productId').lean()

  userLoggedIn = req.session.loggedIn
  let username = req.session.name
  res.render('index1', { userLoggedIn, product, category, cart, wishlist })
}

exports.toLogin = function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('login')
  }
}
exports.toregister = function (req, res, next) {
  res.render('signup', { noHeaders: true })
}
exports.toLogout = function (req, res, next) {
  req.session.loggedIn = false;
  res.redirect('/')
}


//...........................................................................................//
//user signup

exports.createUser = async (req, res) => {
  try {

    // Get user input
    const { name, email, password, repeatpassword } = req.body;

    // Validate user input
    if (!(name && email && password && repeatpassword)) {
      res.status(400).send("All input is required");
    }

    if ((req.body.password != req.body.repeatpassword)) {
      res.status(400).send("Please Enter Correct Password")
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(409).send("User Already Exist.");

    }

    // check if user already exist
    // Validate if user exist in our database
    else {

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        repeatpassword: req.body.repeatpassword

      })
      newUser.save()
      // console.log(newUser)
      req.session.userId = newUser._id
    
      req.session.phone = req.body.phone

      twilioControler.sendOtp(req.body.phone)

      res.redirect('/otp')


      console.log(req.body, "otp")
    }


  } catch (error) {
    next(createError(404));
  }

}






//.....................................................................................//
//signin a user

exports.signin = async (req, res) => {
  try {
    // Get user input

    const { email, password } = req.body
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email })
    //console.log(user)


    if (!user || !(await user.correctPassword(password, user.password))) {

      return res.status(401).json({
        status: 'fail',
        message: err
      })

    }
    if (user.status == true) {

      req.session.userId = user._id
      req.session.name = user.name

      req.session.loggedIn = true;
      return res.redirect('/')
    } res.send('You Are Blocked')

  }
  catch (error) {
   next(error)
    }

  }


//.....................................................................................................//
//get product details
exports.getProductDetail = async function (req, res, next) {


try{
  id = req.params.id

  const productdetail =
    await Product.findOne({ _id: id }).lean()

  console.log("prod detail", productdetail)


  res.render('product-detail', { productdetail })
} catch(error){
  next(error)
}
  
}




//.....................................................................................................//


exports.viewpage = function (req, res, next) {
  try{
    let userLoggedIn = req.session.loggedIn

    res.render('otp', { userLoggedIn })
  }catch(error){
    next(error)
  }
  
}
//................................................................................................//
exports.post_Otp =  async function (req, res, next) {
  try{
    const data = await twilioControler.verifyOtp(req.session.phone, req.body.otp)
  
  if(data?.valid){
    await User.findOneAndUpdate({ _id: req.session.userId }, { $set: { otpVerified: true } })
    req.session.loggedIn = true;
    res.redirect('/login')
    
  }
        
        
      
      else {
        res.redirect('/otp')
      }
  
    
  }catch(error){
    next(error)
  }


}
//................................................................................//
