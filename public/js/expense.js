const balanceLabel = document.getElementById('balance-label');

// Kiểm tra số dư khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    const balance = document.getElementById('balance');

    // Thay đổi nội dung của balanceLabel nếu số dư > 0
    if (balance.dataset.value < 0) {
        balanceLabel.textContent = 'Vượt';
        balance.classList.remove('text-green-600');
        balance.classList.add('text-red-600');
        balance.textContent = formatCurrency(Math.abs(balance.dataset.value));    } 
    else {
      balanceLabel.textContent = 'Dư';
      balance.classList.remove('text-red-600');
      balance.classList.add('text-green-600');
      balance.textContent = formatCurrency(balance.dataset.value);
    }
  })

// chuyển định dạng số ngăn cách dấu ,
function formatCurrency(amount) {
  // Chuyển đổi số thành chuỗi và thêm dấu phân cách hàng nghìn
  const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedAmount + 'đ'; // Thêm đơn vị tiền tệ vào sau chuỗi đã định dạng
}

// định dạng tiền tệ input
function formatNumber(input) {
  // Xóa tất cả các ký tự không phải số và dấu "," trong giá trị nhập vào
  let formattedValue = input.value.replace(/[^0-9]/g, '');

  // Sử dụng RegEx để thêm dấu phân cách sau mỗi 3 chữ số
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Cập nhật giá trị đã được định dạng vào input
  input.value = formattedValue;
  // Lấy giá trị thật (không dấu phân cách) 
  const trueValue = formattedValue.replace(/,/g, '');
  document.getElementById('true_total-expense').value = trueValue;
  const inputTotalExpense = document.getElementById('input_total-expense');

// Xử lý sự kiện khi người dùng nhấn phím
  inputTotalExpense.addEventListener('keydown', function(event) {
    // Kiểm tra nếu phím Enter được nhấn
    if (event.keyCode == 13) {
      // Ngăn chặn hành động mặc định của phím Enter
      event.preventDefault();

      // Gửi form
      this.form.submit();
  }
});
}

// 
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

// ẩn form
function hiddenForm(){
    document.getElementById('expense-form').style.display = 'none';
}
// hiển thị giao diện
function showExpenseForm(expenseInfo){
    document.getElementById("expense-form").style.display="block";
    let submitBtn =  document.getElementById("confirm-button");
    if(expenseInfo == "add"){
      document.getElementById('name-expense').value = "";
      document.getElementById('amount-expense').value = "";
      
      document.getElementById('note-expense').value = "";
      submitBtn.classList.add('text-white')
      submitBtn.classList.add("bg-blue-500")
      submitBtn.classList.add('hover:bg-blue-700')
      submitBtn.classList.remove('text-gray-600')
      submitBtn.classList.remove('hover:text-gray-700')
      submitBtn.innerHTML="Thêm "
      submitBtn.setAttribute("onclick", 'addExpenseItem("add")');
    } else {
      const expense = JSON.parse(expenseInfo);
      // const oldAmount = document.getElementById('name-expense').value;
      const oldAmount = expense.amount;
      document.getElementById('name-expense').value = expense.name;
      document.getElementById('amount-expenseFormat').value = formatCurrency(expense.amount);
      document.getElementById('note-expense').value = expense.note;
      submitBtn.classList.remove('text-white')
      submitBtn.classList.remove("bg-blue-500")
      submitBtn.classList.remove('hover:bg-blue-700')
      submitBtn.classList.add('text-gray-600')
      submitBtn.classList.add('hover:text-gray-700')
      submitBtn.innerHTML="Lưu lại"
      console.log(oldAmount)
      submitBtn.setAttribute("onclick", `editExpenseItem("${expense.id}", "${oldAmount}")`);    
    }
}

// sửa thông tin khoản chi
async function editExpenseItem(expenseInfo, oldAmount ) {
  // const expense = JSON.parse(expenseInfo);
  const expense_id = expenseInfo;
  const name = document.getElementById('name-expense').value;
  const amount = document.getElementById('amount-expense').value;
  const note = document.getElementById('note-expense').value;

  const expense = {};
  expense.expense_id = expenseInfo;
  expense.name = document.getElementById('name-expense').value;
  expense.amount = document.getElementById('amount-expense').value;
  expense.note = document.getElementById('note-expense').value;

  try {
    await axios.post('/expense-planner/edit', {
      expense_id,
      name,
      amount,
      note
    });
    // Cập nhật thông tin khoản chi trong bảng
    const tbody = document.querySelector('tbody');
    tbody.querySelector(`tr[data-value="${expense_id}"]`)
    console.log(expense_id)
    const expenseRow = tbody.querySelector(`tr[data-value="${expense_id}"]`);
    const tdElements = expenseRow.querySelectorAll('td');
    tdElements[0].textContent = name;
    tdElements[1].textContent = formatCurrency(amount);
    tdElements[2].textContent = note;
    tdElements[3].setAttribute("onclick", `showExpenseForm("${expense}")`);


    // Cập nhật tổng chi và số dư
    // const total_expense = document.getElementById('total-expense');
    // const total_item = document.getElementById('total-item');
    // const balance = document.getElementById('balance');
    // const balance_label = document.getElementById('balance-label');
    // total_item.dataset.value = BigInt(total_item.dataset.value) - BigInt(oldAmount) + BigInt(amount);
    // total_item.innerHTML = formatCurrency(total_item.dataset.value);
    // balance.dataset.value = BigInt(total_expense.dataset.value) - BigInt(total_item.dataset.value);
    // balance.innerHTML = formatCurrency(balance.dataset.value);

    // if (balance.dataset.value < 0) {
    //   balance_label.innerHTML = "Vượt";
    // } else {
    //   balance_label.innerHTML = "Dư";
    // }
    window.location.href = 'http://127.0.0.1:3000/expense-planner';
    document.getElementById("expense-form").style.display="none";
  } catch (error) {
    console.error(error);
  }
}

// định dạng tiền dấu ,
// function formatCurrency(number) {
//   const formatter = new Intl.NumberFormat('vi-VN', {
//     useGrouping: true
//   });
//   return replaceDotWithComma(formatter.format(number))+"đ";
//   // return formatter.format(number);
// }

// function replaceDotWithComma(str) {
//   return str.replace(/\./g, ',');
// }


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
    const formattedAmount = formatCurrency(amount);
    const id = response.data.id; // Lấy expense_id từ phản hồi của máy chủ
    const expense = {};
    expense.id = id;
    expense.name = name;
    expense.amount = amount;
    expense.note = note;
    const jsonString = JSON.stringify(expense);
    // const jsonString = JSON.stringify(expense).replace(/"/g, '&quot;');
    const tbody = document.getElementById('data-expense');
    const html = `
    <tr data-value="${id}" class="bg-white expenseItem border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td scope="row" class="flex items-center px-6 py-4 font-medium text-gray-900 dark:text-white">
        <div class="ps-3">
          <div class="text-base font-semibold"> ${name} </div>
        </div>
      </td>
      <td class="px-6 py-4" data-value="${amount}">
        ${formattedAmount}
      </td>
      <td class="px-6 py-4">
        ${note}
      </td>
      <td class="px-1 w-9 py-4" onclick="showExpenseForm('{"id":304,"name":"","amount":"456","note":"6456"}')">
      <button><img src="/images/icons/pencil-blue.svg" alt=""></button>
  </td>
      <td class="px-1 py-4 opacity-50" onclick='deleteExpenseItem(${JSON.stringify(expense)})'>
        <button><img src="/images/icons/x_symbol.svg" alt=""></button>
      </td>
    </tr>
    `;
    
    tbody.insertAdjacentHTML('beforeend', html);
    document.getElementById('name-expense').value = '';
    document.getElementById('amount-expense').value = '';
    document.getElementById('note-expense').value = '';
    //cập nhật số dư và tổng chi 
    // const total_expense = document.getElementById('total-expense');
    // let total_item = document.getElementById('total-item');
    // let balance = document.getElementById('balance');
    // let balance_label = document.getElementById('balance-label');
    // total_item.dataset.value = BigInt(total_item.dataset.value) + BigInt(amount);
    // console.log(total_item.dataset.value)
    // total_item.innerHTML = formatCurrency(total_item.dataset.value);
    // balance.dataset.value = BigInt(total_expense.dataset.value) - BigInt(total_item.dataset.value);
    // balance.innerHTML = formatCurrency(balance.dataset.value);
    // // updateBalance();
    // if (balance.dataset.value < 0) {
    //   balance_label.innerHTML = "Vượt";
    // } else {
    //   balance_label.innerHTML = "Dư";
    // }
    window.location.href = 'http://127.0.0.1:3000/expense-planner';
  } catch (error) {
    console.error(error);
  }
}

// hiện input nhập tổng chi mới 
function editTotalExpense(){
  document.getElementById('total-expense').style.display="none";
  document.getElementById('fearher-icon').style.display="none";
  document.getElementById('input_total-expense').style.display="block";
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


// giữ vị trí tổng giá
// function holdPosition(){
//   const totalForm = document.getElementById('total-form');
//   const numberTrElements = document.getElementsByClassName('number_data');
//   if (numberTrElements.length < 6){
//     // Thiết lập thuộc tính sticky cho total-form
//     totalForm.style.position = 'absolute';
//     console.log(numberTrElements)
//   } else{
//     totalForm.style.position = 'sticky';
//     console.log(numberTrElements)
//   }
// }
// holdPosition();
// sửa mục chi tiêu

//xóa mục chi tiêu
async function deleteExpenseItem(expenseInfo) {
  const expense = JSON.parse(expenseInfo);
  const expense_id = expense.id;
  const amount = expense.amount;
  try {
    // Thực hiện yêu cầu xóa chi tiêu và lấy kết quả từ server
    const response = await axios.post('/expense-planner/delete', {
      expense_id
    });
    const success = response.data.success;
    
    if (success) {
      // Xóa hàng chi tiêu khỏi bảng
      const tbody = document.querySelector('tbody');
      tbody.querySelector(`tr[data-value="${expense_id}"]`).remove();
      
      // Cập nhật tổng chi và số dư
      const total_expense = document.getElementById('total-expense');
      const total_item = document.getElementById('total-item');
      const balance = document.getElementById('balance');
      const balance_label = document.getElementById('balance-label');
      
      total_item.dataset.value = BigInt(total_item.dataset.value) - BigInt(amount);
      total_item.innerHTML = formatCurrency(total_item.dataset.value);
      
      balance.dataset.value = BigInt(total_expense.dataset.value) - BigInt(total_item.dataset.value);
      balance.innerHTML = formatCurrency(balance.dataset.value);

      if (balance.dataset.value < 0) {
        balance_label.innerHTML = "Vượt";
      } else {
        balance_label.innerHTML = "Dư";
      }
      
      document.getElementById("expense-form").style.display = "none";
    } else {
      console.error("Xóa chi tiêu không thành công");
    }
  } catch (error) {
    console.error(error);
  }
}