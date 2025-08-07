let products = [];

function setItemsFromLocalStorage() {
  const storageItems = localStorage.getItem(`cart`);
  if (storageItems) {
    products = JSON.parse(storageItems);
  }
}
setItemsFromLocalStorage();

const cartList = document.getElementById("cartContainer");
const cartSummary = document.getElementById("summary");

// Get references to the new popup elements
const orderConfirmationPopup = document.getElementById("orderConfirmationPopup");
const popupOrderDetails = document.getElementById("popupOrderDetails");
const validateOrderBtn = document.getElementById("validateOrderBtn");
const cancelOrderBtn = document.getElementById("cancelOrderBtn");

function renderItems() {
  cartList.innerHTML = "";
  let totalPrice = 0;
  let totalQuantity = 0;

  if (products.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    for (let product of products) {
      console.log(product);
      // Ensure quantity exists, default to 1
      totalPrice += product.price * product.quantity;
      totalQuantity += product.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cartItem");
      cartItem.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <div>
                  <h3>${product.name}</h3>
                  <p>Price: ${product.price} CFA</p>
                  <div class="quantity-controls">
                      <button class="decrease" onclick="decreaseQuantity(${product.id})">-</button>
                      <span>${product.quantity}</span>
                      <button class="increase" onclick="increaseQuantity(${product.id})">+</button>
                  </div>
              </div>
              <button class="remove-btn" onclick="removeItem(${product.id})">
                <div class="tooltip">Remove Meal</div>
                <img src="./img/logos/trash.png" alt="delete">
              </button>
          `;
      cartList.appendChild(cartItem);
    }
  }

  cartSummary.textContent = `Total: ${totalPrice} CFA`;
  cartSummary.textContent += ` | Total Items: ${totalQuantity}`; // Changed to "Total Items" for clarity
  localStorage.setItem("cart", JSON.stringify(products)); // Update local storage after rendering
  const cartCounter = document.getElementById("cartCounter");
  cartCounter.textContent = `${totalQuantity}`; // Update cart counter
}

renderItems();

function removeItem(productId) {
  products = products.filter((product) => product.id !== productId);
  localStorage.setItem(`cart`, JSON.stringify(products));
  renderItems();
}

function increaseQuantity(productId) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex > -1) {
    products[productIndex].quantity =
      (products[productIndex].quantity || 1) + 1;
    renderItems();
  }
}

function decreaseQuantity(productId) {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex > -1) {
    if ((products[productIndex].quantity || 1) > 1) {
      products[productIndex].quantity--;
    } else {
      // If quantity is 1, remove the item
      products.splice(productIndex, 1);
    }
    renderItems();
  }
}

// Modified placeOrder function to show the popup
function placeOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    // Using the client notification area instead of alert
    showClientNotification("Your cart is empty. Add items before placing an order.");
    return;
  }

  // Populate the popup with order details
  let detailsHtml = "<h3>Order Summary:</h3>";
  let totalOrderPrice = 0;
  cart.forEach((item) => {
    detailsHtml += `<p>${item.name} (x${item.quantity || 1}) - <strong>${
      item.price * (item.quantity || 1)
    } CFA</strong></p>`;
    totalOrderPrice += item.price * (item.quantity || 1);
  });
  detailsHtml += `<p><strong>Total Order Price: ${totalOrderPrice} CFA</strong></p>`;
  popupOrderDetails.innerHTML = detailsHtml;

  // Show the popup
  orderConfirmationPopup.style.display = "flex";
}

// Function to finalize the order (called when Validate Order is clicked)
function finalizeOrder() {
  // Hide the popup first
  orderConfirmationPopup.style.display = "none";

  let orders = JSON.parse(localStorage.getItem("order")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const newOrderId = `ORD-${Date.now()}`;
  let totalOrderPrice = 0;
  cart.forEach((item) => {
    totalOrderPrice += item.price * (item.quantity || 1);
  });

  // Prompt the user for the table number
  const tableNumber = prompt("Please enter your table number:");
  if (!tableNumber) {
    showClientNotification("Order canceled. Please enter a table number to proceed.");
    return; // Exit the function if no table number is provided
  }

  const newOrder = {
    id: newOrderId,
    items: cart,
    totalPrice: totalOrderPrice,
    status: "Pending",
    tableNumber: tableNumber, // Use the table number from the prompt
    timestamp: new Date().toISOString(),
  };

  orders.push(newOrder);
  localStorage.setItem("order", JSON.stringify(orders));
  localStorage.removeItem("cart");
  products = [];
  renderItems();

  showClientNotification("Order placed successfully! Redirecting to order page.");
  setTimeout(() => {
    window.location.href = "order.html";
  }, 1500);
}

// Function to cancel the order (called when Cancel is clicked)
function cancelOrder() {
  orderConfirmationPopup.style.display = "none"; // Hide the popup
}

// Event Listeners for popup buttons
validateOrderBtn.addEventListener("click", finalizeOrder);
cancelOrderBtn.addEventListener("click", cancelOrder);

// Placeholder for client notification (ensure this function exists or is imported)
function showClientNotification(message) {
  const clientNotificationArea = document.getElementById("clientNotificationArea");
  if (clientNotificationArea) {
    const notificationMessage = document.createElement("div");
    notificationMessage.classList.add("client-notification-message");
    notificationMessage.innerHTML = `<p>${message}</p><button class="dismiss-notification-btn">X</button>`;
    clientNotificationArea.appendChild(notificationMessage);
    clientNotificationArea.style.display = "block";

    notificationMessage.querySelector(".dismiss-notification-btn").addEventListener("click", () => {
      notificationMessage.remove();
      if (clientNotificationArea.children.length === 0) {
        clientNotificationArea.style.display = "none";
      }
    });

    setTimeout(() => {
      if (notificationMessage.parentNode) {
        notificationMessage.remove();
        if (clientNotificationArea.children.length === 0) {
          clientNotificationArea.style.display = "none";
        }
      }
    }, 6000); // Notification disappears after 5 seconds
  } else {
    console.warn("Client notification area not found.");
    // Fallback to alert if notification area isn't available
    alert(message);
  }
}