import { fetchVibeCheck } from './gemini.js';

// Main app entry for VibeCheck.
// Handles UI interactions, form input validation, and rendering results from Gemini.

// API key loaded from environment variables for evaluator access.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Cached DOM references for the modal, form, and result display.
const modal = document.getElementById('api-modal');
const btnClose = document.getElementById('btn-api-close');
const btnSave = document.getElementById('btn-api-save');

const form = document.getElementById('search-form');
const destInput = document.getElementById('destination');
const originInput = document.getElementById('origin');
const loadingOverlay = document.getElementById('loading-overlay');
const resultsDashboard = document.getElementById('results-dashboard');

// Modal controls for closing the API key dialog.
btnClose?.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

btnSave?.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

// Handle the search form submit and request the VibeCheck payload.
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!GEMINI_API_KEY) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    return;
  }

  const destination = destInput.value.trim();
  const origin = originInput.value.trim();
  if (!destination || !origin) return;

  resultsDashboard.style.display = 'none';
  loadingOverlay.style.display = 'flex';

  try {
    const data = await fetchVibeCheck(destination, origin, GEMINI_API_KEY);
    renderResults(data, destination);

    loadingOverlay.style.display = 'none';
    resultsDashboard.style.display = 'block';
    resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    loadingOverlay.style.display = 'none';
    alert(`Error: ${error.message}`);
  }
});

// Helper to generate image URLs from image prompt keywords.
// Uses Pollinations AI for simple, on-the-fly destination imagery.
function getImageUrl(keyword, w = 800, h = 600) {
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword)}?width=${w}&height=${h}&nologo=true&seed=${seed}`;
}

// Convert an HTML string into a DOM element.
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Render the structured Gemini response into the results dashboard.
function renderResults(data, destination) {
  // Hero destination card
  document.getElementById('hero-image').src = getImageUrl(data.heroImageKeyword || data.storyImageKeyword || destination, 1600, 900);
  document.getElementById('destination-title').textContent = destination;
  document.getElementById('destination-tagline').textContent = data.tagline || '';
  document.getElementById('destination-name-inline').textContent = destination;
  document.getElementById('chip-climate-text').textContent = data.climateNote || '';
  document.getElementById('chip-vibe-text').textContent = data.vibeTag || '';

  // Story
  document.getElementById('story-text').textContent = data.storytelling || '';
  document.getElementById('story-image').src = getImageUrl(data.storyImageKeyword || 'culture heritage');

  // Perspectives
  document.getElementById('local-perspective-text').textContent = data.localPerspective || '';
  document.getElementById('visitor-perspective-text').textContent = data.visitorPerspective || '';

  // Attractions carousel
  const attractionsList = document.getElementById('attractions-list');
  attractionsList.innerHTML = '';
  (data.attractions || []).forEach(item => {
    attractionsList.appendChild(el(`
      <div class="min-w-[300px] md:min-w-[420px] snap-start glass-card rounded-[28px] overflow-hidden group">
        <div class="h-72 overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${getImageUrl(item.imageKeyword || item.name)}" alt="${item.name}">
        </div>
        <div class="p-8">
          <h5 class="font-headline-md mb-2">${item.name}</h5>
          <p class="text-on-surface-variant">${item.description || ''}</p>
        </div>
      </div>
    `));
  });

  // Culinary / cultural experiences carousel
  const cultureList = document.getElementById('culture-list');
  cultureList.innerHTML = '';
  (data.culturalExperiences || []).forEach(item => {
    if (typeof item === 'string') {
      cultureList.appendChild(el(`
        <div class="min-w-[300px] md:min-w-[420px] snap-start glass-card rounded-[28px] p-8">
          <p class="text-on-surface-variant">${item}</p>
        </div>
      `));
      return;
    }
    cultureList.appendChild(el(`
      <div class="min-w-[300px] md:min-w-[420px] snap-start glass-card rounded-[28px] overflow-hidden group">
        <div class="h-72 overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${getImageUrl(item.imageKeyword || item.name)}" alt="${item.name}">
        </div>
        <div class="p-8">
          <div class="flex justify-between items-center mb-2">
            <span class="text-label-sm text-primary uppercase font-bold tracking-widest">${item.tag || 'Experience'}</span>
            <span class="text-label-sm text-on-surface-variant">${item.priceTier || ''}</span>
          </div>
          <h5 class="font-headline-md mb-2">${item.name}</h5>
          <p class="text-on-surface-variant">${item.description || ''}</p>
        </div>
      </div>
    `));
  });

  // Hidden gems grid
  const gemsList = document.getElementById('hidden-gems-list');
  gemsList.innerHTML = '';
  (data.hiddenGems || []).forEach(item => {
    gemsList.appendChild(el(`
      <div class="group cursor-pointer">
        <div class="aspect-square rounded-[28px] overflow-hidden mb-4 relative">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${getImageUrl(item.imageKeyword || item.name)}" alt="${item.name}">
        </div>
        <h6 class="font-headline-md text-body-lg font-bold group-hover:text-primary transition-colors">${item.name}</h6>
        <p class="text-on-surface-variant text-label-sm">${item.area || item.description || ''}</p>
      </div>
    `));
  });

  // Local events
  const eventsList = document.getElementById('events-list');
  eventsList.innerHTML = '';
  (data.localEvents || []).forEach(item => {
    eventsList.appendChild(el(`
      <div class="glass-card p-6 rounded-[24px] flex items-start gap-4">
        <span class="material-symbols-outlined text-secondary">calendar_month</span>
        <p class="text-on-surface-variant">${item}</p>
      </div>
    `));
  });

  // Quick facts
  const facts = data.quickFacts || {};
  const factsList = document.getElementById('quick-facts');
  factsList.innerHTML = '';
  const factDefs = [
    { icon: 'groups', color: 'text-primary', label: 'Population', value: facts.population },
    { icon: 'translate', color: 'text-secondary', label: 'Language', value: facts.language },
    { icon: 'schedule', color: 'text-tertiary', label: 'Best Time', value: facts.bestTime },
    { icon: 'payments', color: 'text-error', label: 'Currency', value: facts.currency },
  ];
  factDefs.filter(f => f.value).forEach(f => {
    factsList.appendChild(el(`
      <div class="glass-card px-8 py-6 rounded-3xl flex items-center gap-4">
        <span class="material-symbols-outlined ${f.color}">${f.icon}</span>
        <div>
          <div class="text-label-sm text-on-surface-variant uppercase">${f.label}</div>
          <div class="font-bold">${f.value}</div>
        </div>
      </div>
    `));
  });
}
