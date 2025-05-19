import { BASE_URL } from './info.js';
import { handleError, showMessage } from './handle-errors.js';
import {header} from './api.js'

//Function to validate that the e-mail format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


// Event listener for the login form submission
// Prevents default form submission behavior
document.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();

    //collecting the values from the form
    const formData = {
        email: e.target.email.value.trim(),
        password: e.target.password.value.trim()

    }
    // check if email and password are provided
    if (!formData.email || !formData.password) {
        showMessage("Email and password are required", "error");
        document.querySelectorAll("input").forEach(input => {
            input.classList.add("inputError");
        });
        return false;
    }
    // Validate e-mail
    if (!validateEmail(formData.email)) {
        showMessage("Please enter a valid email address", "error");
        document.querySelector("#email").classList.add("inputError")
        document.querySelector("#password").classList.remove("inputError")
        return false;
    }
    // Preparing the data from the login form for the post request
    const params = new URLSearchParams();
    params.append('email', formData.email);
    params.append('password', formData.password);
    //POST request to the login endpoint
    fetch(`${BASE_URL}/auth/login`,
        {
            method: 'POST',
            body: params
        }
    )
        .then(response => response.json())
        .then(data => {
            // If login is successful, get the user data
            if (Object.keys(data).includes('user_id')) {
                sessionStorage.setItem('user_id', data.user_id);
                sessionStorage.setItem('user_token', data.auth_token);
                loadProfile(data.user_id)
                // Redirect based on admin or user
                if (data.user_id === 2679) {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "profile.html";
                }
            } else {
                handleError("Incorrect password", "error")
                document.querySelector("#email").classList.remove("inputError")
                document.querySelector("#password").classList.add("inputError")
            }
        })
        .catch(handleError);
});
// Function to load user profile based on user ID
const loadProfile = (user_id) => {
    fetch(`${BASE_URL}/users/${user_id}`, {
        headers: header
    })
    .catch(handleError);
};