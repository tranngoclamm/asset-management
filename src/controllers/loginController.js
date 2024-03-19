const path = require('path');
const connection = require('./db');

function authenticateUser(request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        let user_id = results[0].id;
        let role = results[0].role;

        request.session.loggedin = true;
        request.session.username = user_id;
        request.session.id = user_id;
        request.session.user_id = user_id;
        request.session.user = results;
        request.session.role = role; // Lưu role vào session
        response.redirect('/home');
      } else {
        response.send('Incorrect Username and/or Password!');
      }
    });
  } else {
    response.send('Please enter Username and Password!');
  }
}

function home(request, response) {
  if (request.session.loggedin && (request.session.role=='Admin')) {
    // response.sendFile(path.join(__dirname, '../views/main.html'));
    response.redirect('/account-management');
  }
  else if (request.session.loggedin && (request.session.role=='KDV')) {
    response.redirect('/market-management');
  }
  else if (request.session.loggedin && (request.session.role=='User')){
    response.redirect('/asset-management');
  }
  else{
    response.send('Incorrect Username and/or Password!');
  }
}

function logout(request, response) {
  // Xóa tất cả các thông tin phiên của người dùng
  request.session.destroy(function(error) {
    if (error) {
      console.log(error);
    }
    response.redirect('/'); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  });
}

module.exports = {
  authenticateUser,
  home,
  logout
};