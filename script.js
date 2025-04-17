// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Form submission handlers
    const donateForm = document.getElementById('donateForm');
    const receiveForm = document.getElementById('receiveForm');
    
    // Update donate form submission
    if (donateForm) {
        donateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                type: 'donation',
                name: document.getElementById('name').value,
                location: document.getElementById('location').value,
                foodType: document.getElementById('foodType').value,
                quantity: document.getElementById('quantity').value,
                contact: document.getElementById('contact').value,
                expiry: document.getElementById('expiry').value,
                notes: document.getElementById('notes').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: new Date().toISOString(),
                id: Date.now().toString()
            };
            
            // Save to localStorage
            saveFoodItem(formData);
            
            // Show thank you message
            document.getElementById('donateForm').classList.add('hidden');
            document.getElementById('thankYouMessage').classList.remove('hidden');
        });
    }
    
    // Update receive form submission
    if (receiveForm) {
        receiveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                type: 'request',
                name: document.getElementById('name').value,
                location: document.getElementById('location').value,
                foodType: document.getElementById('foodType').value,
                quantity: document.getElementById('quantity').value,
                contact: document.getElementById('contact').value,
                urgency: document.getElementById('urgency').value,
                notes: document.getElementById('notes').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: new Date().toISOString(),
                id: Date.now().toString()
            };
            
            // Save to localStorage
            saveFoodItem(formData);
            
            // Show thank you message
            document.getElementById('receiveForm').classList.add('hidden');
            document.getElementById('thankYouMessage').classList.remove('hidden');
        });
    }
    
    // Load food list if on food-list page
    if (document.querySelector('.food-list-section')) {
        loadFoodList();
        setupFilters();
    }
});

// Function to save food item to localStorage
function saveFoodItem(item) {
    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    foodItems.push(item);
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
}

// Function to load food list
function loadFoodList() {
    const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    const donationsContainer = document.getElementById('donationsContainer');
    const requestsContainer = document.getElementById('requestsContainer');
    
    // Clear containers
    donationsContainer.innerHTML = '';
    requestsContainer.innerHTML = '';
    
    let donationsCount = 0;
    let requestsCount = 0;
    
    // Sort by date, newest first
    foodItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add items to containers
    foodItems.forEach(item => {
        const itemElement = createFoodItemElement(item);
        
        if (item.type === 'donation') {
            donationsContainer.appendChild(itemElement);
            donationsCount++;
        } else {
            requestsContainer.appendChild(itemElement);
            requestsCount++;
        }
    });
    
    // Show "no items" message if needed
    if (donationsCount === 0) {
        document.getElementById('noDonations').style.display = 'block';
    } else {
        if (document.getElementById('noDonations')) {
            document.getElementById('noDonations').style.display = 'none';
        }
    }
    
    if (requestsCount === 0) {
        document.getElementById('noRequests').style.display = 'block';
    } else {
        if (document.getElementById('noRequests')) {
            document.getElementById('noRequests').style.display = 'none';
        }
    }
}

// Function to create food item element
function createFoodItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'food-item';
    itemDiv.dataset.location = item.location.toLowerCase();
    itemDiv.dataset.foodType = item.foodType.toLowerCase();
    
    const isRequest = item.type === 'request';
    
    // Format date
    const itemDate = new Date(item.date);
    const formattedDate = `${itemDate.toLocaleDateString()} at ${itemDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    itemDiv.innerHTML = `
        <div class="food-item-header">
            <div class="food-item-title">${item.foodType}</div>
            <div class="food-item-type ${isRequest ? 'food-item-request' : ''}">${isRequest ? 'Request' : 'Donation'}</div>
        </div>
        <div class="food-item-details">
            <div class="detail-item">
                <span class="detail-label">From</span>
                <span>${item.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location</span>
                <span>${item.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Quantity</span>
                <span>${item.quantity}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Posted</span>
                <span>${formattedDate}</span>
            </div>
            ${item.expiry ? `
            <div class="detail-item">
                <span class="detail-label">Expires</span>
                <span>${new Date(item.expiry).toLocaleDateString()}</span>
            </div>
            ` : ''}
            ${item.urgency ? `
            <div class="detail-item">
                <span class="detail-label">Urgency</span>
                <span>${item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}</span>
            </div>
            ` : ''}
        </div>
        ${item.notes ? `
        <div class="detail-item">
            <span class="detail-label">Notes</span>
            <p>${item.notes}</p>
        </div>
        ` : ''}
        <div class="detail-item">
            <span class="detail-label">Email</span>
            <span>${item.email}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Phone</span>
            <span>${item.phone}</span>
        </div>
        <div class="food-item-actions">
            <a href="tel:${item.contact}" class="btn btn-outline">Contact</a>
        </div>
    `;
    
    return itemDiv;
}

// Function to reset form and hide thank you message
function resetForm(formId, thankYouId) {
    document.getElementById(formId).reset();
    document.getElementById(formId).classList.remove('hidden');
    document.getElementById(thankYouId).classList.add('hidden');
}

// Function to setup filters on food list page
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchBar = document.getElementById('searchBar');
    const donationsList = document.getElementById('donationsList');
    const requestsList = document.getElementById('requestsList');
    
    // Filter by type (all, donations, requests)
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            if (filter === 'all') {
                donationsList.style.display = 'block';
                requestsList.style.display = 'block';
            } else if (filter === 'donations') {
                donationsList.style.display = 'block';
                requestsList.style.display = 'none';
            } else if (filter === 'requests') {
                donationsList.style.display = 'none';
                requestsList.style.display = 'block';
            }
            
            // Apply search filter as well
            if (searchBar.value) {
                applySearchFilter(searchBar.value);
            }
        });
    });
    
    // Search functionality
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            applySearchFilter(searchBar.value);
        });
    }
}

// Function to apply search filter
function applySearchFilter(searchTerm) {
    const foodItems = document.querySelectorAll('.food-item');
    const searchLower = searchTerm.toLowerCase();
    
    foodItems.forEach(item => {
        const location = item.dataset.location;
        const foodType = item.dataset.foodType;
        
        if (location.includes(searchLower) || foodType.includes(searchLower)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update "no items" messages
    updateNoItemsVisibility();
}

// Function to update "no items" messages visibility
function updateNoItemsVisibility() {
    const visibleDonations = document.querySelectorAll('#donationsContainer .food-item[style="display: block;"], #donationsContainer .food-item:not([style*="display"])').length;
    const visibleRequests = document.querySelectorAll('#requestsContainer .food-item[style="display: block;"], #requestsContainer .food-item:not([style*="display"])').length;
    
    if (document.getElementById('noDonations')) {
        document.getElementById('noDonations').style.display = visibleDonations === 0 ? 'block' : 'none';
    }
    
    if (document.getElementById('noRequests')) {
        document.getElementById('noRequests').style.display = visibleRequests === 0 ? 'block' : 'none';
    }
}
