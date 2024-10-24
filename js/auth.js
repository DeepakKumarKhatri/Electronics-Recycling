document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const authTitle = document.getElementById('authTitle');
    const authDescription = document.getElementById('authDescription');
    const loginText = document.getElementById('loginText');
    const registerText = document.getElementById('registerText');

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Register';
        authDescription.textContent = 'Create your account to start recycling!';
        loginText.classList.add('hidden');
        registerText.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Login';
        authDescription.textContent = 'Welcome back! Please login to your account.';
        registerText.classList.add('hidden');
        loginText.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        // console.log(email)

        // Check the email domain
        if (email.endsWith('@admin.com')) {
            // console.log("1")
            // Redirect to admin dashboard
            window.location.href = '/pages/admin-dashboard/index.html';
        } else {
            // console.log("2")
            // Redirect to user dashboard
            window.location.href = '/pages/user-dashboard/index.html';
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Redirect to user dashboard
        window.location.href = '/pages/user-dashboard/index.html';
    });
});
