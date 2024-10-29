
const modal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.querySelector(".close");
const productForm = document.getElementById("productForm");
const productTableBody = document.querySelector("#productTable tbody");
const modalTitle = document.getElementById("modalTitle");
const productIndexInput = document.getElementById("productIndex");
const searchInput = document.getElementById("search");

let products = [];
let editingIndex = -1;

window.addEventListener("load", () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        updateTable();
    }
});

addProductBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add New Product";
    productForm.reset();
    editingIndex = -1; 
    modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productImage = document.getElementById("product-img").value;
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;

    let productData = {
        id: editingIndex === -1 ? generateProductId() : products[editingIndex].id,
        productName,
        productImage,
        productPrice,
        productQuantity
    };

    if (editingIndex === -1) {
        products.push(productData);
    } else {
        products[editingIndex] = productData;
        editingIndex = -1;
    }

    updateTable();
    localStorage.setItem("products", JSON.stringify(products));

    productForm.reset();
    modal.style.display = "none";
});

// Update the table with product data
function updateTable(filteredProducts = products) {
    productTableBody.innerHTML = "";

    if (filteredProducts.length === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="5" style="text-align: center;">No products found</td>`;
        productTableBody.appendChild(noDataRow);
        return;
    }

    filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.productImage}" alt="Product Image" width="60"></td>
            <td>${product.productName}</td>
            <td>$${product.productPrice}</td>
            <td>${product.productQuantity}</td>
            <td>
                <button class="edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        productTableBody.appendChild(row);
    });
}

function editProduct(id) {
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return;

    const product = products[productIndex];

    document.getElementById("product-img").value = product.productImage;
    document.getElementById("productName").value = product.productName;
    document.getElementById("productPrice").value = product.productPrice;
    document.getElementById("productQuantity").value = product.productQuantity;

    editingIndex = productIndex;

    modalTitle.textContent = "Edit Product";
    submitbtn.textContent = "Save Product";
    modal.style.display = "block";
}

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    updateTable();
    localStorage.setItem("products", JSON.stringify(products));
}

searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.toLowerCase();

    // Filter products based on the search query
    const filteredProducts = products.filter(product => 
        product.productName.toLowerCase().includes(searchQuery) ||
        product.productPrice.toString().includes(searchQuery)
    );

    updateTable(filteredProducts);
});

document.addEventListener('DOMContentLoaded', function() {
    const username = JSON.parse(localStorage.getItem('loggedInUser'));
    const usernameElement = document.getElementById('username');
    
    if (username) {
        usernameElement.innerText = username;
    } else {
        window.location.replace("index.html");
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    window.location.replace("index.html");
});

function generateProductId() {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const maxId = storedProducts.length > 0 ? Math.max(...storedProducts.map(product => product.id || 0)) : 0;
    return maxId + 1;
}

// Initial call to populate the table (if any products exist)
updateTable();
