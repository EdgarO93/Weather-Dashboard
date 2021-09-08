// define variables
let $searchButton = $("#searchbtn");
let $searchInput = $("#searchInput");
var uvId;
let $searchedEL = $("#searched");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
//array for local storage
var cities = [];

// template literal `can include html code
//can pass javascript variables thru string
function getPanelHTML(name, updateDate, weekday, temp, wind, humid, icon) {
  return `
    <div class = "col-sm-2">
        <div class= "panel panel-default border border-primary bg-secondary ">
         <div class ="panel-heading"> Forecast Weather </div>
            <div class ="panel-heading"> ${updateDate}</div>
            <div class ="panel-heading"> ${weekday}</div>
            <div class ="panel-heading">${name}</div>
            <div class = "panel-body">
            <img src=" http://openweathermap.org/img/wn/${icon}@2x.png" /> 
                <p> Average Temperature: ${temp} </p>
                <p> Wind Speed: ${wind} mph</p>
                <p> Humidity: ${humid}% </p>
            </div>

        </div>
    </div>
    `;
}
//this is for the current weather section appending
function getPanelHTML2(name, today, temp, wind, humid, icon, uvId) {
  return `

        <div class= "card text-white bg-secondary mb-3" style="width: 18rem;">
        <h2 class ="card-title">Current Weather</h2>
            <h3 class ="card-subtitle">${today}</h3>
            <h4 class ="card-heading">${name}</h4>
            <div class = "card-body">
            <img src=" http://openweathermap.org/img/wn/${icon}@2x.png" /> 
                <p> Temperature: ${temp} </p>
                <p> Wind Speed: ${wind} mph</p>
                <p> Humidity: ${humid}% </p>
                <p id="uvIdx"> UV Index: ${uvId} </p>
            </div>
        
    </div>
    `;
}
//function for the searching the city forecast
function searchButtonHandler() {
  $("#myWeather").empty();
  $("#current").empty();
  let searchInput = $searchInput.val();

  let apiKey = "b21a3a98c66a430705a9406d77dd7091";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
  //vairable to get current weather info
  let dataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${apiKey}`;

  // api call to get values for variables
  $.ajax({
    url: weatherUrl,
    success: function (data) {
      // array for the dates and count to control how many panels to make
      let appendedDates = [];
      let appendedCount = 0;

    //   console.log(data);
      for (let i = 0; i < data.list.length; i++) {
        //will make a variable for the data
        let curr = data.list[i];
        //grabs the date text from the api
        let currDateText = curr.dt_txt;
        //splits the value into a string
        let currDate = currDateText.split(" ")[0];
        //updates the date format
        let updateDate = moment(currDate, "YYYY/MM/DD").format("MM/DD/YYYY");
        //creates variable for day of week
        let weekday = moment(currDate, "YYYY/MM/DD").format("dddd");
        //variables grabbing the cityname,wind,weather icon and humidity
        let name = data.city.name;
        let wind = curr.wind.speed;
        let icon = curr.weather[0].icon;
        let humid = curr.main.temp;
        //this adds the dates to the array and the temperature
        if (!appendedDates.includes(currDate)) {
          appendedDates.push(currDate);
          let temp = curr.main.temp;

          // this appends the html code to the index file
          $("#myWeather").append(
            getPanelHTML(name, updateDate, weekday, temp, wind, humid, icon)
          );
          // this creates 6 forecast panels since depending on the day it pulls current day forecast if called too early
          appendedCount++;
          if (appendedCount > 5) {
            break;
          }
        }
      }
    },
  });

  //second call for UVindex and current data
  $.ajax({
    url: dataUrl,
    success: function (data) {
      // similar but since only doing current weather don't need appended count

      let appendedData = [];

      // console.log(data)
      //defining the variables just as before in the forecast function
      let currDateUnix = data.dt;
      let today = moment.unix(currDateUnix).format("MM/DD/YYYY");

      let name = data.name;
      let wind = data.wind.speed;
      let icon = data.weather[0].icon;
      let humid = data.main.temp;
      // this gets the coordinates information needed for the UV API
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${apiKey}`;
      // call for the UV index information
      function getUVidx() {
        $.ajax({
          url: uvURL,
          method: "GET",
        }).then(function (data) {
          // console.log(data)
          // console.log(data.current.uvi);
          // this adds to the UV index data to the current weather section
          $("#uvIdx").text(" UV Index: " + data.current.uvi);
          // if else if statement for the coloring of UV index
          if (data.current.uvi <= 2) {
            $("#uvIdx").addClass("favorable");
          } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
            $("#uvIdx").addClass("moderate");
          } else if (data.current.uvi > 5) {
            $("#uvIdx").addClass("severe");
          }
        });
      }

      // console.log(uvId)
      // appending the data for current day
      if (!appendedData.includes(today)) {
        appendedData.push(today);
        let temp = data.main.temp;

        // appends the current weather section with a value for the UV index
        $("#current").append(
          getPanelHTML2(name, today, temp, wind, humid, icon, uvId)
        );
        // this adds to the array that will be used for local storage
        cities.unshift({ searchInput });
        //runs function to add the UV index to the already appened curent section
        getUVidx();
        // this clears the search input
        $searchInput.val("");
        // runs the local storage function
        saveSearch();
        // runs the function to add the searched city to the list of search history
        pastSearch(searchInput);
      }
    },
  });
}

//local storage for the list of past searches
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

// this function creates buttons for the search cities and gives them attributes to be
// used for clicking to give them similar function to searching the city
var pastSearch = function (pastSearch) {
  // console.log(pastSearch)
  // creates the button from the search value and gives it styling and data attributes
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-secondary border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");
  // this adds the buttons before the next one
  pastSearchButtonEl.prepend(pastSearchEl);
};

// this function allows to run the APIs while clicking the search history buttons via the data attribute
var pastSearchHandler = function (event) {
  var searchInput = event.target.getAttribute("data-city");
  if (searchInput) {
    // runs the value thru the function that will run the API calls again.
    pastQuery(searchInput);
  }
};

// click event functions for the search button and the search history list
$searchButton.click(searchButtonHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);

// this function runs similar to the SearchButtonHandler but using the string value
function pastQuery(searchInput) {
  $("#myWeather").empty();
  $("#current").empty();

  let apiKey = "b21a3a98c66a430705a9406d77dd7091";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
  //vairable to get current weather info
  let dataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: weatherUrl,
    success: function (data) {
      let appendedDates = [];
      let appendedCount = 0;

    //   console.log(data);
      for (let i = 0; i < data.list.length; i++) {
        let curr = data.list[i];
        let currDateText = curr.dt_txt;
        let currDate = currDateText.split(" ")[0];
        let updateDate = moment(currDate, "YYYY/MM/DD").format("MM/DD/YYYY");
        let weekday = moment(currDate, "YYYY/MM/DD").format("dddd");

        let name = data.city.name;
        let wind = curr.wind.speed;
        let icon = curr.weather[0].icon;
        let humid = curr.main.temp;

        if (!appendedDates.includes(currDate)) {
          appendedDates.push(currDate);
          let temp = curr.main.temp;

          $("#myWeather").append(
            getPanelHTML(name, updateDate, weekday, temp, wind, humid, icon)
          );
          appendedCount++;
          if (appendedCount > 5) {
            break;
          }
        }
      }
    },
  });

  //second call for UVindex and current data
  $.ajax({
    url: dataUrl,
    success: function (data) {
      let appendedData = [];
    //   console.log(data);
      let currDateUnix = data.dt;
      let today = moment.unix(currDateUnix).format("MM/DD/YYYY");
      let name = data.name;
      let wind = data.wind.speed;
      let icon = data.weather[0].icon;
      let humid = data.main.temp;
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${apiKey}`;

      function getUVidx() {
        $.ajax({
          url: uvURL,
          method: "GET",
        }).then(function (data) {
        //   console.log(data);

          $("#uvIdx").text(" UV Index: " + data.current.uvi);

          if (data.current.uvi <= 2) {
            $("#uvIdx").addClass("favorable");
          } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
            $("#uvIdx").addClass("moderate");
          } else if (data.current.uvi > 5) {
            $("#uvIdx").addClass("severe");
          }
        });
      }

      if (!appendedData.includes(today)) {
        appendedData.push(today);
        let temp = data.main.temp;

        $("#current").append(
          getPanelHTML2(name, today, temp, wind, humid, icon, uvId)
        );
        // don't need the other functions as I don't want to add the search values as new values for local storage

        getUVidx();
      }
    },
  });
}

// function to retrieve local storage items
function getItems() {
  var storedHistory = JSON.parse(localStorage.getItem("cities"));
  if (storedHistory !== null) {
    cities = storedHistory;
  }
  // this loop will create a maximum of 10 items in stored history list
  for (i = 0; i < cities.length; i++) {
    if (i == 10) {
      break;
    }
    // this creates the buttons again and get the local storage value
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = cities[i].searchInput;
    pastSearchEl.classList = "d-flex w-100 btn-secondary border p-2";
    pastSearchEl.setAttribute("data-city", cities[i].searchInput);
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
  }
}
getItems();
