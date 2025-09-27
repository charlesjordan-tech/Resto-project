const cartList = document.getElementById("cartContainer");
const cartSummary = document.getElementById("summary");

// Get references to the popup and buttons
const orderConfirmationPopup = document.getElementById("orderConfirmationPopup");
const popupOrderDetails = document.getElementById("popupOrderDetails");
const validateOrderBtn = document.getElementById("validateOrderBtn");
const cancelOrderBtn = document.getElementById("cancelOrderBtn");

// Event listeners for popup buttons
validateOrderBtn.addEventListener("click", finalizeOrder);
cancelOrderBtn.addEventListener("click", cancelOrder);

// Initial call to load cart items from the server
loadCartItems();

async function loadCartItems() {
  try {
    const response = await fetch("http://localhost:3000/cart");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cartItems = await response.json();
    renderCart(cartItems);
  } catch (error) {
    console.error("Failed to load cart items:", error);
    cartList.innerHTML = "<p>Error loading cart. Please try again.</p>";
  }
}

function renderCart(cartItems) {
  cartList.innerHTML = "";
  let totalPrice = 0;
  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    cartSummary.textContent = "Total: 0 CFA";
  } else {
    for (const item of cartItems) {
      const quantity = item.quantity || 1;
      totalPrice += item.price * quantity;
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Price: ${item.price} CFA</p>
          <div class="quantity-control">
            <button class="decrease-btn" onclick="decreaseQuantity('${item.id}')">-</button>
            <span>${quantity}</span>
            <button class="increase-btn" onclick="increaseQuantity('${item.id}')">+</button>
          </div>
        </div>
        <button class="removeButton" onclick="removeItem('${item.id}')">Remove</button>
      `;
      cartList.appendChild(cartItem);
    }
    cartSummary.textContent = `Total: ${totalPrice} CFA`;
  }
}

async function increaseQuantity(itemId) {
  try {
    const response = await fetch(`http://localhost:3000/cart/${itemId}`);
    const item = await response.json();
    const newQuantity = (item.quantity || 1) + 1;
    await fetch(`http://localhost:3000/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    loadCartItems();
  } catch (error) {
    console.error("Failed to increase quantity:", error);
  }
}

async function decreaseQuantity(itemId) {
  try {
    const response = await fetch(`http://localhost:3000/cart/${itemId}`);
    const item = await response.json();
    const newQuantity = (item.quantity || 1) - 1;
    if (newQuantity > 0) {
      await fetch(`http://localhost:3000/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } else {
      await removeItem(itemId);
    }
    loadCartItems();
  } catch (error) {
    console.error("Failed to decrease quantity:", error);
  }
}

async function removeItem(itemId) {
  try {
    await fetch(`http://localhost:3000/cart/${itemId}`, {
      method: "DELETE",
    });
    loadCartItems();
  } catch (error) {
    console.error("Failed to remove item:", error);
  }
}

// Function to trigger the popup
async function placeOrder() {
  const response = await fetch("http://localhost:3000/cart");
  const cart = await response.json();

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }

  // Generate a random table number between 1 and 100
  const randomTableNumber = Math.floor(Math.random() * 100) + 1;

  // Store the order details in a temporary object
  window.tempOrderDetails = {
    id: `ORD-${Date.now()}`,
    tableNumber: randomTableNumber,
    items: cart,
    totalPrice: cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    ),
    status: "Pending",
    timestamp: new Date().toISOString(),
  };

  // Populate the popup with order details
  popupOrderDetails.innerHTML = `
    <p><strong>Table Number:</strong> ${window.tempOrderDetails.tableNumber}</p>
    <p><strong>Order ID:</strong> ${window.tempOrderDetails.id}</p>
    <p><strong>Total:</strong> ${window.tempOrderDetails.totalPrice} CFA</p>
    <h4>Items:</h4>
    <ul>
      ${cart
        .map((item) => `<li>${item.name} x ${item.quantity || 1}</li>`)
        .join("")}
    </ul>
  `;

  // Show the popup
  orderConfirmationPopup.style.display = "flex";
}

// Function to finalize the order (called by the "Validate" button)
async function finalizeOrder() {
  if (!window.tempOrderDetails) return;

  try {
    // Post the order to the server
    await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(window.tempOrderDetails),
    });

    // Clear the cart on the server
    for (const item of window.tempOrderDetails.items) {
      await fetch(`http://localhost:3000/cart/${item.id}`, {
        method: "DELETE",
      });
    }

    // Hide the popup
    orderConfirmationPopup.style.display = "none";

    alert(
      `Order placed successfully! Your table number is: ${window.tempOrderDetails.tableNumber}. Redirecting to order page.`
    );
    window.location.href = "order.html";
  } catch (error) {
    console.error("Failed to place order:", error);
    alert("Failed to place order. Please try again.");
  }
}

// Function to cancel the order (called by the "Cancel" button)
function cancelOrder() {
  orderConfirmationPopup.style.display = "none";
  window.tempOrderDetails = null; // Clear temporary order data
}