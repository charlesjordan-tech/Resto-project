let customerOrders = []; // Renamed from 'products' for clarity as it holds orders

function loadCustomerOrders() {
    const storedOrders = localStorage.getItem('order');
    if (storedOrders) {
        customerOrders = JSON.parse(storedOrders);
    }
    renderCustomerOrders();
    updateCartCountOnOrderPage(); // Update cart counter in nav if it's present
}

function renderCustomerOrders() {
    const orderContainer = document.getElementById('orderContainer');
    const orderSummary = document.getElementById('summary');
    orderContainer.innerHTML = ''; // Clear existing content
    orderSummary.innerHTML = '';

    if (customerOrders.length === 0) {
        orderContainer.innerHTML = '<p>No orders placed yet.</p>';
        orderSummary.textContent = 'Total Orders: 0';
        return;
    }

    // Sort orders by timestamp, newest first for better UX
    const sortedOrders = [...customerOrders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let grandTotalOrdersPrice = 0; // To calculate the total of all orders

    sortedOrders.forEach(order => {
        grandTotalOrdersPrice += order.totalPrice;

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        orderCard.dataset.orderId = order.id; // Store order ID for reference

        // Format timestamp
        const orderDate = new Date(order.timestamp).toLocaleString();

        // Adjust class for status display (e.g., "Not Available" needs to be "Not-Available" for CSS)
        const statusClass = (order.status || 'Pending').replace(/\s+/g, '-');

        // Build HTML for items within this order
        let itemsHtml = order.items.map(item => `
            <li>
                <img src="${item.image}" alt="${item.name}" class="itemImage" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                ${item.name} (Qty: ${item.quantity || 1}) - ${item.price} CFA per item
            </li>
        `).join('');

        orderCard.innerHTML = `
            <h3>
                Order ID: ${order.id}
                <button class="order-status ${statusClass}">${order.status || 'Pending'}</button>
            </h3>
            <h2>Table Number: ${order.tableNumber}</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order Total:</strong> ${order.totalPrice.toFixed(0)} CFA</p>
            <h4>Items in this order:</h4>
            <ul>${itemsHtml}</ul>
        `;
        orderContainer.appendChild(orderCard);
    });

    orderSummary.textContent = `Grand Total for all orders: ${grandTotalOrdersPrice.toFixed(0)} CFA`;
}

// Function to update the cart counter in the navigation bar on this page
function updateCartCountOnOrderPage() {
    const cartCounter = document.getElementById("cartCounter");
    if (cartCounter) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += (item.quantity || 1);
        });
        cartCounter.textContent = totalItems;
    }
}
// Initial load of orders when the page loads
document.addEventListener('DOMContentLoaded', loadCustomerOrders);

// New event listener for clicking on order status
const orderContainer = document.getElementById("orderContainer");
orderContainer.addEventListener("click", function(event) {
  // Check if the clicked element is an order status button
  const clickedStatus = event.target.closest(".order-status");

  if (clickedStatus) {
    const orderCard = clickedStatus.closest(".order-card");
    const orderId = orderCard.dataset.orderId;

    // Find the order in the array
    const orderIndex = customerOrders.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
      let currentStatus = customerOrders[orderIndex].status || 'Pending';
      let newStatus;

      // Cycle the status
      switch (currentStatus) {
        case 'Pending':
          newStatus = 'Cooking';
          break;
        case 'Cooking':
          newStatus = 'Delivered';
          break;
        case 'Delivered':
          newStatus = 'Pending';
          break;
        default:
          newStatus = 'Pending';
          break;
      }

      // Update the status
      customerOrders[orderIndex].status = newStatus;

      // Save the updated array to localStorage
      localStorage.setItem('order', JSON.stringify(customerOrders));

      // Re-render the orders to show the new status
      renderCustomerOrders();
    }
  }
});