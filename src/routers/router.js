const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controllers/loginController');
const accountController = require('../controllers/accountController');
const assetController = require('../controllers/assetController');
const expenseController = require('../controllers/expenseController');
const marketMangementController = require('../controllers/marketMangementController');
const marketController = require('../controllers/marketController');
const checkRole = require('../controllers/checkRole');
// const connection = require('../controllers/db');
// const app = express();


// Cấu hình EJS
// router.engine('ejs', require('ejs').__express);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views/'));


//login
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/login.html'));
});

//register
router.get('/register', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/register.html'));
});
router.post('/register', accountController.addAccount);

//changepassword
router.get('/changepassword', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/changepassword.html'));
});
router.get('/forgotpassword', function(request, response) {
  response.sendFile(path.join(__dirname, '../views/forgotpassword.html'));
});

// router.get('/account-management', function(request, response) {
//   response.sendFile(path.join(__dirname, '../views/main.html'));
// });


// home
router.post('/auth', loginController.authenticateUser);
router.get('/home', loginController.home);

// account-management
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../views/'));

// app.get('/account-management', (req, res) => {
//   console.log("íadfn");
//   connection.query('SELECT id, username, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
//     if (err) throw err;
//     res.render('main', { results });
//   });
// });

//account-management

router.get('/account-management', checkRole('Admin'), accountController.getAccounts);
router.post('/account-management', checkRole('Admin'), accountController.getAccounts);
router.post('/account-management/add', accountController.addAccount);
router.post('/account-management/update', accountController.updateAccount);
router.get('/account-management/delete', accountController.deleteAccount);
router.get('/account-management/reset-password/:id', accountController.resetPassword);

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
router.post('/asset-management/sell', assetController.sellAsset);



//expense-planner
router.get('/expense-planner', expenseController.getExpense);
router.post('/expense-planner/add', expenseController.addExpenseItem);
router.post('/expense-planner/edit', expenseController.editExpenseItem);

module.exports = router;
