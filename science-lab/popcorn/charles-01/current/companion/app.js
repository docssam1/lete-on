'use strict';

const assembly = [
  {title:'E 도안에 테이프 붙이기',body:'E 도안을 펼치고, 원본 사진에 보이는 붙이는 면에 발포양면테이프를 붙여요.',check:'이빨 부분과 접는 선을 가리지 않았나요?',help:'아직 접지 말고 사진의 펼친 모양과 비교해요. 도안 E를 찾고, 붙이는 면을 먼저 확인한 뒤 테이프를 붙여요.',alt:'펼친 E 아래턱 도안의 붙이는 부분에 발포양면테이프를 붙인 원본 사진',sourcePage:13},
  {title:'아래턱 만들기',body:'이빨 부분을 안쪽으로 접어요. 바닥면을 붙여 아래턱 모양을 만들어요.',check:'이빨이 안쪽으로 접히고, 아래턱 바닥이 붙었나요?',help:'입 안쪽으로 접히는 방향을 사진과 비교해요. 턱의 옆면까지 붙여 움직이는 부분을 막지 않았는지 확인해요.',alt:'이빨을 안쪽으로 접고 바닥면을 붙여 만든 종이 아래턱 원본 사진',sourcePage:13},
  {title:'아래턱과 위턱 연결하기',body:'B 도안의 다리를 접어요. 아래턱 끝부분을 B 위턱 끝부분에 맞춰 붙여요.',check:'두 턱의 끝부분이 맞고, 턱이 접히는 부분은 움직이나요?',help:'풀이나 테이프가 턱이 접히는 부분까지 붙어 있으면 입이 움직이기 어려워요. 자석을 붙이기 전에 턱을 손으로 부드럽게 움직여 봐요. 억지로 잡아당기지 않아요.',alt:'다리를 접은 B 도안 위턱에 E 아래턱을 연결한 원본 사진',sourcePage:13},
  {title:'몸통의 바닥면 붙이기',body:'양면테이프로 B 바닥면을 점선에 맞춰 붙여요.',check:'바닥면이 점선과 맞고, 턱의 움직임을 막지 않나요?',help:'접는 점선과 붙이는 면을 구분해요. 바닥면이 비뚤어졌다면 붙이는 위치부터 사진과 비교해요. 이미 단단히 붙었다면 어른과 함께 확인해요.',alt:'악어 몸통의 바닥면을 점선에 맞춰 붙이는 원본 사진',sourcePage:13},
  {title:'꼬리 붙이고 접기',body:'양면테이프로 꼬리 부분을 붙인 뒤 접어요.',check:'몸통과 꼬리가 연결되고, 악어 모양이 되었나요?',help:'원본 사진에는 바닥 쪽과 위에서 본 모습이 함께 있어요. 꼬리의 붙이는 면을 먼저 맞춘 뒤 접어요. 입이 움직이는지는 다시 한 번 확인해요.',alt:'바닥면과 꼬리를 붙인 악어의 아래쪽과 위쪽 원본 사진',sourcePage:13},
  {title:'두 턱에 자석 붙이기',body:'발포양면테이프로 위턱과 아래턱에 동전자석을 각각 붙여요. 두 자석 모두 N극이 바깥쪽을 향하도록 해요.',check:'위턱도 N극, 아래턱도 N극이 바깥쪽을 향하나요?',help:'색만으로 극을 판단하지 말고 키트의 N·S 표시를 확인해요. 두 자석이 처음부터 붙어 버리면 서로 다른 극이 마주 보는지 살펴요. 턱이 자유롭게 움직이는지도 확인해요. 표시가 없으면 붙이기 전에 어른과 극을 확인해요.',alt:'위턱과 아래턱의 바깥쪽을 향하는 면에 N극 동전자석을 붙인 원본 확대 사진',sourcePage:14},
  {title:'D 도안으로 상자 만들기',body:'D 도안을 접고 양면테이프로 붙여 막대자석을 넣을 상자를 만들어요.',check:'막대자석을 넣고 닫을 자리를 남겨 두었나요?',help:'상자를 모두 닫기 전에 8단계 사진과 비교해요. 막대자석을 넣을 수 있게 한쪽을 열어 두고, 붙이는 면을 맞춰요.',alt:'D 도안으로 만든 상자와 안에 넣는 막대자석의 원본 사진',sourcePage:14},
  {title:'막대자석 방향 맞추기',body:'상자 안에 막대자석을 극에 맞춰 넣고 닫아요.',check:'상자의 S·N 표시와 막대자석의 방향이 맞나요?',help:'닫기 전에 막대자석의 극과 상자의 표시를 확인해요. 거꾸로 넣으면 물고기와 당근 쪽의 극도 바뀌어요. 표시를 확인하기 어렵다면 어른과 함께 살펴요.',alt:'상자 표시의 극에 맞춰 막대자석을 넣는 원본 사진',sourcePage:14},
  {title:'물고기와 당근 붙이기',body:'S극 쪽에는 물고기를, N극 쪽에는 당근을 붙여요. 원본 사진처럼 윗면과 아랫면에 각각 붙여요.',check:'물고기 쪽은 S극, 당근 쪽은 N극인가요?',help:'그림이 자석의 극을 정하는 것은 아니에요. 상자 안의 막대자석 방향이 극을 정해요. 먹이가 반대로 움직이면 8단계로 돌아가 상자의 표시와 자석을 비교해요.',alt:'S극 쪽의 물고기와 N극 쪽의 당근 도안을 붙인 실제 자석 상자 원본 사진',sourcePage:14},
  {title:'악어에게 첫 먹이 주기',body:'악어 입에 물고기를 천천히 가까이 해 보세요. 입이 어떻게 움직이는지 직접 관찰해요.',check:'거리와 방향을 바꾸기 전에, 먼저 본 모습을 기록했나요?',help:'입이 안 움직이면 ①턱이 접히는 부분 ②자석의 고정 상태 ③위·아래턱의 N극과 물고기 쪽 S극 순서로 확인해요. 한 번에 한 가지만 바꾸어 다시 관찰해요. 몸통이 뒤로 움직이지 않아도 입의 모습과 따로 기록해요.',alt:'완성한 종이 자석 악어 입에 S극 쪽 물고기를 가까이 하는 원본 실험 사진',sourcePage:14}
];

const pageTitles = ['먹이를 먹는 자석 악어','이번 주, 작은 과학자','보이지 않는 힘이 보인다면','클립이 모이는 곳을 찾아라','자석의 극, 자세히 보기','만나면 당길까, 밀까?','두 자석 사이의 이야기','만들기 전, 나의 예상','아래턱에서 시작해요','몸통과 두 자석','물고기와 당근 손잡이','악어에게 먹이를 주면','악어의 입 안을 들여다봐요','내가 설명할 수 있을까?','잘 안 될 때, 탐정처럼','우리 집에도 자석이 숨어 있어요','주말 선택 — 악어는 그림을 알아볼까?','나의 탐구 보고서','내 발견을 한 문장으로','일주일을 마친 과학자'];
const week = [
  {day:'월',time:'10–15분',title:'자석의 힘을 찾아요.',description:'클립이 잘 붙는 부분을 찾아 표시해요. 막대자석과 동전자석을 비교하고, 처음 떠오른 생각을 남겨요.',page:3,pageEnd:5,action:'교재 3–5쪽'},
  {day:'화',time:'15분',title:'가까이하면 어떻게 될까요?',description:'자석의 마주 보는 극을 바꾸어 관찰해요. 예상과 실제 모습을 따로 적은 뒤 자석 사이의 힘을 읽어요.',page:6,pageEnd:8,action:'교재 6–8쪽'},
  {day:'수',time:'20–30분',title:'내 손으로 자석 악어를 만들어요.',description:'어른과 함께 실물 키트를 준비하고 사진의 10단계를 따라가요. 자석을 붙이기 전, 턱이 부드럽게 움직이는지 확인해요.',page:9,pageEnd:11,view:'experiment',action:'10단계 만들기'},
  {day:'목',time:'15분',title:'두 가지 먹이를 비교해요.',description:'물고기와 당근을 같은 거리에서 가까이 해 봐요. 입의 움직임과 몸통의 이동을 따로 기록하고, 잘 안되면 한 가지씩 고쳐요.',page:12,pageEnd:15,action:'교재 12–15쪽'},
  {day:'금',time:'15–20분',title:'내 발견을 설명해요.',description:'생활 속 자석을 찾아요. 이번 주 기록을 보며 보고서를 쓰고, 가족에게 자석 악어의 원리를 내 말로 설명해요.',page:16,pageEnd:20,action:'교재 16쪽부터'}
];

const $ = selector => document.querySelector(selector);
let step = 0;
let bookPage = 1;
const journalKey = 'popcorn-lab-charles1-week-20261013-v1';
let storageAvailable = true;

function showView(name, focus = false) {
  const base = name.split('/')[0];
  const resolved = ['teach','build'].includes(base) ? 'lab' : ['reading','watch'].includes(base) ? 'reading' : base;
  const target = $(`[data-screen="${resolved}"]`) || $('[data-screen="home"]');
  const actual = target.dataset.screen;
  for (const screen of document.querySelectorAll('[data-screen]')) screen.hidden = screen !== target;
  for (const link of document.querySelectorAll('[data-view]')) {
    if (link.dataset.view === actual) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  if (actual !== 'experiment' && document.body.classList.contains('classroom')) setClassroom(false);
  if (focus) {
    $('#main').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }
  document.title = `팝콘실험실 샤를 1호 | ${target.querySelector('h1')?.textContent.trim() || '자석 악어의 한 주'}`;
  window.dispatchEvent(new CustomEvent('popcornlab:route',{detail:{name,actual}}));
}

function setClassroom(enabled) {
  document.body.classList.toggle('classroom',enabled);
  $('#class-mode').setAttribute('aria-pressed',String(enabled));
  $('#class-mode').textContent = enabled ? '수업 화면 끝내기' : '수업 화면';
}

function renderStep() {
  const item = assembly[step];
  const number = String(step + 1).padStart(2,'0');
  $('#step-counter').textContent = `${number} / 10`;
  $('#step-label').textContent = `STEP ${number}`;
  $('#step-title').textContent = item.title;
  $('#step-body').textContent = item.body;
  $('#step-check').textContent = item.check;
  $('#step-help-text').textContent = item.help;
  $('#step-help').hidden = true;
  $('#step-help-button').setAttribute('aria-expanded','false');
  $('#step-photo').src = `../assets/assembly-${number}${[2,3,8,9].includes(step) ? '-branded.svg' : '.png'}`;
  $('#step-photo').alt = item.alt;
  $('#step-caption').textContent = `원본 실험 안내 ${item.sourcePage === 13 ? '3' : '4'}쪽 · ${step + 1}단계`;
  $('#assembly-source').textContent = `원본 상세 조립 순서 · ${step + 1} / 10`;
  $('#step-progress-text').textContent = step === 9 ? '관찰은 여기서부터 시작이에요.' : '천천히 사진과 비교해요.';
  $('#step-prev').disabled = step === 0;
  $('#step-next').disabled = step === assembly.length - 1;
  $('#after-assembly').hidden = step !== 9;
  for (const button of document.querySelectorAll('[data-step]')) {
    if (Number(button.dataset.step) === step) button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  }
  if ($('#photo-dialog').open) updateDialogPhoto();
}

function updateDialogPhoto() {
  $('#dialog-image').src = $('#step-photo').src;
  $('#dialog-image').alt = assembly[step].alt;
  $('#photo-dialog-title').textContent = `${step + 1}단계 · ${assembly[step].title}`;
}

function renderWeek() {
  const list = $('#week-list');
  week.forEach((day, index) => {
    const row = document.createElement('article');
    row.className = 'week-day';
    row.innerHTML = `<div class="day-label"><strong>${day.day}</strong><span>${day.time}</span></div><div><h2>${day.title}</h2><p>${day.description}</p></div><div class="day-actions"><a class="button" href="#${day.view || 'book'}" ${day.view ? '' : `data-book-page="${day.page}"`}>${day.action} <span aria-hidden="true">↗</span></a><label class="day-done"><input type="checkbox" data-day="${index}" aria-label="${day.day}요일 활동 해 봤어요"><span>해 봤어요</span></label></div>`;
    list.append(row);
  });
}

function renderBook() {
  const number = String(bookPage).padStart(2,'0');
  $('#book-page').value = String(bookPage);
  $('#book-image').src = `../review/render-sourceframe/page-${number}.png`;
  $('#book-image').alt = `Popcorn Lab Charles 1 학생용 교재 ${bookPage}쪽 · ${pageTitles[bookPage - 1]}`;
  $('#book-caption').textContent = `학생용 교재 ${bookPage} / ${pageTitles.length} · ${pageTitles[bookPage - 1]}`;
  $('#book-prev').disabled = bookPage === 1;
  $('#book-next').disabled = bookPage === pageTitles.length;
  $('#book-frame').scrollTop = 0;
  $('#book-frame').scrollLeft = 0;
}

function updatePair(pair) {
  const same = pair === 'same';
  for (const button of document.querySelectorAll('[data-pair]')) button.setAttribute('aria-pressed',String(button.dataset.pair === pair));
  $('#right-facing').setAttribute('class',same ? 'pole-n' : 'pole-s');
  $('#right-away').setAttribute('class',same ? 'pole-s' : 'pole-n');
  $('#right-facing-label').textContent = same ? 'N' : 'S';
  $('#right-away-label').textContent = same ? 'S' : 'N';
  $('#left-arrow').setAttribute('x1',same ? '266' : '145');
  $('#left-arrow').setAttribute('x2',same ? '145' : '266');
  $('#right-arrow').setAttribute('x1',same ? '394' : '515');
  $('#right-arrow').setAttribute('x2',same ? '515' : '394');
  const headline = same ? '같은 극끼리는 밀어내요.' : '다른 극끼리는 끌어당겨요.';
  $('#pair-title').textContent = headline;
  $('#model-state').textContent = headline;
  $('#magnet-model').setAttribute('aria-label',same ? '같은 극인 N극과 N극은 서로 밀어냅니다.' : '다른 극인 N극과 S극은 서로 끌어당깁니다.');
  $('#pair-symbol').textContent = same ? '← →' : '→ ←';
  $('#pair-detail').textContent = same ? 'N극과 N극, S극과 S극을 마주 보게 하면 서로 밀어내는 힘이 작용해요.' : 'N극과 S극을 마주 보게 하면 서로 끌어당기는 힘이 작용해요.';
}

function updateFood(food) {
  const fish = food === 'fish';
  for (const button of document.querySelectorAll('[data-food]')) button.setAttribute('aria-pressed',String(button.dataset.food === food));
  $('#food-poles').textContent = fish ? '악어 N ↔ 먹이 S' : '악어 N ↔ 먹이 N';
  $('#food-title').textContent = fish ? '다른 극이 만나 끌어당겨요.' : '같은 극이 만나 밀어내요.';
  $('#food-description').textContent = fish ? '물고기의 S극을 가까이 하면 악어 턱의 N극과 끌어당기는 힘이 작용해요. 원본 실험에서는 입을 다물며 물고기를 먹어요.' : '당근의 N극을 가까이 하면 악어 턱의 N극과 밀어내는 힘이 작용해요. 원본 실험에서는 입을 벌린 채 뒤로 밀려나요. 실제 몸통의 이동은 바닥의 마찰이나 손으로 잡는 방법에 따라 달라질 수 있어요.';
}

function journalData() {
  const notes = {};
  for (const field of document.querySelectorAll('[data-note]')) notes[field.dataset.note] = field.value;
  const days = [...document.querySelectorAll('[data-day]')].map(field => field.checked);
  return {version:1,notes,days,savedAt:new Date().toISOString()};
}

function persistJournal() {
  if (!$('#remember-notes').checked) return;
  try {
    localStorage.setItem(journalKey,JSON.stringify(journalData()));
    $('#storage-status').textContent = '현재 브라우저에 저장했어요. 같은 브라우저에서 다시 열면 이어 쓸 수 있어요.';
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    $('#storage-status').textContent = '이 브라우저에서는 저장할 수 없어요. 기록을 텍스트로 내려받아 보관해요.';
  }
}

function restoreJournal() {
  try {
    const saved = JSON.parse(localStorage.getItem(journalKey) || 'null');
    if (!saved || saved.version !== 1 || !saved.notes) return;
    for (const field of document.querySelectorAll('[data-note]')) {
      if (typeof saved.notes[field.dataset.note] === 'string') field.value = saved.notes[field.dataset.note];
    }
    for (const field of document.querySelectorAll('[data-day]')) field.checked = saved.days?.[Number(field.dataset.day)] === true;
    $('#remember-notes').checked = true;
    $('#storage-status').textContent = '이 브라우저에 저장했던 기록을 불러왔어요.';
  } catch {
    storageAvailable = false;
    $('#storage-status').textContent = '이 브라우저의 저장 기록을 불러올 수 없어요. 새 기록은 텍스트로 내려받아 보관해요.';
  }
}

function validResource(item) {
  if (!item || item.verified !== true || typeof item.title !== 'string' || typeof item.url !== 'string') return false;
  try { return ['https:','http:'].includes(new URL(item.url).protocol); } catch { return false; }
}

async function loadResources() {
  const list = $('#resource-list');
  try {
    const response = await fetch('../review/sources.json',{cache:'no-store'});
    if (!response.ok) throw new Error('sources-unavailable');
    const data = await response.json();
    const items = (Array.isArray(data.videos) ? data.videos : []).filter(validResource);
    list.replaceChildren();
    if (items.length === 0) {
      const empty = document.createElement('p');empty.className = 'empty-resources';empty.textContent = '확인된 외부 읽기·영상 자료가 아직 없어요. 교재의 실험 사진과 이 화면의 생활 속 자석 읽기를 먼저 살펴봐요.';list.append(empty);
    }
    if(items.length){const banners=document.createElement('div');banners.dataset.videoBanners=items.map(v=>v.id).join(',');banners.dataset.readingReturn='library';list.append(banners);window.dispatchEvent(new CustomEvent('popcornreading:hydrate'));}
  } catch {
    list.replaceChildren();
    const empty = document.createElement('p');empty.className = 'empty-resources';empty.textContent = '확인된 외부 자료를 아직 연결하지 못했어요. 교재 사진과 생활 속 자석 읽기는 그대로 볼 수 있어요.';list.append(empty);
  }
}

renderWeek();
assembly.forEach((item,index) => {
  const button = document.createElement('button');button.type = 'button';button.dataset.step = String(index);button.textContent = String(index + 1).padStart(2,'0');button.setAttribute('aria-label',`${index + 1}단계 ${item.title}`);$('#step-index').append(button);
});
pageTitles.forEach((title,index) => {
  const option = document.createElement('option');option.value = String(index + 1);option.textContent = `${index + 1}쪽 · ${title}`;$('#book-page').append(option);
});
renderStep();renderBook();restoreJournal();showView(location.hash.slice(1) || 'home');if(!location.hash)location.hash='home';loadResources();

window.addEventListener('hashchange',() => showView(location.hash.slice(1),true));
window.addEventListener('popcornlab:book',event=>{bookPage=Math.max(1,Math.min(pageTitles.length,Number(event.detail.page)||1));renderBook();location.hash='book';});
document.addEventListener('click',event => {
  const bookLink = event.target.closest('[data-book-page]');
  if (bookLink) {bookPage = Number(bookLink.dataset.bookPage);renderBook();}
  const stepLink = event.target.closest('[data-step-link]');
  if (stepLink) {step = Number(stepLink.dataset.stepLink);renderStep();}
  const stepButton = event.target.closest('[data-step]');
  if (stepButton) {step = Number(stepButton.dataset.step);renderStep();}
  const pairButton = event.target.closest('[data-pair]');
  if (pairButton) updatePair(pairButton.dataset.pair);
  const foodButton = event.target.closest('[data-food]');
  if (foodButton) updateFood(foodButton.dataset.food);
});
$('#class-mode').addEventListener('click',() => {
  if (['lab','teach','build'].includes(location.hash.slice(1))) { location.hash = location.hash === '#teach' ? '#lab' : '#teach'; return; }
  const enable = !document.body.classList.contains('classroom');
  if (enable) {if (location.hash !== '#experiment') location.hash = 'experiment';showView('experiment');}
  setClassroom(enable);
  window.scrollTo({top:0,behavior:'instant'});
});
$('#step-prev').addEventListener('click',() => {if (step > 0) {step--;renderStep();}});
$('#step-next').addEventListener('click',() => {if (step < assembly.length - 1) {step++;renderStep();}});
$('#step-help-button').addEventListener('click',() => {const open = $('#step-help').hidden;$('#step-help').hidden = !open;$('#step-help-button').setAttribute('aria-expanded',String(open));});
$('#expand-photo').addEventListener('click',() => {updateDialogPhoto();$('#photo-dialog').showModal();});
$('#close-photo').addEventListener('click',() => $('#photo-dialog').close());
$('#photo-dialog').addEventListener('keydown',event => {
  if (event.key === 'ArrowRight' && step < assembly.length - 1) {event.preventDefault();step++;renderStep();}
  if (event.key === 'ArrowLeft' && step > 0) {event.preventDefault();step--;renderStep();}
});
$('#book-page').addEventListener('change',event => {bookPage = Number(event.target.value);renderBook();});
$('#book-prev').addEventListener('click',() => {if (bookPage > 1) {bookPage--;renderBook();}});
$('#book-next').addEventListener('click',() => {if (bookPage < pageTitles.length) {bookPage++;renderBook();}});
$('#book-zoom').addEventListener('click',() => {const zoom = $('#book-frame').classList.toggle('zoomed');$('#book-zoom').setAttribute('aria-pressed',String(zoom));$('#book-zoom').textContent = zoom ? '전체 쪽 보기 ↙' : '확대하기 ⤢';});
$('#journal').addEventListener('submit',event => event.preventDefault());
document.addEventListener('input',event => {if (event.target.matches('[data-note]')) persistJournal();});
document.addEventListener('change',event => {if (event.target.matches('[data-day]')) persistJournal();});
$('#remember-notes').addEventListener('change',event => {
  if (event.target.checked) {persistJournal();return;}
  try {localStorage.removeItem(journalKey);$('#storage-status').textContent = '브라우저 저장을 껐어요. 지금 적은 글은 남아 있고, 새로고침하면 사라져요.';} catch {$('#storage-status').textContent = '브라우저 저장을 바꿀 수 없어요. 이 기기의 브라우저 설정을 확인해요.';}
});
$('#export-notes').addEventListener('click',() => {
  const labels = {before:'처음 생각',observation:'내가 본 모습',trouble:'고쳐 본 방법',discovery:'새로 알게 된 점과 궁금한 점'};
  const lines = ['POPCORN LAB · CHARLES 1','먹이를 먹는 자석 악어 · 나의 기록',''];
  for (const field of document.querySelectorAll('[data-note]')) lines.push(labels[field.dataset.note],field.value || '(아직 기록하지 않았어요.)','');
  lines.push('이번 주 활동',...[...document.querySelectorAll('[data-day]')].map((field,index) => `${week[index].day}요일: ${field.checked ? '해 봤어요' : '아직 표시하지 않았어요'}`));
  const url = URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');link.href = url;link.download = 'Popcorn_Lab_Charles1_나의기록.txt';document.body.append(link);link.click();link.remove();setTimeout(() => URL.revokeObjectURL(url),1500);
});
$('#clear-notes').addEventListener('click',() => $('#clear-dialog').showModal());
$('#cancel-clear').addEventListener('click',() => $('#clear-dialog').close());
$('#confirm-clear').addEventListener('click',() => {
  try {localStorage.removeItem(journalKey);} catch {storageAvailable = false;}
  for (const field of document.querySelectorAll('[data-note]')) field.value = '';
  for (const field of document.querySelectorAll('[data-day]')) field.checked = false;
  $('#remember-notes').checked = false;
  $('#storage-status').textContent = storageAvailable ? '기록을 지웠어요. 저장을 켜지 않으면 새로고침할 때 기록이 사라져요.' : '화면의 기록을 지웠어요. 브라우저에 남은 저장 기록은 브라우저 설정에서 확인해요.';
  $('#clear-dialog').close();$('#note-before').focus();
});
for (const img of document.querySelectorAll('img[data-fallback]')) img.addEventListener('error',() => {if (img.dataset.fallback) {img.src = img.dataset.fallback;delete img.dataset.fallback;}},{once:true});
