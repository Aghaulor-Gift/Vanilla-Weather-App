document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('getWeatherBtn').addEventListener('click', function() {
        const city = document.getElementById('cityInput').value;
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name')
        }
        
    });

    function getWeather(city) {
        const apiUrl = `https://wttr.in/${city}?format=j1`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const cityName = data.nearest_area[0].areaName[0].value;
                const countryName = data.nearest_area[0].country[0].value;
                const temperatureMax = data.weather.maxtempC;
                const temperatureMin = data.weather.mintempC;
                const weatherDescription = data.current_condition[0].weatherDesc[0].value;
                const weatherIcon = `https://wttr.in/${cityName}.png`

                const now = new Date();
                const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long'});
                const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});
                const time = now.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit'});

                document.getElementById('cityName').innerText = `City: ${cityName}`;
                document.getElementById('countryName').innerText = `Country: ${countryName}`;
                document.getElementById('dateLine').innerText = `${dayOfWeek}, ${date}`;
                document.getElementById('temperatureLine').innerText = `Max / Min Temperature: ${temperatureMax} / ${temperatureMin}`;
                document.getElementById('currentTime').innerText = `Current Time: ${time}`;
                document.getElementById('weatherIcon').src = weatherIcon;
                document.getElementById('weatherIcon').alt = weatherDescription;
            })
            .catch(error => {
                console.error('Error fetching the weather data:', error);
                alert('Error fetching the weather data. Please try again');
            });
    }
});