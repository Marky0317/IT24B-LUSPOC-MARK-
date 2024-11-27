const apiKey = 'a5712e740541248ce7883f0af8581be4';
        const weatherContainer = document.getElementById('weather');
        const searchInput = document.getElementById('search');
        const zoomInButton = document.getElementById('zoomIn');
        const zoomOutButton = document.getElementById('zoomOut');
        let map;
        let zoomLevel = 8;

        // Initialize the map
        function initMap() {
            const initialCoordinates = [13.41, 122.56];
            map = L.map('map').setView(initialCoordinates, zoomLevel);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }

        // Fetch and display weather information
        function searchWeather() {
            const place = searchInput.value;
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place},PH&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const temp = data.main.temp;
                    const description = data.weather[0].description;
                    const dangerLevel = getDangerLevel(temp);
                    weatherContainer.innerHTML = `Temperature: ${temp}°C<br>Description: ${description}<br>Danger Level: ${dangerLevel}`;

                    // Update map center
                    const coordinates = [data.coord.lat, data.coord.lon];
                    map.setView(coordinates, zoomLevel);
                });
        }

        // Determine danger level based on temperature
        function getDangerLevel(temp) {
            if (temp > 35) return 'High Danger';
            if (temp > 25) return 'Moderate Danger';
            return 'Low Danger';
        }

        // Zoom controls
        zoomInButton.addEventListener('click', () => {
            zoomLevel++;
            map.setZoom(zoomLevel);
        });

        zoomOutButton.addEventListener('click', () => {
            zoomLevel--;
            map.setZoom(zoomLevel);
        });

        // Attach event listener to the search button
        document.getElementById('searchButton').addEventListener('click', searchWeather);

        // Initialize the map
        initMap();