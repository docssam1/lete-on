// GFIELD 실험 과학 영재 — 화면 수업 자료(교안). 교재와 같은 chapter 데이터를 16:9 슬라이드로 보여 준다.
//  teach(가르치기·강사용): 클릭/→/스페이스로 빈칸 답이 차례로 열리고, N으로 강사 발문 노트, F로 전체 화면.
//  self (스스로 공부하기·학생용): 내 생각을 쓰고 '예시 답 보기', 확인 문제는 눌러서 바로 채점.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NUM = ['①', '②', '③', '④', '⑤', '⑥'];
const KEY = 'sciLab.deck';
const memo = { all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
  get(k) { return this.all()[k] ?? ''; }, set(k, v) { try { const a = this.all(); a[k] = v; localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* 저장 불가 */ } } };
let notesOn = true;
const MIC = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export function buildSlides(ch, art, plan, similar, mode) {
  const teach = mode === 'teach', S = [];
  let n = 0;
  // 답 자리: 가르치기는 클릭으로 열리는 답, 스스로는 쓰기 칸 + 예시 답 보기
  const ans = (a, id) => (teach ? `<div class="dk-ans rv">${esc(a)}</div>`
    : `<div class="dk-self" data-k="${id}"><div class="dk-inrow"><textarea class="dk-in" rows="2" placeholder="내 생각을 써 보세요"></textarea>${MIC ? '<button type="button" class="dk-mic" aria-pressed="false" title="말로 쓰기">🎤</button>' : ''}</div><div class="dk-ans" hidden><b>예시 답</b> ${esc(a)}</div></div>`);
  // 생각만 하기(스스로 공부): 쓰지 않고 머릿속으로 답한 뒤 「예시 답 보기」로 확인 — 쓰기는 가설·결론·이런 경우는·도전만(원장 2026-09-29: "쓰는 활동이 너무 많다")
  const peek = (a) => (teach ? `<div class="dk-ans rv">${esc(a)}</div>` : `<div class="dk-peekw"><button type="button" class="dk-peek">예시 답 보기</button><div class="dk-ans" hidden>${esc(a)}</div></div>`);
  const add = (id, phase, title, body, extra = {}) => S.push({ id, phase, title, body, ...extra });
  const ph = Object.fromEntries(plan.phases.map((p) => [p.id, p]));

  add('cover', 'open', '', `<div class="dk-cover"><p class="dk-kick">${esc(ch.book)} · ${esc(ch.vol)}</p><div class="dk-bign">${ch.no}</div><h1>${esc(ch.title)}</h1>
    <p class="dk-link"><b>교과 연결</b> ${esc(ch.link.course)} ${esc(ch.link.unit)}</p></div><div class="dk-art cover">${art.opener}</div>`, { say: 'cover', layout: 'cover', kind: 'read' });
  if (teach) add('plan', 'open', '수업 흐름 · 90분', `<ol class="dk-plan">${plan.phases.map((p) => `<li><b>${esc(p.name)}</b><span>${p.min}분</span><em>${esc(p.aim)}</em></li>`).join('')}</ol>
    <p class="dk-sub">탐구 요소 · ${ch.skills.map(esc).join(' · ')}</p>`);
  add('intro', 'open', '이런 모습 본 적 있나요?', `<div class="dk-two"><div class="dk-art">${art.opener}</div><div>${ch.intro.map((p) => `<p>${esc(p)}</p>`).join('')}</div></div>`, { layout: 'intro', kind: 'read' });
  (teach ? ch.think : ch.think.slice(0, 1)).forEach((t, i) => add(`think${i + 1}`, 'open', `미리 생각하기 ${i + 1}`, `<p class="dk-q">${esc(t.q)}</p>${teach ? ans(t.a, `think${i}`) : `<p class="dk-sub">쓰지 않아도 돼요. 머릿속으로 떠올려 봐요.</p>${peek(t.a)}`}`, { say: 'think', kind: teach ? 'write' : 'think' }));
  // 가설 전에는 답이 나오기 전까지만(장면의 revealAt) — 답은 실험·결과 뒤 「3D로 확인하기」에서(SEQUENCE-DESIGN.md)
  add('scene', 'open', '3D로 먼저 보기', `<div class="dk-3d" data-mount="scene" data-preview="1"></div>`, { say: 'scene', mount: 'scene', layout: 'media', kind: 'scene' });

  add('goal', 'design', '탐구 목표', `<p class="dk-goal">${esc(ch.goal)}</p><div class="dk-two"><div class="dk-card"><h3>준비물</h3><p>${ch.materials.kit.map(esc).join(', ')}</p></div>
    <div class="dk-card"><h3>학생 준비물</h3><p>${ch.materials.student.map(esc).join(', ')}</p></div></div>`, { kind: 'read', layout: 'goal' });
  add('hypo', 'design', 'STEP 1 · 가설 세우기', `<p class="dk-q">${esc(ch.hypothesis.hint)}</p>${ans(ch.hypothesis.a, 'hypo')}`, { say: 'hypo', kind: 'write' });
  const d = ch.design;
  add('design', 'design', 'STEP 2 · 실험 설계하기', `<table class="dk-tbl">${[d.change, d.same, d.measure].map((r, i) => `<tr><th>${esc(r.q)}</th><td>${teach ? ans(r.a, `design${i}`) : peek(r.a)}</td></tr>`).join('')}</table>
    <p class="dk-sub">알맞은 실험은 바꿀 조건을 하나만 정하고, 나머지는 모두 같게 해요.</p>
    <div class="dk-caution"><h3>주의하세요!</h3><ul>${ch.caution.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`, { say: 'design', kind: teach ? 'write' : 'think' });

  if (false) ch.steps.forEach((s, i) => add(`step${i + 1}`, 'lab', `STEP 3 · 실험하기 ${i + 1}/${ch.steps.length}`,
    `<div class="dk-two wide-art"><div class="dk-art">${art[s.art]}</div><div><span class="dk-stepno" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p class="dk-big">${esc(s.text)}</p><p class="dk-tip rv">도움말 · ${esc(s.tip)}</p></div></div>`, { say: `step${i + 1}`, kind: 'read', layout: 'step' }));
  if (!teach) {
    // 실험 순서 맞추기(스스로 공부): 집에는 재료가 없으니 순서 읽기 5장 대신, 섞인 카드를 순서대로 누른다. 순서는 늘 정답과 다르게 섞는다.
    const k = ch.steps.length, mix = ch.steps.map((_, j) => j).sort((a, b) => ((a * 7 + 3) % k) - ((b * 7 + 3) % k));
    if (mix.every((x, j) => x === j)) mix.reverse();
    add('order', 'lab', 'STEP 3 · 실험 순서 맞추기', `<p class="dk-q">실험을 어떤 순서로 할까요? 첫 번째부터 차례로 카드를 눌러요.</p>
      <ol class="dk-ords">${mix.map((j) => `<li><button type="button" class="dk-ord" data-j="${j}"><i class="dk-ordn" aria-hidden="true"></i><span class="dk-art mini">${art[ch.steps[j].art] || ''}</span><span class="dk-ordt">${esc(ch.steps[j].text)}</span></button></li>`).join('')}</ol>
      <div class="dk-act"><button type="button" class="dk-go" data-o="check" disabled>확인</button><button type="button" data-o="reset">처음부터</button></div>`, { say: 'order', kind: 'order' });
  }
  // 실험 순서를 3D 실험실 옆에(원장: "실험 순서와 3D 실험실이 옆에 나와야") — 누르면 그 단계가 크게, 가르치기는 순서를 짚으며 설명
  const stepsAside = `<aside class="dk-stepside"><h3>실험 순서</h3><ol>${ch.steps.map((st, j) => `<li><button type="button" class="dk-stepi${j ? '' : ' on'}" data-st="${j}"><b>${j + 1}</b><span class="dk-art mini">${art[st.art] || ''}</span><span class="dk-stept">${esc(st.text)}</span></button></li>`).join('')}</ol></aside>`;
  add('lab', 'lab', `3D 실험실 · ${esc(ch.labTitle || '조건을 바꿔 직접 해 보기')}`, `<div class="dk-labwrap">${stepsAside}<div class="dk-3d" data-mount="lab"></div></div>`, { say: 'lab', mount: 'lab', layout: 'media', kind: 'lab' });
  add('wonder', teach ? 'lab' : 'extend', 'Q. 이런 경우는?', `<p class="dk-q">${esc(ch.wonder.q)}</p>${ans(ch.wonder.a, 'wonder')}`, { say: 'wonder', kind: 'write' });

  ch.results.forEach((r, i) => add(`res${i + 1}`, 'result', `STEP 4 · 결과 ${i + 1}`, `${teach ? '' : '<div class="dk-mylab" hidden></div>'}<p class="dk-q">${esc(r.q)}</p>
    ${r.art ? `<div class="dk-art mid">${art[r.art]}</div>` : ''}
    ${r.table ? `<table class="dk-tbl"><tr>${r.table.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${r.rows.map((rw) => `<tr><th>${esc(rw)}</th>${r.table.slice(1).map((_, c) => (teach ? '<td></td>' : `<td contenteditable="true" data-cell="${i}-${rw}-${c}"></td>`)).join('')}</tr>`).join('')}</table>` : ''}
    ${teach ? ans(r.a, `res${i}`) : peek(r.a)}`, { say: 'res', kind: teach ? 'write' : 'think' }));
  add('reveal', 'result', '3D로 확인하기', `<p class="dk-sub">내 예상과 결과가 맞는지, 아까 멈췄던 곳부터 끝까지 봐요.</p><div class="dk-3d" data-mount="scene" data-from="reveal"></div>`, { say: 'reveal', mount: 'scene', layout: 'media', kind: 'scene' });
  add('concl', 'result', 'STEP 5 · 결론 내리기', `<ol class="dk-list">${ch.conclusion.map((c, i) => `<li><p>${esc(c.q)}</p>${i === 0 || teach ? ans(c.a, `concl${i}`) : peek(c.a)}</li>`).join('')}</ol>`, { say: 'concl', kind: 'write' });

  const nt = ch.note;
  add('note', 'concept', `개념 노트 · ${nt.title}`, `<div class="dk-two"><div class="dk-art">${art[nt.art]}</div>
    <table class="dk-tbl note"><tr>${nt.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${nt.table.rows.map((r) => `<tr><th>${esc(r[0])}</th>${r.slice(1).map((c) => `<td><span class="${teach ? 'rv' : ''}">${esc(c)}</span></td>`).join('')}</tr>`).join('')}</table></div>
    <ul class="dk-points">${nt.points.map((p) => `<li class="${teach ? 'rv' : ''}">${esc(p)}</li>`).join('')}</ul>`, { say: 'note', kind: 'read', layout: 'feature' });
  add('plus', 'concept', `개념 플러스 · ${nt.plus.title}`, `<div class="dk-two"><div class="dk-art">${art[nt.plus.art]}</div><p class="dk-big">${esc(nt.plus.text)}</p></div>`, { say: 'plus', kind: 'read', layout: 'feature plus' });

  add('discuss', 'extend', 'STEP 6 · 개념 넓혀 토의하기', `<p class="dk-q">${esc(ch.discuss.q)}</p>${ans(ch.discuss.a, 'discuss')}`, { say: 'discuss', kind: 'write' });
  add('creative', 'extend', 'STEP 7 · 창의력 키우기', `<p class="dk-q">${esc(ch.creative.q)}</p>${ans(ch.creative.a, 'creative')}`, { kind: 'write' });
  const g = ch.gifted;
  add('gifted', 'extend', `영재성 기르기`, `<p class="dk-q"><b>${esc(g.title)}</b><br>${esc(g.lead)}</p>
    <table class="dk-tbl">${g.rows.map((r) => `<tr><th>${esc(r)}</th><td>${ans(g.a[r], `gifted-${r}`)}</td></tr>`).join('')}</table>
    ${teach ? `<div class="dk-rubric rv"><b>채점 기준</b> ${g.rubric.map(esc).join(' / ')}</div>` : ''}`, { say: 'gifted', kind: 'write' });

  const pick = ch.check.map((k) => similar.find((s) => `${s.sourceRef.of.set}-${s.sourceRef.of.no}` === k)).filter(Boolean);
  pick.forEach((it, i) => {
    const ac = it.answerContract, gv = it.givens;
    const givens = gv ? Object.entries(gv).map(([k, v]) => `<div class="dk-given">${/^(설명|내용|text|문항|자료|글|지문)$/.test(k) ? '' : k === '보기' ? '<b>〈보기〉</b><br>' : `<b>${esc(k)}</b> `}${Array.isArray(v) ? v.map(esc).join('<br>') : esc(typeof v === 'object' ? JSON.stringify(v) : v)}</div>`).join('') : '';
    const key = ac.type === 'single-choice' ? [ac.answer] : ac.type === 'multi-choice' ? ac.answers : null;
    const text = key ? key.map((a) => NUM[a]).join(', ') : ac.type === 'short-text' ? ac.answer : ac.sample;
    const choices = it.choices ? `<ol class="dk-choices" data-key="${key ? key.join(',') : ''}" data-multi="${ac.type === 'multi-choice'}">${it.choices.map((c, j) => `<li><button type="button" data-j="${j}"><span>${NUM[j]}</span>${esc(c)}</button></li>`).join('')}</ol>` : '';
    const reveal = teach ? `<div class="dk-ans rv">정답 ${esc(text)} — ${esc(it.explanation)}</div>`
      : it.choices ? `<p class="dk-hint" hidden></p><div class="dk-ans" hidden>정답 ${esc(text)} — ${esc(it.explanation)}</div>` : ans(`${text} — ${it.explanation}`, `test${i}`);
    add(`test${i + 1}`, 'check', `교과 확인 문제 ${i + 1}/${pick.length}`, `<p class="dk-q">${esc(it.prompt)}</p>${givens}${choices}${reveal}`, { say: 'test', test: !!it.choices, layout: 'dense', kind: it.choices ? 'test' : 'write', item: it.id });
  });
  add('end', 'check', '', `<div class="dk-cover"><h1>오늘 배운 것</h1><ul class="dk-points big">${(ch.summary || (ch.note?.points || []).map(esc)).map((x) => `<li>${x}</li>`).join('')}</ul>
    <p class="dk-sub">과제 · 교재 ${ch.no}장 교과 확인 문제와 영재성 기르기를 마무리해 오세요.</p></div>`, { layout: 'cover', kind: 'end' });
  if (!teach) {
    // 스스로 공부 = 2차시(SEQUENCE-DESIGN.md 확정안). 1차시 「해 보기」: 예상 → 가설 → 설계 → 실험 → 결과, 「1차시 끝」.
    // 2차시 「알아 가기」: 떠올리기 → 3D로 확인 → 결론 → 개념 → 바로 확인 2 → 개념 플러스 → 이런 경우는 → 도전 하나 → 확인 문제 → 오늘 배운 것.
    add('break', 'result', '', `<div class="dk-cover"><p class="dk-kick">1차시 「해 보기」 끝</p><h1>오늘은 여기까지!</h1><div class="dk-mine"></div>
      <p class="dk-sub">내 예상이 맞았을까? 다음 시간에 3D로 확인하고, 왜 그런지 알아봐요.</p>
      <div class="dk-act"><a class="dk-go" href="#/${ch.unit}/start">오늘은 여기까지</a><button type="button" class="dk-go ghost" data-a2="cont">바로 2차시 이어서 ›</button></div></div>`, { layout: 'cover', kind: 'break' });
    add('recall', 'result', '2차시 · 지난 시간 떠올리기', `<p class="dk-q">지난 시간에 내가 쓴 가설과 실험 결과예요. 천천히 다시 읽어 봐요.</p><div class="dk-mine"></div>`, { kind: 'recall' });
    const ch3 = [['discuss', '토의', ch.discuss.q, ch.discuss.a], ['creative', '창의력', ch.creative.q, ch.creative.a]];
    add('challenge', 'extend', '도전 하나 고르기', `<p class="dk-q">셋 중에 하고 싶은 도전 하나를 골라요.</p><div class="dk-pick">${[...ch3.map(([id, t]) => [id, t]), ['gifted', '영재성']].map(([id, t]) => `<button type="button" class="dk-go ghost" data-pick="${id}">${t}</button>`).join('')}</div>
      ${ch3.map(([id, , q, a]) => `<div class="dk-pane" data-pane="${id}" hidden><p class="dk-q">${esc(q)}</p>${ans(a, id)}</div>`).join('')}
      <div class="dk-pane" data-pane="gifted" hidden><p class="dk-q"><b>${esc(g.title)}</b><br>${esc(g.lead)}</p><p class="dk-gifted-clock" role="timer" aria-label="영재성 남은 시간"><span>남은 시간</span> <strong>3:00</strong></p><table class="dk-tbl">${g.rows.map((r) => `<tr><th>${esc(r)}</th><td>${ans(g.a[r], `gifted-${r}`)}</td></tr>`).join('')}</table></div>`, { say: 'challenge', kind: 'challenge' });
    const by = Object.fromEntries(S.map((x) => [x.id, x])), ids = S.map((x) => x.id), tests = ids.filter((x) => /^test\d/.test(x));
    const order = ['cover', 'intro', 'think1', 'scene', 'goal', 'hypo', 'design', 'order', 'lab', ...ids.filter((x) => /^res\d/.test(x)), 'break',
      'recall', 'reveal', 'concl', 'note', ...tests.slice(0, 2), 'plus', 'wonder', 'challenge', ...tests.slice(2), 'end'];
    S.splice(0, S.length, ...order.filter((id) => by[id]).map((id) => by[id]));
    let ses = 1; S.forEach((x) => { x.ses = ses; if (x.id === 'break') ses = 2; });
  }
  S.forEach((s) => { s.n = ++n; s.phaseObj = ph[s.phase]; });
  return S;
}

// 스스로 공부하기의 독쌤: 단원마다 한 번 만들고 슬라이드끼리 이어 쓴다. 스스로 공부하기를 떠나면 치운다.
let guideState = null, guideAvoid = () => [];
function guideFor(u) {
  if (guideState?.u === u && guideState.alive && guideState.guide?.alive !== false) return guideState.p;
  guideState?.p.then(({ guide }) => guide.destroy());
  const st = { u, alive: true };
  st.p = import('./docssam.js').then(async (m) => { const V = await m.loadVoice(u); st.guide = m.mountGuide(V, { canPause: true, avoid: () => guideAvoid() }); if (!st.alive || !/\/lab-class\/self\//.test(location.hash)) st.guide.destroy(); return { V, guide: st.guide }; });
  guideState = st; return st.p;
}
if (typeof window !== 'undefined') addEventListener('hashchange', () => {
  if (guideState && !/\/lab-class\/self\//.test(location.hash)) { const s = guideState; guideState = null; s.alive = false; s.p.then(({ guide }) => guide.destroy()); }
});
const rectsOf = (root, sel) => (root ? (sel ? [...root.querySelectorAll(sel)] : [...root.querySelectorAll('h1,h2,h3,p,li,button,textarea,input,table,figure,img,.dk-art svg,video,.dk-choices,.dk-ans,.dk-hint,.dk-act,.dk-card,.dk-given,.lab-table,.lab3d-btns,.lab3d-read,.lab3d-tip,.lab-tip,.ctl,.cap,.stage3d-hint')])
  .filter((el) => el.offsetParent !== null).map((el) => el.getBoundingClientRect()).filter((r) => r.width > 4 && r.height > 4 && r.width * r.height < innerWidth * innerHeight * 0.5) : []);
// 상황에 따라 표정: 답을 쓰는 동안 생각하는 얼굴, 보기를 고르는 중에도 잠깐 생각
function wireMoods(stage, G) {
  stage.addEventListener('focusin', (e) => { if (e.target.matches?.('textarea,input[type=text]')) G.mood('think'); });
  stage.addEventListener('focusout', (e) => { if (e.target.matches?.('textarea,input[type=text]')) G.mood('listen'); });
  stage.addEventListener('pointerenter', (e) => { if (e.target.closest?.('.dk-choices')) G.mood('think'); }, true);
}
// 실험실 도움말을 말풍선 둘째 줄에 비추고, 방법이 틀렸다는 도움말이면 놀람 → 격려, 해냈다는 도움말이면 칭찬
const METHOD_ERR = /먼저 |뒤에 적어|더 높은 곳|비었어요|다시 해 봐|아직 /;
const GOOD = /^(적었어요|굳었어요|다 부었어요)|다시 떠올라요|성공|잘했어요/;
function watchLabTips(host, G) {
  let last = '';
  const read = () => {
    const tip = host.querySelector('.lab3d-tip, .lab-tip'); if (!tip) return;
    const t = tip.textContent.trim(); if (t === last) return; last = t;
    G.status(t);
    if (METHOD_ERR.test(t)) G.react('surprise', 1100, 'shake'), G.mood('encourage', { calm: 5000 });
    else if (GOOD.test(t)) G.react('praise', 1500, 'hop'), G.mood('encourage', { calm: 5000 });
  };
  const mo = new MutationObserver(read); mo.observe(host, { childList: true, subtree: true, characterData: true });
  addEventListener('hashchange', () => mo.disconnect(), { once: true });
}

let battle = false;   // 가르치기 · 실험 화면: 기본은 한 화면, 켜면 두 팀 배틀
let recog = null;     // 말로 쓰기(학생이 🎤를 눌렀을 때만)

export function renderDeck($app, { u, ch, art, plan, similar, mode, idx, mount3D, mountLab, misc, onAnswer, myLab }) {
  const teach = mode === 'teach', S = buildSlides(ch, art, plan, similar, mode);
  const i = idx === 's2' ? Math.max(0, S.findIndex((x) => x.id === 'recall')) : Math.min(S.length - 1, Math.max(0, (idx || 1) - 1)), s = S[i], p = s.phaseObj;
  const go = (k) => { location.hash = `#/${u}/lab-class/${mode}/${k + 1}`; };
  const phases = plan.phases.map((x) => `<span class="${x.id === s.phase ? 'on' : ''}">${esc(x.name)}${teach ? ` ${x.min}′` : ''}</span>`).join('');
  const isLab = s.mount === 'lab';
  $app.innerHTML = `<div class="dk dk-${mode}">
    <div class="dk-top no-print"><a href="#/${u}/start">‹ 처음으로</a><b>${esc(ch.title)}</b><span class="dk-mode">${teach ? '가르치기 · 강사용' : '스스로 공부하기 · 학생용'}</span>
      <nav class="dk-phases">${phases}</nav></div>
    <div class="dk-stage-wrap"><section class="dk-stage ${s.layout || ''}" aria-live="polite">
      ${s.title ? `<p class="dk-kick">${esc(p?.name || '')}<span>${String(s.n).padStart(2, '0')}</span></p><h2 class="dk-h">${esc(s.title)}</h2>` : ''}<div class="dk-body">${s.body}</div>
      <footer class="dk-foot"><span>${esc(ch.book)}</span><span>${s.n} / ${S.length}</span></footer></section></div>
    <div class="dk-bar no-print"><button class="btn" data-a="prev" ${i ? '' : 'disabled'}>‹ 이전</button>
      ${teach ? `<span class="dk-count">${s.n} / ${S.length} · ${esc(p?.name || '')}</span>` : ''}
      <button class="btn primary dk-next" data-a="next"><span class="dk-fill" aria-hidden="true"></span><span class="dk-nt">${i === S.length - 1 ? '처음으로' : '다음 ›'}</span></button>
      ${teach && isLab ? `<button class="btn" data-a="battle" aria-pressed="${battle}" title="두 팀이 같은 문제를 나란히 실험">⚔ 배틀 ${battle ? '끄기' : ''}</button>` : ''}
      ${teach ? `<button class="btn" data-a="notes" aria-pressed="${notesOn}">노트</button>` : ''}<button class="btn" data-a="full">전체 화면</button></div>
    ${teach ? `<aside class="dk-notes no-print" ${notesOn ? '' : 'hidden'}><b>${esc(p?.name)} · ${p?.min}분</b> ${esc(p?.aim)}${s.say && plan.say[s.say] ? `<p>발문 · ${esc(plan.say[s.say])}</p>` : ''}<small>→ / 스페이스 / 화면 클릭: 답 열기·다음 · ← 이전 · N 노트 · F 전체 화면</small></aside>` : ''}
  </div>`;
  const stage = $app.querySelector('.dk-stage'), $next = $app.querySelector('[data-a=next]');
  stage.querySelectorAll('.dk-stepi').forEach((b) => b.addEventListener('click', () => stage.querySelectorAll('.dk-stepi').forEach((x) => x.classList.toggle('on', x === b))));
  const alive = () => stage.isConnected;
  const hidden = () => [...stage.querySelectorAll('.rv:not(.on)')];
  const next = () => { const h = hidden(); if (teach && h.length) { h[0].classList.add('on'); return; } go(i === S.length - 1 ? 0 : i + 1); };
  const prev = () => { const on = [...stage.querySelectorAll('.rv.on')]; if (teach && on.length) { on.at(-1).classList.remove('on'); return; } if (i) go(i - 1); };
  $next.onclick = next;
  $app.querySelector('[data-a=prev]').onclick = prev;
  $app.querySelector('[data-a=full]').onclick = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch { /* 지원 안 함 */ } };
  const $notes = $app.querySelector('.dk-notes');
  const toggleNotes = () => { notesOn = !notesOn; if ($notes) $notes.hidden = !notesOn; $app.querySelector('[data-a=notes]')?.setAttribute('aria-pressed', notesOn); };
  $app.querySelector('[data-a=notes]')?.addEventListener('click', toggleNotes);
  $app.querySelector('[data-a=battle]')?.addEventListener('click', () => { battle = !battle; renderDeck($app, arguments[1]); });
  if (teach) stage.addEventListener('click', (e) => { if (!e.target.closest('button,canvas,a,input,textarea,.dk-3d,.dk-battle')) next(); });
  const onKey = (e) => {
    if (!alive()) { removeEventListener('keydown', onKey); return; }
    if (e.target.closest?.('textarea,input')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'f' || e.key === 'F') $app.querySelector('[data-a=full]').click();
    else if (teach && (e.key === 'n' || e.key === 'N')) toggleNotes();
  };
  addEventListener('keydown', onKey);
  addEventListener('hashchange', () => { removeEventListener('keydown', onKey); try { recog?.stop(); } catch { /* */ } }, { once: true });

  if (teach) {
    import('./docssam.js').then((m) => m.dropGuide());   // 가르치기에는 독쌤이 없다
    // 확인 문제: 정답 공개 때 표시
    stage.querySelectorAll('.dk-choices').forEach((ol) => {
      const key = ol.dataset.key.split(',').filter(Boolean).map(Number), a = stage.querySelector('.dk-ans.rv');
      new MutationObserver(() => a.classList.contains('on') && ol.querySelectorAll('button').forEach((b) => b.classList.toggle('ok', key.includes(+b.dataset.j)))).observe(a, { attributes: true });
    });
    const m = stage.querySelector('[data-mount]');
    if (m?.dataset.mount === 'scene') mount3D(m, { autoplay: false, preview: !!m.dataset.preview, from: m.dataset.from || null });
    if (m?.dataset.mount === 'lab') {
      // 교사 화면에는 학생 개인 기록을 섞지 않는다 — 실험 표는 이 화면에서만 쓰고 버린다.
      if (!battle) mountLab(m, { rows: [], personal: false });
      else {
        m.outerHTML = `<div class="dk-battle"><p class="dk-bq"><b>공통 문제</b> ${esc(ch.battle || ch.labTitle || '조건을 바꿔 결과를 비교해요')} — 두 팀이 조건을 다르게 골라 결과를 겨뤄요.</p>
          <div class="dk-bt"><section><h3>1팀</h3><div class="dk-3d" data-mount="lab" data-team="1"></div></section><section><h3>2팀</h3><div class="dk-3d" data-mount="lab" data-team="2"></div></section></div></div>`;
        stage.querySelectorAll('[data-team]').forEach((el) => mountLab(el, { rows: [], personal: false, lowPower: true }));
      }
    }
    return;
  }

  // ── 스스로 공부하기: 독쌤이 한 번에 한 행동을 말하고, 그 행동이 끝나면 저절로 다음 장으로 ──
  //    독쌤은 화면 구석의 작은 말풍선(docssam.js) — 슬라이드가 바뀌어도 같은 독쌤이 이어서 말한다(다시 그리지 않음).
  let timer = 0, pending = 0;
  const cancelAuto = () => { clearTimeout(timer); timer = 0; pending = 0; $next.classList.remove('auto'); };
  const auto = (ms) => {
    if (i === S.length - 1 || !alive()) return;
    pending = ms; if (G?.paused) { $next.classList.add('ready'); return; }
    $next.classList.remove('auto'); void $next.offsetWidth; $next.style.setProperty('--auto', `${ms}ms`); $next.classList.add('auto', 'ready');
    clearTimeout(timer); timer = setTimeout(() => { if (alive() && !G?.paused) next(); }, ms);
  };
  addEventListener('hashchange', cancelAuto, { once: true });
  // 장별 머문 시간(실측용, 이 기기에만): 몇 분짜리 수업인지 추정이 아니라 재어서 자르기 위해 — sciLab.dwell[u:장] = 최근 5번(초)
  const t0 = performance.now();
  addEventListener('hashchange', () => { try { const d = JSON.parse(localStorage.getItem('sciLab.dwell') || '{}'), k = `${u}:${s.id}`;
    d[k] = [...(d[k] || []), Math.round((performance.now() - t0) / 1000)].slice(-5); localStorage.setItem('sciLab.dwell', JSON.stringify(d)); } catch { /* 저장 불가 */ } }, { once: true });
  let G = null;
  guideFor(u).then(({ V, guide }) => {
    if (!alive() || !guide.alive) return;
    G = guide; G.reset();
    // 가리면 안 되는 것: 슬라이드의 글·단추·입력·표·실험 조작부, 아래 막대의 단추
    guideAvoid = () => [...rectsOf(stage.querySelector('.dk-body')), ...rectsOf(stage, '.dk-h'), ...rectsOf($app.querySelector('.dk-bar'), 'button')];
    G.onPause = (paused) => { if (paused) { const ms = pending; clearTimeout(timer); timer = 0; pending = ms; $next.classList.remove('auto'); } else if (pending) auto(pending); };
    wireMoods(stage, G);
    run(V);
  });
  const cue = (V, dflt) => V.slides[s.id] || dflt;
  const textLen = () => stage.querySelector('.dk-body').innerText.replace(/\s+/g, '').length;
  async function run(V) {
    const k = s.kind || 'read';
    if (k === 'read') { const t0 = performance.now(), c = cue(V, null); if (c) await G.say(c); if (!alive()) return;
      const read = Math.min(12000, Math.max(2200, textLen() * 55)) - (performance.now() - t0); auto(Math.max(1500, read)); return; }
    if (k === 'end') { G.say(cue(V, 'dk-end'), { mood: 'praise' }); return; }
    if (k === 'scene') { const m = stage.querySelector('[data-mount]'); G.say(cue(V, m.dataset.from ? 'dk-reveal' : 'dk-scene'));
      mount3D(m, { autoplay: true, preview: !!m.dataset.preview, from: m.dataset.from || null, onDone: async () => { if (!alive()) return; await G.say('dk-scene-done', { mood: 'praise' }); auto(900); } }); return; }
    if (k === 'lab') { G.say(cue(V, 'dk-lab')); const m = stage.querySelector('[data-mount]'); let done = false;
      m.addEventListener('pointerdown', () => { if (timer) cancelAuto(); }, true);   // 실험을 더 하면 넘기지 않는다
      let recs = 0;   // 조건을 바꿔 두 번 이상 적어야 비교가 된다
      mountLab(m, { personal: true, onRecord: async () => { if (done) return; recs += 1;
        if (recs < 2) { G.say('dk-lab-more', { mood: 'encourage' }); return; }
        done = true; await G.say('dk-lab-done', { mood: 'praise' }); auto(4000); } });
      watchLabTips(m, G); return; }
    if (k === 'test') return runTest(V);
    if (k === 'order') return runOrder();
    if (k === 'think') return runThink();
    if (k === 'break') { fillMine(); G.say('dk-break', { mood: 'praise' });
      stage.querySelector('[data-a2=cont]').onclick = () => next(); return; }                 // 1차시 끝: 저절로 넘기지 않는다
    if (k === 'recall') { fillMine(); G.say('dk-recall'); auto(Math.min(15000, Math.max(5000, textLen() * 55))); return; }
    if (k === 'challenge') { G.say('dk-challenge');
      stage.querySelectorAll('[data-pick]').forEach((b) => { b.onclick = () => {
        stage.querySelectorAll('[data-pane]').forEach((x) => { if (x.dataset.pane !== b.dataset.pick) x.remove(); else x.hidden = false; });
        stage.querySelector('.dk-pick').remove(); stage.querySelector('.dk-body > .dk-q').remove();
        if (b.dataset.pick === 'gifted') {
          const clock = stage.querySelector('.dk-gifted-clock'), value = clock.querySelector('strong');
          const deadline = Date.now() + 180000;
          const tick = () => {
            if (!alive()) { clearInterval(interval); return; }
            const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            value.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
            if (!left) { clearInterval(interval); clock.classList.add('done'); clock.setAttribute('aria-label', '영재성 도전 시간 종료'); clock.querySelector('span').textContent = '시간 종료'; }
          };
          const interval = setInterval(tick, 250);
          addEventListener('hashchange', () => clearInterval(interval), { once: true });
          tick();
        }
        runWrite(V); }; });
      return; }
    return runWrite(V);
  }
  // 생각만 하기: 머릿속으로 답하고 「예시 답 보기」 — 모두 열면 읽을 시간만큼 기다렸다가 다음으로
  function wirePeek(onAll) {
    const bs = [...stage.querySelectorAll('.dk-peek')];
    bs.forEach((b) => { b.onclick = () => { b.hidden = true; b.nextElementSibling.hidden = false; if (onAll && bs.every((x) => x.hidden)) onAll(); }; });
    return bs.length;
  }
  // 결과 장: 위에 내 3D 실험 기록, 표 칸은 직접 적기(저장)
  function prepRes() {
    const my = stage.querySelector('.dk-mylab'); if (my) { my.innerHTML = labTable(); my.hidden = !my.innerHTML; }
    stage.querySelectorAll('td[data-cell]').forEach((td) => { const key = `${u}:cell:${td.dataset.cell}`; td.textContent = memo.get(key); td.addEventListener('input', () => memo.set(key, td.textContent)); });
  }
  function runThink() {
    prepRes(); G.say('dk-think');
    if (!wirePeek(() => auto(Math.min(9000, Math.max(3500, textLen() * 45))))) auto(4000);
  }
  // 실험 순서 맞추기: 누른 차례대로 번호가 붙는다(다시 누르면 빠짐). 첫 오답엔 정답을 알려 주지 않고, 두 번 틀리면 순서를 보여 준다.
  function runOrder() {
    const cards = [...stage.querySelectorAll('.dk-ord')], $chk = stage.querySelector('[data-o=check]'), seq = [];
    let tries = 0, over = false;
    G.say('dk-order');
    const paint = () => { cards.forEach((c) => { const n = seq.indexOf(c); c.querySelector('.dk-ordn').textContent = n < 0 ? '' : n + 1; c.classList.toggle('pick', n >= 0); }); $chk.disabled = seq.length !== cards.length; };
    cards.forEach((c) => { c.onclick = () => { if (over) return; const n = seq.indexOf(c); if (n >= 0) seq.splice(n, 1); else seq.push(c); c.classList.remove('no'); paint(); }; });
    stage.querySelector('[data-o=reset]').onclick = () => { if (over) return; seq.length = 0; cards.forEach((c) => c.classList.remove('no')); paint(); };
    $chk.onclick = async () => {
      const ok = seq.every((c, j) => +c.dataset.j === j);
      const sorted = () => [...cards].sort((a, b) => a.dataset.j - b.dataset.j).forEach((c) => c.parentElement.parentElement.appendChild(c.parentElement));
      if (ok) { over = true; cards.forEach((c) => c.classList.add('ok')); sorted(); $chk.disabled = true; await G.say('dk-order-ok', { mood: 'praise' }); auto(3500); return; }
      tries += 1;
      if (tries < 2) { seq.forEach((c, j) => c.classList.toggle('no', +c.dataset.j !== j)); G.say('dk-order-retry', { mood: 'encourage' }); seq.length = 0; paint(); return; }
      over = true; cards.forEach((c) => { c.classList.remove('no', 'pick'); c.classList.add('ok'); c.querySelector('.dk-ordn').textContent = +c.dataset.j + 1; });
      sorted(); $chk.disabled = true; await G.say('dk-order-show'); auto(6000);
    };
  }
  // 내가 쓴 것 모아 보기(1차시 끝·2차시 처음): 가설 + 3D 실험 기록 + 결과 답
  function fillMine() {
    const box = stage.querySelector('.dk-mine'); if (!box) return;
    const hy = memo.get(`${u}:hypo`), res = S.filter((x) => /^res\d/.test(x.id)).map((x, j) => memo.get(`${u}:res${j}`)).filter(Boolean);
    box.innerHTML = `<div class="dk-card"><h3>내 가설</h3><p>${esc(hy) || '<i>아직 쓰지 않았어요</i>'}</p></div>${labTable()}${res.length ? `<div class="dk-card"><h3>내가 적은 결과</h3>${res.map((t) => `<p>${esc(t)}</p>`).join('')}</div>` : ''}`;
  }
  // 쓰기: 모든 칸을 채우면 '확인' → 예시 답과 비교해 스스로 O/X. O면 다음 장으로.
  function labTable() {
    const L = myLab?.(); if (!L?.rows?.length) return '';
    return `<div class="dk-card"><h3>내 3D 실험 기록</h3><table class="dk-tbl"><tr>${L.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${L.rows.map((r) => `<tr>${Object.values(r).slice(0, L.cols.length).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }
  function runWrite(V) {
    wirePeek();
    prepRes();
    const boxes = [...stage.querySelectorAll('.dk-self')]; if (!boxes.length) { auto(3000); return; }
    const body = stage.querySelector('.dk-body');
    body.insertAdjacentHTML('beforeend', `<div class="dk-act"><button type="button" class="dk-go" data-w="check" disabled>확인</button>
      <span class="dk-sc" hidden><button type="button" class="dk-o" data-w="o">O 비슷해요</button><button type="button" class="dk-x" data-w="x">X 고칠래요</button></span></div>`);
    const $chk = body.querySelector('[data-w=check]'), $sc = body.querySelector('.dk-sc');
    const tas = boxes.map((b) => b.querySelector('textarea'));
    // 확인 문제의 쓰기(ㄴ·ㄷ 같은 한 글자 답)는 한 글자면 되고, 생각 쓰기는 두 글자 이상
    const minLen = s.id.startsWith('test') ? 1 : 2;
    const ready = () => { $chk.disabled = !tas.every((t) => t.value.trim().length >= minLen); };
    boxes.forEach((b) => {
      const key = `${u}:${b.dataset.k}`, ta = b.querySelector('textarea');
      ta.value = memo.get(key); ta.addEventListener('input', () => { memo.set(key, ta.value); ready(); });
      b.querySelector('.dk-mic')?.addEventListener('click', (e) => listen(e.currentTarget, ta, () => { memo.set(key, ta.value); ready(); }));
    });
    ready();
    const say = cue(V, 'dk-write'); G.say(say);
    $chk.onclick = () => { boxes.forEach((b) => { b.querySelector('.dk-ans').hidden = false; }); $chk.hidden = true; $sc.hidden = false; G.say('dk-compare'); };
    body.querySelector('[data-w=o]').onclick = async () => { memo.set(`${u}:${s.id}:ok`, 1); $sc.querySelectorAll('button').forEach((x) => { x.disabled = true; }); await G.say('dk-self-ok', { mood: 'praise' }); auto(700); };
    body.querySelector('[data-w=x]').onclick = () => { cancelAuto(); G.say('dk-self-x', { mood: 'encourage' }); tas[0].focus(); };
  }
  // 확인 문제: 첫 오답에 정답을 알려 주지 않는다 — 그 보기에 이어진 오개념 힌트를 주고 다시 고르게. 풀이는 한 번 틀린 뒤 스스로 열 수 있다.
  function runTest(V) {
    const ol = stage.querySelector('.dk-choices'), key = ol.dataset.key.split(',').filter(Boolean).map(Number), multi = ol.dataset.multi === 'true';
    const $hint = stage.querySelector('.dk-hint'), $ans = stage.querySelector('.dk-ans'), picked = new Set();
    let tries = 0, over = false;
    G.say(multi ? 'dk-choose-multi' : cue(V, 'dk-choose'));
    // 힌트는 '어떤 생각을 했는지' 되묻기만 한다. 교정 문장(fix)은 개념을 말하므로 정답을 드러낼 수 있어 풀고 난 뒤에 보여 준다.
    const fixes = [];
    const hintFor = (js) => { const d = misc?.distractors?.[s.item] || {}; for (const j of js) { const m = misc?.misconceptions?.[d[j]]; if (m) { fixes.push(m.fix); return `혹시 이렇게 생각했나요? — ${esc(m.label)}. 보기를 하나씩 다시 읽어 봐요.`; } }
      return '문제에서 묻는 것이 무엇인지 다시 읽고, 보기마다 조건을 하나씩 살펴봐요.'; };
    const finish = async (ok) => {
      over = true; ol.querySelectorAll('button').forEach((b) => { b.disabled = true; b.classList.toggle('ok', key.includes(+b.dataset.j)); });
      $ans.hidden = false; $hint.hidden = true;
      if (fixes.length) $ans.insertAdjacentHTML('beforeend', `<p class="dk-fix"><b>개념 정리</b> ${[...new Set(fixes)].join(' ')}</p>`);
      if (ok) { $ans.insertAdjacentHTML('afterbegin', '<b class="dk-right">맞았어요!</b> '); await G.say('dk-right', { mood: 'praise' }); auto(Math.max(2500, $ans.textContent.length * 45)); }
      else auto(Math.max(4000, $ans.textContent.length * 60));
    };
    const judge = () => {
      const ok = key.length === picked.size && key.every((x) => picked.has(x));
      if (!tries) onAnswer?.(s.item, ok, [...picked]);
      tries++;
      if (ok) return finish(true);
      const wrong = [...picked].filter((j) => !key.includes(j));
      wrong.forEach((j) => { const b = ol.querySelector(`[data-j="${j}"]`); b.classList.add('no'); b.disabled = true; });
      picked.clear(); ol.querySelectorAll('.pick').forEach((b) => b.classList.remove('pick'));
      $hint.innerHTML = `<b>힌트</b> ${hintFor(wrong)} <button type="button" class="dk-sol">풀이 보기</button>`; $hint.hidden = false;
      $hint.querySelector('.dk-sol').onclick = () => finish(false);
      G.say('dk-wrong', { mood: 'encourage' });
    };
    ol.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      if (over) return; const j = +b.dataset.j;
      if (multi) { picked.has(j) ? picked.delete(j) : picked.add(j); b.classList.toggle('pick'); $mc.disabled = !picked.size; return; }
      picked.add(j); judge();
    }));
    let $mc = null;
    if (multi) { ol.insertAdjacentHTML('afterend', '<div class="dk-act"><button type="button" class="dk-go" disabled>확인</button></div>'); $mc = ol.nextElementSibling.querySelector('button'); $mc.onclick = () => { if (picked.size) judge(); }; }
  }
}

// 말로 쓰기: 학생이 🎤를 눌렀을 때만 켜고, 받아쓴 글은 칸에 이어 붙일 뿐 제출하지 않는다.
function listen(btn, ta, onText) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) return;
  if (recog) { try { recog.stop(); } catch { /* */ } return; }
  recog = new R(); recog.lang = 'ko-KR'; recog.interimResults = false; recog.continuous = false;
  btn.setAttribute('aria-pressed', 'true'); btn.classList.add('on');
  recog.onresult = (e) => { const t = [...e.results].map((r) => r[0].transcript).join(' ').trim(); if (t) { ta.value = (ta.value ? `${ta.value} ` : '') + t; onText(); } };
  recog.onend = recog.onerror = () => { btn.setAttribute('aria-pressed', 'false'); btn.classList.remove('on'); recog = null; };
  try { recog.start(); } catch { recog = null; }
}
