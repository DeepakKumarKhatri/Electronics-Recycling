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
        // Here you would typically send the login data to a server
        console.log('Login submitted');
        alert('Login functionality will be implemented in the future.');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the registration data to a server
        console.log('Registration submitted');
        alert('Registration functionality will be implemented in the future.');
    });
});