const fs = require('fs');
const path = require('path');

function upload(req, res) {
  const img = req.file;
  const isAccount = req.body.isAccount;
  const id = req.body.id;
  let localFolder;


   if(img){ // nếu up ảnh thì mới xử lý
       // Kiểm tra xem là account hay không
       if (isAccount == 1) {
          localFolder = path.join(__dirname, '../../public/images/avatars');
       
       } else {
          localFolder = path.join(__dirname, '../../public/images/products');
     
         // ...
       }
       const newFileName = id + '.jpg';
       const newPath = path.join(localFolder, newFileName);
     
       // Di chuyển tệp đến thư mục avatars và đổi tên
       fs.renameSync(img.path, newPath);
       fs.access(newPath, fs.constants.F_OK, (error) => {
        if (error) {
          // Xử lý lỗi nếu không thể truy cập tệp mới
          return;
        }
      
        // Tệp đã được đổi tên và di chuyển thành công
        // Tiếp tục xử lý logic khác ở đây sau khi tệp đã được đổi tên và di chuyển thành công
      });
     
     }
   }

module.exports={upload}

