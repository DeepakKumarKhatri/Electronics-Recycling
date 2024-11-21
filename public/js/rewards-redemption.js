// rewards-redemption.js
document.addEventListener('DOMContentLoaded', () => {
    const rewardsGrid = document.getElementById('rewardsGrid');
    const userPointsDisplay = document.getElementById('userPoints');
    const redeemModal = document.getElementById('redeemModal');
    const redeemItemName = document.getElementById('redeemItemName');
    const redeemItemPoints = document.getElementById('redeemItemPoints');
    const confirmRedeem = document.getElementById('confirmRedeem');
    const cancelRedeem = document.getElementById('cancelRedeem');

    let userPoints = 1500; // This would typically come from a server
    let selectedReward = null;

    // Sample rewards data (in a real application, this would come from a server)
    const rewards = [
        { id: 1, name: 'Eco-friendly Water Bottle', points: 500, image: '/assets/images/water-bottle.jpg' },
        { id: 2, name: 'Reusable Shopping Bag', points: 300, image: '/assets/images/shopping-bag.jpg' },
        { id: 3, name: '$10 Gift Card', points: 1000, image: '/assets/images/gift-card.jpg' },
        { id: 4, name: 'Plant a Tree', points: 750, image: '/assets/images/plant-tree.jpg' },
        { id: 5, name: 'Recycled Notebook', points: 400, image: '/assets/images/notebook.jpg' },
        { id: 6, name: 'Solar Power Bank', points: 1500, image: '/assets/images/power-bank.jpg' },
    ];

    function updateUserPoints() {
        userPointsDisplay.textContent = userPoints;
    }

    function createRewardItem(reward) {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        rewardItem.innerHTML = `
            <img src="${reward.image}" alt="${reward.name}">
            <h3>${reward.name}</h3>
            <p class="points">${reward.points} points</p>
            <button class="btn-primary redeem-btn" data-id="${reward.id}">Redeem</button>
        `;
        return rewardItem;
    }

    function populateRewards() {
        rewards.forEach(reward => {
            const rewardItem = createRewardItem(reward);
            rewardsGrid.appendChild(rewardItem);
        });
    }

    function showRedeemModal(reward) {
        redeemItemName.textContent = reward.name;
        redeemItemPoints.textContent = reward.points;
        redeemModal.style.display = 'block';
    }

    function hideRedeemModal() {
        redeemModal.style.display = 'none';
    }

    function redeemReward(reward) {
        if (userPoints >= reward.points) {
            userPoints -= reward.points;
            updateUserPoints();
            alert(`You have successfully redeemed ${reward.name}!`);
        } else {
            alert('You do not have enough points to redeem this reward.');
        }
    }

    rewardsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('redeem-btn')) {
            const rewardId = parseInt(e.target.getAttribute('data-id'));
            selectedReward = rewards.find(reward => reward.id === rewardId);
            showRedeemModal(selectedReward);
        }
    });

    confirmRedeem.addEventListener('click', () => {
        if (selectedReward) {
            redeemReward(selectedReward);
            hideRedeemModal();
        }
    });

    cancelRedeem.addEventListener('click', hideRedeemModal);

    // Close the modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === redeemModal) {
            hideRedeemModal();
        }
    });

    // Initialize the page
    updateUserPoints();
    populateRewards();

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