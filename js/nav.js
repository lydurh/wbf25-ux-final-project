const user_id = sessionStorage.getItem("user_id");
const adminID = '2679';
const authLinks = document.getElementById("auth-links");

// Show admin link only for admin
if (user_id === adminID) {
    const li = document.createElement("li");
    const adminLink = document.createElement("a");
    adminLink.href = "admin.html";
    adminLink.textContent = "Admin";
    li.appendChild(adminLink);
    authLinks.appendChild(li);
}

// Show profile and logout links only for non-admin users
if (user_id && user_id !== adminID) {
    const li = document.createElement("li");
    const profileLink = document.createElement("a");
    profileLink.href = "profile.html";
    profileLink.textContent = "Profile";
    li.appendChild(profileLink);
    authLinks.appendChild(li);
}

// Show logout link for all authenticated users
if (user_id) {
    const logoutLi = document.createElement("li");
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("btn-logout");
    logoutLi.appendChild(logoutButton);
    authLinks.appendChild(logoutLi);
} else {
    // Show signup and login links for unauthenticated users
    const signupLi = document.createElement("li");
    const signupLink = document.createElement("a");
    signupLink.href = "signup.html";
    signupLink.textContent = "Sign up";
    signupLi.appendChild(signupLink);
    authLinks.appendChild(signupLi);

    const loginLi = document.createElement("li");
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.textContent = "Log in";
    loginLi.appendChild(loginLink);
    authLinks.appendChild(loginLi);
}

// Logout functionality
document.querySelectorAll('.btn-logout').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_token');
        window.location.href = 'index.html';
    });
});

// Burger menu functionality
document.getElementById("burger-menu").addEventListener("click", function () {
    document.querySelectorAll(".main-menu, .util-menu").forEach(menu => {
        menu.classList.toggle("show");
    });
});