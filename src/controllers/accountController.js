const path = require('path');
const express = require('express');
const app = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/images/avatars' });
const connection = require('./db');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');






// const app =require('../../app');
// app.set('view engine', 'ejs');

function getAccounts(request, response) {
  // response.render('../views/asset-management');
    connection.query('SELECT id, username, password, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
    if (err) throw err;
    response.render('../views/account-management', { results });
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
  const {username, password, full_name, email, phone_number, birth_date, role, address } = request.body;
  const account = {username, password, full_name, email, phone_number, birth_date, role, address };
  // Check if username already exists
  connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
    if (error) {
        console.error('Lỗi khi kiểm tra tên tài khoản:', error);
        response.status(500).send('Đã có lỗi xảy ra khi đăng ký tài khoản.');
        return;
    }

    // If username already exists, send error response
    if (results.length > 0) {
        response.status(400).send('Tên tài khoản đã tồn tại. Vui lòng chọn một tên khác.');
        return;
    }
  connection.query('INSERT INTO accounts SET ?', account, function(error, results, fields) {
    if (error) throw error;
    response.status(200).send('Đăng ký thành công');
  });
  // ...
});
}

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
const { username } = request.body;
console.log(request.body)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cấu hình tài khoản email để gửi yêu cầu đặt lại mật khẩu
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tranngoclam.lnt@gmail.com',
        pass: 'gwwq rrpw hvfk bocm'
    }
});
// Xử lý yêu cầu POST từ form đặt lại mật khẩu
const newPassword = randomstring.generate(8);// Hàm generateNewPassword là hàm tạo mật khẩu mới
console.log(username, newPassword)

// Lưu mật khẩu mới vào cơ sở dữ liệu
connection.query('UPDATE accounts SET password = ? WHERE username = ?', [newPassword, username], (err, results) => {
  if (err) {
    console.error('Error updating password:', err);
    response.status(500).send('Đã có lỗi xảy ra khi cập nhật mật khẩu');
  } else {
    // Kiểm tra số bản ghi bị ảnh hưởng để xác nhận việc cập nhật mật khẩu
    if (results.affectedRows === 0) {
      response.status(404).send('Không tìm thấy tài khoản người dùng');
    } else {
      // Lấy thông tin tài khoản người dùng từ cơ sở dữ liệu
      connection.query('SELECT email FROM accounts WHERE username = ?', username, (err, results) => {
        if (err) {
          console.error('Error retrieving user account:', err);
          response.status(500).send('Đã có lỗi xảy ra khi lấy thông tin tài khoản người dùng');
        } else {
          if (results.length === 0) {
            response.status(404).send('Không tìm thấy tài khoản người dùng');
          } else {
            const { email } = results[0];

            // Tạo thông điệp email để gửi
            const mailOptions = {
              from: 'yourEmail@gmail.com',
              to: `${email}`,
              subject: 'Yêu cầu đặt lại mật khẩu',
              text: `Xin chào,\nBạn đã yêu cầu đặt lại mật khẩu cho tài khoản ${username} \n Mật khẩu mới của bạn là ${newPassword}`
            };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            response.status(500).send('Đã có lỗi xảy ra khi gửi email đặt lại mật khẩu');
        } else {
            console.log('Email sent:', info.response);
            response.status(200).send('Đã gửi yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra hộp thư đến của bạn.');
          }
        });
      }
    }
  });
}
}
});
}

module.exports = {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  resetPassword
};