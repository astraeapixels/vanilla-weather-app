let now = new Date();

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  let day = days[date.getDay()];
  return `${day} <strong>${hours}:${minutes}</strong>`;
}

function formatFullDate(timestamp) {
  let now = new Date(timestamp);

  let months = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];

  let month = months[now.getMonth()];
  let dateOfMonth = now.getDate();
  let year = now.getFullYear();

  function futureDate(day) {
    var future = new Date();

    let month = future.getMonth();
    let year = future.getFullYear();

    var getDaysInMonth = function (month, year) {
      return new Date(year, month, 0).getDate();
    };

    let monthDaysNumber = getDaysInMonth(month, year);
    let newDate = future.setDate(future.getDate() + day);

    if (newDate > monthDaysNumber) {
      return future;
    }
  }

  let firstDate = document.querySelector("#first-date");
  let lastDate = document.querySelector("#last-date");

  let firstMonth = months[futureDate(1).getMonth()];
  let firstDay = futureDate(1).getDate();

  let lastMonth = months[futureDate(6).getMonth()];
  let lastDay = futureDate(6).getDate();

  let showFirst = `${firstMonth} ${firstDay}`;
  let showLast = `${lastMonth} ${lastDay}`;

  firstDate.innerHTML = `${showFirst}`;
  lastDate.innerHTML = `${showLast}`;

  return `${month} ${dateOfMonth}, ${year}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                            <div class="day-of-week" id="day-one">${formatDay(
                              forecastDay.dt
                            )}</div>
                            <div class="weather-icon">
                                <img src="http://openweathermap.org/img/wn/${
                                  forecastDay.weather[0].icon
                                }@2x.png" alt="" id="icon-one">
                            </div>
                            <div class="daily-temperature">
                                <span class="minimum">${Math.round(
                                  forecastDay.temp.min
                                )}°</span>/<span class="maximum">${Math.round(
          forecastDay.temp.max
        )}°</span>
                            </div>
                        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `281450ec88936f4fa8ee9864682b49a0`;
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let unit = `imperial`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function getForecastMetric(coordinates) {
  let apiKey = `281450ec88936f4fa8ee9864682b49a0`;
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let unit = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function defaultWeather(response) {
  let city = response.data.name;
  let humidity = response.data.main.humidity;
  let description = response.data.weather[0].main;
  let dateElement = formatDate(response.data.dt * 1000);
  let fullDateElement = formatFullDate(response.data.dt * 1000);
  fahrenheitTemperature = response.data.main.temp;
  windSpeed = response.data.wind.speed;

  let showTemperature = document.querySelector("#temp-on-display");
  showTemperature.innerHTML = Math.round(fahrenheitTemperature);

  let showCity = document.querySelector("#location");
  showCity.innerHTML = `${city}`;

  let showHumidity = document.querySelector("#humidity");
  showHumidity.innerHTML = `${humidity}`;

  let showWindSpeed = document.querySelector("#wind");
  showWindSpeed.innerHTML = Math.round(windSpeed);

  let showDescription = document.querySelector("#description");
  showDescription.innerHTML = `${description}`;

  let showIcon = document.querySelector("#main-icon");
  showIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  showIcon.setAttribute("alt", response.data.weather[0].description);

  let showDate = document.querySelector("#week-day");
  showDate.innerHTML = `${dateElement}`;

  let currentDate = document.querySelector("#date-of-month");
  currentDate.innerHTML = `${fullDateElement}`;

  let celsiusspeedMetric = document.querySelector("#speed-metric");
  celsiusspeedMetric.innerHTML = `m/h`;

  getForecast(response.data.coord);
}

function showCelciusWeather(response) {
  let celsiusTemperature = response.data.main.temp;
  let celsiusWind = response.data.wind.speed;

  let showCelsiusTemp = document.querySelector("#temp-on-display");
  showCelsiusTemp.innerHTML = `${Math.round(celsiusTemperature)}`;

  let showCelsiusWind = document.querySelector("#wind");
  showCelsiusWind.innerHTML = `${Math.round(celsiusWind)}`;

  let celsiusspeedMetric = document.querySelector("#speed-metric");
  celsiusspeedMetric.innerHTML = `km/h`;

  getForecastMetric(response.data.coord);
}

//default means fahrenheit/imperial unit
function searchCityDefault(city) {
  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let unit = `imperial`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(defaultWeather);
}

function searchCityMetric() {
  let location = document.querySelector("#location").textContent;
  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let unit = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showCelciusWeather);
}

function searchFahrenheitAgain() {
  let location = document.querySelector("#location").textContent;
  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let unit = `imperial`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(defaultWeather);
}

function searchLocation(event) {
  event.preventDefault();
  let location = document.querySelector("#location");
  let input = document.querySelector("#user-input");

  let city = input.value;

  if (city) {
    location.innerHTML = `${city}`;
  } else {
    alert("type the name of a city");
  }
  searchCityDefault(city);
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchLocation);

function activateCelsius(event) {
  event.preventDefault();
  fahrenheitConversion.classList.remove("active");
  celsiusConversion.classList.add("active");

  searchCityMetric();
}

function activateFanhrenheit(event) {
  event.preventDefault();
  celsiusConversion.classList.remove("active");
  fahrenheitConversion.classList.add("active");

  searchFahrenheitAgain();
}

let celsiusConversion = document.querySelector("#celsius");
celsiusConversion.addEventListener("click", activateCelsius);

let fahrenheitConversion = document.querySelector("#fahrenheit");
fahrenheitConversion.addEventListener("click", activateFanhrenheit);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = `imperial`;

  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(defaultWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let fahrenheitTemperature = null;
let windSpeed = null;

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentPosition);

searchCityDefault(`Los Angeles`);
