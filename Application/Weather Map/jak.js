class WeatherApp {
    constructor(apiKey, mapContainerId, weatherContainerId, searchInputId, zoomInButtonId, zoomOutButtonId, searchButtonId) {
        this.apiKey = apiKey;
        this.weatherContainer = document.getElementById(weatherContainerId);
        this.searchInput = document.getElementById(searchInputId);
        this.zoomInButton = document.getElementById(zoomInButtonId);
        this.zoomOutButton = document.getElementById(zoomOutButtonId);
        this.searchButton = document.getElementById(searchButtonId);
        this.mapContainerId = mapContainerId;

        this.map = null;
        this.zoomLevel = 8;

        this.initMap();
        this.attachEventListeners();
    }

    // Initialize the map
    initMap() {
        const initialCoordinates = [13.41, 122.56];
        this.map = L.map(this.mapContainerId).setView(initialCoordinates, this.zoomLevel);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    // Fetch and display weather information
    fetchWeather() {
        const place = this.searchInput.value;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place},PH&appid=${this.apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => this.updateWeather(data))
            .catch(error => {
                console.error("Error fetching weather data:", error);
                this.weatherContainer.innerHTML = "Error fetching weather data. Please try again.";
            });
    }

    // Update the weather and map display
    updateWeather(data) {
        const temp = data.main.temp;
        const description = data.weather[0].description;
        const dangerLevel = this.getDangerLevel(temp);

        this.weatherContainer.innerHTML = `
            <p>Temperature: ${temp}°C</p>
            <p>Description: ${description}</p>
            <p>Danger Level: ${dangerLevel}</p>
        `;

        // Update map center
        const coordinates = [data.coord.lat, data.coord.lon];
        this.map.setView(coordinates, this.zoomLevel);
    }

    // Determine danger level based on temperature
    getDangerLevel(temp) {
        if (temp > 35) return 'High Danger';
        if (temp > 25) return 'Moderate Danger';
        return 'Low Danger';
    }

    // Attach event listeners for user interactions
    attachEventListeners() {
        this.zoomInButton.addEventListener('click', () => this.zoomIn());
        this.zoomOutButton.addEventListener('click', () => this.zoomOut());
        this.searchButton.addEventListener('click', () => this.fetchWeather());
    }

    // Zoom controls
    zoomIn() {
        this.zoomLevel++;
        this.map.setZoom(this.zoomLevel);
    }

    zoomOut() {
        this.zoomLevel--;
        this.map.setZoom(this.zoomLevel);
    }
}

// Initialize the WeatherApp
document.addEventListener("DOMContentLoaded", () => {
    const app = new WeatherApp(
        'a5712e740541248ce7883f0af8581be4', // API key
        'map',                             // Map container ID
        'weather',                         // Weather container ID
        'search',                          // Search input ID
        'zoomIn',                          // Zoom In button ID
        'zoomOut',                         // Zoom Out button ID
        'searchButton'                     // Search button ID
    );
});
