import { findLifeItem, lifeQuestion } from './book-life.js';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function buildLifeSlides(ch, art, plan, pool, mode) {
  const teach = mode === 'teach', slides = [], phases = Object.fromEntries(plan.phases.map((p) => [p.id, p]));
  let session = 1;
  const add = (id, phase, title, body, extra = {}) => slides.push({ id, phase, phaseObj: phases[phase], title, body, kind: 'read', ses: session, ...extra });
  const p = (s) => `<p>${esc(s)}</p>`;
  const answer = (s, key) => teach ? `<div class="dk-ans rv">${esc(s)}</div>` : `<div class="dk-self" data-k="${key}"><div class="dk-inrow"><textarea class="dk-in" rows="3" aria-label="내 생각"></textarea></div><div class="dk-ans" hidden>${esc(s)}</div></div>`;
  const record = (id, phase, title, text, tab) => add(id, phase, title, `<p class="dk-fieldwork-notice">${esc(text)}</p><div data-mount="lab"></div>`, { mount: 'lab', kind: 'fieldwork', layout: 'fieldwork', fieldTab: tab });
  add('cover', 'open', ch.title, `<div class="dk-two"><div class="dk-art">${art.opener}</div><div>${ch.intro.map(p).join('')}</div></div>`);
  if (teach) add('plan', 'open', '수업과 여러 날 관찰', `<ol class="dk-plan">${plan.phases.map((x) => `<li><b>${esc(x.name)}</b><span>${x.min}분</span><em>${esc(x.aim)}</em></li>`).join('')}</ol>${p(plan.note)}`);
  add('think1', 'open', '같은 개체일까요?', p(ch.think[0].q) + (teach ? answer(ch.think[0].a) : '<p>먼저 내 생각을 떠올려요. 날짜별 관찰 기록과 나중에 비교해요.</p>'), { kind: 'fieldwork-read' });
  add('goal', 'design', '관찰 계획과 돌봄', p(ch.goal) + p(ch.materials.kit.join(' · ')) + `<ul>${ch.caution.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`, { say: 'cover' });
  add('hypo', 'design', '조건 비교의 예상', p(ch.hypothesis.hint) + answer(ch.hypothesis.a, 'hypo'), { kind: 'write', say: 'hypo' });
  add('design', 'design', '같게 할 것과 다르게 할 것', `<table class="dk-tbl">${Object.values(ch.design).map((r) => `<tr><th>${esc(r.q)}</th><td>${teach ? `<span class="rv">${esc(r.a)}</span>` : esc(r.a)}</td></tr>`).join('')}</table><p>이것은 물의 영향을 비교하는 계획 예시예요. 내 실험에서 실제로 정한 조건은 기록 화면에 적어요.</p>`);
  add('method', 'lab', '조건 비교를 준비해요', `<div class="dk-art">${art.comparison}</div><ol>${ch.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`, { layout: 'dense' });
  record('lab', 'lab', '관찰과 첫 기록', '같은 생물의 실제 모습을 글과 그림으로 남겨요. 한살이는 여러 날 이어 관찰해요. 지금 할 수 있는 기록을 남긴 뒤 다음으로 이동해요.', 'observe');
  if (!teach) {
    add('field-break', 'lab', '첫 기록 뒤에도 관찰은 이어져요', '<p>날짜를 바꾸어 관찰하고 실제 기록을 더 모아요. 다음 화면의 개념 문제를 먼저 살펴볼 수도 있어요.</p><a class="btn" href="#/s31-u04/start">관찰을 이어 가며 나중에 돌아오기</a>', { kind: 'fieldwork-read' }); session = 2;
  }
  record('recall', 'result', '모은 기록을 비교해요', '기록이 없다면 아직 결과를 알 수 없어요. 실제 관찰한 날짜와 개체를 확인하고 앞뒤 모습을 비교해요.', 'observe');
  add('concl', 'result', '내 기록으로 결론 내리기', p(ch.conclusion[0].q) + answer(ch.conclusion[0].a, 'concl0'), { kind: 'write', say: 'result' });
  add('animals', 'concept', '여러 동물의 한살이', ch.animalConcepts.map(([t, text]) => `<h3>${esc(t)}</h3>${p(text)}`).join(''));
  add('plants', 'concept', '여러 식물의 한살이', ch.plantConcepts.map(([t, text]) => `<h3>${esc(t)}</h3>${p(text)}`).join(''));
  for (const g of ch.growthExperiments) {
    add(`growth-${g.key}-design`, 'design', g.title, p(g.question) + `<table class="dk-tbl"><tr><th>다르게</th><td>${esc(g.change)}</td></tr><tr><th>같게</th><td>${esc(g.same)}</td></tr><tr><th>관찰</th><td>${esc(g.measure)}</td></tr></table>` + p('싹트기와 다른 실험이에요. 다음 기록 화면에서 별도 실험을 만들고 내 예상을 적어요.'), { kind: 'fieldwork-read' });
    add(`growth-${g.key}-method`, 'lab', `${g.title} · 실행`, p(g.materials) + `<ol>${g.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` + p(g.care), { kind: 'fieldwork-read', layout: 'dense' });
    record(`growth-${g.key}-record`, 'result', `${g.title} · 계획과 실제 기록`, `${g.title} 계획으로 새로 시작하거나 이미 보관한 실험을 골라요. 내 예상·실제 정한 조건·날짜별 결과·결론을 따로 남겨요. ${g.questionForEvidence}`, 'experiment');
  }
  add('wonder', 'concept', '이런 경우는?', p(ch.wonder.q) + answer(ch.wonder.a, 'wonder'), { kind: 'write' });
  ch.performance.forEach((a, i) => add(`drawing-task-${i}`, 'extend', a.label, (a.figure ? `<div class="dk-art mid"><img src="${a.figure}" alt="${esc(a.figureAlt)}"></div>` : '') + p(a.context) + p(a.prompt) + (teach ? answer('먹이·통풍·두는 장소와 각 부분의 까닭을 그림과 말로 함께 확인해요. 공식 점수나 그림의 예쁜 정도로 자동 채점하지 않아요.') : p('다음 기록 화면에서 직접 그려요. 종이에 그렸다면 교재 그림칸을 사용하고 선생님과 확인해요.')), { kind: 'fieldwork-read' }));
  record('draw', 'extend', '사육장 직접 그리기', '교재 원문과 짝 수행을 각각 그려요. 그림과 설명은 선생님과 함께 확인하고 자동으로 점수를 매기지 않아요.', 'draw');
  record('share', 'extend', '소개 자료 만들고 질문 나누기', '날짜별 글과 그림을 근거로 소개해요. 실제로 나눈 대상·방법·날짜와 들은 질문을 남겨요. 파일만 내려받았다고 공유 완료로 적지 않아요.', 'intro');
  add('creative', 'extend', '기록을 더 믿을 수 있게', p(ch.creative.q) + (teach ? answer(ch.creative.a) : p('내가 보완할 관찰 방법을 생각하고 친구와 까닭을 나누어요.')), { kind: 'fieldwork-read' });
  const keys = [...ch.formative.items, ...ch.check];
  keys.forEach((key, i) => { const q = findLifeItem(pool, key); if (!q) throw Error(`확인 문항 없음: ${key}`); add(`test${i + 1}`, 'check', `자료로 확인하기 ${i + 1}/${keys.length}`, lifeQuestion(q, i + 1, teach, 'dk'), { item: q.id, kind: q.choices ? 'test' : 'write', layout: 'dense' }); });
  add('end', 'check', '다음 관찰로 이어 가요', `<ul>${ch.summary.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p>자료 문제의 정답과 실제 수행의 완료는 달라요. 관찰·그림·소개 자료는 선생님과 함께 확인해요.</p><a class="btn" href="#/${ch.unit}/daily">Daily Test로 자료 문제 점검</a>`, { kind: 'fieldwork-read' });
  slides.forEach((s, i) => { s.n = i + 1; }); return slides;
}
