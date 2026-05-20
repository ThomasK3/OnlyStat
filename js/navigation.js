const App = {
  current: 'screen-home',
  history: [],
  animating: false
};

/* Screens that don't show the bottom nav */
const NO_NAV_SCREENS = new Set([
  'screen-stehovani', 'screen-narozeni', 'screen-doklady',
  'screen-s12', 'screen-s13', 'screen-s14',
  'screen-s8', 'screen-s9',
  'screen-auto1', 'screen-autoano', 'screen-autone',
  'screen-feedback', 'screen-feedback-done',
  'screen-nastaveni',
]);

/* Map each screen to its tab */
const TAB_MAP = {
  'screen-home':    'nav-home',
  'screen-dane':    'nav-dane',
  'screen-projekty':'nav-dane',
  'screen-situace': 'nav-situace',
  'screen-ukoly':   'nav-situace',
  'screen-profil':  'nav-profil',
  'screen-nastaveni':'nav-profil',
  'screen-stehovani':'nav-situace',
  'screen-narozeni': 'nav-situace',
  'screen-doklady':  'nav-situace',
  'screen-s12':      'nav-situace',
  'screen-s13':      'nav-situace',
  'screen-s14':      'nav-situace',
  'screen-s8':       'nav-dane',
  'screen-s9':       'nav-dane',
  'screen-auto1':    'nav-dane',
  'screen-autoano':  'nav-dane',
  'screen-autone':   'nav-dane',
  'screen-feedback': 'nav-home',
  'screen-feedback-done': 'nav-home',
};

function navigateTo(id, dir = 'forward') {
  if (App.animating || id === App.current) return;
  const prevEl = document.getElementById(App.current);
  const nextEl = document.getElementById(id);
  if (!nextEl) return;

  App.animating = true;
  App.history.push(App.current);
  App.current = id;

  const inClass  = dir === 'forward' ? 'slide-in-right'  : 'slide-in-left';
  const outClass = dir === 'forward' ? 'slide-out-left'  : 'slide-out-right';

  /* Show next screen on top */
  nextEl.classList.add('active', inClass);
  if (prevEl) prevEl.classList.add(outClass);

  _updateNav(id);

  setTimeout(() => {
    if (prevEl) {
      prevEl.classList.remove('active', outClass);
    }
    nextEl.classList.remove(inClass);
    nextEl.scrollTop = 0;
    App.animating = false;
  }, 280);
}

function goBack() {
  if (App.animating || App.history.length === 0) return;
  const prev = App.history.pop();
  const id = App.current;

  App.animating = true;
  const prevEl = document.getElementById(id);
  const nextEl = document.getElementById(prev);
  if (!nextEl) { App.animating = false; return; }

  App.current = prev;

  nextEl.classList.add('active', 'slide-in-left');
  if (prevEl) prevEl.classList.add('slide-out-right');

  _updateNav(prev);

  setTimeout(() => {
    if (prevEl) prevEl.classList.remove('active', 'slide-out-right');
    nextEl.classList.remove('slide-in-left');
    App.animating = false;
  }, 280);
}

function switchTab(id) {
  if (id === App.current) return;
  App.history = [];
  const prevEl = document.getElementById(App.current);
  const nextEl = document.getElementById(id);
  if (!nextEl) return;

  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  nextEl.scrollTop = 0;
  App.current = id;
  _updateNav(id);
}

function _updateNav(screenId) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  if (NO_NAV_SCREENS.has(screenId)) {
    nav.classList.add('hidden');
    return;
  }
  nav.classList.remove('hidden');

  /* Add padding to screen so content isn't hidden behind nav */
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('has-nav'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('has-nav');

  /* Highlight active tab */
  const activeTab = TAB_MAP[screenId];
  nav.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.id === activeTab);
  });
}

/* Dane screen tab filter */
function switchDaneTab(tab) {
  document.querySelectorAll('.dane-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.dane-panel').forEach(p => {
    p.style.display = p.dataset.panel === tab ? 'block' : 'none';
  });
}

/* Project filter chips */
function filterProjects(category) {
  document.querySelectorAll('.proj-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === category || category === 'vse');
  });
  document.querySelectorAll('.proj-card').forEach(card => {
    if (category === 'vse' || card.dataset.cat === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/* Feedback emoji select */
function selectEmoji(btn) {
  btn.closest('.emoji-row').querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* Tag toggle */
function toggleTag(btn) {
  btn.classList.toggle('active');
}

/* Option select + navigate */
function selectOption(screenId, selectedId, dest) {
  document.querySelectorAll(`#${screenId} .option-btn`).forEach(b => b.classList.remove('active'));
  document.getElementById(selectedId)?.classList.add('active');
  if (dest) setTimeout(() => navigateTo(dest, 'forward'), 300);
}

/* Init on load */
document.addEventListener('DOMContentLoaded', () => {
  const startEl = document.getElementById(App.current);
  if (startEl) {
    startEl.classList.add('active');
    _updateNav(App.current);
  }
});
