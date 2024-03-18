const fs = require('fs');
const path = require('path');

function upload(req, res) {
  const img = req.file;
  const isAccount = req.body.isAccount;
  const id = req.body.id;
  let localFolder;
  console.log("laf anh567")


   if(img){ // nếu up ảnh thì mới xử lý
       // Kiểm tra xem là account hay không
       console.log("là ảnh")
       if (isAccount == 1) {
          localFolder = path.join(__dirname, '../../public/images/avatars');
          console.log("là tài khôarnr")
       
       } else {
          localFolder = path.join(__dirname, '../../public/images/products');
          console.log("là tài sản")
     
         // ...
       }
       const newFileName = id + '.jpg';
       const newPath = path.join(localFolder, newFileName);
     
       // Di chuyển tệp đến thư mục avatars và đổi tên
       fs.renameSync(img.path, newPath);
       console.log("kết thúc", id + '.jpg' )
       fs.access(newPath, fs.constants.F_OK, (error) => {
        if (error) {
          // Xử lý lỗi nếu không thể truy cập tệp mới
          console.error('Đổi tên và di chuyển tệp không thành công:', error);
          return;
        }
      
        // Tệp đã được đổi tên và di chuyển thành công
        console.log('Tệp đã được đổi tên và di chuyển thành công.');
        // Tiếp tục xử lý logic khác ở đây sau khi tệp đã được đổi tên và di chuyển thành công
      });
     
     }
   }

module.exports={upload}

