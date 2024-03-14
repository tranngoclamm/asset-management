const path = require('path');
const app = require('../../app1');
const connection = require('./db');

// function getAssets(request, response) {
//     // response.render('../views/asset-management');
//     connection.query('SELECT id, asset_name, category, status, price, purchase_date, warranty_period, depreciation, description FROM assets', (err, results) => {
//       if (err) throw err;
//       response.render('../views/asset-management', { results });
//     });

//     };

    // function getAccounts(request, response) {
    //   // response.render('../views/asset-management');
    //     connection.query('SELECT id, username, password, full_name, email, phone_number, birth_date, role, address FROM accounts', (err, results) => {
    //     if (err) throw err;
    //     response.render('../views/main', { results });
    //   });
    
    //   };
    function getAssets(request, response) {
      let searchQuery = request.body.searchQuery; // Lấy tham số tìm kiếm từ request query
      let sortBy = request.body.sortBy; // Lấy tham số sắp xếp từ request query
      let sortOrder = request.body.sortOrder; // Lấy hướng sắp xếp từ request query
      let id_user = request.session.user_id;
      let queryString = 'SELECT id, asset_name, category, status, price, purchase_date, warranty_period, depreciation, description FROM assets WHERE user_id = ?';
  
      // Kiểm tra nếu có tham số tìm kiếm được gửi từ client
      if (searchQuery) {
          // Thêm điều kiện tìm kiếm vào câu truy vấn
          queryString += ' AND (asset_name LIKE ? OR category LIKE ? OR description LIKE ?)';
      }
  
      // Kiểm tra nếu có tham số sắp xếp được gửi từ client
      if (sortBy) {
          // Thêm điều kiện sắp xếp vào câu truy vấn
          queryString += ` ORDER BY ${sortBy} ${sortOrder}`;
      }
  
      // Thực hiện truy vấn SQL
      connection.query(queryString, [...(searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`] : []), id_user], (err, results) => {
          if (err) throw err;
          response.render('../views/asset-management', { results });
      });
  }
  
  
  
    
    function addAsset(request, response) {
        const user_id = request.session.user_id;
        console.log(user_id)
        const {id, asset_name,	category,status,	price, purchase_date, warranty_period, depreciation,	description } = request.body;
        const asset = {asset_name,	category,status,	price, purchase_date, warranty_period, depreciation,	description, user_id };
      connection.query('INSERT INTO assets SET ?', asset, function(error, results, fields) {
        if (error) throw error;
      });
      response.redirect('/asset-management');
      // ...
    }

    function deleteAssets(request, response) {
      // Lấy danh sách các ID được gửi từ client
      // const selectedIds = request.body.selectedIds.split(',');
      const selectedIds = request.body.selectedIds.split(',');
  
      // Xóa các tài sản từ cơ sở dữ liệu sử dụng các ID này
      const queryString = 'DELETE FROM assets WHERE id IN (?) AND user_id = ?';
      connection.query(queryString, [selectedIds, request.session.user_id], function(error, results, fields) {
           if (error) throw error;
      });
      response.redirect('/asset-management');
   }
    
    
   function updateAsset(request, response) {
    const user_id = request.session.user_id;
    const { id, asset_name, category, status, price, purchase_date, warranty_period, depreciation, description } = request.body;
    const asset = { asset_name, category, status, price, purchase_date, warranty_period, depreciation, description };
    connection.query('UPDATE assets SET ? WHERE user_id = ? AND id = ?', [asset, user_id, id], function (error, results, fields) {
        if (error) throw error;

        response.redirect('/asset-management');
    });
}

function sellAsset(request, response) {
    const user_id = request.session.user_id;
    const {id, asset_name,	category,status,	price, purchase_date, warranty_period, depreciation,	description } = request.body;
    const asset = {id, asset_name,	category,status,	price, purchase_date, warranty_period, depreciation,	description, user_id };
    connection.query('INSERT INTO pending_assets SET ?', asset, function(error, results, fields) {
      if (error) throw error;
    });
    response.redirect('/asset-management');
  // ...
  }

    function deleteAccount(request, response) {
      const accountId = request.query.id;
    
      connection.query('DELETE FROM accounts WHERE id = ?', accountId, function(error, results, fields) {
        if (error) throw error;
        response.redirect('/account-management');
      });
    }
    
    module.exports = {
        getAssets,addAsset, deleteAssets, updateAsset,sellAsset
      };

      