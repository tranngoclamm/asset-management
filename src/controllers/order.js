const moment = require("moment");
const connection = require('./db');
const { request } = require("http");
let dataValues =[]

 function createPayment (req, res, next) {
    process.env.TZ = "Asia/Ho_Chi_Minh";
  
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
  
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  
    let config = require("config");
  
    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    dataValues = req.body.dataValues;
  
    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
      
      vnp_Params = sortObject(vnp_Params);
        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        res.set("Content-Type", "text/html");
        res.send(JSON.stringify(vnpUrl));
      
      }

  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  function createTransaction(req, res) {
    const transactionStatus = req.query.vnp_TransactionStatus;
    console.error(dataValues)
    if (transactionStatus === '00') {
      dataValues.forEach((id) => {
        const transactionDate = req.query.vnp_PayDate;
        const buyerId = req.session.user_id;
  
        const selectSql = 'SELECT * FROM assets WHERE id = ?';
  
        connection.query(selectSql, [id], (err, results) => {
          if (err) {
            console.error('Lỗi khi lấy thông tin tài sản từ CSDL:', err);
            return;
          }
  
          if (results.length === 0) {
            console.error(`Không tìm thấy tài sản với ID ${id}`);
            return;
          }
  
          const asset = results[0];
          const { asset_name, category, status, price, purchase_date, warranty_period, depreciation, description, user_id } = asset;
  
          const insertSql = 'INSERT INTO transaction (transaction_id, asset_name, category, status, price, purchase_date, warranty_period, depreciation, description, transaction_date, seller_id, buyer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [req.query.vnp_TxnRef, asset_name, category, status, price, purchase_date, warranty_period, depreciation, description, transactionDate, user_id, buyerId];
  
          connection.query(insertSql, insertValues, (err, result) => {
            if (err) {
              console.error('Lỗi khi lưu thông tin giao dịch vào CSDL:', err);
              return;
            }
  
            console.error('Thông tin giao dịch đã được lưu vào CSDL');
  
            const deleteSql = 'DELETE FROM assets WHERE id = ?';
  
            connection.query(deleteSql, [id], (err, result) => {
              if (err) {
                console.error('Lỗi khi xóa tài sản từ CSDL:', err);
                return;
              }
  
              console.error(`Tài sản với ID ${id} đã được xóa khỏi bảng assets`);
            });
          });
        });
      });
    }
  }
module.exports = {
    createPayment, createTransaction
}