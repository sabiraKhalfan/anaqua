var express = require('express');
var router = express.Router();
const userController = require('./../controllers/userController')
const auth = require('./../middleware/auth')
const protect = require('../middleware/protect')
const cartController = require('./../controllers/cartController');
const { route } = require('.');
const wishlistController = require('./../controllers/wishlistController');
const profileController = require('./../controllers/profileController');
const twilioControler = require('./../controllers/twilioControler')
const checkoutController = require('./../controllers/checkoutController')
/* GET users listing. */

router.get('/', userController.indexRouter);


router.route('/login')
    .get(userController.toLogin)
    .post(userController.signin)

router.route('/signup')
    .get(userController.toregister)
    .post(userController.createUser);

router.route('/logout')
    .get(userController.toLogout)

router.route('/cart')
    .get(protect, cartController.viewCart)
    .post(cartController.addTocart)


router.route('/shop')
    .get(cartController.viewShop)

router.get('/product_detail/:id', protect, userController.getProductDetail)


// router.get('/add-to-cart/:id', cartController.getCartPage)



// router.post('/increment', protect, cartController.increment)
router.post('/remove-product', protect, cartController.removeProduct)

// router.post('/add-To-Cart', cartController.updateQty)


router.get('/wishlist', protect, wishlistController.getwishlist)
router.post('/addWishlist', protect, wishlistController.addWishlist)
router.post('/delete_wishlist', protect, wishlistController.deleteWishlist)

router.get('/profile', protect, profileController.getuserProfile)
router.post("/updateDetails", protect, profileController.updateProfile)
router.get('/addadress', protect, profileController.getaddaddress)
router.post('/addAddress', protect, profileController.addaddress)



router.get('/otp', protect, userController.viewpage)
router.post('/otp', protect, userController.post_Otp)

router.get('/manageaddress', protect, profileController.getmanageaddress)
router.post('/updatepwd', protect, profileController.updatepwd)
router.post('/editaddress/:id', protect, profileController.editAddress)
router.post('/deleteaddress/:id', protect, profileController.deleteAddress)

router.get('/checkout', protect, checkoutController.getcheckoutpage)
router.post('/billingAddress', protect, checkoutController.getBillingAddres)
router.post('/confirmOrder', protect, checkoutController.confirmOrder)


router.get('/orderConfirmation', protect, checkoutController.getCoD)
router.get('/vieworders', protect, checkoutController.viewallorders)
router.post('/verifyRazorpay', protect, checkoutController.verifyPay);
//router.get('/women', protect, productController.womenCatg)




module.exports = router;
