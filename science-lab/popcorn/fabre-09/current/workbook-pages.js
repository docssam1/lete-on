import { photo } from './workbook-photos.js?v=2';
// Student material is authored separately from teacher explanations.
// Only explicitly supplied learner text is inserted into writing spaces.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const text = value => typeof value === 'string' ? value : '';
const brightnessLabels = { off: '꺼짐', dim: '약하게 켜짐', bright: '밝게 켜짐', other: '다른 결과 / 잘 모르겠어요' };
const brightness = value => Object.hasOwn(brightnessLabels, text(value)) ? brightnessLabels[value] : text(value);
export const STUDENT_PAGE_COUNT = 17;
export const pageNames = ['전류 탐험 표지', '먼저 생각해 보기', '연결과 밝기 비교', '전지 하나 빼기', '몸과 부품 조립', '다섯 선 연결', '스위치 관찰', '직렬과 병렬의 개념', '내 생각으로 개념 확인', '연결과 생활', '탐구 보고서', '결론과 나의 의견', '활동 평가', '생각을 넓히는 탐구', '전지 두 개의 다른 쓰임', '에디슨과 테슬라', '궁궐에 켜진 전등'];
const stepPages = { welcome: 1, safe: 2, predict: 2, compare: 3, parts: 5, paper: 5, socket: 5, switch: 5, wire1: 6, wire2: 6, junction: 6, wirelow: 6, wirehigh: 6, assembly: 6, test: 7, record: 7, concept: 8, quiz: 9, report: 12, finish: 13 };

export const workbookNoteFields = [
  { key: 'predictionReason', label: '이렇게 예상한 까닭', page: 2 },
  { key: 'trouble', label: '잘 안된 점과 고쳐 본 방법', page: 7 },
  { key: 'changedThought', label: '오늘 바뀐 생각', page: 12 },
  { key: 'nextQuestion', label: '더 알아보고 싶은 질문', page: 12 }
];
export function workbookPageForStep(id) { return Object.hasOwn(stepPages, id) ? stepPages[id] : 1; }

const external = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}<span class="wb-link-mark"> 새 창</span></a>`;
const video = (id, url, label, note = '영상으로 다시 살펴요.') => `<aside class="wb-video-bridge"><a href="${url}" target="_blank" rel="noopener noreferrer"><img src="./assets/video-qr/${id}.png" alt="${label} 영상 QR"></a><div><strong>${label}</strong><p>${note}</p><a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://','')}</a></div></aside>`;
const step = (index, label) => `<button type="button" data-workbook-step="${index}">${label}</button>`;
const read = (id, label) => `<button type="button" data-workbook-read="${id}">${label}</button>`;
const inlineVideo = (id, label, url, note = '') => `<section class="wb-inline-video"><h3>${label}</h3><button type="button" data-book-video="${id}">이 쪽에서 영상 보기</button><div class="wb-video-player" aria-label="${label} 영상 재생 영역"></div><p>${external(url, '새 창에서 영상 보기')}</p>${note ? `<p class="wb-small">${note}</p>` : ''}</section>`;
const coachWords = [
  '안녕, 나는 팝콘 코미야. 전지의 연결을 살피고 내 손으로 밝기가 달라지는 스탠드를 만들어 보자!',
  '아는 말부터 꺼내 보자. 예상은 나중에 바뀌어도 괜찮아. 전지를 넣기 전에는 안전 약속부터 확인해 줘.',
  '이번에는 전지 수만 세지 말고 어느 극끼리 이어졌는지 살펴봐. 같은 전구를 보며 직접 느낀 밝기를 적으면 돼.',
  '빈자리를 새 전선으로 메우지 말고 그대로 살펴보자. 남은 전지에서 전구를 지나 돌아오는 길을 손가락으로 따라가 봐.',
  '창은 빛이 나오는 곳이고, 홈은 판을 끼우는 곳이야. 종이와 전선이 홈을 가리지 않는지 살펴보자.',
  '선을 한꺼번에 잇지 말고 시작과 끝을 하나씩 짚어 줘. 전지는 비워 둔 채 확인하고, 완성한 뒤 보호자와 다시 살펴보자.',
  '가운데, 1단, 2단을 같은 자리에서 비교해 보자. 예상과 다르게 보였다면 그대로 기록하고 무엇을 확인했는지 남겨 줘.',
  '관찰한 길을 떠올리며 직렬과 병렬을 말로 설명해 보자. 전기 회로, 전류, 스위치가 하는 일을 내 실험과 이어 보면 돼.',
  '어떤 관찰을 근거로 그 설명을 골랐니? 다른 설명도 하나씩 검토하고, 네 생각을 글이나 회로의 길로 나타내 보자.',
  '전구가 잠깐 밝았다는 것과 전지를 오래 쓴다는 것은 다른 관찰이야. 생활 속 제품도 이름만 보고 단정하지 말고 연결을 확인해 보자.',
  '보고서는 내가 한 일을 다른 사람에게 알려 주는 글이야. 예상과 방법을 되짚은 뒤, 직접 본 결과를 빈칸에 남겨 보자.',
  '처음 생각과 지금 생각이 달라도 괜찮아. 어떤 관찰 때문에 바뀌었는지 설명하면 내 발견이 더 또렷해져.',
  '잘한 일과 더 연습할 일을 스스로 골라 보자. 혼자 공부했다면 발표는 내 말로 설명하기, 토론은 두 생각 비교하기로 돌아봐도 좋아.',
  '관찰로 말할 수 있는 것과 아직 모르는 것을 나누어 보자. 답 하나를 빨리 고르기보다 근거와 다음 확인 방법을 설명해 줘.',
  '전지끼우개의 겉모습만 보고 연결을 정하면 헷갈릴 수 있어. 두 극에서 시작해 전선을 따라가며 이야기와 내 스탠드를 비교해 보자.',
  '이번 이야기에서 병렬로 잇는 것은 전등이야. 전지의 연결 방법과 전류의 방향을 서로 다른 기준으로 정리해 보자.',
  '작은 전구에서 궁궐의 불빛까지 탐험했구나! 전지와 발전기는 다르지만 전등이 켜지려면 연결된 길이 필요하다는 것을 떠올려 봐.'
];
const coach = number => number <= STUDENT_PAGE_COUNT ? `<aside class="wb-coach" data-pose="${number === 17 ? 'praise' : 'talk'}"><span class="wb-coach-portrait" role="img" aria-label="실험복을 입은 팝콘 코미"></span><div class="wb-coach-bubble"><strong>팝콘 코미</strong><p>${coachWords[number - 1]}</p></div></aside>` : '';
function circuit(mode, removed = false) {
  const title = mode === 'one' ? '전지 한 개' : mode === 'parallel' ? '전지 두 개 병렬' : '전지 두 개 직렬';
  const name = removed ? `${mode}-cell-removed` : mode === 'one' ? 'one-cell-preparation' : `${mode}-cells-preparation`;
  return `<img class="wb-circuit-photo" src="./assets/learning-visuals/${name}.png" alt="${title}${removed ? '에서 전지 하나를 뺀' : ''} 연결 준비 모습 · AI 실사형 설명 이미지, 관찰 밝기는 표시하지 않음">`;
}
const partsFigure = `<img class="wb-parts-photo" src="./assets/learning-visuals/parts-flat-photo.png" alt="A 바닥판, B 전구판, C 윗판, D 앞판, E 뒷판, F 옆판 두 장의 역할을 구별한 AI 실사형 설명 이미지">`;
const wiringFigure = `<a href="./assets/learning-visuals/wiring-five-photo.png" target="_blank" rel="noopener noreferrer" aria-label="다섯 선 배선 이미지 크게 보기"><img class="wb-wiring-photo" src="./assets/learning-visuals/wiring-five-photo.png" alt="전지가 없는 두 전지끼우개, 전구와 가운데 꺼짐 스위치의 다섯 선. 두 끼우개 사이 연결점에서 1단으로 갈라지고 전구의 다른 접점은 스위치 가운데 공통 단자로 이어짐"></a>`;

function readingChunks(value, maxLines = 22) {
  const chunks = [];
  let chunk = '', line = 1, width = 0;
  for (const character of value) {
    const cost = /[\u0000-\u007f]/.test(character) ? .6 : 1;
    const wrap = character === '\n' || width + cost > 35;
    if (wrap && line >= maxLines && chunk) { chunks.push(chunk); chunk = ''; line = 1; width = 0; }
    else if (wrap) { line++; width = 0; }
    chunk += character;
    if (character !== '\n' && character !== '\r') width += cost;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

/** Empty rendering produces seventeen pages. Long learner text adds readable continuation pages. */
export function renderStudentPages(record = {}, { blank = false } = {}) {
  record = blank ? {} : object(record);
  const notes = object(record.workbookNotes), comparisons = object(record.comparisonNotes);
  const completed = new Set(Array.isArray(record.observations) ? record.observations : []);
  const kind = record.recordKind === 'real' ? 'real' : 'screen';
  const sets = object(record.recordSets);
  const results = object(sets[kind] || record.records);
  const extraPages = [];
  function writing(value = '', { lines = 3, label = '', page = 1, narrow = false, className = '' } = {}) {
    const ownText = blank ? '' : text(value);
    const capacity = Math.max(28, lines * (narrow ? 19 : 36));
    const tooLong = ownText.length > capacity || ownText.split(/\r?\n/).length > lines;
    let content = escape(ownText), continuation = '';
    if (tooLong) {
      const start = extraPages.length + STUDENT_PAGE_COUNT + 1;
      readingChunks(ownText).forEach((chunk, index) => extraPages.push({ label, origin: page, chunk, part: index + 1 }));
      content = '';
      continuation = `<p class="wb-continuation-note">작성한 기록은 ‘내 기록 이어쓰기’ ${start}쪽에서 읽어요.</p>`;
    }
    const rules = Array.from({ length: lines }, (_, index) => `<span class="wb-rule" style="--wb-row:${index + 1}"></span>`).join('');
    return `${continuation}<div class="wb-writing ${className}${content ? ' wb-filled' : ''}" style="--wb-lines:${lines}"${label ? ` aria-label="${escape(label)}"` : ''}><span class="wb-rules" aria-hidden="true">${rules}</span>${content || '<span class="wb-empty" aria-hidden="true"></span>'}</div>`;
  }
  function comparison(id, label, page) {
    const entry = object(comparisons[id]);
    const value = brightness(entry.brightness);
    const missing = completed.has(id) && !text(entry.brightness) && !text(entry.reason);
    return `<div class="wb-result-space">${missing ? '<span class="wb-record-status">관찰함 · 내용 미기록</span>' : ''}${writing(value, { lines: 2, label: `${label}에서 본 밝기`, page, narrow: true })}</div>`;
  }
  const page = (number, title, deck, body, extraClass = '') => `<section class="workbook-page ${extraClass}" data-page="${number}" aria-labelledby="wb-student-${number}-title">${number === 1 ? '<header class="wb-cover-masthead"><div class="wb-cover-brand">GFIELD <span>SCIENCE LAB</span></div><p>전류 탐험 <strong><span class="wb-unit-word">UNIT</span> 03</strong></p></header>' : `<header class="wb-page-head"><p class="wb-kicker">GFIELD SCIENCE LAB · 전류 탐험 <span class="wb-page-index" aria-hidden="true">${String(number).padStart(2, '0')}<small>쪽</small></span></p><h2 id="wb-student-${number}-title">${title}</h2><p class="wb-deck">${deck}</p></header>`}<div class="wb-page-body">${body}</div>${coach(number)}<footer class="wb-page-foot"><span>GFIELD SCIENCE LAB · ${blank ? '학생용' : '내 기록'}</span><span>${number}</span></footer></section>`;
  const checked = value => `<span class="wb-square" aria-hidden="true">${value ? '✓' : ''}</span>`;
  const practice = record.practice === 'real' ? 'real' : record.practice === 'screen' ? 'screen' : '';
  const checks = Array.isArray(practice === 'real' ? record.checks : record.screenChecks) ? (practice === 'real' ? record.checks : record.screenChecks) : [];
  const pages = [
    page(1, '2단 밝기 스탠드', '내 손으로 만들고, 밝기가 달라지는 까닭을 찾아요.', `
      <div class="wb-cover-hero"><div class="wb-cover-copy"><p class="wb-cover-eyebrow">만들어 보는 과학</p><h2 class="wb-cover-title" id="wb-student-1-title"><span>2단 밝기</span> <span>스탠드</span></h2><p class="wb-cover-question">전지의 연결을 바꾸면,<br>빛은 어떻게 달라질까요?</p><p class="wb-cover-deck">내 손으로 만들고,<br>밝기가 달라지는 까닭을 찾아요.</p></div>${photo('stand-off', '별 모양 창 아래에서 스위치를 찾아요.', 'wb-cover-photo')}</div>
      <div class="wb-cover-goals"><span>전지의 직렬·병렬 연결을 구별해요.</span><span>스탠드의 밝기 조절을 설명해요.</span></div>
      <p class="wb-cover-route">예상 → 연결 비교 → 만들기 → 관찰 → 설명</p>
      <div class="wb-cover-space" aria-hidden="true"></div>
      <p class="wb-small">전구와 전지를 연결하는 작은 실험에서<br>생활 속 기기와 궁궐의 전등 이야기까지 만나 보아요.</p>
      <nav class="wb-page-links" aria-label="1쪽 실험 연결">${step(1, '안전 확인하며 시작하기')}${step(2, '내 예상 남기기')}</nav>
    `, 'wb-opening-page'),
    page(2, '먼저 생각해 보아요', '알고 있는 말과 나의 예상을 꺼낸 뒤, 안전하게 시작해요.', `
      <section class="wb-section wb-prior-questions"><h3>세 가지 질문으로 시작해요</h3><p><strong>1.</strong> 전기 부품을 연결하여 전기가 흐르게 하는 것을 무엇이라고 하나요?</p>${writing('', { lines: 1, label: '선행 질문 1', page: 2 })}<p><strong>2.</strong> 전기 회로에 흐르는 전기를 무엇이라고 하나요?</p>${writing('', { lines: 1, label: '선행 질문 2', page: 2 })}<p><strong>3.</strong> 전기 회로가 잘 작동하려면 회로가 어떻게 연결되어야 하나요?</p>${writing('', { lines: 1, label: '선행 질문 3', page: 2 })}</section>
      <section class="wb-section wb-predict"><h3>전지 두 개면 언제나 더 밝을까요?</h3><p class="wb-small">같은 전구와 같은 종류·상태의 전지로 직렬과 병렬을 비교해요.</p><div class="wb-choice-line"><span>□ 직렬이 더 밝음</span><span>□ 병렬이 더 밝음</span><span>□ 비슷함</span><span>□ 모르겠음</span></div>${writing(text(record.prediction), { lines: 1, label: '내가 고른 예상', page: 2 })}<h4>이렇게 예상한 까닭</h4>${writing(notes.predictionReason, { lines: 2, label: '나의 예상과 까닭', page: 2 })}</section>
      <section class="wb-section wb-safety"><h3>만들기 전, 안전 약속</h3><ul class="wb-safety-list"><li>${checked(checks.includes(0))} 연결·조립 중에는 전지를 빼 두어요.</li><li>${checked(checks.includes(1))} 마른 손과 책상에서 알맞은 1.5V 전지를 써요.</li><li>${checked(checks.includes(2))} 보호자와 연결 및 전구의 3V 규격을 확인해요.</li></ul><p class="wb-small">뜨거우면 멈추고 만지지 않은 채 어른에게 알려요. 전지 제거는 보호자가 확인해요.</p></section>
      <div class="wb-method"><span>오늘의 활동</span><span>${checked(practice === 'screen')} 화면으로 연습</span><span>${checked(practice === 'real')} 실물 교구로 실험</span></div>
      ${video('think', 'https://m.site.naver.com/1e5DW', '먼저 생각해 보기')}
      <nav class="wb-page-links" aria-label="2쪽 실험 연결">${step(1, '화면에서 안전 확인')}${step(2, '내 예상 남기기')}</nav>
    `),
    page(3, '연결을 바꾸어 비교해요', '같은 전구 · 같은 종류와 상태의 전지. 연결 방법만 바꾸어요.', `
      <div class="wb-activity-band"><strong>실험 1</strong><span>한 개 → 두 개 직렬 → 두 개 병렬</span></div>
      <div class="wb-three-col wb-comparison-diagrams">${[['one', '전지 한 개'], ['series', '전지 두 개 직렬'], ['parallel', '전지 두 개 병렬']].map(([id, title]) => `<figure><figcaption>${title}</figcaption>${circuit(id)}</figure>`).join('')}</div>
      <p class="wb-small">AI 실사형 준비 이미지예요. 밝기 결과는 나타내지 않았어요. 관찰 뒤 8쪽의 원본 사진과 비교해요.</p>
      <table class="wb-table wb-observation-table"><thead><tr><th scope="col">연결 방법</th><th scope="col">직접 본 밝기</th><th scope="col">선택 메모</th></tr></thead><tbody>${[['one', '전지 한 개'], ['series', '두 개 직렬'], ['parallel', '두 개 병렬']].map(([id, label]) => `<tr><th scope="row">${label}</th><td>${comparison(id, label, 3)}</td><td>${writing(object(comparisons[id]).reason, { lines: 2, label: `${label}에서 살펴본 점`, page: 3, narrow: true })}</td></tr>`).join('')}</tbody></table>
      <div class="wb-photo-side">${photo('empty-kit', '실제 전지끼우개 · 사진에서 스프링 접점을 찾아보세요.')}<section><h3>그림과 교구를 이어 보아요</h3><p>전지끼우개의 +·− 표시와 선을 찾아요. 전구를 지나 되돌아오는 길을 따라가요.</p><p class="wb-small">병렬 비교는 화면에서 해요. 예상과 달라도 본 그대로 기록해요.</p></section></div>
      ${video('compare', 'https://m.site.naver.com/1e5DZ', '전지 연결 실험')}<nav class="wb-page-links" aria-label="3쪽 실험 연결">${step(3, '연결을 바꾸며 관찰하기')}${external('https://m.site.naver.com/1e5DZ', '실험 영상 보기')}</nav>
    `),
    page(4, '전지 하나를 빼 보아요', '빈자리를 다른 선으로 잇지 않아요. 남은 길을 색연필로 따라가요.', `
      <div class="wb-activity-band"><strong>실험 2</strong><span>꺼졌을까? 계속 켜져 있을까?</span></div>
      <div class="wb-two-col wb-removal-grid">${[['series', '직렬에서 하나 빼기'], ['parallel', '병렬에서 하나 빼기']].map(([mode, label]) => { const id = `${mode}-remove`; return `<section><h3>${label}</h3><figure class="wb-removal-figure">${circuit(mode, true)}<figcaption>전구를 지나는 닫힌 길이 남았나요?</figcaption></figure><h4>직접 본 밝기</h4>${comparison(id, label, 4)}<h4>선택 메모 · 길을 따라 보며</h4>${writing(object(comparisons[id]).reason, { lines: 2, label: `${label}의 까닭`, page: 4, narrow: true })}</section>`; }).join('')}</div>
      <section class="wb-section wb-think"><h3>두 연결에서 달랐던 것은?</h3>${writing('', { lines: 2, label: '전지를 하나 뺀 두 회로의 차이', page: 4 })}</section>
      ${video('connection', 'https://m.site.naver.com/1e5E2', '전지 연결 방법')}<nav class="wb-page-links" aria-label="4쪽 실험 연결">${step(3, '전지 하나 빼 보고 비교하기')}${external('https://m.site.naver.com/1e5E2', '연결 방법 영상')}</nav>
    `),
    page(5, '사진을 보며 준비해요', '종이·소켓·스위치를 붙이고, 조립할 자리를 찾아요.', `
      ${photo('empty-kit', '전지가 빠진 실제 교구 · 전구판 B, 앞판 D, 빈 전지끼우개를 찾아요.', 'wb-large-photo')}
      <div class="wb-build-steps"><section><h3><span>1</span> □ 창 뒤에 종이 붙이기</h3><p>C·D·E 각 한 장과 F 두 장의 창 뒤에 붙여요. 홈과 스위치 구멍은 비워요.</p></section><section><h3><span>2</span> □ B판에 소켓과 전구 놓기</h3><p>소켓의 서로 다른 두 접점에 전선을 잇고 고정해요.</p></section><section><h3><span>3</span> □ D판에 스위치 끼우기</h3><p>가운데 꺼짐 위치에 두고, 공통·1단·2단 단자를 찾아요.</p></section></div>
      <figure class="wb-parts-figure wb-secondary-figure">${partsFigure}<figcaption>AI 실사형 부품 설명 · 실제 홈은 교구에서 확인해요.</figcaption></figure>
      ${video('build', 'https://m.site.naver.com/1e5E0', '스탠드 조립')}<nav class="wb-page-links" aria-label="5쪽 실험 연결">${step(4, '3D에서 부품 찾아보기')}${external('https://m.site.naver.com/1e5E0', '조립 영상 보기')}</nav>
    `),
    page(6, '다섯 선을 하나씩 이어요', '전지는 빼 둔 채 연결해요. 선의 시작과 끝을 짚어 확인해요.', `
      <div class="wb-wiring-pair">${photo('empty-kit', '접점과 빨간·검은 선을 실제 교구에서 찾으세요.')}<figure class="wb-wiring-figure">${wiringFigure}<figcaption>AI 실사형 배선 설명 · 두 끼우개 사이가 ③ 연결점이에요. 실제 단자 표시는 교구에서 확인해요.</figcaption></figure></div>
      <table class="wb-table wb-wire-table"><thead><tr><th scope="col">선</th><th scope="col">시작</th><th scope="col">끝</th><th scope="col">확인</th></tr></thead><tbody><tr><th scope="row">1</th><td>첫 전지끼우개 빨간 선</td><td>전구 접점 하나</td><td>□</td></tr><tr><th scope="row">2</th><td>전구의 다른 접점</td><td>스위치 공통 단자</td><td>□</td></tr><tr><th scope="row">3</th><td>첫 전지끼우개 검은 선</td><td>둘째 전지끼우개 빨간 선</td><td>□</td></tr><tr><th scope="row">4</th><td>두 전지끼우개 사이 연결점</td><td>스위치 1단 단자</td><td>□</td></tr><tr><th scope="row">5</th><td>둘째 전지끼우개 검은 선</td><td>스위치 2단 단자</td><td>□</td></tr></tbody></table>
      <section class="wb-section wb-think"><h3>이제 판을 끼워요</h3><p>F 두 장 사이에 C는 위, B는 가운데, A는 아래에 끼워요.<br>D를 앞에, E를 뒤에 끼우고 전선은 A 가운데에 넣어요.</p><p class="wb-small">□ 전선이 눌리지 않아요. □ 금속끼리 닿지 않아요.<br>□ 전지를 넣기 전 보호자와 연결을 확인해요.</p></section>
      <nav class="wb-page-links" aria-label="6쪽 실험 연결">${step(8, '3D에서 선 하나씩 연결하기')}${step(13, '판 조립 살펴보기')}</nav>
    `),
    page(7, '내 스탠드를 시험해요', '연결과 규격을 보호자와 확인한 뒤 전지를 넣고 시험해요.', `
      <div class="wb-test-scene">${photo('stand-open', '시험 준비: 전지를 넣은 뒤의 내부 모습. 조립 중에는 빼 두어요.')}<div><h3>스위치 세 위치를 눌러요</h3><div class="wb-switch-positions"><span>Ⅰ<br>1단</span><span>○<br>가운데</span><span>Ⅱ<br>2단</span></div><p>같은 자리에서 전구의 밝기를 비교해요. 직접 본 결과를 아래에 남겨요.</p></div></div>
      <div class="wb-method"><span>이 기록은</span><span>${checked(!blank && Object.values(results).some(value => text(value)) && kind === 'screen')} 화면에서 본 결과</span><span>${checked(!blank && Object.values(results).some(value => text(value)) && kind === 'real')} 실물에서 본 결과</span></div>
      <table class="wb-table wb-switch-table"><thead><tr><th scope="col">스위치 위치</th><th scope="col">직접 본 밝기</th><th scope="col">전지 개수 · 연결된 길</th></tr></thead><tbody>${[['off', '가운데'], ['low', '1단'], ['high', '2단']].map(([id, label]) => `<tr><th scope="row">${label}</th><td>${writing(brightness(results[id]), { lines: 2, label: `${label}에서 직접 본 밝기`, page: 7, narrow: true })}</td><td>${writing('', { lines: 2, label: `${label}에서 연결된 전지와 길`, page: 7, narrow: true })}</td></tr>`).join('')}</tbody></table>
      <section class="wb-section"><h3>잘 안됐다면? 고쳐 본 방법을 남겨요.</h3><p class="wb-small">문제 → 확인한 곳 → 다시 본 결과</p>${writing(notes.trouble, { lines: 3, label: '문제와 확인한 곳, 다시 본 결과', page: 7 })}</section>
      <p class="wb-note">뜨거우면 실험을 멈추고 만지지 않은 채 어른에게 알려요. 전지 제거는 보호자가 확인해요.</p>
      <nav class="wb-page-links" aria-label="7쪽 실험 연결">${step(14, '스위치 눌러 관찰하기')}${step(15, '내 관찰 기록하기')}</nav>
    `),
    page(8, '직렬과 병렬을 설명해요', '3–4쪽에서 관찰한 밝기와 전류의 길을 떠올려요.', `
      <div class="wb-reference-photos" data-workbook-reference><div class="wb-three-col">${photo('single-cell', '전지 한 개')}${photo('series-cells', '전지 두 개 직렬')}${photo('parallel-cells', '전지 두 개 병렬')}</div><p class="wb-small">사진의 노란 빛은 원본의 시각 효과예요. 밝기 측정값이 아니며, 내가 본 결과를 대신하지 않아요.</p></div>
      <section class="wb-section wb-key-terms"><h3>먼저, 세 가지 말을 정리해요</h3><p><strong>전기 회로</strong>는 전기가 흐르도록 전기 부품을 이은 것이고, 흐르는 전기를 <strong>전류</strong>라고 해요. 전구가 켜지려면 전구를 지나 전지로 되돌아오는 <strong>닫힌 길</strong>이 이어져 있어야 해요.</p></section>
      <div class="wb-concept-columns"><section><h3>직렬 · 서로 다른 극끼리</h3><p>전지를 한 줄로 이어 전압이 더해져요. 같은 전구에서는 전지 한 개일 때보다 더 밝아져요. 전지 하나를 빼고 빈자리를 그대로 두면 길이 끊어져 불이 꺼져요.</p></section><section><h3>병렬 · 같은 극끼리</h3><p>+극끼리, −극끼리 연결해요. 전압이 한 개일 때와 비슷해 같은 전구의 밝기도 비슷해요. 전지 하나를 빼도 남은 전지와 전구를 잇는 닫힌 길이 있으면 불이 켜져요.</p></section></div>
      <p class="wb-condition">밝기는 같은 새 1.5V 전지와 같은 3V 전구로, 전지 한 개와 두 개를 비교한 결과예요.</p>
      <p class="wb-small wb-switch-principle">스탠드의 1단은 전지 한 개의 길, 2단은 두 개 직렬의 길을 골라요. 가운데에서는 길이 끊어져 불이 꺼져요.</p>

      ${video('connection', 'https://m.site.naver.com/1e5E2', '전지 연결 방법')}
      <nav class="wb-page-links" aria-label="8쪽 실험 연결">${step(16, '연결 원리 살펴보기')}</nav>
    `),
    page(9, '내 생각으로 개념을 확인해요', '설명을 하나씩 검토하고, 내 관찰을 근거로 생각을 정리해요.', `
      <p class="wb-condition">같은 새 1.5V 전지와 같은 3V 전구로, 전지 한 개와 두 개를 비교한 실험을 떠올려요.</p>
      <section class="wb-section wb-source-question"><h3>확인문제</h3><p>다음 중 전지 연결 방법에 대한 설명으로 <strong>옳지 않은 것</strong>을 고르세요.</p><div class="wb-source-options">${[
        '전지의 직렬 연결은 전지 여러 개를 서로 다른 극끼리 연결하는 방법이다.',
        '전지의 직렬 연결은 전지를 많이 연결할수록 전류의 세기가 커져 전구의 밝기가 밝아진다.',
        '전지의 직렬 연결은 전지 1개를 빼도 전구의 불이 그대로 켜져 있다.',
        '전지의 병렬 연결은 전지를 같은 극끼리 연결한 후 다시 연결하는 방법이다.',
        '전지의 병렬 연결은 전지를 여러 개 연결해도 전구의 밝기가 비슷하다.'
      ].map((choice, index) => `<label><input type="radio" name="wb-source-choice" value="${index + 1}"><span class="wb-source-choice-text"><b>${['①', '②', '③', '④', '⑤'][index]}</b> ${choice}</span></label>`).join('')}</div><button type="button" data-book-check="source">고른 설명 확인하기</button><p data-book-feedback hidden aria-live="polite"></p></section>
      <section class="wb-section"><h3>고른 까닭과 검토한 내용을 써요</h3><p class="wb-small">관찰한 결과를 근거로 설명해요. 바꿔야 할 설명이 있다면 내 말로 고쳐 써요.</p>${writing('', { lines: 3, label: '확인문제 선택의 까닭과 설명 고쳐 쓰기', page: 9 })}</section>
      <section class="wb-section"><h3>필요하면, 회로의 길로 설명해요</h3><p class="wb-small">말로 설명하기 어렵다면 전지와 전구를 간단히 그리고, 전류가 지날 수 있는 길을 표시해요.</p>${writing('', { lines: 3, label: '확인문제 회로의 길 그리기', page: 9, className: 'wb-diagram-space' })}</section>
      <nav class="wb-page-links" aria-label="9쪽 실험 연결">${step(17, '화면에서 개념 확인')}</nav>
    `),
    page(10, '연결에 따라 쓰임도 달라져요', '밝기와 사용 시간을 구별하고, 생활 속 연결을 찾아요.', `
      <section class="wb-section"><h3>두 연결의 특징을 비교해 완성해요</h3><p class="wb-small">밝기는 3쪽 관찰을 참고해요. 사용 시간은 배운 개념으로 정리하며, 직접 시간을 잰 결과와 구별해요.</p><table class="wb-table wb-life-comparison"><thead><tr><th scope="col">비교할 것</th><th scope="col">전지 두 개 직렬</th><th scope="col">전지 두 개 병렬</th></tr></thead><tbody>${[['전구의 밝기','밝기'],['사용 시간 · 개념 정리','사용 시간']].map(([label,key])=>`<tr><th scope="row">${label}</th><td>${writing('',{lines:1,label:`직렬의 ${key}`,page:10,narrow:true})}</td><td>${writing('',{lines:1,label:`병렬의 ${key}`,page:10,narrow:true})}</td></tr>`).join('')}</tbody></table></section>
      <p class="wb-condition">같은 종류·상태의 전지, 같은 알맞은 전구로 비교해요. 사용 시간은 전지 상태와 기기에 따라 달라요. 잠깐 본 밝기만으로 오래 켜지는지 확인할 수는 없어요.</p>
      <div class="wb-two-col wb-life-photos">${photo('remote-control', '리모컨의 전지함')}${photo('door-lock', '도어록의 전지함')}</div>
      <p class="wb-small">같은 이름의 제품도 모델마다 연결이 달라요. 전지함의 극 표시와 접점을 어른과 함께 살펴요.</p>
      <div class="wb-two-col wb-life-entry-list"><section><h3>직렬로 쓰는 경우 세 가지</h3>${writing('', { lines: 3, label: '생활 속 직렬 연결 사례 세 가지', page: 10, narrow: true })}</section><section><h3>병렬로 쓰는 경우 세 가지</h3>${writing('', { lines: 3, label: '생활 속 병렬 연결 사례 세 가지', page: 10, narrow: true })}</section></div>
      ${video('life', 'https://m.site.naver.com/1e5E3', '생활 속 전지 연결')}
    `),
    page(11, '내 실험을 보고서로 남겨요', '예상과 실험 방법을 되짚고, 직접 본 결과를 적어요.', `
      <div class="wb-report-fields"><section><h3>실험 주제</h3><p>2단 밝기 스탠드 — 전지 연결에 따라 밝기는 어떻게 달라질까요?</p></section><section><h3>가설</h3><p>전지 1개를 연결하면 전구가 어둡고, 전지 2개를 <span class="wb-inline-blank">　　　　　</span> 연결하면 밝을 것이다.</p></section></div>
      <section class="wb-section"><h3>내가 한 실험 방법</h3><ol class="wb-report-methods"><li>C·D·E 각 한 장과 F 두 장의 창에 종이를 붙이고, D판에 스위치를 끼운다.</li><li>소켓의 두 접점에 전선을 잇고, B판에 소켓과 전구를 고정한다.</li><li>전구의 한쪽은 첫 전지끼우개 빨간 선에, 다른 쪽은 스위치 공통 단자에 잇는다.</li><li>첫 전지끼우개 검은 선과 둘째 전지끼우개 빨간 선을 잇고, 그 연결점에 가지선을 더한다.</li><li>가지선은 스위치 1단, 둘째 전지끼우개 검은 선은 2단 단자에 잇는다.</li><li>F 두 장 사이에 C·B·A를 위·가운데·아래에 끼우고 D·E로 앞뒤를 닫는다. 보호자와 확인한 뒤 전지를 넣고 세 위치를 시험한다.</li></ol><p class="wb-small">연결·조립 중에는 전지를 빼 두어요. 실제 단자 위치는 교구 표시를 확인해요.</p></section>
      <section class="wb-section wb-report-result-lines"><h3>실험 결과</h3><p>1. 스위치를 <span class="wb-inline-blank">　　　　　　</span>에 놓으면 전구의 불이 꺼진다.</p><p>2. 1단에서는 전지 <span class="wb-inline-blank">　　　</span>개가 연결되고, 전구는</p>${writing('', { lines: 1, label: '보고서 1단 관찰 결과', page: 11 })}<p>3. 2단에서는 전지 두 개가 <span class="wb-inline-blank">　　　　　</span> 연결되고, 전구는</p>${writing('', { lines: 1, label: '보고서 2단 관찰 결과', page: 11 })}<p class="wb-small">7쪽의 내 관찰을 보며 채워요. 예상과 달라도 본 그대로 써요.</p></section>
      <nav class="wb-page-links" aria-label="11쪽 실험 연결">${step(15, '관찰 기록 돌아보기')}${step(18, '내 설명 쓰기')}</nav>
    `),
    page(12, '결론과 나의 의견', '내 관찰이 어떤 설명을 뒷받침하는지 써 보아요.', `
      <section class="wb-section"><h3>실험 결론 · 밝기를 어떻게 조절했나요?</h3><p class="wb-small">1단과 2단에서 연결된 전지 수, 밝기, 전류의 길을 함께 설명해요.</p>${writing(record.report, { lines: 4, label: '나의 스탠드 설명', page: 12 })}</section>
      <section class="wb-section"><h3>1. 해결한 문제와 나의 시도</h3><p class="wb-small">7쪽에서 확인한 곳을 떠올리며, 도움이 된 방법을 골라 써요.</p>${writing('', { lines: 2, label: '해결한 문제와 도움이 된 방법', page: 12 })}</section>
      <section class="wb-section"><h3>2. 새로 알게 된 점 · 오늘 바뀐 생각</h3>${writing(notes.changedThought, { lines: 3, label: '오늘 바뀐 생각', page: 12 })}</section>
      <section class="wb-section"><h3>3. 더 알아보고 싶은 질문</h3>${writing(notes.nextQuestion, { lines: 2, label: '더 알아보고 싶은 질문', page: 12 })}</section>
      <nav class="wb-page-links" aria-label="12쪽 실험 연결">${step(18, '내 설명과 생각 남기기')}</nav>
    `),
    page(13, '나의 활동을 돌아보아요', '배운 내용과 활동에 참여한 모습을 스스로 살펴요.', `
      <p class="wb-evaluation-prompt">각 항목에 <strong>우수 · 보통 · 노력 요함</strong> 중 하나를 골라요.</p>
      <table class="wb-table wb-evaluation-table"><thead><tr><th scope="col">돌아볼 내용</th><th scope="col">나의 평가</th></tr></thead><tbody>${[
        '나는 전지의 직렬 연결과 병렬 연결의 차이점을 알았다.',
        '나는 스탠드의 밝기를 조절하는 방법을 알았다.',
        '나는 수업 시간에 규칙을 지켜가며 발표했다.',
        '나는 수업 시간에 친구들과 싸우지 않고 토론했다.',
        '나는 전지를 직렬 연결할 때와 병렬 연결할 때 전구의 밝기를 비교하기 위해 노력하였다.',
        '나는 전지의 직렬 연결과 병렬 연결의 특징을 알기 위해 노력하였다.',
        '나는 우리 주위에서 전지를 직렬 연결과 병렬 연결하는 경우를 알기 위해 노력하였다.',
        '나는 밝기를 2단으로 조절하는 스탠드를 완성하기 위해 노력하였다.',
        '나는 전지를 연결하는 방법과 전류 세기의 관계를 알기 위해 노력하였다.'
      ].map((item, index) => `<tr><th scope="row"><span>${index + 1}.</span> ${item}</th><td><select data-book-evaluation="${index + 1}" aria-label="활동 평가 ${index + 1}"><option value="">선택</option><option>우수</option><option>보통</option><option>노력 요함</option><option>해당 없음</option></select></td></tr>`).join('')}</tbody></table>
      <p class="wb-small">혼자 했다면 3번은 ‘내 말로 설명하기’, 4번은 ‘두 가지 생각 비교하기’로 돌아봐요. 해 보지 않은 활동은 ‘해당 없음’을 골라도 돼요.</p>
      <section class="wb-section wb-core-concepts"><h3>핵심 개념을 내 말로 완성해요</h3><p>직렬은 서로 <span class="wb-inline-blank">같은 / 다른</span> 극끼리 한 줄로 잇고,<br>병렬은 서로 <span class="wb-inline-blank">같은 / 다른</span> 극끼리 이어요.</p><p>같은 전구에서 전지를 직렬로 연결하면 전구의 밝기가 <span class="wb-inline-blank">　　　　　</span>지고, 병렬로 연결하면 전구의 밝기가 <span class="wb-inline-blank">　　　　　</span>하다.</p></section>
      <nav class="wb-page-links" aria-label="13쪽 실험 연결">${step(19, '오늘의 실험 마무리')}</nav>
    `),
    page(14, '영재성 탐구 · 생각을 넓혀요', '추가 탐구 문제 · 관찰로 추리하고 실험을 계획해요.', `
      <section class="wb-inquiry-card"><h3>탐구 1 · 꺼졌다면 전구가 고장일까요?</h3><p>A와 B는 같은 새 1.5V 전지 두 개와 같은 전구를 쓴 정상 회로예요. 전지를 뺀 뒤에도 전구와 전선에는 고장이 없어요. 하나는 직렬, 다른 하나는 병렬이며 처음에는 둘 다 켜졌어요.</p><p>각 회로에서 전지 하나를 빼고 빈자리를 잇지 않았더니 <strong>A는 꺼지고, B는 계속 켜졌어요.</strong></p><h4>A와 B의 연결을 추리하고, 남은 닫힌 길로 설명해요.</h4>${writing('', { lines: 3, label: '탐구 1 연결 추리와 닫힌 길 설명', page: 14 })}<h4>“A가 꺼졌으니 전구가 고장 났다.” 이 말에 동의하나요?</h4>${writing('', { lines: 2, label: '탐구 1 전구 고장 주장 검토', page: 14 })}</section>
      <section class="wb-inquiry-card"><h3>탐구 2 · 더 오래 켜짐을 확인했을까요?</h3><p>친구가 잠깐 밝기를 비교한 뒤 “병렬이 더 오래 켜진다는 것을 확인했어.”라고 말했어요.</p><h4>직접 관찰한 것과 아직 확인하지 못한 것을 나누어요.</h4>${writing('', { lines: 2, label: '탐구 2 관찰한 것과 미확인한 것', page: 14 })}<h4>같게 할 것 · 바꿀 것 · 측정할 것 · 끝내는 기준과 기록 방법을 정해요.</h4>${writing('', { lines: 3, label: '탐구 2 공정한 비교와 종료 기준 계획', page: 14 })}<p class="wb-small">여기서는 계획만 세워요. 전지를 오래 연결해 두는 실물 실험은 하지 않아요.</p></section>
    `),
    page(15, '전지 두 개의 다른 쓰임', '과학 읽을거리 1 · 더 밝게, 또는 더 오래', `
      <div class="wb-two-col wb-article-figure">${photo('remote-control', '전지의 극과 접점을 함께 살펴보아요.')}${photo('stand-open', '우리 스탠드는 어느 연결점을 골라 쓸까요?')}</div>
      <div class="wb-article-prose"><p>손전등 속 전지는 왜 줄지어 있을까요? 같은 전지의 서로 다른 극을 잇는 직렬연결에서는 전압이 더해져요. 사용 전압이 맞는 전구라면 전지 한 개일 때보다 밝아질 수 있지요.</p><p>같은 극끼리 잇는 병렬연결은 달라요. 같은 종류와 상태의 전지를 쓰면 전압은 한 개일 때와 비슷하고, 전구를 더 오래 켜는 데 도움이 돼요. 전지 수만 세지 말고 연결 방법을 살펴봐야 해요.</p><p>오늘의 2단 스탠드는 직렬로 이은 전지의 연결점을 이용해 전지 한 개를 쓰는 길과 두 개를 쓰는 길을 골라요. 전지끼우개가 나란히 놓여 있다고 병렬연결인 것은 아니에요. 제품마다 연결은 다르니 전지함의 극 표시와 연결선을 함께 살펴봐요.</p></div>
      <section class="wb-section wb-think"><h3>이야기에서 내 실험으로</h3><p>전지의 개수는 같은데 밝기가 달라진다면, 무엇을 먼저 살펴볼까요?</p>${writing('', { lines: 2, label: '전지 두 개의 다른 쓰임을 읽고 든 생각', page: 15 })}</section>
      ${video('life', 'https://m.site.naver.com/1e5E3', '생활 속 전지 연결')}
      <p class="wb-small wb-article-sources">실험·사진 자료: 사용자 제공 팩토사이언스 플러스 뉴턴 9호 · Unit 3, 45–52쪽. 연결의 원리를 바탕으로 새로 쓴 이야기예요.</p>
      <nav class="wb-page-links" aria-label="15쪽 읽을거리 연결">${read('battery', '읽을거리 창에서 보기')}</nav>
    `),
    page(16, '전구 하나에서 도시의 불빛으로', '과학 읽을거리 2 · 에디슨과 테슬라가 고민한 전기', `
      <figure class="wb-parallel-photo"><a class="parallel-photo-link" href="./assets/learning-visuals/parallel-lamps-photo.png" target="_blank" rel="noopener noreferrer" aria-label="전등 병렬연결 이미지 크게 보기 · 새 창"><img class="parallel-lamps-photo" src="./assets/learning-visuals/parallel-lamps-photo.png" width="2172" height="724" alt="전지함에서 나온 빨간 선과 검은 선에 전구 세 개가 각각 연결되어 있어요. 전구마다 왼쪽 소켓 접점에는 빨간 선, 오른쪽 접점에는 검은 선이 이어져요."><span class="parallel-photo-zoom">접점과 전선 크게 보기 ↗</span></a><figcaption>전등의 병렬연결 · 전구마다 두 전선 사이에 각각의 갈래가 있어요.<br>저전압 교구를 나타낸 AI 제작 설명 이미지예요.</figcaption></figure>
      <div class="wb-article-prose"><p>방 하나의 불을 꺼도 옆방은 밝게 남아 있지요. 에디슨은 오래 쓸 수 있는 전구와 함께, 여러 전등을 각각 켜고 끌 수 있는 병렬회로를 연구했어요. 여기서 병렬로 잇는 것은 전등이에요. 앞에서 살펴본 전지의 병렬연결과 구별해요.</p><p>도시에는 전기를 만드는 곳과 멀리 보내는 방법도 필요했어요. 에디슨은 직류 전력 공급을 발전시켰고, 테슬라는 교류 전동기와 교류 전력 기술을 발전시키는 데 기여했어요. 직류는 한 방향으로, 교류는 방향이 주기적으로 바뀌며 흘러요.</p><p>직렬·병렬은 부품을 연결하는 방법, 직류·교류는 전류의 방향에 관한 말이에요. 서로 다른 두 가지 기준이지요.</p></div>
      <div class="wb-concept-columns"><section><h3>직렬 · 병렬</h3><p>부품을 어떻게 이어 놓았을까?</p></section><section><h3>직류 · 교류</h3><p>전류의 방향은 어떻게 달라질까?</p></section></div>
      ${video('history-city', 'https://www.youtube.com/watch?v=Js6CZPD5XfE', '에디슨과 테슬라', '영어 영상 · 한국어 자막 제공 여부는 확인되지 않았어요.')}
      ${inlineVideo('Js6CZPD5XfE', '영상 · 에디슨과 테슬라', 'https://www.youtube.com/watch?v=Js6CZPD5XfE', '미국 에너지부가 소개하는 영어 영상이에요. 한국어 자막 제공 여부는 확인되지 않았어요.')}
      <section class="wb-section wb-think"><h3>도시를 상상해 보아요</h3><p>도시의 모든 전등이 한 줄로 이어져 있다면 어떤 불편이 생길까요?</p>${writing('', { lines: 2, label: '도시의 전등 연결에 관한 생각', page: 16 })}</section>
      <p class="wb-small wb-article-sources">이야기 확인 자료: ${external('https://edison.rutgers.edu/component/content/article/electric-lamp?Itemid=101&amp;catid=91', '럿거스대 에디슨 문서 · 전구')}, ${external('https://www.energy.gov/articles/war-currents-ac-vs-dc-power', '미국 에너지부 · 직류와 교류')}.<br>영상 소개: ${external('https://www.energy.gov/articles/video-who-was-better-inventor-tesla-or-edison', '미국 에너지부')} · 영어 영상, 한국어 자막 제공 여부는 확인되지 않았어요.</p>
      <nav class="wb-page-links" aria-label="16쪽 읽을거리 연결">${read('city', '읽을거리 창에서 보기')}</nav>
    `),
    page(17, '1887년, 궁궐에 켜진 전등', '과학 읽을거리 3 · 우리나라 최초의 전등이 켜지던 날', `
      <figure class="wb-history-photo"><img src="assets/history/geoncheonggung.jpg" alt="오늘의 경복궁 건청궁 곤녕합 전경"><figcaption>오늘의 건청궁 곤녕합 · 1887년 당시 사진은 아니에요.<br>사진: 국가유산청 궁능유적본부 · 공공누리 제1유형</figcaption></figure>
      <div class="wb-article-prose"><p>1887년, 경복궁 건청궁에 전등이 켜졌어요. 조선 정부가 에디슨전등회사의 설비를 들여와 밝힌 전깃불이었지요.</p><p>전등만 가져오면 되었을까요? 발전기와 전선, 설비를 다룰 사람도 필요했어요. 첫 전깃불에는 여러 기술과 사람의 일이 함께 이어져 있었지요.</p><p>우리 스탠드도 전지, 전선, 스위치, 전구가 함께 일해요. 전기를 공급하는 장치는 달라도 전기가 흐를 길을 완성해야 불이 켜져요.</p></div>
      ${video('history-palace', 'https://www.youtube.com/watch?v=mmD34B3cr1I', '건청궁 점등 · YTN 한국어 보도', '한국어 보도 · 2022년 재현 점등 행사예요.')}
      ${inlineVideo('mmD34B3cr1I', '영상 · 건청궁 점등 이야기', 'https://www.youtube.com/watch?v=mmD34B3cr1I', '한국어 보도 · 2022년 재현 점등 행사예요. 1887년 당시 영상은 아니에요.')}
      <section class="wb-section wb-think"><h3>첫 전깃불 아래에서</h3><p>전등이 처음 들어온 날, 사람들은 무엇을 가장 신기해했을까요?</p>${writing('', { lines: 2, label: '건청궁 첫 전등 이야기를 읽고 든 생각', page: 17 })}</section>
      <p class="wb-small wb-article-sources">이야기 확인 자료: ${external('https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_40&amp;levelId=kc_o403950', '국사편찬위원회 · 우리 역사넷')}.<br>영상 안내: ${external('https://www.ytn.co.kr/_ln/0106_202205181130447897', 'YTN · 2022년 재현 점등 보도')}.</p>
      <nav class="wb-page-links" aria-label="17쪽 읽을거리 연결">${read('palace', '읽을거리 창에서 보기')}${step(19, '내 실험으로 돌아가기')}</nav>
    `)
  ];
  extraPages.forEach((extra, index) => pages.push(page(index + STUDENT_PAGE_COUNT + 1, '내 기록 이어쓰기', `${extra.origin}쪽 · ${escape(extra.label)}${extra.part > 1 ? ` · 계속 ${extra.part}` : ''}`, `<p class="wb-continuation-text">${escape(extra.chunk)}</p>`, 'wb-continuation-page')));
  return pages.join('');
}
