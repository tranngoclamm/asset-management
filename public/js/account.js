const openOverlayButton = document.getElementById('openAddAccount');
const closeOverlayButton = document.getElementById('closeAddAccount');
const accountForm = document.getElementById('accountForm');
const imagePreview = document.getElementById('image-preview');
const username = document.getElementById('username');
const idUser = document.getElementById('idUser');
const password = document.getElementById('password');
const email = document.getElementById('email');
const full_name = document.getElementById('full_name');
const phone_number = document.getElementById('phone_number');
const role = document.getElementById('role');
const birth_date = document.getElementById('birth_date');
const address = document.getElementById('address');
let avatarUrl = document.getElementById('fileInput');
let avatar = document.getElementById('avatarUrl');
let add = true;
const dropdownLink = document.getElementById('dropdownNavbarLink');
const dropdownMenu = document.getElementById('dropdownNavbar');
var rowsPerPage = 12;
var totalRows = document.querySelectorAll(".searched").length;
console.log(totalRows)

//     // Tính toán số lượng trang
//     var totalPages = Math.ceil(totalRows / rowsPerPage);

//     // Trang hiện tại
//     var currentPage = 1;
// showPage(currentPage)

// function showPage(pageNumber) {
//   console.log(totalRows)
//   var startIndex = (pageNumber - 1) * rowsPerPage;
//   var endIndex = Math.min(startIndex + rowsPerPage, totalRows);

//   // Ẩn tất cả các hàng
//   var rows = document.querySelectorAll(".searched");
//   rows.forEach(function(row) {
//       row.style.display = "none";
//   });

//   // Hiển thị các hàng ứng với trang được chọn
//   for (var i = startIndex; i < endIndex; i++) {
//       rows[i].style.display = "";
//   }

//   // Hiển thị số trang hiện tại (nếu tồn tại)
//   var currentPageSpan = document.querySelector("#paginationButtons .current-page");
//   if (currentPageSpan) {
//       currentPageSpan.textContent = pageNumber.toString();
//   }
// }

// function prevPage() {
//  totalRows = document.querySelectorAll(".searched");
// console.log(totalRows)
//   console.log(currentPage)
// console.log(totalRows)

//   if (currentPage > 1) {
//       currentPage--;
//       showPage(currentPage);
//   }
// }

// // Hàm hiển thị trang tiếp theo
// function nextPage() {
// console.log(totalRows)

//   console.log(currentPage)

//   if (currentPage < totalPages) {
//       currentPage++;
//       showPage(currentPage);
//   }
// }
// function showPage(pageNumber) {
//   var startIndex = (pageNumber - 1) * rowsPerPage;
//   var endIndex = Math.min(startIndex + rowsPerPage, totalRows);

//   // Ẩn tất cả các hàng
//   var rows = document.querySelectorAll("#data_default tbody tr");
//   rows.forEach(function(row) {
//       row.style.display = "none";
//   });

//   // Hiển thị các hàng ứng với trang được chọn
//   for (var i = startIndex; i < endIndex; i++) {
//       rows[i].style.display = "";
//   }

//   // Hiển thị số trang hiện tại
//   var currentPageSpan = document.createElement("span");
//   currentPageSpan.textContent = pageNumber;
//   currentPageSpan.classList.add("border", "py-0.5", "px-1", "current-page");
//   var paginationButtons = document.getElementById("paginationButtons");
//   paginationButtons.replaceChild(currentPageSpan, paginationButtons.querySelector(".current-page"));
// }



function getdata(resultsData) {
    // const results = JSON.parse(resultsData);

    return resultsData;
}
dropdownLink.addEventListener('click', function() {
  dropdownMenu.classList.toggle('hidden');
});

function cancelDelete(){
  document.getElementById('DeleteForm').style.display = 'none';
}



function openAddAccount(){

  accountWrapper.style.display = 'block';
  document.getElementById('image-preview').value = 0;
    document.getElementById('img_product').setAttribute('onchange',' handleImageSelectionInAdd(event)'); 
    document.getElementById('submitBtn').style.display='none';
    document.getElementById('addUserBtn').style.display='block';
}

function handleImageSelectionInAdd(event){
  document.getElementById('id_avtforImg').value=document.getElementById('idUser').value;
  console.log(document.getElementById('id_avtforImg').value)
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const backgroundContainer = document.getElementById('image-preview');
    backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
  };

  reader.readAsDataURL(file);
}
async function addUser() {
  const account = {};
  account.username = document.getElementById('username').value;
  account.password = document.getElementById('password').value;
  account.full_name = document.getElementById('full_name').value;
  account.email = document.getElementById('email').value;
  account.phone_number = document.getElementById('phone_number').value;
  account.birth_date = document.getElementById('birth_date').value;
  account.role = document.getElementById('role').value;
  account.address = document.getElementById('address').value;
  console.log("account: " + account);

  // Kiểm tra dữ liệu đầu vào
  if (!account.username || !account.password || !account.full_name || !account.email || !account.phone_number || !account.birth_date || !account.role || !account.address) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  try {
    const response = await axios.post('/account-management/add', { account });
    const id = response.data.id;
    console.log(response);
    if (response.status === 400) {
      // Nếu thành công, hiển thị thông báo lỗi
      alert('Tài khoản đã có người sử dụng!');
      console.log("lỗi 400");
      return;
    }
    document.getElementById('id_avtforImg').value = id; // gán id vào form up ảnh
    setTimeout(uploadImage, 20); // up ảnh

    document.getElementById('accountForm').style.display = 'none'; // ẩn giao diện
    setTimeout(() => {
      window.location.href = "/account-management";
    }, 50);
  } catch (err) {
    alert('Có lỗi xảy ra khi thêm tài khoản!');
    console.log(err);
  }
}

closeOverlayButton.addEventListener('click', function () {
  accountWrapper.style.display = 'none';
});

function uploadImage(){
  
    // Tạo một phần tử input file ẩn
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // Thêm sự kiện người dùng chọn tệp tin
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      // Đọc nội dung của file ảnh đã chọn
      reader.addEventListener('load', (event) => {
        const imageUrl = event.target.result;

        // Hiển thị hình ảnh đã chọn trong phần xem trước
        imagePreview.style.backgroundImage = `url(${imageUrl})`;
        document.getElementById('avatarUrl').value = imageUrl;
        const backgroundImage = imagePreview.style.backgroundImage;
        const imageUrl1 = backgroundImage.slice(4, -1).replace(/"/g, '');
        console.log(imageUrl1);

      });

      // Đọc tệp tin ảnh
      reader.readAsDataURL(file);
    });

    // Kích hoạt sự kiện click cho phần tử input file
    fileInput.click();
}

function openEditAccount(element){
    accountWrapper.style.display = 'block';
    document.getElementById('addUserBtn').style.display='none';
    document.getElementById('submitBtn').style.display = 'block';
    document.getElementById('submitBtn').style.backgroundColor = 'green'; 
    const accountId = element.dataset.accountId;
    const account = document.getElementById('Account_' + accountId);
    const cells = account.getElementsByTagName('td');
    const imagePreview = document.getElementById('image-preview');
    imagePreview.style.backgroundImage = `url(/images/avatars/${accountId}.jpg)`;
    // Kiểm tra nếu số lượng ô trong hàng tài khoản đúng
    idUser.value = cells[0].textContent;
    username.value = cells[1].textContent;
    password.value = cells[2].textContent;
    full_name.value = cells[3].textContent;
    email.value = cells[4].textContent;
    phone_number.value = cells[5].textContent;
    // birth_date.value = cells[5].textContent;
    // Lấy giá trị ngày từ một nguồn dữ liệu, ví dụ như cột thứ 5 (index 4) trong một hàng của bảng
    const dateValue = cells[6].textContent; // Giả sử đây là một chuỗi ngày có định dạng dd/mm/yyyy

    // Chuyển đổi chuỗi ngày sang định dạng YYYY-MM-DD
    const parts = dateValue.split('/');
    const formattedDate = `${parts[2].trim()}-${parts[1].trim().padStart(2, '0')}-${parts[0].trim().padStart(2, '0')}`;
    // Thiết lập giá trị cho trường input birth_date
    document.getElementById('birth_date').value = formattedDate;

    role.value = cells[7].textContent;
    address.value = cells[8].textContent;
    password.disabled = true;
    accountForm.setAttribute('action', '/account-management/update');

  }

function deleteAccount(element){
    const accountId = element.dataset.accountId;
    const account = document.getElementById('Account_' + accountId);
    const cells = account.getElementsByTagName('td');
    idUser.value = cells[0].textContent;
    username.value = cells[1].textContent;
    document.getElementById('idUserDeleted').value = idUser.value;
    document.getElementById('idDeleted').innerHTML = `@${username.value}`;
    document.getElementById('DeleteForm').style.display = 'block';
    console.log(document.getElementById('idDeleted').value)

  }

function resetAccount(username){
  axios.post('/forgot',{username: username})
  .then(response => {
    handleResponse(response);
  })
  .catch(error => {
    console.error('Error:', error);
    // Xử lý lỗi khi không kết nối được server
    const message = document.querySelector('p');
    message.textContent = 'Đã xảy ra lỗi khi kết nối đến server.';
    message.classList.remove('success');
    message.classList.add('error');
  });
  }

function submitBtn(){
    if(add==true){
      accountForm.setAttribute('action', '/account-management/add');
      
    }
    else {
      accountForm.setAttribute('action', '/account-management/edit');
    }

}

// tìm kiếm và sắp xếp
function searchData() {
  // Lấy giá trị từ ô input tìm kiếm
  var keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  
  // Lấy giá trị từ ô select sắp xếp
  var sortBy = document.getElementById("sortBy").value;
  
  // Lọc và sắp xếp dữ liệu theo từ khóa tìm kiếm và cột sắp xếp
  var filteredData = results.filter(function(item) {
    return item.username.toLowerCase().includes(keyword);
  }).sort(function(a, b) {
    return a[sortBy].localeCompare(b[sortBy]);
  });
  
  // Ẩn bảng data_defaul
  document.getElementById("data_defaul").style.display = "none";
  
  // Hiển thị dữ liệu mới trong bảng new_data
  displayData(filteredData);
  console.log(filteredData)
}

function sortTable(columnIndex) {
  const table = document.getElementById('data_defaul');
  const rows = Array.from(table.getElementsByTagName('tr'));

  // Bỏ qua hàng đầu tiên (cột tiêu đề)
  const dataRows = rows.slice(1);

  dataRows.sort((a, b) => {
    const cellA = a.getElementsByTagName('td')[columnIndex].innerText || a.getElementsByTagName('td')[columnIndex].textContent;
    const cellB = b.getElementsByTagName('td')[columnIndex].innerText || b.getElementsByTagName('td')[columnIndex].textContent;
    if (columnIndex === 0) {
      // Sắp xếp cột đầu tiên theo thứ tự ID tăng dần khi giá trị là 0
      const idA = parseInt(cellA, 10);
      const idB = parseInt(cellB, 10);
      return idA - idB;
    } else if (columnIndex === 1 || columnIndex === 3) {
      // Sắp xếp theo tên tài khoản hoặc họ tên
      const valueA = cellA.trim();
      const valueB = cellB.trim();
      return valueA.localeCompare(valueB, 'vi', { sensitivity: 'base' });
    } else if (columnIndex === 7) {
      // Sắp xếp theo quyền
      return cellA.localeCompare(cellB, 'en', { sensitivity: 'base' });
    } else {
      // Sắp xếp theo giá trị mặc định của cột
      return cellA.localeCompare(cellB, 'en', { sensitivity: 'base' });
    }
  });

  // Thêm lại hàng đầu tiên (cột tiêu đề) vào mảng đã sắp xếp
  const sortedRows = [rows[0], ...dataRows];

  // Xóa tất cả các hàng hiện tại khỏi bảng
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  // Thêm lại các hàng đã sắp xếp vào bảng
  sortedRows.forEach(row => {
    table.appendChild(row);
  });
}
 


// tìm kiếm
function searchAccounts() {
  const keyword = document.getElementById('searchInput').value;
  const table = document.getElementById('data_defaul');
  const rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    let found = false;

    for (let j = 1; j < cells.length - 3; j++) { // Bắt đầu từ 1 và kết thúc trước 3 ô cuối cùng
      const cellValue = cells[j].innerText;
      
      if (cellValue.includes(keyword)) {
        found = true;
        const regex = new RegExp(keyword, 'gi');
        const highlightedText = cellValue.replace(regex, '<span class="highlighted">$&</span>');
        cells[j].innerHTML = highlightedText;
      }
    }

    if (found) {
      rows[i].style.display = '';
      rows[i].classList.add('searched')

    } else {
      rows[i].style.display = 'none';
      rows[i].classList.remove('searched')

    }
  }
}

// hiển thị ảnh ở preview
function handleImageSelection(event) {
  document.getElementById('id_avtforImg').value=document.getElementById('idUser').value;
  console.log(document.getElementById('id_avtforImg').value)
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const backgroundContainer = document.getElementById('image-preview');
    backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
  };
  document.getElementById('submit_img').click()

  reader.readAsDataURL(file);
  console.log('hi12')

}

// gửi ảnh lên server
function uploadImage() {
  console.log("đã chuanrabi up")
  try {
    const form = document.getElementById('img-upload-form');
    const formData = new FormData(form);
    
    const response =  fetch('/upload-image/product', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      
      // Tiếp tục xử lý logic khác ở đây sau khi ảnh đã được upload thành công
      
      // Chuyển hướng trang
      console.log('up xong')
      window.location.href = '/account-management';
    } else {
      throw new Error('Upload image failed');
    }
  } catch (error) {
    console.error('Upload image failed:', error);
  }
}

// change password
 async function changePassWord() {
  const username = document.getElementById('username').value;
  const oldPassword = document.getElementById('oldpassword').value;
  const newPassword = document.getElementById('newpassword').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Kiểm tra mật khẩu mới và mật khẩu nhập lại
  if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và mật khẩu nhập lại không khớp');
      return;
  }

  try {
    const response = await axios.post('/change-password', {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  
    // Xử lý phản hồi từ máy chủ ở đây
    console.log(response.data); // Hiển thị dữ liệu phản hồi từ máy chủ
    alert('Đổi mật khẩu thành công');
  } catch (error) {
    // Xử lý lỗi ở đây
    if (error.response) {
      // Phản hồi từ máy chủ có mã lỗi
      if (error.response.status === 400) {
        // Lỗi tài khoản không tồn tại
        alert('Mật khẩu cũ không đúng');
      } else if (error.response.status === 500) {
        // Lỗi trong quá trình xử lý yêu cầu
        alert('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
      }
    } else {
      // Lỗi không có phản hồi từ máy chủ
      console.error(error);
      alert('Đã xảy ra lỗi khi đổi mật khẩu');
    }
  }}

// xuất Excel 
function exportToExcel() {
  const table = document.getElementById('data_defaul');
  const rows = Array.from(table.getElementsByTagName('tr'));

  // Tạo một đối tượng Workbook mới
  const workbook = XLSX.utils.book_new();

  // Tạo một đối tượng Worksheet mới với tên là "Data"
  const worksheet = XLSX.utils.table_to_sheet(table);

  // Lặp qua từng hàng và loại bỏ cột mật khẩu
  XLSX.utils.sheet_add_aoa(worksheet, rows.map(row => Array.from(row.children).map((cell, index) => index !== 2 ? cell.innerText : "")));

  // Thêm Worksheet vào Workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Xuất Workbook thành một tệp Excel
  XLSX.writeFile(workbook, 'data.xlsx');
}
// Gọi hàm tìm kiếm khi người dùng thay đổi giá trị trong ô input
document.getElementById('searchInput').addEventListener('input', searchAccounts);