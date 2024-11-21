// profile-management.js
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const changeProfileImageBtn = document.getElementById('changeProfileImage');
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');

    // Handle profile image change
    changeProfileImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate password fields
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        // Here you would typically send the form data to your server
        // For this example, we'll just show an alert
        alert('Profile updated successfully!');
    });

    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // User dropdown functionality
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');

    userAvatar.addEventListener('click', () => {
        userDropdown.classList.toggle('show');
    });

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', (e) => {
        if (!e.target.matches('#userAvatar')) {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        }
    });
});