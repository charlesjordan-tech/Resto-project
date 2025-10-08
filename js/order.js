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
    let statusClass = "pending";
    let statusContent = ""; // Initialize content for the status button

    // Determine the content based on the order status
    if (order.status === "Cooking") {
      statusClass = "cooking";
      statusContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-cooking-100.png" alt="Cooking" class="cooking-img">`;
    } else if (order.status === "Delivered") {
      statusClass = "delivered";
      statusContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-food-delivery-64.png" alt="diliver" class="diliver-img">`;
    } else {
      // Default to Pending if status is not Cooking or Delivered, or if null/undefined
      statusClass = "pending";
      statusContent = `<img src="./img/logos/spiners,diliver,trash and cooking/icons8-spinner (2).gif" alt="pending" class="pending-img">`;
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
                <button class="order-status ${statusClass}">
                    ${statusContent}
                </button>
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

// Function to update the cart counter from the JSON server
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

// Initial load of orders and cart count when the page loads
loadCustomerOrders();
updateCartCountOnOrderPage();
