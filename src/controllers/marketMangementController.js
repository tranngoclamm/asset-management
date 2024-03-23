const connection = require('./db');
const app = require('../../app');
const path = require('path');

//lấy tất cả danh sách duyệt với chức năng duyệt tài sản
function getPendingAssets(request, response) {
  let searchQuery = request.query.searchQuery; // Lấy tham số tìm kiếm từ request query
  let sortBy = request.query.sortBy; // Lấy tham số sắp xếp từ request query
  let sortOrder = request.query.sortOrder; // Lấy hướng sắp xếp từ request query

  let queryString = `
      SELECT 
          pending_assets.id AS asset_id, 
          pending_assets.asset_name, 
          pending_assets.category, 
          pending_assets.status, 
          pending_assets.price, 
          pending_assets.purchase_date, 
          pending_assets.warranty_period, 
          pending_assets.depreciation, 
          pending_assets.description, 
          accounts.username
      FROM 
          pending_assets
      INNER JOIN 
          accounts 
      ON 
          pending_assets.user_id = accounts.id
  `;

  // Kiểm tra nếu có tham số tìm kiếm được gửi từ client
  if (searchQuery) {
      // Thêm điều kiện tìm kiếm vào câu truy vấn
      queryString += ' WHERE pending_assets.asset_name LIKE ? OR assets.category LIKE ? OR accounts.username LIKE ? OR assets.description LIKE ?';
  }

  // Kiểm tra nếu có tham số sắp xếp được gửi từ client
  if (sortBy) {
      // Thêm điều kiện sắp xếp vào câu truy vấn
      queryString += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  // Thực hiện truy vấn SQL
  connection.query(queryString, [(searchQuery ? `%${searchQuery}%` : null)], (err, results) => {
      if (err) throw err;
      var id = request.session.user_id;
      connection.query('SELECT * FROM accounts WHERE id = ?', [id], (err, account) => {
        if (err) throw err;
        let user = account[0];
        response.render('../views/market-management', { results, user });
      });
  });
}

//xem chợ tài sản của Admin/KDV
function getMarketAssets(request, response){
    let searchQuery = request.query.searchQuery; // Lấy tham số tìm kiếm từ request query
    let sortBy = request.query.sortBy; // Lấy tham số sắp xếp từ request query
    let sortOrder = request.query.sortOrder; // Lấy hướng sắp xếp từ request query
  
    let queryString = `
        SELECT 
            market_assets.id AS asset_id, 
            market_assets.asset_name, 
            market_assets.category, 
            market_assets.status, 
            market_assets.price, 
            market_assets.purchase_date, 
            market_assets.warranty_period, 
            market_assets.depreciation, 
            market_assets.description, 
            accounts.username
        FROM 
            market_assets
        INNER JOIN 
            accounts 
        ON 
            market_assets.user_id = accounts.id
    `;
  
    // Kiểm tra nếu có tham số tìm kiếm được gửi từ client
    if (searchQuery) {
        // Thêm điều kiện tìm kiếm vào câu truy vấn
        queryString += ' WHERE market_assets.asset_name LIKE ? OR market_assets.category LIKE ? OR accounts.username LIKE ? OR assets.description LIKE ?';
    }
  
    // Kiểm tra nếu có tham số sắp xếp được gửi từ client
    if (sortBy) {
        // Thêm điều kiện sắp xếp vào câu truy vấn
        queryString += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
  
    // Thực hiện truy vấn SQL
    connection.query(queryString, [(searchQuery ? `%${searchQuery}%` : null)], (err, results) => {
        if (err) throw err;
        var id = request.session.user_id;
        connection.query('SELECT * FROM accounts WHERE id = ?', [id], (err, account) => {
          if (err) throw err;
          let user = account[0];
          response.render('../views/market-assets_for_admin', { results, user });
        });
    });

}

//duyệt tài sản lên chợ tài sản
function acceptAssets(request, response) {
    const idArray = request.body.asset_ids.split(',').map(id => parseInt(id));

    // Lấy thông tin tài sản từ bảng pending_assets
    // console.log(connection.format('SELECT * FROM pending_assets WHERE id IN (?)', [idArray]));
    connection.query( `SELECT * FROM pending_assets WHERE id IN (?)`, [idArray], function (error, results, fields) {
        if (error) throw error;
        // Lặp qua danh sách tài sản đã chọn
        results.forEach((asset) => {
          // Thêm thông tin tài sản vào bảng market_assets
          connection.query('INSERT INTO market_assets SET ?', asset, function (error, results, fields) {
            if (error) throw error;
          });
  
          // Xóa tài sản khỏi bảng pending_assets
          connection.query('DELETE FROM pending_assets WHERE id = ?', [asset.id], function (error, results, fields) {
            if (error) throw error;
          });
        });
        
        response.redirect('/market-management/pending-assets');
      }
    );
    // ...
  }

//không duyệt tài sản, xóa khỏi danh sách duyệt
function denyAssets(request, response){
    const idArray = request.body.selectedDenyIds.split(',').map(id => parseInt(id));
    connection.query( `DELETE FROM pending_assets WHERE id IN (?)`, [idArray], function (error, results, fields) {
        if (error) throw error;
        response.redirect('/market-management/pending-assets');
      }
    );
  }

// xóa tài sản khỏi diễn đàn
function deleteMarketAsset(request, response) {
    const idArray = request.body.selectedIds.split(',').map(id => parseInt(id));
    connection.query( `DELETE FROM market_assets WHERE id IN (?)`, [idArray], function (error, results, fields) {
        if (error) throw error;
        response.redirect('/market-management');
      }
    );
}
module.exports = {
    getPendingAssets, getMarketAssets,deleteMarketAsset, acceptAssets, denyAssets
}
