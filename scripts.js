var lon;
var lat;
var user;

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
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}

function checkLogon() //Check if user is logged in.
{
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.email.split('@');
      document.getElementById('loginCard').innerHTML = '';
      var h1 = document.createElement('h1');
      h1.innerHTML = "Hello, " + displayName[0] + "!";
      document.getElementById('loginCard').appendChild(h1);
      var logout = document.createElement('button')
      logout.setAttribute("class", "button logoutButton");
      logout.innerHTML = 'Logout';

      logout.onclick = function refreshPage() {
        window.location.reload();
      };

      document.getElementById("loginCard").appendChild(logout);

      document.getElementById("weatherText").innerHTML = "";
      document.getElementById("date").innerHTML = new Date().toLocaleString();
      getWeather();

    } else {
      // No user is signed in.
    }
  });
}

function register()
{
      document.getElementById('loginCard').innerHTML = ''; // Clear existing data 

      //Create elements for register form
      var h1 = document.createElement('h2');
      var emailText = document.createElement('p');
      var passText = document.createElement('p');
      var emailBox = document.createElement('input');
      var passwordBox = document.createElement('input');
      var register = document.createElement('button')
      var cancel = document.createElement('button')
      var linebreak = document.createElement("br");
      var linebreak2 = document.createElement("br");

      //Set attributes for all elements
      emailBox.setAttribute("id", "emailBox");
      emailBox.setAttribute("type", "text");
      passwordBox.setAttribute("id", "passwordBox");
      passwordBox.setAttribute("type", "password");
      register.setAttribute("class", "button loginButton");
      cancel.setAttribute("class", "button logoutButton");

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
      document.getElementById('loginCard').appendChild(linebreak2);
      document.getElementById('loginCard').appendChild(register);
      document.getElementById('loginCard').appendChild(cancel);


      //Functions for register button and cancel button
      register.onclick = function registerClick() {
        var username = document.getElementById("emailBox").value;
        var password = document.getElementById("passwordBox").value;

        firebase.auth().createUserWithEmailAndPassword(username, password) //Send values to firebase and create account.
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          window.alert("User Created")
          checkLogon();
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert(errorMessage);
          // ..
        });
      };

      cancel.onclick = function refreshPage() {
        window.location.reload();
      };
}

const getWeather = async () => { // Use API and global variables to fetch correct weather data.
  const response = await fetch("http://api.openweathermap.org/data/2.5/weather?units=metric&lat=" + lat + "&lon=" + lon + "&appid=25bc8d0925bf43088ae50ecb975c424f");
  const myJson = await response.json(); //extract JSON from the http response

  if (myJson.cod == "400") //Display info if location tracking is disabled in browser.
  {
    document.getElementById("weatherText").innerHTML = "Enable location in browser to view the weather.";
  }
  console.log("%j", myJson); //Log json response in console for debug.
  //Create readable text from response.
  document.getElementById("location").innerHTML = myJson.name + " - " + myJson.weather[0].main;
  document.getElementById("desc").innerHTML = "The weather is described as " + myJson.weather[0].description;
  document.getElementById("temp").innerHTML = "Current Temperature: " + myJson.main.temp + " °C";
  document.getElementById("feelsLike").innerHTML = "Feels like: " + myJson.main.feels_like + " °C";
  document.getElementById("tempMax").innerHTML = "Highest today: " + myJson.main.temp_max + " °C";
  document.getElementById("tempMin").innerHTML = "Lowest today: " + myJson.main.temp_min + " °C";
}

window.onload = function getLocation() { //Fetch coordinates on window load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function showPosition(position) { //Assign coords to global variables to use in API call.
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}