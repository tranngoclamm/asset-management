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
  var user_id = request.session.user_id; 
  connection.query('SELECT id, username, password, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
    if (err) throw err;
    connection.query('SELECT * FROM accounts WHERE id = ?', [user_id], (err, account) => {
      if (err) throw err;
      let user = account[0];
      response.render('../views/account-management', { results, user });
    });
  });
}


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

// function addAccount(request, response) {
//   const {username, password, full_name, email, phone_number, birth_date, role, address } = request.body;
//   const account = {username, password, full_name, email, phone_number, birth_date, role, address };
//   // Check if username already exists
//   connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
//     if (error) {
//         console.error('Lỗi khi kiểm tra tên tài khoản:', error);
//         response.status(500).send('Đã có lỗi xảy ra khi đăng ký tài khoản.');
//         return;
//     }

//     // If username already exists, send error response
//     if (results.length > 0) {
//         response.status(400).send('Tên tài khoản đã tồn tại. Vui lòng chọn một tên khác.');
//         return;
//     }
//   connection.query('INSERT INTO accounts SET ?', account, function(error, results, fields) {
//     if (error) throw error;
//     response.status(200).send('Đăng ký thành công');
//   });
//   // ...
// });
// }

function addAccount(request, response) {
  const { username, password, full_name, email, phone_number, birth_date, role, address } = request.body.account;

  // Kiểm tra username đã tồn tại hay chưa
  const checkUsernameQuery = 'SELECT COUNT(*) AS count FROM accounts WHERE username = ?';
  const checkUsernameValues = [username];
  const checkUsernameQueryFormatted = connection.format(checkUsernameQuery, checkUsernameValues);

  connection.query(checkUsernameQueryFormatted, function (error, results, fields) {
    if (error) throw error;

    const existingUsernameCount = results[0].count;
    if (existingUsernameCount > 0) {
      // Username đã tồn tại, báo lỗi hoặc xử lý theo yêu cầu của bạn
      response.status(400).send('Tài khoản đã có người sử dụng');
      return;
    }

    // Username không tồn tại, thực hiện thêm tài khoản
    const account = { username, password, full_name, email, phone_number, birth_date, role, address };
    const sql = 'INSERT INTO accounts SET ?';
    const query = connection.format(sql, account);

    connection.query(query, function (error, results, fields) {
      if (error) throw error;
      
      const insertedId = results.insertId; // Lấy ID của tài khoản đã chèn
      response.json({ id: insertedId }); // Gửi ID của tài khoản về trong phản hồi JSON
    });
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

function changePassWord(req, res){
  const { username, oldPassword, newPassword } = req.body;

    // Kiểm tra xem tên người dùng có tồn tại trong cơ sở dữ liệu hay không
    connection.query('SELECT * FROM accounts WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
            return;
        }

        if (results.length === 0) {
            res.status(400).send('Tài khoản không tồn tại');
            return;
        }

        const user = results[0];

        // So sánh mật khẩu cũ nhập vào với mật khẩu trong cơ sở dữ liệu
        if (oldPassword !== user.password) {
            res.status(400).send('Mật khẩu cũ không chính xác');
            return;
        }

        // Nếu mật khẩu cũ chính xác, tiến hành cập nhật mật khẩu mới
        connection.query('UPDATE accounts SET password = ? WHERE username = ?', [newPassword, username], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
                return;
            }

            res.status(200).send('Đổi mật khẩu thành công');
        });
    });
}

function resetPassword(request, response) {
const { username } = request.body;
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
  resetPassword,
  changePassWord
};