
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

let units = "metric";
let apiKey = "e165ab4o82t6774be34bfe406eaaafd2";
let lon = "lon";
let lat = "lat";

function getWeatherIconByDescription(description) {
  if (description.toLowerCase().includes('scattered clouds')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/scattered-clouds-day.png';
  } else if (description.toLowerCase().includes('rain')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/rain-night.png';
  } else if (description.toLowerCase().includes('light rain')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/rain-day.png';
  } else if (description.toLowerCase().includes('broken cloud')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/broken-clouds-day.png';
  } else if (description.toLowerCase().includes('clear sky')) {
    return 'http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png';
  } else {
    return 'https://shecodes-assets.s3.amazonaws.com/api/weather/icons/mist-day.png';
  }
}
  

function updateWeatherInfo(response) {
  let temperatureElement = document.querySelector("#temperature-value");
  let temperature = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = `${temperature}`;

  let descriptionElement = document.querySelector("#weather-description");
  let description = response.data.condition.description;
  descriptionElement.innerHTML = `${description}`;

  let windSpeedElement = document.querySelector("#wind-speed-value");
  let windSpeed = Math.round((response.data.wind.speed) * 3.6).toFixed(2);
  windSpeedElement.innerHTML = `${windSpeed} km/h`;

  let humidityElement = document.querySelector("#humidity-value");
  let humidity = response.data.temperature.humidity;
  humidityElement.innerHTML = `${humidity}%`;

  let iconElement = document.querySelector("#weather-icon-description");
  let iconUrl = getWeatherIconByDescription(response.data.condition.icon_url);
  iconElement.src = iconUrl;
  iconElement.alt = `${description}`;

  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  

  getDailyForecast(response.data.cityName);
}

function getCurrentWeather(cityName) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=${units}`;
  axios
    .get(apiUrl)
    .then((response) => {
      updateWeatherInfo(response);
    })
    .catch((error) => {
      console.error(`Error fetching current weather data for ${cityName}:`, error);
    });
}

function getDailyForecast(cityName) {
  let localApiKey = "e165ab4o82t6774be34bfe406eaaafd2";
  let localApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityName}&lat=${lat}&lon=${lon}&key=${localApiKey}&units=${units}`;
  axios(localApiUrl).then(getWeatherForecast);
}


function getWeatherForecast(response) {
  console.log(response.data); // Check the entire data object received
  let days = ["Tues", "Wed", "Thur", "Fri", "Sat"];
  let forecastHTML = "";

  days.forEach(function (day) {
    console.log(day, response.data[day]); // Check each day's data object
    let description = ""; // Initialize description variable
    if (response.data[day] && response.data[day].condition && response.data[day].condition.description) {
      description = response.data[day].condition.description; // Get description if available
    }
    console.log("Description:", description); // Check the description for each day

    forecastHTML += `<div class="weather-forecast-today">
        <div class="weather-forecast-date">${day}</div>
        <div class="weather-forecast-icon"><img src="${getWeatherIconByDescription(description)}" class="weather-app-icon" /></div>
        <div class = "weather-forecast-temperature">
          <div class="weather-forecast-temperature-max">
            <strong>${response.data[day].temperature.max}°C</strong>
          </div>
          <div class="weather-forecast-temperature-min">
           ${response.data[day].temperature.min}°C
          </div>
        </div>
    </div>`;
  });

  let weatherForecastElement = document.querySelector("#forecast");
  weatherForecastElement.innerHTML = forecastHTML;
}


/*function getWeatherForecast(response) {
  console.log(response.data);
  let days = ["Tues", "Wed", "Thur", "Fri", "Sat"];
  let forecastHTML = "";

  days.forEach(function (day) {
    forecastHTML += `<div class="weather-forecast-today">
        <div class="weather-forecast-date">${day}</div>
        <div class="weather-forecast-icon"><img src="${iconUrl}" class="weather-app-icon" /></div>
        <div class = "weather-forecast-temperature">
          <div class="weather-forecast-temperature-max">
            <strong>30°C</strong>
          </div>
          <div class="weather-forecast-temperature-min">
           15°C 
          </div>
        </div>
    </div>
    `;
  });

  let weatherForecastElement = document.querySelector("#forecast");
  weatherForecastElement.innerHTML = forecastHTML;
}*/

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let cityElement = document.querySelector("#current-city");
  let cityName = searchInputElement.value;
  cityElement.innerHTML = toTitleCase(cityName);
  getCurrentWeather(cityName);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function searchInputString() {
  let searchInput = document.getElementById("search-input");
  let searchInputValue = searchInput.value;
  let titleCaseValue = toTitleCase(searchInputValue);
  console.log(titleCaseValue);
  
  return titleCaseValue;
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);
