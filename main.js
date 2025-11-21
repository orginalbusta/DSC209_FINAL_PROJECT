// Main JavaScript - Integrates all labs
import { createGDPChart } from './gdp-viz.js';
import { createHealthChart } from './health-viz.js';
import { createMap } from './map-viz.js';

// ===================================
// Lab 3: DOM Manipulation & Dark Mode
// ===================================

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  
  // Update icon
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  
  // Save preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Account for fixed nav
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNav() {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop && 
        window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

// ===================================
// Lab 8: Scrollytelling with Scrollama
// ===================================

const scroller = scrollama();

scroller
  .setup({
    step: '.step',
    offset: 0.5,
    debug: false
  })
  .onStepEnter(response => {
    const { element, index } = response;
    
    // Update active state
    document.querySelectorAll('.step').forEach(step => {
      step.classList.remove('is-active');
    });
    element.classList.add('is-active');
    
    // Update timeline visualization
    updateTimeline(index);
  });

// Timeline visualization updates
function updateTimeline(stepIndex) {
  const timelineViz = document.getElementById('timeline-viz');
  const decades = ['1960s', '1980s', '2000s', '2020'];
  const colors = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2'];
  
  timelineViz.style.color = colors[stepIndex] || colors[0];
  timelineViz.textContent = decades[stepIndex] || '1960s';
  
  // Animate the text
  timelineViz.style.animation = 'none';
  setTimeout(() => {
    timelineViz.style.animation = 'fadeIn 0.6s ease-out';
  }, 10);
}

// Handle window resize for Scrollama
window.addEventListener('resize', () => {
  scroller.resize();
});

// ===================================
// Lab 4: Initialize Visualizations
// ===================================

async function initializeApp() {
  try {
    // Show loading state
    console.log('Initializing visualizations...');
    
    // Create all visualizations
    await createGDPChart();
    console.log('✓ GDP chart loaded');
    
    await createHealthChart();
    console.log('✓ Health chart loaded');
    
    await createMap();
    console.log('✓ Map loaded');
    
    console.log('All visualizations initialized successfully!');
  } catch (error) {
    console.error('Error initializing visualizations:', error);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// ===================================
// Additional Interactivity
// ===================================

// Add fade-in animation to visualization containers
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.viz-container').forEach(container => {
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';
  container.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(container);
});

// Console welcome message
console.log('%c🌍 Echoes of History', 'font-size: 20px; font-weight: bold; color: #007bff;');
console.log('%cAn Interactive Exploration of Human Development (1960-2020)', 'font-size: 14px; color: #6c757d;');
console.log('%cTeam Data Echoes | DSC 209R Fall 2025', 'font-size: 12px; color: #6c757d;');
