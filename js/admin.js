let products = [];
let editingId = null;
function setItemsFromLocalStorage() {
  const storageItems = localStorage.getItem("products");
  products = JSON.parse(storageItems) || [];
}
setItemsFromLocalStorage();
console.log(products);

const productList = document.getElementById("productList");
function renderProducts() {
  productList.innerHTML = ""; // Clear existing content
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className = "productItem";

    productItem.innerHTML = `
        <div class="productInfo">
            <div class="productName">${product.name}</div>
            <div class="productDetails">${product.description}</div>
            <div class="productDetails">stock: ${product.stock} | price: ${product.price} CFA</div>
        </div>
        <div class="actionButtons">
            <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
            <button class="btn btn-delete" onclick="removeItem(${product.id})">Delete</button>
        </div>
        `;

    productList.appendChild(productItem);
  });
}
renderProducts();

function saveProducts() {
  const name = document.getElementById("nameInput").value.trim();
  const description = document.getElementById("decsInput").value.trim();
  const stock = document.getElementById("stockInput").value.trim();
  const price = document.getElementById("priceInput").value.trim();
  const img = document.getElementById("urlInput").value.trim();

  const newProduct = {
    id: Date.now(),
    name: name,
    description: description,
    price: parseFloat(price),
    image: img,
    stock: parseInt(stock),
  };

  if (!name || !description || !stock || !price || !img) {
    alert("Please fill in all fields.");
    return;
  }

  if (editingId) {
    const index = products.findIndex((p) => p.id === editingId);
    products[index] = {
      id: editingId,
      name: name,
      description: description,
      stock: parseInt(stock),
      price: parseFloat(price),
      image: img,
    };
    editingId = null; // Reset editingId after saving
    document.getElementById("formTitle").innerHTML = "Add New Product";
  } else {
    // If not editing, add new product
    products.push(newProduct);
  }
  localStorage.setItem("products", JSON.stringify(products));
  setItemsFromLocalStorage();
  renderProducts();
  emptyForm();
}

function emptyForm() {
  document.getElementById("nameInput").value = "";
  document.getElementById("decsInput").value = "";
  document.getElementById("stockInput").value = "";
  document.getElementById("priceInput").value = "";
  document.getElementById("urlInput").value = "";
}

function removeItem(id) {
  products = products.filter((product) => product.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  //setItemsFromLocalStorage();
  renderProducts();
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.getElementById("nameInput").value = product.name;
  document.getElementById("decsInput").value = product.description;
  document.getElementById("stockInput").value = product.stock;
  document.getElementById("priceInput").value = product.price;
  document.getElementById("urlInput").value = product.image;
  editingId = id;
  document.getElementById(
    "formTitle"
  ).innerHTML = `Edit Product: ${product.name}`;
}
