let customerOrders = [];

const API_BASE_URL = "http://localhost:3000";

// Fetches the orders from the JSON server and renders them
async function loadCustomerOrders() {
  const orderContainer = document.getElementById("orderContainer");
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    customerOrders = await response.json();
    renderCustomerOrders();
  } catch (error) {
    console.error("Failed to load customer orders:", error);
    orderContainer.innerHTML =
      "<p>Error loading orders. Please try again later.</p>";
  }
}

// Function to send a PATCH request to update an order's status
async function updateOrderStatus(orderId, newStatus) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // Re-fetch and re-render the orders to show the updated status (for Admin's view)
    loadCustomerOrders();

    // 💡 NEW CODE: Signal the client page to refresh 💡
    // We set a new timestamp value to ensure the 'storage' event is fired.
    localStorage.setItem("orderStatusUpdated", new Date().toISOString());
  } catch (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    alert("Failed to update order status. Please try again.");
  }
}

// ... rest of adminorders.js remains the same ...

function renderCustomerOrders() {
  const orderContainer = document.getElementById("orderContainer");
  const orderSummary = document.getElementById("summary");
  orderContainer.innerHTML = "";
  orderSummary.innerHTML = "";

  if (customerOrders.length === 0) {
    orderContainer.innerHTML = "<p>No orders placed yet.</p>";
    orderSummary.textContent = "Total Orders: 0";
    return;
  }

  // Sort orders by timestamp, newest first for better UX
  const sortedOrders = [...customerOrders].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  let grandTotalOrdersPrice = 0;

  sortedOrders.forEach((order) => {
    grandTotalOrdersPrice += order.totalPrice;

    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");
    orderCard.dataset.orderId = order.id;

    const orderDate = new Date(order.timestamp).toLocaleString();
    let statusClass = "pending";
    let statusButtonContent = ""; // Initialize content for the status button

    // Determine the content based on the order status
    // The admin can click these, so we need to ensure the text content is still available for the click event
    if (order.status === "Cooking") {
      statusClass = "cooking";
      statusButtonContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-cooking-100.png" alt="cooking" class="cooking-img">`;
    } else if (order.status === "Delivered") {
      statusClass = "delivered";
      statusButtonContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-food-delivery-64.png" alt="diliver" class="diliver-img">
`;
    } else {
      // Default to Pending if status is not Cooking or Delivered, or if null/undefined
      statusClass = "pending";
      statusButtonContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-spinner (2).gif" alt="pending" class="pending-img">`;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
                    <li>
                        <img src="${item.image}" alt="${
          item.name
        }" class="itemImage" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                        ${item.name} (Qty: ${item.quantity || 1}) - ${
          item.price
        } CFA per item
                    </li>
                `
      )
      .join("");

    orderCard.innerHTML = `
            <h3>
                Order ID: ${order.id}
                <button class="order-status ${statusClass}">${statusButtonContent}</button>
            </h3>
            <h2>Table Number: ${order.tableNumber}</h2>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order Total:</strong> ${order.totalPrice.toFixed(
              0
            )} CFA</p>
            <h4>Items in this order:</h4>
            <ul>${itemsHtml}</ul>
        `;
    orderContainer.appendChild(orderCard);
  });

  orderSummary.textContent = `Grand Total for all orders: ${grandTotalOrdersPrice.toFixed(
    0
  )} CFA`;
}

// Function to update the cart counter in the navigation bar (if applicable in admin view)
async function updateCartCountOnOrderPage() {
  const cartCounter = document.getElementById("cartCounter");
  if (cartCounter) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`);
      const cart = await response.json();
      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      cartCounter.textContent = totalItems;
    } catch (error) {
      console.error("Failed to update cart count:", error);
      cartCounter.textContent = "0"; // Fallback to 0 on error
    }
  }
}

// New event listener for clicking on order status (ADMIN ONLY)
const orderContainer = document.getElementById("orderContainer");
orderContainer.addEventListener("click", function (event) {
  const clickedStatusButton = event.target.closest(".order-status");

  if (clickedStatusButton) {
    const orderCard = clickedStatusButton.closest(".order-card");
    const orderId = orderCard.dataset.orderId;

    // Extract current status from the class list or a data attribute if needed
    // For simplicity, let's derive it from the current class (e.g., 'pending', 'cooking', 'delivered')
    let currentStatus = "";
    if (clickedStatusButton.classList.contains("pending")) {
      currentStatus = "Pending";
    } else if (clickedStatusButton.classList.contains("cooking")) {
      currentStatus = "Cooking";
    } else if (clickedStatusButton.classList.contains("delivered")) {
      currentStatus = "Delivered";
    }

    // Cycle the status
    let newStatus;
    switch (currentStatus) {
      case "Pending":
        newStatus = "Cooking";
        break;
      case "Cooking":
        newStatus = "Delivered";
        break;
      case "Delivered":
        newStatus = "Pending";
        break;
      default:
        newStatus = "Pending"; // Fallback
        break;
    }
    updateOrderStatus(orderId, newStatus);
  }
});

// Initial load of orders when the page loads
loadCustomerOrders();
updateCartCountOnOrderPage();
