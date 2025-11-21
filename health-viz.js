import { loadHealthData, getAllHealthYears } from './data-loader.js';

// Health vs Wealth Scatter Plot (Lab 6)
export async function createHealthChart() {
  const svg = d3.select('#health-chart');
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // Create plot group
  const plot = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Initial data for 2020
  let currentYear = 2020;
  const data = await loadHealthData(currentYear);
  
  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.gdpPerCapita) * 1.1])
    .range([0, width])
    .nice();
  
  const yScale = d3.scaleLinear()
    .domain([30, 85])
    .range([height, 0])
    .nice();
  
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.population)])
    .range([5, 30]);
  
  const colorScale = d3.scaleOrdinal()
    .domain(['North America', 'Europe', 'East Asia', 'South Asia', 'Africa', 'Latin America'])
    .range(d3.schemeSet2);
  
  // Axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d => `$${d.toLocaleString()}`);
  
  const yAxis = d3.axisLeft(yScale);
  
  plot.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);
  
  plot.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);
  
  // Axis labels
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2 + margin.left)
    .attr('y', height + margin.top + 40)
    .attr('text-anchor', 'middle')
    .text('GDP Per Capita (USD)');
  
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(height / 2 + margin.top))
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .text('Life Expectancy (years)');
  
  // Tooltip
  const tooltip = d3.select('.tooltip');
  
  // Plot circles
  function updateChart(newData) {
    const circles = plot.selectAll('circle')
      .data(newData, d => d.country);
    
    circles.enter()
      .append('circle')
      .attr('cx', d => xScale(d.gdpPerCapita))
      .attr('cy', d => yScale(d.lifeExpectancy))
      .attr('r', 0)
      .attr('fill', d => colorScale(d.region))
      .attr('opacity', 0.7)
      .merge(circles)
      .on('mouseenter', function(event, d) {
        tooltip
          .classed('visible', true)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px')
          .html(`
            <h4>${d.country}</h4>
            <p><strong>Region:</strong> ${d.region}</p>
            <p><strong>GDP per capita:</strong> $${d.gdpPerCapita.toLocaleString()}</p>
            <p><strong>Life expectancy:</strong> ${d.lifeExpectancy.toFixed(1)} years</p>
            <p><strong>Population:</strong> ${(d.population / 1000000).toFixed(1)}M</p>
          `);
        
        d3.select(this)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseleave', function() {
        tooltip.classed('visible', false);
        d3.select(this)
          .attr('stroke', 'none');
      })
      .transition()
      .duration(800)
      .attr('cx', d => xScale(d.gdpPerCapita))
      .attr('cy', d => yScale(d.lifeExpectancy))
      .attr('r', d => sizeScale(d.population));
    
    circles.exit()
      .transition()
      .duration(500)
      .attr('r', 0)
      .remove();
  }
  
  updateChart(data);
  
  // Year slider functionality
  const yearSlider = document.getElementById('year-slider');
  const yearDisplay = document.getElementById('year-display');
  
  yearSlider.addEventListener('input', async function() {
    const year = parseInt(this.value);
    yearDisplay.textContent = year;
    const newData = await loadHealthData(year);
    
    // Update scales if needed
    xScale.domain([0, d3.max(newData, d => d.gdpPerCapita) * 1.1]).nice();
    plot.select('.x-axis')
      .transition()
      .duration(500)
      .call(xAxis);
    
    updateChart(newData);
  });
}
