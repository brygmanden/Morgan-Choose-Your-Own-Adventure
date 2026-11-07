import { pages, START_PAGE, routeIsValid, nextRoute, routeTo } from './story.js';

const $ = id => document.getElementById(id);
const storyEl = $('story');
const choicesEl = $('choices');
const sheetEl = $('turnSheets');
const labelEl = $('turnLabel');
const historyDialog = $('historyDialog');
let route = [START_PAGE];
let turning = false;
let timers = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function clearAnimations() {
  timers.forEach(clearTimeout); timers = [];
  sheetEl.replaceChildren(); labelEl.textContent = '';
  turning = false;
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
  if (reducedMotion.matches) { route = newRoute; showPage(); scrollToPageTop(); turning=false; return; }
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
function showHistory() {
  const contents = $('historyItems'); contents.replaceChildren();
  route.forEach((pageNumber, index) => {
    const button=element('button', 'history-link', `Page ${pageNumber} · ${index===0?'Your first day':index===1?'Your first decision':'Your outcome'}`);
    button.type='button';
    button.addEventListener('click', () => { historyDialog.close(); navigate(routeTo(route, pageNumber)); });
    contents.append(button);
  });
  historyDialog.showModal();
}
$('back').addEventListener('click', () => { if(route.length>1)navigate(route.slice(0,-1)); });
$('reset').addEventListener('click', () => navigate([START_PAGE]));
$('journey').addEventListener('click', showHistory);
$('closeHistory').addEventListener('click', () => historyDialog.close());
historyDialog.addEventListener('click', event => { if (event.target===historyDialog) historyDialog.close(); });
showPage();
