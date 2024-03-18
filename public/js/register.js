const firstEmailInput = document.getElementById('first_email');
const lastEmailSelect = document.getElementById('last_email');
const emailInput = document.getElementById('email');
const roleInput = document.getElementById('roleInput');
roleInput.value = 'User';

function setEmailId() {
  const firstEmail = firstEmailInput.value;
  const lastEmail = lastEmailSelect.value;
  emailInput.value = firstEmail + lastEmail;
}

firstEmailInput.addEventListener('input', setEmailId);
lastEmailSelect.addEventListener('change', setEmailId);

 function returnRegister(){
   document.getElementById('alert-form').style.display='none';
    document.getElementById('register-form').style.display='block';

}
function goLoginForm(){
  window.location.href='/'
}

function alert(){
  document.getElementById('register-form').style.display='none';
  document.getElementById('alert-form').style.display='block';
}

function register(){
  // Frontend code to handle registration form submission
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const address = document.getElementById('address').value;
  const birth_date = document.getElementById('birth_date').value;
  const email = document.getElementById('email').value;
  const phone_number = document.getElementById('phone_number').value;
  const full_name =  document.getElementById('full_name').value;

  axios.post('/register', {
      username: username,
      password: password,
      full_name: full_name,
      email:email,
      phone_number:phone_number,
      birth_date:birth_date,
      role:roleInput.value, 
      address:address 
  })
  .then(function(response) {
    if(response.status == 200){

      alert();
      document.getElementById('label-alert').innerHTML = "Đăng ký thành công. Chuyển đến trang đăng nhập"
      document.getElementById('confirm-button').setAttribute('onclick', "goLoginForm()")
    }
  })
  .catch(function(error) {
      if (error.response && error.response.status == 400) {
        alert();
      document.getElementById('label-alert').innerHTML = "Tên tài khoản đã được sử dụng. Vui lòng chọn tên khác."
      } else {
        alert();
        document.getElementById('label-alert').innerHTML = "Đã có lỗi xảy ra khi đăng ký tài khoản."
      }
  });

}