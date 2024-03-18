
const inputField = document.querySelector('input[name="username"]');
function handleResponse(response) {
  // Lấy phần tử input và thông báo từ form
  const message = document.querySelector('p');
  const confirmButton = document.querySelector('button[type="submit"]');

  // Ẩn ô input và hiển thị thông báo
  inputField.style.display = 'none';
  message.style.display = 'block';

  // Kiểm tra mã phản hồi từ server
  if (response.status === 200) {
    // Nếu thành công, hiển thị thông báo thành công
    message.textContent = response.data;
    message.classList.remove('error');
    message.classList.add('success');
  } else {
    // Nếu không thành công, hiển thị thông báo lỗi
    message.textContent = response.data;
    message.classList.remove('success');
    message.classList.add('error');
  }

  // Thay đổi hành động của nút xác nhận
  confirmButton.textContent = 'Chuyển hướng';
  confirmButton.onclick = function() {
    window.location.href = '/';
  };
}
function forgot(){
  axios.post('/forgot',{username: inputField.value})
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