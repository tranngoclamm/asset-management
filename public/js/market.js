

//ẩn hiện giỏ hàng
function toggleCart(){
  document.getElementById('cart-data').classList.toggle('hidden');
}

function formatPrice(price) {
    return price.toLocaleString('en-US'); // Định dạng theo định dạng của Hoa Kỳ
}

function formatDateFromXAMPP(xamppDate) {
    // Chuyển đổi định dạng từ Y-m-d thành d/m/Y
    const parts = xamppDate.split('-');
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    return `${day}/${month}/${year}`;
}
function updateCart(){
  if(document.getElementById('total-form')){
    const totalForm = document.getElementById('total-form');
    const numberTrElements = document.getElementsByClassName('number_tr');
    if (numberTrElements.length < 6){
      // Thiết lập thuộc tính sticky cho total-form
      totalForm.style.position = 'absolute';
      console.log(numberTrElements)
    } else{
      totalForm.style.position = 'sticky';
      console.log(numberTrElements)
    }
  }
}

updateCart();

// const formattedPrice = formatPrice(asset.price);

function getAssetDetail(idAsset){

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

// lọc theo thể loại
function filterByCategory(category) {
  var assets = document.getElementsByClassName("asset_item");
  if (assets !== null) {
    for (var i = 0; i < assets.length; i++) {
      var assetCategory = assets[i].querySelector(".asset_category");
      if (assetCategory !== null) {
        var categoryText = assetCategory.textContent.toLowerCase();
        if (categoryText === "#" + category.toLowerCase()) {
          assets[i].style.display = "block";
        } else {
          assets[i].style.display = "none";
        }
      }
    }
  }
}

// lọc những tài sản mới
function filterByStatus(status) {
  var assets = document.getElementsByClassName("asset_item");
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].querySelector(".asset_status") == null) {
      assets[i].style.display = "none";
  } else {
      assets[i].style.display = "block";
    }
  }
}
function hiddenAssetDetail(){
    document.getElementById('AssetDetail').style.display = 'none';
}

//hiện chi tiết tài sản trong chợ tài sản (admin)
function openAssetDetail(assetJSON, date) {
  var cleanJSON = assetJSON.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '); // Loại bỏ các ký tự không hợp lệ
  console.log(cleanJSON);
  var asset = JSON.parse(cleanJSON);
    console.log(asset)
    document.getElementById('chooseAssetId').value = asset.asset_id;
    document.getElementById('image-preview').style.backgroundImage = `url(/images/products/${asset.asset_id}.jpg)`;
    document.getElementById('AssetDetail').style.display = 'block';
    document.getElementById('name_detail').innerHTML = asset.asset_name;
    if(asset.status == "Mới"){
        document.getElementById('status_detail').innerHTML = "Còn mới";
    } else {
        document.getElementById('status_detail').innerHTML = asset.status;

    }
    document.getElementById('category_detail').innerHTML = asset.category;
    // let price = formatPrice(asset.price);
    document.getElementById('username').innerHTML = "@" + asset.username;
    document.getElementById('price_detail').dataset.value = asset.price;
    document.getElementById('price_detail').innerHTML = formatPrice(asset.price) + 'đ';
    if(typeof asset.purchase_date == 'undefined' || asset.purchase_date == 0 || asset.purchase_date == '0000-00-00'){
        document.getElementById('date_detail').innerHTML = "";
    } else{
      const dateObject = new Date(asset.purchase_date);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year}`;
        document.getElementById('date_detail').innerHTML = formattedDate;

    }
    if(asset.warranty_period == 'NaN '){
      document.getElementById('warranty_detail').innerHTML = '';
    } else{
      document.getElementById('warranty_detail').innerHTML = asset.warranty_period;

    }
    document.getElementById('depreciation_detail').innerHTML = asset.depreciation + '% / năm';
    document.getElementById('description_detail').innerHTML = asset.description;
    // Tiếp tục xử lý tài sản theo nhu cầu của bạn
    // Ví dụ: Hiển thị thông tin tài sản trong một modal, trang chi tiết, v.v.
  }

  //thêm vào giỏ hàng
  async function addToCart() {
    // Lấy thông tin tài sản
    const asset_id = document.getElementById('chooseAssetId').value;
    // Tạo đối tượng dữ liệu để gửi đến máy chủ
    const data = {
      id: asset_id,
    };
  
    try {
      // Gửi yêu cầu AJAX và chờ phản hồi
      const response = await axios.post('/market/add-to-cart', data);
  
      // Xử lý phản hồi từ máy chủ
      const success = response.data.success;
      if (success) {
        // Cập nhật giao diện người dùng
        document.getElementById('AssetDetail').style.display = 'none';
        document.getElementById("icon_notification").src="images/icons/done-icon.svg";
        document.getElementById("label_notification").innerHTML = "Sản phẩm đã được thêm vào giỏ hàng";
        showNotification();

        const tbody = document.getElementById('body-cart');
        const asset = response.data.asset;
        console.log(asset)
        const date = formatDateFromXAMPP('${asset.purchase_date}');
        const formattedPrice =asset.price.toLocaleString('vi-VN').replace(/\./g, ',') + 'đ';
        const html = `
            <tr class="number_tr" data-value = "${asset_id}">
            <td onclick="removeAssetFromCart(${asset.id})" data-account-id="${asset.id}" class="py-1 cursor-pointer whitespace-nowrap" style="min-width: 44px;">
                <img class="w-9 bg-contain h-11 ml-2" src="/images/products//${asset.id}.jpg" alt="">
            </td>
            <td class="getName dark:text-white" style="">
                <p class="ml-2 text-gray-900 font-medium w-44 whitespace-nowrap overflow-hidden overflow-ellipsis">${asset.asset_name}</p>
                <p class="text-gray-400 ml-2">${asset.category}</p>
            </td>
            <td class="text-blue-700 text-right font-medium">
              <span class="align-baseline font-medium text-blue-700" style="line-height: 1.25rem; font-size: 15px;">${formattedPrice}</span>
            </td>
            </tr>
        `;

        tbody.insertAdjacentHTML('beforeend', html);
        const totalCartElement = document.getElementById('total-cart');
        const totalPrice = BigInt(totalCartElement.dataset.value, 10);
        const newPrice = totalPrice + BigInt(asset.price);
        // Cập nhật giá trị mới vào value
        totalCartElement.dataset.value = newPrice.toString();
        const formattedPriceString =newPrice.toLocaleString('vi-VN').replace(/\./g, ',') + 'đ';
        totalCartElement.innerHTML = formattedPriceString;
      updateCart();
      } else { 
        document.getElementById('AssetDetail').style.display = 'none';
        document.getElementById("icon_notification").src="images/icons/redxicon.svg";
        document.getElementById("label_notification").innerHTML = "Không thể thêm sản phẩm đã có trong giỏ hàng!";
        showNotification();
      }
    } catch (error) {
        document.getElementById('AssetDetail').style.display = 'none';
        // alert('Không thể thêm sản phẩm đã có trong giỏ hàng!');
        console.log(error)
    }
  }

  // xóa tài sản khỏi giỏ hàng
  async function removeFromCart() {
    const asset_id = document.getElementById('chooseAssetId').value;
    const totalCartElement = document.getElementById('total-cart');
    // Tạo đối tượng dữ liệu để gửi đến máy chủ
    const data = {
      id: asset_id,
    };
    console.log(data)
    try {
      const response = await axios.post('/market/remove-from-cart', data);
  
      // Xử lý phản hồi từ máy chủ
      const success = response.data.success;
      if (success) {
        document.getElementById('AssetDetail').style.display = 'none';
        document.querySelector(`tr.number_tr[data-value="${asset_id}"]`).remove();
        const totalPrice = BigInt(totalCartElement.dataset.value, 10);
        var price = document.getElementById('price_detail').dataset.value;
        const newPrice = totalPrice - BigInt(price);
        // Cập nhật giá trị mới vào value
        totalCartElement.dataset.value = newPrice.toString();
        const formattedPriceString =newPrice.toLocaleString('vi-VN').replace(/\./g, ',') + 'đ';
        totalCartElement.innerHTML = formattedPriceString;
        updateCart();
      } else { 
        document.getElementById('AssetDetail').style.display = 'none';
        document.getElementById("icon_notification").src="images/icons/redxicon.svg";
        document.getElementById("label_notification").innerHTML = "Đã xóa khỏi giỏ hàng!";
        showNotification();
      }
    } catch (error) {
        document.getElementById('AssetDetail').style.display = 'none';
        console.log(error)
    }

  }
// cập nhật giao diện giỏ hàng và tổng giá


// function removeAssetFromCart(assetJSON, date){
  
//     openAssetDetail(assetJSON, date); // gọi hàm hiển thị chi tiết sản phẩm
//     // Thay đổi nút xác nhận
//     const buyNowButton = document.getElementById('buy-now-button');
//     buyNowButton.textContent = 'Xác nhận';
//     buyNowButton.setAttribute('onclick', 'hiddenAssetDetail()');
//     buyNowButton.classList.remove('text-white');
//     buyNowButton.classList.remove('hover:bg-blue-700');
//     buyNowButton.classList.remove('bg-blue-600');
//     buyNowButton.classList.add('text-gray-600');
//     buyNowButton.classList.add('hover:text-gray-700');
    
//     // Thay đổi icon xóa khỏi giỏ hàng
//     const addToCartButton = document.getElementById('add-to-cart-button');
//     addToCartButton.innerHTML = '<img src="images/icons/197224_meanicons_cart_remove_delete_buy_icon.svg" class="w-7 h-7" alt="">';
//     addToCartButton.setAttribute('onclick', 'removeFromCart()');
// }

// hiển thị giao diện chi tiết tài sản khi ở giỏ hàng
function removeAssetFromCart(asset_id) {
  const query = `.item_${asset_id}_market`;

  // Lấy phần tử <img> theo truy vấn CSS và thực hiện sự kiện click
  const imgElement = document.querySelector(query);
  if (imgElement) {
    imgElement.click();
  }
  const buyNowButton = document.getElementById('buy-now-button');
  buyNowButton.textContent = 'Xác nhận';
  buyNowButton.setAttribute('onclick', 'hiddenAssetDetail()');
  buyNowButton.classList.remove('text-white');
  buyNowButton.classList.remove('hover:bg-blue-700');
  buyNowButton.classList.remove('bg-blue-600');
  buyNowButton.classList.add('text-gray-600');
  buyNowButton.classList.add('hover:text-gray-700');
  
  // Thay đổi icon xóa khỏi giỏ hàng
  const addToCartButton = document.getElementById('add-to-cart-button');
  addToCartButton.innerHTML = '<img src="images/icons/197224_meanicons_cart_remove_delete_buy_icon.svg" class="w-7 h-7" alt="">';
  addToCartButton.setAttribute('onclick', 'removeFromCart()');
}

// trở lại giao diện cũ khi xem thông tin ở  chợ tài sản
function addAssetToCart(assetJSON, date){
  openAssetDetail(assetJSON, date); // gọi hàm hiển thị chi tiết sản phẩm
  // Thay đổi nút mua ngay
  const buyNowButton = document.getElementById('buy-now-button');
  buyNowButton.textContent = 'Mua ngay';
  buyNowButton.setAttribute('onclick', 'buyNow()');
  buyNowButton.classList.remove('text-gray-600');
  buyNowButton.classList.remove('hover:text-gray-700');
  buyNowButton.classList.add('text-white');
  buyNowButton.classList.add('hover:bg-blue-700');
  buyNowButton.classList.add('bg-blue-600');
  
  // Thay đổi icon thêm vào giỏ hàng
  const addToCartButton = document.getElementById('add-to-cart-button');
  addToCartButton.innerHTML = '<img src="images/icons/shopping-bag-add-icon.svg" class="w-7 h-7" alt="">';
  addToCartButton.setAttribute('onclick', 'addToCart()');
}
// hiển thị thông báo 
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display="block";
    document.getElementById('notification').style.zIndex="30";
    setTimeout(function() {
        notification.style.opacity = "1"; // Hiển thị form
        setTimeout(function() {
            notification.style.opacity = "0"; // Thực hiện hiệu ứng mờ dần
            setTimeout(function() {
                notification.style.display="none";
                document.getElementById('notification').style.zIndex="0";

                 // Ẩn form sau khi hoàn thành hiệu ứng
            }, 400); // Thời gian phù hợp với thời gian transition
        }, 3000); // Thời gian hiển thị trước khi bắt đầu hiệu ứng mờ dần
    }, 0);
}
//đóng cảnh báo xóa
function closeNotification(){
    document.getElementById('notification').style.display="none";
    document.getElementById('notification').style.zIndex="0";
}

document.getElementById('table-search').addEventListener('input', searchByName);
