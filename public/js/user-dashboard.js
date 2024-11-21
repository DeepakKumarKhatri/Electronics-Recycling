document.addEventListener('DOMContentLoaded', () => {
    // Recycling History Chart
    const recyclingCtx = document.getElementById('recyclingChart').getContext('2d');
    new Chart(recyclingCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Recycled (kg)',
                data: [30, 45, 60, 75, 90, 105],
                borderColor: '#2ecc71',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Recycling Breakdown Chart
    const breakdownCtx = document.getElementById('breakdownChart').getContext('2d');
    new Chart(breakdownCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Plastics', 'Paper', 'Metal'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
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