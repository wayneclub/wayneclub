'use strict';
(() => {
const i18n = window.wayneI18n;
const prefs = window.waynePreferences;
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const LANGS = ['en', 'zh-Hant', 'zh-Hans'];
$('#year').textContent = new Date().getFullYear();

/* ---------- Preferences ---------- */
const languageSelect = $('#language-select');
const appearanceSelect = $('#appearance-select');
languageSelect.value = prefs.routeLanguage || (LANGS.includes(prefs.read('wayne-language')) ? prefs.read('wayne-language') : 'auto');
appearanceSelect.value = root.dataset.appearance;
function syncLocaleURL(lang) {
  const path = {en: '/en/', 'zh-Hant': '/zh-hant/', 'zh-Hans': '/zh-hans/', auto: '/'}[lang] || '/';
  history.replaceState(null, '', path + location.hash);
  $('link[rel=canonical]').href = 'https://wayneclub.com' + path;
  $('meta[property="og:url"]').content = 'https://wayneclub.com' + path;
}
languageSelect.addEventListener('change', () => { save('wayne-language', languageSelect.value); i18n.apply(languageSelect.value); syncLocaleURL(languageSelect.value); });
const appearanceLabels = {auto: 'Appearance: Automatic', light: 'Appearance: Light', dark: 'Appearance: Dark'};
function syncAppearance() { const v = appearanceSelect.value; root.dataset.appearance = v; $('.appearance-button').setAttribute('aria-label', i18n.t(appearanceLabels[v])); }
appearanceSelect.addEventListener('change', () => { save('wayne-appearance', appearanceSelect.value); syncAppearance(); });
$('.appearance-button').addEventListener('click', () => {
  const order = ['auto', 'light', 'dark'];
  appearanceSelect.value = order[(order.indexOf(appearanceSelect.value) + 1) % 3];
  appearanceSelect.dispatchEvent(new Event('change', {bubbles: true}));
  toast(i18n.t(appearanceLabels[appearanceSelect.value]));
});
window.addEventListener('languagechange', () => { if (languageSelect.value === 'auto') i18n.apply('auto'); });
window.addEventListener('storage', event => {
  if (event.key === 'wayne-language') { languageSelect.value = LANGS.includes(event.newValue) ? event.newValue : 'auto'; i18n.apply(languageSelect.value); }
  if (event.key === 'wayne-appearance') { appearanceSelect.value = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'auto'; syncAppearance(); }
});

/* ---------- Sheets ---------- */
function openSheet(dialog) { dialog.showModal(); document.body.classList.add('sheet-open'); }
for (const dialog of $$('dialog')) {
  dialog.querySelector('.close-sheet').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('sheet-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}

/* ---------- Language ("subtitle track") menu ---------- */
const languageSheet = $('#language-sheet');
function syncLanguageMenu() {
  $('.language-code').textContent = {en: 'EN', 'zh-Hant': '繁', 'zh-Hans': '简'}[root.lang];
  const chosen = languageSelect.value;
  $$('[data-language]', languageSheet).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.language === chosen)));
}
$('.language-button').addEventListener('click', () => { syncLanguageMenu(); openSheet(languageSheet); });
$$('[data-language]', languageSheet).forEach(button => button.addEventListener('click', () => {
  languageSelect.value = button.dataset.language;
  languageSelect.dispatchEvent(new Event('change', {bubbles: true}));
  syncLanguageMenu();
  languageSheet.close();
}));

/* ---------- Toast ---------- */
let toastTimer;
function toast(message) {
  const el = $('.toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2600);
}
$('.copy-email').addEventListener('click', async () => {
  let message = 'Email address copied';
  try { await navigator.clipboard.writeText('me@wayneclub.com'); } catch { message = 'Could not copy. Please use the email link.'; }
  toast(i18n.t(message));
});

/* ---------- Motion (play / pause) ---------- */
const playButton = $('.play-toggle');
let playing = !reduced.matches;
function setPlaying(value) {
  playing = value;
  root.dataset.motion = value ? 'playing' : 'paused';
  playButton.setAttribute('aria-pressed', String(value));
  playButton.setAttribute('aria-label', i18n.t(value ? 'Pause motion' : 'Play motion'));
}
playButton.addEventListener('click', () => setPlaying(!playing));
reduced.addEventListener('change', () => setPlaying(!reduced.matches));
setPlaying(playing);
// Continuous loops only run while their element is on screen.
const onScreen = new WeakMap();
const visibility = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => onScreen.set(e.target, e.isIntersecting))) : null;
const watch = el => { onScreen.set(el, !visibility); if (visibility) visibility.observe(el); return el; };
const visible = el => onScreen.get(el) !== false;
const every = (ms, fn) => setInterval(() => { if (playing && !document.hidden) fn(); }, ms);

/* ---------- Projects: filter + details ---------- */
const projects = $$('.project');
const segmented = $('.segmented');
function moveThumb(container, thumb, target) {
  if (!target || !container.offsetParent) return;
  thumb.style.width = target.offsetWidth + 'px';
  thumb.style.height = target.offsetHeight + 'px';
  thumb.style.top = target.offsetTop + 'px';
  thumb.style.transform = `translateX(${target.offsetLeft}px)`;
}
const syncSegment = () => moveThumb(segmented, $('.segment-thumb'), $('.filter.active'));
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  syncSegment();
  projects.forEach(card => {
    const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
    card.hidden = !show;
    if (show && !reduced.matches) { card.classList.remove('fading'); void card.offsetWidth; card.classList.add('fading'); }
  });
}));
const projectDialog = $('#project-sheet');
let activeProject = null;
function renderProject() {
  if (activeProject === null) return;
  const card = projects[activeProject];
  const content = $('#project-content');
  content.replaceChildren();
  const kind = card.querySelector('.project-kind').cloneNode(true);
  const title = card.querySelector('h3').cloneNode(true); title.id = 'project-title';
  content.append(kind, title, card.querySelector('.project-desc').cloneNode(true));
  $$('.project-more p', card).forEach(p => content.append(p.cloneNode(true)));
  content.append(card.querySelector('.tags').cloneNode(true));
  $('#project-github').href = 'https://github.com/wayneclub/' + card.dataset.repo;
}
projects.forEach((card, index) => {
  const open = card.querySelector('.project-open');
  open.setAttribute('aria-haspopup', 'dialog');
  open.setAttribute('aria-label', i18n.t('Details') + ': ' + card.querySelector('h3').textContent);
  open.addEventListener('click', () => { activeProject = index; renderProject(); openSheet(projectDialog); });
});
projectDialog.addEventListener('close', () => { if (activeProject !== null) projects[activeProject].querySelector('.project-open').focus(); });

/* ---------- Episodes ---------- */
const disclosures = [];
$$('.job').forEach((job, index) => {
  const detail = job.querySelector('.job-detail');
  const panel = document.createElement('div'); panel.className = 'job-extra'; panel.id = 'achievements-' + index;
  panel.append(detail.querySelector('.outcomes'), detail.querySelector('.tags'));
  const button = document.createElement('button');
  button.className = 'disclosure'; button.type = 'button';
  button.setAttribute('aria-controls', panel.id); button.setAttribute('aria-expanded', 'false');
  panel.hidden = true; button.textContent = i18n.t('Show achievements');
  detail.append(button, panel); disclosures.push({button, panel});
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
    button.textContent = i18n.t(panel.hidden ? 'Show achievements' : 'Hide achievements');
  });
  const seg = $(`.seg[data-episode="${job.dataset.episode}"]`);
  const on = v => seg && seg.classList.toggle('on', v);
  job.addEventListener('pointerenter', () => on(true)); job.addEventListener('pointerleave', () => on(false));
  job.addEventListener('focusin', () => on(true)); job.addEventListener('focusout', () => on(false));
});

/* ---------- Language-aware refresh ---------- */
window.addEventListener('wayne:language', () => {
  renderProject();
  disclosures.forEach(({button, panel}) => button.textContent = i18n.t(panel.hidden ? 'Show achievements' : 'Hide achievements'));
  projects.forEach(card => card.querySelector('.project-open').setAttribute('aria-label', i18n.t('Details') + ': ' + card.querySelector('h3').textContent));
  syncLanguageMenu(); syncAppearance(); setPlaying(playing); syncPlayerToPage(); renderWordHint();
  requestAnimationFrame(() => { syncSegment(); syncNavThumb(); });
});

/* ---------- Scroll: nav, dock, reveal ---------- */
const navLinks = $$('.nav-links a');
const chapters = $$('.chapter');
const sectionIds = ['top', 'work', 'experience', 'about', 'contact'];
let currentSection = 'top';
function syncNavThumb() {
  const thumb = $('.nav-thumb');
  const link = navLinks.find(a => a.hash === '#' + currentSection);
  if (!link || !link.offsetParent) { thumb.style.opacity = 0; return; }
  thumb.style.opacity = 1; thumb.style.width = link.offsetWidth + 'px';
  thumb.style.transform = `translateX(${link.offsetLeft}px)`;
}
function setSection(id) {
  currentSection = id;
  navLinks.forEach(a => a.hash === '#' + id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
  chapters.forEach(a => a.hash === '#' + id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
  syncNavThumb();
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setSection(e.target.id); }), {rootMargin: '-40% 0px -55% 0px'});
  sectionIds.forEach(id => observer.observe(document.getElementById(id)));
  const reveal = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); reveal.unobserve(e.target); } }), {threshold: 0.06});
  $$('.section-heading, .segmented, .project, .runtime, .job, .entry, .tool-group, .school, .contact-card, .also-built').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
}
const scrubFill = $('.scrub-fill');
const timecode = $('.timecode');
const RUNTIME = 222; // seconds, a short film
let scrollPending = false;
let sectionTops = [];
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  // Chapter dots are evenly spaced; the fill moves piecewise between the sections they stand for.
  let progress = 0;
  if (sectionTops.length) {
    const tops = sectionTops.map(t => Math.min(t, max)), n = tops.length - 1;
    let i = 0; while (i < n - 1 && scrollY >= tops[i + 1]) i++;
    const span = tops[i + 1] - tops[i];
    progress = Math.min(1, (i + (span > 0 ? Math.max(0, Math.min(1, (scrollY - tops[i]) / span)) : 1)) / n);
  }
  scrubFill.style.setProperty('--progress', progress);
  const s = Math.round(p * RUNTIME);
  timecode.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  chapters.forEach(c => c.classList.toggle('passed', parseFloat(c.style.getPropertyValue('--at')) <= progress + 0.001));
  scrollPending = false;
}
function placeChapters() {
  sectionTops = chapters.map(c => Math.max(0, document.getElementById(c.hash.slice(1)).getBoundingClientRect().top + scrollY - 96));
  sectionTops[0] = 0;
  onScroll();
}
addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(onScroll); } }, {passive: true});
addEventListener('resize', () => { placeChapters(); syncSegment(); syncNavThumb(); buildRefraction(); });
addEventListener('load', placeChapters);

/* ---------- Glass light: specular follows pointer; cards lean slightly ---------- */
let litEl = null;
document.addEventListener('pointermove', event => {
  if (!finePointer.matches) return;
  const el = event.target.closest('.glass');
  if (litEl && litEl !== el) { litEl.classList.remove('lit'); if (litEl.classList.contains('project')) litEl.style.transform = ''; }
  litEl = el;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width, y = (event.clientY - r.top) / r.height;
  el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  el.classList.add('lit');
  if (el.classList.contains('project') && !reduced.matches) el.style.transform = `perspective(1400px) rotateX(${((0.5 - y) * 2.4).toFixed(2)}deg) rotateY(${((x - 0.5) * 2.4).toFixed(2)}deg) translateY(-3px)`;
}, {passive: true});
document.addEventListener('pointerleave', () => { if (litEl) { litEl.classList.remove('lit'); litEl.style.transform = ''; } });

/* ---------- Liquid glass refraction (Chromium renders SVG filters in backdrop-filter) ---------- */
const refractable = !!(navigator.userAgentData && navigator.userAgentData.brands.some(b => /Chrom/.test(b.brand))) && CSS.supports('backdrop-filter', 'url(#a)');
const defs = $('#glass-filters');
const settings = {lens: {bezel: 0.42, scale: 58, blur: 0.4}, nav: {bezel: 18, scale: 22, blur: 7}, dock: {bezel: 18, scale: 22, blur: 7}};
// Displacement map: pixels near a rounded edge are pushed along the surface normal, like a thick glass rim.
function displacementMap(w, h, radius, bezel) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
  const hw = w / 2, hh = h / 2, r = Math.min(radius, hw, hh);
  const sdf = (x, y) => { const qx = Math.abs(x - hw) - (hw - r), qy = Math.abs(y - hh) - (hh - r); return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, dist = -sdf(x + .5, y + .5);
    let dx = 0, dy = 0;
    if (dist > 0 && dist < bezel) {
      const gx = sdf(x + 1.5, y + .5) - sdf(x - .5, y + .5), gy = sdf(x + .5, y + 1.5) - sdf(x + .5, y - .5);
      const len = Math.hypot(gx, gy) || 1, t = 1 - dist / bezel, m = t * t * (3 - 2 * t);
      dx = gx / len * m; dy = gy / len * m;
    }
    d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return c.toDataURL();
}
function buildRefraction() {
  if (!refractable) return;
  root.classList.add('refraction');
  $$('[data-refract]').forEach(el => {
    const key = el.dataset.refract, cfg = settings[key];
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (!w || !h || el.dataset.size === w + 'x' + h) return;
    el.dataset.size = w + 'x' + h;
    const bezel = cfg.bezel < 1 ? Math.min(w, h) / 2 * cfg.bezel : cfg.bezel;
    const id = 'lg-' + key;
    let filter = document.getElementById(id);
    if (!filter) {
      filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = id; filter.setAttribute('color-interpolation-filters', 'sRGB');
      filter.innerHTML = `<feGaussianBlur in="SourceGraphic" stdDeviation="${cfg.blur}" result="b"/><feImage result="map" x="0" y="0" preserveAspectRatio="none"/><feDisplacementMap in="b" in2="map" scale="${cfg.scale}" xChannelSelector="R" yChannelSelector="G" result="d"/><feColorMatrix in="d" type="saturate" values="1.7"/>`;
      defs.append(filter);
    }
    const image = filter.querySelector('feImage');
    image.setAttribute('width', w); image.setAttribute('height', h);
    image.setAttribute('href', displacementMap(w, h, Math.min(w, h) / 2, bezel));
    el.style.setProperty('--refract', `url(#${id})`);
  });
}

/* ---------- Hero lens ---------- */
const stage = $('.stage'), lens = $('.lens');
let lensPos = null;
function lensSize() { return lens.offsetWidth; }
function placeLens(x, y) {
  const s = lensSize(), maxX = stage.clientWidth - s, maxY = stage.clientHeight - s;
  lensPos = {x: Math.max(0, Math.min(maxX, x)), y: Math.max(0, Math.min(maxY, y))};
  lens.style.setProperty('--lx', lensPos.x + 'px'); lens.style.setProperty('--ly', lensPos.y + 'px');
}
function sizeLens() {
  const s = Math.round(Math.max(120, Math.min(220, stage.clientWidth * 0.36)));
  lens.style.setProperty('--lens', s + 'px');
  if (!lensPos) placeLens(stage.clientWidth * 0.52 - s / 2, stage.clientHeight * 0.5 - s / 2); else placeLens(lensPos.x, lensPos.y);
}
let drag = null, idleT = 0, lastInteraction = 0;
lens.addEventListener('pointerdown', event => {
  const r = stage.getBoundingClientRect();
  drag = {dx: event.clientX - r.left - lensPos.x, dy: event.clientY - r.top - lensPos.y};
  lens.setPointerCapture(event.pointerId); lens.classList.add('dragging', 'moved');
});
lens.addEventListener('pointermove', event => {
  if (!drag) return;
  const r = stage.getBoundingClientRect();
  placeLens(event.clientX - r.left - drag.dx, event.clientY - r.top - drag.dy); lastInteraction = performance.now();
});
const endDrag = () => { drag = null; lens.classList.remove('dragging'); lastInteraction = performance.now(); };
lens.addEventListener('pointerup', endDrag); lens.addEventListener('pointercancel', endDrag);
lens.addEventListener('keydown', event => {
  const step = event.shiftKey ? 40 : 14;
  const move = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step]}[event.key];
  if (!move) return;
  event.preventDefault(); lens.classList.add('moved'); placeLens(lensPos.x + move[0], lensPos.y + move[1]); lastInteraction = performance.now();
});
// When nobody is steering, the lens drifts slowly so the refraction is visible on touch devices too.
function idle(now) {
  if (playing && !drag && visible(stage) && now - lastInteraction > 6000) {
    idleT += 0.004;
    const s = lensSize(), w = stage.clientWidth - s, h = stage.clientHeight - s;
    const tx = w * (0.5 + 0.34 * Math.sin(idleT)), ty = h * (0.5 + 0.3 * Math.sin(idleT * 1.7));
    placeLens(lensPos.x + (tx - lensPos.x) * 0.02, lensPos.y + (ty - lensPos.y) * 0.02);
  }
  requestAnimationFrame(idle);
}
watch(stage);
new ResizeObserver(() => { sizeLens(); buildRefraction(); }).observe(stage);
sizeLens(); requestAnimationFrame(idle);

/* ---------- Hero caption strip ---------- */
const captions = [['EN', 'Complexity in. Clarity out.', 'en'], ['繁', '把複雜，留在背後。', 'zh-Hant'], ['简', '把复杂，留在背后。', 'zh-Hans'], ['日', '複雑さを、わかりやすく。', 'ja']];
let captionIndex = 0;
const capLang = $('.caption-lang'), capText = $('.caption-text');
every(3200, () => {
  captionIndex = (captionIndex + 1) % captions.length;
  capText.classList.add('out');
  setTimeout(() => { const [code, text, lang] = captions[captionIndex]; capLang.textContent = code; capText.textContent = text; capText.lang = lang; capText.classList.remove('out'); }, 320);
});

/* ---------- Metrics count-up ---------- */
if ('IntersectionObserver' in window && !reduced.matches) {
  const counter = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return; counter.unobserve(entry.target);
    const el = entry.target, end = +el.dataset.count, start = performance.now();
    const tick = now => { const t = Math.min(1, (now - start) / 1400), e = 1 - Math.pow(1 - t, 3); el.textContent = Math.round(end * e); if (t < 1) requestAnimationFrame(tick); };
    el.textContent = '0'; requestAnimationFrame(tick);
  }), {threshold: 0.6});
  $$('[data-count]').forEach(el => counter.observe(el));
}

/* ---------- Demo: Subtitle Downloader player ---------- */
const cues = [
  {en: 'Some stories need more than one language.', 'zh-Hant': '有些故事，需要不只一種語言。', 'zh-Hans': '有些故事，需要不只一种语言。', ja: '物語には、ひとつ以上の言葉が必要なときがある。'},
  {en: 'So I built a way to carry them across.', 'zh-Hant': '所以我做了一個工具，把它們帶過來。', 'zh-Hans': '所以我做了一个工具，把它们带过来。', ja: 'だから、言葉を運ぶ道具を作った。'},
  {en: 'Twenty services. One clean subtitle file.', 'zh-Hant': '二十個平台，一份乾淨的字幕。', 'zh-Hans': '二十个平台，一份干净的字幕。', ja: '二十のサービス、ひとつの字幕ファイル。'}
];
const player = $('.player-demo');
const subs = $('.subtitles', player), primary = $('.sub-primary', player), secondary = $('.sub-secondary', player), dual = $('.dual-toggle', player);
let cue = 0, track = 'en', cueStart = performance.now(), pausedAt = null;
const CUE_MS = 4200;
function secondTrack() { return track === 'en' ? (root.lang === 'en' ? 'zh-Hant' : root.lang) : 'en'; }
function renderCue() {
  primary.textContent = cues[cue][track]; primary.lang = track;
  const second = secondTrack(); secondary.textContent = cues[cue][second]; secondary.lang = second;
  secondary.hidden = !dual.checked;
}
function syncPlayerToPage() { renderCue(); }
$$('[data-track]', player).forEach(button => button.addEventListener('click', () => {
  track = button.dataset.track;
  $$('[data-track]', player).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  renderCue();
}));
dual.addEventListener('change', renderCue);
function playerLoop(now) {
  if (!playing || document.hidden || !visible(player)) { if (pausedAt === null) pausedAt = now; }
  else {
    if (pausedAt !== null) { cueStart += now - pausedAt; pausedAt = null; }
    const t = (now - cueStart) / CUE_MS;
    if (t >= 1) {
      cueStart = now; subs.classList.add('swap');
      setTimeout(() => { cue = (cue + 1) % cues.length; renderCue(); subs.classList.remove('swap'); }, 280);
    }
    player.querySelector('.screen-progress i').style.setProperty('--p', ((cue + Math.min(1, t)) / cues.length).toFixed(3));
  }
  requestAnimationFrame(playerLoop);
}
watch(player); renderCue(); requestAnimationFrame(playerLoop);

/* ---------- Demo: Apple Dictionary ---------- */
const entries = {
  curiosity: ['/ˌkjʊr.iˈɑː.sə.t̬i/', 'noun', 'A strong desire to know or learn something.', '“Every project here started with curiosity.”'],
  latency: ['/ˈleɪ.tən.si/', 'noun', 'The delay before a transfer of data begins following an instruction.', '“We cut end-to-end latency by 15%.”'],
  idempotent: ['/ˌaɪ.dəmˈpoʊ.tənt/', 'adjective', 'Producing the same result no matter how many times it is applied.', '“Payment retries must be idempotent.”'],
  serendipity: ['/ˌser.ənˈdɪp.ə.t̬i/', 'noun', 'The fact of finding something good without looking for it.', '“Half of these tools began with serendipity.”'],
  subtitle: ['/ˈsʌbˌtaɪ.t̬əl/', 'noun', 'Words shown on screen that translate or transcribe what is being said.', '“Dual subtitles make great study partners.”'],
  glass: ['/ɡlæs/', 'noun', 'A hard, clear material that lets light pass through — and bends it.', '“This website is mostly glass.”'],
  wayne: ['/weɪn/', 'proper noun', 'An engineer who builds the tool when something feels harder than it should.', '“Ask Wayne; he probably wrote a script for that.”']
};
const dictDemo = $('.dict-demo'), dictInput = $('#dict-input'), dictEntry = $('.dict-entry');
function lookup(word) {
  const key = word.trim().toLowerCase();
  const e = entries[key];
  dictEntry.classList.remove('flip'); void dictEntry.offsetWidth; dictEntry.classList.add('flip');
  if (!e) {
    $('.dict-word', dictEntry).textContent = word.trim() || '—';
    $('.dict-ipa', dictEntry).textContent = '';
    $('.dict-def', dictEntry).textContent = i18n.t('Not in this pocket edition. Try one of the suggestions.');
    $('.dict-ex', dictEntry).textContent = ''; $('.speak', dictEntry).hidden = true; return;
  }
  $('.dict-word', dictEntry).textContent = key;
  $('.dict-ipa', dictEntry).replaceChildren(e[0] + ' · ', Object.assign(document.createElement('i'), {textContent: e[1]}));
  $('.dict-def', dictEntry).textContent = e[2]; $('.dict-ex', dictEntry).textContent = e[3];
  $('.speak', dictEntry).hidden = !('speechSynthesis' in window);
}
$('.dict-search').addEventListener('submit', event => { event.preventDefault(); lookup(dictInput.value); });
dictInput.addEventListener('input', () => { if (entries[dictInput.value.trim().toLowerCase()]) lookup(dictInput.value); });
$$('.dict-suggest button').forEach(b => b.addEventListener('click', () => { dictInput.value = b.textContent; lookup(b.textContent); }));
$('.dict-night').addEventListener('change', event => dictDemo.classList.toggle('night', event.target.checked));
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.speak(u);
}
$('.speak', dictEntry).addEventListener('click', () => speak($('.dict-word', dictEntry).textContent));
$('.speak-name').addEventListener('click', () => speak('Wayne Wei'));
if (!('speechSynthesis' in window)) { $('.speak', dictEntry).hidden = true; $('.speak-name').hidden = true; }

/* ---------- Demo: Subtitle Tool (Simplified → Traditional, Taiwan phrasing) ---------- */
const phrases = {'软件': '軟體', '视频': '影片', '网络': '網路', '信息': '資訊', '程序': '程式', '默认': '預設', '质量': '品質', '服务器': '伺服器', '数据库': '資料庫', '数据': '資料', '文件': '檔案', '字幕组': '字幕組', '用户': '使用者', '屏幕': '螢幕', '鼠标': '滑鼠', '打印': '列印', '支持': '支援', '内存': '記憶體', '硬盘': '硬碟', '发布': '發佈', '博客': '部落格', '界面': '介面', '优化': '最佳化', '项目': '專案', '代码': '程式碼', '菜单': '選單', '设置': '設定', '登录': '登入'};
const chars = '这這个個让讓转轉换換变變简簡单單书書语語们們为為时時说說对對会會发發经經过過还還进進动動开開关關应應机機实實现現点點学學问問题題电電视視网網络絡号號码碼门門见見长長东東车車马馬鱼魚鸟鳥龙龍风風飞飛云雲气氣华華丽麗爱愛乐樂欢歡听聽写寫读讀认認识識让讓请請谢謝总總结結给給级級线線红紅绿綠蓝藍级級画畫图圖场場欧歐亚亞际際连連运運远遠还還边邊处處备備复複杂雜难難错錯钟鐘银銀钱錢铁鐵错錯页頁顺順须須顾顧领領头頭颜顏风風轻輕较較载載软軟辑輯输輸达達迁遷选選递遞逻邏释釋钥鑰锁鎖键鍵门門间間闻聞阅閱陆陸随隨险險隐隱虽雖杂雜难難云雲电電雾霧须須顶頂项項顺順预預领領频頻题題风風飞飛饭飯馆館马馬骑騎验驗鱼魚鲜鮮鸡雞黄黃齐齊龄齡体體条條来來东東丝絲两兩严嚴丰豐临臨为為丽麗举舉义義乌烏乐樂习習乡鄉书書买買乱亂争爭亏虧云雲亚亞产產亲親仅僅从從仓倉们們价價众眾优優会會伟偉传傳伤傷伦倫侧側侨僑俭儉债債倾傾偿償儿兒党黨兰蘭关關兴興养養兽獸内內册冊写寫军軍农農决決况況冻凍净淨减減几幾凤鳳击擊刘劉则則刚剛创創删刪别別刹剎剧劇劝勸办辦务務动動劳勞势勢勋勳区區医醫华華协協单單卖賣卫衛厅廳历歷压壓厌厭县縣参參双雙发發变變叙敘号號叹嘆吗嗎启啟员員响響哑啞团團园園围圍国國图圖圆圓圣聖场場坏壞块塊坚堅坛壇垄壟埋埋够夠头頭夹夾夺奪奋奮奖獎妇婦妈媽姗姍娱娛孙孫学學宁寧宝寶实實宠寵审審宪憲宫宮宽寬宾賓对對寻尋导導寿壽将將层層属屬岁歲岛島岭嶺币幣师師帐帳带帶帮幫广廣庆慶库庫应應废廢开開异異弃棄张張弯彎弹彈归歸当當录錄彻徹征徵忆憶忧憂怀懷态態总總恋戀恶惡恼惱悬懸惊驚惯慣战戰户戶扑撲执執扩擴扫掃扬揚扰擾抚撫护護报報担擔拟擬拥擁择擇挂掛挡擋挤擠挥揮损損换換据據搅攪携攜摄攝摆擺摇搖敌敵数數断斷无無旧舊时時显顯晓曉暂暫术術杀殺杂雜权權极極构構枪槍柜櫃标標栏欄树樹样樣桥橋档檔梦夢检檢楼樓欢歡欧歐残殘毁毀毕畢汇匯汉漢沟溝没沒泪淚泽澤洁潔浅淺测測济濟浏瀏浓濃涂塗涛濤润潤涨漲渐漸湾灣湿濕满滿滚滾滞滯灭滅灯燈灵靈炼煉烟煙热熱爷爺牵牽状狀独獨狮獅猎獵环環现現琐瑣疗療疯瘋监監盖蓋盘盤着著矿礦码碼确確礼禮种種称稱积積稳穩穷窮竞競笔筆笼籠类類粮糧紧緊纠糾红紅约約级級纪紀纯純纲綱纳納纵縱纷紛纸紙线線练練组組细細织織终終绍紹经經绑綁结結绕繞绘繪给給络絡统統继繼绩績续續维維综綜绿綠缓緩编編缘緣缩縮网網罗羅罚罰职職联聯聪聰肃肅胜勝脑腦脚腳脱脫艺藝节節荣榮药藥获獲营營萧蕭虑慮虽雖补補表表袭襲规規视視览覽觉覺计計订訂认認讨討让讓训訓议議讯訊记記讲講许許论論设設访訪证證评評识識诉訴词詞译譯试試诗詩诚誠话話询詢该該详詳语語误誤说說请請读讀课課谁誰调調谈談谊誼谋謀谓謂谢謝谨謹贝貝负負财財责責贤賢败敗货貨质質购購贯貫费費贴貼贵貴贸貿资資赏賞赛賽赞讚赢贏赵趙趋趨跃躍践踐踪蹤车車轨軌轮輪轰轟迈邁迟遲适適递遞邮郵郑鄭邻鄰释釋钢鋼铺鋪销銷锁鎖锋鋒错錯锦錦键鍵镇鎮镜鏡长長闭閉闲閒阵陣阳陽阶階际際陈陳陷陷隶隸难難雏雛韩韓韵韻飘飄饰飾马馬驱驅驾駕骂罵骗騙鲁魯鸣鳴麦麥黑黑齿齒';
const charMap = new Map(); for (let i = 0; i < chars.length; i += 2) charMap.set(chars[i], chars[i + 1]);
const convertInput = $('#convert-input'), convertOutput = $('.convert-output');
function convert() {
  const text = convertInput.value; const out = document.createDocumentFragment(); let i = 0;
  const keys = Object.keys(phrases).sort((a, b) => b.length - a.length);
  while (i < text.length) {
    const phrase = keys.find(k => text.startsWith(k, i));
    if (phrase) { out.append(Object.assign(document.createElement('mark'), {textContent: phrases[phrase]})); i += phrase.length; continue; }
    const ch = text[i]; out.append(charMap.get(ch) || ch); i++;
  }
  convertOutput.replaceChildren(out);
}
convertInput.addEventListener('input', convert); convert();

/* ---------- Demo: PassBar ---------- */
const quiz = $('.quiz-demo'), quizFeedback = $('.quiz-feedback', quiz), timerLabel = $('.quiz-timer b', quiz), timerRing = $('.quiz-timer', quiz);
let quizLeft = 108, answered = false;
watch(quiz);
every(1000, () => {
  if (answered || quizLeft <= 0 || !visible(quiz)) return;
  quizLeft--; timerLabel.textContent = Math.floor(quizLeft / 60) + ':' + String(quizLeft % 60).padStart(2, '0');
  timerRing.style.setProperty('--t', (quizLeft / 108).toFixed(3));
});
$$('.quiz-options button', quiz).forEach(button => button.addEventListener('click', () => {
  const right = button.dataset.correct === 'true';
  $$('.quiz-options button', quiz).forEach(b => b.classList.remove('wrong'));
  button.classList.add(right ? 'right' : 'wrong');
  if (right) { answered = true; quizFeedback.textContent = i18n.t('Correct. Under FRE 801–802, hearsay is inadmissible unless an exclusion or exception applies.'); }
  else quizFeedback.textContent = i18n.t('Not quite. Ask what the statement is being offered to prove.');
}));

/* ---------- Demo: SpellHop ---------- */
const words = [['LENS', 'Glass that bends light', 'GRV'], ['CODE', 'What engineers write', 'KAT'], ['SYNC', 'Keep two things in step', 'EOP'], ['WAVE', 'A friendly hello, by hand', 'LIT'], ['DATA', 'Tables are full of it', 'UEM'], ['GLOW', 'Soft light', 'RAY']];
const game = $('.word-demo'), slots = $$('.word-slots span', game), blocks = $('.word-blocks', game), hearts = $('.hearts', game);
let wordIndex = 0, picked = [], lives = 3;
function renderWordHint() { $('.word-hint-text', game).textContent = i18n.t(words[wordIndex][1]); hearts.setAttribute('aria-label', i18n.t(lives === 1 ? '1 try left' : lives + ' tries left')); }
function newRound() {
  const [word, , decoys] = words[wordIndex];
  picked = []; game.classList.remove('win', 'miss');
  slots.forEach(s => { s.textContent = ''; s.classList.remove('filled'); });
  const letters = (word + decoys).split('').sort(() => Math.random() - 0.5);
  blocks.replaceChildren(...letters.map(letter => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = letter;
    b.setAttribute('aria-label', i18n.t('Letter') + ' ' + letter);
    b.addEventListener('click', () => pick(b)); return b;
  }));
  hearts.textContent = '♥'.repeat(lives) + '♡'.repeat(3 - lives); renderWordHint();
}
function pick(button) {
  if (picked.length >= 4 || game.classList.contains('win')) return;
  picked.push(button); button.disabled = true;
  const slot = slots[picked.length - 1]; slot.textContent = button.textContent; slot.classList.add('filled');
  if (picked.length < 4) return;
  const guess = picked.map(b => b.textContent).join('');
  if (guess === words[wordIndex][0]) {
    game.classList.add('win'); toast(i18n.t('River crossed! Next word.'));
    setTimeout(() => { wordIndex = (wordIndex + 1) % words.length; newRound(); }, 1500);
  } else {
    lives--; game.classList.add('miss');
    if (lives <= 0) { toast(i18n.t('Out of tries. New word!')); lives = 3; wordIndex = (wordIndex + 1) % words.length; setTimeout(newRound, 700); }
    else setTimeout(() => { hearts.textContent = '♥'.repeat(lives) + '♡'.repeat(3 - lives); renderWordHint(); clearWord(); }, 450);
  }
}
function clearWord() { picked.forEach(b => b.disabled = false); picked = []; game.classList.remove('miss'); slots.forEach(s => { s.textContent = ''; s.classList.remove('filled'); }); }
$('.word-reset', game).addEventListener('click', clearWord);
newRound();

/* ---------- Demo: Mieru ---------- */
const review = $('.review');
$$('.aspect-chips button').forEach(button => button.addEventListener('click', () => {
  $$('.aspect-chips button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  review.dataset.active = button.dataset.aspect;
}));

/* ---------- Demo: Plex Metadata ---------- */
const fetchButton = $('.fetch-meta'), shelf = $('.shelf');
fetchButton.addEventListener('click', () => {
  const filled = shelf.dataset.filled !== 'true';
  shelf.dataset.filled = String(filled); fetchButton.setAttribute('aria-pressed', String(filled));
  fetchButton.textContent = i18n.t(filled ? 'Clear metadata' : 'Fetch metadata');
});

/* ---------- Start ---------- */
i18n.apply(languageSelect.value);
syncAppearance(); syncLanguageMenu(); setSection('top');
requestAnimationFrame(() => { syncSegment(); placeChapters(); buildRefraction(); });
document.fonts && document.fonts.ready.then(() => { syncSegment(); syncNavThumb(); placeChapters(); });
})();
