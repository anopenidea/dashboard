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
            // Added hourly data for 24-hour forecast
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.7604&longitude=-95.3698&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,uv_index_max,sunrise,sunset&temperature_unit=fahrenheit&timezone=America/Chicago&forecast_days=7');
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
                    highLowElement.textContent = `${highF}°F / ${lowF}°F`;
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
            
            // Display daily and hourly forecasts
            if (data.daily) {
                displayDailyForecast(data.daily);
            }
            if (data.hourly) {
                displayHourlyForecast(data.hourly);
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
    
    // Display daily forecast
    function displayDailyForecast(dailyData) {
        const dailyContainer = document.getElementById('daily-forecast');
        if (!dailyContainer || !dailyData) return;
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let html = '';
        
        // Find min and max temps across all 7 days for color scaling
        const allHighs = dailyData.temperature_2m_max.slice(0, 7);
        const minTemp = Math.min(...allHighs);
        const maxTemp = Math.max(...allHighs);
        const tempRange = maxTemp - minTemp;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(dailyData.time[i]);
            const dayName = i === 0 ? 'Today' : days[date.getDay()];
            const highF = Math.round(dailyData.temperature_2m_max[i]);
            const lowF = Math.round(dailyData.temperature_2m_min[i]);
            const highC = Math.round((highF - 32) * 5/9);
            const lowC = Math.round((lowF - 32) * 5/9);
            const weatherCode = dailyData.weather_code[i];
            const precipProb = dailyData.precipitation_probability_max[i] || 0;
            const emoji = getWeatherEmoji(weatherCode);
            
            // Calculate split position and color intensity based on average temp
            const avgTemp = (highF + lowF) / 2;
            const tempRatio = tempRange > 0 ? (avgTemp - minTemp) / tempRange : 0.5;
            
            // Line position: hot days = 10% (line high), cold days = 90% (line low)
            const splitPercent = Math.round(90 - (tempRatio * 80));
            
            // Color intensity: hot days = more red less blue, cold days = more blue less red
            const redIntensity = Math.round(200 + (tempRatio * 55)); // 200-255
            const redAlpha = 0.12 + (tempRatio * 0.08); // 0.12-0.2
            const blueIntensity = Math.round(200 + ((1 - tempRatio) * 55)); // 200-255
            const blueAlpha = 0.12 + ((1 - tempRatio) * 0.08); // 0.12-0.2
            
            const topColor = `rgba(${redIntensity}, 150, 150, ${redAlpha})`;
            const bottomColor = `rgba(150, 180, ${blueIntensity}, ${blueAlpha})`;
            
            const gradient = `linear-gradient(to bottom, ${topColor} ${splitPercent}%, ${bottomColor} ${splitPercent}%)`;
            
            html += `
                <div class="daily-card" style="background: ${gradient};">
                    <h3>${dayName}</h3>
                    <div class="weather-icon">${emoji}</div>
                    <div class="temp-range">
                        <span class="high">${highF}°F</span>
                        <span class="low">${lowF}°F</span>
                    </div>
                    <div class="temp-range-celsius">
                        <span class="high">${highC}°C</span>
                        <span class="low">${lowC}°C</span>
                    </div>
                    <div class="precip">💧 ${precipProb}%</div>
                </div>
            `;
        }
        
        dailyContainer.innerHTML = html;
    }
    
    // Display hourly forecast
    function displayHourlyForecast(hourlyData) {
        const hourlyContainer = document.getElementById('hourly-forecast');
        if (!hourlyContainer || !hourlyData) return;
        
        let html = '';
        const now = new Date();
        
        // Find the current hour index in the API data
        let startIndex = 0;
        for (let i = 0; i < hourlyData.time.length; i++) {
            const time = new Date(hourlyData.time[i]);
            if (time >= now) {
                startIndex = i;
                break;
            }
        }
        
        // Collect temps for next 24 hours to find min/max for color scaling
        const hourlyTemps = [];
        for (let i = startIndex; i < startIndex + 24 && i < hourlyData.time.length; i++) {
            hourlyTemps.push(Math.round(hourlyData.temperature_2m[i]));
        }
        const minTemp = Math.min(...hourlyTemps);
        const maxTemp = Math.max(...hourlyTemps);
        const tempRange = maxTemp - minTemp;
        
        // Show next 24 hours starting from current hour
        for (let i = startIndex; i < startIndex + 24 && i < hourlyData.time.length; i++) {
            const time = new Date(hourlyData.time[i]);
            const hour = time.getHours();
            const hourLabel = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
            const tempF = Math.round(hourlyData.temperature_2m[i]);
            const tempC = Math.round((tempF - 32) * 5/9);
            const weatherCode = hourlyData.weather_code[i];
            const precipProb = hourlyData.precipitation_probability[i] || 0;
            const emoji = getWeatherEmoji(weatherCode);
            
            // Calculate split position and color intensity based on temp
            const tempRatio = tempRange > 0 ? (tempF - minTemp) / tempRange : 0.5;
            
            // Line position: hot hours = 10% (line high), cold hours = 90% (line low)
            const splitPercent = Math.round(90 - (tempRatio * 80));
            
            // Color intensity: hot hours = more red less blue, cold hours = more blue less red
            const redIntensity = Math.round(200 + (tempRatio * 55)); // 200-255
            const redAlpha = 0.12 + (tempRatio * 0.08); // 0.12-0.2
            const blueIntensity = Math.round(200 + ((1 - tempRatio) * 55)); // 200-255
            const blueAlpha = 0.12 + ((1 - tempRatio) * 0.08); // 0.12-0.2
            
            const topColor = `rgba(${redIntensity}, 150, 150, ${redAlpha})`;
            const bottomColor = `rgba(150, 180, ${blueIntensity}, ${blueAlpha})`;
            
            const gradient = `linear-gradient(to bottom, ${topColor} ${splitPercent}%, ${bottomColor} ${splitPercent}%)`;
            
            html += `
                <div class="hourly-card" style="background: ${gradient};">
                    <div class="hour">${hourLabel}</div>
                    <div class="weather-icon">${emoji}</div>
                    <div class="temp">${tempF}°F</div>
                    <div class="temp-celsius">${tempC}°C</div>
                    <div class="precip">💧 ${precipProb}%</div>
                </div>
            `;
        }
        
        hourlyContainer.innerHTML = html;
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
    
    // Quote of the Day - US Authors Only
    const quotes = [
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
        { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
        { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
        { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
        { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "It always seems impossible until it's done.", author: "Thomas Edison" },
        { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
        { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
        { text: "The only true wisdom is in knowing you know nothing.", author: "Richard Feynman" }
    ];
    
    let currentQuoteIndex = 0;
    
    function displayQuote(index = null) {
        // If no index provided, use date as seed for consistent quote per day
        if (index === null) {
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            currentQuoteIndex = dayOfYear % quotes.length;
        } else {
            currentQuoteIndex = index % quotes.length;
        }
        
        const quote = quotes[currentQuoteIndex];
        
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
    
    // Next quote button
    const nextQuoteBtn = document.getElementById('next-quote-btn');
    if (nextQuoteBtn) {
        nextQuoteBtn.addEventListener('click', function() {
            displayQuote(currentQuoteIndex + 1);
        });
    }
    
    // Daily Reminders
    const reminders = [
        "💧 Drink a glass of water",
        "🚶 Take a 10-minute walk today",
        "📱 Text someone you care about",
        "🧘 Take 3 deep breaths",
        "😊 Smile at a stranger",
        "📖 Read for 15 minutes",
        "🥗 Eat something green",
        "🌅 Step outside for fresh air",
        "🙏 Write down one thing you're grateful for",
        "💪 Stretch for 5 minutes",
        "👁️ Rest your eyes from screens",
        "🎵 Listen to your favorite song",
        "🧹 Tidy one small area",
        "📝 Write down tomorrow's top 3 tasks",
        "😴 Go to bed 30 minutes earlier tonight",
        "☕ Take a mindful coffee break",
        "🌳 Notice something beautiful in nature",
        "📞 Call a friend or family member",
        "🧠 Learn one new thing today",
        "❤️ Do something kind for someone"
    ];
    
    let currentReminderIndex = Math.floor(Math.random() * reminders.length);
    
    function displayReminder() {
        const reminder = reminders[currentReminderIndex];
        const reminderText = document.getElementById('reminder-text');
        
        if (reminderText) {
            reminderText.textContent = reminder;
        }
    }
    
    // Display reminder on load
    displayReminder();
    
    // Next reminder button
    const nextReminderBtn = document.getElementById('next-reminder-btn');
    if (nextReminderBtn) {
        nextReminderBtn.addEventListener('click', function() {
            currentReminderIndex = Math.floor(Math.random() * reminders.length);
            displayReminder();
        });
    }
    
    // Mood Lifter Affirmations
    const affirmations = [
        "You're doing better than you think",
        "Your progress matters, even when it's small",
        "You're capable of amazing things",
        "Someone is grateful you exist",
        "You're making a difference",
        "You deserve good things",
        "Your best is always enough",
        "You're stronger than yesterday",
        "You bring something special to this world",
        "It's okay to take things one step at a time",
        "You're growing every single day",
        "Your efforts are noticed and appreciated",
        "You have so much to be proud of",
        "You're exactly where you need to be",
        "You inspire others more than you know",
        "Your kindness makes the world better",
        "You're worthy of love and respect",
        "You're doing an amazing job",
        "You have the power to create positive change",
        "You're braver than you believe"
    ];
    
    let currentAffirmationIndex = Math.floor(Math.random() * affirmations.length);
    
    function displayAffirmation() {
        const affirmation = affirmations[currentAffirmationIndex];
        const affirmationText = document.getElementById('affirmation-text');
        
        if (affirmationText) {
            affirmationText.textContent = affirmation;
        }
    }
    
    // Display affirmation on load
    displayAffirmation();
    
    // Next affirmation button
    const nextAffirmationBtn = document.getElementById('next-affirmation-btn');
    if (nextAffirmationBtn) {
        nextAffirmationBtn.addEventListener('click', function() {
            currentAffirmationIndex = Math.floor(Math.random() * affirmations.length);
            displayAffirmation();
        });
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
