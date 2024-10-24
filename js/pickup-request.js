document.addEventListener('DOMContentLoaded', () => {
    const pickupRequestForm = document.getElementById('pickupRequestForm');

    pickupRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(pickupRequestForm);
        const pickupData = Object.fromEntries(formData);

        // Validate form data
        if (!validateForm(pickupData)) {
            return;
        }

        // Simulate form submission (replace with actual API call in production)
        console.log('Pickup request submitted:', pickupData);
        alert('Thank you for your pickup request! We will contact you shortly to confirm the details.');

        // Reset form
        pickupRequestForm.reset();
    });

    function validateForm(data) {
        if (!data.name || !data.email || !data.phone || !data.address || !data['pickup-date'] || !data['pickup-time'] || !data.items) {
            alert('Please fill in all required fields.');
            return false;
        }

        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (!isValidPhone(data.phone)) {
            alert('Please enter a valid phone number.');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Set minimum date for pickup to tomorrow
    const pickupDateInput = document.getElementById('pickup-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    pickupDateInput.min = tomorrow.toISOString().split('T')[0];
});