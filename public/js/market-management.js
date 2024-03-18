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
let isHidden = true;
const dropdownLink = document.getElementById('dropdownNavbarLink');
const dropdownMenu = document.getElementById('dropdownNavbar');
openAssetForm=document.getElementById('openAssetForm');
let assetId;
let ascending = true; // Biến để kiểm tra trạng thái sắp xếp hiện tại
asset_id = document.getElementById('asset_id');
asset_name = document.getElementById('asset_name');
category = document.getElementById('category');
asset_status = document.getElementById('asset_status');
price = document.getElementById('price');
date = document.getElementById('date');
warranty_period = document.getElementById('warranty_period');
depreciation = document.getElementById('depreciation');
description = document.getElementById('description');
AssetAction = document.getElementById('AssetAction');


function openAssetForm(){
  document.getElementById('AssetForm').style.display = 'block';

}
function chooseImage() {
  document.getElementById('fileInput').click();
  document.getElementById('fileInput').addEventListener('change', function(event) {
    // Lấy file được chọn
    const file = event.target.files[0];
    console.log("Đường dẫn:", file);

    // Tạo đường dẫn đến ảnh
    const imageUrl = URL.createObjectURL(file);

    // Gán ảnh vào div image-preview
    const imagePreview = document.getElementById('image-preview');
    imagePreview.style.backgroundImage = `url(${imageUrl})`;
    imagePreview.innerHTML="";

    // Kiểm tra xem có tệp nào được chọn không
        // Tạo một đường dẫn URL tạm thời đến tệp đã chọn
        const fileUrl = URL.createObjectURL(file);
        // avatar.value = imageUrl;
        // Sử dụng đường dẫn URL tạm thời cho mục đích của bạn
        // console.log("Đường dẫn của tệp đã chọn:", fileUrl);
        console.log("Đường dẫn của tệp đã chọn:", fileUrl);
  });
}

function sort() {
    let sortIcon = document.getElementById('sortIcon');

    // Kiểm tra trạng thái sắp xếp hiện tại và thay đổi biểu tượng tương ứng
    if (ascending) {
        sortIcon.src = "images/icons/ic-alphabetical-sorting-za.svg"; // Chuyển sang biểu tượng sắp xếp ZA
    } else {
        sortIcon.src = "images/icons/ic-alphabetical-sorting-az.svg"; // Chuyển sang biểu tượng sắp xếp AZ
    }
    // Đảo ngược trạng thái sắp xếp
    ascending = !ascending;
}
// tìm kiếm tên tài sản
function searchByName() {
  var input = document.getElementById("table-search").value.toLowerCase();
  var assets = document.getElementsByClassName("asset_item");

  for (var i = 0; i < assets.length; i++) {
    var nameElement = assets[i].querySelector(".asset_name");
    var name = nameElement.textContent.toLowerCase();

    if (name.includes(input)) {
      assets[i].style.display = "block";
      var highlightedText = highlightText(name, input);
      nameElement.innerHTML = highlightedText;
      nameElement.classList.add="font-medium";
    } else {
      assets[i].style.display = "none";
      nameElement.innerHTML = name;
    }
  }
}

// Tạo văn bản được tô màu
function highlightText(text, keyword) {
  var regex = new RegExp(keyword, "gi");
  return text.replace(regex, "<span class='text-blue-500'>$&</span>");
}


function hiddenAssetForm(){
  document.getElementById('AssetForm').style.display = 'none';
}
function openAddAsset(){
  AssetForm.style.display = 'flex';
  document.getElementById('labelAssetBtn').innerText = 'Thêm tài sản';
  document.getElementById('submitBtn').style.backgroundColor = 'blue'; 
  document.getElementById('deleteBtn').style.display = 'none';
  asset_id = document.getElementById('asset_id');
  asset_name.value = "";
  category.value = "";
  asset_status.value = "";
  price.value = "";
  date.value = "";
  warranty_period.value = "";
  depreciation.value = "";
  description.value = "";
  AssetAction.value = "";
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

function selectBtn(){
  // Kiểm tra trạng thái hiện tại của các thành phần
  if(isHidden){
    document.querySelectorAll('.changeBtn').forEach(btn => {
      btn.style.display = 'none';
    });
    document.querySelectorAll('.checkboxBtn').forEach(btn => {
      btn.style.display = 'flex';
    });
    isHidden=false;
  } else{
    document.querySelectorAll('.checkboxBtn').forEach(btn => {
      btn.style.display = 'none';
      btn.checked = false;
    });
    document.querySelectorAll('.changeBtn').forEach(btn => {
      btn.style.display = 'block';
    });
    document.getElementById('deleteBtnSelect').style.display = 'none';
    isHidden=true;
  }

  // Ẩn/hiện các thành phần tương ứng
  // document.querySelectorAll('.checkboxBtn').forEach(btn => {
  //   btn.style.display = isHidden ? 'block' : 'none';
  // });
  // document.querySelectorAll('.changeBtn').forEach(btn => {
  //   btn.style.display = isHidden ? 'none' : 'block';
  // });
  // document.getElementById('deleteBtnSelec').style.display = isHidden ? 'block' : 'none';
};

function openDeleteBtnSelect(){
  document.getElementById('deleteBtnSelect').style.display = 'block';
}

function alertDelete(){
  document.getElementById('DeleteForm').style.display = 'block';
  const selectedIds = [];
  document.querySelectorAll('.checkboxBtn').forEach(checkbox => {
      if (checkbox.checked) {
          const row = checkbox.closest('tr');
          const idColumn = row.querySelector('td.hidden').textContent;
          selectedIds.push(idColumn);
          console.log(selectedIds);
      }
    });
    document.getElementById('selectedIds').value = selectedIds.join(',');
  }
function cancelDelete(){
  document.getElementById('DeleteForm').style.display = 'none';
}

function confirmDelete() {
  // Lấy danh sách các ID được chọn từ checkbox


  // Submit form
  // document.getElementById('deleteForm').submit();
  // Gọi hàm xóa với mảng các tài sản đã chọn
}
function openEditAsset(element){
    document.getElementById('AssetForm').style.display = 'block';
    document.getElementById('labelAssetBtn').innerText = 'Lưu';
    document.getElementById('submitBtn').style.backgroundColor = 'green'; 
    document.getElementById('deleteBtn').style.display = 'block';
    assetId = element;
    const asset = document.getElementById('asset_' + assetId);
    const cells = asset.getElementsByTagName('td');
    document.getElementById('asset_id').value = cells[0].textContent;
    const td = document.querySelector('.getName'); 
    const paragraphs = td.querySelectorAll('p'); // Lấy tất cả các thẻ <p> trong thẻ <td>
    asset_name.value = paragraphs[0].textContent; // Lấy nội dung của thẻ <p> đầu tiên
    category.value = paragraphs[1].textContent;
    asset_status.value = cells[4].textContent;
    price.value = cells[5].textContent;
    const dateValue = cells[6].textContent; // Giả sử đây là một chuỗi ngày có định dạng dd/mm/yyyy
    // Chuyển đổi chuỗi ngày sang định dạng YYYY-MM-DD
    const parts = dateValue.split('/');
    const formattedDate = `${parts[2].trim()}-${parts[1].trim().padStart(2, '0')}-${parts[0].trim().padStart(2, '0')}`;
    date.value = formattedDate;
    warranty_period.value = cells[7].textContent;
    depreciation.value = cells[8].textContent;
    description .value = cells[9].textContent;
    AssetAction.setAttribute('action', '/asset-management/update');

  }

  //duyệt tài sản

  // duyệt đơn tài sản
  function acceptAsset(asset_id){
    document.getElementById('asset_acp_list').value = asset_id;
    document.getElementById('submitAccept').click();
  }

  //duyệt nhiều bằng checkbox
  function acceptAssets(){
    const selectedIds = [];
    const multilAcpBtn = document.getElementById('multil_acp_btn');
    const checkboxes = document.querySelectorAll('.choose_acp_assets');
    let count = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        count++;
        const row = checkbox.closest('tr'); // lấy hàng đó để lấy thông tin id tài sản
        const idColumn = row.querySelector('td.asset_id').textContent;
        selectedIds.push(idColumn); // thêm id vào list
      }
    });
    if (count == 0) { // nếu không có tài sản nào được chọn, tích chọn tất cả
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else if (count > 0) {
      document.getElementById('asset_acp_list').value = selectedIds; //gán giá trị cho selectedIds
      document.getElementById('submitAccept').click(); //click button để post dến server
    }
  }

  //không duyệt đơn tài sản
  function denyAsset(asset_id){
    document.getElementById('asset_deny_list').value = asset_id;
    document.getElementById('submitDeny').click();
  }
  //không duyệt bằng checkbox
  function denyAssets(){
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('.choose_deny_assets');
    let count = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        count++;
        const row = checkbox.closest('tr'); // lấy hàng đó để lấy thông tin id tài sản
        const idColumn = row.querySelector('td.asset_id').textContent;
        selectedIds.push(idColumn); // thêm id vào list
      }
    });
    if (count == 0) { // nếu không có tài sản nào được chọn, tích chọn tất cả
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else if (count > 0) {
      document.getElementById('confirmDenyForm').style.display="block";
      document.getElementById('asset_deny_list').value = selectedIds; //gán giá trị cho selectedIds
      // document.getElementById('submitDeny').click(); //click button để post dến server
    }
  }
  

function openSellAsset(element){
  document.getElementById('AssetForm').style.display = 'block';
  document.getElementById('labelAssetBtn').innerText = 'Đăng bán';
  document.getElementById('submitBtn').style.backgroundColor = 'white'; 
  document.getElementById('submitBtn').style.color = 'blue'; 
  document.getElementById('deleteBtn').style.display = 'none';
  assetId = element;
  console.log(assetId)
  const asset = document.getElementById('asset_' + assetId);
  const cells = asset.getElementsByTagName('td');
  document.getElementById('asset_id').value = cells[0].textContent;
  asset_name.value = cells[2].textContent;
  category.value = cells[3].textContent;
  asset_status.value = cells[4].textContent;
  price.value = cells[5].textContent;
  const dateValue = cells[6].textContent; // Giả sử đây là một chuỗi ngày có định dạng dd/mm/yyyy
  // Chuyển đổi chuỗi ngày sang định dạng YYYY-MM-DD
  const parts = dateValue.split('/');
  const formattedDate = `${parts[2].trim()}-${parts[1].trim().padStart(2, '0')}-${parts[0].trim().padStart(2, '0')}`;
  date.value = formattedDate;
  warranty_period.value = cells[7].textContent;
  depreciation.value = cells[8].textContent;
  description .value = cells[9].textContent;
  AssetAction.setAttribute('action', '/asset-management/sell');
}

  function openDeleteAsset(){
      document.getElementById('AssetForm').style.display = 'none';
      document.getElementById('DeleteForm').style.display = 'block';
      document.getElementById('selectedIds').value = assetId;
  }

  // khi click vào button multil select bên trái sẽ hiện checkbox để chọn nhiều asset(duyệt tài sản)
  function chooseAcp() {
    const acpAssets = document.querySelectorAll('.acp_asset');
    const chooseAcpAssets = document.querySelectorAll('.choose_acp_assets');
    const multilAcpBtn = document.getElementById('multil_acp_btn');
    if (multilAcpBtn.style.display === 'none' || multilAcpBtn.style.display === "") {
      acpAssets.forEach((element) => {
        element.style.display = 'none';
      });
      chooseAcpAssets.forEach((element) => {
        element.style.display = 'block';
      });
      multilAcpBtn.style.display = 'block';
    } else {

      chooseAcpAssets.forEach((element) => {
        element.style.display = 'none';
      });
      acpAssets.forEach((element) => {
        element.style.display = 'block';
      });
    
      multilAcpBtn.style.display = 'none';
  
      const checkboxes = document.querySelectorAll('.choose_acp_assets');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }

// click mutil select bên phải sẽ hiện checkbox(từ chối duyệt)
function chooseDeny() {
  const denyAssets = document.querySelectorAll('.deny_asset');
  const chooseDenyAssets = document.querySelectorAll('.choose_deny_assets');
  const multilDenyBtn = document.getElementById('multil_deny_btn');
  console.log(multilDenyBtn.style.display)
  if (multilDenyBtn.style.display === 'none' || multilDenyBtn.style.display === "") {
    denyAssets.forEach((element) => {
      element.style.display = 'none';
    });
    chooseDenyAssets.forEach((element) => {
      element.style.display = 'block';
    });
    multilDenyBtn.style.display = 'block';
  } else {

    chooseDenyAssets.forEach((element) => {
      element.style.display = 'none';
    });
    denyAssets.forEach((element) => {
      element.style.display = 'block';
    });
  
    multilDenyBtn.style.display = 'none';

    const checkboxes = document.querySelectorAll('.choose_deny_assets');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
}

// hiển thị icon duyệt nhiều tài sản cùng lúc
function openMutilAcpBtn() {
    const checkboxes = document.querySelectorAll('.choose_acp_assets');
    let count = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        count++;
      }
    });
    const acpAssets = document.querySelectorAll('.acp_asset');
    const chooseAcpAssets = document.querySelectorAll('.choose_acp_assets');

    if (count == 0) { // nếu không có tài sản nào được chọn, hiển thị về như cũ
      document.getElementById('multil_acp_btn').style.display='none';
      acpAssets.forEach((element) => {
        element.style.display = 'block';
      });
      chooseAcpAssets.forEach((element) => {
        element.style.display = 'none';
      });
    } else if (count > 0) {
      document.getElementById('multil_acp_btn').style.display='block';
    }
}

// hiển thị icon từ chối duyêt nhiều tài sản cùng lúc
function openMutilDenyBtn() {
  const checkboxes = document.querySelectorAll('.choose_deny_assets');
  let count = 0;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      count++;
    }
  });
  console.log(count)

  const denyAssets = document.querySelectorAll('.deny_asset');
  const chooseDenyAssets = document.querySelectorAll('.choose_deny_assets');

  if (count == 0) { // nếu không có tài sản nào được chọn, hiển thị về như cũ
    document.getElementById('multil_deny_btn').style.display='none';
    denyAssets.forEach((element) => {
      element.style.display = 'block';
    });
    chooseDenyAssets.forEach((element) => {
      element.style.display = 'none';
    });
  } else if (count > 0) {
    document.getElementById('multil_deny_btn').style.display='block';
  }
}

