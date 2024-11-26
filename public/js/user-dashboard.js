document.addEventListener('DOMContentLoaded', async () => {
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/users/user-details', { credentials: 'include' });
        if (!response.ok) throw new Error("Failed to fetch user details");

        const { user } = await response.json();
        document.querySelector('.user-info span').textContent = `Welcome, ${user.fullName.split(" ")[0]}`;
        document.getElementById('userAvatar').src = user.imageUrl || '/default-avatar.png';
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/dashboard', { credentials: 'include' });
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const data = await response.json();

        // Update summary cards
        document.querySelector('.summary-card:nth-child(1) .summary-value').textContent = `${data.totalRecycled} kg`;
        document.querySelector('.summary-card:nth-child(2) .summary-value').textContent = data.rewardPoints;
        document.querySelector('.summary-card:nth-child(3) .summary-value').textContent = `${data.co2Saved.toFixed(2)} kg`;
        document.querySelector('.summary-card:nth-child(4) .summary-value').textContent = data.nextPickup || 'No pickup scheduled';

        // Recycling History Chart
        const recyclingCtx = document.getElementById('recyclingChart').getContext('2d');
        new Chart(recyclingCtx, {
            type: 'line',
            data: {
                labels: data.recyclingHistory.map(item => new Date(item.createdAt).toLocaleDateString()),
                datasets: [{
                    label: 'Recycled (kg)',
                    data: data.recyclingHistory.map(item => item._sum.weight),
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
                labels: data.recyclingBreakdown.map(item => item.itemType),
                datasets: [{
                    data: data.recyclingBreakdown.map(item => item._sum.weight),
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

        // Update recent activity
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = data.recentActivity.map(item => `
            <li>
                <span class="activity-date">${new Date(item.createdAt).toLocaleDateString()}</span>
                <span class="activity-description">Recycled ${item.weight}kg of ${item.itemType}</span>
            </li>
        `).join('');

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data. Please try refreshing the page.");
    }
});