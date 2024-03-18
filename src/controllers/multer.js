const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let pathOrigin = path.resolve(__dirname, '../../public/images')
    cb(null, pathOrigin);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname);
  },
});

var upload = multer({ storage: storage });
exports.uploadMulter = upload;