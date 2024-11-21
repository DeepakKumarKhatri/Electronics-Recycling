// search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const locationFilter = document.getElementById('locationFilter');
    const searchResults = document.getElementById('searchResults');

    // Sample data (in a real application, this would come from a server)
    const recycleData = [
        { id: 1, date: '2024-05-01', category: 'electronics', item: 'Laptop', weight: 2.5, location: 'EcoTech Center' },
        { id: 2, date: '2024-04-28', category: 'batteries', item: 'AA Batteries', weight: 0.5, location: 'Community Dropoff' },
        { id: 3, date: '2024-04-15', category: 'appliances', item: 'Microwave', weight: 10, location: 'EcoTech Center' },
        { id: 4, date: '2024-04-10', category: 'electronics', item: 'Smartphone', weight: 0.2, location: 'Mobile Collection' },
        { id: 5, date: '2024-03-22', category: 'other', item: 'Printer Cartridges', weight: 1, location: 'Office Recycling' },
    ];

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const dateRange = parseInt(dateFilter.value);
        const location = locationFilter.value;

        const now = new Date();
        const filteredResults = recycleData.filter(item => {
            const itemDate = new Date(item.date);
            const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);

            return (item.item.toLowerCase().includes(searchTerm) ||
                    item.category.toLowerCase().includes(searchTerm) ||
                    item.location.toLowerCase().includes(searchTerm)) &&
                   (category === 'all' || item.category === category) &&
                   (dateRange === 'all' || daysDiff <= dateRange) &&
                   (location === 'all' || item.location.toLowerCase().includes(location.toLowerCase()));
        });

        displayResults(filteredResults);
    }

    function displayResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-item-details">
                    <h3>${item.item}</h3>
                    <p>Date: ${item.date}</p>
                    <p>Weight: ${item.weight} kg</p>
                    <p>Location: ${item.location}</p>
                </div>
                <div class="result-item-category">${item.category}</div>
            `;
            searchResults.appendChild(resultItem);
        });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    categoryFilter.addEventListener('change', performSearch);
    dateFilter.addEventListener('change', performSearch);
    locationFilter.addEventListener('change', performSearch);

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

    // Initial search to populate results
    performSearch();
});