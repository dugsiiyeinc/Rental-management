const products = document.querySelector("#products")
const customers = document.querySelector("#customers")
const rents = document.querySelector("#rents")
const income = document.querySelector("#income")
const tbody = document.querySelector("tbody");


document.addEventListener('DOMContentLoaded', function() {

const username = JSON.parse(localStorage.getItem('loggedInUser'));

const usernameElement = document.getElementById('username');

if (username) {
  usernameElement.innerText = username;
} else {
  window.location.replace("../html/signup.html");
};

const storedProducts  = JSON.parse( localStorage.getItem("products"))
products.textContent = storedProducts .length

const storedCustomers = JSON.parse(localStorage.getItem("customers"))
customers.textContent = storedCustomers.length

const storedRents = JSON.parse(localStorage.getItem("rents"))
rents.textContent = storedRents.length

// Calculate the total income by summing up the 'total' field of each rent entry
const totalSum = storedRents.reduce((sum, rent) => sum + parseFloat(rent.total.replace('$', '')), 0);
income.textContent = totalSum;

// Load the last three rent entries into the table
loadRents()

});

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
        `;
    row.innerHTML += rents;
    return row;
}
function loadRents() {
  const rents = JSON.parse(localStorage.getItem("rents")) || [];
  tbody.innerHTML = ""; 
  const lastThreeRents = rents.slice(-3); // Get the last three items

  lastThreeRents.forEach((rent) => {
    tbody.appendChild(generateHtml(rent)); 
  });
  
}



