// 여러 날 관찰하는 단원의 교재. 학생 기록칸과 교사 예시를 분리한다.
import { sourceTableHtml } from './source-presentation.js';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const numbers = ['①', '②', '③', '④', '⑤'];
export const findLifeItem = (pool, key) => pool.find((q) => q.id === key || `${q.sourceRef?.of?.set}-${q.sourceRef?.of?.no}` === key);
export function lifeQuestion(q, n, teacher, className = 'bk') {
  if (!q) throw Error('교재 확인 문항을 찾지 못했습니다.');
  const ac = q.answerContract, given = Object.entries(q.givens || {}).map(([k, v]) => `<div class="${className}-given"><b>${esc(k)}</b> ${sourceTableHtml(v) || esc(typeof v === 'object' ? JSON.stringify(v) : v)}</div>`).join('');
  const key = ac.type === 'single-choice' ? [ac.answer] : ac.type === 'multi-choice' ? ac.answers : null;
  const answer = key ? key.map((i) => numbers[i]).join(', ') : ac.type === 'short-text' ? ac.answer : ac.sample;
  const authoredWritten = q.status === 'authored' && ac.type === 'written-explanation';
  if (className === 'dk') {
    const choices = q.choices ? `<ol class="dk-choices" data-key="${key.join(',')}" data-multi="${ac.type === 'multi-choice'}">${q.choices.map((c, i) => `<li><button type="button" data-j="${i}"><span>${numbers[i]}</span>${esc(c)}</button></li>`).join('')}</ol>` : '';
    const solution = `${authoredWritten ? '예시 답: ' : ''}${answer} — ${q.explanation}`;
    return `<p class="dk-q">${esc(q.prompt)}</p>${given}${choices}${teacher ? `<div class="dk-ans rv">${esc(solution)}</div>` : q.choices ? `<p class="dk-hint" hidden></p><div class="dk-ans" hidden>${esc(solution)}</div>` : `<div class="dk-self" data-k="test${n}"><div class="dk-inrow"><textarea class="dk-in" rows="2" aria-label="문제 ${n} 내 답"></textarea></div><div class="dk-ans" hidden>${esc(solution)}</div></div>`}`;
  }
  const choices = q.choices ? `<ol class="bk-choices" data-key="${key.join(',')}" data-id="${q.id}">${q.choices.map((c, i) => `<li data-j="${i}"><span>${numbers[i]}</span>${esc(c)}</li>`).join('')}</ol>` : '';
  return `<li class="bk-item"><span class="bk-qn">${n}</span><p>${esc(q.prompt)}</p>${given}${choices}${teacher ? `<div class="bk-ans">${authoredWritten ? '예시 답: ' : '정답 '}${esc(answer)} — ${esc(q.explanation)}</div>` : !q.choices ? '<div class="bk-lines"><i></i><i></i><i></i></div>' : ''}</li>`;
}
export function renderLifeChapter(ch, art, pool, { teacher = false, live = false } = {}) {
  const pages = [], p = (text) => `<p>${esc(text)}</p>`;
  const lines = (n = 3) => `<div class="bk-lines">${'<i></i>'.repeat(n)}</div>`;
  const response = (text, n = 3) => teacher ? `<div class="bk-ans">${esc(text)}</div>` : lines(n);
  const open = (text = '글·그림 기록 열기') => live ? `<div class="bk-web"><button type="button" class="bk-pop-btn" data-pop="lab">${esc(text)}</button></div>` : '';
  const table = (heads, rows) => `<table class="bk-tbl"><thead><tr>${heads.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((v, i) => `<${i ? 'td' : 'th'}>${esc(v)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
  const field = (label, example, n = 2) => `<h3>${esc(label)}</h3>${response(example, n)}`;
  const page = (title, body, say = '') => { const n = pages.length + 1; pages.push(`<section class="bk-page ${n % 2 ? 'odd' : 'even'}" data-say="${say}"><div class="bk-life-watermark" aria-hidden="true">GFIELD · 지필드</div><div class="bk-band"><span class="bk-band-no">04</span><span class="bk-band-t">생물의 한살이</span><span class="bk-band-u">${teacher ? '교사용 · 예시와 지도' : '학생용 · 내 관찰과 생각'}</span></div><div class="bk-grid"><div class="bk-main"><h2>${esc(title)}</h2>${body}</div></div><footer class="bk-foot"><span class="bk-pn">${n}</span><span>${esc(ch.book)} · 3-1</span>${teacher ? '<em>교사용</em>' : ''}</footer></section>`); };
  page(ch.title, `<div class="bk-life-hero">${art.opener}</div>${ch.intro.map(p).join('')}<h3>미리 생각하기</h3>${ch.think.map((t) => p(t.q) + response(t.a, 2)).join('')}<p class="bk-life-reminder">준비와 첫 기록은 수업에서, 한살이 관찰과 돌봄은 여러 날 이어 가요.</p>`, 'cover');
  page('관찰할 생물과 돌봄 계획', p(ch.goal) + field('관찰할 생물·같은 개체의 표시', '예: 이름표를 붙인 강낭콩 화분 가. 동물은 실제로 돌볼 여건을 먼저 확인한다.') + field('언제·어디에서·누가 돌볼까요?', '기간과 장소, 휴일에 돌볼 사람을 정하고 기르는 방법을 알아본다.') + field('무엇을 관찰하고 어떻게 남길까요?', '같은 생물의 겉모습·행동과 날짜를 글·그림으로 남긴다. 잰 값에는 단위를 적는다.') + `<h3>생명을 존중하는 관찰</h3><ul>${ch.caution.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` + open(), 'design');
  for (const title of ['첫 관찰 일지', '이어 보는 관찰 일지']) page(title,
    table(['관찰 날짜·시간', '생물 이름·개체 표시'], [['', '']]) + field('직접 본 모습과 행동', '교사 안내: 학생이 실제로 관찰한 내용을 확인한다. 날짜와 대상이 있는지 살피고 추측은 따로 나눈다.', 3) + '<h3>본 모습 그리기</h3><div class="bk-life-draw-space"></div>' + field('그림 설명·잰 값과 단위', '직접 본 부분을 설명하고 길이 등을 쟀다면 단위를 함께 적는다.', 2) + field('내 생각·아직 모르는 점', '관찰 사실과 생각을 구별한다. 이전 기록과 달라진 점을 근거로 말하게 한다.', 2) + open(), 'result');
  page('강낭콩의 싹트기 · 조건 비교 계획', p('물의 영향을 알아보는 실험을 계획해요. 이 실험의 예상은 직접 살펴서 확인할 수 있어야 해요.') + field('탐구 문제', '물을 주는 것이 강낭콩 씨앗의 싹트기에 영향을 줄까?') + p(ch.hypothesis.hint) + field('실험 전 예상', ch.hypothesis.a, 2) + table(['비교할 내용', '내 계획'], [ch.design.change, ch.design.same, ch.design.measure].map((r) => [r.q, teacher ? r.a : ''])) + `<h3>준비물</h3>${p(ch.materials.kit.concat(ch.materials.student).join(' · '))}` + open('실험 계획 기록 열기'), 'hypo');
  page('같게 준비하고 한 조건만 다르게', `<div class="bk-life-diagram">${art.comparison}</div><ol class="bk-life-steps">${ch.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><h3>이런 경우는?</h3>${p(ch.wonder.q)}${response(ch.wonder.a, 3)}${p('알맞게 적신 솜이 마르지 않는지 살펴요. 비교하려는 조건 외에는 같게 유지하고 실제로 한 방법을 기록해요.')}` + open('관찰·실험 기록 열기'), 'lab');
  page('실험 결과와 결론', p('같은 날짜에 가·나의 모습을 살펴 실제 센 수와 특징을 적어요. 아직 관찰하지 않았다면 숫자를 만들지 않아요.') + table(['날짜', '가의 싹튼 수·특징', '나의 싹튼 수·특징'], Array.from({ length: 4 }, () => ['', '', ''])) + (teacher ? '<div class="bk-ans">지도 예시(모형 기록): 같은 종류의 씨앗을 각 5개 놓고 관찰한 어느 날, 가 0개·나 3개. 이 수치를 학생의 실제 결과로 옮기지 않는다. 싹튼 기준과 센 날짜를 함께 확인한다.</div>' : '') + field('두 기록을 비교해 알게 된 점', ch.conclusion[0].a, 3) + field('처음 예상과 비교하기·더 살펴볼 점', '예상과 달라도 관찰 기록은 그대로 유지한다. 조건과 기록 방법을 다시 살피며 더 알아볼 점을 찾는다.', 3) + open(), 'concl');
  for (const g of ch.growthExperiments) {
    page(`${g.title} · 계획과 실행`, p(g.question) + field('실험 전 내 예상과 까닭', '조건과 예상되는 모습을 연결하면 반대의 예상도 실험으로 확인한다. 실제 결과는 아직 쓰지 않는다.', 2)
      + table(['비교할 내용', '계획 예시 · 실제 방법은 기록해요'], [['다르게 할 조건', g.change], ['같게 할 조건', g.same], ['관찰·측정 방법', g.measure]])
      + `<h3>준비물</h3>${p(g.materials)}<h3>직접 실행해요</h3><ol class="bk-life-steps">${g.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` + p(g.care) + open('별도 실험 계획 기록 열기'), 'lab');
    page(`${g.title} · 실제 결과와 결론`, p('위 계획에서 실제로 정한 기간·물의 양·관찰 시각을 먼저 적어요. 날짜마다 실제로 본 모습만 기록하고 미관찰과 변화 없음을 구별해요.')
      + field('실제 정한 방법·시작 모습·돌봄 담당', '두 화분의 시작 모습과 조건을 확인한다. 기간과 물의 양은 재료·환경에 맞게 정하며 일률적인 수치를 정답으로 강요하지 않는다.', 3)
      + table(['관찰 날짜·시각', '가의 실제 모습·잰 값', '나의 실제 모습·잰 값'], Array.from({ length: 4 }, () => ['', '', '']))
      + field('비교한 사실과 근거', g.teacher, 3) + p(g.questionForEvidence)
      + field('예상과 비교한 결론·더 살펴볼 점', '관찰한 기간과 조건 안에서 설명한다. 예상과 다르면 그대로 적고 같게 유지하지 못한 조건도 밝힌다.', 3)
      + p('싹트기·물 조건의 자람·햇빛 조건의 자람은 기록 화면에서 각각 새 실험으로 보관해요.') + open('보관한 실험과 실제 결과 열기'), 'result');
  }
  const concepts = (rows) => rows.map(([t, text]) => `<h3>${esc(t)}</h3>${p(text)}`).join('');
  page('동물의 한살이 비교', concepts(ch.animalConcepts) + field('나비와 메뚜기의 공통점·차이점', '모두 알에서 시작해 성충이 되지만 나비는 번데기를 거치고 메뚜기는 거치지 않는다.', 4) + p('먹이를 찾아 돌아다니지 않는 것과 몸이 전혀 움직일 수 없다는 단정은 구별해요.'), 'concept');
  page('식물의 한살이 비교', concepts(ch.plantConcepts) + field('같은 자리의 새싹에서 더 확인할 것', '새 씨앗에서 난 개체인지, 겨울을 넘긴 같은 개체에서 난 새순인지 확인한다.', 4) + field('내가 소개할 생물의 특징', '관찰 자료나 참고 자료의 근거를 구분해 설명하게 한다.', 3), 'concept');
  for (const a of ch.performance) page(a.label, (a.context ? p(a.context) : '') + (a.figure ? `<img class="bk-life-source-photo" src="${a.figure}" alt="${esc(a.figureAlt)}">` : '') + p(a.prompt)
    + (teacher ? `<div class="bk-life-diagram">${art.cageExample}</div><div class="bk-ans">지도 예시: 배추·케일 등 알맞은 먹이, 공기가 통하는 덮개, 직사광선·큰 충격을 피하는 장소를 생각했는지 그림과 말로 확인한다. 그림의 예쁜 정도나 선의 수로 자동 채점하지 않는다.</div>` : '<div class="bk-life-draw-space performance"></div>')
    + field('각 부분의 이름과 필요한 까닭', '학생이 그린 각 부분과 돌봄 방법을 연결해 설명하게 한다. 이 기준은 공식 배점표가 아닌 학습용 확인이다.', 3) + (a.sourceCaption ? `<p class="bk-hint">${esc(a.sourceCaption)}</p>` : '') + open('직접 그리는 수행 활동 열기'), 'performance');
  page('한살이 소개 자료 만들고 나누기', field('소개 제목·생물 이름', '학생의 관찰 대상을 적는다.', 2) + field('한살이 순서와 각 단계의 특징', '직접 관찰한 단계와 다른 자료에서 확인한 단계를 구분한다.', 3) + field('내 기록에서 찾은 근거·참고 자료', '관찰 날짜와 그림을 가리키며 설명한다. 참고 자료의 제목과 쪽수를 적는다.', 3) + field('실제로 나눈 날짜·대상·방법', '실제로 발표하거나 보여 준 뒤 적는다. 내려받은 것만으로 공유 완료라고 표시하지 않는다.', 2) + field('들은 질문과 보완할 점', '아직 모르는 점은 인정하고 다음 관찰이나 자료 확인으로 이어 간다.', 3) + open('소개·공유 기록 열기'), 'creative');
  page('기록을 더 믿을 수 있게', p(ch.creative.q) + response(ch.creative.a, 4) + p(ch.discuss.q) + response(ch.discuss.a, 4) + `<h3>${esc(ch.gifted.title)}</h3>${p(ch.gifted.lead)}` + table(['살펴볼 점', '개선 방법과 까닭'], ch.gifted.rows.map((r) => [r, teacher ? ch.gifted.a[r] : ''])) + (teacher ? p(ch.gifted.rubric.join(' · ')) : ''), 'gifted');
  page('내 탐구보고서', table(['이름', '날짜'], [['', '']]) + ch.report.sections.map((r) => field(r.label, '학생의 실제 기록에서 근거를 찾아 확인한다. 관찰하지 않은 결과를 예시로 채우지 않는다.', r.lines)).join('') + p(ch.report.checks.join(' / ')), 'report');
  page('형성평가 · 개념 이해 점검', '<p>자료 문제의 이해를 점검해요. 실제 관찰·실험·그림·공유 수행의 완료와는 구별해요.</p><ol class="bk-items">' + ch.formative.items.map((k, i) => lifeQuestion(findLifeItem(pool, k), i + 1, teacher)).join('') + '</ol>' + p(ch.formative.standards.join(' / ')), 'formative');
  for (let i = 0; i < ch.check.length; i += 3) page(`교과 확인 문제 ${Math.floor(i / 3) + 1}`, '<p>교재 원문과 짝지어 직접 만든 확인 문제예요.</p><ol class="bk-items">' + ch.check.slice(i, i + 3).map((k, j) => lifeQuestion(findLifeItem(pool, k), i + j + 1, teacher)).join('') + '</ol>', 'check');
  return `<div data-unit="${ch.unit}" class="bk bk-life ${teacher ? 'bk-t' : ''} ${live ? 'live' : ''}" style="--bk-theme:${ch.theme}">${pages.join('')}</div>`;
}
