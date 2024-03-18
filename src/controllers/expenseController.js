const path = require('path');
// const app = require('../../app1');
const connection = require('./db');

//lấy kế hoạch chi tiêu
function getExpense(request, response) {
  let id_user = request.session.user_id;
  let total_expense;
  // Lấy tổng chi tiêu ở bảng total_expenses
  connection.query('SELECT total FROM total_expenses WHERE user_id = ?', id_user, (errTotal, resultsTotal) => {
      if (errTotal) {
          console.error('Error retrieving total expenses:', errTotal);
          total_expense = [0]; 
      } else {
          if (resultsTotal.length == 0) {
              total_expense = [0]; 
          } else {
              total_expense = resultsTotal[0].total; // Gán giá trị total_expense từ kết quả truy vấn
          }
      }
      request.session.total_expense = total_expense; // Lưu vào bộ nhớ phiên

      // Lấy các khoản chi tiêu theo tài khoản
      connection.query('SELECT id, name, amount, note FROM expenses WHERE user_id = ?', [id_user], (errExpenses, expenses) => {
          if (errExpenses) {
              console.error('Error retrieving expenses:', errExpenses);
              response.status(500).send('Đã có lỗi xảy ra khi lấy thông tin chi tiêu');
          } else {
              let results;
              if (expenses.length == 0) {
                  results = { total_expense: total_expense, expenses: [] };
              } else {
                  results = { total_expense: total_expense, expenses: expenses };
              }
              response.render('../views/expense-planner', { results });
          }
      });
  });
}


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
  const { expense_id, name, amount, note } = request.body;
  user_id = request.session.user_id;
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

// xóa mục chi
function deleteExpenseItem(request, response) {
  const user_id = request.session.user_id;
  const expense_id = request.body.expense_id;
  const sql = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
  connection.query(sql, [expense_id, user_id], (err, result) => {
    if (err) {
      console.error('Lỗi thực hiện DELETE:', err);
      response.json({ success: false, message: 'Lỗi thực hiện DELETE' });
      return;
    }

    // DELETE thành công
    response.json({ success: true, message: 'Xóa khoản chi thành công' });
  });
}

// thay đổi tổng mục chi
function changeTotalExpense(request, response) {
  const user_id = request.session.user_id;
  console.log(user_id);
  const newTotalExpense = request.body.new_total_expense;

  // Kiểm tra xem người dùng đã có tổng chi tiêu chưa
  connection.query('SELECT total FROM total_expenses WHERE user_id = ?', user_id, (err, results) => {
    if (err) {
      console.error('Lỗi kiểm tra tổng chi tiêu:', err);
      return;
    }

    if (results.length === 0) {
      // Người dùng chưa có tổng chi tiêu, thêm mới
      connection.query('INSERT INTO total_expenses (user_id, total) VALUES (?, ?)', [user_id, newTotalExpense], (error, result) => {
        if (error) {
          console.error('Lỗi thêm mới tổng chi tiêu:', error);
          return;
        }
        response.redirect('/expense-planner');
      });
    } else {
      // Người dùng đã có tổng chi tiêu, cập nhật
      connection.query('UPDATE total_expenses SET total = ? WHERE user_id = ?', [newTotalExpense, user_id], (error, result) => {
        if (error) {
          console.error('Lỗi cập nhật tổng chi tiêu:', error);
          return;
        }
        response.redirect('/expense-planner');
      });
    }
  });
}




    module.exports = {
        getExpense,addExpenseItem, editExpenseItem, deleteExpenseItem, changeTotalExpense
      };

      