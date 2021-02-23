var lon;
var lat;
var user;
var displayName;
var emailVerified;
var imgUrl = "https://images.emojiterra.com/twitter/v13.0/512px/1f914.png";

// Cookie for staying logged in with email/pwd.
document.cookie = 'cookie2=value2; SameSite=None; Secure';


function logIn() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      checkLogon();
    })
    .catch((error) => {
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}

function checkLogon() //Check if user is logged in.
{
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var split = user.email.split('@');
      // Create display name from email
      displayName = split[0];
      emailVerified = user.emailVerified;
      // Call functions
      generateDiv();
      getWeather();
    } 
  });
}

function generateDiv() {
  document.getElementById('loginCard').innerHTML = '';
  
  var h1 = document.createElement('h1');
  var h4 = document.createElement('h4');
  var img = document.createElement('img');
  var logout = document.createElement('button')

  img.src = imgUrl;
  h1.innerHTML = "Hello, " + displayName + "!";
  h4.innerHTML = "Please verify you account.";

  logout.innerHTML = 'Logout';

  img.setAttribute("class", "profileImage")
  logout.setAttribute("class", "button logoutButton");

  document.getElementById('loginCard').appendChild(img);
  document.getElementById('loginCard').appendChild(h1);
  if(emailVerified == false)
  {
  document.getElementById('loginCard').appendChild(h4);
  }
  document.getElementById("loginCard").appendChild(logout);
  document.getElementById("weatherText").innerHTML = "";
  document.getElementById("date").innerHTML = new Date().toLocaleString();
  
  logout.onclick = function refreshPage() {
    signOut();
    window.location.reload();
  };
}

function register() {
  // Clear existing data 
  document.getElementById('loginCard').innerHTML = '';

  //Create elements for register form
  var h1 = document.createElement('h2');
  var emailText = document.createElement('label');
  var passText = document.createElement('label');
  var emailBox = document.createElement('input');
  var passwordBox = document.createElement('input');
  var register = document.createElement('button')
  var cancel = document.createElement('button')
  var linebreak = document.createElement("br");

  //Set attributes for all elements
  emailBox.setAttribute("id", "emailBox");
  emailBox.setAttribute("class", "inputbox");
  emailBox.setAttribute("type", "text");
  passwordBox.setAttribute("id", "passwordBox");
  passwordBox.setAttribute("class", "inputbox");
  passwordBox.setAttribute("type", "password");
  register.setAttribute("class", "button loginButton");
  cancel.setAttribute("class", "button cancelButton");

  // Set inner HTML for elements.
  h1.innerHTML = "Register new account"
  emailText.innerHTML = "Email: ";
  passText.innerHTML = "Password: ";
  cancel.innerHTML = "Cancel";
  register.innerHTML = 'Register';

  //Append all elements in order.
  document.getElementById('loginCard').appendChild(h1);
  document.getElementById('loginCard').appendChild(emailText);
  document.getElementById('loginCard').appendChild(emailBox);
  document.getElementById('loginCard').appendChild(passText);
  document.getElementById('loginCard').appendChild(passwordBox);
  document.getElementById('loginCard').appendChild(linebreak);
  document.getElementById('loginCard').appendChild(register);
  document.getElementById('loginCard').appendChild(cancel);


  //Functions for register button and cancel button
  register.onclick = function registerClick() {
    var username = document.getElementById("emailBox").value;
    var password = document.getElementById("passwordBox").value;

    //Send values to firebase and create account.
    firebase.auth().createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        user.sendEmailVerification().then(function() {
          // Email sent.
        }).catch(function(error) {
          // An error happened.
        });
        window.alert("User created, mail sent to " + username + ", please verify your account")
        checkLogon();
        // ...
      })
      .catch((error) => {
        var errorMessage = error.message;
        window.alert(errorMessage);
        // ..
      });
  };

  cancel.onclick = function refreshPage() {
    window.location.reload();
  };
}

function generateForgotDiv(){
  document.getElementById('loginCard').innerHTML = '';
  var h2 = document.createElement('h2');
  var emailText = document.createElement('label');
  var emailBox = document.createElement('input');
  var submit = document.createElement('button')
  var cancel = document.createElement('button')

  emailBox.setAttribute("id", "ba");
  emailBox.setAttribute("class", "inputbox");
  emailBox.setAttribute("type", "text");
  submit.setAttribute("class", "button loginButton");
  cancel.setAttribute("class", "button cancelButton");

  h2.innerHTML = "Forgot Password"
  emailText.innerHTML = "Email: ";
  submit.innerHTML = "Submit"
  cancel.innerHTML = "Cancel";

  document.getElementById('loginCard').appendChild(h2);
  document.getElementById('loginCard').appendChild(emailText);
  document.getElementById('loginCard').appendChild(emailBox);
  document.getElementById('loginCard').appendChild(submit);
  document.getElementById('loginCard').appendChild(cancel);
 
  submit.onclick = forgotPassword;
  cancel.onclick = function refreshPage() {
    window.location.reload();
  };
}

function forgotPassword(){
  var emailAddress = document.getElementById("ba").value;
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    window.alert("Sent password reset to " + emailAddress)
    window.location.reload();
  }).catch(function(error) {
    window.alert(error.message);
  });
}


const getWeather = async () => {
  // Show hidden loading animation.
  var load = document.getElementById("loader")
  load.style.display = "block";
  // Use API and coordinate variables to fetch correct weather data.
  const response = await fetch("https://api.openweathermap.org/data/2.5/weather?units=metric&lat=" + lat + "&lon=" + lon + "&appid=25bc8d0925bf43088ae50ecb975c424f");
  //Extract JSON from the http response
  const myJson = await response.json();
  // Hide animation
  load.style.display = "none"

  //Display info if location tracking is disabled in browser / Reponse returns 400.
  if (myJson.cod == "400") {
    document.getElementById("weatherText").innerHTML = "Enable location in browser to view the weather.";
  }
  //Log json response in console for debug.
  console.log("%j", myJson);

  //Create readable text from response.
  document.getElementById("location").innerHTML = myJson.name + " - " + myJson.weather[0].main;
  document.getElementById("desc").innerHTML = "The weather is described as " + myJson.weather[0].description;
  document.getElementById("temp").innerHTML = "Current Temperature: " + myJson.main.temp + " °C";
  document.getElementById("feelsLike").innerHTML = "Feels like: " + myJson.main.feels_like + " °C";
  document.getElementById("tempMax").innerHTML = "Highest today: " + myJson.main.temp_max + " °C";
  document.getElementById("tempMin").innerHTML = "Lowest today: " + myJson.main.temp_min + " °C";
}

//Fetch coordinates on window load.
window.onload = function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //Display info if location tracking is disabled in browser.
    document.getElementById("weatherText").innerHTML = "Enable location in browser to view the weather.";
  }
}
//Assign coords to global variables to use in API call.
async function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}

// Sign in with Google
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  //Set display name and image to Google
  displayName = profile.getName();
  imgUrl = profile.getImageUrl();
  //Call functions
  generateDiv();
  getWeather();
}
// Sign out of Google
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
