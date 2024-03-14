const connection = require('./db');
const axios = require('axios');
//xem chợ tài sản của Admin/KDV
// function getMarketAssets(request, response){
//     let searchQuery = request.query.searchQuery; // Lấy tham số tìm kiếm từ request query
//     let sortBy = request.query.sortBy; // Lấy tham số sắp xếp từ request query
//     let sortOrder = request.query.sortOrder; // Lấy hướng sắp xếp từ request query
  
//     let queryString = `
//         SELECT 
//             market_assets.id AS asset_id, 
//             market_assets.asset_name, 
//             market_assets.category, 
//             market_assets.status, 
//             market_assets.price, 
//             market_assets.purchase_date, 
//             market_assets.warranty_period, 
//             market_assets.depreciation, 
//             market_assets.description, 
//             accounts.username
//         FROM 
//             market_assets
//         INNER JOIN 
//             accounts 
//         ON 
//             market_assets.user_id = accounts.id
//     `;
  
//     // Kiểm tra nếu có tham số tìm kiếm được gửi từ client
//     if (searchQuery) {
//         // Thêm điều kiện tìm kiếm vào câu truy vấn
//         queryString += ' WHERE market_assets.asset_name LIKE ? OR market_assets.category LIKE ? OR accounts.username LIKE ? OR market_assets.description LIKE ?';
//     }
  
//     // Kiểm tra nếu có tham số sắp xếp được gửi từ client
//     if (sortBy) {
//         // Thêm điều kiện sắp xếp vào câu truy vấn
//         queryString += ` ORDER BY ${sortBy} ${sortOrder}`;
//     }
  
//     // Thực hiện truy vấn SQL
//     connection.query(queryString, [(searchQuery ? `%${searchQuery}%` : null)], (err, results) => {
//         if (err) throw err;
//         response.render('../views/market-assets_for_user', { results });
//     });

// }

function getMarketAssets(request, response) {
    let searchQuery = request.query.searchQuery; // Lấy tham số tìm kiếm từ request query
    let sortBy = request.query.sortBy; // Lấy tham số sắp xếp từ request query
    let sortOrder = request.query.sortOrder; // Lấy hướng sắp xếp từ request query
    let userId = request.session.user_id; // Lấy ID của người dùng từ session
  
    let queryString1 = `
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
        market_assets.user_id = accounts.id`;
  
    let queryString2 = `
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
      INNER JOIN
        carts
      ON
        market_assets.id = carts.asset_id
      WHERE
        carts.user_id = ?`;
  
    let queryParameters1 = [];
    let queryParameters2 = [userId];
  
    // Kiểm tra nếu có tham số tìm kiếm được gửi từ client
    if (searchQuery) {
      // Thêm điều kiện tìm kiếm vào câu truy vấn 1
      queryString1 += ' WHERE (market_assets.asset_name LIKE ? OR market_assets.category LIKE ? OR accounts.username LIKE ? OR market_assets.description LIKE ?)';
      queryParameters1.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
  
      // Thêm điều kiện tìm kiếm vào câu truy vấn 2
      queryString2 += ' AND (market_assets.asset_name LIKE ? OR market_assets.category LIKE ? OR accounts.username LIKE ? OR market_assets.description LIKE ?)';
      queryParameters2.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
    }
  
    // Kiểm tra nếu có tham số sắp xếp được gửi từ client
    if (sortBy) {
      // Thêm điều kiện sắp xếp vào câu truy vấn 1
      queryString1 += ` ORDER BY ${sortBy} ${sortOrder}`;
  
      // Thêm điều kiện sắp xếp vào câu truy vấn 2
      queryString2 += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
  
    // Thực hiện truy vấn SQL
    let results = {};
  
    connection.query(queryString1, queryParameters1, (err, result1) => {
      if (err) throw err;
      results.systemAssets = result1;
  
      connection.query(queryString2, queryParameters2, (err, result2) => {
        if (err) throw err;
        results.userCart = result2;
  
        response.render('../views/market-assets_for_user', {results});
      });
    });
  }

    function addToCart(request, response) {
        const id = request.body.id;
        const user_id = request.session.user_id;
    
        // Kiểm tra xem đã tồn tại user_id và asset_id trong bảng carts hay chưa
        connection.query('SELECT * FROM carts WHERE user_id = ? AND asset_id = ?', [user_id, id], (err, results) => {
        if (err) throw err;
    
        if (results.length > 0) {
            // Nếu đã tồn tại user_id và asset_id, trả về false
            response.json({ success: false, error: 'duplicate' });
        } else {
            // Nếu chưa tồn tại, tiến hành thêm vào giỏ hàng
            connection.query('SELECT * FROM market_assets WHERE id = ?', [id], (err, results) => {
            if (err) throw err;
    
            const asset = results[0]; // Lấy tài sản từ kết quả truy vấn
    
            const cartData = {
                asset_id: asset.id,
                user_id: user_id,
                // Thêm các thông tin khác về tài sản vào đây
            };
    
            connection.query('INSERT INTO carts SET ?', cartData, (err, results) => {
                if (err) throw err;
                const addedAsset = results[0];
                response.json({ success: true, asset });
            });
            });
        }
        });
    }

    function removeFromCart(request, response) {
      const id = request.body.id;
      const user_id = request.session.user_id;
      
      // Kiểm tra xem đã tồn tại user_id và asset_id trong bảng carts hay chưa
      connection.query('DELETE FROM carts WHERE user_id = ? AND asset_id = ?', [user_id, id], (err, results) => {
        if (err) throw err;
    
        if (results.affectedRows > 0) {
          // Nếu xóa thành công, trả về true
          response.json({ success: true });
        } else {
          // Nếu không tìm thấy user_id và asset_id, trả về false
          response.json({ success: false, error: 'not_found' });
        }
      });
    }
module.exports = {
    getMarketAssets, addToCart, removeFromCart
};