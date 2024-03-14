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