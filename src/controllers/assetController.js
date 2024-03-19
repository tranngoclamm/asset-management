const path = require('path');
const app = require('../../app1');
const connection = require('./db');
const { query } = require('express');

// render thông tin tài sản từ sql xuống giao diện
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
  
  
  
    // thêm tài sản 
    function addAsset(request, response) {
      const user_id = request.session.user_id;
      const { asset_name, category, status, price, purchase_date, warranty_period, depreciation, description } = request.body.asset;
      const asset = { asset_name, category, status, price, purchase_date, warranty_period, depreciation, description, user_id };
      const sql = 'INSERT INTO assets SET ?';
      const query = connection.format(sql, asset);
      connection.query(query, function (error, results, fields) {
        if (error) throw error;
        const insertedId = results.insertId; // Lấy ID của tài sản đã chèn
        response.json({ asset_id: insertedId }); // Gửi ID của tài sản về trong phản hồi JSON
      });
    }

    function deleteAssets(request, response) {
      // Lấy danh sách các ID được gửi từ client
      // const selectedIds = request.body.selectedIds.split(',');
      const selectedIds = request.body.selectedIds.split(',');
  
        // vì rảng buộc khóa ngoại nên phải xóa hàng cart trước 
      const deleteCartsQuery = 'DELETE FROM carts WHERE asset_id IN (?)';
      connection.query(deleteCartsQuery, [selectedIds], function(error, results, fields) {
        if (error) {
          throw error;
        }

      // Xóa các tài sản từ cơ sở dữ liệu sử dụng các ID này
      const queryString = 'DELETE FROM assets WHERE id IN (?) AND user_id = ?';
      connection.query(queryString, [selectedIds, request.session.user_id], function(error, results, fields) {
           if (error) throw error;
           response.redirect('/asset-management');
      }
      );
    });
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

function checkingAssetInPending(request, response){
    const assetId = request.query.id;
    // Kiểm tra dữ liệu trong bảng pending_assets
    connection.query('SELECT COUNT(*) AS count FROM pending_assets WHERE id = ?', [assetId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const count = results[0].count;
        const isDuplicate = count > 0;
  
        // Trả về kết quả
        response.json({ isDuplicate });
      }
    });
}

function checkingAssetInMarket(request, response){
  const assetId = request.query.id;
  // Kiểm tra dữ liệu trong bảng market_assets
  connection.query('SELECT COUNT(*) AS count FROM market_assets WHERE id = ?', [assetId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const count = results[0].count;
      const isDuplicate = count > 0;

      // Trả về kết quả
      response.json({ isDuplicate });
    }
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

    
    module.exports = {
        getAssets,addAsset, deleteAssets, updateAsset,sellAsset, checkingAssetInPending,checkingAssetInMarket
      };

      