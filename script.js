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
            // Added daily data for high/low temps, UV index, and sunrise/sunset
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.7604&longitude=-95.3698&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&temperature_unit=fahrenheit&timezone=America/Chicago');
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
                
                // Store weather code globally for clothing suggestions
                window.currentWeatherCode = weatherCode;
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
                
                // Update sunrise/sunset
                if (data.daily.sunrise && data.daily.sunset) {
                    const sunrise = new Date(data.daily.sunrise[0]);
                    const sunset = new Date(data.daily.sunset[0]);
                    
                    const sunriseElement = document.getElementById('sunrise-time');
                    if (sunriseElement) {
                        sunriseElement.textContent = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    }
                    
                    const sunsetElement = document.getElementById('sunset-time');
                    if (sunsetElement) {
                        sunsetElement.textContent = sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    }
                }
            }
            
            // Generate clothing suggestions after all data is loaded
            setTimeout(generateClothingSuggestions, 500);
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
        
        // Generate clothing suggestions after air quality data is loaded
        setTimeout(generateClothingSuggestions, 500);
    }
    
    // Fetch air quality on load
    fetchAirQuality();
    
    // Update air quality every 30 minutes
    setInterval(fetchAirQuality, 1800000);
    
    // Quote of the Day
    const quotes = [
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.", author: "Roy T. Bennett" },
        { text: "I learned that courage was not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Dream big and dare to fail.", author: "Norman Vaughan" }
    ];
    
    function displayQuote() {
        // Use date as seed for consistent quote per day
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % quotes.length;
        const quote = quotes[quoteIndex];
        
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        if (quoteText) {
            quoteText.textContent = `"${quote.text}"`;
        }
        if (quoteAuthor) {
            quoteAuthor.textContent = `— ${quote.author}`;
        }
    }
    
    // Display quote on load
    displayQuote();
    
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
    
    // Clothing recommendations configuration
    const clothingRules = {
        // Temperature-based clothing (in Fahrenheit)
        temperature: [
            { max: 40, items: ['Heavy coat', 'Long pants', 'Scarf and gloves'] },
            { max: 55, items: ['Jacket or sweater', 'Long pants'] },
            { max: 70, items: ['Long sleeves', 'Light pants or jeans'] },
            { max: 85, items: ['Short sleeves', 'Shorts or light pants'] },
            { max: 999, items: ['Tank top or light shirt', 'Shorts'] }
        ],
        // UV index recommendations
        uvIndex: [
            { min: 0, max: 2, items: [] },
            { min: 3, max: 5, items: ['Sunglasses'] },
            { min: 6, max: 7, items: ['Sunglasses', 'Sunscreen'] },
            { min: 8, max: 10, items: ['Sunglasses', 'Sunscreen', 'Hat'] },
            { min: 11, max: 99, items: ['Sunglasses', 'Sunscreen', 'Hat', 'Seek shade'] }
        ],
        // Air quality recommendations
        airQuality: [
            { max: 50, items: [] },
            { max: 100, items: [] },
            { max: 150, items: ['Mask (if sensitive)'] },
            { max: 200, items: ['Mask recommended'] },
            { max: 999, items: ['Mask strongly recommended', 'Limit outdoor time'] }
        ],
        // Weather condition recommendations (by weather code)
        weatherConditions: {
            rain: { codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], items: ['Umbrella', 'Rain jacket'] },
            snow: { codes: [71, 73, 75, 77, 85, 86], items: ['Umbrella', 'Waterproof boots', 'Warm coat'] },
            thunderstorm: { codes: [95, 96, 99], items: ['Umbrella', 'Rain jacket', 'Stay indoors if possible'] }
        }
    };
    
    // Generate clothing suggestions
    function generateClothingSuggestions() {
        const suggestions = [];
        
        // Get current data
        const tempF = parseFloat(document.getElementById('weather-temp')?.textContent) || 70;
        const uvIndex = parseFloat(document.getElementById('uv-index')?.textContent) || 0;
        const aqi = parseFloat(document.getElementById('aqi-value')?.textContent) || 50;
        const weatherCode = window.currentWeatherCode || 0;
        
        // Temperature-based clothing
        for (const rule of clothingRules.temperature) {
            if (tempF <= rule.max) {
                suggestions.push(...rule.items);
                break;
            }
        }
        
        // UV protection
        for (const rule of clothingRules.uvIndex) {
            if (uvIndex >= rule.min && uvIndex <= rule.max) {
                suggestions.push(...rule.items);
                break;
            }
        }
        
        // Air quality protection
        for (const rule of clothingRules.airQuality) {
            if (aqi <= rule.max) {
                suggestions.push(...rule.items);
                break;
            }
        }
        
        // Weather-specific items
        for (const [condition, data] of Object.entries(clothingRules.weatherConditions)) {
            if (data.codes.includes(weatherCode)) {
                suggestions.push(...data.items);
            }
        }
        
        // Display suggestions
        const container = document.getElementById('clothing-suggestions');
        if (container && suggestions.length > 0) {
            container.innerHTML = '<ul class="clothing-list">' + 
                suggestions.map(item => `<li>✓ ${item}</li>`).join('') + 
                '</ul>';
        } else if (container) {
            container.innerHTML = '<p>Perfect weather! Wear whatever feels comfortable.</p>';
        }
    }
    
    console.log('Dashboard loaded successfully!');
});
