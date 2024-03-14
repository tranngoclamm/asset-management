const path = require('path');
// const app = require('../../app1');
const connection = require('./db');

//lấy kế hoạch chi tiêu
function getExpense(request, response) {
    let id_user = request.session.user_id;
    let total_expense;
    //lấy tổng chi tiêu ở bảng total_expenses
    connection.query('SELECT total FROM total_expenses WHERE user_id = ?',id_user, (err, results) => {
      if (err) throw err;
      total_expense = results;
      request.session.total_expense = total_expense; // lưu vào bộ nhớ phiên
    });
    // lấy các khoản chi tiêu theo tài khoản
    connection.query('SELECT id, name, amount, note FROM expenses WHERE user_id = ?', [id_user], function(error, expenses, fields) {
      if (error) throw err;
      let results = {total_expense, expenses};
      response.render('../views/expense-planner', { results });
    });

  };
  
// thêm mục chi tiêu
function addExpenseItem(request, response){
    let user_id = request.session.user_id;
    // Lấy thông tin từ yêu cầu POST
    const { name, amount, note } = request.body;
    // Thực hiện INSERT INTO vào cơ sở dữ liệu
    const sql = 'INSERT INTO expenses ( name, amount, note, user_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [ name, amount, note, user_id,], (err, result) => {
      if (err) {
        console.error('Lỗi thực hiện INSERT INTO:', err);
        response.json({ success: false, message: 'Lỗi thực hiện INSERT INTO' });
        return;
      }
  
      // INSERT INTO thành công
      response.json({ success: true, message: 'Thêm khoản chi thành công', id: result.insertId });
    });
}

// sửa mục chi
function editExpenseItem(request, response) {
  let user_id = request.session.user_id;
  const { expense_id, name, amount, note } = request.body;
  const sql = 'UPDATE expenses SET name = ?, amount = ?, note = ? WHERE id = ? AND user_id = ?';
  connection.query(sql, [name, amount, note, expense_id, user_id], (err, result) => {
    if (err) {
      console.error('Lỗi thực hiện UPDATE:', err);
      response.json({ success: false, message: 'Lỗi thực hiện UPDATE' });
      return;
    }

    // UPDATE thành công
    response.json({ success: true, message: 'Cập nhật khoản chi thành công' });
  });
}

    module.exports = {
        getExpense,addExpenseItem, editExpenseItem
      };

      