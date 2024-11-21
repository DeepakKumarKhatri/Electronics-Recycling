// recycle-history.js
document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const historyList = document.getElementById('historyList');
    const totalItems = document.getElementById('totalItems');
    const totalWeight = document.getElementById('totalWeight');
    const co2Saved = document.getElementById('co2Saved');

    // Sample data (in a real application, this would come from a server)
    const recycleHistory = [
        { id: 1, date: '2024-05-01', type: 'electronics', item: 'Laptop', weight: 2.5, location: 'EcoTech Center', status: 'Completed' },
        { id: 2, date: '2024-04-28', type: 'batteries', item: 'AA Batteries', weight: 0.5, location: 'Community Dropoff', status: 'Completed' },
        { id: 3, date: '2024-04-15', type: 'appliances', item: 'Microwave', weight: 10, location: 'EcoTech Center', status: 'In Progress' },
        { id: 4, date: '2024-04-10', type: 'electronics', item: 'Smartphone', weight: 0.2, location: 'Mobile Collection', status: 'Completed' },
        { id: 5, date: '2024-03-22', type: 'other', item: 'Printer Cartridges', weight: 1, location: 'Office Recycling', status: 'Completed' },
    ];

    function updateHistoryList(filteredHistory) {
        historyList.innerHTML = '';
        filteredHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-details">
                    <h3>${item.item}</h3>
                    <p>Date: ${item.date}</p>
                    <p>Type: ${item.type}</p>
                    <p>Weight: ${item.weight} kg</p>
                    <p>Location: ${item.location}</p>
                </div>
                <div class="history-item-status">${item.status}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    function updateSummary(filteredHistory) {
        const itemCount = filteredHistory.length;
        const weightSum = filteredHistory.reduce((sum, item) => sum + item.weight, 0);
        const estimatedCO2Saved = weightSum * 2.5; // Assuming 2.5 kg CO2 saved per kg recycled

        totalItems.textContent = itemCount;
        totalWeight.textContent = `${weightSum.toFixed(1)} kg`;
        co2Saved.textContent = `${estimatedCO2Saved.toFixed(1)} kg`;
    }

    function applyFilters() {
        const dateRange = document.getElementById('dateRange').value;
        const itemType = document.getElementById('itemType').value;

        const now = new Date();
        const filteredHistory = recycleHistory.filter(item => {
            const itemDate = new Date(item.date);
            const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);

            return (dateRange === 'all' || daysDiff <= parseInt(dateRange)) &&
                   (itemType === 'all' || item.type === itemType);
        });

        updateHistoryList(filteredHistory);
        updateSummary(filteredHistory);
    }

    applyFiltersBtn.addEventListener('click', applyFilters);

    // Initial load
    applyFilters();

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