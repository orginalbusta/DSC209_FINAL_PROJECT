# Echoes of History

An Interactive Exploration of Human Development (1960-2020)

## Project Overview

**Echoes of History** is an interactive data story that chronicles 60 years of global development through World Bank indicators. The core question we explore is: **did the world become more equal in health or in wealth?**  
Using a coordinated set of visualizations, we show how poorer countries often caught up in **life expectancy** much faster than in **GDP per capita**, with special attention to contrasts between the “West” and the rest of the world, and to the development paths of India and China.

## ✨ Features

### Advanced Visualizations
1. **Animated Particle Background** – Dynamic particle network with connected nodes creating an immersive atmosphere.
2. **Scrollytelling Timeline (Journey Through Time)** – Scroll-driven line chart that now shows **regional GDP per capita** plus **two population‑weighted life expectancy lines** (West vs Rest), highlighting when health and wealth move together or diverge.
3. **Stream Graph** – Flowing stacked area chart showing how regional GDP shares evolve over 7 decades.
4. **Racing Bar Chart** – Play/pause animated bar chart of the **top 10 countries** with a metric switcher (Total GDP, Population, Life Expectancy) and a year slider.
5. **Choropleth World Map** – Mapbox‑powered country‑level map with an **indicator dropdown (GDP per capita vs Life Expectancy)**, an animated year slider, and stable, interpretable color scales and legends.
6. **Bubble Chart – Wealth, Health & Population** – Animated scatter plot of GDP per capita vs life expectancy with bubble size for population and a time slider/animation to show convergence in health vs persistent gaps in wealth.
7. **Radar Chart** – Time‑slider‑driven radar chart comparing multiple indicators (GDP per capita, life expectancy, population) for five countries (US, Germany, Brazil, Bangladesh, Thailand).
8. **Trajectory Visualization** – Connected scatter plot of GDP per capita vs life expectancy over time for a mix of European and Global South countries, showing different development paths.
9. **India & China Focus** – Dedicated trajectory view just for India and China, illustrating how large, early gains in life expectancy precede or accompany later surges in income.
10. **Global Gains Summary (West vs Rest)** – Paired bar chart comparing aggregate gains in **GDP per capita** and **life expectancy** from the 1960s to today for Western countries vs the rest of the world.

### Visual Design
- **Glitch Effect Hero** - Eye-catching animated title with digital glitch aesthetics
- **Gradient Design System** - Modern purple/violet gradients throughout (custom CSS variables)
- **Animated Statistics** - Counter animation showing key metrics (250+ countries, 60 years, 20 indicators)
- **Smooth Transitions** - Pulse, bounce, scroll, and shimmer animations
- **Modern Card Design** - Timeline steps with gradient borders and shadow effects
- **Dark Mode Toggle** - Persistent theme switching with localStorage

### Technologies
- **HTML5** - Semantic structure with canvas elements
- **CSS3** - Custom properties, gradients, keyframe animations, responsive design
- **JavaScript ES6+** - Modules, async/await, D3.js v7.9.0, Scrollama.js
- **D3.js** - Advanced visualizations with smooth transitions
- **Mapbox GL JS** - Interactive geospatial mapping
- **Scrollama.js** - Scroll-driven storytelling

## Project Structure

```
DSC209_FINAL_PROJECT/
├── index.html           # Main HTML with particle canvas and hero sections
├── style.css            # Modern CSS with gradients and animations
├── main-new.js          # Particle animation, counters, visualizations, and all D3 charts
├── data-loader.js       # Complete 1960-2020 time series data
├── gdp-viz.js           # GDP visualization module
├── health-viz.js        # Health vs wealth visualization
├── map-viz.js           # Mapbox choropleth integration
└── README.md            # This file
```

## 🚀 Quick Start

### View Live Demo
Live demo:  
`https://orginalbusta.github.io/DSC209_FINAL_PROJECT/`

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/orginalbusta/DSC209_FINAL_PROJECT.git
   cd DSC209_FINAL_PROJECT
   ```

2. **Serve locally**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use VS Code Live Server extension
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

4. **Optional: Add Mapbox Token for Map**
   - Sign up at [mapbox.com](https://mapbox.com)
   - Get your access token
   - Open `map-viz.js` and add your token

## 🎨 Implementation Highlights

### Particle Animation System
- Canvas-based particle network with physics simulation
- Dynamic connections between nearby particles
- Responsive to window resizing
- Subtle opacity for atmospheric effect

### Animated Statistics Counter
- Smooth easing function (cubic ease-out)
- Counts from 0 to target over 2 seconds
- Applied to hero section metrics

### Stream Graph
- D3.js stack layout with wiggle offset
- Smooth catmull-rom curves
- Interactive hover effects with stroke highlighting
- Color-coded by region with legend

### Racing Bar Chart
- Play/pause functionality for time animation
- Smooth bar transitions over 800ms
- Top 10 countries racing through decades
- Year label with prominent display

### Scrollytelling Timeline
- 7 decades of historical context (1960–2020).
- Animated multi-line chart showing **regional GDP per capita**.
- Overlaid life expectancy lines for **West vs Rest** using population‑weighted averages.
- Scroll-triggered transitions tied to narrative text.

### Modern CSS Design
- CSS custom properties for consistent theming
- Gradient system (--gradient-1 through --gradient-4)
- Keyframe animations: glitch, pulse, bounce, scroll, shimmer
- Responsive typography with clamp()
- Modern card design with gradient borders

## 📊 Data Source

**World Bank Development Indicators (1960-2020)**

The visualization uses comprehensive time-series data covering:
- **250+ countries** across 7 regions
- **20+ indicators** including GDP, life expectancy, population
- **7 decades** of data (1960, 1970, 1980, 1990, 2000, 2010, 2020)
- Regional aggregations for North America, Europe, East Asia, South Asia, Africa, Latin America, Middle East

Full dataset: [World Bank Data by Indicators](https://github.com/light-and-salt/World-Bank-Data-by-Indicators)

## 🎯 Key Metrics

- **250+ Countries**: Comprehensive global coverage
- **60 Years**: Complete timeline from 1960 to 2020
- **20 Indicators**: Multi-dimensional development metrics
- **7 Regions**: Regional aggregations and comparisons

## 👥 Team Members

- Camila Paik - capaik@ucsd.edu
- Gabrielle Despaigne - gdespaigne@ucsd.edu
- Harsh Arya - harya@ucsd.edu
- Raghav Vasappanavara - rvasappanavara@ucsd.edu

**Course**: DSC 209R - Data Visualization, Fall 2025, UC San Diego

## 📝 License

This project is for educational purposes as part of DSC 209R coursework.

## 🚧 Notes & Future Enhancements

- The map requires a valid Mapbox access token (see `main-new.js`) to render the full choropleth.
- We may add richer tooltip interactivity, additional indicators, and more responsive layout tuning in future iterations.

## 🙏 Acknowledgments

- D3.js community for powerful visualization library
- Mapbox for geospatial mapping platform
- World Bank for comprehensive development data
- Scrollama.js for scroll-driven storytelling framework
