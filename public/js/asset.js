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
var asset_id = document.getElementById('asset_id');
var asset_name = document.getElementById('asset_name');
var category = document.getElementById('category');
var asset_status = document.getElementById('asset_status');
var price = document.getElementById('price');
var date = document.getElementById('date');
var warranty_period = document.getElementById('warranty_period');
var depreciation = document.getElementById('depreciation');
var description = document.getElementById('description');
var AssetAction = document.getElementById('AssetAction');

openAssetForm.addEventListener('click', function() {
  document.getElementById('AssetForm').style.display = 'block';
});

// up ảnh bằng multer
function chooseImage() {
  document.getElementById('img_product').click();

}
function formatCurrency(amount) {
  // Chuyển đổi số thành chuỗi và thêm dấu phân cách hàng nghìn
  const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedAmount + 'đ'; // Thêm đơn vị tiền tệ vào sau chuỗi đã định dạng
}

function formatNumber(input, hiddenInputId) {
  // Xóa tất cả các ký tự không phải số và dấu "," trong giá trị nhập vào
  let formattedValue = input.value.replace(/[^0-9]/g, '');

  // Sử dụng RegEx để thêm dấu phân cách sau mỗi 3 chữ số
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Cập nhật giá trị đã được định dạng vào input
  input.value = formattedValue;

  // Lấy giá trị thật (không dấu phân cách)
  const trueValue = formattedValue.replace(/,/g, '');

  // Lấy tham chiếu đến phần tử ẩn
  const hiddenInput = document.getElementById(hiddenInputId);

  // Cập nhật giá trị thật vào thuộc tính value của phần tử ẩn
  hiddenInput.value = trueValue;

  // Xử lý sự kiện khi người dùng nhấn phím
  input.addEventListener('keydown', function(event) {
    // Kiểm tra nếu phím Enter được nhấn
    if (event.keyCode === 13) {
      // Ngăn chặn hành động mặc định của phím Enter
      event.preventDefault();

      // Gửi form
      this.form.submit();
    }
  });
}

// hiển thị ảnh ở preview
function handleImageSelection(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const backgroundContainer = document.getElementById('image-preview');
    backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
  };
  const chooseImageSpan = document.getElementById('chooseImageSpan');
  if (file) {
    chooseImageSpan.style.display = 'none';
  } else {
    chooseImageSpan.style.display = 'block';
  }

  reader.readAsDataURL(file);
  document.getElementById('submit_img').click();

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

function hiddenAssetForm(){ // ẩn form thêm/ sửa tài sản
  document.getElementById('AssetForm').style.display = 'none';
}
function openAddAsset(){ // hiện giao diện thêm tài sản
  const confirmBtns = document.querySelectorAll('.confirmBtnList');
    confirmBtns.forEach(btn => {
      btn.style.display = 'none';
    });
  AssetForm.style.display = 'flex';
  document.getElementById('actionBtn').style.display = "flex";
  document.getElementById('deleteBtn').style.display = 'none';
  document.getElementById('labelAssetBtn').innerText = 'Thêm tài sản';
  document.getElementById('submitBtn').style.backgroundColor = "#0476af";
  // document.getElementById('submitBtn').classList.remove = "hover:bg-gray-600";
  document.getElementById('submitBtn').classList.add = "hover:bg-blue-700";
  asset_id = document.getElementById('asset_id');
  asset_name.value = "";
  category.value = "";
  asset_status.value = "";
  price.value = "";
  date.value = "";
  warranty_period.value = "";
  warranty_type.value = "";
  depreciation.value = "";
  description.value = "";
  AssetAction.value = "";
  document.getElementById('image-preview').style.backgroundImage="";
  document.getElementById('chooseImageSpan').style.display = 'block';
  document.getElementById('submitBtn').setAttribute('onclick', 'submitEvent("add")');

}

// btn xác nhận thêm/ sửa/ bán tài sản
async function submitEvent(type) {
  var warranty_period = document.getElementById('warranty_period');
  warranty_period.value = warranty_period.value + " " + document.getElementById('warranty_type').value ;
  if (type === "edit" || type ==="sell") {
    document.getElementById('hiddenConfirmBtn').click(); // Gửi form đến /asset-management/edit
    document.getElementById('AssetForm').style.display = 'none'; // Ẩn giao diện
    // window.location.href = '/asset-management';
  } else if (type === "add") {
    addAsset();
  }
}


// thêm tài sản dùng axios
// async function addAsset() {
//   const asset = {};
//   asset.asset_name = asset_name.value;
//   asset.category = category.value;
//   asset.status = asset_status.value;
//   asset.price = price.value;
//   asset.purchase_date = date.value;
//   asset.warranty_period = warranty_period.value;
//   asset.depreciation = depreciation.value;
//   asset.description = description.value;
//   console.log("asset: " + asset.asset_name)
//   try {
//     const response = await axios.post('/asset-management/add', { asset });
//     const id = response.data.asset_id;
//     console.log("đã rp:", id)
//     document.getElementById('id_assetforImg').value = id; // gán id vào form up ảnh
//     console.log("imgid: ", document.getElementById('id_assetforImg').value)
//     document.getElementById('submit_img').click(); // up ảnh
//     document.getElementById('AssetForm').style.display = 'none'; // ẩn giao diện
//     // window.location.replace('/asset-management'); // chuyển hướng trang
//   } catch (err) {
//     console.log(err);
//   }
// }

async function addAsset() {
  const asset = {};
  asset.asset_name = asset_name.value;
  asset.category = category.value;
  asset.status = asset_status.value;
  asset.price = price.value;
  asset.purchase_date = date.value;
  asset.warranty_period = warranty_period.value ;
  asset.depreciation = depreciation.value;
  asset.description = description.value;
  console.log("asset: " + asset.asset_name)
  try {
    const response = await axios.post('/asset-management/add', { asset });
    const id = response.data.asset_id;
    document.getElementById('id_assetforImg').value = id; // gán id vào form up ảnh
    setTimeout(uploadImage, 20); // up ảnh
    setTimeout(close, 20); // up ảnh

    document.getElementById('AssetForm').style.display = 'none'; // ẩn giao diện
  // document.getElementById('submit_img').click();

  } catch (err) {
    console.log(err);
  }
}

function close(){
  window.location.href = '/asset-management'; // chuyển hướng trang

}
 function uploadImage() {
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
      window.location.href = '/asset-management';
    } else {
      throw new Error('Upload image failed');
    }
  } catch (error) {
    console.error('Upload image failed:', error);
  }
}

// ẩn/ hiện nút xóa nhiều tài sản
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
    const confirmBtns = document.querySelectorAll('.confirmBtnList');
    confirmBtns.forEach(btn => {
      btn.style.display = 'none';
    });
    document.getElementById('AssetForm').style.display = 'block';
    document.getElementById('actionBtn').style.display = 'flex';
    document.getElementById('labelAssetBtn').innerText = 'Lưu';
    document.getElementById('submitBtn').style.backgroundColor = "#6B7280";
    document.getElementById('deleteBtn').style.display = 'block';
    document.getElementById('submitBtn').setAttribute('onclick', 'submitEvent("edit")');
    assetId = element;
    document.getElementById('asset_id').value = assetId;
    document.getElementById('id_assetforImg').value = document.getElementById('asset_id').value; // gán id vào form up ảnh
    console.log(document.getElementById('id_assetforImg').value)
    const asset = document.getElementById('asset_' + assetId);
    const cells = asset.getElementsByTagName('td');
    document.getElementById('asset_id').value = cells[0].textContent;
    asset_name.value = cells[2].textContent;
    category.value = cells[3].textContent;
    asset_status.value = cells[4].textContent;
    price.value = cells[5].dataset.value;
    const dateValue = cells[6].textContent; // Giả sử đây là một chuỗi ngày có định dạng dd/mm/yyyy
    // Chuyển đổi chuỗi ngày sang định dạng YYYY-MM-DD
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Biểu thức chính quy kiểm tra định dạng dd/mm/yyyy

    if (dateValue != null && dateValue != "" && dateValue != 0) {
      // Chuyển đổi chuỗi ngày sang định dạng YYYY-MM-DD
      const parts = dateValue.split('/');
      const formattedDate = `${parts[2].trim()}-${parts[1].trim().padStart(2, '0')}-${parts[0].trim().padStart(2, '0')}`;
      date.value = formattedDate;
    } else {
      date.value = "";

    }
    // const parts = dateValue.split('/');
    // const formattedDate = `${parts[2].trim()}-${parts[1].trim().padStart(2, '0')}-${parts[0].trim().padStart(2, '0')}`;
    // date.value = formattedDate;
    var warrantyText = cells[7].textContent;
    var warrantyValue = parseInt(warrantyText); // Chuyển giá trị thành số nguyên
    var warrantyUnit = warrantyText.replace(warrantyValue.toString(), '').trim(); // Loại bỏ giá trị và khoảng trắng
    if ( warrantyText !== "") {
      document.getElementById('warranty_period').value = warrantyValue;
      document.getElementById('warranty_type').value = warrantyUnit;
    } else{
      document.getElementById('warranty_period').value = "";
      document.getElementById('warranty_type').value = "";

    }
    depreciation.value = parseFloat(cells[8].textContent);
    description .value = cells[9].textContent;
    document.getElementById('chooseImageSpan').style.display ='none';
    document.getElementById('image-preview').style.backgroundImage = `url(/images/products/${assetId}.jpg)`;

    // AssetAction.setAttribute('action', '/asset-management/update');

  }

  function openSellAsset(element) {
    openEditAsset(element);
    const confirmBtns = document.querySelectorAll('.confirmBtnList');
    confirmBtns.forEach(btn => {
      btn.style.display = 'none';
    });
  
    // Kiểm tra ở hàng chờ duyệt
    axios.post('/asset-management/check-pending-assets?id=' + element)
      .then(response => {
        const isDuplicate = response.data.isDuplicate;
  
        // Nếu đang chờ duyệt, ngăn chặn tiếp tục bán
        if (isDuplicate) {
          document.getElementById('waitBtn').style.display = 'flex';
          return;
        }
  
        // Kiểm tra trên market
        axios.post('/asset-management/check-market-assets?id=' + element)
          .then(response => {
            const existsInMarket = response.data.isDuplicate;
  
            // Ngăn chặn bán khi đã bán
            if (existsInMarket) {
              document.getElementById('sellingBtn').style.display = 'flex';
              return;
            }
  
            // Hiển thị nút bán
            document.getElementById('deleteBtn').style.display = 'none';
            document.getElementById('sellBtn').style.display = 'flex';
            AssetAction.setAttribute('action', '/asset-management/sell'); // Chuyển form sang /sell
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  function openDeleteAsset(){
      document.getElementById('AssetForm').style.display = 'none';
      document.getElementById('DeleteForm').style.display = 'block';
      document.getElementById('selectedIds').value = assetId;
  }
