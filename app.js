const express = require('express');
const session = require('express-session');
const path = require('path');
const router = require('./src/routers/router');
const app = express();
const multer = require('multer');
const connection = require('./src/controllers/db');

// Cấu hình EJS
// router.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/'));

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