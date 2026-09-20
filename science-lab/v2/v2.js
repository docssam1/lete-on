// docssam 과학 탐구 랩 v2 — 단원 = 5E 한 단계 한 화면 + 준비물(QR) + 탐구보고서 + 교재 인쇄.
// 화면과 교재는 같은 단원 데이터(data/units/*.js)를 쓴다.
import { mountRingTower, towerModel } from './lab-ring-tower.js';

const UNITS = { 's41-u01': async () => ({ ...(await import('../data/units/s41-u01.js')), ...(await import('../data/units/s41-u01.lesson.js')) }) };
const STEPS = [
  { key: 'engage', label: '① 궁금' }, { key: 'explore', label: '② 실험' }, { key: 'explain', label: '③ 개념' },
  { key: 'elaborate', label: '④ 확장' }, { key: 'evaluate', label: '⑤ 점검' },
];
const A = '../assets/';
const BODY = { talk: 'docssam-A1-mouth-closed.webp', surprised: 'docssam-B1-surprised.webp', thinking: 'docssam-B2-thinking.webp', praise: 'docssam-B3-praise.webp', encourage: 'docssam-B4-encourage.webp' };
const FACE = { half: 'face-A2-mouth-half.webp', open: 'face-A3-mouth-open.webp', o: 'face-A4-mouth-o.webp', blink: 'face-A5-eyes-closed.webp' };
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const $app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CIRC = ['①', '②', '③', '④', '⑤'];

// ── 저장(기기) — 실패해도 화면은 그대로 동작 ──
const KEY = 'sciLab.v2';
const store = {
  all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
  get(u) { return this.all()[u] || {}; },
  set(u, patch) { try { const a = this.all(); a[u] = { ...(a[u] || {}), ...patch }; localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* 저장 불가 기기 */ } },
};

// ── docssam: 말하기(모음에 따라 입 모양) · 깜빡임 · 표정 ──
function mouthFor(ch) {
  const c = ch.charCodeAt(0) - 0xac00; if (c < 0 || c > 11171) return null;
  const j = Math.floor(c / 28) % 21;
  if ([0, 2, 4, 6, 9, 14].includes(j)) return 'open';
  if ([8, 12, 13, 17].includes(j)) return 'o';
  return 'half';
}
let voiceOn = false;
function teacher(el, lines, { big = false } = {}) {
  el.innerHTML = `<div class="teacher ${big ? 'big' : ''}"><div class="bubble" aria-live="polite"></div>
    <div class="char"><img class="body" alt="docssam 선생님"><img class="face" alt=""></div></div>`;
  const $b = el.querySelector('.bubble'), $c = el.querySelector('.char'), $body = el.querySelector('.body'), $face = el.querySelector('.face');
  let alive = true, talking = false;
  const face = (k) => { if (!k) { $face.style.display = 'none'; return; } $face.src = A + FACE[k]; $face.style.display = 'block'; };
  const blink = () => setTimeout(() => { if (!alive || !el.isConnected) return; if (!talking && $body.dataset.mood === 'talk') { face('blink'); setTimeout(() => !talking && face(null), 140); } blink(); }, 3000 + Math.random() * 2000);
  async function say(line) {
    const mood = line.mood || 'talk'; $body.src = A + BODY[mood] ; $body.dataset.mood = mood; face(null);
    $b.classList.toggle('ask', mood === 'surprised' || mood === 'thinking');
    if (voiceOn && 'speechSynthesis' in window) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(line.text); u.lang = 'ko-KR'; speechSynthesis.speak(u); } catch { /* 음성 없음 */ } }
    if (REDUCED) { $b.textContent = line.text; return; }
    talking = true; $c.classList.add('talk'); $b.textContent = '';
    for (const ch of line.text) {
      if (!alive) return; $b.textContent += ch;
      const m = mood === 'talk' ? mouthFor(ch) : null; face(m);
      await new Promise((r) => setTimeout(r, m ? 90 : 150));
      if (m) { face(null); await new Promise((r) => setTimeout(r, 20)); }
    }
    talking = false; $c.classList.remove('talk'); face(null);
  }
  (async () => { for (const l of lines) { await say(l); await new Promise((r) => setTimeout(r, 700)); } })();
  blink();
  return { say, stop() { alive = false; } };
}

// ── 문항 렌더러 (화면·교재 공용) ──
function blanksHtml(text, blanks, { print, show }) {
  let i = 0;
  return esc(text).replace(/\( [①②③④⑤] \)/g, () => {
    const b = blanks[i], k = i++;
    if (print) return show ? `<span class="blank-print ans">${esc(b.answer)}</span>` : '<span class="blank-print">&nbsp;</span>';
    return `<button type="button" class="blank" data-k="${k}" aria-label="빈칸 ${k + 1}, 눌러서 열기">?</button>`;
  });
}
function itemHtml(it, { print = false, show = false, no = '' } = {}) {
  const ac = it.answerContract, lv = `<span class="level">${esc(it.taxonomy.track)} · ${esc(it.taxonomy.level)}</span>`;
  const fig = it.visualModel?.kind === 'authored-svg' ? `<div class="fig">${FIG[it.visualModel.figure] || ''}</div>` : '';
  const giv = it.givens ? Object.entries(it.givens).map(([k, v]) => `<p class="lead"><b>${esc(k)}</b> ${esc(Array.isArray(v) ? v.join(' / ') : v)}</p>`).join('') : '';
  const head = `<p>${no ? `<span class="no">${no}.</span>` : ''}${ac.type === 'cloze' ? blanksHtml(it.prompt, ac.blanks, { print, show }) : esc(it.prompt)}</p>`;
  let body = '';
  if (ac.type === 'single-choice') {
    body = print ? `<div class="${it.choices.join('').length < 60 ? 'cols' : ''}">${it.choices.map((c, i) => `<div${show && i === ac.answer ? ' class="ans"' : ''}>${CIRC[i]} ${esc(c)}</div>`).join('')}</div>`
      : `<div class="choices">${it.choices.map((c, i) => `<button type="button" class="choice" data-i="${i}">${CIRC[i]} ${esc(c)}</button>`).join('')}</div><p class="why" hidden></p>`;
  } else if (ac.type === 'table-fill') {
    const cols = ac.columns;
    body = `<table class="tbl tfill"><thead><tr><th>물체</th>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${ac.rows.map((r, ri) => `<tr><td>${esc(r.label)}</td>${cols.map((c, ci) => print
      ? `<td>${show ? `<span class="ans">${esc(r.answer[ci])}</span>` : ''}</td>`
      : `<td><select data-r="${ri}" data-c="${ci}" aria-label="${esc(r.label)} ${esc(c)}"><option value="">고르기</option>${ac.options[c].map((o) => `<option>${esc(o)}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody></table>
      ${print ? '' : '<button type="button" class="btn" data-act="check-table">맞았는지 보기</button><p class="why" hidden></p>'}`;
  } else if (ac.type === 'written-explanation') {
    const rb = ac.rubric;
    body = print ? (show ? `<p class="ans">예시 답: ${esc(ac.sample)}</p><ul class="rubric">${rb.required.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : '<div class="ans-line"></div><div class="ans-line"></div><div class="ans-line"></div>')
      : `<textarea aria-label="내 답 쓰기"></textarea><details><summary>채점 기준 보기</summary><ul class="rubric">${rb.required.map((r) => `<li><label><input type="checkbox"> ${esc(r)}</label></li>`).join('')}</ul><p class="rubric">통과: ${esc(rb.pass)}${rb.bonus ? ` · 더하기: ${esc(rb.bonus)}` : ''}</p><p class="why">예시 답: ${esc(ac.sample)}</p></details>`;
    if (rb.preview) body += `<p class="preview"><b>미리보기</b> ${esc(rb.preview)}</p>`;
  }
  const expl = print && show ? `<p class="why">${esc(it.explanation)}</p>` : '';
  return `<div class="${print ? 'q' : 'card item'}" data-id="${it.id}">${print ? '' : lv}${fig}${giv}${head}${body}${expl}</div>`;
}
let FIG = {};
function wireItem(card, it, onDone) {
  const ac = it.answerContract;
  card.querySelectorAll('.blank').forEach((b) => b.addEventListener('click', () => { b.textContent = ac.blanks[+b.dataset.k].answer; b.classList.add('open'); if ([...card.querySelectorAll('.blank')].every((x) => x.classList.contains('open'))) onDone?.(true); }));
  if (ac.type === 'single-choice') {
    const $why = card.querySelector('.why');
    card.querySelectorAll('.choice').forEach((btn) => btn.addEventListener('click', () => {
      if (card.dataset.done) return; card.dataset.done = 1;
      const i = +btn.dataset.i, ok = i === ac.answer;
      btn.classList.add(ok ? 'right' : 'wrong'); card.querySelector(`.choice[data-i="${ac.answer}"]`).classList.add('right');
      $why.hidden = false; $why.innerHTML = `${ok ? '맞았어요!' : '<b>다시 생각해 봐요.</b>'} ${esc(it.explanation)}`; onDone?.(ok);
    }));
  }
  card.querySelector('[data-act=check-table]')?.addEventListener('click', () => {
    let right = 0, total = 0; card.querySelectorAll('select').forEach((s) => { total++; if (s.value === ac.rows[+s.dataset.r].answer[+s.dataset.c]) right++; });
    const $why = card.querySelector('.why'); $why.hidden = false; $why.textContent = `${total}칸 중 ${right}칸 맞았어요. ${it.explanation}`; onDone?.(right === total);
  });
}

// ── 화면 뼈대 ──
function frame(u, lesson, stepIdx, inner, { next, nextLabel = '다음' } = {}) {
  const st = store.get(u);
  $app.innerHTML = `<header class="top"><div class="wrap">
      <a class="back" href="../#/">‹ 지도로</a><h1>${esc(lesson.title)}</h1>
      ${stepIdx != null ? `<nav class="dots" aria-label="단계">${STEPS.map((s, i) => `<a href="#/${u}/${i + 1}" class="${i === stepIdx ? 'on' : (st.done || []).includes(i) ? 'done' : ''}" aria-label="${s.label}"></a>`).join('')}</nav>` : ''}
      <button class="icon-btn" id="voice" aria-pressed="${voiceOn}" title="읽어 주기">${voiceOn ? '소리 켬' : '소리'}</button>
    </div></header>
    <main class="wrap">${inner}</main>
    ${next ? `<div class="bottom"><div class="wrap"><a class="btn primary" href="${next}" style="display:flex;align-items:center;justify-content:center;text-decoration:none">${nextLabel}</a></div></div>` : ''}`;
  $app.querySelector('#voice').addEventListener('click', (e) => { voiceOn = !voiceOn; e.currentTarget.setAttribute('aria-pressed', voiceOn); e.currentTarget.textContent = voiceOn ? '소리 켬' : '소리'; if (!voiceOn) try { speechSynthesis.cancel(); } catch { /* */ } });
  if (stepIdx != null) { const d = new Set(st.done || []); d.add(stepIdx); store.set(u, { done: [...d], step: stepIdx }); }
  scrollTo(0, 0);
}
const byId = (items) => Object.fromEntries(items.map((i) => [i.id, i]));

// ① 궁금
function stepEngage(u, L) {
  const e = L.engage, st = store.get(u);
  frame(u, L, 0, `<p class="step-label">${STEPS[0].label}</p><div id="t"></div>
    <div id="s3d"></div>
    <div class="card"><h3>${esc(e.question)}</h3><div class="choices">${e.predictions.map((p) => `<button type="button" class="choice ${st.prediction === p.id ? 'sel' : ''}" data-p="${p.id}">${esc(p.text)}</button>`).join('')}</div>
    <p class="why">정답은 실험을 해 본 뒤에 알려 줄게요.</p></div>`, { next: `#/${u}/2`, nextLabel: '실험하러 가기' });
  teacher(document.getElementById('t'), e.say);
  mount3D(document.getElementById('s3d'), e.scene, { autoplay: true });
  $app.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { store.set(u, { prediction: b.dataset.p }); $app.querySelectorAll('[data-p]').forEach((x) => x.classList.toggle('sel', x === b)); }));
}

// ② 실험 (가상 실험실 · 3D 보기 · 집 실험)
function stepExplore(u, L, mode) {
  const x = L.explore; mode = mode || 'lab';
  const names = { lab: '가상 실험실', scene: '3D로 보기', home: '집에서 실험' };
  frame(u, L, 1, `<p class="step-label">${STEPS[1].label}</p><div id="t"></div>
    <div class="modes" role="tablist">${x.modes.map((m) => `<button role="tab" aria-selected="${m === mode}" data-m="${m}">${names[m]}</button>`).join('')}</div>
    <div id="pane"></div>`, { next: `#/${u}/3`, nextLabel: '개념 정리하러 가기' });
  teacher(document.getElementById('t'), x.say);
  $app.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => { location.hash = `#/${u}/2/${b.dataset.m}`; }));
  const pane = document.getElementById('pane');
  if (mode === 'lab') {
    pane.innerHTML = `<div class="card"><p><b>${esc(x.lab.goal)}</b></p><div id="lab"></div></div>`;
    mountRingTower(document.getElementById('lab'), { rings: x.lab.rings, rows: store.get(u).labRows || [], onRecord: (rows) => store.set(u, { labRows: rows }) });
  } else if (mode === 'scene') {
    mount3D(pane, 'ring-tower', { autoplay: false });
  } else {
    pane.innerHTML = kitHtml(u, x.home);
  }
}
function kitHtml(u, h) {
  const buy = h.materials.filter((m) => m.have === 'buy');
  const link = (m) => m.buy.coupangUrl || `https://www.coupang.com/np/search?q=${encodeURIComponent(m.buy.query)}`;
  return `<div class="card"><h3>${esc(h.title)} <span class="level">${h.minutes}분 · ${h.guardian ? '보호자와 함께' : '혼자 해도 돼요'}</span></h3>
    <div class="kit-qr"><img src="${h.qr}" alt="준비물 페이지로 가는 QR"><p class="lead">부모님 휴대폰으로 QR을 찍으면 준비물을 바로 살 수 있어요. 결제는 부모님이 해요.</p></div></div>
    <div class="card"><h3>준비물</h3>${h.materials.map((m) => `<div class="mat"><span class="name">${esc(m.name)} <small class="lead">${esc(m.qty)}</small></span>${m.have === 'home' ? '<span class="tag">집에 있음</span>' : `<a class="buy" href="${esc(link(m))}" target="_blank" rel="noopener">쿠팡에서 찾기</a>`}</div>`).join('')}
    ${buy.length ? '<p class="lead" style="margin-top:8px">로켓배송 표시가 있는 상품을 고르면 배송비 부담이 적어요.</p>' : ''}</div>
    <div class="card"><h3>순서</h3><ol class="steps">${h.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>
    <div class="card safety"><h3>안전</h3><ul>${h.safety.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
}

// ③ 개념
function stepExplain(u, L, items) {
  const x = L.explain, I = byId(items), st = store.get(u), rows = st.labRows || [];
  const best = rows.reduce((a, r) => (!a || r.height > a.height ? r : a), null);
  const pred = L.engage.predictions.find((p) => p.id === st.prediction);
  frame(u, L, 2, `<p class="step-label">${STEPS[2].label}</p><div id="t"></div>
    ${pred ? `<div class="card from-data">네 예상: <b>${esc(pred.text)}</b> — ${st.prediction === L.engage.answer ? '실험 결과와 같았어요!' : '실험 결과는 달랐어요. 마주 보는 면의 극이 까닭이었어요.'}</div>` : ''}
    ${best ? `<div class="card from-data">${esc(x.fromData.replace('{floating}', best.floating))} (탑 높이 ${best.height}칸)</div>` : ''}
    <p class="analogy">${esc(x.analogy)}</p>
    ${x.cards.map((id) => itemHtml(I[id])).join('')}
    ${itemHtml(I[x.table])}
    <h3>잠깐 확인</h3>${x.miniTest.map((id) => itemHtml(I[id])).join('')}`, { next: `#/${u}/4`, nextLabel: '영재원 문제로 넓히기' });
  teacher(document.getElementById('t'), x.say, { big: true });
  $app.querySelectorAll('.item').forEach((c) => wireItem(c, I[c.dataset.id]));
}

// ④ 확장
function stepElaborate(u, L, items) {
  const x = L.elaborate, I = byId(items);
  frame(u, L, 3, `<p class="step-label">${STEPS[3].label}</p><div id="t"></div>
    <div class="card"><h3>${esc(x.reading.title)}</h3><p>${esc(x.reading.text)}</p></div>
    ${x.items.map((id) => itemHtml(I[id])).join('')}
    ${x.report ? `<div class="card"><h3>탐구보고서</h3><p class="lead">실험 기록이 보고서에 자동으로 들어가 있어요. 빈칸만 내 말로 채워요.</p><a class="btn" href="#/${u}/report" style="display:inline-flex;align-items:center;text-decoration:none">보고서 쓰기</a></div>` : ''}`,
  { next: `#/${u}/5`, nextLabel: '마지막 점검' });
  teacher(document.getElementById('t'), x.say);
  $app.querySelectorAll('.item').forEach((c) => wireItem(c, I[c.dataset.id]));
}

// ⑤ 점검 — 관문 2/3, 다시 풀기는 보기 섞기
function shuffleItem(it) {
  if (it.answerContract.type !== 'single-choice') return it;
  const order = it.choices.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { ...it, choices: order.map((i) => it.choices[i]), answerContract: { ...it.answerContract, answer: order.indexOf(it.answerContract.answer) } };
}
function stepEvaluate(u, L, items, retry = false) {
  const x = L.evaluate, I = byId(items);
  const list = x.items.map((id) => (retry ? shuffleItem(I[id]) : I[id]));
  frame(u, L, 4, `<p class="step-label">${STEPS[4].label}</p><div id="t"></div>
    ${list.map((it, k) => itemHtml(it, { no: k + 1 })).join('')}<div id="res"></div>`);
  teacher(document.getElementById('t'), x.say);
  let answered = 0, right = 0;
  $app.querySelectorAll('.item').forEach((c, k) => wireItem(c, list[k], (ok) => {
    answered++; if (ok) right++;
    if (answered === list.length) {
      const pass = right >= x.pass; store.set(u, { passed: pass || store.get(u).passed, best: Math.max(right, store.get(u).best || 0) });
      document.getElementById('res').innerHTML = `<div class="card result"><p class="score">${right} / ${list.length}</p>
        <p>${pass ? '관문 통과! 깃발을 받았어요.' : `${x.pass}문제 이상 맞으면 통과예요.`}</p>
        <div class="print-bar" style="justify-content:center">${pass ? `<button class="btn" id="again">다시 풀기</button><a class="btn primary" href="../#/" style="display:inline-flex;align-items:center;text-decoration:none">다음 정거장</a>` : `<a class="btn" href="#/${u}/3" style="display:inline-flex;align-items:center;text-decoration:none">개념 다시 보기</a><button class="btn primary" id="again">다시 풀기</button>`}</div></div>`;
      teacher(document.getElementById('t'), [{ mood: pass ? 'praise' : 'encourage', text: pass ? '정말 잘했어요!' : '괜찮아요, 한 번 더 해 볼까요?' }]);
      document.getElementById('again').addEventListener('click', () => stepEvaluate(u, L, items, true));
    }
  }));
}

// 준비물 페이지 (QR 도착지)
function pageKit(u, L) {
  frame(u, L, null, `<p class="step-label">준비물</p><h2>${esc(L.explore.home.title)}</h2>${kitHtml(u, L.explore.home)}
    <p class="lead"><a href="#/${u}/1">학습 처음으로</a></p>`);
}

// 탐구보고서 — 자동 채움 + 기기 저장 + 인쇄
function reportAuto(u, L) {
  const st = store.get(u), h = L.explore.home, rows = st.labRows || [];
  const pred = L.engage.predictions.find((p) => p.id === st.prediction);
  return {
    'engage.question': L.engage.question,
    'engage.prediction': pred ? `${pred.text}(이)라고 예상했어요.` : '',
    'explore.home.materials': h.materials.map((m) => `${m.name} ${m.qty}`).join(', '),
    'explore.home.steps': h.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'),
    'explore.lab.table': rows.length ? rows.map((r) => `${r.shape} → 떠 있는 층 ${r.floating}, 높이 ${r.height}칸`).join('\n') : '',
  };
}
function pageReport(u, L) {
  const R = L.report, auto = reportAuto(u, L), saved = store.get(u).report || {};
  frame(u, L, null, `<p class="step-label">탐구보고서</p><h2>${esc(R.title)}</h2>
    <div class="print-bar no-print"><button class="btn" onclick="print()">A4로 인쇄</button><a class="btn" href="#/${u}/4" style="display:inline-flex;align-items:center;text-decoration:none">확장으로 돌아가기</a></div>
    <form class="report card">${R.sections.map((s) => `<label for="r-${s.key}">${esc(s.label)}</label>${s.hint ? `<p class="hint">${esc(s.hint)}</p>` : ''}
      <textarea id="r-${s.key}" data-k="${s.key}">${esc(saved[s.key] ?? (s.from ? auto[s.from] : s.default) ?? '')}</textarea>`).join('')}
    </form>
    <div class="card"><h3>스스로 점검</h3><ul class="checks">${R.checks.map((c) => `<li><label><input type="checkbox"> ${esc(c)}</label></li>`).join('')}</ul></div>`);
  $app.querySelectorAll('textarea[data-k]').forEach((t) => t.addEventListener('input', () => { const r = store.get(u).report || {}; r[t.dataset.k] = t.value; store.set(u, { report: r }); }));
}

// 분류 체계(bank/taxonomy/<단원>.json)는 유형별 문제 차례·이름·설명에만 쓴다.
// 없으면 유형 코드만으로 묶고 넘어간다 — 교재가 통째로 비지는 않게.
const TAXO = {};
async function taxonomyFor(u) {
  if (!(u in TAXO)) {
    TAXO[u] = await fetch(new URL(`../bank/taxonomy/${u}.json`, import.meta.url)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  }
  return TAXO[u];
}
// 유사문항을 내용 요소 → 유형 차례로 줄 세운다. 분류 체계의 순서가 곧 교재의 차례다.
function orderByType(tax, sims) {
  if (!tax) return [...sims].sort((a, b) => (a.taxonomy.type || '').localeCompare(b.taxonomy.type || '') || a.id.localeCompare(b.id));
  const rank = Object.fromEntries(tax.types.map((t, i) => [t.id, i]));
  return [...sims].sort((a, b) => (rank[a.taxonomy.type] ?? 99) - (rank[b.taxonomy.type] ?? 99) || a.id.localeCompare(b.id));
}
function typeSectionHtml(tax, ordered, show, numOf) {
  if (!ordered.length) return '';
  const byType = {};
  for (const it of ordered) (byType[it.taxonomy.type] ||= []).push(it);
  const els = tax ? tax.elements : [...new Set(ordered.map((i) => i.taxonomy.element))].map((id) => ({ id, name: '', desc: '' }));
  const types = tax ? tax.types : Object.keys(byType).map((id) => ({ id, element: byType[id][0].taxonomy.element, name: '', desc: '' }));
  return els.map((el, ei) => {
    const mine = types.filter((t) => t.element === el.id && byType[t.id]?.length);
    if (!mine.length) return '';
    return `<section class="page ${ei === 0 ? 'page-break' : 'page-break'}">
      ${ei === 0 ? '<h2>유형별 문제</h2><p class="type-intro">단원평가에 나오는 유형을 내용 요소 차례로 모았어요. 유형마다 무엇을 묻는지 먼저 읽고 풀어 보세요.</p>' : ''}
      <h3 class="el-head"><span class="el-code">${esc(el.id)}</span> ${esc(el.name)}</h3>
      ${mine.map((t) => `<div class="type-block">
        <p class="type-head"><span class="type-code">${esc(t.id)}</span> ${esc(t.name)} <span class="type-n">${byType[t.id].length}문항</span></p>
        ${t.desc ? `<p class="type-desc">${esc(t.desc)}</p>` : ''}
        ${byType[t.id].map((it) => itemHtml(it, { print: true, show, no: numOf(it) })).join('')}
      </div>`).join('')}
    </section>`;
  }).join('');
}

// 교재 인쇄: student(빈칸) · teacher(정답 포함) · answers(정답·해설만)
async function pageBook(u, L, items, mode) {
  const I = byId(items), show = mode === 'teacher';
  const tax = await taxonomyFor(u);
  const isSim = (i) => i.sourceRef?.type === 'similar';
  const own = items.filter((i) => !isSim(i));
  const kyo = own.filter((i) => i.taxonomy.track === '교과'), yeong = own.filter((i) => i.taxonomy.track === '영재성');
  const typed = orderByType(tax, items.filter(isSim));
  // 번호는 세 묶음을 통틀어 한 번만 매긴다 — 문제지와 정답지가 같은 목록에서 나오므로 어긋날 수 없다.
  const printed = [...kyo, ...yeong, ...typed];
  const numAt = new Map(printed.map((it, i) => [it.id, i + 1]));
  const numOf = (it) => numAt.get(it.id);
  const h = L.explore.home;
  const qs = (list) => list.map((it) => itemHtml(it, { print: true, show, no: numOf(it) })).join('');
  const answers = () => { let k = 0; return printed.map((it) => { k++; const ac = it.answerContract;
    const a = ac.type === 'single-choice' ? CIRC[ac.answer] : ac.type === 'cloze' ? ac.blanks.map((b) => b.answer).join(', ') : ac.type === 'table-fill' ? ac.rows.map((r) => `${r.label}: ${r.answer.join('·')}`).join(' / ') : ac.sample;
    return `<div class="q"><span class="no">${k}.</span> <b class="ans">${esc(a)}</b> — ${esc(it.explanation)}</div>`; }).join(''); };
  const chapter = mode === 'answers' ? '' : `
    <section class="page"><h2>${esc(L.title)} — 개념 정리</h2>
      <p class="analogy">${esc(L.explain.analogy)}</p>
      ${L.explain.cards.map((id) => itemHtml(I[id], { print: true, show })).join('')}
      ${itemHtml(I[L.explain.table], { print: true, show })}</section>
    <section class="page page-break"><h2>실험 — ${esc(h.title)}</h2>
      <p><b>알아볼 것</b> ${esc(L.engage.question)}</p>
      <p><b>원리</b> 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당겨요(개념 정리 쪽).</p>
      <div class="kit-qr"><img src="${h.qr}" alt="준비물 QR" style="width:30mm;height:30mm"><div><b>준비물</b><ul>${h.materials.map((m) => `<li>${esc(m.name)} ${esc(m.qty)}${m.have === 'buy' ? ' (QR로 구매)' : ''}</li>`).join('')}</ul></div></div>
      <h3>순서</h3><ol class="steps">${h.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <h3>안전</h3><ul>${h.safety.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h3>결과 기록</h3><table class="tbl"><thead><tr>${L.explore.lab.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${[1, 2, 3, 4].map(() => '<tr><td>&nbsp;</td><td></td><td></td></tr>').join('')}</tbody></table></section>
    <section class="page page-break rep-print"><h2>탐구보고서</h2>${L.report.sections.map((s) => `<h3>${esc(s.label)}</h3><div class="ans-line"></div><div class="ans-line"></div>`).join('')}</section>
    <section class="page page-break"><h2>문제 — 교과</h2>${qs(kyo)}</section>
    <section class="page page-break"><h2>문제 — 영재성</h2>${qs(yeong)}</section>
    ${typeSectionHtml(tax, typed, show, numOf)}`;
  const tail = mode === 'student' ? '' : `<section class="page page-break"><h2>정답·해설</h2>${answers()}</section>`;
  $app.innerHTML = `<div class="book"><div class="wrap no-print print-bar">
      <a class="btn" href="#/${u}/print/student" style="display:inline-flex;align-items:center;text-decoration:none">학생용</a>
      <a class="btn" href="#/${u}/print/teacher" style="display:inline-flex;align-items:center;text-decoration:none">교사용</a>
      <a class="btn" href="#/${u}/print/answers" style="display:inline-flex;align-items:center;text-decoration:none">정답·해설만</a>
      <button class="btn primary" onclick="print()">인쇄</button></div>
    <div class="wrap">${chapter}${tail}</div></div>`;
}

// 3D (기존 engine.js 재사용)
async function mount3D(el, sceneName, { autoplay }) {
  el.innerHTML = `<div class="stage3d"><canvas aria-label="3D 실험 장면. 끌어서 돌려 볼 수 있어요."></canvas><p class="cap">장면을 준비하고 있어요…</p>
    <div class="ctl"><button class="btn primary" data-a="play">재생</button><button class="btn" data-a="prev">이전</button><button class="btn" data-a="next">다음</button></div></div>`;
  try {
    const [{ Stage, Player }, mod] = await Promise.all([import('../engine.js'), import(`../scenes/${sceneName}.js`)]);
    if (!el.isConnected) return;
    const stage = new Stage(el.querySelector('canvas')), player = new Player(stage);
    const $cap = el.querySelector('.cap'), $play = el.querySelector('[data-a=play]');
    player.onChange = () => { $cap.textContent = player.beats[player.index]?.text || ''; $play.textContent = player.playing ? '멈춤' : '재생'; };
    await player.load(mod.default); player.onChange();
    el.querySelector('[data-a=play]').onclick = () => player.toggle();
    el.querySelector('[data-a=prev]').onclick = () => player.prev();
    el.querySelector('[data-a=next]').onclick = () => player.next();
    if (autoplay && !REDUCED) player.play();
    const off = () => { if (!el.isConnected) { player.stop(); stage.dispose(); removeEventListener('hashchange', off); } };
    addEventListener('hashchange', () => setTimeout(off));
  } catch (e) {
    el.querySelector('.cap').textContent = '이 기기에서는 3D를 보여 줄 수 없어요. 가상 실험실로 해 봐요.';
  }
}

// ── 라우터 ──
async function route() {
  const [u = 's41-u01', a, b] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const load = UNITS[u]; if (!load) { $app.innerHTML = '<main class="wrap"><p>단원을 찾을 수 없어요.</p></main>'; return; }
  const mod = await load(); const L = mod.lesson, items = mod.items; FIG = mod.figures || {};
  if (a === 'kit') return pageKit(u, L);
  if (a === 'report') return pageReport(u, L);
  if (a === 'print') return pageBook(u, L, items, b || 'student');
  const step = Math.min(5, Math.max(1, +a || (store.get(u).step ?? 0) + 1));
  if (!a) { location.replace(`#/${u}/${step}`); return; }
  [stepEngage, (u2, L2) => stepExplore(u2, L2, b), stepExplain, stepElaborate, stepEvaluate][step - 1](u, L, items);
}
addEventListener('hashchange', route);
route();
