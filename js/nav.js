
let user_id = sessionStorage.getItem("user_id");
let user_token = sessionStorage.getItem("user_token");
const adminID = '2679'


if (user_id !== null) {
    if (user_id === adminID) {
        document.querySelector('#user-logged')?.classList.add('hidden');
        document.querySelector('#not-logged')?.classList.add('hidden');
        document.querySelector('#admin-logged')?.classList.remove('hidden');
    } else {
        document.querySelector('#user-logged')?.classList.remove('hidden');
        document.querySelector('#admin-logged')?.classList.add('hidden');
        document.querySelector('#not-logged')?.classList.add('hidden');
    }
} else {
    document.querySelector('#user-logged')?.classList.add('hidden');
    document.querySelector('#admin-logged')?.classList.add('hidden');
    document.querySelector('#not-logged')?.classList.remove('hidden');
}

// Logging out implies removing user data from sessionStorage
    document.querySelectorAll('.btn-logout').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_token');
        window.location.href = 'index.html';
    });
});

console.log(".btn-logout")