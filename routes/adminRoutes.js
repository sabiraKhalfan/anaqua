
var express = require('express');
var router = express.Router();
const adminController = require('./../controllers/adminController')
const categoryController = require('./../controllers/categoryController')
const productController = require('./../controllers/productController')
const upload = require('./../middleware/pic')
const auth = require('./../middleware/adminProtect')




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

module.exports = router