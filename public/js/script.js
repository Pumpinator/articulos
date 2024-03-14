function checkPassword(confirmPassword) {
  if (confirmPassword.value != document.getElementById("password").value) {
    confirmPassword.setCustomValidity("Passwords do not match.");
  } else {
    confirmPassword.setCustomValidity("");
  }
}
