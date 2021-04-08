// Global Variables
const apiKey = "db1ce060fdd2311ca3bb64a8942d086a";
const cityNameInput = $("#city-name");
const searchForm = $("#search-form");
const searchBtn = $("#search-btn");
const defaultCity = "Miami";
const cities = $("#cities");
const cityLi = $(".list-group-item");
var cityName = "";



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
    getCurrentWeather(requestedCity);
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
  fetch(currentWeatherUrl).then(function(response){
    if(!response.ok){
      $(function() {
        $("#error").dialog();
      });
      $(".list-group-item").last().remove();
      console.log(response);
    } else {
      return response.json();
    }
  }).then(function(data){
    console.log(data);
  });
}








searchForm.on("click", "#search-btn", function(event) {
  event.preventDefault();
  addCityToList(event);
});

searchForm.on("submit", function(event) {
  event.preventDefault();
});

cityLi.on("click", function(event) {
  renderKnownCity(event)
});
