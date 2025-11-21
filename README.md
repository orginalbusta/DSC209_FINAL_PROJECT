# Echoes of History

An Interactive Exploration of Human Development (1960-2020)

## Project Overview

This interactive visualization project explores 60 years of global development through the lens of World Bank data. The project showcases the application of modern web development and data visualization techniques learned in DSC 106 labs.

## Features

### Visualizations
1. **GDP Distribution Pie Chart** - Interactive regional GDP comparison with clickable slices
2. **Life Expectancy vs GDP Scatter Plot** - Temporal exploration with year slider and tooltips
3. **Global Development Map** - Mapbox-powered geospatial visualization (requires token)
4. **Scrollytelling Timeline** - Narrative journey through decades of development

### Technologies Used
- **HTML5** - Semantic markup and structure (Lab 1)
- **CSS3** - Flexbox, Grid, custom properties, responsive design (Lab 2)
- **JavaScript ES6+** - DOM manipulation, modules, async/await (Labs 3-4)
- **D3.js** - Data-driven visualizations (Labs 5-6)
- **Mapbox GL JS** - Interactive mapping (Lab 7)
- **Scrollama.js** - Scrollytelling (Lab 8)

## Project Structure

```
dsc209_final_project/
├── index.html           # Main HTML structure
├── style.css            # Styling with CSS variables
├── main.js              # Main JavaScript orchestration
├── data-loader.js       # Data loading module
├── gdp-viz.js           # GDP pie chart
├── health-viz.js        # Health scatter plot
├── map-viz.js           # Mapbox integration
└── README.md            # This file
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/rvasappa-ucsd/dsc209_final_project.git
   cd dsc209_final_project
   ```

2. **Optional: Add Mapbox Token**
   - Sign up at [mapbox.com](https://mapbox.com) for a free account
   - Get your access token
   - Open `map-viz.js` and replace `YOUR_MAPBOX_TOKEN_HERE` with your token

3. **Serve locally**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use VS Code Live Server extension
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000`

## Features by Lab

### Lab 1: Web Platform
- Semantic HTML5 structure
- Proper document organization
- Accessible markup

### Lab 2: CSS Styling
- CSS Grid and Flexbox layouts
- Custom properties for theming
- Responsive design
- Modern color systems

### Lab 3: JavaScript Basics
- DOM manipulation
- Event listeners
- Dark mode toggle with localStorage
- Smooth scrolling navigation

### Lab 4: Advanced JavaScript
- ES6 modules
- Async/await patterns
- Data loading and management

### Lab 5: Categorical Data
- D3.js pie chart
- Interactive selection
- Color scales
- Legend generation

### Lab 6: Quantitative Data
- Scatter plot with axes
- D3 scales and transitions
- Tooltips
- Interactive slider

### Lab 7: Geospatial Data
- Mapbox integration
- Interactive markers
- Country-level data
- Popup information

### Lab 8: Animation
- Scrollama.js integration
- Scroll-driven storytelling
- Smooth transitions
- Progressive disclosure

## Data Source

Sample data based on World Bank Development Indicators (1960-2020):
- GDP data by region
- Life expectancy and GDP per capita by country
- Population statistics
- Regional comparisons

Full dataset: [World Bank Data by Indicators](https://github.com/light-and-salt/World-Bank-Data-by-Indicators)

## Team Members

- Camila Paik - capaik@ucsd.edu
- Gabrielle Despaigne - gdespaigne@ucsd.edu
- Harsh Arya - harya@ucsd.edu
- Raghav Vasappanavara - rvasappanavara@ucsd.edu

## Course Information

**DSC 209R - Data Visualization**  
Fall 2025  
UC San Diego

## License

This project is for educational purposes as part of DSC 209R coursework.

## Acknowledgments

- Course staff and instructors
- D3.js community
- Mapbox for mapping platform
- World Bank for data
