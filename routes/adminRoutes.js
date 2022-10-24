
var express = require('express');
var router = express.Router();
const adminController = require('./../controllers/adminController')
const categoryController = require('./../controllers/categoryController')
const productController = require('./../controllers/productController')
const upload = require('./../middleware/pic')
const auth = require('./../middleware/adminProtect');
const { authAdmin } = require('./../middleware/adminProtect');
const orderController = require('./../controllers/orderController')
const couponController = require("./../controllers/couponController")


router.route('/login')
    .get(auth.authAdminLogin, adminController.getAdmin)
    .post(auth.authAdminLogin, adminController.adminLogin)




router.route('/addCategory')
    .get(auth.authAdmin, categoryController.getaddCategory)
    .post(auth.authAdmin, categoryController.addCategory)



router.route('/edit-category/:id?')
    .get(auth.authAdmin, categoryController.geteditCategory)
    .post(auth.authAdmin, categoryController.editCategory)



router.get('/viewCategory', auth.authAdmin, categoryController.getAdminCategory)
router.get('/delete-category/:id', auth.authAdmin, categoryController.DeleteCategory)



router.get('/dashboard', auth.authAdmin, adminController.getAdminDashboard)
router.get('/users', auth.authAdmin, adminController.getAdminUsers)
router.get('/viewusers', auth.authAdmin, adminController.getAdminUsers)
router.get('/blockUser/:id', auth.authAdmin, adminController.blockUser)
router.get('/unblockUser/:id', auth.authAdmin, adminController.unblockUser)



router.route('/addProducts')
    .get(productController.getaddProduct)
    .post(upload.array('images', 4), productController.addProduct)

router.get('/viewProducts', productController.geteditProduct)
router.get('/edit_product/:id', productController.editProduct)
router.post('/edit_product/:id', upload.array('images', 4), productController.updateProduct)
router.get('/delete_product/:id', upload.array('images', 4), productController.deleteProduct)



router.get('/logout', adminController.toLogout)
router.get('/viewOrders', auth.authAdmin, orderController.getAllOrder)
router.get('/viewMore/:id', auth.authAdmin, orderController.viewMore)



router.get('/addCoupon', auth.authAdmin, couponController.renderaddCoupon)
router.post('/addNewCoupon', auth.authAdmin, couponController.addCoupon)
router.route('/editCoupon/:id')
    .get(auth.authAdmin, couponController.renderEditCoupon)
    .post(auth.authAdmin, couponController.updateCoupon)

//router.get('/editCoupon/:id', auth.authAdmin, couponController.renderEditCoupon)

//router.post('/editCoupon/:id', auth.authAdmin, couponController.updateCoupon)

router.get('/deleteCoupon/:id', auth.authAdmin, couponController.deleteCoupon)

router.get('/editStatus/:id', auth.authAdmin, orderController.renderEditStatus)
router.post('/editStatus/:id', auth.authAdmin, orderController.editOrderStatus)

router.get('/viewCoupon', auth.authAdmin, couponController.couponData)
router.get('/viewSalesReport',auth.authAdmin,adminController.viewSalesReport)

router.get('/gotohome',auth.authAdmin,adminController.gotohome)
router.use((req,res,next) => {
    next(createError(404))
})

router.use((err,req,res,next) => {
    console.log("admin error route handler");
    res.status(err.status || 500);
    res.render('adminError', {layout: false})
})

module.exports = router