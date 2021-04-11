// Global Variables
const apiKey = "db1ce060fdd2311ca3bb64a8942d086a";
const cityNameInput = $("#city-name");
const searchForm = $("#search-form");
const searchBtn = $("#search-btn");
const defaultCity = "MIAMI";
const cities = $("#cities");
const cityLi = $(".list-group-item");
var cityName = "";
var cityNames = [];
var storedCityNames;

//This function validates if there are any cities saved in local storage and creates the city menu. Also, it renders the weather for Miami (default city).
var init = function() {
  if (localStorage.getItem("searched-cities") !== null) {
    cityNames = JSON.parse(localStorage.getItem("searched-cities"));
    for (var i = 0; i < cityNames.length; i++) {
      let newCity = $("<li>");
      newCity.text(cityNames[i]);
      newCity.addClass("list-group-item");
      cities.append(newCity);
      newCity.on("click", renderKnownCity);
    }
    getCurrentWeather(defaultCity);
  } else {
    let newCity = $("<li>");
    newCity.text(defaultCity);
    newCity.addClass("list-group-item");
    cities.append(newCity);
    newCity.on("click", renderKnownCity);
    cityNames.push(defaultCity);
    localStorage.setItem("searched-cities", JSON.stringify(cityNames));
    getCurrentWeather(defaultCity);
  }
}

//This function adds a new city to the city list. If the city already exists in the list, the function won't add it again.
var addCityToList = function(city) {
  console.log(city);
  let requestedCity = city;
  if (requestedCity === "") {
    $(function() {
      $("#no-city").dialog();
    });
  } else {
    if (cityNames.includes(requestedCity)) {
      getCurrentWeather(requestedCity);
      $(city.target).prev().val("");
    } else {
      console.log(requestedCity);
      let newCity = $("<li>");
      newCity.text(requestedCity);
      newCity.addClass("list-group-item");
      cities.append(newCity);
      newCity.on("click", renderKnownCity);
      getCurrentWeather(requestedCity);
      cityNames.push(requestedCity);
      localStorage.setItem("searched-cities", JSON.stringify(cityNames));
      $(city.target).prev().val("");
    }
  }
}

//This function renders the weather for a city from the list of searched cities.
var renderKnownCity = function(city) {
  console.log(city);
  let requestedCity = $(city.target).text();
  console.log(requestedCity);
  getCurrentWeather(requestedCity);
}

//This function gets the current weather data for the city searched or selected from the list by the user.
var getCurrentWeather = function(city) {
  let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
  fetch(currentWeatherUrl).then(function(response) {
    if (!response.ok) {
      $(function() {
        $("#error").dialog();
      });
      $(".list-group-item").last().remove();
      cityNames.pop();
      localStorage.setItem("searched-cities", JSON.stringify(cityNames));
      console.log(response);
    } else {
      return response.json();
    }
  }).then(function(data) {
    console.log(data);
    let cityNameReturned = data.name;
    let temp = data.main.temp + " °F";
    let humidity = data.main.humidity + "%";
    let windSpeed = data.wind.speed + " miles/hour"
    let date = moment.unix(data.dt).format("MM/DD/YYYY");
    let lon = data.coord.lon;
    let lat = data.coord.lat;
    let clouds = data.weather[0].icon;
    let cloudsUrl = "http://openweathermap.org/img/wn/" + clouds + "@2x.png";
    getUVinformation(lon, lat);
    getFiveDaysForecast(lon, lat);
    console.log(temp);
    console.log(humidity);
    console.log(windSpeed);
    console.log(clouds);
    console.log(cloudsUrl);
    console.log(lon);
    console.log(lat);
    $("#city-selected").text(cityNameReturned);
    $("#current-date").text("(" + date + ")");
    $("#weather-icon").attr("src", cloudsUrl);
    $("#temp").text(temp);
    $("#humidity").text(humidity);
    $("#wind-speed").text(windSpeed);
  });
}

//This function looks for the UV index information for the current day.
var getUVinformation = function(lon, lat) {
  let uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(uvURL).then(function(response) {
    if (!response.ok) {
      $(function() {
        $("#error").dialog();
      });
      $(".list-group-item").last().remove();
      console.log(response);
    } else {
      return response.json();
    }
  }).then(function(data) {
      console.log(data);
      let uvi = data.current.uvi;
      console.log(uvi);
      $("#uv-index").text(uvi);
      switch (true) {
        case uvi <= 2:
        $("#uv-index").attr("class", "");
        $("#uv-index").addClass("uvi-green");
        break;
        case uvi > 2 && uvi <= 5:
        $("#uv-index").attr("class", "");
        $("#uv-index").addClass("uvi-yellow");
        break;
        case uvi > 5 && uvi <= 7:
        $("#uv-index").attr("class", "");
        $("#uv-index").addClass("uvi-orange");
        break;
        case uvi > 7 && uvi <= 10:
        $("#uv-index").attr("class", "");
        $("#uv-index").addClass("uvi-red");
        break;
        case uvi > 10:
        $("#uv-index").attr("class", "");
        $("#uv-index").addClass("uvi-violet");
      }
  });
}

//This function looks for the forecast for the next 5 days and renders the information in the cards.
var getFiveDaysForecast = function(lon, lat) {
  let uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(uvURL).then(function(response) {
    if (!response.ok) {
      $(function() {
        $("#error").dialog();
      });
      $(".list-group-item").last().remove();
      console.log(response);
    } else {
      return response.json();
    }
  }).then(function(data) {
    console.log(data);
    for (var i = 0; i < 5; i++) {
      let day = moment.unix(data.daily[i + 1].dt).format("MM/DD/YYYY");
      let temp = data.daily[i + 1].temp.day + " °F";
      let humidity = data.daily[i + 1].humidity + "%";
      let clouds = data.daily[i + 1].weather[0].icon;
      let cloudsUrl = "http://openweathermap.org/img/wn/" + clouds + "@2x.png";
      $("#day" + i).text(day);
      $("#img" + i).attr("src", cloudsUrl);
      $("#temp" + i).text(temp);
      $("#humidity" + i).text(humidity);
    }
  });
}

//Adding event listener to the search form to handle submits without clicking on the search button.
searchForm.on("submit", function(event) {
  event.preventDefault();
  let city = $("#city-name").val().toUpperCase();
  addCityToList(city);
  $("#city-name").val("");
});

//Adding event listener to the search form to handle submits when the search button is clicked.
$("#search-form").delegate("#search-btn", "click", function(event){
  event.preventDefault();
  let city = $("#city-name").val().toUpperCase();
  addCityToList(city);
  $("#city-name").val("");
});

//Runs the init function on page load/reload.
init();
