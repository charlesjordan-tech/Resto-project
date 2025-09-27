let products = [];
const productList = document.getElementById("productList");
const cartCounter = document.getElementById("cartCounter");
const cartNotification = document.getElementById("clientNotificationArea");
const searchInput = document.getElementById("search");

// Function to fetch products from the backend
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json();
    renderProducts(products); // Render all products initially
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productList.innerHTML = "<p>Error loading products. Please try again later.</p>";
  }
}

// Function to update the cart counter from the backend
async function updateCartCount() {
  try {
    const response = await fetch("http://localhost:3000/cart");
    const cart = await response.json();
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCounter.textContent = totalItems;
  } catch (error) {
    console.error("Failed to update cart count:", error);
  }
}

// Function to add a product to the cart via the backend
async function addToCart(productId) {
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) {
    console.error("Product not found");
    return;
  }

  try {
    // Check if the product already exists in the cart
    const existingProductResponse = await fetch(`http://localhost:3000/cart?id=${productId}`);
    const existingProductArray = await existingProductResponse.json();
    const existingProduct = existingProductArray[0];

    if (existingProduct) {
      // If the item exists, update its quantity
      const newQuantity = (existingProduct.quantity || 0) + 1;
      await fetch(`http://localhost:3000/cart/${existingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      });
    } else {
      // If the item is new, add it to the cart
      await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productToAdd, quantity: 1 })
      });
    }

    updateCartCount();
    showClientNotification(`${productToAdd.name} added to cart!`);
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    showClientNotification("Failed to add item to cart. Please try again.");
  }
}

// Function to render products
function renderProducts(productArray) {
  productList.innerHTML = "";
  if (productArray.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }
  for (let product of productArray) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Price: ${product.price} CFA</p>
      <button class="addButton" onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    productList.appendChild(productCard);
  }
}

// Add event listener to the search input
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
});

// Run the initial functions when the page loads
fetchProducts();
updateCartCount();

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
    }, 2000); // Notification disappears after 2 seconds
  } else {
    console.warn("Client notification area not found.");
  }
}