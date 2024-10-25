// JavaScript for handling modal and product management

// Get elements
const modal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.querySelector(".close");
const productForm = document.getElementById("productForm");
const productTableBody = document.querySelector("#productTable tbody");
const modalTitle = document.getElementById("modalTitle");
const productIndexInput = document.getElementById("productIndex");
const searchInput = document.getElementById("search");

let products = []; // To store product data
let editingIndex = -1; // Tracks if we're editing an existing product

window.addEventListener("load", () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        updateTable();
    }})

// Show modal when Add Product button is clicked
addProductBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add New Product";
    productForm.reset();
    editingIndex = -1; // Reset editing index
    modal.style.display = "block";
});

// Hide modal when close button is clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside of modal
window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Add or update product on form submit
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get form values
    const productImage = document.getElementById("product-img").value;
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById('productQuantity').value;


    const productData = {
        productName,
        productImage,
        productPrice,
        productQuantity
    };

    if (editingIndex === -1) {
        // Add new product
        products.push(productData);
    } else {
        // Update existing product
        products[editingIndex] = productData;
        editingIndex = -1;
    }

    // Update the table with the new data
    updateTable();

    localStorage.setItem("products", JSON.stringify(products));

    // Close the modal and reset the form
    productForm.reset();
    modal.style.display = "none";
});

// Update the table with product data
function updateTable(filteredProducts = products) {
    productTableBody.innerHTML = ""; // Clear existing rows

    if (filteredProducts.length === 0) {
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `<td colspan="5" style="text-align: center;">No products found</td>`;
        productTableBody.appendChild(noDataRow);
        return;
    }

    filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${product.productImage}" alt="Product Image" width="60"></td>
            <td>${product.productName}</td>
            <td>$${product.productPrice}</td>
            <td>${product.productQuantity}</td>
            <td>
                <button class="edit" onclick="editProduct(${index})">Edit</button>
                <button class="delete" onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;

        productTableBody.appendChild(row);
    });
}

// Edit product function
function editProduct(index) {
    const product = products[index];

    document.getElementById("product-img").value = product.productImage;
    document.getElementById("productName").value = product.productName;
    document.getElementById("productPrice").value = product.productPrice;
    document.getElementById("productQuantity").value = product.productQuantity;
    

    editingIndex = index; // Set the index we're editing

    modalTitle.textContent = "Edit Product";
    submitbtn.textContent = "Sava product"
    modal.style.display = "block";
}

// Delete product function
function deleteProduct(index) {
    products.splice(index, 1); // Remove product from the array
    updateTable(); // Refresh the table
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

// Initial call to populate the table (if any products exist)
updateTable();
