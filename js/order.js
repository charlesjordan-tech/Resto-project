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

// 💡 UPDATED RENDER FUNCTION (Uses user's specific image paths) 💡
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

    // Logic to determine the image path based on order status
    let statusClass = "pending";
    let statusButtonContent = "";
    let statusAltText = "Pending";

    if (order.status === "Cooking") {
      statusClass = "cooking";
      statusAltText = "Cooking";
      statusButtonContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-cooking-100.png" alt="cooking" class="cooking-img">`;
    } else if (order.status === "Delivered") {
      statusClass = "delivered";
      statusAltText = "Delivered";
      statusButtonContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-food-delivery-64.png" alt="delivered" class="diliver-img">`;
    } else {
      // Default to Pending
      statusClass = "pending";
      statusAltText = "Pending";
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
                <button class="order-status ${statusClass}" disabled>${statusButtonContent}</button>
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

// Function to update the cart counter from the JSON server (unchanged)
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
      cartCounter.textContent = "0";
    }
  }
}

// Checks the most recent order for 'Delivered' status and shows pop-up (unchanged)
function checkDeliveredStatus() {
  const mostRecentOrder = customerOrders.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )[0];

  if (mostRecentOrder && mostRecentOrder.status === "Delivered") {
    const popUpKey = `delivered_popup_${mostRecentOrder.id}`;

    if (!sessionStorage.getItem(popUpKey)) {
      // CLIENT POPUP
      alert("Thanks for your kind patience, good appetite");
      sessionStorage.setItem(popUpKey, "shown");
    }
  }
}

// AUTOMATIC REFRESH IMPLEMENTATION (Listening for localStorage signal) (unchanged)
window.addEventListener("storage", async (event) => {
  if (event.key === "orderStatusUpdated") {
    await loadCustomerOrders();
    checkDeliveredStatus();
    console.log(
      "Order status updated by admin, refreshing client view automatically and checking for final status."
    );
  }
});

// Initial load of orders and cart count when the page loads (unchanged)
document.addEventListener("DOMContentLoaded", async () => {
  await loadCustomerOrders();
  checkDeliveredStatus();
  updateCartCountOnOrderPage();
});
