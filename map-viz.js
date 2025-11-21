import { loadHealthData, getCountryCoordinates } from './data-loader.js';

// Global Development Map with Mapbox (Lab 7)
export async function createMap() {
  // Note: In production, you would use a real Mapbox token
  // For demo purposes, this creates a placeholder
  const mapContainer = document.getElementById('map');
  
  // Check if Mapbox is available
  if (typeof mapboxgl === 'undefined') {
    mapContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: var(--bg-secondary); color: var(--text-secondary); text-align: center; padding: 2rem;">
        <div>
          <h3>Map Visualization Placeholder</h3>
          <p>To enable the interactive map, add your Mapbox access token to map-viz.js</p>
          <p>The map would show country-level development indicators with color encoding</p>
          <p style="margin-top: 1rem; font-size: 0.9rem;">
            Sign up for a free token at <a href="https://mapbox.com" target="_blank">mapbox.com</a>
          </p>
        </div>
      </div>
    `;
    return;
  }
  
  // Initialize map (requires valid token)
  try {
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [20, 20],
      zoom: 1.5
    });
    
    // Load data
    const data = await loadHealthData(2020);
    
    // Add markers
    map.on('load', () => {
      data.forEach(country => {
        const coords = getCountryCoordinates(country.country);
        if (coords) {
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h4>${country.country}</h4>
              <p><strong>GDP per capita:</strong> $${country.gdpPerCapita.toLocaleString()}</p>
              <p><strong>Life expectancy:</strong> ${country.lifeExpectancy.toFixed(1)} years</p>
              <p><strong>Population:</strong> ${(country.population / 1000000).toFixed(1)}M</p>
            `);
          
          // Create marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.background = '#007bff';
          el.style.border = '2px solid white';
          el.style.cursor = 'pointer';
          
          new mapboxgl.Marker(el)
            .setLngLat([coords.lng, coords.lat])
            .setPopup(popup)
            .addTo(map);
        }
      });
    });
    
    // Indicator selector
    const indicatorSelect = document.getElementById('indicator-select');
    indicatorSelect.addEventListener('change', function() {
      // Update map based on selected indicator
      console.log('Selected indicator:', this.value);
      // In production: update marker colors/sizes based on indicator
    });
    
  } catch (error) {
    mapContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: var(--bg-secondary); color: var(--text-secondary); text-align: center; padding: 2rem;">
        <div>
          <h3>Map Visualization</h3>
          <p>Add a valid Mapbox token to enable the interactive map</p>
          <p style="margin-top: 1rem; font-size: 0.9rem;">
            The map will display development indicators across countries with interactive markers
          </p>
        </div>
      </div>
    `;
  }
}
