// ẩn form
function hiddenForm(){
    document.getElementById('expense-form').style.display = 'none';
}
function tiente(a){
  return  a.value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
// hiển thị giao diện
function showExpenseForm(expenseInfo){
    document.getElementById("expense-form").style.display="block";
    let submitBtn =  document.getElementById("confirm-button");
    if(expenseInfo == "add"){
      submitBtn.classList.add('text-white')
      submitBtn.classList.add("bg-blue-500")
      submitBtn.classList.add('hover:bg-blue-700')
      submitBtn.classList.remove('text-gray-600')
      submitBtn.classList.remove('hover:text-gray-700')
      submitBtn.innerHTML="Thêm "
      submitBtn.setAttribute("onclick", 'addExpenseItem("add")');
    } else {
      const expense = JSON.parse(expenseInfo);
      const oldAmount = document.getElementById('name-expense').value;
      document.getElementById('name-expense').value = expense.name;
      document.getElementById('amount-expense').value = expense.amount;
      document.getElementById('note-expense').value = expense.note;
      submitBtn.classList.remove('text-white')
      submitBtn.classList.remove("bg-blue-500")
      submitBtn.classList.remove('hover:bg-blue-700')
      submitBtn.classList.add('text-gray-600')
      submitBtn.classList.add('hover:text-gray-700')
      submitBtn.innerHTML="Lưu lại"
      submitBtn.setAttribute("onclick", `editExpenseItem("${expense.id}", "${oldAmount}")`);    }
}

// sửa thông tin khoản chi
async function editExpenseItem(expenseInfo, oldAmount ) {
  // const expense = JSON.parse(expenseInfo);
  const expense_id = expenseInfo;
  const name = document.getElementById('name-expense').value;
  const amount = document.getElementById('amount-expense').value;
  const note = document.getElementById('note-expense').value;
  try {
    await axios.post('/expense-planner/edit', {
      expense_id,
      name,
      amount,
      note
    });
    const tbody = document.getElementById('data-expense');
    // Cập nhật thông tin khoản chi trong bảng
    const expenseRow = tbody.querySelector(`tr[data-value="${expense_id}"]`);
    console.log(oldAmount)
    const tdElements = expenseRow.querySelectorAll('td');
    tdElements[0].textContent = name;
    tdElements[1].textContent = amount;
    tdElements[2].textContent = note;

    // Cập nhật tổng chi và số dư
    const total_expense = document.getElementById('total-expense');
    const total_item = document.getElementById('total-item');
    const balance = document.getElementById('balance');
    const balance_label = document.getElementById('balance-label');
    total_item.dataset.value = BigInt(total_item.dataset.value) - BigInt(oldAmount) + BigInt(amount);
    total_item.innerHTML = formatCurrency(total_item.dataset.value);
    balance.dataset.value = BigInt(total_expense.dataset.value) - BigInt(total_item.dataset.value);
    balance.innerHTML = formatCurrency(balance.dataset.value);

    if (balance.dataset.value < 0) {
      balance_label.innerHTML = "Vượt";
    } else {
      balance_label.innerHTML = "Dư";
    }
    document.getElementById("expense-form").style.display="none";

  } catch (error) {
    console.error(error);
  }
}

// định dạng tiền dấu ,
function formatCurrency(number) {
  const formatter = new Intl.NumberFormat('vi-VN', {
    useGrouping: true
  });
  return replaceDotWithComma(formatter.format(number))+"đ";
  // return formatter.format(number);
}

function replaceDotWithComma(str) {
  return str.replace(/\./g, ',');
}


// thêm mục chi tiêu
async function addExpenseItem() {
  const name = document.getElementById('name-expense').value;
  const amount = document.getElementById('amount-expense').value;
  const note = document.getElementById('note-expense').value;
  document.getElementById("expense-form").style.display = "none";
  try {
    const response = await axios.post('/expense-planner/add', {
      name: name,
      amount: amount,
      note: note
    });
    const expense_id = response.data.id; // Lấy expense_id từ phản hồi của máy chủ
    const tbody = document.getElementById('data-expense');
    const html = `
      <tr data-value="${expense_id}" class="bg-white expenseItem border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td scope="row" class="flex items-center px-6 py-4 font-medium text-gray-900 dark:text-white">
          <div class="ps-3">
            <div class="text-base font-semibold"> ${name} </div>
          </div>
        </td>
        <td class="px-6 py-4" data-value="${amount}">
          ${amount}
        </td>
        <td class="px-6 py-4">
          ${note}
        </td>
        <td class="px-1 w-9 py-4" onclick="editExpenseItem(${expense_id})">
          <button><img src="/images/icons/pencil-blue.svg" alt=""></button>
        </td>
        <td class="px-1 py-4 opacity-50" onclick="deleteExpenseItem(${expense_id})">
          <button><img src="/images/icons/x_symbol.svg" alt=""></button>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', html);
    document.getElementById('name-expense').value = '';
    document.getElementById('amount-expense').value = '';
    document.getElementById('note-expense').value = '';
    //cập nhật số dư và tổng chi 
    const total_expense = document.getElementById('total-expense');
    let total_item = document.getElementById('total-item');
    let balance = document.getElementById('balance');
    let balance_label = document.getElementById('balance-label');
    total_item.dataset.value = BigInt(total_item.dataset.value) + BigInt(amount);
    console.log(total_item.dataset.value)
    total_item.innerHTML = formatCurrency(total_item.dataset.value);
    balance.dataset.value = BigInt(total_expense.dataset.value) - BigInt(total_item.dataset.value);
    balance.innerHTML = formatCurrency(balance.dataset.value);
    // updateBalance();
    if (balance.dataset.value < 0) {
      balance_label.innerHTML = "Vượt";
    } else {
      balance_label.innerHTML = "Dư";
    }
  } catch (error) {
    console.error(error);
  }
}


function updateBalance() {
  const totalExpenseElement = document.getElementById('total-expense');
  const totalItemElement = document.getElementById('total-item');
  const balanceElement = document.getElementById('balance');

  // Lấy giá trị từ các phần tử và chuyển đổi sang BigInt
  const totalExpense = BigInt(totalExpenseElement.dataset.value);
  const totalItem = BigInt(totalItemElement.dataset.value);

  // Tính toán số dư
  const balance = totalExpense - totalItem;

  // Cập nhật giá trị số dư trên giao diện
  balanceElement.textContent = balance;
  balanceElement.dataset.value = balance;
}

// Gọi hàm để cập nhật số dư ban đầu


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
function updateCart(){
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
//sửa mục chi tiêu

//xóa mục chi tiêu
function deleteExpenseItem(itemId){

}