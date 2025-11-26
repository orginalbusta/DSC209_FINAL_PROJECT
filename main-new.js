// Main JavaScript - Fixed version with working buttons and clean storytelling
// All data comes from data-loader.js loaded via script tag

// ===================================
// Animated Background Particles
// ===================================
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
    
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.globalAlpha = 1 - dist / 100;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===================================
// Animated Statistics Counter
// ===================================
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const duration = 2000;
    const start = Date.now();
    
    function update() {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      stat.textContent = current + (target > 100 ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    update();
  });
}

// ===================================
// Theme Toggle (Default: Dark)
// ===================================
function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.icon');

  // Default to dark mode, allow switching to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.textContent = '🌙';
  } else {
    // Dark mode by default
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeIcon.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ===================================
// Smooth Scrolling
// ===================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===================================
// Scrollytelling with Scrollama
// ===================================
function initScrollytelling() {
  if (typeof scrollama === 'undefined') {
    console.warn('Scrollama not loaded yet');
    return;
  }

  const scroller = scrollama();
  const steps = document.querySelectorAll('.step');
  
  if (steps.length === 0) {
    console.warn('No steps found for scrollytelling');
    return;
  }

  scroller
    .setup({
      step: '.step',
      offset: 0.6,
      debug: false
    })
    .onStepEnter(response => {
      const { element, index } = response;
      
      // Remove active from all steps
      document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('is-active');
      });
      
      // Add active to current step
      element.classList.add('is-active');
      
      // Update year display
      const year = element.dataset.step;
      const yearDisplay = document.getElementById('timeline-year-display');
      if (yearDisplay) {
        yearDisplay.textContent = year;
      }
      
      // Update visualization
      updateTimelineViz(year);
    });
  
  window.addEventListener('resize', () => {
    scroller.resize();
  });
}

function updateTimelineViz(year) {
  // Access data from global scope (loaded by data-loader.js)
  if (typeof regionalGDPData === 'undefined' || typeof healthData === 'undefined') {
    console.warn('regionalGDPData or healthData not loaded');
    return;
  }

  const svg = d3.select('#timeline-viz');
  svg.selectAll('*').remove(); // Clear previous
  
  const margin = { top: 50, right: 100, bottom: 50, left: 70 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const years = Object.keys(regionalGDPData).map(Number).sort((a, b) => a - b);
  const targetYear = parseInt(year);
  let currentYearIndex = years.indexOf(targetYear);
  if (currentYearIndex === -1) {
    currentYearIndex = years.length - 1;
  }
  const dataUpToYear = years.slice(0, currentYearIndex + 1);
  
  const regions = regionalGDPData[years[0]].map(d => d.region);
  
  // Prepare line data for regional GDP per capita (wealth)
  const lineData = regions.map(region => {
    const color = regionalGDPData[years[0]].find(d => d.region === region).color;
    const values = dataUpToYear.map(y => {
      const reg = regionalGDPData[y].find(d => d.region === region);
      if (!reg || !reg.population) return null;
      // gdp in trillions, population in millions → per-capita in USD
      const gdpPerCapita = (reg.gdp / reg.population) * 1e6;
      return { year: y, gdpPerCapita };
    }).filter(d => d !== null);
    return { region, values, color };
  });
  
  // Population-weighted life expectancy over time (health)
  // Split into "Western" (North America + Europe) vs "Rest of World"
  const westernRegions = new Set(['North America', 'Europe']);

  const lifeSeriesWest = dataUpToYear.map(y => {
    const dataY = healthData[y] || [];
    const west = dataY.filter(d => westernRegions.has(d.region));
    const totalPop = d3.sum(west, d => d.population);
    if (!totalPop) return null;
    const lifeWeighted = d3.sum(west, d => d.lifeExpectancy * d.population) / totalPop;
    return { year: y, life: lifeWeighted };
  }).filter(d => d !== null);

  const lifeSeriesRest = dataUpToYear.map(y => {
    const dataY = healthData[y] || [];
    const rest = dataY.filter(d => !westernRegions.has(d.region));
    const totalPop = d3.sum(rest, d => d.population);
    if (!totalPop) return null;
    const lifeWeighted = d3.sum(rest, d => d.lifeExpectancy * d.population) / totalPop;
    return { year: y, life: lifeWeighted };
  }).filter(d => d !== null);
  
  // Scales
  const xScale = d3.scaleLinear()
    .domain([years[0], years[years.length - 1]])
    .range([0, width]);
  
  const maxGdpPerCapita = d3.max(lineData, d => d3.max(d.values, v => v.gdpPerCapita)) || 1;
  const yScaleWealth = d3.scaleLinear()
    .domain([0, maxGdpPerCapita * 1.1])
    .range([height, 0]);
  
  const allLifeValues = [
    ...lifeSeriesWest.map(d => d.life),
    ...lifeSeriesRest.map(d => d.life)
  ];
  const lifeMin = allLifeValues.length ? d3.min(allLifeValues) : 50;
  const lifeMax = allLifeValues.length ? d3.max(allLifeValues) : 85;
  const yScaleHealth = d3.scaleLinear()
    .domain([Math.max(40, lifeMin - 2), Math.min(90, lifeMax + 2)])
    .range([height, 0])
    .clamp(true);
  
  // Line generators
  const wealthLine = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScaleWealth(d.gdpPerCapita))
    .curve(d3.curveMonotoneX);

  const healthLine = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScaleHealth(d.life))
    .curve(d3.curveMonotoneX);
  
  // Draw regional GDP per capita lines (labels handled via legend)
  lineData.forEach(d => {
    if (!d.values.length) return;

    g.append('path')
      .datum(d.values)
      .attr('fill', 'none')
      .attr('stroke', d.color)
      .attr('stroke-width', 3)
      .attr('opacity', 0.8)
      .attr('d', wealthLine);
  });

  // Draw life expectancy lines: Western vs Rest
  if (lifeSeriesWest.length) {
    g.append('path')
      .datum(lifeSeriesWest)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b6b')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.9)
      .attr('d', healthLine);
  }

  if (lifeSeriesRest.length) {
    g.append('path')
      .datum(lifeSeriesRest)
      .attr('fill', 'none')
      .attr('stroke', '#ffd166')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.9)
      .attr('d', healthLine);
  }
  
  // Axes
  const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
  xAxisG.selectAll('text').style('fill', '#9aa0a6');
  xAxisG.selectAll('line, path').style('stroke', '#2d3548');
  
  const yAxisLeft = g.append('g')
    .call(d3.axisLeft(yScaleWealth).ticks(5));
  yAxisLeft.selectAll('text').style('fill', '#9aa0a6');
  yAxisLeft.selectAll('line, path').style('stroke', '#2d3548');

  const yAxisRight = g.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(yScaleHealth).ticks(5));
  yAxisRight.selectAll('text').style('fill', '#ff6b6b');
  yAxisRight.selectAll('line, path').style('stroke', '#2d3548');
    
  // Y-axis labels
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .style('font-size', '14px')
    .text('Regional GDP per Capita (USD)');

  g.append('text')
    .attr('transform', 'rotate(90)')
    .attr('y', -width - 50)
    .attr('x', height / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#ff6b6b')
    .style('font-size', '14px')
    .text('Life Expectancy (years)');

  // Legend for all lines (inside plot, upper-left)
  const legend = g.append('g')
    .attr('transform', 'translate(10, 0)');

  let legendOffset = 0;

  // Region lines
  regions.forEach(region => {
    const color = regionalGDPData[years[0]].find(d => d.region === region).color;

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', legendOffset)
      .attr('x2', 18)
      .attr('y2', legendOffset)
      .attr('stroke', color)
      .attr('stroke-width', 3);

    legend.append('text')
      .attr('x', 24)
      .attr('y', legendOffset)
      .attr('dy', '0.35em')
      .style('fill', '#9aa0a6')
      .style('font-size', '11px')
      .text(region);

    legendOffset += 18;
  });

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', legendOffset)
    .attr('x2', 18)
    .attr('y2', legendOffset)
    .attr('stroke', '#ff6b6b')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '6,4');

  legend.append('text')
    .attr('x', 24)
    .attr('y', legendOffset)
    .attr('dy', '0.35em')
    .style('fill', '#ff6b6b')
    .style('font-size', '11px')
    .text('Life Expectancy – West');

  legendOffset += 18;

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', legendOffset)
    .attr('x2', 18)
    .attr('y2', legendOffset)
    .attr('stroke', '#ffd166')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '4,3');

  legend.append('text')
    .attr('x', 24)
    .attr('y', legendOffset)
    .attr('dy', '0.35em')
    .style('fill', '#ffd166')
    .style('font-size', '11px')
    .text('Life Expectancy – Rest');
}

// ===================================
// Global Gains Summary: West vs Rest
// ===================================
function createGlobalGainsChart() {
  if (typeof healthData === 'undefined') return;

  const svg = d3.select('#global-gains-chart');
  if (svg.empty()) return;

  svg.selectAll('*').remove();

  const margin = { top: 60, right: 40, bottom: 60, left: 70 };
  const width = 700 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const years = Object.keys(healthData).map(Number).sort((a, b) => a - b);
  if (!years.length) return;

  const startYear = years[0];
  const endYear = years[years.length - 1];

  const westernRegions = new Set(['North America', 'Europe']);

  function aggregateForYear(year) {
    const dataY = healthData[year] || [];
    const west = dataY.filter(d => westernRegions.has(d.region));
    const rest = dataY.filter(d => !westernRegions.has(d.region));

    function weightedAverage(arr, key) {
      const totalPop = d3.sum(arr, d => d.population);
      if (!totalPop) return null;
      return d3.sum(arr, d => d[key] * d.population) / totalPop;
    }

    return {
      west: {
        gdpPerCapita: weightedAverage(west, 'gdpPerCapita'),
        life: weightedAverage(west, 'lifeExpectancy')
      },
      rest: {
        gdpPerCapita: weightedAverage(rest, 'gdpPerCapita'),
        life: weightedAverage(rest, 'lifeExpectancy')
      }
    };
  }

  const startAgg = aggregateForYear(startYear);
  const endAgg = aggregateForYear(endYear);

  if (!startAgg || !endAgg) return;

  const data = [
    {
      group: 'West',
      gdpGain: (endAgg.west.gdpPerCapita ?? 0) - (startAgg.west.gdpPerCapita ?? 0),
      lifeGain: (endAgg.west.life ?? 0) - (startAgg.west.life ?? 0)
    },
    {
      group: 'Rest',
      gdpGain: (endAgg.rest.gdpPerCapita ?? 0) - (startAgg.rest.gdpPerCapita ?? 0),
      lifeGain: (endAgg.rest.life ?? 0) - (startAgg.rest.life ?? 0)
    }
  ];

  const panelWidth = width / 2 - 30;

  // GDP per capita gain panel
  const xGdp = d3.scaleBand()
    .domain(data.map(d => d.group))
    .range([0, panelWidth])
    .padding(0.3);

  const maxGdpGain = d3.max(data, d => d.gdpGain) || 1;
  const yGdp = d3.scaleLinear()
    .domain([0, maxGdpGain * 1.1])
    .range([height, 0]);

  const gGdp = g.append('g')
    .attr('transform', 'translate(0,0)');

  gGdp.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xGdp));

  gGdp.append('g')
    .call(d3.axisLeft(yGdp).ticks(5).tickFormat(d3.format('$,.0f')));

  gGdp.selectAll('.bar-gdp')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar-gdp')
    .attr('x', d => xGdp(d.group))
    .attr('y', d => yGdp(d.gdpGain))
    .attr('width', xGdp.bandwidth())
    .attr('height', d => height - yGdp(d.gdpGain))
    .attr('fill', '#667eea');

  gGdp.append('text')
    .attr('x', panelWidth / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('fill', '#e8eaed')
    .style('font-size', '13px')
    .text(`GDP per Capita Gain (${startYear}–${endYear})`);

  // Life expectancy gain panel
  const xLife = d3.scaleBand()
    .domain(data.map(d => d.group))
    .range([panelWidth + 60, panelWidth * 2 + 60])
    .padding(0.3);

  const maxLifeGain = d3.max(data, d => d.lifeGain) || 1;
  const yLife = d3.scaleLinear()
    .domain([0, maxLifeGain * 1.1])
    .range([height, 0]);

  const gLife = g.append('g');

  gLife.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xLife));

  gLife.append('g')
    .attr('transform', `translate(${panelWidth + 60}, 0)`)
    .call(d3.axisLeft(yLife).ticks(5));

  gLife.selectAll('.bar-life')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar-life')
    .attr('x', d => xLife(d.group))
    .attr('y', d => yLife(d.lifeGain))
    .attr('width', xLife.bandwidth())
    .attr('height', d => height - yLife(d.lifeGain))
    .attr('fill', '#f6ad55');

  gLife.append('text')
    .attr('x', panelWidth + 60 + panelWidth / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('fill', '#e8eaed')
    .style('font-size', '13px')
    .text(`Life Expectancy Gain (${startYear}–${endYear})`);
}

// ===================================
// Stream Graph
// ===================================
function createStreamGraph() {
  if (typeof regionalGDPData === 'undefined') return;
  
  const svg = d3.select('#stream-graph');
  svg.selectAll('*').remove();
  
  const margin = { top: 40, right: 100, bottom: 40, left: 100 };
  const width = 1000 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const years = Object.keys(regionalGDPData).map(Number);
  const regions = regionalGDPData[years[0]].map(d => d.region);
  
  const stackData = years.map(year => {
    const obj = { year: year };
    regionalGDPData[year].forEach(d => {
      obj[d.region] = d.gdp;
    });
    return obj;
  });
  
  const stack = d3.stack()
    .keys(regions)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);
  
  const series = stack(stackData);
  
  const xScale = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([
      d3.min(series, s => d3.min(s, d => d[0])),
      d3.max(series, s => d3.max(s, d => d[1]))
    ])
    .range([height, 0]);
  
  const colorScale = d3.scaleOrdinal()
    .domain(regions)
    .range(d3.schemeTableau10);
  
  const area = d3.area()
    .x(d => xScale(d.data.year))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom);
  
  g.selectAll('path')
    .data(series)
    .join('path')
    .attr('fill', d => colorScale(d.key))
    .attr('d', area)
    .attr('opacity', 0.8)
    .on('mouseenter', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1)
        .attr('stroke', '#000')
        .attr('stroke-width', 2);
    })
    .on('mouseleave', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.8)
        .attr('stroke', 'none');
    });
  
  // Axes
  const streamAxis = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
  streamAxis.selectAll('text').style('fill', '#9aa0a6');
  streamAxis.selectAll('line, path').style('stroke', '#2d3548');
  
  // Legend
  const legend = d3.select('#stream-legend');
  legend.selectAll('*').remove();
  regions.forEach(region => {
    const item = legend.append('div').attr('class', 'legend-item');
    item.append('div')
      .attr('class', 'legend-color')
      .style('background', colorScale(region));
    item.append('span').text(region);
  });
}

// ===================================
// Racing Bar Chart
// ===================================
let raceInterval = null;
let raceYears = [];
let raceSvg = null;
let raceGroup = null;
let raceBarHeight = 0;
let raceWidth = 0;
const raceMargin = { top: 80, right: 100, bottom: 40, left: 200 };
let raceMetricSelect = null;
let raceYearSlider = null;
let raceYearDisplay = null;
let racePlayBtn = null;

function getRaceMetricConfig(key) {
  switch (key) {
    case 'population':
      return {
        label: 'Population',
        accessor: d => d.population,
        format: v => (v / 1e6).toFixed(1) + 'M'
      };
    case 'life_expectancy':
      return {
        label: 'Life Expectancy',
        accessor: d => d.lifeExpectancy,
        format: v => v.toFixed(1) + ' yrs'
      };
    case 'gdp':
    default:
      return {
        label: 'Total GDP',
        accessor: d => d.gdpPerCapita * d.population,
        format: v => '$' + (v / 1e12).toFixed(2) + 'T'
      };
  }
}

function renderRaceForYear(year, metricKey = 'gdp') {
  if (!raceSvg || !raceGroup || !raceYears.length) return;

  const metricConfig = getRaceMetricConfig(metricKey);
  const dataForYear = healthData[year];
  if (!dataForYear || !dataForYear.length) {
    console.warn('No data for year in race chart:', year);
    return;
  }

  const data = dataForYear
    .slice()
    .sort((a, b) => metricConfig.accessor(b) - metricConfig.accessor(a))
    .slice(0, 10);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => metricConfig.accessor(d)) || 1])
    .range([0, raceWidth]);

  raceSvg.selectAll('.year-label').remove();
  raceSvg.append('text')
    .attr('class', 'year-label')
    .attr('x', raceWidth / 2 + raceMargin.left)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .style('font-size', '3rem')
    .style('font-weight', '800')
    .style('fill', '#667eea')
    .text(year);

  const bars = raceGroup.selectAll('.race-bar')
    .data(data, d => d.country);

  bars.enter()
    .append('rect')
    .attr('class', 'race-bar')
    .attr('x', 0)
    .attr('y', (d, i) => i * (raceBarHeight + 10))
    .attr('height', raceBarHeight)
    .attr('fill', '#667eea')
    .attr('rx', 5)
    .merge(bars)
    .transition()
    .duration(800)
    .attr('y', (d, i) => i * (raceBarHeight + 10))
    .attr('width', d => xScale(metricConfig.accessor(d)));

  bars.exit().remove();

  const labels = raceGroup.selectAll('.race-label')
    .data(data, d => d.country);

  labels.enter()
    .append('text')
    .attr('class', 'race-label')
    .attr('x', -10)
    .attr('y', (d, i) => i * (raceBarHeight + 10) + raceBarHeight / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'end')
    .style('font-weight', '600')
    .style('font-size', '14px')
    .merge(labels)
    .transition()
    .duration(800)
    .attr('y', (d, i) => i * (raceBarHeight + 10) + raceBarHeight / 2)
    .text(d => d.country);

  labels.exit().remove();

  const values = raceGroup.selectAll('.race-value')
    .data(data, d => d.country);

  values.enter()
    .append('text')
    .attr('class', 'race-value')
    .attr('x', d => xScale(metricConfig.accessor(d)) + 5)
    .attr('y', (d, i) => i * (raceBarHeight + 10) + raceBarHeight / 2)
    .attr('dy', '0.35em')
    .style('font-size', '12px')
    .style('fill', '#667eea')
    .merge(values)
    .transition()
    .duration(800)
    .attr('x', d => xScale(metricConfig.accessor(d)) + 5)
    .attr('y', (d, i) => i * (raceBarHeight + 10) + raceBarHeight / 2)
    .text(d => metricConfig.format(metricConfig.accessor(d)));

  values.exit().remove();
}

function startRace(metricKey = 'gdp') {
  if (typeof healthData === 'undefined' || !raceYears.length) {
    console.warn('healthData not loaded or raceYears empty');
    return;
  }

  // Clear any existing animation to avoid multiple intervals
  if (raceInterval) {
    clearInterval(raceInterval);
    raceInterval = null;
  }

  const years = raceYears;
  let startYear = raceYearSlider ? parseInt(raceYearSlider.value) : years[0];
  if (!years.includes(startYear)) {
    startYear = years[0];
  }
  let yearIndex = years.indexOf(startYear);

  function step() {
    if (yearIndex >= years.length) {
      clearInterval(raceInterval);
      raceInterval = null;
      if (racePlayBtn) racePlayBtn.textContent = '▶ Start Race';
      return;
    }

    const year = years[yearIndex];
    if (raceYearDisplay) raceYearDisplay.textContent = year;
    if (raceYearSlider) raceYearSlider.value = year;
    renderRaceForYear(year, metricKey);
    yearIndex++;
  }

  step();
  raceInterval = setInterval(step, 1500);
}

function createRacingBars() {
  racePlayBtn = document.getElementById('race-play-btn');
  raceMetricSelect = document.getElementById('race-metric');
  raceYearSlider = document.getElementById('race-year-slider');
  raceYearDisplay = document.getElementById('race-year-display');

  if (!racePlayBtn) {
    console.warn('Race play button not found');
    return;
  }
  if (typeof healthData === 'undefined') {
    console.warn('healthData not loaded');
    return;
  }

  raceSvg = d3.select('#racing-bars');
  raceSvg.selectAll('*').remove();

  const innerWidth = 900 - raceMargin.left - raceMargin.right;
  const innerHeight = 600 - raceMargin.top - raceMargin.bottom;
  raceWidth = innerWidth;
  raceBarHeight = innerHeight / 10 - 10;

  raceGroup = raceSvg.append('g')
    .attr('transform', `translate(${raceMargin.left}, ${raceMargin.top})`);

  raceYears = Object.keys(healthData).map(Number).sort((a, b) => a - b);

  // Initialize slider and default view
  if (raceYearSlider && raceYears.length) {
    raceYearSlider.min = raceYears[0];
    raceYearSlider.max = raceYears[raceYears.length - 1];

    if (!raceYearSlider.value || !raceYears.includes(parseInt(raceYearSlider.value))) {
      raceYearSlider.value = raceYears[0];
    }

    const initialYear = parseInt(raceYearSlider.value);
    if (raceYearDisplay) raceYearDisplay.textContent = initialYear;

    const initialMetricKey = raceMetricSelect ? raceMetricSelect.value : 'gdp';
    renderRaceForYear(initialYear, initialMetricKey);

    raceYearSlider.addEventListener('input', () => {
      const yr = parseInt(raceYearSlider.value);
      if (!healthData[yr]) return;

      // Scrubbing cancels any running animation for predictability
      if (raceInterval) {
        clearInterval(raceInterval);
        raceInterval = null;
        if (racePlayBtn) racePlayBtn.textContent = '▶ Start Race';
      }

      if (raceYearDisplay) raceYearDisplay.textContent = yr;
      const metricKey = raceMetricSelect ? raceMetricSelect.value : 'gdp';
      renderRaceForYear(yr, metricKey);
    });
  }

  // Changing metric updates the current year view and stops the race
  if (raceMetricSelect) {
    raceMetricSelect.addEventListener('change', () => {
      if (!raceYears.length) return;
      const yr = raceYearSlider ? parseInt(raceYearSlider.value) : raceYears[0];

      if (raceInterval) {
        clearInterval(raceInterval);
        raceInterval = null;
        if (racePlayBtn) racePlayBtn.textContent = '▶ Start Race';
      }

      const metricKey = raceMetricSelect.value || 'gdp';
      renderRaceForYear(yr, metricKey);
    });
  }

  racePlayBtn.addEventListener('click', () => {
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
      racePlayBtn.textContent = '▶ Start Race';
    } else {
      const metricKey = raceMetricSelect ? raceMetricSelect.value : 'gdp';
      startRace(metricKey);
      racePlayBtn.textContent = '⏸ Pause';
    }
  });
}

// ===================================
// Bubble Chart with Animation
// ===================================
let bubbleInterval = null;

function createBubbleChart() {
  if (typeof healthData === 'undefined') return;
  
  const svg = d3.select('#bubble-chart');
  const margin = { top: 60, right: 100, bottom: 60, left: 80 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const years = Object.keys(healthData).map(Number).sort((a, b) => a - b);
  let currentYearIndex = years.length - 1;
  
  // Scales
  const xScale = d3.scaleLog()
    .domain([80, 80000])
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([35, 85])
    .range([height, 0]);
  
  const sizeScale = d3.scaleSqrt()
    .domain([0, 1500000000])
    .range([5, 50]);
  
  const colorScale = d3.scaleOrdinal()
    .domain(['North America', 'Europe', 'East Asia', 'South Asia', 'Africa', 'Latin America'])
    .range(['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949']);
  
  // Axes
  const xAxis = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5, '$,.0f'));
  xAxis.selectAll('text').style('fill', '#9aa0a6');
  xAxis.selectAll('line, path').style('stroke', '#2d3548');
  
  const yAxis = g.append('g')
    .call(d3.axisLeft(yScale));
  yAxis.selectAll('text').style('fill', '#9aa0a6');
  yAxis.selectAll('line, path').style('stroke', '#2d3548');
  
  // Axis labels
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .style('font-size', '14px')
    .text('GDP per Capita ($)');
  
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -60)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .style('font-size', '14px')
    .text('Life Expectancy (years)');
  
  // Year display
  const yearLabel = svg.append('text')
    .attr('x', width / 2 + margin.left)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .style('font-size', '2.5rem')
    .style('font-weight', '800')
    .style('fill', '#667eea')
    .style('opacity', 0.3);
  
  function updateBubbles(yearIndex) {
    const year = years[yearIndex];
    const data = healthData[year];
    
    yearLabel.text(year);
    
    const bubbles = g.selectAll('.bubble')
      .data(data, d => d.country);
    
    bubbles.enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.gdpPerCapita))
      .attr('cy', d => yScale(d.lifeExpectancy))
      .attr('r', 0)
      .attr('fill', d => colorScale(d.region || 'Other'))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .merge(bubbles)
      .transition()
      .duration(800)
      .attr('cx', d => xScale(d.gdpPerCapita))
      .attr('cy', d => yScale(d.lifeExpectancy))
      .attr('r', d => sizeScale(d.population));
    
    bubbles.exit().transition().duration(300).attr('r', 0).remove();
  }
  
  // Slider control
  const slider = document.getElementById('bubble-year-slider');
  const yearDisplay = document.getElementById('bubble-year-display');

  if (slider && years.length) {
    // Align slider range with available data years
    slider.min = years[0];
    slider.max = years[years.length - 1];
    if (!slider.value || slider.value < slider.min || slider.value > slider.max) {
      slider.value = years[currentYearIndex];
    }
    if (yearDisplay) yearDisplay.textContent = years[currentYearIndex];

    slider.addEventListener('input', (e) => {
      const targetYear = parseInt(e.target.value);
      // Snap to the closest available data year
      const closestYear = years.reduce((prev, curr) =>
        Math.abs(curr - targetYear) < Math.abs(prev - targetYear) ? curr : prev
      );
      currentYearIndex = years.indexOf(closestYear);
      slider.value = closestYear;
      if (yearDisplay) yearDisplay.textContent = closestYear;
      updateBubbles(currentYearIndex);
    });
  }
  
  // Play button
  const playBtn = document.getElementById('bubble-play-btn');
  playBtn.addEventListener('click', () => {
    if (bubbleInterval) {
      clearInterval(bubbleInterval);
      bubbleInterval = null;
      playBtn.textContent = '▶ Animate';
    } else {
      currentYearIndex = 0;
      playBtn.textContent = '⏸ Pause';
      
      bubbleInterval = setInterval(() => {
        if (currentYearIndex >= years.length - 1) {
          clearInterval(bubbleInterval);
          bubbleInterval = null;
          playBtn.textContent = '▶ Animate';
          return;
        }
        currentYearIndex++;
        slider.value = years[currentYearIndex];
        yearDisplay.textContent = years[currentYearIndex];
        updateBubbles(currentYearIndex);
      }, 1000);
    }
  });
  
  // Initial render
  updateBubbles(currentYearIndex);
  
  // Legend
  const legend = d3.select('#bubble-legend');
  legend.selectAll('*').remove();
  ['North America', 'Europe', 'East Asia', 'South Asia', 'Africa', 'Latin America'].forEach(region => {
    const item = legend.append('div').attr('class', 'legend-item');
    item.append('div')
      .attr('class', 'legend-color')
      .style('background', colorScale(region));
    item.append('span').text(region);
  });
}

// ===================================
// Mapbox World Map Visualization (Choropleth)
// ===================================
function createWorldMap() {
  const mapContainer = document.getElementById('world-map');
  if (!mapContainer) return;

  // Check if Mapbox is available
  if (typeof mapboxgl === 'undefined') {
    mapContainer.innerHTML = '<p style="text-align:center; padding: 100px 20px; color: #9aa0a6;">Mapbox GL JS not loaded. Please refresh the page.</p>';
    return;
  }

  if (typeof healthData === 'undefined') {
    mapContainer.innerHTML = '<p style="text-align:center; padding: 100px 20px; color: #9aa0a6;">Data not loaded yet. Please refresh the page.</p>';
    return;
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoicnZhc2FwcGEiLCJhIjoiY21oenVjaHZsMHFzbjJsb3F6MzhwNWJqNiJ9.nm--3SzBTxssD9-65V2e2Q';

  try {
    const map = new mapboxgl.Map({
      container: 'world-map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator'
    });

    map.addControl(new mapboxgl.NavigationControl());

    const indicatorSelect = document.getElementById('map-indicator');
    const yearSlider = document.getElementById('map-year-slider');
    const yearDisplay = document.getElementById('map-year-display');
    const playBtn = document.getElementById('play-pause-btn');

    const years = Object.keys(healthData).map(Number).sort((a, b) => a - b);

    // Precompute global domains so color scales are stable across years
    const gdpValues = [];
    const lifeValues = [];
    years.forEach(y => {
      (healthData[y] || []).forEach(d => {
        if (Number.isFinite(d.gdpPerCapita)) gdpValues.push(d.gdpPerCapita);
        if (Number.isFinite(d.lifeExpectancy)) lifeValues.push(d.lifeExpectancy);
      });
    });

    const gdpPositive = gdpValues.filter(v => v > 0);
    const gdpLogs = gdpPositive.map(v => Math.log10(v));
    let gdpLogMin = gdpLogs.length ? d3.quantile(gdpLogs, 0.05) : 0;
    let gdpLogMax = gdpLogs.length ? d3.quantile(gdpLogs, 0.95) : 1;
    if (gdpLogMin == null) gdpLogMin = gdpLogs.length ? d3.min(gdpLogs) : 0;
    if (gdpLogMax == null) gdpLogMax = gdpLogs.length ? d3.max(gdpLogs) : 1;

    const indicatorDomains = {
      gdp: {
        // raw value domain for legends
        min: gdpPositive.length ? d3.min(gdpPositive) : 0,
        max: gdpPositive.length ? d3.max(gdpPositive) : 1,
        // log10 domain for color mapping (with outlier trimming)
        logMin: gdpLogMin,
        logMax: gdpLogMax
      },
      life_expectancy: {
        min: lifeValues.length ? d3.min(lifeValues) : 0,
        max: lifeValues.length ? d3.max(lifeValues) : 1
      }
    };

    function getIndicatorConfig(indicator) {
      const key = indicator === 'gdp' ? 'gdp' : 'life_expectancy';
      const domain = indicatorDomains[key];
      switch (key) {
        case 'gdp': {
          // Multi-hue gradient: white → yellow → green → blue
          const gdpInterpolator = d3.interpolateRgbBasis([
            '#ffffff', // low
            '#fff7b2', // light yellow
            '#41ab5d', // green
            '#2171b5'  // high (blue)
          ]);
          return {
            id: 'gdp',
            name: 'GDP Per Capita',
            emoji: '💰',
            accessor: d => d.gdpPerCapita,
            format: v => `$${v.toLocaleString()}`,
            // use log10 space for color, clamp to trimmed global domain
            scale: d3.scaleSequential(gdpInterpolator)
              .domain([domain.logMin, domain.logMax])
              .clamp(true)
          };
        }
        case 'life_expectancy':
        default:
          return {
            id: 'life_expectancy',
            name: 'Life Expectancy',
            emoji: '❤️',
            accessor: d => d.lifeExpectancy,
            format: v => `${v.toFixed(1)} years`,
            scale: d3.scaleSequential(d3.interpolateViridis)
              .domain([domain.min, domain.max])
              .clamp(true)
          };
      }
    }

    function buildChoroplethExpression(year, indicator) {
      const data = healthData[year] || [];
      const cfg = getIndicatorConfig(indicator);
      const domain = indicatorDomains[cfg.id];

      const expression = ['match', ['get', 'iso_3166_1_alpha_3']];

      data.forEach(row => {
        const v = cfg.accessor(row);
        if (v === null || v === undefined || !Number.isFinite(v)) return;
        const color = cfg.id === 'gdp'
          ? cfg.scale(Math.log10(v))
          : cfg.scale(v);
        // World Bank uses ISO3 for most countries, which matches this property
        expression.push(row.countryCode, color);
      });

      expression.push('rgba(0,0,0,0)');
      return { expression, cfg, domain };
    }

    function updateMapLegend(cfg, domain) {
      const existingLegend = mapContainer.querySelector('.map-legend-custom');
      if (existingLegend) existingLegend.remove();

      const legendDiv = document.createElement('div');
      legendDiv.className = 'map-legend-custom';
      legendDiv.style.cssText = `
        position: absolute;
        bottom: 40px;
        right: 10px;
        background: rgba(10, 14, 39, 0.95);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #2d3548;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        color: #e8eaed;
        z-index: 1;
        backdrop-filter: blur(10px);
      `;

      const steps = 5;
      const items = [];

      if (cfg.id === 'gdp') {
        const logMin = domain.logMin;
        const logMax = domain.logMax;
        const stepSize = (logMax - logMin) / (steps - 1 || 1);
        for (let i = 0; i < steps; i++) {
          const logValue = logMin + i * stepSize;
          const rawValue = Math.pow(10, logValue);
          const color = cfg.scale(logValue);
          items.push({ value: rawValue, color });
        }
      } else {
        const min = domain.min;
        const max = domain.max;
        const stepSize = (max - min) / (steps - 1 || 1);
        for (let i = 0; i < steps; i++) {
          const value = min + i * stepSize;
          const color = cfg.scale(value);
          items.push({ value, color });
        }
      }

      const gradientHTML = items.map(item => `
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 20px; height: 14px; background: ${item.color}; margin-right: 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 2px;"></div>
          <span style="font-size: 11px;">${cfg.format(item.value)}</span>
        </div>
      `).join('');

      legendDiv.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">${cfg.emoji} ${cfg.name}</div>
        ${gradientHTML}
      `;

      mapContainer.appendChild(legendDiv);
    }

    function updateMapVisualization(year, indicator) {
      const closestYear = years.reduce((prev, curr) =>
        Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
      );

      const { expression, cfg, domain } = buildChoroplethExpression(closestYear, indicator);
      if (Array.isArray(expression)) {
        map.setPaintProperty('country-fills', 'fill-color', expression);
        updateMapLegend(cfg, domain);
      }

      if (yearDisplay) {
        yearDisplay.textContent = closestYear;
      }
      if (yearSlider) {
        yearSlider.value = closestYear;
      }
    }

    map.on('load', () => {
      map.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': 'rgba(0,0,0,0)',
          'fill-opacity': 0.8
        }
      });

      map.addLayer({
        id: 'country-borders',
        type: 'line',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#2d3548',
          'line-width': 0.5
        }
      });

      // Initialize slider range
      if (yearSlider && years.length) {
        yearSlider.min = years[0];
        yearSlider.max = years[years.length - 1];
        if (!yearSlider.value) yearSlider.value = years[years.length - 1];
      }

      const initialYear = yearSlider ? parseInt(yearSlider.value) : years[years.length - 1];
      const initialIndicator = indicatorSelect ? indicatorSelect.value : 'life_expectancy';
      updateMapVisualization(initialYear, initialIndicator);
    });

    // Wire up controls
    if (indicatorSelect) {
      indicatorSelect.addEventListener('change', (e) => {
        const year = yearSlider ? parseInt(yearSlider.value) : years[years.length - 1];
        updateMapVisualization(year, e.target.value);
      });
    }

    if (yearSlider) {
      yearSlider.addEventListener('input', (e) => {
        const year = parseInt(e.target.value);
        const indicator = indicatorSelect ? indicatorSelect.value : 'life_expectancy';
        updateMapVisualization(year, indicator);
      });
    }

    if (playBtn) {
      let playInterval = null;
      playBtn.addEventListener('click', () => {
        if (playInterval) {
          clearInterval(playInterval);
          playInterval = null;
          playBtn.textContent = '▶ Play';
        } else {
          playBtn.textContent = '⏸ Pause';
          let year = yearSlider ? parseInt(yearSlider.value) : years[0];
          const indicator = indicatorSelect ? indicatorSelect.value : 'life_expectancy';

          playInterval = setInterval(() => {
            year += 1;
            if (year > years[years.length - 1]) {
              year = years[0];
            }
            updateMapVisualization(year, indicator);
          }, 1500);
        }
      });
    }

  } catch (error) {
    console.error('Mapbox initialization error:', error);
    mapContainer.innerHTML = '<p style="text-align:center; padding: 100px 20px; color: #9aa0a6;">Map initialization failed. Check console for details.</p>';
  }
}

// ===================================
// Radar Chart
// ===================================
function createRadarChart() {
  if (typeof healthData === 'undefined') return;

  const svg = d3.select('#radar-chart');
  const size = 700;
  const margin = 100;
  const radius = (size - margin * 2) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const allYears = Object.keys(healthData).map(Number).sort((a, b) => a - b);
  if (!allYears.length) return;

  const selectedCountries = ['United States', 'Germany', 'Brazil', 'Bangladesh', 'Thailand'];

  const radarYearSlider = document.getElementById('radar-year-slider');
  const radarYearDisplay = document.getElementById('radar-year-display');

  // Initialize slider with available years
  if (radarYearSlider) {
    radarYearSlider.min = allYears[0];
    radarYearSlider.max = allYears[allYears.length - 1];
    if (!radarYearSlider.value ||
        radarYearSlider.value < radarYearSlider.min ||
        radarYearSlider.value > radarYearSlider.max) {
      radarYearSlider.value = allYears.includes(2020) ? 2020 : allYears[allYears.length - 1];
    }
  }

  function renderRadarForYear(year) {
    const targetYear = allYears.reduce((prev, curr) =>
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );

    const dataYear = healthData[targetYear] || [];

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    const countryData = selectedCountries
      .map(name => dataYear.find(d => d.country === name))
      .filter(d => d);

    // Indicators with normalization ranges
    const indicators = [
      { name: 'GDP per Capita', key: 'gdpPerCapita', min: 0, max: 70000 },
      // Focus life expectancy range on 55–85 years for better contrast
      { name: 'Life Expectancy (55–85)', key: 'lifeExpectancy', min: 55, max: 85 },
      // Population represented in millions, max ~1.5B → 1500M
      { name: 'Population (M)', key: 'population', min: 0, max: 1500, scale: 1000000 }
    ];
    const numIndicators = indicators.length;

    // Color scale for countries
    const colorScale = d3.scaleOrdinal()
      .domain(selectedCountries)
      .range(['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f']);

    // Create radar grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', '#2d3548')
        .attr('stroke-width', 1.5);

      // Add level labels
      if (i === levels) {
        g.append('text')
          .attr('x', 5)
          .attr('y', -levelRadius)
          .style('fill', '#9aa0a6')
          .style('font-size', '11px')
          .text('100%');
      }
    }

    // Create axes
    indicators.forEach((indicator, i) => {
      const angle = (Math.PI * 2 * i) / numIndicators - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#2d3548')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', Math.cos(angle) * (radius + 30))
        .attr('y', Math.sin(angle) * (radius + 30))
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('fill', '#e8eaed')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .text(indicator.name);
    });

    // Create radar path generator
    const radarLine = d3.lineRadial()
      .angle((d, i) => (i * 2 * Math.PI) / numIndicators)
      .radius(d => d * radius)
      .curve(d3.curveLinearClosed);

    // Draw radar areas for each country
    countryData.forEach(country => {
      const values = indicators.map(ind => {
        const value = country[ind.key];
        const scaledValue = ind.scale ? value / ind.scale : value;
        const min = ind.min ?? 0;
        const max = ind.max;
        const normalized = (scaledValue - min) / (max - min || 1);
        return Math.max(0, Math.min(normalized, 1));
      });

      // Add closing point
      values.push(values[0]);

      // Draw filled area
      g.append('path')
        .datum(values)
        .attr('d', radarLine)
        .attr('fill', colorScale(country.country))
        .attr('fill-opacity', 0.2)
        .attr('stroke', colorScale(country.country))
        .attr('stroke-width', 2.5);

      // Draw points
      values.slice(0, -1).forEach((value, i) => {
        const angle = (i * 2 * Math.PI) / numIndicators - Math.PI / 2;
        const x = Math.cos(angle) * value * radius;
        const y = Math.sin(angle) * value * radius;

        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 4)
          .attr('fill', colorScale(country.country))
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      });
    });

    // Add legend below the chart
    const legend = svg.append('g')
      .attr('transform', `translate(${size / 2 - 200}, ${size - 40})`);

    selectedCountries.forEach((country, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * 90}, 0)`);

      legendItem.append('rect')
        .attr('width', 20)
        .attr('height', 12)
        .attr('fill', colorScale(country))
        .attr('rx', 2);

      legendItem.append('text')
        .attr('x', 25)
        .attr('y', 10)
        .style('fill', '#e8eaed')
        .style('font-size', '12px')
        .text(country);
    });

    if (radarYearDisplay) {
      radarYearDisplay.textContent = targetYear;
    }
  }

  const initialYear = radarYearSlider
    ? parseInt(radarYearSlider.value)
    : (allYears.includes(2020) ? 2020 : allYears[allYears.length - 1]);

  renderRadarForYear(initialYear);

  if (radarYearSlider) {
    radarYearSlider.addEventListener('input', (e) => {
      const year = parseInt(e.target.value);
      renderRadarForYear(year);
    });
  }
}

// ===================================
// Trajectory Chart
// ===================================
function createTrajectoryChart() {
  if (typeof healthData === 'undefined') return;
  
  const svg = d3.select('#trajectory-chart');
  svg.selectAll('*').remove();
  
  const margin = { top: 60, right: 100, bottom: 60, left: 80 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const years = Object.keys(healthData).map(Number).sort((a, b) => a - b);
  
  // Get trajectory data for selected countries
  const selectedCountries = ['United States', 'Germany', 'Brazil', 'Nigeria', 'United Kingdom', 'Bangladesh'];
  const trajectories = selectedCountries.map(country => ({
    country: country,
    values: years.map(year => {
      const d = healthData[year].find(c => c.country === country);
      return d ? { year, gdp: d.gdpPerCapita, life: d.lifeExpectancy } : null;
    }).filter(d => d !== null)
  }));
  
  // Scales
  const xScale = d3.scaleLog()
    .domain([80, 80000])
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([35, 85])
    .range([height, 0]);
  
  const colorScale = d3.scaleOrdinal()
    .domain(selectedCountries)
    .range(d3.schemeTableau10);
  
  // Line generator
  const line = d3.line()
    .x(d => xScale(d.gdp))
    .y(d => yScale(d.life))
    .curve(d3.curveMonotoneX);
  
  // Draw trajectories
  trajectories.forEach(traj => {
    g.append('path')
      .datum(traj.values)
      .attr('fill', 'none')
      .attr('stroke', colorScale(traj.country))
      .attr('stroke-width', 3)
      .attr('opacity', 0.7)
      .attr('d', line);
    
    // Add start and end points
    const start = traj.values[0];
    const end = traj.values[traj.values.length - 1];
    
    g.append('circle')
      .attr('cx', xScale(start.gdp))
      .attr('cy', yScale(start.life))
      .attr('r', 5)
      .attr('fill', colorScale(traj.country));
    
    g.append('circle')
      .attr('cx', xScale(end.gdp))
      .attr('cy', yScale(end.life))
      .attr('r', 7)
      .attr('fill', colorScale(traj.country))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
  });
  
  // Axes
  const trajXAxis = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5, '$,.0f'));
  trajXAxis.selectAll('text').style('fill', '#9aa0a6');
  trajXAxis.selectAll('line, path').style('stroke', '#2d3548');
  
  const trajYAxis = g.append('g')
    .call(d3.axisLeft(yScale));
  trajYAxis.selectAll('text').style('fill', '#9aa0a6');
  trajYAxis.selectAll('line, path').style('stroke', '#2d3548');
  
  // Axis labels
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .text('GDP per Capita ($)');
  
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -60)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .text('Life Expectancy (years)');
  
  // Legend
  const legend = d3.select('#trajectory-legend');
  legend.selectAll('*').remove();
  selectedCountries.forEach(country => {
    const item = legend.append('div').attr('class', 'legend-item');
    item.append('div')
      .attr('class', 'legend-color')
      .style('background', colorScale(country));
    item.append('span').text(country);
  });
}

// ===================================
// India & China Focused Trajectory
// ===================================
function createIndiaChinaTrajectory() {
  if (typeof healthData === 'undefined') return;

  const svg = d3.select('#india-china-trajectory');
  if (svg.empty()) return;

  svg.selectAll('*').remove();

  const margin = { top: 60, right: 120, bottom: 60, left: 80 };
  const width = 900 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const years = Object.keys(healthData).map(Number).sort((a, b) => a - b);
  const focusCountries = ['India', 'China'];

  const trajectories = focusCountries.map(country => ({
    country,
    values: years.map(year => {
      const d = (healthData[year] || []).find(c => c.country === country);
      return d ? { year, gdp: d.gdpPerCapita, life: d.lifeExpectancy } : null;
    }).filter(d => d !== null)
  }));

  // Scales (reuse same ranges as main trajectory chart for consistency)
  const xScale = d3.scaleLog()
    .domain([80, 80000])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([35, 85])
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal()
    .domain(focusCountries)
    .range(['#e15759', '#76b7b2']); // China (red-ish), India (teal)

  const line = d3.line()
    .x(d => xScale(d.gdp))
    .y(d => yScale(d.life))
    .curve(d3.curveMonotoneX);

  trajectories.forEach(traj => {
    if (!traj.values.length) return;

    g.append('path')
      .datum(traj.values)
      .attr('fill', 'none')
      .attr('stroke', colorScale(traj.country))
      .attr('stroke-width', 3)
      .attr('opacity', 0.9)
      .attr('d', line);

    const start = traj.values[0];
    const end = traj.values[traj.values.length - 1];

    g.append('circle')
      .attr('cx', xScale(start.gdp))
      .attr('cy', yScale(start.life))
      .attr('r', 5)
      .attr('fill', colorScale(traj.country));

    g.append('circle')
      .attr('cx', xScale(end.gdp))
      .attr('cy', yScale(end.life))
      .attr('r', 7)
      .attr('fill', colorScale(traj.country))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Label near the end point
    g.append('text')
      .attr('x', xScale(end.gdp) + 8)
      .attr('y', yScale(end.life))
      .attr('dy', '0.35em')
      .style('fill', colorScale(traj.country))
      .style('font-size', '13px')
      .style('font-weight', '600')
      .text(traj.country);
  });

  // Axes
  const xAxis = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5, '$,.0f'));
  xAxis.selectAll('text').style('fill', '#9aa0a6');
  xAxis.selectAll('line, path').style('stroke', '#2d3548');

  const yAxis = g.append('g')
    .call(d3.axisLeft(yScale));
  yAxis.selectAll('text').style('fill', '#9aa0a6');
  yAxis.selectAll('line, path').style('stroke', '#2d3548');

  // Axis labels
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .text('GDP per Capita ($, log scale)');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -60)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .style('fill', '#9aa0a6')
    .text('Life Expectancy (years)');
}

// ===================================
// Initialize Everything
// ===================================
function init() {
  console.log('🌍 Initializing Echoes of History...');
  
  // Ensure World Bank data has been loaded before drawing any charts
  const dataPromise = (typeof whenDataReady === 'function')
    ? whenDataReady()
    : Promise.resolve();

  dataPromise.then(() => {
    // Small delay just to ensure DOM and third-party scripts are settled
    setTimeout(() => {
      initParticles();
      animateStats();
      initDarkMode();
      initSmoothScroll();
      initScrollytelling();
      createWorldMap();
      createStreamGraph();
      createRacingBars();
      createBubbleChart();
      createRadarChart();
      createTrajectoryChart();
      createIndiaChinaTrajectory();
      createGlobalGainsChart();
      
      console.log('✅ All visualizations loaded with full World Bank data!');
    }, 50);
  });
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
