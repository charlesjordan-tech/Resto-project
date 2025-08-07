let products = [
  // {
  //     id: 1125,
  //     name: "Grilled chicken",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 2000,
  //     image: "./img/chicken.jpg",
  //     stock: 10
  // },
  // {
  //     id: 1265,
  //     name: "Fried rice",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 1000,
  //     image: "./img/rice.jpg",
  //     stock: 15
  // },
  // {
  //     id: 1225,
  //     name: "Pasta",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 750,
  //     image: "./img/pasta.jpg",
  //     stock: 21
  // },
  // {
  //     id: 1677,
  //     name: "Fruit salad",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 2000,
  //     image: "./img/fruitSalad.jpg",
  //     stock: 9
  // },
  // {
  //     id: 1526,
  //     name: "Spaghetti",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 800,
  //     image: "./img/spaghetti.jpg",
  //     stock: 8
  // },
  // {
  //     id: 1685,
  //     name: "Beaf steak",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 2000,
  //     image: "./img/beaf.jpg",
  //     stock: 15
  // },
  // {
  //     id: 1745,
  //     name: "Cup cake",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 350,
  //     image: "./img/cupCake.jpg",
  //     stock: 15
  // },
  // {
  //     id: 1685,
  //     name: "Roasted fish",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 1500,
  //     image: "./img/fish.jpg",
  //     stock: 18
  // },
  // {
  //     id: 1885,
  //     name: "Burger",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 1200,
  //     image: "./img/burger.jpg",
  //     stock: 27
  // },
  // {
  //     id: 1885,
  //     name: "Donut",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 300,
  //     image: "./img/donut.jpg",
  //     stock: 32
  // },
  // {
  //     id: 1885,
  //     name: "Vegetable salad",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 1100,
  //     image: "./img/salade.jpg",
  //     stock: 16
  // },
  // {
  //     id: 1289,
  //     name: "Creamed cake",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 4000,
  //     image: "./img/creamedCake.jpg",
  //     stock: 5
  // },
  // {
  //     id: 1885,
  //     name: "Pan cake",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 350,
  //     image: "./img/panCake.jpg",
  //     stock: 35
  // },
  // {
  //     id: 1315,
  //     name: "Pizza",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 1800,
  //     image: "./img/pizza.jpg",
  //     stock: 12
  // },
  // {
  //     id: 1685,
  //     name: "Tarte",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 3500,
  //     image: "./img/tarte.jpg",
  //     stock: 4
  // },
  // {
  //     id: 1334,
  //     name: "Strewberry cake",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi adipisci, magnam facilis fugiat quos deserunt distinctio nobis a est ducimus",
  //     price: 2250,
  //     image: "./img/strewberryCake.jpg",
  //     stock: 11
  // },
];

// localStorage.setItem("products", JSON.stringify(products));

function setLocalStorageItem() {
  const items = localStorage.getItem("products");
  products = JSON.parse(items) || [];
}
setLocalStorageItem();

const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const cartCounter = document.getElementById("cartCounter");
const cartNotification = document.getElementById("cart-notification");

function renderProducts(searchKey = "") {
  productList.innerHTML = "";
  const filteredItems = products.filter((product) =>
    product.name.toLowerCase().includes(searchKey.toLowerCase())
  );

  if (filteredItems.length === 0) {
    productList.innerHTML = "<p>No meals found.</p>";
    return;
  }

  for (let product of filteredItems) {
    const productCard = document.createElement("div");
    productCard.classList.add("productCard");
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <h4 class="product-stock">Stock: ${product.stock}</h4>
            <p>Price: ${product.price} CFA</p>
            <button class="addButton" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
    productList.appendChild(productCard);
  }
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = 0;
  cart.forEach((item) => {
    totalItems += item.quantity || 1;
  });
  cartCounter.textContent = totalItems;
}

function addToCart(productId) {
  const productToAdd = products.find((p) => p.id === productId);
  if (!productToAdd) {
    console.error("Product not found");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex((item) => item.id === productId);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity++;
  } else {
    cart.push({ ...productToAdd, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Update the notification text with the product's name
  cartNotification.textContent = `${productToAdd.name} added to cart!`;

  cartNotification.classList.add("cart-notification");
  cartNotification.style.visibility = "visible";
  // Ensure DOM updates before hiding notification
  requestAnimationFrame(() => {
    setTimeout(() => {
      cartNotification.classList.remove("cart-notification");
    }, 1000);
  });
}

searchInput.addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
});
