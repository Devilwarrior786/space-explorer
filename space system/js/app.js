// =====================================================
// app.js — Screen manager + wires everything together
// No router framework — just show/hide divs
// =====================================================

// ------- Instantiate modules -------
const solar   = new SolarSystem();
const planet3d = new Planet3D();
const quiz    = new Quiz();

// ------- Screen references -------
const screens = {
  home:   document.getElementById('screen-home'),
  planet: document.getElementById('screen-planet'),
  quiz:   document.getElementById('screen-quiz'),
};

// Currently active screen key
let activeScreen = 'home';

// ------- Screen switching -------
function showScreen(name) {
  // Deactivate current
  screens[activeScreen].classList.remove('active');

  // Activate target
  screens[name].classList.add('active');
  activeScreen = name;
}

// ------- HOME SCREEN setup -------
function initHome() {
  solar.init();

  // Wire planet click → open planet detail
  solar.onPlanetClick = (key) => openPlanet(key);

  // Speed slider
  document.getElementById('speed-slider').addEventListener('input', e => {
    solar.setSpeed(parseFloat(e.target.value));
  });

  // Quiz button on home
  document.getElementById('quiz-home-btn').addEventListener('click', openQuiz);

  solar.start();
}

// ------- PLANET DETAIL SCREEN setup -------
function initPlanetScreen() {
  planet3d.init();

  // Build planet selector tabs
  const selector = document.getElementById('planet-selector');
  PLANET_ORDER.forEach(key => {
    const tab       = document.createElement('button');
    tab.className   = 'planet-tab';
    tab.textContent = PLANETS[key].name;
    tab.dataset.key = key;
    tab.addEventListener('click', () => switchPlanetTab(key));
    selector.appendChild(tab);
  });

  // Info panel toggle (drag bar click)
  const panel = document.getElementById('info-panel');
  document.getElementById('panel-drag').addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    panel.classList.toggle('expanded');
  });

  // Back button
  document.getElementById('back-btn').addEventListener('click', () => {
    planet3d.stop();
    showScreen('home');
    // Re-start solar if it was stopped
    if (!solar.animId) solar.start();
  });

  // Quiz button on planet screen
  document.getElementById('quiz-planet-btn').addEventListener('click', openQuiz);

  planet3d.start();
}

// Switch active planet tab
function switchPlanetTab(key) {
  document.querySelectorAll('.planet-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.key === key);
  });
  // Collapse panel then load new planet
  const panel = document.getElementById('info-panel');
  panel.classList.add('collapsed');
  panel.classList.remove('expanded');
  planet3d.load(key);
  // Expand panel after short delay
  setTimeout(() => {
    panel.classList.remove('collapsed');
    panel.classList.add('expanded');
  }, 600);
}

// Open planet detail screen for a specific planet
function openPlanet(key) {
  solar.stop();
  showScreen('planet');
  switchPlanetTab(key);
}

// ------- QUIZ SCREEN setup -------
function initQuiz() {
  document.getElementById('quiz-back-btn').addEventListener('click', () => {
    showScreen(activeScreen === 'quiz' ? 'home' : 'home');
    showScreen('home');
    if (!solar.animId) solar.start();
  });
  document.getElementById('retry-btn').addEventListener('click', () => quiz.start());
  document.getElementById('explore-btn').addEventListener('click', () => {
    showScreen('home');
    if (!solar.animId) solar.start();
  });
}

function openQuiz() {
  solar.stop();
  planet3d.stop();
  showScreen('quiz');
  quiz.start();
}

// ------- Bootstrap -------
window.addEventListener('DOMContentLoaded', () => {
  initHome();
  initPlanetScreen();
  initQuiz();
});
