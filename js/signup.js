import { BASE_URL } from './info.js';
import { handleAPIError, handleError, showMessage } from './handle-errors.js';

// Function to validate form data
// Takes an object (formData) containing all form inputs and performs validation checks
// Returns an array of error messages if there are any errors
const validateForm = (formData) => {
    const errors = [];

    // Name validation
    if (formData.firstName.length < 2) {
        errors.push("First name must be at least 2 characters");
        firstName.classList.add("inputError");

    }
    else {
        firstName.classList.remove("inputError");
    }

    if (formData.lastName.length < 2) {
        errors.push("Last name must be at least 2 characters");
        lastName.classList.add("inputError");
    }
    else {
        lastName.classList.remove("inputError");
    }


    // Birth date validation
    const dateBirth = new Date(formData.dateBirth);
    const today = new Date();

    if (isNaN(dateBirth.getTime())) {
        errors.push("Please enter a valid birth date");
        date.classList.add("inputError");
    } else if (dateBirth > today) {
        errors.push("Birth date cannot be in the future");
        date.classList.add("inputError");
    } else {
        date.classList.remove("inputError");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push("Please enter a valid email address");
        email.classList.add("inputError");
    } else {
        email.classList.remove("inputError");
    }

    // Home Adress validation
    if (formData.address.length < 2) {
        errors.push("Address must be at least 2 characters");
        address.classList.add("inputError");
    } else {
        address.classList.remove("inputError");
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
        errors.push("Please enter a valid phone number");
        phoneNumber.classList.add("inputError");
    } else {
        phoneNumber.classList.remove("inputError");
    }

    // Password validation
    if (formData.password.length < 8) {
        errors.push("Password must be at least 8 characters");
        password.classList.add("inputError");
    }
    else if (!/[a-z]/.test(formData.password)) {
        errors.push("Password must contain at least one lowercase letter");
        password.classList.add("inputError");
    }
    else if (!/[A-Z]/.test(formData.password)) {
        errors.push("Password must contain at least one uppercase letter");
        password.classList.add("inputError");
    }
    else if (!/\d/.test(formData.password)) {
        errors.push("Password must contain at least one number");
        password.classList.add("inputError");
    }
    else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
        errors.push("Password must contain at least one special character");
        password.classList.add("inputError");
    } else {
        password.classList.remove("inputError");
    }

    // Repeat Password validation - check if passwords match
    if (formData.password !== formData.repeatPassword) {
        errors.push("Passwords do not match");
        repeatPassword.classList.add("inputError");
    } else {
        repeatPassword.classList.remove("inputError");
    }

    return errors;


};


// Event listener for form submission
// Prevents the default submit action and triggers the form validation
// If validation passes, it sends a POST request to the server

document.querySelector('#form-signup').addEventListener('submit', (e) => {
    e.preventDefault();

    // Collects the values from the input fields in the form
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
    // Validate the form data
    const validationErrors = validateForm(formData);
    // If errors exist, show the first error and prevent submission
    if (validationErrors.length > 0) {
        showMessage(validationErrors[0], "error");
        return false;
    }



    const params = new URLSearchParams();
    params.append('first_name', formData.firstName);
    params.append('last_name', formData.lastName);
    params.append('email', formData.email);
    params.append('phone_number', formData.phoneNumber);
    params.append('address', formData.address);
    params.append('password', formData.password);
    params.append('repeat_password', formData.repeatPassword);
    params.append('birth_date', formData.dateBirth);

    // Send a POST request to the server with the form data
    fetch(`${BASE_URL}/users`, {
        method: "POST",
        body: params,
    })
        .then((response) => response.json())
        .then((data) => {
            // If the response contains user_id, redirect to login page
            if (Object.keys(data).includes("user_id")) {
                console.log(data.user_id, "- Signup successfull");
                window.location.href = "login.html";
            } else {
                // If error occurs, display the error message
                handleError(data.error);
            }
        })
        .catch(handleAPIError);


});

