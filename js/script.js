// Get references to the form and all input elements
const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const Confirm_Password_input = document.getElementById('Confirm-Password-input')
const error_message = document.getElementById('error-message')


// Add an event listener for the form's submit event
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let errors = [] 

  if(firstname_input){
    // If we have a firstname input, it means we are in the signup form
    errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, Confirm_Password_input.value)
  }
  else{
    // If we don't have a firstname input, it means we are in the login form
    errors = getLoginFormErrors(email_input.value, password_input.value)
  }

  if(errors.length > 0){
    // e.preventDefault()
    error_message.innerText  = errors.join(". ")
  }else {

    if (firstname_input){
 
       Signup(firstname_input.value, email_input.value, password_input.value);
      } else {
       console.log("yeeeeeeeeee")
       Login(email_input.value, password_input.value);
     }
   }
 
})

function Signup(firstname, email, password){

  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  const existingUser = storedUsers.find(user => user.email === email );
  if (existingUser){
    alert('user with this email already exists.');
    return
   }


const newUser = { firstname, email, password};
storedUsers.push(newUser);
localStorage.setItem('users', JSON.stringify(storedUsers));
alert('signup successful');

}

function Login(email, password){  
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  const existingUser = storedUsers.find(user => user.email ===email && user.password === password);

  if(existingUser){
    // alert('login successful! welcome,'+existingUser.firstname );
    // window.location.href ='../html/signup.html';
    localStorage.setItem('loggedInUser', JSON.stringify(existingUser.firstname));
    window.location.replace("../html/dashboard.html")
  }else {
    alert('incorrect email or password.please try again.')
  }
}


// Function to get errors for the signup form
function getSignupFormErrors(firstname, email, password, ConfirmPassword){
  let errors = [] 

  if(firstname === '' || firstname == null){
    errors.push('Firstname is required')
    firstname_input.parentElement.classList.add('incorrect') 
  }
  
  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect') 
  }

  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect') 
  }
 
  if(password.length < 8){
    errors.push('Password must have at least 8 characters')
    password_input.parentElement.classList.add('incorrect') 
  }

  if(password !== ConfirmPassword){
    errors.push('Password does not match repeated password')
    password_input.parentElement.classList.add('incorrect') 
    Confirm_Password_input.parentElement.classList.add('incorrect') 
  }

  return errors; 
}

// Function to get errors for the login form
function getLoginFormErrors(email, password){
  let errors = [] 

  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect') 
  }

  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect') 
  }

  return errors; 
}

// Get all input fields (filter out null values in case some inputs are missing)
const allInputs = [firstname_input, email_input, password_input, Confirm_Password_input].filter(input => input != null)

// Add an input event listener to each input field to remove error classes when the user types
allInputs.forEach(input => {
  input.addEventListener('input', () => {
    // If the parent element has the 'incorrect' class, remove it and clear the error message
    if(input.parentElement.classList.contains('incorrect')){
      input.parentElement.classList.remove('incorrect')
      error_message.innerText = '' 
    }
  })
})
