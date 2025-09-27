let products = [];
let editingId = null;
const productList = document.getElementById("productList");
const formTitle = document.getElementById("formTitle");

document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function renderProducts() {
    productList.innerHTML = "";
    products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.className = "productItem";
        productItem.innerHTML = `
            <div class="productInfo">
                <div class="productName">${product.name}</div>
                <div class="productDetails">${product.description}</div>
                <div class="productDetails">Stock: ${product.stock} | Price: ${product.price} CFA</div>
            </div>
            <div class="actionButtons">
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">Edit</button>
                <button class="btn btn-delete" onclick="removeItem('${product.id}')">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

async function saveProducts() {
    const name = document.getElementById("nameInput").value.trim();
    const description = document.getElementById("decsInput").value.trim();
    const stock = parseInt(document.getElementById("stockInput").value.trim());
    const price = parseFloat(document.getElementById("priceInput").value.trim());
    const image = document.getElementById("urlInput").value.trim();

    if (!name || !description || isNaN(stock) || isNaN(price) || !image) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const newProduct = { name, description, stock, price, image };

    try {
        if (editingId) {
            // Update existing product
            await fetch(`http://localhost:3000/products/${editingId}`, {
                method: "PUT", // Use PUT to replace the entire resource
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
            editingId = null;
            formTitle.innerHTML = "Add New Product";
        } else {
            // Add new product
            await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
        }
        emptyForm();
        fetchProducts(); // Re-fetch and re-render the list
    } catch (error) {
        console.error("Error saving product:", error);
    }
}

async function removeItem(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await fetch(`http://localhost:3000/products/${id}`, {
                method: "DELETE"
            });
            fetchProducts();
        } catch (error) {
            console.error("Error removing product:", error);
        }
    }
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
    formTitle.innerHTML = "Edit Product";
}

function emptyForm() {
    document.getElementById("nameInput").value = "";
    document.getElementById("decsInput").value = "";
    document.getElementById("stockInput").value = "";
    document.getElementById("priceInput").value = "";
    document.getElementById("urlInput").value = "";
}