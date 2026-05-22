const App = {
  current: 'screen-home',
  history: [],
};

/* Screens that don't show the bottom nav */
const NO_NAV_SCREENS = new Set([
  'screen-onboarding',
  'screen-stehovani', 'screen-narozeni', 'screen-doklady',
  'screen-s12', 'screen-s13', 'screen-s14',
  'screen-s8', 'screen-s9',
  'screen-auto1', 'screen-autoano', 'screen-autone',
  'screen-nastaveni',
]);

/* Map each screen to its tab */
const TAB_MAP = {
  'screen-home':    'nav-home',
  'screen-dane':    'nav-dane',
  'screen-projekty':'nav-dane',
  'screen-situace': 'nav-situace',
  'screen-profil':  'nav-profil',
  'screen-nastaveni':'nav-profil',
  'screen-stehovani':   'nav-situace',
  'screen-narozeni':    'nav-situace',
  'screen-doklady':     'nav-situace',
  'screen-nemovitost':  'nav-situace',
  'screen-s12':      'nav-situace',
  'screen-s13':      'nav-situace',
  'screen-s14':      'nav-situace',
  'screen-s8':       'nav-dane',
  'screen-s9':       'nav-dane',
  'screen-auto1':    'nav-dane',
  'screen-autoano':  'nav-dane',
  'screen-autone':   'nav-dane',
  'screen-feedback': 'nav-profil',
  'screen-feedback-done': 'nav-profil',
  'screen-report':   'nav-home',
};

function _formatKc(n) {
  return n.toLocaleString('cs-CZ') + ' Kč';
}

function initReport() {
  const income  = parseInt(localStorage.getItem('monthly_income') || '0');
  const monthly = income > 0 ? Math.round(income * 0.489) : 4029;

  document.getElementById('report-total').textContent     = _formatKc(monthly);
  document.getElementById('report-duchody').textContent   = _formatKc(Math.round(monthly * 0.33));
  document.getElementById('report-skolstvi').textContent  = _formatKc(Math.round(monthly * 0.26));
  document.getElementById('report-doprava').textContent   = _formatKc(Math.round(monthly * 0.24));
  document.getElementById('report-chodnik').textContent   = '~' + _formatKc(Math.round(monthly * 0.006));
}

function navigateTo(id, dir = 'forward') {
  if (id === App.current) return;
  const prevEl = document.getElementById(App.current);
  const nextEl = document.getElementById(id);
  if (!nextEl) return;

  App.history.push(App.current);
  App.current = id;

  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  nextEl.scrollTop = 0;
  _updateNav(id);

  if (id === 'screen-report') initReport();
}

function goBack() {
  if (App.history.length === 0) return;
  const prev = App.history.pop();
  const prevEl = document.getElementById(App.current);
  const nextEl = document.getElementById(prev);
  if (!nextEl) return;

  App.current = prev;
  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  _updateNav(prev);
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

/* Situation steps */
function toggleStep(rowEl) {
  const step = rowEl.closest('.sit-step');
  const isOpen = step.classList.contains('sit-step--open');
  step.closest('.sit-steps').querySelectorAll('.sit-step--open').forEach(s => s.classList.remove('sit-step--open'));
  if (!isOpen) step.classList.add('sit-step--open');
}

function checkStep(event, checkEl) {
  event.stopPropagation();
  const step = checkEl.closest('.sit-step');
  step.classList.toggle('sit-step--done');
  step.classList.remove('sit-step--open');
  _updateSitProgress(step.closest('.screen'));
}

function startSituation(id, name, btnEl) {
  localStorage.setItem('active_situation', JSON.stringify({ id, name }));
  btnEl.textContent = '✓ Přidáno';
  btnEl.disabled = true;
}

function _updateSitProgress(screenEl) {
  const total = screenEl.querySelectorAll('.sit-step').length;
  const done = screenEl.querySelectorAll('.sit-step--done').length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;
  const fill = screenEl.querySelector('.progress-fill');
  const counter = screenEl.querySelector('.sit-progress-counter');
  if (fill) fill.style.width = pct + '%';
  if (counter) counter.textContent = done + ' / ' + total + ' kroků';
  if (done === total && total > 0) {
    const banner = screenEl.querySelector('.sit-completion');
    if (banner) banner.removeAttribute('hidden');
  }
}

/* Onboarding */
function calcOnboarding() {
  const income = parseInt(document.getElementById('onb-income').value) || 0;
  const monthly = Math.round(income * 0.489);
  const yearly = monthly * 12;
  const fmt = n => n > 0 ? '~ ' + n.toLocaleString('cs-CZ') + ' Kč' : '–';
  document.getElementById('onb-monthly').textContent = fmt(monthly);
  document.getElementById('onb-yearly').textContent = fmt(yearly);
}

function finishOnboarding() {
  const income = parseInt(document.getElementById('onb-income').value) || 0;
  localStorage.setItem('onboarding_done', '1');
  if (income > 0) localStorage.setItem('monthly_income', String(income));
  switchTab('screen-home');
}

function initHome() {
  const slider = document.getElementById('active-sit-slider');
  const dots = document.querySelectorAll('#active-sit-dots .active-sit-dot');
  if (!slider || !dots.length) return;
  slider.addEventListener('scroll', () => {
    const idx = Math.round(slider.scrollLeft / slider.offsetWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });
}

/* Init on load */
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('onboarding_done')) {
    App.current = 'screen-onboarding';
  }
  const startEl = document.getElementById(App.current);
  if (startEl) {
    startEl.classList.add('active');
    _updateNav(App.current);
  }
  initHome();
});
