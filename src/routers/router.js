const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controllers/loginController');
const accountController = require('../controllers/accountController');
const assetController = require('../controllers/assetController');
const expenseController = require('../controllers/expenseController');
const marketMangementController = require('../controllers/marketMangementController');
const marketController = require('../controllers/marketController');
const imageController = require('../controllers/imageController');
const checkRole = require('../controllers/checkRole');
const order = require('../controllers/order');
const {uploadMulter} = require('../controllers/multer');


//login
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/login.html'));
});

//logout
router.get('/logout', loginController.logout);

//register
router.get('/register', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/register.html'));
});
router.post('/register', accountController.addAccount);


//upload ảnh với multer
router.post('/upload-image/product', uploadMulter.single('img_product'), imageController.upload);


//changepassword
router.get('/changepassword', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/changepassword.html'));
});
router.post('/change-password', accountController.changePassWord); 

// forgotpassword
router.get('/forgotpassword', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/forgotpassword.html'));
});



// home
router.post('/auth', loginController.authenticateUser);
router.get('/home', loginController.home);

router.get('/account-management', checkRole('Admin'), accountController.getAccounts);
router.post('/account-management', checkRole('Admin'), accountController.getAccounts);
router.post('/account-management/add', accountController.addAccount);
router.post('/account-management/update', accountController.updateAccount);
router.get('/account-management/delete', accountController.deleteAccount);

router.post('/forgot', accountController.resetPassword);



  
  

//market-management
//duyệt tài sản
router.get('/market-management/pending-assets', checkRole(['KDV', 'Admin']), marketMangementController.getPendingAssets);
router.post('/market-management/pending-assets', checkRole(['KDV', 'Admin']), marketMangementController.getPendingAssets);
router.post('/market-management/pending-assets/accept', checkRole(['KDV', 'Admin']), marketMangementController.acceptAssets);
router.post('/market-management/pending-assets/deny', checkRole(['KDV', 'Admin']), marketMangementController.denyAssets);
//chợ tài sản với admin/kdv
router.get('/market-management', checkRole(['KDV', 'Admin']), marketMangementController.getMarketAssets);
router.post('/market-management/delete', checkRole(['KDV', 'Admin']), marketMangementController.deleteMarketAsset);

//market
router.get('/market', marketController.getMarketAssets);
router.post('/market/add-to-cart', checkRole(['KDV', 'Admin', 'User']), marketController.addToCart);
router.post('/market/remove-from-cart', checkRole(['KDV', 'Admin', 'User']), marketController.removeFromCart);
// router.post('/market/payment', checkRole(['KDV', 'Admin', 'User']), marketController.getMarketAssets);

// asset-management
router.get('/asset-management', checkRole(['KDV', 'Admin', 'User']), assetController.getAssets);
router.post('/asset-management', checkRole(['KDV', 'Admin', 'User']), assetController.getAssets);
router.post('/asset-management/add', assetController.addAsset);
router.post('/asset-management/delete', assetController.deleteAssets);
router.post('/asset-management/update', assetController.updateAsset);
router.post('/asset-management/check-pending-assets', assetController.checkingAssetInPending);
router.post('/asset-management/check-market-assets', assetController.checkingAssetInMarket);
router.post('/asset-management/sell', assetController.sellAsset);




//expense-planner
router.get('/expense-planner', expenseController.getExpense);
router.post('/expense-planner/add', expenseController.addExpenseItem);
router.post('/expense-planner/edit', expenseController.editExpenseItem);
router.post('/expense-planner/delete', expenseController.deleteExpenseItem);
router.post('/expense-planner/change-total-expense', expenseController.changeTotalExpense);
module.exports = router;

//
router.post('/order', order.createPayment);
router.get('/vnpay_return',order.createTransaction)

// Định nghĩa route xử lý yêu cầu POST tải lên tệp ảnh
router.post('/upload-image', imageController.upload);