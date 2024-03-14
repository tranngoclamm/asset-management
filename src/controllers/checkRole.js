function checkRole(roles) {
    return function(request, response, next) {
      if (request.session.loggedin && roles.includes(request.session.role)) {
        next(); // Cho phép tiếp tục xử lý request
      } else {
        response.status(403).send('Bạn không có quyền truy cập vào chức năng này.'); // Trả về mã lỗi 403 nếu không đủ quyền
      }
    };
  }
  module.exports = checkRole;