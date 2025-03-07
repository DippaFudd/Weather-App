// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the DOM elements
    const cityForm = document.getElementById('city-form');
    const cityInput = document.getElementById('city-input');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const historyList = document.getElementById('history-list');

    // Add event listener to the form to handle city search
    cityForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        const city = cityInput.value.trim(); // Get the city name from the input
        if (city) {
            fetchWeather(city); // Fetch weather data for the city
            addToHistory(city); // Add the city to the search history
            cityInput.value = ''; // Clear the input field
        }
    });

    // Function to fetch current weather data for a city
    function fetchWeather(city) {
        const apiKey = 'd285dd30267b8fab79635fb91077a309';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`; // Change units to imperial

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data); // Display the current weather data
                fetchForecast(data.coord.lat, data.coord.lon); // Fetch the forecast data
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    // Function to fetch 5-day forecast data for a city
    function fetchForecast(lat, lon) {
        const apiKey = 'd285dd30267b8fab79635fb91077a309';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; // Change units to imperial

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayForecast(data)) // Display the forecast data
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    // Function to display current weather data
    function displayCurrentWeather(data) {
        const date = new Date();
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        currentWeather.innerHTML = `
            <h2>Current Weather in ${data.name} (${date.toLocaleDateString()})</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp}°F</p> <!-- Change unit to Fahrenheit -->
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
        currentWeather.style.display = 'block'; // Show the current weather section
    }

    // Function to display 5-day forecast data
    function displayForecast(data) {
        forecast.innerHTML = '<h2>5-Day Forecast</h2>';
        const forecastCards = document.createElement('div');
        forecastCards.id = 'forecast-cards';

        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            if (date.getHours() === 12) { // Display forecast only for midday data
                const card = document.createElement('div');
                card.className = 'forecast-card';
                const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
                card.innerHTML = `
                    <p>${date.toLocaleDateString()}</p>
                    <img src="${iconUrl}" alt="${item.weather[0].description}">
                    <p>Temp: ${item.main.temp}°F</p> <!-- Change unit to Fahrenheit -->
                    <p>Wind: ${item.wind.speed} m/s</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                `;
                forecastCards.appendChild(card);
            }
        });

        forecast.appendChild(forecastCards);
    }

    // Function to add a city to the search history
    function addToHistory(city) {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', function() {
            fetchWeather(city); // Fetch weather data when the history item is clicked
        });
        historyList.appendChild(listItem);
    }
});