import { countries, COUNTRY_TOTAL, continentNames, rewards, buildings } from './countries.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const storageKey = 'gfield-world-explorer-v1';
const defaultState = { points: 0, streak: 0, solved: [], ownedRewards: [], ownedBuildings: [], audio: false, continent: 'all', mode: 'flag' };
let state = loadState();
let current = null;
let locked = false;

function loadState(){
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
  catch { return { ...defaultState }; }
}
function saveState(){ localStorage.setItem(storageKey, JSON.stringify(state)); }
function sample(list){ return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list){ return [...list].sort(() => Math.random() - .5); }
function pool(){
  const filtered = state.continent === 'all' ? countries : countries.filter(c => c.continent === state.continent);
  return filtered.length >= 4 ? filtered : countries;
}
function speak(text){
  if (!state.audio || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = .95;
  speechSynthesis.speak(utter);
}
function guide(text){ $('#guideMessage').textContent = text; speak(text); }
function toast(text){
  const el = $('#toast'); el.textContent = text; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
}

function updateStatus(){
  $('#points').textContent = state.points;
  $('#streak').textContent = state.streak;
  $('#solved').textContent = state.solved.length;
  $('#totalCountries').textContent = COUNTRY_TOTAL;
  $('#speakToggle').textContent = state.audio ? '🔊 음성 끄기' : '🔈 음성 켜기';
  $('#speakToggle').setAttribute('aria-pressed', String(state.audio));
  renderPins(); renderProgress(); renderCollections(); saveState();
}

function renderPins(){
  const pins = $('#flagPins'); pins.innerHTML = '';
  state.solved.forEach(id => {
    const c = countries.find(item => item.id === id); if (!c) return;
    const pin = document.createElement('span'); pin.className = 'flag-pin'; pin.textContent = c.flag;
    pin.style.left = `${c.map.x}%`; pin.style.top = `${c.map.y}%`; pins.appendChild(pin);
  });
}

function renderProgress(){
  const root = $('#continentProgress'); root.innerHTML = '';
  Object.entries(continentNames).filter(([id]) => id !== 'all').forEach(([id,name]) => {
    const items = countries.filter(c => c.continent === id);
    const solved = items.filter(c => state.solved.includes(c.id)).length;
    const chip = document.createElement('span'); chip.className = 'progress-chip'; chip.textContent = `${name} ${solved}/${items.length}`;
    root.appendChild(chip);
  });
}

function renderCollections(){
  const inv = $('#inventory'); inv.innerHTML = '';
  rewards.forEach(item => {
    const owned = state.ownedRewards.includes(item.id);
    const div = document.createElement('button'); div.className = `reward ${owned ? '' : 'locked'}`;
    div.innerHTML = `<b>${item.icon}</b><br>${item.name}<br><small>${owned ? '보유' : item.cost + 'P'}</small>`;
    div.onclick = () => buy(item, 'reward'); inv.appendChild(div);
  });
  const build = $('#buildings'); build.innerHTML = '';
  buildings.forEach(item => {
    const owned = state.ownedBuildings.includes(item.id);
    const div = document.createElement('button'); div.className = `reward ${owned ? '' : 'locked'}`;
    div.innerHTML = `<b>${item.icon}</b><br>${item.name}<br><small>${owned ? '건설 완료' : item.cost + 'P'}</small>`;
    div.onclick = () => buy(item, 'building'); build.appendChild(div);
  });
}
function buy(item,type){
  const key = type === 'reward' ? 'ownedRewards' : 'ownedBuildings';
  if (state[key].includes(item.id)) return toast('이미 가지고 있어요.');
  if (state.points < item.cost) return toast(`포인트가 ${item.cost - state.points}점 더 필요해요.`);
  state.points -= item.cost; state[key].push(item.id); updateStatus();
  guide(`${item.name}을 획득했어! 세계 마을이 더 멋져졌네.`);
}

function nextQuiz(){
  locked = false; $('#nextButton').disabled = true;
  const available = pool();
  const unsolved = available.filter(c => !state.solved.includes(c.id));
  current = sample(unsolved.length ? unsolved : available);
  const alternatives = shuffle(available.filter(c => c.id !== current.id)).slice(0,3);
  const choices = shuffle([current, ...alternatives]);
  renderQuizVisual();
  const answers = $('#answers'); answers.innerHTML = '';
  choices.forEach(c => {
    const button = document.createElement('button'); button.textContent = c.name;
    button.onclick = () => answer(c, button); answers.appendChild(button);
  });
  guide(modeIntro());
}

function modeIntro(){
  if (state.mode === 'flag') return '국기를 자세히 보고 나라 이름을 골라 보자!';
  if (state.mode === 'clue') return '지리와 역사 단서를 읽고 나라를 찾아보자!';
  return '지도에 표시된 위치를 보고 나라를 맞혀 보자!';
}

function renderQuizVisual(){
  const visual = $('#quizVisual'); visual.innerHTML = '';
  const heading = $('#quizHeading');
  if (state.mode === 'flag') {
    heading.textContent = '국기를 보고 나라를 맞혀요'; visual.innerHTML = `<div class="big-flag" aria-label="국기">${current.flag}</div>`;
    $('#quizPrompt').textContent = '이 국기는 어느 나라의 국기일까요?';
  } else if (state.mode === 'clue') {
    heading.textContent = '정보를 읽고 나라를 맞혀요'; visual.innerHTML = `<div class="clue-card">${current.clue}<br><small>역사 단서: ${current.history}</small></div>`;
    $('#quizPrompt').textContent = '설명에 알맞은 나라는 어디일까요?';
  } else {
    heading.textContent = '위치를 보고 나라를 맞혀요';
    visual.innerHTML = `<div class="mini-map"><span style="left:${Math.max(2,current.map.x-5)}%;top:${Math.max(4,current.map.y-12)}%">📍</span></div>`;
    $('#quizPrompt').textContent = `${continentNames[current.continent]}의 표시된 위치에 있는 나라는?`;
  }
}

function answer(choice,button){
  if (locked) return; locked = true;
  const buttons = $$('#answers button');
  const correctButton = buttons.find(b => b.textContent === current.name);
  if (choice.id === current.id) {
    button.classList.add('correct'); state.streak += 1;
    const first = !state.solved.includes(current.id); const gained = 10 + Math.min(state.streak,5) * 2 + (first ? 15 : 0);
    state.points += gained;
    if (first) state.solved.push(current.id);
    guide(`정답! ${current.name}. ${current.geography} ${gained}포인트를 받았어.`);
    toast(`+${gained}P`);
    setTimeout(() => openCountryCard(current), 550);
  } else {
    button.classList.add('wrong'); correctButton?.classList.add('correct'); state.streak = 0;
    guide(`아쉽다. 정답은 ${current.name}이야. ${current.location}에 있는 나라야.`);
  }
  $('#nextButton').disabled = false; updateStatus();
}

function openCountryCard(c){
  $('#countryCard').innerHTML = `<section class="country-info"><h2>${c.flag} ${c.name}</h2><p>${c.clue}</p><div class="facts"><div class="fact"><b>수도</b><br>${c.capital}</div><div class="fact"><b>위치</b><br>${c.location}</div><div class="fact"><b>언어</b><br>${c.language}</div><div class="fact"><b>화폐</b><br>${c.currency}</div></div><h3>지리</h3><p>${c.geography}</p><h3>인문·문화</h3><p>${c.human}</p><h3>역사</h3><p>${c.history}</p><p><b>나라 보상:</b> ${c.reward} · ${c.building}</p></section>`;
  $('#countryDialog').showModal();
}

$$('.mode-tabs button').forEach(button => button.addEventListener('click', () => {
  $$('.mode-tabs button').forEach(b => b.classList.remove('active')); button.classList.add('active');
  state.mode = button.dataset.mode; nextQuiz(); updateStatus();
}));
$$('.continent').forEach(button => button.addEventListener('click', () => {
  state.continent = button.dataset.continent; $('#continentFilter').value = state.continent;
  $$('.continent').forEach(b => b.classList.toggle('selected', b.dataset.continent === state.continent));
  nextQuiz(); updateStatus();
}));
$('#continentFilter').addEventListener('change', event => { state.continent = event.target.value; nextQuiz(); updateStatus(); });
$('#speakToggle').addEventListener('click', () => { state.audio = !state.audio; updateStatus(); guide(state.audio ? '음성 안내를 시작할게!' : '음성 안내를 껐어.'); });
$('#hintButton').addEventListener('click', () => { const text = `힌트: 수도는 ${current.capital}, 위치는 ${current.location}이야.`; toast(text); guide(text); });
$('#nextButton').addEventListener('click', nextQuiz);
$('#closeDialog').addEventListener('click', () => $('#countryDialog').close());
$('#countryDialog').addEventListener('click', event => { if (event.target === $('#countryDialog')) $('#countryDialog').close(); });

$('#continentFilter').value = state.continent;
$$('.mode-tabs button').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
updateStatus(); nextQuiz();