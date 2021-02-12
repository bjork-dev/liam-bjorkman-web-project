var loggedIn = false;
var username;
var lon;
var lat;

function logIn()
{
    username = document.getElementById("username").value;
    loggedIn = true;
    userAction();
    checkLogon();

}

function checkLogon() //Wait until site has finished loading then check login status.
{
if(loggedIn == true)
{
    document.getElementById("weatherText").innerHTML = "Hello, " + username + ". Here's todays weather forecast."
}
}

const userAction = async () => { //Use API and global variables to fetch correct weather data.
    const response = await fetch("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=25bc8d0925bf43088ae50ecb975c424f");
    const myJson = await response.json(); //extract JSON from the http response
    console.log("%j", myJson);
    var obj = JSON.stringify(myJson);
    document.getElementById("json").innerHTML = obj
  }

  window.onload = function getLocation() { //Fetch coordinates on window load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  async function showPosition(position) { //Dispaly coordinates and assign to global variables.
    lat = Math.round(position.coords.latitude);
    lon = Math.round(position.coords.longitude);
    document.getElementById("cord").innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
  }