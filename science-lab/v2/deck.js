// GFIELD 실험 과학 영재 — 화면 수업 자료(교안). 교재와 같은 chapter 데이터를 16:9 슬라이드로 보여 준다.
//  teach(가르치기·강사용): 클릭/→/스페이스로 빈칸 답이 차례로 열리고, N으로 강사 발문 노트, F로 전체 화면.
//  self (스스로 공부하기·학생용): 내 생각을 쓰고 '예시 답 보기', 확인 문제는 눌러서 바로 채점.
import { judgeText, judgeShort } from './judge.js';
import { mountMagnetBattle } from './magnet-battle.js';
import { mountLabBattle } from './lab-battle.js';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NUM = ['①', '②', '③', '④', '⑤', '⑥'];
const KEY = 'sciLab.deck';
const memo = { all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
  get(k) { return this.all()[k] ?? ''; }, set(k, v) { try { const a = this.all(); a[k] = v; localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* 저장 불가 */ } } };
let notesOn = true;
// 단원 판정표 — 없으면 null(그 단원의 쓰기 답은 선생님 확인으로)
const TABLES = new Map();
const judgeTable = (u) => { if (!TABLES.has(u)) TABLES.set(u, import(`../data/units/${u}.judge.js`).then((m) => m.judge).catch(() => null)); return TABLES.get(u); };
const MIC = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export function buildSlides(ch, art, plan, similar, mode, ix = null, media = null) {
  const teach = mode === 'teach', S = [];
  let n = 0;
  // 답 자리: 가르치기는 클릭으로 열리는 답, 스스로는 쓰기 칸 + 예시 답 보기
  const ans = (a, id) => (teach ? `<div class="dk-ans rv">${esc(a)}</div>`
    : `<div class="dk-self" data-k="${id}"><div class="dk-inrow"><textarea class="dk-in" rows="2" placeholder="내 생각을 써 보세요"></textarea>${MIC ? '<button type="button" class="dk-mic" aria-pressed="false" title="말로 쓰기">🎤</button>' : ''}</div><div class="dk-ans" hidden><b>예시 답</b> ${esc(a)}</div></div>`);
  // 생각만 하기(스스로 공부): 쓰지 않고 머릿속으로 답한 뒤 「예시 답 보기」로 확인 — 쓰기는 가설·결론·이런 경우는·도전만(원장 2026-09-29: "쓰는 활동이 너무 많다")
  // 고르기(data/book/<u>.interact.js): 보기 단추. 가르치기의 예상 고르기는 손들기 집계(+/−)
  const opts = (o, cls = '') => `<ol class="dk-choices dk-mc ${cls}">${o.map((t, j) => `<li><button type="button" data-j="${j}"><span>${NUM[j]}</span>${esc(t)}</button></li>`).join('')}</ol>`;
  const tally = (o) => `<ol class="dk-tally">${o.map((t, j) => `<li data-j="${j}"><span class="dk-tn">${NUM[j]}</span><span class="dk-tt">${esc(t)}</span><button type="button" data-t="-" aria-label="${j + 1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j + 1}번 한 명 더하기">+</button></li>`).join('')}</ol>`;
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
  // 결과 예상 고르기: 3D 미리 보기(답 앞에서 멈춤) 바로 뒤. 답은 실험 뒤 「내 예상과 결과」에서
  if (ix?.predict) add('predict', 'open', '결과 예상 고르기', `<p class="dk-q">${esc(ix.predict.q)}</p>${teach ? `${tally(ix.predict.options)}<p class="dk-sub">손을 들게 하고 보기마다 수를 세어 적어요. 답은 실험 뒤에 확인해요.</p>` : `${opts(ix.predict.options, 'predict')}<p class="dk-sub">맞고 틀린 것은 실험으로 확인해요. 내 생각에 가장 가까운 것을 골라요.</p>`}`, { say: 'predict', kind: 'predict' });

  add('goal', 'design', '탐구 목표', `<p class="dk-goal">${esc(ch.goal)}</p><div class="dk-two"><div class="dk-card"><h3>준비물</h3><p>${ch.materials.kit.map(esc).join(', ')}</p></div>
    <div class="dk-card"><h3>학생 준비물</h3><p>${ch.materials.student.map(esc).join(', ')}</p></div></div>`, { kind: 'read', layout: 'goal' });
  add('hypo', 'design', 'STEP 1 · 가설 세우기', `<p class="dk-q">${esc(ch.hypothesis.hint)}</p>${ans(ch.hypothesis.a, 'hypo')}`, { say: 'hypo', kind: 'write' });
  const d = ch.design;
  if (!teach && ix?.design) add('design', 'design', 'STEP 2 · 실험 설계하기', `<div class="dk-dpicks">${ix.design.map((x, i) => `<div class="dk-dpick" data-i="${i}"><p class="dk-dq"><b>${esc([d.change, d.same, d.measure][i]?.q || x.q)}</b> ${esc(x.q)}</p>${opts(x.options)}<p class="dk-hint" hidden></p></div>`).join('')}</div>
    <p class="dk-sub">알맞은 실험은 바꿀 조건을 하나만 정하고, 나머지는 모두 같게 해요.</p>
    <div class="dk-caution"><h3>주의하세요!</h3><ul>${ch.caution.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`, { say: 'design', kind: 'dpick', layout: 'dense' });
  else add('design', 'design', 'STEP 2 · 실험 설계하기', `<table class="dk-tbl">${[d.change, d.same, d.measure].map((r, i) => `<tr><th>${esc(r.q)}</th><td>${teach ? ans(r.a, `design${i}`) : peek(r.a)}</td></tr>`).join('')}</table>
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
  // 내 예상과 결과: 실험실에서 본 것과 1차시 예상을 대조(까닭은 2차시). 가르치기는 손들기 집계와 대조
  if (ix?.predict) add('vs', 'result', '내 예상과 결과', teach
    ? `<p class="dk-q">${esc(ix.predict.q)}</p><ol class="dk-tally done" data-answer="${ix.predict.answer}">${ix.predict.options.map((t, j) => `<li data-j="${j}"><span class="dk-tn">${NUM[j]}</span><span class="dk-tt">${esc(t)}</span><b class="dk-tc">0</b></li>`).join('')}</ol><div class="dk-ans rv"><b>실험 결과</b> ${esc(ix.predict.result)}</div>`
    : `<div class="dk-vs"><div class="dk-card"><h3>내 예상</h3><p class="dk-vmine"></p></div><div class="dk-card"><h3>실험 결과</h3><p>${esc(ix.predict.options[ix.predict.answer])}</p><p class="dk-sub">${esc(ix.predict.result)}</p></div></div><p class="dk-vsay dk-big"></p>`,
    { say: 'vs', kind: 'vs' });
  add('reveal', 'result', '3D로 확인하기', `<p class="dk-sub">내 예상과 결과가 맞는지, 아까 멈췄던 곳부터 끝까지 봐요.</p><div class="dk-3d" data-mount="scene" data-from="reveal"></div>`, { say: 'reveal', mount: 'scene', layout: 'media', kind: 'scene' });
  if (media?.deck) {
  const v=media.deck;
  add('video','result',v.title,`<figure class="dk-film"><video controls playsinline preload="none" poster="${esc(v.poster || '')}" aria-label="${esc(v.title)}"><source src="${esc(v.src)}" type="video/webm"><source src="${esc(v.mp4)}" type="video/mp4"></video><p class="dk-film-prompt">${esc(v.prompt)}</p><figcaption><a href="${esc(v.page)}" target="_blank" rel="noopener">${esc(v.credit)}</a> · <a href="${esc(v.license || v.page)}" target="_blank" rel="noopener">이용 허락</a></figcaption><p class="dk-film-error" role="status" hidden>영상을 불러오지 못했어요. 재생을 다시 누르거나 <a href="${esc(v.page)}" target="_blank" rel="noopener">원본 영상</a>을 열어 보세요.</p></figure>`,{kind:'video',layout:'media'});
  }
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
    if (ix?.recall) add('recallq', 'result', '2차시 · 지난 시간 떠올리기', `<p class="dk-q">${esc(ix.recall.q)}</p>${opts(ix.recall.options)}<p class="dk-hint" hidden></p><div class="dk-ans" hidden>${esc(ix.recall.why)}</div>`, { kind: 'recallq' });
    if (ix?.learned) { const e = S.find((x) => x.id === 'end'); if (e) { const L = ix.learned;
      e.body = `<div class="dk-cover"><h1>오늘 배운 것</h1><p class="dk-q">${esc(L.q)}</p><ol class="dk-choices dk-mc multi learned" data-key="${L.answers.join(',')}">${L.options.map((t, j) => `<li><button type="button" data-j="${j}"><span>${NUM[j]}</span>${esc(t)}</button></li>`).join('')}</ol>
        <div class="dk-act"><button type="button" class="dk-go" data-l="check" disabled>확인</button></div><p class="dk-hint" hidden></p>
        <div class="dk-lsum" hidden><ul class="dk-points big">${(ch.summary || (ch.note?.points || []).map(esc)).map((x) => `<li>${x}</li>`).join('')}</ul><p class="dk-sub">과제 · 교재 ${ch.no}장 교과 확인 문제와 영재성 기르기를 마무리해 오세요.</p></div></div>`;
      e.kind = 'learned'; } }
    add('recall', 'result', ix?.recall ? '내 가설과 실험 기록' : '2차시 · 지난 시간 떠올리기', `<p class="dk-q">지난 시간에 내가 쓴 가설과 실험 결과예요. 천천히 다시 읽어 봐요.</p><div class="dk-mine"></div>`, { kind: 'recall' });
    const ch3 = [['discuss', '토의', ch.discuss.q, ch.discuss.a], ['creative', '창의력', ch.creative.q, ch.creative.a]];
    add('challenge', 'extend', '도전 하나 고르기', `<p class="dk-q">셋 중에 하고 싶은 도전 하나를 골라요.</p><div class="dk-pick">${[...ch3.map(([id, t]) => [id, t]), ['gifted', '영재성']].map(([id, t]) => `<button type="button" class="dk-go ghost" data-pick="${id}">${t}</button>`).join('')}</div>
      ${ch3.map(([id, , q, a]) => `<div class="dk-pane" data-pane="${id}" hidden><p class="dk-q">${esc(q)}</p>${ans(a, id)}</div>`).join('')}
      <div class="dk-pane" data-pane="gifted" hidden><p class="dk-timer" role="timer" aria-live="off"><b>3:00</b> 3분 동안 되도록 많이, 서로 다른 쪽으로 써 봐요.</p><p class="dk-q"><b>${esc(g.title)}</b><br>${esc(g.lead)}</p><table class="dk-tbl">${g.rows.map((r) => `<tr><th>${esc(r)}</th><td>${ans(g.a[r], `gifted-${r}`)}</td></tr>`).join('')}</table></div>`, { say: 'challenge', kind: 'challenge' });
    const by = Object.fromEntries(S.map((x) => [x.id, x])), ids = S.map((x) => x.id), tests = ids.filter((x) => /^test\d/.test(x));
    const order = ['cover', 'intro', 'think1', 'scene', 'predict', 'goal', 'hypo', 'design', 'order', 'lab', ...ids.filter((x) => /^res\d/.test(x)), 'vs', 'break',
      'recallq', 'recall', 'reveal', 'video', 'concl', 'note', ...tests.slice(0, 2), 'plus', 'wonder', 'challenge', ...tests.slice(2), 'end'];
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

export function renderDeck($app, { u, ch, art, plan, similar, mode, idx, mount3D, mountLab, misc, onAnswer, myLab, ix = null, media = null }) {
  const teach = mode === 'teach', S = buildSlides(ch, art, plan, similar, mode, ix, media);
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
  const film=stage.querySelector('.dk-film video');
  if(film){
  const fail=()=>{stage.querySelector('.dk-film-error').hidden=false;};
  const sources=[...film.querySelectorAll('source')],failed=new Set();
  sources.forEach(source=>source.addEventListener('error',()=>{failed.add(source);if(failed.size===sources.length)fail();}));
  film.addEventListener('error',fail);
  film.addEventListener('playing',()=>{stage.querySelector('.dk-film-error').hidden=true;});
  addEventListener('hashchange',()=>{film.pause();film.removeAttribute('src');film.replaceChildren();film.load();},{once:true});
  }

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
  if (teach) stage.addEventListener('click', (e) => { if (!e.target.closest('button,canvas,video,a,input,textarea,.dk-3d,.dk-battle')) next(); });
  const onKey = (e) => {
    if (!alive()) { removeEventListener('keydown', onKey); return; }
    if (e.target.closest?.('textarea,input,select,button,video,.dk-battle')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'f' || e.key === 'F') $app.querySelector('[data-a=full]').click();
    else if (teach && (e.key === 'n' || e.key === 'N')) toggleNotes();
  };
  addEventListener('keydown', onKey);
  addEventListener('hashchange', () => { removeEventListener('keydown', onKey); try { recog?.stop(); } catch { /* */ } }, { once: true });

  if (teach) {
    import('./docssam.js').then((m) => m.dropGuide());   // 가르치기에는 독쌤이 없다
    // 예상 손들기 집계(칠판): 보기마다 +/−, 「내 예상과 결과」 장에서 같은 수를 보여 주고 답을 열 때 정답 보기를 표시
    const TK = `teach:${u}:tally`, T = (() => { const t = memo.get(TK); return Array.isArray(t) ? t : [0, 0, 0]; })();
    stage.querySelectorAll('.dk-tally li').forEach((li) => { const j = +li.dataset.j, c = li.querySelector('.dk-tc'); c.textContent = T[j] || 0;
      li.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => { T[j] = Math.max(0, (T[j] || 0) + (b.dataset.t === '+' ? 1 : -1)); c.textContent = T[j]; memo.set(TK, T); })); });
    const done = stage.querySelector('.dk-tally.done'), rv = stage.querySelector('.dk-ans.rv');
    if (done && rv) new MutationObserver(() => done.querySelector(`[data-j="${done.dataset.answer}"]`)?.classList.toggle('ok', rv.classList.contains('on'))).observe(rv, { attributes: true });
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
      else if (u === 's41-u01') {
        m.parentElement.classList.add('is-battle');
        m.outerHTML = '<div class="dk-battle dk-magnet-battle"></div>';
        mountMagnetBattle(stage.querySelector('.dk-magnet-battle'), mountLab);
      } else {
        m.parentElement.classList.add('is-battle');
        m.outerHTML = '<div class="dk-battle dk-lab-battle"></div>';
        mountLabBattle(stage.querySelector('.dk-lab-battle'), u, mountLab);
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
    if (k === 'video') {
    // No timed page advance during watching. Browser autoplay is muted; sound is the learner's choice.
    await G.say({text:'이번에는 실제 응결 연구 영상을 살펴봐요. 작은 물방울이 생기고 커지는 모습을 찾아보세요.'});
    if(!alive())return;
    film.addEventListener('play',cancelAuto);
    film.addEventListener('ended',async()=>{if(!alive())return;await G.say({text:'잘 관찰했어요. 보이지 않는 수증기가 식어 액체 물방울이 되었어요. 이제 내 실험과 비교해 볼까요?'},{mood:'praise'});if(alive())auto(3500);});
    film.muted=true;
    try{await film.play();}catch{G.status('영상의 재생 버튼을 눌러 보세요.');}
    return;
    }
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
    if (k === 'predict') return runPredict();
    if (k === 'dpick') return runDesignPick();
    if (k === 'vs') return runVs();
    if (k === 'recallq') return runRecallQ();
    if (k === 'learned') return runLearned();
    if (k === 'order') return runOrder();
    if (k === 'think') return runThink();
    if (k === 'break') { fillMine(); G.say('dk-break', { mood: 'praise' });
      stage.querySelector('[data-a2=cont]').onclick = () => next(); return; }                 // 1차시 끝: 저절로 넘기지 않는다
    if (k === 'recall') { fillMine(); G.say('dk-recall'); auto(Math.min(15000, Math.max(5000, textLen() * 55))); return; }
    if (k === 'challenge') { G.say('dk-challenge');
      stage.querySelectorAll('[data-pick]').forEach((b) => { b.onclick = () => {
        stage.querySelectorAll('[data-pane]').forEach((x) => { if (x.dataset.pane !== b.dataset.pick) x.remove(); else x.hidden = false; });
        stage.querySelector('.dk-pick').remove(); stage.querySelector('.dk-body > .dk-q').remove(); if (b.dataset.pick === 'gifted') startTimer(180); runWrite(V); }; });
      return; }
    return runWrite(V);
  }
  // ── 고르기 활동(data/book/<u>.interact.js) ─────────────────────────────
  // 한 문항 고르기: 맞으면 끝, 첫 오답엔 그 보기만 지우고 되묻기(답 감춤), 두 번째 오답엔 답을 보여 준다(확인 문제와 같은 규칙)
  function mcWire(ol, answer, hintEl, hint, onDone) {
    let tries = 0, over = false;
    const lock = () => ol.querySelectorAll('button').forEach((x) => { x.disabled = true; });
    ol.querySelectorAll('button').forEach((b) => { b.onclick = () => {
      if (over) return; const j = +b.dataset.j; tries++;
      if (j === answer) { over = true; b.classList.add('ok'); lock(); if (hintEl) hintEl.hidden = true; onDone(tries === 1); return; }
      b.classList.add('no'); b.disabled = true;
      if (tries < 2) { if (hintEl) { hintEl.hidden = false; hintEl.innerHTML = `<b>다시 골라 봐요</b>${esc(hint || '')}`; } G?.say('dk-pick-retry', { mood: 'encourage' }); return; }
      over = true; ol.querySelector(`[data-j="${answer}"]`)?.classList.add('ok'); lock();
      if (hintEl) { hintEl.hidden = false; hintEl.innerHTML = '<b>정답을 확인해요</b>초록색 보기가 알맞은 답이에요.'; }
      onDone(false);
    }; });
  }
  // 결과 예상 고르기: 맞고 틀림을 말하지 않는다 — 고른 것만 기억해 두었다가 실험 뒤에 대조
  function runPredict() {
    G.say('dk-predict');
    const ol = stage.querySelector('.dk-mc.predict'), had = memo.get(`${u}:predict`);
    const mark = (j) => ol.querySelectorAll('button').forEach((b) => b.classList.toggle('pick', +b.dataset.j === j));
    if (had !== '') mark(+had);
    ol.querySelectorAll('button').forEach((b) => { b.onclick = async () => { const j = +b.dataset.j; memo.set(`${u}:predict`, j); mark(j); cancelAuto(); await G.say('dk-predict-ok', { mood: 'praise' }); auto(1800); }; });
  }
  // 실험 설계 3칸 고르기
  function runDesignPick() {
    G.say('dk-design-pick');
    const boxes = [...stage.querySelectorAll('.dk-dpick')]; let left = boxes.length;
    boxes.forEach((bx) => { const x = ix.design[+bx.dataset.i];
      mcWire(bx.querySelector('.dk-mc'), x.answer, bx.querySelector('.dk-hint'), x.hint, async () => { if (--left) return; await G.say('dk-design-ok', { mood: 'praise' }); auto(Math.min(12000, Math.max(3000, textLen() * 25))); }); });
  }
  // 내 예상과 결과
  function runVs() {
    const P = ix.predict, had = memo.get(`${u}:predict`), mine = had === '' ? null : +had, same = mine === P.answer;
    stage.querySelector('.dk-vmine').textContent = mine == null ? '(예상을 고르지 않았어요)' : P.options[mine];
    stage.querySelector('.dk-vsay').textContent = mine == null ? '실험 결과를 한 번 더 읽어 봐요.' : same ? '내 예상이 맞았어요! 왜 그런지는 다음 시간에 알아봐요.' : '예상과 달랐어요. 과학자도 자주 그래요. 왜 그런지는 다음 시간에 알아봐요.';
    stage.querySelector('.dk-vs').classList.add(same ? 'same' : 'diff');
    G.say(mine == null ? 'dk-vs-none' : same ? 'dk-vs-same' : 'dk-vs-diff', { mood: same ? 'praise' : 'encourage' }).then(() => alive() && auto(Math.min(12000, Math.max(3500, textLen() * 45))));
  }
  // 2차시 떠올리기: 내 기록을 보여 주기 전에 한 문제
  function runRecallQ() {
    G.say('dk-recallq');
    const R = ix.recall;
    mcWire(stage.querySelector('.dk-mc'), R.answer, stage.querySelector('.dk-hint'), '지난 시간 3D 실험실에서 조건을 바꿨을 때 무엇이 달라졌는지 떠올려 봐요.', async (first) => {
      stage.querySelector('.dk-ans').hidden = false; await G.say(first ? 'dk-right' : 'dk-recallq-show', { mood: first ? 'praise' : 'encourage' }); auto(Math.min(10000, Math.max(3500, textLen() * 40))); });
  }
  // 오늘 배운 것: 맞는 말을 모두 고른 뒤 요약을 연다
  function runLearned() {
    G.say('dk-learned');
    const ol = stage.querySelector('.dk-mc.learned'), key = ol.dataset.key.split(',').map(Number), $c = stage.querySelector('[data-l=check]'), $h = stage.querySelector('.dk-hint'), picked = new Set();
    let tries = 0;
    ol.querySelectorAll('button').forEach((b) => { b.onclick = () => { const j = +b.dataset.j; picked.has(j) ? picked.delete(j) : picked.add(j); b.classList.toggle('pick', picked.has(j)); $c.disabled = !picked.size; }; });
    $c.onclick = async () => {
      tries++; const ok = picked.size === key.length && key.every((j) => picked.has(j));
      if (!ok && tries < 2) { $h.hidden = false; $h.innerHTML = `<b>조금만 더</b>맞는 말은 ${key.length}개예요. 하나씩 다시 읽어 봐요.`; G.say('dk-pick-retry', { mood: 'encourage' }); return; }
      ol.querySelectorAll('button').forEach((b) => { const j = +b.dataset.j; b.disabled = true; b.classList.remove('pick'); b.classList.toggle('ok', key.includes(j)); b.classList.toggle('no', !key.includes(j) && picked.has(j)); });
      ol.classList.add('done'); $c.hidden = true; $h.hidden = !ok ? false : true;   // 확인 뒤엔 보기를 두 줄로 줄여 요약이 들어갈 자리를 만든다 if (!ok) $h.innerHTML = '<b>정답을 확인해요</b>초록색이 맞는 말이에요.';
      stage.querySelector('.dk-lsum').hidden = false; await G.say(ok ? 'dk-learned-ok' : 'dk-end', { mood: 'praise' });
    };
  }
  // 영재성 도전: 3분 타이머 — 멈추게 하지는 않고 알려만 준다
  function startTimer(sec) {
    const el = stage.querySelector('.dk-timer b'); if (!el) return; let t = sec;
    G.say('dk-timer');
    const iv = setInterval(() => { if (!alive()) { clearInterval(iv); return; } t -= 1; el.textContent = t > 0 ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : '시간 끝!';
      if (t <= 0) { clearInterval(iv); el.parentElement.classList.add('over'); } }, 1000);
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
  function labTable() {
    const L = myLab?.(); if (!L?.rows?.length) return '';
    return `<div class="dk-card"><h3>내 3D 실험 기록</h3><table class="dk-tbl"><tr>${L.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${L.rows.map((r) => `<tr>${Object.values(r).slice(0, L.cols.length).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }
  // 쓰기: 모든 칸을 채우면 '확인' → 기기 안에서 판정(v2/judge.js + data/units/<u>.judge.js). 아이에게 "비슷한가요?"를 묻지 않는다(원장 2026-09-30).
  //  맞음 → 칭찬하고 다음 장 / 빠진 생각·오개념 → 답은 감추고 되묻기, 한 번 더 / 두 번째에도 아니면 예시 답을 보여 주고 다음으로
  //  규칙으로 가릴 수 없는 답(도전 과제·다른 말로 길게 쓴 답) → 틀렸다고 하지 않고 선생님 확인으로 모은다(필요할 때만 API)
  const J = judgeTable(u);
  function judgeBox(k, text, tries, table, itemTable) {
    if (k === 'hypo' || k === 'wonder' || k === 'concl0') return judgeText(text, table?.[`deck:${k}`], { tries });
    if (/^test\d/.test(k) && s.item) {
      const it = similar.find((x) => x.id === s.item), ac = it?.answerContract;
      if (ac?.type === 'short-text') { const r = judgeShort(text, ac.accepted?.length ? ac.accepted : [ac.answer]); return { ...r, st: r.st === 'no' ? 'miss' : r.st, short: true, missing: [] }; }
      if (ac?.type === 'written-explanation') return judgeText(text, itemTable?.[s.item], { tries });   // 문항은 제 단원 판정표에서(화산 단원은 s41-u03 문항을 빌려 쓴다)
    }
    return judgeText(text, null, { tries });   // 도전 과제 등 — 선생님 확인
  }
  const FB = {
    ok: (r, hy) => `<b>✓ ${hy ? '좋은 가설이에요! 조건과 결과를 이어 썼어요.' : '맞았어요!'}</b>`,
    part: (r) => `<b>좋아요, 조금만 더!</b> ${esc(r.missing[0]?.ask || '빠진 생각이 있어요.')}`,
    miss: (r) => r.short ? '<b>다시 생각해 봐요.</b> 문제를 다시 읽고 하나씩 살펴봐요.' : `<b>다시 써 볼까요?</b> ${esc(r.missing[0]?.ask || '핵심 낱말을 넣어 써 봐요.')}`,
    wrong: (r) => `<b>혹시 이렇게 생각했나요?</b> ${esc(r.wrong?.say || '')}`,
    review: (r) => (r.why === 'unsure' ? `<b>선생님이 한 번 더 볼게요.</b> ${esc(r.missing[0]?.ask ? '예시 답을 읽고 이 생각이 내 답에 있는지 확인해 봐요 — ' + r.missing[0].t : '예시 답도 읽어 봐요.')}` : '<b>잘 썼어요!</b> 이 답은 선생님이 확인할게요.'),
    empty: () => '먼저 써 보세요.',
  };
  function runWrite(V) {
    wirePeek();
    prepRes();
    const boxes = [...stage.querySelectorAll('.dk-self')]; if (!boxes.length) { auto(3000); return; }
    const body = stage.querySelector('.dk-body');
    body.insertAdjacentHTML('beforeend', `<div class="dk-act"><button type="button" class="dk-go" data-w="check" disabled>확인</button></div>`);
    const $chk = body.querySelector('[data-w=check]');
    const tas = boxes.map((b) => b.querySelector('textarea'));
    // 확인 문제의 쓰기(ㄴ·ㄷ 같은 한 글자 답)는 한 글자면 되고, 생각 쓰기는 두 글자 이상
    const minLen = s.id.startsWith('test') ? 1 : 2;
    const ready = () => { $chk.disabled = !tas.every((t) => t.value.trim().length >= minLen); };
    boxes.forEach((b) => {
      const key = `${u}:${b.dataset.k}`, ta = b.querySelector('textarea');
      ta.value = memo.get(key); ta.addEventListener('input', () => { memo.set(key, ta.value); ready(); b.querySelector('.dk-fb:not(.dk-tnote)')?.remove(); b.classList.remove('j-ok', 'j-part', 'j-miss', 'j-wrong', 'j-review'); });
      b.querySelector('.dk-mic')?.addEventListener('click', (e) => listen(e.currentTarget, ta, () => { memo.set(key, ta.value); ready(); }));
    });
    ready();
    // 선생님 확인(v2/check.js)에서 남긴 판정·한마디가 있으면 아이에게 보여 준다
    boxes.forEach((b) => { const t = memo.get(`${u}:teacher:${s.id}:${b.dataset.k}`); if (!t?.v) return;
      b.querySelector('.dk-inrow').insertAdjacentHTML('afterend', `<p class="dk-fb dk-tnote ${t.v}"><b>선생님</b> ${t.v === 'ok' ? '맞았어요!' : '한 번 더 고쳐 써 봐요.'}${t.note ? ` ${esc(t.note)}` : ''}</p>`); });
    G.say(cue(V, 'dk-write'));
    let tries = 0;
    const finish = async (line, mood) => { $chk.hidden = true; tas.forEach((t) => { t.readOnly = true; }); await G.say(line, mood ? { mood } : undefined); };
    $chk.onclick = async () => {
      tries++; $chk.disabled = true;
      const table = await J, itemTable = s.item ? await judgeTable(s.item.split('-').slice(0, 2).join('-')) : null;
      const rs = boxes.map((b, j) => judgeBox(b.dataset.k, tas[j].value, tries, table, itemTable));
      boxes.forEach((b, j) => {
        const r = rs[j], hy = b.dataset.k === 'hypo'; b.querySelector('.dk-fb:not(.dk-tnote)')?.remove();
        b.classList.remove('j-ok', 'j-part', 'j-miss', 'j-wrong', 'j-review'); b.classList.add(`j-${r.st}`);
        b.querySelector('.dk-inrow').insertAdjacentHTML('afterend', `<p class="dk-fb" role="status">${(FB[r.st] || FB.miss)(r, hy)}</p>`);
        if (r.st === 'ok' || r.st === 'review') b.querySelector('.dk-ans').hidden = false;   // 참고로 예시 답도 보여 준다 — 비교해서 고르라는 게 아니다
      });
      const sts = rs.map((r) => r.st), okAll = sts.every((x) => x === 'ok'), settled = sts.every((x) => x === 'ok' || x === 'review');
      memo.set(`${u}:grade:${s.id}`, { at: Date.now(), tries, item: s.item || null, boxes: boxes.map((b, j) => ({ k: b.dataset.k, st: rs[j].st, m: rs[j].wrong?.m || null, text: tas[j].value })) });
      if (s.item && tries === 1) onAnswer?.(s.item, okAll, []);
      if (okAll) { await finish('dk-judge-ok', 'praise'); auto(900); return; }
      if (settled) { await finish(rs.some((r) => r.why === 'unsure') ? 'dk-judge-show' : 'dk-judge-review'); auto(1500); return; }
      if (tries < 2) { $chk.disabled = false; cancelAuto(); G.say('dk-judge-retry', { mood: 'encourage' }); tas[sts.findIndex((x) => x !== 'ok' && x !== 'review')]?.focus(); return; }
      // 두 번째에도 아니면 예시 답을 보여 준다(더 붙잡지 않는다)
      boxes.forEach((b, j) => { if (sts[j] !== 'ok') { b.querySelector('.dk-ans').hidden = false; b.querySelector('.dk-fb:not(.dk-tnote)')?.insertAdjacentHTML('beforeend', ' <br>예시 답을 읽고 내 답에 빠진 생각을 확인해 봐요.'); } });
      await finish('dk-judge-show');   // 예시 답을 읽을 시간 — 넘기기는 아래 「다음」으로
    };
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
