import { BASE_URL } from './info.js';
import { handleAPIError, handleError, showMessage } from './handle-errors.js';

const validateForm = (formData) => {
    const errors = [];

    // Name validation
    if (formData.firstName.length < 2) {
        errors.push("First name must be at least 2 characters long");
    }
    if (formData.lastName.length < 2) {
        errors.push("Last name must be at least 2 characters long");
    }
    

    // Birth date validation
    const dateBirth = new Date(formData.dateBirth);
    const today = new Date();

    if (isNaN(dateBirth.getTime())) {
        errors.push("Please enter a valid birth date");
    } else if (dateBirth > today) {
        errors.push("Birth date cannot be in the future");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push("Please enter a valid email address");
    }

    // Home Adress validation
    if (formData.address.length < 2) {
        errors.push("Adress must be at least 2 characters long");
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

    return errors;
    
    
};




document.querySelector('#form-signup').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Form submission
    const formData = {

        firstName: e.target.firstName.value.trim(),
        lastName: e.target.lastName.value.trim(),
        email: e.target.email.value.trim(),
        address: e.target.address.value.trim(),
        dateBirth: e.target.date.value.trim(),
        phoneNumber: e.target.phoneNumber.value.trim(),
        password: e.target.password.value.trim(),
        repeatPassword: e.target.repeatPassword.value.trim()
    }
    // Password validation
    // const password = e.target.password.value.trim();
    // const repeatPassword = e.target.repeatPassword.value.trim();

    // if (password !== repeatPassword) {
    //     handleError('Passwords must match.');
    //     return false;
    // }
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
        showMessage(validationErrors[0], "error");
        return false;
    }


    
    const params = new URLSearchParams();
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('birth_date', dateBirth);
    params.append('email', email);
    params.append('phone_number', phoneNumber);
    params.append('address', address);
    params.append('password', password);


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
        handleError(data.error);
    }
  })
  .catch(handleAPIError);


});

