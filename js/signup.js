import { BASE_URL } from './info.js';
import { APIerrorResponse, handleError } from './handle-errors.js';

const validateForm = (formData) => {
  const errors = [];

      // Name validation
  if (formData.firstName.length < 2) {
      errors.push("First name must be at least 2 characters long");
  }
  if (formData.lastName.length < 2) {
      errors.push("Last name must be at least 2 characters long");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
  }


  // Password validation
  if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
  }
  if (!/[a-z]/.test(formData.password)) {
      errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(formData.password)) {
      errors.push("Password must contain at least one uppercase letter");
  }
  if (!/\d/.test(formData.password)) {
      errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      errors.push("Password must contain at least one special character");
  }

  // Phone validation
  const phoneRegex = /^\+?[\d\s-]{8,}$/;
  if (!phoneRegex.test(formData.phoneNumber)) {
      errors.push("Please enter a valid phone number");
  }

  // Birth date validation
  const dateBirth = new Date(formData.date);
  const today = new Date();

  if (isNaN(dateBirth.getTime())) {
      errors.push("Please enter a valid birth date");
  } else if (dateBirth > today) {
      errors.push("Birth date cannot be in the future");
  }
  return errors;
};


document.querySelector('#form-signup').addEventListener('submit', (e) => {
    e.preventDefault();

    // Password validation
    const password = e.target.password.value.trim();
    const repeatPassword = e.target.repeatPassword.value.trim();

    if (password !== repeatPassword) {
        handleError('Passwords must match.');
        return false;
    }


    // const validationErrors = validateForm(formData);

    // if (validationErrors.length > 0) {
    //     showMessage(validationErrors.join("\n"), "error", "main");
    //     return false;
    // }

    // Form submission
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const address = e.target.address.value.trim();
    const phoneNumber = e.target.phoneNumber.value.trim();
    const dateBirth = e.target.date.value.trim();

    
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('password', password);
    params.append('phone_number', phoneNumber);
    params.append('address', address);
    params.append('birth_date', dateBirth);

    fetch(`${BASE_URL}/users`, {
    method: "POST",
    body: params,
    })
  .then((response) => response.json())
  .then((data) => {
    if (Object.keys(data).includes("user_id")) {
        console.log(data.user_id, "- Signup successfull");
        window.location.href = "login.html";
    } else {
        APIerrorResponse(data.error);
    }
  })
  .catch(APIerrorResponse);


});