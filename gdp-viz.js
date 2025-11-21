import { loadGDPData } from './data-loader.js';

// GDP Pie Chart Visualization (Lab 5)
export async function createGDPChart() {
  const data = await loadGDPData();
  const svg = d3.select('#gdp-chart');
  const legend = d3.select('#gdp-legend');
  
  // Color scale
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Arc generator
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(100);
  
  // Pie layout
  const pieGenerator = d3.pie()
    .value(d => d.gdp)
    .sort(null);
  
  const arcData = pieGenerator(data);
  
  // Create pie slices
  svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i))
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .on('click', function(event, d) {
      // Toggle selection
      const isSelected = d3.select(this).classed('selected');
      
      svg.selectAll('path').classed('selected', false);
      legend.selectAll('li').classed('selected', false);
      
      if (!isSelected) {
        d3.select(this).classed('selected', true);
        legend.selectAll('li')
          .filter((_, i) => i === d.index)
          .classed('selected', true);
        
        showGDPInfo(d.data);
      } else {
        hideGDPInfo();
      }
    });
  
  // Hover effects
  svg.selectAll('path')
    .on('mouseenter', function() {
      if (!d3.select(this).classed('selected')) {
        d3.select(this).style('opacity', 0.8);
      }
    })
    .on('mouseleave', function() {
      d3.select(this).style('opacity', 1);
    });
  
  // Create legend
  data.forEach((d, i) => {
    const li = legend.append('li')
      .attr('style', `--color: ${colors(i)}`)
      .on('click', function() {
        const path = svg.selectAll('path').nodes()[i];
        path.dispatchEvent(new Event('click'));
      });
    
    li.append('span')
      .attr('class', 'swatch')
      .style('background', colors(i));
    
    li.append('span')
      .html(`${d.region} <em>(${d.gdp}T)</em>`);
  });
}

function showGDPInfo(data) {
  const infoDiv = d3.select('#gdp-info');
  infoDiv.html(`
    <h4>${data.region}</h4>
    <p><strong>GDP:</strong> $${data.gdp} trillion</p>
    <p><strong>Population:</strong> ${data.population} million</p>
    <p><strong>GDP per capita:</strong> $${(data.gdp * 1000000 / data.population).toFixed(0)}</p>
  `);
}

function hideGDPInfo() {
  const infoDiv = d3.select('#gdp-info');
  infoDiv.html('<p>Click on a region to see detailed information.</p>');
}
