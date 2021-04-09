// Global Variables
const apiKey = "db1ce060fdd2311ca3bb64a8942d086a";
const cityNameInput = $("#city-name");
const searchForm = $("#search-form");
const searchBtn = $("#search-btn");
const defaultCity = "Miami";
const cities = $("#cities");
const cityLi = $(".list-group-item");
var cityName = "";
var cityNames = [];
var storedCityNames;

var init = function() {
  if (localStorage.getItem("searched-cities") !== null) {
    cityNames = JSON.parse(localStorage.getItem("searched-cities"));
    for (var i = 0; i < cityNames.length; i++) {
      let newCity = $("<li>");
      newCity.text(cityNames[i]);
      newCity.addClass("list-group-item");
      cities.append(newCity);
    }
    // addLiListener();
    getCurrentWeather(defaultCity);
  } else {
    let newCity = $("<li>");
    newCity.text(defaultCity);
    newCity.addClass("list-group-item");
    cities.append(newCity);
    cityNames.push(defaultCity);
    localStorage.setItem("searched-cities", JSON.stringify(cityNames));
    // addLiListener();
    getCurrentWeather(defaultCity);
  }
}

var addCityToList = function(city) {
  console.log(city);
  let requestedCity = $(city.target).prev().val();
  if (requestedCity === "") {
    $(function() {
      $("#no-city").dialog();
    });
  } else {
    console.log(requestedCity);
    let newCity = $("<li>");
    newCity.text(requestedCity);
    newCity.addClass("list-group-item");
    cities.append(newCity);
    // addLiListener();
    getCurrentWeather(requestedCity);
    cityNames.push(requestedCity);
    localStorage.setItem("searched-cities", JSON.stringify(cityNames));
    $(city.target).prev().val("");
  }
}

var renderKnownCity = function(city) {
  console.log(city);
  let requestedCity = $(city.target).text();
  console.log(requestedCity);
  getCurrentWeather(requestedCity);
}

var getCurrentWeather = function(city) {
  let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
  fetch(currentWeatherUrl).then(function(response) {
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
    let cityNameReturned = data.name;
    let temp = data.main.temp + " °F";
    let humidity = data.main.humidity + "%";
    let windSpeed = data.wind.speed + " miles/hour"
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
    $("#weather-icon").attr("src", cloudsUrl);
    $("#temp").text(temp);
    $("#humidity").text(humidity);
    $("#wind-speed").text(windSpeed);
  });
}

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
  });
}

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
      let day = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
      let temp = data.daily[i].temp.day + " °F";
      let humidity = data.daily[i].humidity + "%";
      let clouds = data.daily[i].weather[0].icon;
      let cloudsUrl = "http://openweathermap.org/img/wn/" + clouds + "@2x.png";
      $("#day" + i).text(day);
      $("#img" + i).attr("src", cloudsUrl);
      $("#temp" + i).text(temp);
      $("#humidity" + i).text(humidity);
    }
  });
}

searchForm.on("click", "#search-btn", function(event) {
  event.preventDefault();
  addCityToList(event);
});

searchForm.on("submit", function(event) {
  event.preventDefault();
});

// var addLiListener = function() {
//   document.querySelectorAll(".list-group-item").addEventListener("click", function(event) {
//     renderKnownCity(event);
//   });
// }

init();
