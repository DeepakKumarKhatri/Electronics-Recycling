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

document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const avatar = document.getElementById("userAvatar");
    const dropdown = document.getElementById("userDropdown");

    avatar.addEventListener("click", function () {
        dropdown.classList.toggle("show");
    });

    // Close the dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!avatar.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });
});
