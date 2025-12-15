# Houston Weather Dashboard

A modern, feature-rich weather dashboard built for daily use. Displays real-time weather data, 7-day and 24-hour forecasts with unique temperature gradient visualization, smart clothing recommendations, and motivational content.

🔗 **Live Demo:** [anopenidea.github.io/dashboard](https://anopenidea.github.io/dashboard)

## ✨ Features

### 🌤️ Weather Intelligence
- Real-time Houston weather with dual °F/°C display
- 7-Day Forecast with city selection
- 24-Hour Forecast with city selection
- Multi-city support for forecasts (Houston, NYC, LA, Chicago, Phoenix, Denver, Seattle, Miami)
- UV index, air quality (AQI), sunrise/sunset times
- Precipitation probability tracking

### 🎨 Visual Innovation
- **Temperature gradient backgrounds** - Each forecast card features a unique red/blue split
- Red for hot temperatures, blue for cold
- At-a-glance temperature understanding without reading numbers
- Color intensity varies (hotter = more red, colder = more blue)
- Independent calculations for daily and hourly forecasts

### 👔 Smart Recommendations
- Weather-based clothing suggestions
- Contextual advice for different conditions
- UV protection reminders

### 💪 Daily Motivation
- Daily Reminder section
- Mood Lifter with positive affirmations
- Quote of the Day

## 🚀 Quick Start

**1. Fork this repository**

**2. Customize for your city** - Edit `script.js` line 47:
```javascript
latitude=29.7604&longitude=-95.3698  // Change to your coordinates
```

**3. Deploy to GitHub Pages** - Go to Settings → Pages → Select `main` branch

**4. Visit** `https://yourusername.github.io/dashboard`

## 📋 Deployment to GitHub Pages

### Option 1: Deploy to username.github.io

1. Create a new repository named `username.github.io` (replace `username` with your GitHub username)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```
3. Visit `https://username.github.io` (may take a few minutes)

### Option 2: Deploy as a project site

1. Create a new repository (any name)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Under "Source", select `main` branch and `/ (root)` folder
5. Click Save
6. Visit `https://username.github.io/repo-name`

## 🎨 Customization

- **Add cities** - Update dropdown options in `index.html`
- **Change colors** - Modify gradients and themes in `style.css`
- **Adjust forecasts** - Edit temperature gradient calculations in `script.js`
- **Personalize content** - Update reminders, affirmations, and clothing suggestions

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with custom gradients
- **JavaScript** - Dynamic weather data and interactions
- **Open-Meteo API** - Free weather data (no API key required)
- **Air Quality API** - US AQI data
- **GitHub Pages** - Free hosting

## 💡 Local Testing

Simply open `index.html` in your browser to preview locally.

## 📸 Screenshots

The dashboard features:
- Clean, modern interface with weather cards
- Temperature gradient visualization (red=hot, blue=cold)
- Responsive design for all devices
- Smooth animations and transitions

## 🤝 Contributing

Feel free to fork, customize, and submit pull requests. This is an open-source project built for the community!

## 📄 License

Free to use and modify for personal or commercial projects.
