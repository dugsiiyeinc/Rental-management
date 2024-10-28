document.addEventListener('DOMContentLoaded', function() {

const username = JSON.parse(localStorage.getItem('loggedInUser'));

const usernameElement = document.getElementById('username');

if (username) {
  usernameElement.innerText = username;
} else {
  window.location.replace("../html/signup.html");
};
});



