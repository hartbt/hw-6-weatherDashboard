var APIKey = "41fcc00c28cd140911f11c7202ce7491";
var lon = 0;
var lat = 0;
var citiesStorage = JSON.parse(localStorage.getItem("citiesStorage")) || []
if( citiesStorage.length > 0 ){
    console.log("hello")
    currentDay(citiesStorage[citiesStorage.length-1])
}
for(i=0; i< citiesStorage.length; i++){
    createButtons(citiesStorage[i])
}
$("#search-button").on("click", function(){
    var searchCity = $("#search-value").val();
    $("#search-value").val("");
    currentDay(searchCity);
    forecast(searchCity);
})
function createButtons(searchCity){
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(searchCity)
    $(".cityHistory").append(li);
}
$(".cityHistory").on("click", "li", function(){
    currentDay($(this).text())
})

function currentDay(searchCity) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + APIKey,
    method: "GET"
}).then(function(response) {
console.log(response)
if(citiesStorage.indexOf(searchCity)===-1){
    citiesStorage.push(searchCity)
    localStorage.setItem("citiesStorage", JSON.stringify(citiesStorage))
    createButtons(searchCity);
}

  $.ajax({
    type: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchCity +
      "&appid=" +
      APIKey +
      "&units=imperial",
  }).then(function (response) {
    console.log(response);
    var title = $("<h3>")
      .addClass("card-title")
      .text(response.name + "(" + new Date().toLocaleDateString() + ")");
    var card = $("<div>").addClass("card");
    var wind = $("<p>")
      .addClass("card-text")
      .text("Wind Speed: " + response.wind.speed + " MPH");
    var humidity = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + response.main.humidity + "%");
    var tempTag = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + response.main.temp + "F");
    var cardBody = $("<div>").addClass("card-body");
    var img = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    $("img").empty();
    card.empty();
    cardBody.empty();
    $("#today").empty();

    title.append(img);
    cardBody.append(title, tempTag, humidity, wind);
    card.append(cardBody);
    $("#today").append(card);

    lon = response.coord.lon;
    lat = response.coord.lat;

    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey,
    }).then(function (response) {
      console.log(response);
      var uvIndex = $("<p>")
        .addClass("card-text")
        .text("UV Index: " + response.value);
      if (response.value < 6) {
        uvIndex.addClass("yellowClass");
      } else if (response.value < 8) {
        uvIndex.addClass("orangeClass");
      } else if (response.value < 11) {
        uvIndex.addClass("redClass");
      } else {
        uvIndex.addClass("voiletClass");
      }

      cardBody.append(uvIndex);
      forecast(searchCity);
    });
  });
})

function forecast(searchCity) {
  $.ajax({
    type: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      searchCity +
      "&appid=" +
      APIKey +
      "&units=imperial",
  }).then(function (response) {
    console.log(response);
    $("#forecast")
      .html('<h4 class="mt-3">5-Day Forecast:</h4>')
      .append('<div class="row">');

    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        var column = $("<div>").addClass("col-md-2");
        var card = $("<div>").addClass("card bg-primary text-white");
        var bodyDiv = $("<div>").addClass("card-body");
        var title = $("<h5>")
          .addClass("card-title")
          .text(new Date(response.list[i].dt_txt).toLocaleDateString());
        var img = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );
        var tempTag = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + response.list[i].main.temp + "F");
        var humidity = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + response.list[i].main.humidity + "%");

        column.append(
          card.append(bodyDiv.append(title, img, tempTag, humidity))
        );
        $("#forecast .row").append(column);
      }
    }
  });
}}
