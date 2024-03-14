const express = require('express');
const session = require('express-session');
const path = require('path');
const router = require('./src/routers/router');
const app = express();

const connection = require('./src/controllers/db');
// let accountData = null;

// Cấu hình EJS
// router.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/'));

// app.get('/account-management', (req, res) => {
//   connection.query('SELECT id, username, password, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
//     if (err) throw err;
//     res.render('main', { results });
//   });
// });


//
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
module.exports = app;