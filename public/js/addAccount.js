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


function getdata(resultsData) {
    // const results = JSON.parse(resultsData);

    console.log("233"+resultsData ); 
    return resultsData;
}
dropdownLink.addEventListener('click', function() {
  dropdownMenu.classList.toggle('hidden');
});

function cancelDelete(){
  document.getElementById('DeleteForm').style.display = 'none';
}
function openAddAccount(){
  accountForm.style.display = 'flex';
  document.getElementById('fileInput').addEventListener('change', function(event) {
    // Lấy file được chọn
    const file = event.target.files[0];
    console.log("Đường dẫn:", file);

    // Tạo đường dẫn đến ảnh
    const imageUrl = URL.createObjectURL(file);

    // Gán ảnh vào div image-preview
    const imagePreview = document.getElementById('image-preview');
    imagePreview.style.backgroundImage = `url(${imageUrl})`;

    // Kiểm tra xem có tệp nào được chọn không
        // Tạo một đường dẫn URL tạm thời đến tệp đã chọn
        const fileUrl = URL.createObjectURL(file);
        // avatar.value = imageUrl;
        // Sử dụng đường dẫn URL tạm thời cho mục đích của bạn
        // console.log("Đường dẫn của tệp đã chọn:", fileUrl);
        console.log("Đường dẫn của tệp đã chọn:", fileUrl);
  });
}

closeOverlayButton.addEventListener('click', function () {
  accountForm.style.display = 'none';
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
    accountForm.style.display = 'flex';
    document.getElementById('submitBtn').innerText = 'Chỉnh sửa';
    document.getElementById('submitBtn').style.backgroundColor = 'green'; 
    const accountId = element.dataset.accountId;
    const account = document.getElementById('Account_' + accountId);
    const cells = account.getElementsByTagName('td');
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

function resetAccount(element){
    console.log(element);
  }

function submitBtn(){
    if(add==true){
        console.log("thêm tài khoản");
    }
    else {
        console.log("chỉnh sửa");
    }

}

// tìm kiếm và sắp xếp
function searchData() {
  // Lấy giá trị từ ô input tìm kiếm
  var keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  
  // Lấy giá trị từ ô select sắp xếp
  var sortBy = document.getElementById("sortBy").value;
  console.log(keyword)
  console.log(sortBy)
  var a = 
  console.log(a)
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
}

// function displayData(data) {
//   var tableBody = document.getElementById("new_data");

//   // Xóa dữ liệu cũ trong bảng new_data
//   tableBody.innerHTML = "";

//   // Thêm dữ liệu mới vào bảng new_data
//   data.forEach(function(item) {
//     var row = document.createElement("tr");
//     row.innerHTML = `
//       <td>${item.id}</td>
//       <td class="pl-3">${item.username}</td>
//       <td class="hidden">${item.password}</td>
//       <td>${item.full_name}</td>
//       <td>${item.email}</td>
//       <td>${item.phone_number}</td>
//       <td>${formatDate(item.birth_date)}</td>
//       <td>${item.role}</td>
//       <td class="overflow-hidden whitespace-nowrap overflow-ellipsis" style="max-width: 160px;">${item.address}</td>
//       <td><div onclick="openEditAccount(this)" data-account-id="${item.id}" class="cursor-pointer"><img class="w-6 ml-2" src="images/icons/edit.svg" alt=""></div></td>
//       <td><div onclick="deleteAccount(this)" data-account-id="${item.id}" class="cursor-pointer"><img class="w-6 ml-2" src="images/icons/user-minus.svg" alt=""></div></td>
//       <td><div onclick="resetAccount(this)" data-account-id="${item.id}" class="cursor-pointer"><img class="w-6 ml-2" src="images/icons/password-reset-icon.png" alt=""></div></td>
//     `;
//     tableBody.appendChild(row);
//   });
// }

// Hàm sắp xếp theo cột
function sortTable(columnIndex) {
  const table = document.getElementById('data_defaul');
  const rows = Array.from(table.getElementsByTagName('tr'));

  // Bỏ qua hàng đầu tiên (cột tiêu đề)
  const dataRows = rows.slice(1);

  dataRows.sort((a, b) => {
    const cellA = a.getElementsByTagName('td')[columnIndex].innerText || a.getElementsByTagName('td')[columnIndex].textContent;
    const cellB = b.getElementsByTagName('td')[columnIndex].innerText || b.getElementsByTagName('td')[columnIndex].textContent;
    if (columnIndex === 0 && cellA === '0') {
      // Sắp xếp cột đầu tiên theo thứ tự id tăng dần khi giá trị là 0
      const idA = parseInt(a.getElementsByTagName('td')[0].innerText);
      const idB = parseInt(b.getElementsByTagName('td')[0].innerText);
      return idA - idB;
      console.log("0")
    } 
    else if (columnIndex === 3) {
      // Sắp xếp theo tên người dùng
      const nameA = cellA.split(' ').pop();
      const nameB = cellB.split(' ').pop();
      return nameA.localeCompare(nameB, 'en', { sensitivity: 'base' });
      console.log(3)
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

  for (let i = 0; i < sortedRows.length; i++) {
    table.appendChild(sortedRows[i]);
  }
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
    } else {
      rows[i].style.display = 'none';
    }
  }
}

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