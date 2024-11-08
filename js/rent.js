// Select DOM elements
const btn = document.querySelector(".new-rent-btn");
const modal = document.querySelector(".modal");
const customer = document.querySelector("#customer");
const productSelect = document.querySelector("#product");
const startDate = document.querySelector("#start-date");
const endDate = document.querySelector("#end-date");
const duration = document.querySelector("#duration");
const price = document.querySelector("#price");
const quantity = document.querySelector("#quantity");
const total = document.querySelector("#total");
const rentStatus = document.querySelector("#status");
const form = document.querySelector("#form");
const tbody = document.querySelector("tbody");
const closeModal = document.querySelector(".cancel-btn");
const returnBtn = document.querySelector(".return");
const remainder = document.querySelector(".remainder");

let editMode = false;       
let editRentId = null;  

document.addEventListener("DOMContentLoaded", ()=>{
    // Load customers and products from local storage
    const customers = JSON.parse(localStorage.getItem("customers"))
    customers.forEach(custo =>{
        customer.innerHTML += `<option value=${custo.id}>${custo.name}</option>`
    })
    const products = JSON.parse(localStorage.getItem("products"))
    products.forEach(prod =>{
        productSelect.innerHTML += `<option value=${prod.id}>${prod.productName}</option>`
    })
    loadRents()
    form.reset(); 
});

// Handle form submission for creating or updating a rent
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newRent = {
        id          : editRentId || generateRentId(), // Use edit ID if in edit mode, otherwise generate a new ID
        customer    : customer.selectedOptions[0].text,
        product     : productSelect.selectedOptions[0].text,
        start       : startDate.value,
        end         : endDate.value,
        duration    : duration.textContent,
        price       : price.textContent,
        quantity    : quantity.value,
        total       : total.textContent,
        status      : rentStatus.selectedOptions[0].text,
        customer_id : customer.value,
        product_id  : productSelect.value,
        status_value: rentStatus.value
    };

    
    if (editMode) {
        updateRent(newRent);
    } else {
        createRent(newRent);
    }
    
    loadRents(); 
    form.reset();    
});

// Generate HTML for each rent row
function generateHtml(rent) {
    let row = document.createElement("tr");
    let rents = `
        <td>${rent.id}</td>
        <td>${rent.customer}</td>
        <td>${rent.product}</td>
        <td>${rent.start}</td>
        <td>${rent.end}</td>
        <td>${rent.duration}</td>
        <td>${rent.quantity}</td>
        <td>${rent.price}</td>
        <td>${rent.total}</td>
        <td>${rent.status}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editRent(${rent.id})"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" onclick="deleteRent(${rent.id})"><i class="fas fa-trash-alt"></i></button>
        </td>`;
    row.innerHTML += rents;
    return row;
}

function createRent(rent) {
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    rents.push(rent);
    localStorage.setItem("rents", JSON.stringify(rents)); 

    // Subtract the rented quantity from the selected product's available quantity
    const products = JSON.parse(localStorage.getItem("products")) ;
    const Index = products.findIndex(product => product.id == productSelect.value); 
    console.log(products[Index])
    products[Index].productQuantity -= quantity.value; 
    localStorage.setItem("products", JSON.stringify(products)); 
}

function loadRents() {
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    tbody.innerHTML = ""; 
    rents.map((rent) => {
        tbody.appendChild(generateHtml(rent)); 
    });
    modal.style.display = "none"; // Hide the modal after loading
}


function deleteRent(id) {
    let rents = JSON.parse(localStorage.getItem("rents")) || [];
    rents = rents.filter(rent => rent.id != id); 
    localStorage.setItem("rents", JSON.stringify(rents)); 
    loadRents(); 
}

function editRent(rentId) {
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    const rent = rents.find((rent) => rent.id == rentId);

    customer.value          = rent.customer_id,
    productSelect.value     = rent.product_id,
    startDate.value         = rent.start,
    endDate.value           = rent.end,
    duration.textContent    = rent.duration,
    price.textContent       = rent.price,
    quantity.value          = rent.quantity,
    total.textContent       = rent.total,
    rentStatus.value        = rent.status_value
    
    document.querySelector(".submit-btn").textContent = "Update"; 
    editMode = true;        
    editRentId = rentId; 
    modal.style.display = "block";
    if (rentStatus.value == "return"){
        returnBtn.style.display = "none"
    }else {
        returnBtn.style.display = "inline-block"
    }
    remainder.style.display = "inline-block"
    
}

function updateRent(rent) {
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    const rentIndex = rents.findIndex(ren => ren.id === rent.id); 
    rents[rentIndex] = rent; 
    localStorage.setItem("rents", JSON.stringify(rents)); 
}

// Return the rented quantity to the selected product's available quantity
function returnProducts(){
    const products = JSON.parse(localStorage.getItem("products")) ;
    const Index = products.findIndex(product => product.id == productSelect.value); 
    console.log(products[Index])
    products[Index].productQuantity += parseInt(quantity.value); 
    localStorage.setItem("products", JSON.stringify(products)); 
  
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    const rentIndex = rents.findIndex(rent => rent.id === editRentId);
    rents[rentIndex].status = "Returned";
    rents[rentIndex].status_value = "return"
    
    // Use the updateRent function to save changes
    updateRent(rents[rentIndex]);
   
    loadRents()
}
remainder.onclick = async function () {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customerId = customers.find((cust) => cust.id == customer.value);
    const url = 'https://rapidmail.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'a21fe564b5msh973aae8511b10e7p153f98jsnd762b9389b0a',
            'x-rapidapi-host': 'rapidmail.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ishtml: 'false',
            sendto: customerId.email,
            name: 'Put Any Custom Name here',
            replyTo: 'admin@go-mail.us.to',
            title: 'Reminder to Return Rented Products',
            body: 'Dear Customer, this is a reminder to return your rented products as soon as possible. Please contact us if you have any questions or need assistance. Thank you!'
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        alert(result.message)
        console.log(customerId.email);
    } catch (error) {
        console.error(error);
    }
}

returnBtn.addEventListener("click", returnProducts)
btn.addEventListener("click", () => {
    modal.style.display = "block";
    returnBtn.style.display = "none"
    remainder.style.display = "none"
});
startDate.addEventListener("change", getDaysBetweenDates)
endDate.addEventListener('change', getDaysBetweenDates)
productSelect.addEventListener('change', ()=>{
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((rent) => rent.id == productSelect.value);
    price.textContent = product.productPrice
    total.textContent = `$${quantity.value * price.textContent * duration.textContent}`
})
quantity.addEventListener("change", ()=>{
    total.textContent = `$${quantity.value * price.textContent * duration.textContent}`
})
// Hide modal when "Cancel" button is clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
function getDaysBetweenDates() {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (isNaN(start) || isNaN(end)) {
        duration.textContent = 0;
        return;
    }
    // Calculate the difference in days
    const differenceInMilliseconds = end - start;
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    duration.textContent = differenceInDays;
    total.textContent = `$${quantity.value * price.textContent * duration.textContent}`
}
// Generate a unique rent ID based on the highest existing ID in local storage
function generateRentId() {
    const rents = JSON.parse(localStorage.getItem("rents")) || [];
    const maxId = rents.length > 0 ? Math.max(...rents.map(rent => rent.id)) : 0;
    return maxId + 1; // Return the next ID in sequence
}

document.addEventListener('DOMContentLoaded', function() {

    const username = JSON.parse(localStorage.getItem('loggedInUser'));
    
    const usernameElement = document.getElementById('username');
    
    if (username) {
      usernameElement.innerText = username;
    } else {
      window.location.replace("../html/signup.html");
    };
    });