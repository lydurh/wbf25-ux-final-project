import { BASE_URL } from './info.js';
import { handleError, showMessage } from './handle-errors.js';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};



document.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();


    const formData = {
        email: e.target.email.value.trim(),
        password: e.target.password.value.trim()

    }

    if (!formData.email || !formData.password) {
        showMessage("Email and password are required", "error");
        document.querySelectorAll("input").forEach(input => {
            input.classList.add("inputError");
        });
        return false;
    }

    if (!validateEmail(formData.email)) {
        showMessage("Please enter a valid email address", "error");
        document.querySelector("#email").classList.add("inputError")
        document.querySelector("#password").classList.remove("inputError")
        return false;
    }

    const params = new URLSearchParams();
    params.append('email', formData.email);
    params.append('password', formData.password);

    fetch(`${BASE_URL}/auth/login`,
        {
            method: 'POST',
            body: params
        }
    )
        .then(response => response.json())
        .then(data => {
            if (Object.keys(data).includes('user_id')) {
                sessionStorage.setItem('user_id', data.user_id);
                sessionStorage.setItem('user_token', data.auth_token);
                loadProfile(data.user_id)
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

const loadProfile = (user_id) => {

    const tokenHeader = new Headers({
        'X-Session-Token': sessionStorage.getItem('user_token')
    });

    fetch(`${BASE_URL}/users/${user_id}`,
        {
            headers: tokenHeader
        }
    )
        .catch(handleError);
};