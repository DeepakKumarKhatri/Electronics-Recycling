document.addEventListener('DOMContentLoaded', () => {
    const itemSubmissionForm = document.getElementById('itemSubmissionForm');
    const itemImages = document.getElementById('itemImages');
    const imagePreview = document.getElementById('imagePreview');
    const itemList = document.getElementById('itemList');

    // Handle image preview
    itemImages.addEventListener('change', (e) => {
        imagePreview.innerHTML = '';
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.file = file;
                imagePreview.appendChild(img);

                const reader = new FileReader();
                reader.onload = (function(aImg) {
                    return function(e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        }
    });

    // Handle form submission
    itemSubmissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(itemSubmissionForm);
        const itemData = Object.fromEntries(formData.entries());
        
        // Here you would typically send the form data to your server
        // For this example, we'll just add it to the item list
        addItemToList(itemData);
        
        itemSubmissionForm.reset();
        imagePreview.innerHTML = '';
        alert('Item submitted successfully!');
    });

    function addItemToList(item) {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <img src="${URL.createObjectURL(item.itemImages[0])}" alt="${item.itemType}">
            <h3>${item.itemType}</h3>
            <p>${item.itemDescription}</p>
            <p>Condition: ${item.itemCondition}</p>
            <p>Weight: ${item.itemWeight} kg</p>
            <p class="status">Status: Pending</p>
        `;
        itemList.prepend(itemCard);
    }

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

document.addEventListener("DOMContentLoaded", () => {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Profile Dropdown
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    userAvatar.addEventListener('click', () => {
        userDropdown.classList.toggle('show');
    });

    // Close Dropdown on Click Outside
    document.addEventListener('click', (e) => {
        if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
});