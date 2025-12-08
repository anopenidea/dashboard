// Add interactivity to your dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Animate stat cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
    
    // Update date and time
    function updateDateTime() {
        const now = new Date();
        
        // Update date
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
        
        // Update time
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
        }
    }
    
    // Update every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Fetch Houston weather
    async function fetchWeather() {
        try {
            // Using Open-Meteo API (free, no API key required)
            // Houston coordinates: 29.7604, -95.3698
            // Added daily data for high/low temps and UV index
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.7604&longitude=-95.3698&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=fahrenheit&timezone=America/Chicago');
            const data = await response.json();
            
            if (data.current) {
                const tempF = Math.round(data.current.temperature_2m);
                const tempC = Math.round((tempF - 32) * 5 / 9);
                const humidity = data.current.relative_humidity_2m;
                const weatherCode = data.current.weather_code;
                
                // Update temperature
                const tempElement = document.getElementById('weather-temp');
                if (tempElement) {
                    tempElement.textContent = `${tempF}°F`;
                }
                
                // Update description with Celsius
                const descElement = document.getElementById('weather-desc');
                if (descElement) {
                    descElement.textContent = `${tempC}°C`;
                }
                
                // Update humidity
                const humidityElement = document.getElementById('weather-humidity');
                if (humidityElement) {
                    humidityElement.textContent = `Humidity: ${humidity}%`;
                }
                
                // Update weather icon based on code
                const iconElement = document.getElementById('weather-icon');
                if (iconElement) {
                    iconElement.textContent = getWeatherEmoji(weatherCode);
                }
            }
            
            // Update daily high/low and UV index
            if (data.daily) {
                const highF = Math.round(data.daily.temperature_2m_max[0]);
                const lowF = Math.round(data.daily.temperature_2m_min[0]);
                const highC = Math.round((highF - 32) * 5 / 9);
                const lowC = Math.round((lowF - 32) * 5 / 9);
                const uvIndex = data.daily.uv_index_max[0];
                
                // Update high/low
                const highLowElement = document.getElementById('temp-high-low');
                if (highLowElement) {
                    highLowElement.textContent = `${highF}° / ${lowF}°`;
                }
                
                const highLowCelsiusElement = document.getElementById('temp-high-low-celsius');
                if (highLowCelsiusElement) {
                    highLowCelsiusElement.textContent = `${highC}°C / ${lowC}°C`;
                }
                
                // Update UV index
                const uvElement = document.getElementById('uv-index');
                if (uvElement) {
                    uvElement.textContent = Math.round(uvIndex);
                }
                
                const uvLevelElement = document.getElementById('uv-level');
                if (uvLevelElement) {
                    uvLevelElement.textContent = getUVLevel(uvIndex);
                }
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            const tempElement = document.getElementById('weather-temp');
            if (tempElement) {
                tempElement.textContent = 'N/A';
            }
            const descElement = document.getElementById('weather-desc');
            if (descElement) {
                descElement.textContent = 'Unable to load';
            }
        }
    }
    
    // Get UV level description
    function getUVLevel(uv) {
        if (uv < 3) return 'Low';
        if (uv < 6) return 'Moderate';
        if (uv < 8) return 'High';
        if (uv < 11) return 'Very High';
        return 'Extreme';
    }
    
    // Convert weather code to emoji
    function getWeatherEmoji(code) {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 48) return '🌫️';
        if (code <= 67) return '🌧️';
        if (code <= 77) return '🌨️';
        if (code <= 82) return '🌦️';
        if (code <= 86) return '❄️';
        if (code <= 99) return '⛈️';
        return '🌤️';
    }
    
    // Fetch weather on load
    fetchWeather();
    
    // Update weather every 10 minutes
    setInterval(fetchWeather, 600000);
    
    // Fetch air quality
    async function fetchAirQuality() {
        try {
            // Houston coordinates: 29.7604, -95.3698
            const response = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=29.7604&longitude=-95.3698&current=us_aqi,pm2_5,pm10&timezone=America/Chicago');
            const data = await response.json();
            
            if (data.current) {
                const aqi = Math.round(data.current.us_aqi);
                
                // Update AQI value
                const aqiElement = document.getElementById('aqi-value');
                if (aqiElement) {
                    aqiElement.textContent = aqi;
                }
                
                // Update AQI level description
                const aqiLevelElement = document.getElementById('aqi-level');
                if (aqiLevelElement) {
                    aqiLevelElement.textContent = getAQILevel(aqi);
                }
            }
        } catch (error) {
            console.error('Error fetching air quality:', error);
            const aqiElement = document.getElementById('aqi-value');
            if (aqiElement) {
                aqiElement.textContent = 'N/A';
            }
            const aqiLevelElement = document.getElementById('aqi-level');
            if (aqiLevelElement) {
                aqiLevelElement.textContent = 'Unable to load';
            }
        }
    }
    
    // Get AQI level description
    function getAQILevel(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }
    
    // Fetch air quality on load
    fetchAirQuality();
    
    // Update air quality every 30 minutes
    setInterval(fetchAirQuality, 1800000);
    
    console.log('Dashboard loaded successfully!');
});
