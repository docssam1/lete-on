import { findLifeItem, lifeQuestion } from './book-life.js';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function buildForceSlides(ch, art, plan, pool, mode) {
  const teach = mode === 'teach', slides = [], phases = Object.fromEntries(plan.phases.map((p) => [p.id, p]));
  let session = 1;
  const add = (id, phase, title, body, more = {}) => slides.push({ id, phase, phaseObj: phases[phase], title, body, ses: session, kind: 'fieldwork-read', ...more });
  const p = (s) => `<p>${esc(s)}</p>`;
  add('cover', 'open', ch.title, `<div class="dk-art mid">${art.opener}</div>${ch.intro.map(p).join('')}`);
  if (teach) add('plan', 'open', '수업과 실제 활동', `<ol class="dk-plan">${plan.phases.map((x) => `<li><b>${esc(x.name)}</b><span>${x.min}분</span><em>${esc(x.aim)}</em></li>`).join('')}</ol>${p(plan.note)}`);
  add('think', 'open', ch.think[0].q, teach ? `<div class="dk-ans rv">${esc(ch.think[0].a)}</div>` : p('먼저 내 생각을 떠올리고 관찰과 비교해요.'));
  add('goal', 'design', '비교하고 측정하고 나누기', p(ch.goal) + `<ul>${ch.caution.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`);
  add('scene', 'design', '수평 모형을 먼저 살펴봐요', '<div class="dk-3d" data-mount="scene" data-preview="1"></div>', { mount: 'scene', kind: 'scene', layout: 'media' });
  for (const a of ch.activities) {
    add(`${a.key}-plan`, 'design', a.title, p(a.question) + `<table class="dk-tbl"><tr><th>다르게</th><td>${esc(a.change)}</td></tr><tr><th>같게</th><td>${esc(a.same)}</td></tr><tr><th>관찰</th><td>${esc(a.measure)}</td></tr></table>` + p('교재에 내 예상과 실제로 정한 조건을 적어요.'));
    add(`${a.key}-method`, 'lab', `${a.title} · 실제 활동`, p(a.materials) + `<ol>${a.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` + p(a.reflection), { layout: 'dense' });
    if (a.key === 'balance') {
      add('lab', 'lab', '3D 실험실 · 수평 모형', '<p class="dk-fieldwork-notice">예상한 뒤 잠금 받침을 빼고 관찰해요. 같은 거리와 다른 거리의 결과를 구별해 적어요.</p><div data-mount="lab"></div>', { mount: 'lab', kind: 'fieldwork', layout: 'fieldwork' });
      if (!teach) { add('field-break', 'lab', '실제 활동의 기록도 준비해요', '<p>모형 결과를 실제 측정으로 옮기지 않아요. 교재의 실제 활동을 하고 날짜와 관찰한 사실을 남겨요.</p><a class="btn" href="#/s31-u01/start">첫 화면에서 나중에 이어서 하기</a>'); session = 2; }
      add('recall', 'result', '모형과 실제 기록을 구별해요', '<p>같은 거리에 놓은 결과로 무게를 비교했나요? 위치를 바꾼 기록은 따로 설명해요. 실제로 해 보지 않은 활동은 미수행으로 남겨요.</p>');
    }
    add(`${a.key}-result`, 'result', `${a.title} · 기록과 결론`, p('교재의 실제 기록을 가리키며 설명해요. 날짜·물체·한 방법과 관찰 사실을 확인하고 예상과 비교해요.') + p(a.reflection) + (teach ? `<div class="dk-ans rv">${esc(a.teacher)}</div>` : ''));
  }
  ch.concepts.forEach(([title, text], i) => add(`concept-${i}`, 'concept', title, p(text) + p('내 활동에서 확인한 기록을 근거로 설명해요.')));
  add('research', 'extend', '생활 속 지레·빗면 조사', '<p>도구 이름·쓰이는 곳·도움을 주는 점을 글이나 그림으로 만들어요. 직접 관찰한 내용과 참고한 자료의 제목·쪽수·확인 날짜를 나누어 적어요.</p>');
  add('share', 'extend', '조사한 자료를 실제로 나누기', '<p>교재나 직접 만든 자료를 발표하고 질문을 들어요. 실제 공유한 날짜·대상·방법과 들은 질문, 자료를 보완할 점을 적어요.</p><p>자료를 내려받은 것만으로 공유 완료를 만들지 않아요.</p>');
  add('report', 'extend', '관찰을 근거로 보고서 쓰기', '<p>수평 모형과 실제 활동의 기록을 구별해 보고서를 정리해요.</p><a class="btn" href="#/s31-u01/report">내 탐구보고서 열기</a>');
  add('creative', 'extend', '비교 방법 다시 설계하기', p(ch.creative.q) + (teach ? `<div class="dk-ans rv">${esc(ch.creative.a)}</div>` : p('고칠 방법과 까닭을 교재에 적고 설명해요.')));
  const keys = [...ch.formative.items, ...ch.check];
  keys.forEach((k, i) => { const q = findLifeItem(pool, k); if (!q) throw Error(`확인 문항 없음: ${k}`); add(`test${i + 1}`, 'check', `자료로 확인하기 ${i + 1}/${keys.length}`, lifeQuestion(q, i + 1, teach, 'dk'), { kind: q.choices ? 'test' : 'write', item: q.id, layout: 'dense' }); });
  add('end', 'check', '기록을 근거로 설명해요', `<ul>${ch.summary.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>자료 문제의 정답과 실제 활동 수행은 따로 확인해요.</p><a class="btn" href="#/s31-u01/daily">Daily Test</a>`);
  slides.forEach((s, i) => { s.n = i + 1; }); return slides;
}
