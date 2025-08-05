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

function renderItems() {
  cartList.innerHTML = "";
  let totalPrice = 0;
  let totalQuantity = 0;

  if (totalPrice < 0) {
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
              <div class="remove-btn" onclick="removeItem(${product.id})">
                <div class="tooltip">Delete</div>
                <img src="./img/logos/icons8-trash-50.png" alt="delete">
              </div>
          `;
      cartList.appendChild(cartItem);
    }
  }

  cartSummary.textContent = `Total: ${totalPrice} CFA`;
  cartSummary.textContent += ` | Total: ${totalQuantity} `;
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

function placeOrder() {
  let orders = JSON.parse(localStorage.getItem("order")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty. Add items before placing an order.");
    return;
  }

  // Create a unique ID for the new order
  const newOrderId = `ORD-${Date.now()}`; // Simple unique ID using timestamp
  let totalOrderPrice = 0;
  cart.forEach((item) => {
    totalOrderPrice += item.price * (item.quantity || 1); // Calculate total based on item quantity
  });

  const newOrder = {
    id: newOrderId,
    items: cart, // Store the array of items from the current cart
    totalPrice: totalOrderPrice,
    status: "Pending", // Initial status for a new order
    tableNumber: "T1", // Default table number, can be changed later
    timestamp: new Date().toISOString(), // When the order was placed
  };

  orders.push(newOrder); // Add the new order object to the array of all orders

  localStorage.setItem("order", JSON.stringify(orders)); // Save updated orders
  localStorage.removeItem("cart"); // Clear the cart after placing the order
  products = []; // Clear the local products array
  renderItems(); // Re-render cart to show it's empty
  alert("Order placed successfully! Redirecting to order page.");
  window.location.href = "order.html"; // Redirect to your order page
}


// <button onclick="placeOrder()">Place Order</button>

