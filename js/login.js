import { BASE_URL } from './info.js';
import { handleError } from './handle-errors.js';

document.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

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
            handleError(data.error);
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