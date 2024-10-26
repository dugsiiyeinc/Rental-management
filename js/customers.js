// Select DOM elements
const btn = document.querySelector(".new-customer-btn");
const modal = document.querySelector(".modal");
const name = document.querySelector("#name");
const mobile = document.querySelector("#mobile");
const email = document.querySelector("#email");
const address = document.querySelector("#address");
const form = document.querySelector("#form");
const tbody = document.querySelector("tbody");
const closeModal = document.querySelector(".cancel-btn");

let editMode = false;       
let editcustomerId = null;  

document.addEventListener("DOMContentLoaded", loadcustomers);

// Handle form submission for creating or updating a customer
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newCustomer = {
        id     : editcustomerId || generateCustomerId(), // Use edit ID if in edit mode, otherwise generate a new ID
        name   : name.value,
        mobile : mobile.value,
        address: address.value,
        email  : email.value,
    };

    
    if (editMode) {
        updateCustomer(newCustomer);
    } else {
        createCustomer(newCustomer);
    }
    
    loadcustomers(); // Reload the customer list
    form.reset();    
});

// Generate HTML for each customer row
function generateHtml(customer) {
    let row = document.createElement("tr");
    let customers = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.mobile}</td>
        <td>${customer.email}</td>
        <td>${customer.address}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editCustomer(${customer.id})"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" onclick="deleteCustomer(${customer.id})"><i class="fas fa-trash-alt"></i></button>
        </td>`;
    row.innerHTML += customers;
    return row;
}

// Add a new customer to local storage
function createCustomer(customer) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    customers.push(customer);
    localStorage.setItem("customers", JSON.stringify(customers)); // Update local storage
}

// Load customers from local storage and display in the table
function loadcustomers() {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    tbody.innerHTML = ""; 
    customers.map((customer) => {
        tbody.appendChild(generateHtml(customer)); 
    });
    modal.style.display = "none"; // Hide the modal after loading
}


function deleteCustomer(id) {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    customers = customers.filter(customer => customer.id != id); 
    localStorage.setItem("customers", JSON.stringify(customers)); 
    loadcustomers(); 
}

function editCustomer(customerId) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customer = customers.find((customer) => customer.id == customerId);

    // Populate form fields with customer's data
    name.value = customer.name;
    mobile.value = customer.mobile;
    email.value = customer.email;
    address.value = customer.address;
    
    document.querySelector(".submit-btn").textContent = "Update"; // Change button text to "Update"
    editMode = true;        
    editcustomerId = customerId; 
    modal.style.display = "block"; 
}

// Update an existing customer in local storage
function updateCustomer(customer) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customerIndex = customers.findIndex(cust => cust.id === customer.id); // Find index of customer to update
    customers[customerIndex] = customer; // Update the customer data
    localStorage.setItem("customers", JSON.stringify(customers)); // Update local storage
}

// Show modal when "New Customer" button is clicked
btn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Hide modal when "Cancel" button is clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Generate a unique customer ID based on the highest existing ID in local storage
function generateCustomerId() {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const maxId = customers.length > 0 ? Math.max(...customers.map(customer => customer.id)) : 0;
    return maxId + 1; // Return the next ID in sequence
}
