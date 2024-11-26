document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const historyList = document.getElementById('historyList');
    const totalItems = document.getElementById('totalItems');
    const totalWeight = document.getElementById('totalWeight');
    const co2Saved = document.getElementById('co2Saved');

    async function fetchRecycleHistory(dateRange, itemType) {
        try {
            const response = await fetch(`/api/recycle-history?dateRange=${dateRange}&itemType=${itemType}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recycle history');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching recycle history:', error);
            alert('An error occurred while fetching your recycle history. Please try again.');
        }
    }

    function updateHistoryList(items) {
        historyList.innerHTML = '';
        items.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-details">
                    <h3>${item.itemType}</h3>
                    <p>Date: ${new Date(item.createdAt).toLocaleDateString()}</p>
                    <p>Description: ${item.description}</p>
                    <p>Weight: ${item.weight} kg</p>
                    <p>Condition: ${item.condition}</p>
                </div>
                <div class="history-item-status">${item.status}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    function updateSummary(summary) {
        totalItems.textContent = summary.totalItems;
        totalWeight.textContent = `${summary.totalWeight.toFixed(1)} kg`;
        co2Saved.textContent = `${summary.co2Saved.toFixed(1)} kg`;
    }

    async function applyFilters() {
        const dateRange = document.getElementById('dateRange').value;
        const itemType = document.getElementById('itemType').value;

        const data = await fetchRecycleHistory(dateRange, itemType);
        if (data) {
            updateHistoryList(data.items);
            updateSummary(data.summary);
        }
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