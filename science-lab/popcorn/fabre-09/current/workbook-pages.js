import { photo } from './workbook-photos.js?v=2';
// Student material is authored separately from teacher explanations.
// Only explicitly supplied learner text is inserted into writing spaces.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const text = value => typeof value === 'string' ? value : '';
const brightnessLabels = { off: '꺼짐', dim: '약하게 켜짐', bright: '밝게 켜짐', other: '다른 결과 / 잘 모르겠어요' };
const brightness = value => Object.hasOwn(brightnessLabels, text(value)) ? brightnessLabels[value] : text(value);
const stepPages = { welcome: 1, safe: 1, predict: 1, compare: 2, parts: 4, paper: 4, socket: 4, switch: 4, wire1: 5, wire2: 5, junction: 5, wirelow: 5, wirehigh: 5, assembly: 5, test: 6, record: 6, concept: 7, quiz: 7, report: 7, finish: 8 };

export const workbookNoteFields = [
  { key: 'predictionReason', label: '이렇게 예상한 까닭', page: 1 },
  { key: 'trouble', label: '잘 안된 점과 고쳐 본 방법', page: 6 },
  { key: 'changedThought', label: '오늘 바뀐 생각', page: 8 },
  { key: 'nextQuestion', label: '더 알아보고 싶은 질문', page: 8 }
];
export function workbookPageForStep(id) { return Object.hasOwn(stepPages, id) ? stepPages[id] : 1; }

const external = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}<span class="wb-link-mark"> 새 창</span></a>`;
const video = (id, url, label) => `<aside class="wb-video-bridge"><a href="${url}" target="_blank" rel="noopener noreferrer"><img src="./assets/video-qr/${id}.png" alt="${label} 영상 QR"></a><div><strong>${label}</strong><p>영상으로 다시 살펴요.</p><a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://','')}</a></div></aside>`;
const step = (index, label) => `<button type="button" data-workbook-step="${index}">${label}</button>`;
const read = (id, label) => `<button type="button" data-workbook-read="${id}">${label}</button>`;
const battery = (x, y, removed = false) => `<rect x="${x}" y="${y - 16}" width="48" height="32" rx="3" class="${removed ? 'wb-cell-removed' : 'wb-cell'}"/>${removed ? `<text x="${x + 24}" y="${y + 6}" text-anchor="middle" font-size="16">빈자리</text>` : `<text x="${x + 10}" y="${y + 7}" text-anchor="middle" font-size="21">+</text><text x="${x + 38}" y="${y + 7}" text-anchor="middle" font-size="21">−</text>`}`;
const lamp = (x, y) => `<circle cx="${x}" cy="${y}" r="20" class="wb-bulb"/><path d="M${x - 14} ${y - 14}l28 28m0-28-28 28"/>`;

function circuit(mode, removed = false) {
  const parallel = mode === 'parallel';
  const title = mode === 'one' ? '전지 한 개' : parallel ? '전지 두 개 병렬' : '전지 두 개 직렬';
  const wires = mode === 'one'
    ? '<path d="M24 50H96 M144 50H216V165H140 M100 165H24V50"/>'
    : parallel
      ? '<path d="M24 50H96 M144 50H216V165H140 M100 165H24V50 M24 104H96 M144 104H216"/>'
      : '<path d="M24 50H51 M99 50H141 M189 50H216V165H140 M100 165H24V50"/>';
  const cells = mode === 'one' ? battery(96, 50) : parallel ? battery(96, 50, removed) + battery(96, 104) : battery(51, 50, removed) + battery(141, 50);
  return `<svg viewBox="0 0 240 212" class="wb-circuit-svg" role="img" aria-label="${title}${removed ? '에서 전지 하나를 뺀' : ''} 회로. 전구의 관찰 결과는 표시하지 않은 그림"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round">${wires}${cells}${lamp(120, 165)}</g></svg>`;
}

const starWindow = (x, y) => Array.from({ length: 16 }, (_, index) => { const angle = index * Math.PI / 8 - Math.PI / 2, radius = index % 2 ? 10 : 20; return `${index ? 'L' : 'M'}${(x + Math.cos(angle) * radius).toFixed(2)} ${(y + Math.sin(angle) * radius).toFixed(2)}`; }).join(' ') + 'Z';
const partsFigure = `<svg viewBox="0 0 660 186" role="img" aria-label="A 바닥판, B 전구판, C 윗판, D 앞판, E 뒷판, F 옆판 두 장의 역할을 구별한 부품 개념도. 창은 여덟 꼭짓점의 별 모양">
  <g fill="#f7f8f1" stroke="currentColor" stroke-width="2">
    <rect x="13" y="51" width="87" height="54"/><rect x="122" y="51" width="87" height="54"/><circle cx="165" cy="77" r="10"/>
    <rect x="231" y="51" width="87" height="54"/><path d="${starWindow(274, 78)}"/>
    <rect x="341" y="28" width="69" height="100"/><path d="${starWindow(375, 62)}"/><rect x="365" y="94" width="22" height="14"/>
    <rect x="432" y="28" width="69" height="100"/><path d="${starWindow(466, 73)}"/>
    <rect x="543" y="20" width="57" height="100"/><rect x="531" y="28" width="57" height="100"/><path d="${starWindow(559, 73)}"/>
  </g><g fill="currentColor" font-size="18" font-weight="650" text-anchor="middle"><text x="57" y="159">A 바닥판</text><text x="166" y="159">B 전구판</text><text x="275" y="159">C 윗판</text><text x="375" y="159">D 앞판</text><text x="466" y="159">E 뒷판</text><text x="566" y="159">F 옆판 ×2</text></g>
</svg>`;

const wiringFigure = `<svg viewBox="0 0 520 314" role="img" aria-label="전지 두 개의 직렬 연결점과 스위치 공통·1단·2단 단자에 이어지는 다섯 연결. 스위치는 가운데 꺼짐 위치인 배선 개념도">
  <g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
    <path d="M80 56H35V155H88 M132 155H180V280H360V230 M170 56H260 M215 56V180H300 M350 56H480V180H420"/>
    <rect x="80" y="37" width="90" height="38" rx="4" fill="#fff"/><rect x="260" y="37" width="90" height="38" rx="4" fill="#fff"/>
    <circle cx="110" cy="155" r="22" fill="#fff"/><path d="M95 140l30 30m0-30-30 30"/>
    <rect x="274" y="152" width="172" height="108" rx="6" stroke-dasharray="6 5" stroke-width="1.5"/>
    <circle cx="300" cy="180" r="5" fill="#fff"/><circle cx="420" cy="180" r="5" fill="#fff"/><circle cx="360" cy="230" r="5" fill="#fff"/><path d="M360 225V193"/>
    <circle cx="215" cy="56" r="4" fill="currentColor"/>
  </g><g fill="currentColor" text-anchor="middle" font-size="18"><text x="125" y="16" font-size="16">전지끼우개 1</text><text x="305" y="16" font-size="16">전지끼우개 2</text><text x="125" y="31" font-size="13">(전지 없음)</text><text x="305" y="31" font-size="13">(전지 없음)</text><text x="97" y="63">+</text><text x="154" y="63">−</text><text x="278" y="63">+</text><text x="335" y="63">−</text><text x="109" y="201">전구</text><text x="300" y="207">1단</text><text x="420" y="207">2단</text><text x="397" y="240">공통</text><text x="361" y="306">스위치 · 가운데</text></g>
  <g fill="#fff" stroke="currentColor" stroke-width="1.5"><circle cx="35" cy="107" r="13"/><circle cx="224" cy="280" r="13"/><circle cx="215" cy="33" r="13"/><circle cx="215" cy="127" r="13"/><circle cx="480" cy="119" r="13"/></g>
  <g fill="currentColor" text-anchor="middle" font-size="17" font-weight="750"><text x="35" y="113">1</text><text x="224" y="286">2</text><text x="215" y="39">3</text><text x="215" y="133">4</text><text x="480" y="125">5</text></g>
</svg>`;

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

/** Empty rendering produces eight pages. Long learner text adds readable continuation pages. */
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
      const start = extraPages.length + 9;
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
  const page = (number, title, deck, body, extraClass = '') => `<section class="workbook-page ${extraClass}" data-page="${number}" aria-labelledby="wb-student-${number}-title">${number === 1 ? '<header class="wb-cover-masthead"><div class="wb-cover-brand">GFIELD <span>SCIENCE LAB</span></div><p>전류 탐험 <strong><span class="wb-unit-word">UNIT</span> 03</strong></p></header>' : `<header class="wb-page-head"><p class="wb-kicker">GFIELD SCIENCE LAB · 전류 탐험 <span class="wb-page-index" aria-hidden="true">${String(number).padStart(2, '0')}<small>쪽</small></span></p><h2 id="wb-student-${number}-title">${title}</h2><p class="wb-deck">${deck}</p></header>`}<div class="wb-page-body">${body}</div><footer class="wb-page-foot"><span>GFIELD SCIENCE LAB · ${blank ? '학생용' : '내 기록'}</span><span>${number}</span></footer></section>`;
  const checked = value => `<span class="wb-square" aria-hidden="true">${value ? '✓' : ''}</span>`;
  const practice = record.practice === 'real' ? 'real' : record.practice === 'screen' ? 'screen' : '';
  const checks = Array.isArray(practice === 'real' ? record.checks : record.screenChecks) ? (practice === 'real' ? record.checks : record.screenChecks) : [];
  const pages = [
    page(1, '2단 밝기 스탠드', '내 손으로 만들고, 밝기가 달라지는 까닭을 찾아요.', `
      <div class="wb-cover-hero"><div class="wb-cover-copy"><p class="wb-cover-eyebrow">만들어 보는 과학</p><h2 class="wb-cover-title" id="wb-student-1-title"><span>2단 밝기</span> <span>스탠드</span></h2><p class="wb-cover-question">전지의 연결을 바꾸면,<br>빛은 어떻게 달라질까요?</p><p class="wb-cover-deck">내 손으로 만들고,<br>밝기가 달라지는 까닭을 찾아요.</p></div>${photo('stand-off', '별 모양 창 아래에서 스위치를 찾아요.', 'wb-cover-photo')}</div>
      <div class="wb-cover-goals"><span>전지의 직렬·병렬 연결을 구별해요.</span><span>스탠드의 밝기 조절을 설명해요.</span></div>
      <div class="wb-cover-start"><section class="wb-section wb-predict"><h3><span class="wb-activity-number">01</span> 먼저 예상해요</h3><p class="wb-start-question">전지 두 개면 언제나 더 밝을까요?</p><div class="wb-choice-line"><span>□ 직렬이 더 밝음</span><span>□ 병렬이 더 밝음</span><span>□ 비슷함</span><span>□ 모르겠음</span></div>${writing(text(record.prediction), { lines: 1, label: '내가 고른 예상', page: 1, narrow: true })}<h4>이렇게 예상한 까닭</h4>${writing(notes.predictionReason, { lines: 2, label: '나의 예상과 까닭', page: 1, narrow: true })}</section>
      <section class="wb-section wb-safety"><h3><span class="wb-activity-number">02</span> 만들기 전, 안전 약속</h3><ul class="wb-safety-list"><li>${checked(checks.includes(0))} 연결·조립 중에는 전지를 빼 두어요.</li><li>${checked(checks.includes(1))} 마른 손과 책상에서 알맞은 1.5V 전지를 써요.</li><li>${checked(checks.includes(2))} 보호자와 연결 및 전구의 3V 규격을 확인해요.</li></ul><p class="wb-small">뜨거우면 멈추고 만지지 않은 채 어른에게 알려요. 전지 제거는 보호자가 확인해요.</p></section></div>
      <div class="wb-method"><span>오늘의 활동</span><span>${checked(practice === 'screen')} 화면으로 연습</span><span>${checked(practice === 'real')} 실물 교구로 실험</span></div><p class="wb-cover-route">예상 → 연결 비교 → 만들기 → 관찰 → 설명</p>
      <nav class="wb-page-links" aria-label="1쪽 실험 연결">${step(1, '안전 확인하며 시작하기')}${step(2, '내 예상 남기기')}</nav>
    `, 'wb-opening-page'),
    page(2, '연결을 바꾸어 비교해요', '같은 전구 · 같은 종류와 상태의 전지. 연결 방법만 바꾸어요.', `
      <div class="wb-activity-band"><strong>실험 1</strong><span>한 개 → 두 개 직렬 → 두 개 병렬</span></div>
      <div class="wb-three-col wb-comparison-diagrams">${[['one', '전지 한 개'], ['series', '전지 두 개 직렬'], ['parallel', '전지 두 개 병렬']].map(([id, title]) => `<figure><figcaption>${title}</figcaption>${circuit(id)}</figure>`).join('')}</div>
      <p class="wb-small">밝기를 표시하지 않은 관찰용 그림이에요. 실사 비교 사진은 관찰 뒤 7쪽에서 살펴봐요.</p>
      <table class="wb-table wb-observation-table"><thead><tr><th scope="col">연결 방법</th><th scope="col">직접 본 밝기</th><th scope="col">선택 메모</th></tr></thead><tbody>${[['one', '전지 한 개'], ['series', '두 개 직렬'], ['parallel', '두 개 병렬']].map(([id, label]) => `<tr><th scope="row">${label}</th><td>${comparison(id, label, 2)}</td><td>${writing(object(comparisons[id]).reason, { lines: 2, label: `${label}에서 살펴본 점`, page: 2, narrow: true })}</td></tr>`).join('')}</tbody></table>
      <div class="wb-photo-side">${photo('empty-kit', '실제 전지끼우개 · 사진에서 스프링 접점을 찾아보세요.')}<section><h3>그림과 교구를 이어 보아요</h3><p>전지끼우개의 +·− 표시와 선을 찾아요. 전구를 지나 되돌아오는 길을 따라가요.</p><p class="wb-small">병렬 비교는 화면에서 해요. 예상과 달라도 본 그대로 기록해요.</p></section></div>
      ${video('compare', 'https://m.site.naver.com/1e5DZ', '전지 연결 실험')}<nav class="wb-page-links" aria-label="2쪽 실험 연결">${step(3, '연결을 바꾸며 관찰하기')}${external('https://m.site.naver.com/1e5DZ', '실험 영상 보기')}</nav>
    `),
    page(3, '전지 하나를 빼 보아요', '빈자리를 다른 선으로 잇지 않아요. 남은 길을 색연필로 따라가요.', `
      <div class="wb-activity-band"><strong>실험 2</strong><span>꺼졌을까? 계속 켜져 있을까?</span></div>
      <div class="wb-two-col wb-removal-grid">${[['series', '직렬에서 하나 빼기'], ['parallel', '병렬에서 하나 빼기']].map(([mode, label]) => { const id = `${mode}-remove`; return `<section><h3>${label}</h3><figure class="wb-removal-figure">${circuit(mode, true)}<figcaption>전구를 지나는 닫힌 길이 남았나요?</figcaption></figure><h4>직접 본 밝기</h4>${comparison(id, label, 3)}<h4>선택 메모 · 길을 따라 보며</h4>${writing(object(comparisons[id]).reason, { lines: 2, label: `${label}의 까닭`, page: 3, narrow: true })}</section>`; }).join('')}</div>
      <section class="wb-section wb-think"><h3>두 연결에서 달랐던 것은?</h3>${writing('', { lines: 2, label: '전지를 하나 뺀 두 회로의 차이', page: 3 })}</section>
      ${video('connection', 'https://m.site.naver.com/1e5E2', '전지 연결 방법')}<nav class="wb-page-links" aria-label="3쪽 실험 연결">${step(3, '전지 하나 빼 보고 비교하기')}${external('https://m.site.naver.com/1e5E2', '연결 방법 영상')}</nav>
    `),
    page(4, '사진을 보며 준비해요', '종이·소켓·스위치를 붙이고, 조립할 자리를 찾아요.', `
      ${photo('empty-kit', '전지가 빠진 실제 교구 · 전구판 B, 앞판 D, 빈 전지끼우개를 찾아요.', 'wb-large-photo')}
      <div class="wb-build-steps"><section><h3><span>1</span> □ 창 뒤에 종이 붙이기</h3><p>C·D·E·F 두 장의 창 뒤에 붙여요. 홈과 스위치 구멍은 비워요.</p></section><section><h3><span>2</span> □ B판에 소켓과 전구 놓기</h3><p>소켓의 서로 다른 두 접점에 전선을 잇고 고정해요.</p></section><section><h3><span>3</span> □ D판에 스위치 끼우기</h3><p>가운데 꺼짐 위치에 두고, 공통·1단·2단 단자를 찾아요.</p></section></div>
      <figure class="wb-parts-figure wb-secondary-figure">${partsFigure}<figcaption>부품의 역할을 구별한 보조 그림 · 실제 홈은 교구에서 확인해요.</figcaption></figure>
      ${video('build', 'https://m.site.naver.com/1e5E0', '스탠드 조립')}<nav class="wb-page-links" aria-label="4쪽 실험 연결">${step(4, '3D에서 부품 찾아보기')}${external('https://m.site.naver.com/1e5E0', '조립 영상 보기')}</nav>
    `),
    page(5, '다섯 선을 하나씩 이어요', '전지는 빼 둔 채 연결해요. 선의 시작과 끝을 짚어 확인해요.', `
      <div class="wb-wiring-pair">${photo('empty-kit', '접점과 빨간·검은 선을 실제 교구에서 찾으세요.')}<figure class="wb-wiring-figure">${wiringFigure}<figcaption>연결 역할을 보여 주는 보조 그림 · 실제 단자 배열은 교구 표시를 확인해요.</figcaption></figure></div>
      <table class="wb-table wb-wire-table"><thead><tr><th scope="col">선</th><th scope="col">시작</th><th scope="col">끝</th><th scope="col">확인</th></tr></thead><tbody><tr><th scope="row">1</th><td>첫 전지끼우개 빨간 선</td><td>전구 접점 하나</td><td>□</td></tr><tr><th scope="row">2</th><td>전구의 다른 접점</td><td>스위치 공통 단자</td><td>□</td></tr><tr><th scope="row">3</th><td>첫 전지끼우개 검은 선</td><td>둘째 전지끼우개 빨간 선</td><td>□</td></tr><tr><th scope="row">4</th><td>두 전지끼우개 사이 연결점</td><td>스위치 1단 단자</td><td>□</td></tr><tr><th scope="row">5</th><td>둘째 전지끼우개 검은 선</td><td>스위치 2단 단자</td><td>□</td></tr></tbody></table>
      <section class="wb-section wb-think"><h3>이제 판을 끼워요</h3><p>F 두 장 사이에 C는 위, B는 가운데, A는 아래에 끼워요.<br>D를 앞에, E를 뒤에 끼우고 전선은 A 가운데에 넣어요.</p><p class="wb-small">□ 전선이 눌리지 않아요. □ 금속끼리 닿지 않아요.<br>□ 전지를 넣기 전 보호자와 연결을 확인해요.</p></section>
      <nav class="wb-page-links" aria-label="5쪽 실험 연결">${step(8, '3D에서 선 하나씩 연결하기')}${step(13, '판 조립 살펴보기')}</nav>
    `),
    page(6, '내 스탠드를 시험해요', '연결과 규격을 보호자와 확인한 뒤 전지를 넣고 시험해요.', `
      <div class="wb-test-scene">${photo('stand-open', '시험 준비: 전지를 넣은 뒤의 내부 모습. 조립 중에는 빼 두어요.')}<div><h3>스위치 세 위치를 눌러요</h3><div class="wb-switch-positions"><span>Ⅰ<br>1단</span><span>○<br>가운데</span><span>Ⅱ<br>2단</span></div><p>같은 자리에서 전구의 밝기를 비교해요. 직접 본 결과를 아래에 남겨요.</p></div></div>
      <div class="wb-method"><span>이 기록은</span><span>${checked(!blank && Object.values(results).some(value => text(value)) && kind === 'screen')} 화면에서 본 결과</span><span>${checked(!blank && Object.values(results).some(value => text(value)) && kind === 'real')} 실물에서 본 결과</span></div>
      <table class="wb-table wb-switch-table"><thead><tr><th scope="col">스위치 위치</th><th scope="col">직접 본 밝기</th><th scope="col">전지 개수 · 연결된 길</th></tr></thead><tbody>${[['off', '가운데'], ['low', '1단'], ['high', '2단']].map(([id, label]) => `<tr><th scope="row">${label}</th><td>${writing(brightness(results[id]), { lines: 2, label: `${label}에서 직접 본 밝기`, page: 6, narrow: true })}</td><td>${writing('', { lines: 2, label: `${label}에서 연결된 전지와 길`, page: 6, narrow: true })}</td></tr>`).join('')}</tbody></table>
      <section class="wb-section"><h3>잘 안됐다면? 고쳐 본 방법을 남겨요.</h3><p class="wb-small">문제 → 확인한 곳 → 다시 본 결과</p>${writing(notes.trouble, { lines: 3, label: '문제와 확인한 곳, 다시 본 결과', page: 6 })}</section>
      <p class="wb-note">뜨거우면 실험을 멈추고 만지지 않은 채 어른에게 알려요. 전지 제거는 보호자가 확인해요.</p>
      <nav class="wb-page-links" aria-label="6쪽 실험 연결">${step(14, '스위치 눌러 관찰하기')}${step(15, '내 관찰 기록하기')}</nav>
    `),
    page(7, '사진과 내 관찰을 비교해요', '2–3쪽의 관찰을 마친 뒤, 원본 교재의 비교 사진을 살펴요.', `
      <div class="wb-reference-photos" data-workbook-reference><div class="wb-three-col">${photo('single-cell', '전지 한 개')}${photo('series-cells', '전지 두 개 직렬')}${photo('parallel-cells', '전지 두 개 병렬')}</div><p class="wb-small">사진의 노란 빛은 원본의 시각 효과예요. 밝기 측정값이 아니며, 내가 본 결과를 대신하지 않아요.</p></div>
      <section class="wb-section wb-thinking-questions"><h3>길을 따라, 말로 설명해 보세요</h3><div><p><strong>1.</strong> 직렬에서 전지 하나를 빼면 전구는 어떻게 될까요?</p>${writing('', { lines: 1, label: '생각 확인 1', page: 7 })}</div><div><p><strong>2.</strong> 같은 새 전지 두 개를 병렬로 이으면, 한 개일 때와 밝기가 어떻게 다를까요?</p>${writing('', { lines: 1, label: '생각 확인 2', page: 7 })}</div><div><p><strong>3.</strong> 스위치를 가운데에 놓으면 왜 불이 꺼질까요?</p>${writing('', { lines: 1, label: '생각 확인 3', page: 7 })}</div></section>
      <section class="wb-section wb-think"><h3>1단과 2단의 밝기가 달라진 까닭</h3><p class="wb-small">6쪽의 내 관찰을 근거로, 전지 개수와 전류의 길을 설명해요.</p>${writing(text(record.report), { lines: 3, label: '나의 스탠드 설명', page: 7 })}</section>
      <nav class="wb-page-links" aria-label="7쪽 실험 연결">${step(16, '연결 원리 살펴보기')}${step(18, '내 설명 쓰기')}</nav>
    `),
    page(8, '생활 속 전지를 찾아요', '사진에서 +·− 극과 접점을 찾아보세요. 어떤 길로 이어질까요?', `
      <div class="wb-two-col wb-life-photos">${photo('remote-control', '리모컨의 전지함')}${photo('door-lock', '도어록의 전지함')}</div>
      <p class="wb-condition">전지가 나란히 있다고 병렬일까요? 겉모습만으로 판단하지 말고, 극 표시와 연결선을 함께 살펴요.</p>
      <section class="wb-section"><h3>오늘 바뀐 생각</h3>${writing(notes.changedThought, { lines: 2, label: '오늘 바뀐 생각', page: 8 })}<h3>더 알아보고 싶은 질문</h3>${writing(notes.nextQuestion, { lines: 2, label: '더 알아보고 싶은 질문', page: 8 })}</section>
      <section class="wb-reading-shelf"><h3>궁금하면 펼치는 과학 읽을거리</h3><div>${read('battery', '전지 두 개의 다른 쓰임')}${read('city', '에디슨과 테슬라 · 도시의 불빛')}${read('palace', '1887년 · 건청궁의 첫 전등')}</div><p class="wb-small">생활·역사 이야기는 선택해서 읽어요. 자세한 출처는 과학 읽을거리에 있어요.</p></section>
      ${video('life', 'https://m.site.naver.com/1e5E3', '생활 속 전지 연결')}
      <p class="wb-small wb-reading-credit">실험 사진: 사용자 제공 팩토사이언스 플러스 뉴턴 9호 · Unit 3.<br>원본 45–52쪽의 탐구 흐름을 바탕으로 재구성했어요.</p>
      <nav class="wb-page-links" aria-label="8쪽 실험 연결">${step(19, '오늘의 실험 돌아보기')}</nav>
    `)
  ];
  extraPages.forEach((extra, index) => pages.push(page(index + 9, '내 기록 이어쓰기', `${extra.origin}쪽 · ${escape(extra.label)}${extra.part > 1 ? ` · 계속 ${extra.part}` : ''}`, `<p class="wb-continuation-text">${escape(extra.chunk)}</p>`, 'wb-continuation-page')));
  return pages.join('');
}
