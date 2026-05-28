const App = {
  current: null,
  history: [],
  cache: {},
};

const NO_NAV_SCREENS = new Set([
  'screen-stehovani', 'screen-narozeni', 'screen-doklady',
  'screen-s12', 'screen-s13', 'screen-s14',
  'screen-s8', 'screen-s9',
  'screen-auto1', 'screen-autoano', 'screen-autone',
  'screen-nastaveni',
]);

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
  'screen-chat':     'nav-chat',
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

async function _loadScreen(id) {
  if (App.cache[id]) return App.cache[id];
  const filename = id.replace('screen-', '');
  const res = await fetch(`screens/${filename}.html`);
  if (!res.ok) throw new Error(`Cannot load screen: ${id}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script').forEach(s => s.remove());
  const el = document.adoptNode(doc.body.firstElementChild);
  App.cache[id] = el;
  const nav = document.getElementById('bottom-nav');
  document.getElementById('app').insertBefore(el, nav);
  return el;
}

async function navigateTo(id, dir = 'forward') {
  if (id === App.current) return;
  const prevEl = App.current ? document.getElementById(App.current) : null;
  App.history.push(App.current);
  App.current = id;
  const nextEl = await _loadScreen(id);
  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  nextEl.scrollTop = 0;
  _updateNav(id);
  if (id === 'screen-report') initReport();
}

async function goBack() {
  if (App.history.length === 0) return;
  const prev = App.history.pop();
  if (!prev) return;
  const prevEl = App.current ? document.getElementById(App.current) : null;
  App.current = prev;
  const nextEl = await _loadScreen(prev);
  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  _updateNav(prev);
}

async function switchTab(id) {
  if (id === App.current) return;
  App.history = [];
  const prevEl = App.current ? document.getElementById(App.current) : null;
  App.current = id;
  const nextEl = await _loadScreen(id);
  if (prevEl) prevEl.classList.remove('active');
  nextEl.classList.add('active');
  nextEl.scrollTop = 0;
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

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('has-nav'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('has-nav');

  const activeTab = TAB_MAP[screenId];
  nav.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.id === activeTab);
  });
}

function switchDaneTab(tab) {
  document.querySelectorAll('.dane-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.dane-panel').forEach(p => {
    p.style.display = p.dataset.panel === tab ? 'block' : 'none';
  });
}

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

function selectEmoji(btn) {
  btn.closest('.emoji-row').querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleTag(btn) {
  btn.classList.toggle('active');
}

function selectOption(screenId, selectedId, dest) {
  document.querySelectorAll(`#${screenId} .option-btn`).forEach(b => b.classList.remove('active'));
  document.getElementById(selectedId)?.classList.add('active');
  if (dest) setTimeout(() => navigateTo(dest, 'forward'), 300);
}

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


function chatSend(text) {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const msg = text || (input && input.value.trim());
  if (!msg || !messages) return;
  if (input) input.value = '';

  const userEl = document.createElement('div');
  userEl.className = 'chat-msg chat-msg--user';
  userEl.innerHTML = `<div class="chat-msg-bubble">${msg}</div>`;
  messages.appendChild(userEl);

  setTimeout(() => {
    const botEl = document.createElement('div');
    botEl.className = 'chat-msg chat-msg--bot';
    botEl.innerHTML = `<div class="chat-msg-avatar">🤖</div><div class="chat-msg-bubble">Díky za otázku! Tato funkce je zatím ve vývoji. Brzy ti budu moci odpovědět.</div>`;
    messages.appendChild(botEl);
    botEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 600);
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

document.addEventListener('DOMContentLoaded', async () => {
  App.current = 'screen-home';
  const el = await _loadScreen('screen-home');
  el.classList.add('active');
  _updateNav('screen-home');
  initHome();
});
