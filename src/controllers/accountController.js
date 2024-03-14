const path = require('path');
const router = require('../routers/router');
const fs = require('fs');
const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'public/images/avatars' });
const app = require('../../app1');
const connection = require('./db');


// const app =require('../../app');
// app.set('view engine', 'ejs');

function getAccounts(request, response) {
  // response.render('../views/asset-management');
    connection.query('SELECT id, username, password, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
    if (err) throw err;
    response.render('../views/main', { results });
  });

  };



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/avatars');
  },
  filename:(req, file, cb) => {
    console.log(file);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});

// const upload = multer({storage:storage});


// getAccounts.js

function addAccount(request, response) {

  // ...

  // Sử dụng middleware Multer khi xử lý yêu cầu POST
  upload.single('avatarUrl')(request, response, function (error) {
    console.log("Tải xong");
    if (error instanceof multer.MulterError) {
    console.log('instanceof');

      // Xử lý lỗi Multer (nếu có)
    } else if (error) {
      console.log('error');

    }
  // let username = request.body.username;

  //   // Tiếp tục xử lý sau khi tệp tin đã được tải lên thành công
  //   const avatarFileName = `${username}.jpg`;
  //   const avtUrl = path.join('public/images/avatars/'+avatarFileName);
  //   console.log(avtUrl);
    // fs.copyFileSync(request.file.path, avtUrl);

    // Tiếp tục xử lý khác...

    // Đường dẫn của tệp ảnh mới
    // const newAvatarUrl = `images/avatars/${avatarFileName}`;

  });
    const {username, password, full_name, email, phone_number, birth_date, role, address } = request.body;
  const account = {username, password, full_name, email, phone_number, birth_date, role, address };
  // const avtUrl = request.body.avatarUrl;
  // console.log(avtUrl);
  // const avatarFileName = `${username}.jpg`;
  // fs.copyFileSync(avtUrl, '/public/images/avatars/'+avatarFileName);  
  connection.query('INSERT INTO accounts SET ?', account, function(error, results, fields) {
    if (error) throw error;
  });
  response.redirect('/account-management');
  // ...
}
 // Đối tượng kiểu static để lưu kết quả

// function getAccounts(callback) {
//   const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'appdb'
//   });

//   connection.query('SELECT id, username, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
//     if (err) throw err;
//     accountData = results; // Lưu kết quả vào đối tượng kiểu static
//     callback(results);
//   });
// }

// function addAccount(request, response) {
//   const {username, password, full_name, email, phone_number, birth_date, role, address } = request.body;
//   const account = {username, password, full_name, email, phone_number, birth_date, role, address };
//   const avtUrl = request.body.avatarUrl;
//   console.log(avtUrl);
//   const avatarFileName = `${username}.jpg`;
//   fs.copyFileSync(avtUrl, '/public/images/avatars/'+avatarFileName);  
//   connection.query('INSERT INTO accounts SET ?', account, function(error, results, fields) {
//     if (error) throw error;
//   });

//  // Đường dẫn của tệp ảnh mới

//   response.redirect('/account-management');
//   // let username = request.body.username;
//   // let password = request.body.password;
//   // let email = request.body.email;
//   // let fullname = request.body.full_name;
//   // let phone = request.body.phone_number;
//   // let birthday = request.body.birth_date;
//   // let role = request.body.role;
//   // let address = request.body.address;
// }

function updateAccount(request, response) {
  const { id, username, password, full_name, email, phone_number, birth_date, role, address } = request.body;
  
  // Tạo đối tượng chứa thông tin tài khoản cần cập nhật
  const account = { id, username, full_name, email, phone_number, birth_date, role, address };
  
  // Kiểm tra xem trường password có dữ liệu không
  if (password) {
    // Nếu có, thêm trường password vào đối tượng account
    account.password = password;
  }

  // Thực hiện câu truy vấn UPDATE
  connection.query('UPDATE accounts SET ? WHERE id = ?', [account, id], function(error, results, fields) {
    if (error) throw error;
    response.redirect('/account-management');
  });
}


function deleteAccount(request, response) {
  const accountId = request.query.id;

  connection.query('DELETE FROM accounts WHERE id = ?', accountId, function(error, results, fields) {
    if (error) throw error;
    response.redirect('/account-management');
  });
}

function resetPassword(request, response) {
  const accountId = request.params.id;

  // Thực hiện cấp lại mật khẩu cho tài khoản có accountId

  response.redirect('/account-management');
}

module.exports = {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  resetPassword
};