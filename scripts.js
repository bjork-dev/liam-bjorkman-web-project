var loggedIn = false;
var username;
var lon;
var lat;

function logIn()
{
    username = document.getElementById("username").value;
    document.getElementById('loginCard').innerHTML = '';
    var h1 = document.createElement('h1');
    h1.innerHTML = "Hello, " + username +"!";
    document.getElementById('loginCard').appendChild(h1);
    var logout = document.createElement('button')
    logout.innerHTML = 'Logout';
    
    logout.onclick = function refreshPage()
    {
    window.location.reload();
    }; 
    
    document.getElementById("loginCard").appendChild(logout);
    loggedIn = true;
    checkLogon();

}

function checkLogon() //Check if user is logged in.
{
if(loggedIn == true)
{
    document.getElementById("weatherText").innerHTML = "";
    document.getElementById("date").innerHTML = new Date().toLocaleString();
    getWeather();
}
}

const getWeather = async () => { //Use API and global variables to fetch correct weather data.
    const response = await fetch("http://api.openweathermap.org/data/2.5/weather?units=metric&lat=" + lat + "&lon=" + lon + "&appid=25bc8d0925bf43088ae50ecb975c424f");
    const myJson = await response.json(); //extract JSON from the http response

    if(myJson.cod == "400") //Display info if location tracking is disabled in browser.
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
    lat = Math.round(position.coords.latitude);
    lon = Math.round(position.coords.longitude);
  }