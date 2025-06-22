const contraseñaInput = document.getElementById('contraseña');
const passwordRequirements = document.getElementById('passwordRequirements');
const uppercaseRequirement = document.getElementById('uppercaseRequirement');
const lowercaseRequirement = document.getElementById('lowercaseRequirement');
const numberRequirement = document.getElementById('numberRequirement');
const specialCharRequirement = document.getElementById('specialCharRequirement');

// Mostrar requisitos al enfocar
contraseñaInput.addEventListener('focus', () => {
  passwordRequirements.style.display = 'block';
});

contraseñaInput.addEventListener('blur', () => {
  if (contraseñaInput.value === '') {
    passwordRequirements.style.display = 'none';
  }
});

// Validar contraseña en tiempo real
contraseñaInput.addEventListener('input', () => {
  const passwordValue = contraseñaInput.value;

  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  uppercaseRequirement.classList.toggle('valid', hasUpperCase);
  lowercaseRequirement.classList.toggle('valid', hasLowerCase);
  numberRequirement.classList.toggle('valid', hasNumber);
  specialCharRequirement.classList.toggle('valid', hasSpecialChar);

  uppercaseRequirement.classList.toggle('invalid', !hasUpperCase);
  lowercaseRequirement.classList.toggle('invalid', !hasLowerCase);
  numberRequirement.classList.toggle('invalid', !hasNumber);
  specialCharRequirement.classList.toggle('invalid', !hasSpecialChar);
});

const togglePassword = document.getElementById('togglePassword');
const toggleIcon = togglePassword.querySelector('i');

togglePassword.addEventListener('click', () => {
  const type = contraseñaInput.getAttribute('type') === 'password' ? 'text' : 'password';
  contraseñaInput.setAttribute('type', type);

  // Cambiar el ícono
  toggleIcon.classList.toggle('fa-eye');
  toggleIcon.classList.toggle('fa-eye-slash');
});
