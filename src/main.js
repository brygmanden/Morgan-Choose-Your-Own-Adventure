import { pages, START_PAGE, routeIsValid, nextRoute } from './story.js';

const $ = id => document.getElementById(id);

// Inside an iframe the page must be as tall as its content, not stretch to the
// iframe's own height, or an embedding page could never shrink the iframe back.
// (Separate from src/embed-resize.js, which only marks ?embed=1 pages.)
const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
if (framed) document.body.classList.add('is-framed');
const storyEl = $('story');
const choicesEl = $('choices');
const sheetEl = $('turnSheets');
const labelEl = $('turnLabel');
let route = [START_PAGE];
let turning = false;
let timers = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function clearAnimations() {
  timers.forEach(clearTimeout); timers = [];
  sheetEl.replaceChildren(); labelEl.textContent = '';
  turning = false;
  reportHeight(true);
}
function schedule(fn, delay) { timers.push(window.setTimeout(fn, delay)); }
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function showPage() {
  const pageNumber = route.at(-1);
  const page = pages[pageNumber];
  $('pageNumber').textContent = pageNumber;
  const titles = {1:'Your first day',12:'A familiar audience',27:'The viral moment',41:'The quiet corner',52:'The familiar face',63:'Picture perfect',74:'A steady rhythm',85:'Chasing the numbers',96:'Closer to home',107:'Beyond the screen',118:'The neighbourhood noticeboard',129:'The essentials',140:'Better together'};
  $('chapterTitle').textContent = titles[pageNumber];
  storyEl.replaceChildren(); choicesEl.replaceChildren();
  for (const paragraph of page.paras) storyEl.append(element('p', 'story-paragraph', paragraph));
  if (page.choices) {
    choicesEl.append(element('div', 'choice-rule'));
    for (const [decision, destination] of page.choices) {
      const btn = element('button', 'choice'); btn.type = 'button';
      btn.setAttribute('aria-label', `If you decide to ${decision}, turn to page ${destination}`);
      btn.append(document.createTextNode(`If you decide to ${decision}, `));
      btn.append(element('strong', '', `turn to page ${destination}.`));
      btn.addEventListener('click', () => navigate(nextRoute(route, destination)));
      choicesEl.append(btn);
    }
  } else {
    const previousPage = pages[route.at(-2)];
    const selected = previousPage?.choices?.find(choice => choice[1] === pageNumber);
    if (selected) {
      const label = selected[0].charAt(0).toUpperCase() + selected[0].slice(1);
      choicesEl.append(element('p', 'chosen-banner', `You chose: ${label}`));
    }
    const advice = element('section', 'advice');
    advice.setAttribute('aria-label', 'Advice from Morgan Eckroth');
    const heading = element('h2', 'advice-heading');
    heading.append(element('span', 'rule'), element('span', '', 'Morgan’s advice'), element('span', 'rule'));
    advice.append(heading);
    const avatar = element('img', 'avatar');
    avatar.src = './public/assets/morgan-graphic-novel-avatar.png';
    avatar.alt = 'Graphic-novel illustration of Morgan Eckroth';
    avatar.width = 310; avatar.height = 325;
    const portrait = element('div', 'portrait-frame');
    portrait.append(avatar);
    const adviceText = element('div', 'advice-text');
    adviceText.append(element('blockquote', 'quotation', `“${page.quote}”`));
    adviceText.append(element('p', 'timestamp', `Interview timestamp ${page.time}`));
    const adviceBody = element('div', 'advice-body');
    adviceBody.append(portrait, adviceText);
    advice.append(adviceBody);
    choicesEl.append(advice);
    const lesson = element('div', 'lesson');
    lesson.innerHTML = '<svg class="cup" aria-hidden="true" focusable="false"><use href="#cup"></use></svg>';
    lesson.append(element('p', 'interpretation', page.lesson));
    choicesEl.append(lesson);
    choicesEl.append(element('p', 'the-end', 'The End'));
    const backPage = route.at(-2);
    const button = element('button', 'return-choice', `Turn to page ${backPage} to choose again`); button.type='button';
    button.addEventListener('click', () => navigate(route.slice(0,-1)));
    choicesEl.append(button);
  }
  $('back').disabled = route.length===1;
}
// A long page grows taller instead of splitting, so a new page starts from its top.
function scrollToPageTop() {
  const top = $('book').getBoundingClientRect().top;
  if (top < 0) window.scrollTo({ top: window.scrollY + top - 8 });
}
function navigate(newRoute) {
  if (turning || !routeIsValid(newRoute)) return;
  if (newRoute.join(',') === route.join(',')) return;
  const target = newRoute.at(-1);
  const fromPage = route.at(-1);
  turning = true;
  if (reducedMotion.matches) { route = newRoute; showPage(); scrollToPageTop(); turning=false; requestAnimationFrame(() => reportHeight(true)); return; }
  sheetEl.replaceChildren();
  labelEl.textContent = `Turning to page ${target}…`;
  labelEl.classList.add('visible');
  const backwards = target < fromPage;
  for (let i=0;i<7;i++) {
    const sheet = element('div', `sheet ${backwards ? 'backwards' : ''}`);
    sheet.style.setProperty('--delay', `${i*58}ms`);
    sheet.style.zIndex = String(7-i);
    sheetEl.append(sheet);
    requestAnimationFrame(() => sheet.classList.add('flipping'));
  }
  schedule(() => { route=newRoute; showPage(); scrollToPageTop(); }, 280);
  schedule(() => { clearAnimations(); }, 820);
}
$('back').addEventListener('click', () => { if(route.length>1)navigate(route.slice(0,-1)); });
$('reset').addEventListener('click', () => navigate([START_PAGE]));
showPage();

// Height reports for an embedding page, alongside src/embed-resize.js (which only
// reports when the browser's ResizeObserver fires, and browsers can delay that,
// e.g. while the iframe is off-screen). After every render the app knows its exact
// height (the book page plus the desktop padding) and sends it with the same
// RESIZE_IFRAME message. If the page is ever taller than what the iframe shows
// (scroll height larger than the visible height), the full height is sent again,
// once a second, until the iframe fits.
let sentHeight = 0;
let sentCount = 0;
function pageHeight() {
  const root = document.documentElement;
  const body = document.body;
  return Math.ceil(Math.max(body.scrollHeight, body.offsetHeight, body.getBoundingClientRect().height,
    root.scrollHeight > window.innerHeight ? root.scrollHeight : 0));
}
function reportHeight(force = false) {
  if (!framed || !document.body) return;
  const height = pageHeight();
  const overflowing = height > window.innerHeight + 1;
  if (!force && !overflowing && Math.abs(height - sentHeight) < 2) { showDebug(); return; }
  sentHeight = height;
  sentCount++;
  window.parent.postMessage({ type: 'RESIZE_IFRAME', height }, '*');
  showDebug();
}
if (framed) {
  window.addEventListener('resize', () => requestAnimationFrame(() => reportHeight()));
  window.addEventListener('load', () => reportHeight(true));
  document.fonts?.ready.then(() => reportHeight());
  setInterval(() => reportHeight(), 1000);
}

// Diagnostics: add ?debug=1 to the app's address to show the page height, the
// iframe's visible height and the last height sent, at the top of the app.
const debugPanel = new URLSearchParams(location.search).get('debug') === '1' ? document.createElement('div') : null;
if (debugPanel) {
  debugPanel.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99;padding:6px 10px;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;background:#000c;color:#fff;white-space:pre-wrap';
  document.body.append(debugPanel);
}
function showDebug() {
  if (!debugPanel) return;
  const height = pageHeight();
  const shown = window.innerHeight;
  const state = height > shown + 1 ? `CUT OFF by ${height - shown}px` : height < shown - 1 ? `${shown - height}px empty below` : 'fits';
  debugPanel.textContent = `page height ${height}px · iframe shows ${shown}px · ${state}\nlast height sent ${sentHeight}px · messages sent ${sentCount} · framed ${framed} · width ${window.innerWidth}px`;
}
if (debugPanel) { showDebug(); setInterval(showDebug, 250); }
