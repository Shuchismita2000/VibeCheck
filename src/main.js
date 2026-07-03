import { fetchVibeCheck } from './gemini.js';

// Initialize Lucide Icons
lucide.createIcons();

// State
// NOTE: For local development, the API key is securely loaded from your .env file.
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
let GEMINI_API_KEY = localStorage.getItem('vibecheck_api_key') || DEFAULT_API_KEY;

// DOM Elements
const modal = document.getElementById('api-modal');
const btnConfig = document.getElementById('btn-api-config');
const btnClose = document.getElementById('btn-api-close');
const btnSave = document.getElementById('btn-api-save');
const apiKeyInput = document.getElementById('api-key-input');
const apiStatusText = document.getElementById('api-status-text');

const form = document.getElementById('search-form');
const destInput = document.getElementById('destination');
const originInput = document.getElementById('origin');
const loadingOverlay = document.getElementById('loading-overlay');
const resultsDashboard = document.getElementById('results-dashboard');

// Update UI based on key presence
function updateKeyUI() {
  if (GEMINI_API_KEY) {
    apiStatusText.textContent = "API Key Active";
    apiStatusText.style.color = "#4ade80"; // green
  } else {
    apiStatusText.textContent = "Configure API Key";
    apiStatusText.style.color = "var(--text-muted)";
  }
}

// Modal Logic
btnConfig.addEventListener('click', () => {
  apiKeyInput.value = GEMINI_API_KEY;
  modal.classList.add('active');
});

btnClose.addEventListener('click', () => {
  modal.classList.remove('active');
});

btnSave.addEventListener('click', () => {
  GEMINI_API_KEY = apiKeyInput.value.trim();
  localStorage.setItem('vibecheck_api_key', GEMINI_API_KEY);
  updateKeyUI();
  modal.classList.remove('active');
});

// Initial UI check
updateKeyUI();

// Form Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!GEMINI_API_KEY) {
    alert("Please configure your Gemini API Key first by clicking the button in the top right. (Or hardcode it in main.js for evaluators)");
    modal.classList.add('active');
    return;
  }

  const destination = destInput.value.trim();
  const origin = originInput.value.trim();

  if (!destination || !origin) return;

  // Show loading
  resultsDashboard.style.display = 'none';
  loadingOverlay.style.display = 'flex';

  try {
    const data = await fetchVibeCheck(destination, origin, GEMINI_API_KEY);
    renderResults(data);

    // Hide loading, show results
    loadingOverlay.style.display = 'none';
    resultsDashboard.style.display = 'flex';

    // Re-initialize icons in the new DOM elements
    lucide.createIcons();

  } catch (error) {
    loadingOverlay.style.display = 'none';
    alert(`Error: ${error.message}`);
  }
});

// Helper for image URL via Pollinations AI
function getImageUrl(keyword) {
  // Generate a random seed to avoid caching identical images if keywords match
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword)}?width=800&height=600&nologo=true&seed=${seed}`;
}

// Render Results
function renderResults(data) {
  // 1. Story
  document.getElementById('story-text').textContent = data.storytelling;
  document.getElementById('story-image').src = getImageUrl(data.storyImageKeyword || 'culture heritage');

  // 2. Attractions
  const attractionsList = document.getElementById('attractions-list');
  attractionsList.innerHTML = data.attractions.map(item => `
    <div class="card">
      <img src="${getImageUrl(item.imageKeyword || item.name)}" alt="${item.name}" class="card-img">
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.description}</p>
      </div>
    </div>
  `).join('');

  // 3. Hidden Gems
  const gemsList = document.getElementById('hidden-gems-list');
  gemsList.innerHTML = data.hiddenGems.map(item => `
    <div class="card">
      <img src="${getImageUrl(item.imageKeyword || item.name)}" alt="${item.name}" class="card-img">
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.description}</p>
      </div>
    </div>
  `).join('');

  // 4. Cultural Experiences
  const cultureList = document.getElementById('culture-list');
  cultureList.innerHTML = data.culturalExperiences.map(item => `
    <div class="list-item">
      <i data-lucide="sparkles" class="list-icon"></i>
      <div class="list-text">${item}</div>
    </div>
  `).join('');

  // 5. Events
  const eventsList = document.getElementById('events-list');
  eventsList.innerHTML = data.localEvents.map(item => `
    <div class="list-item">
      <i data-lucide="calendar-heart" class="list-icon"></i>
      <div class="list-text">${item}</div>
    </div>
  `).join('');
}
