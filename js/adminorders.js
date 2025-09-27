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
    // Re-fetch and re-render the orders to show the updated status
    loadCustomerOrders();
  } catch (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    alert("Failed to update order status. Please try again.");
  }
}

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
    if (order.status === "Cooking") {
      statusClass = "cooking";
    } else if (order.status === "Delivered") {
      statusClass = "delivered";
    }

    const itemsHtml = order.items
      .map(
        (item) => `
            <li>
                <img src="${item.image}" alt="${item.name}" class="itemImage" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
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
                <button class="order-status ${statusClass}">${order.status || "Pending"}</button>
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

// Function to update the cart counter in the navigation bar
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

// New event listener for clicking on order status
const orderContainer = document.getElementById("orderContainer");
orderContainer.addEventListener("click", function (event) {
  const clickedStatus = event.target.closest(".order-status");

  if (clickedStatus) {
    const orderCard = clickedStatus.closest(".order-card");
    const orderId = orderCard.dataset.orderId;
    let currentStatus = clickedStatus.textContent.trim();

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
        newStatus = "Pending";
        break;
    }
    updateOrderStatus(orderId, newStatus);
  }
});

// Initial load of orders when the page loads
loadCustomerOrders();
updateCartCountOnOrderPage();