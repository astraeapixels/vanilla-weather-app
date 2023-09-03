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
  let now = new Date();

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

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
                            <div class="day-of-week" id="day-one">${day}</div>
                            <div class="weather-icon">
                                <img src="http://openweathermap.org/img/wn/01d@2x.png" alt="" id="icon-one">
                            </div>
                            <div class="daily-temperature">
                                <span class="minimum">54°</span>/<span class="maximum">79°</span>
                            </div>
                        </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `281450ec88936f4fa8ee9864682b49a0`;
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function temperature(response) {
  let city = response.data.name;
  let humidity = response.data.main.humidity;
  let description = response.data.weather[0].main;
  let dateElement = formatDate(response.data.dt * 1000);
  let fullDateElement = formatFullDate(response.data.dt * 1000);
  fahrenheitTemperature = response.data.main.temp;
  windSpeed = response.data.wind.speed;

  console.log(response);
  console.log(response.data.wind);

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

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(temperature);
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
  searchCity(city);
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchLocation);

function celsiusConverter(event) {
  event.preventDefault();
  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  let celsiusWind = windSpeed * 1.609344;

  fahrenheitConversion.classList.remove("active");
  celsiusConversion.classList.add("active");

  let showCelsiusTemp = document.querySelector("#temp-on-display");
  showCelsiusTemp.innerHTML = `${Math.round(celsiusTemperature)}`;

  let showCelsiusWind = document.querySelector("#wind");
  showCelsiusWind.innerHTML = `${Math.round(celsiusWind)}`;

  let celsiusspeedMetric = document.querySelector("#speed-metric");
  celsiusspeedMetric.innerHTML = `km/h`;
}

function fahrenheitConverter(event) {
  event.preventDefault();

  celsiusConversion.classList.remove("active");
  fahrenheitConversion.classList.add("active");

  let showFahrenheitTemp = document.querySelector("#temp-on-display");
  showFahrenheitTemp.innerHTML = Math.round(fahrenheitTemperature);

  let showCelsiusWind = document.querySelector("#wind");
  showCelsiusWind.innerHTML = `${Math.round(windSpeed)}`;

  let celsiusspeedMetric = document.querySelector("#speed-metric");
  celsiusspeedMetric.innerHTML = `m/h`;
}

let celsiusConversion = document.querySelector("#celsius");
celsiusConversion.addEventListener("click", celsiusConverter);

let fahrenheitConversion = document.querySelector("#fahrenheit");
fahrenheitConversion.addEventListener("click", fahrenheitConverter);

function showPosition(position) {
  console.log(position);

  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = `2a9813540ff06c7d508ac5d7caf18400`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(temperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let fahrenheitTemperature = null;
let windSpeed = null;

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentPosition);

searchCity(`Los Angeles`);
