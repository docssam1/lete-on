// Daily Test — 스스로 공부하기의 마지막 장면(MSG 초·과·심 「Daily Test 01–09 · 채점과 첨삭」을 참고해 이 사이트에 맞게 다시 만듦).
//  · 왼쪽: 문항을 하나씩 풀고(이전·다음), 문항마다 「말로 답하기」(받아쓴 초안 → 고쳐서 넣기)와 「스스로 체크」(점수와 별개).
//    답안 사진은 이 기기(IndexedDB)에만 보관 — 선생님께 자동으로 보내지 않는다.
//  · 「열 문항 채점하기」 → 오른쪽에 점수 링 · ○✕ · 검토 중(점수 제외) · 오개념 진단(첫 채점 기준) · 문항별 내 답/정답/근거.
//    틀린 문항은 정답을 먼저 보여 주지 않고 독쌤이 되묻는다(「생각해 봤어요 · 해설 보기」를 눌러야 열림).
//  · 기록: 문항마다 처음 채점한 답만 진단 기록(progress.js)에 남긴다. 규칙으로 못 가린 쓰기 답은 「선생님 확인」(check.js)에 모인다.
//  · 아무것도 서버로 보내지 않는다(채점 계약 승인 전 — GRADING-CONTRACT-DRAFT.md).
import { gradeDaily, summarize, diagnoseDaily, vocabOf, countWord } from './daily-grade.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CIRC = ['①', '②', '③', '④', '⑤'];
const KEY = 'sciLab.daily', DECK = 'sciLab.deck';
const loadAll = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveUnit = (u, v) => { try { const a = loadAll(); a[u] = v; localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* 저장 불가 기기 */ } };
const deckAll = () => { try { return JSON.parse(localStorage.getItem(DECK)) || {}; } catch { return {}; } };
const deckPut = (k, v) => { try { const a = deckAll(); if (v == null) delete a[k]; else a[k] = v; localStorage.setItem(DECK, JSON.stringify(a)); } catch { /* */ } };
const pad = (n) => String(n).padStart(2, '0');
const mic = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';

// ── 답안 사진: 이 기기에만(IndexedDB) ──
const PDB = 'sciLab-daily-photos';
function photoDb() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('no idb'));
  return new Promise((ok, no) => { const r = indexedDB.open(PDB, 1); r.onupgradeneeded = () => r.result.createObjectStore('p'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
}
async function photoOp(op, key, val) {
  const db = await photoDb();
  return new Promise((ok, no) => { const tx = db.transaction('p', op === 'get' ? 'readonly' : 'readwrite'), st = tx.objectStore('p');
    const r = op === 'get' ? st.get(key) : op === 'del' ? st.delete(key) : st.put(val, key); tx.oncomplete = () => ok(r.result); tx.onerror = () => no(tx.error); });
}

// 문항 → 이 문항을 풀 칸
function fieldsHtml(it, v, misc) {
  const ac = it.answerContract;
  if (ac.type === 'single-choice' || ac.type === 'multi-choice') {
    const sel = [].concat(v ?? []).map(String);
    return `${ac.type === 'multi-choice' ? `<p class="dt-hint">${ac.answers.length}개를 골라요.</p>` : ''}<div class="dt-choices" role="${ac.type === 'single-choice' ? 'radiogroup' : 'group'}">${it.choices.map((c, i) => `<button type="button" class="dt-choice" data-i="${i}" aria-pressed="${sel.includes(String(i))}"><i>${CIRC[i]}</i><span>${esc(c)}</span></button>`).join('')}</div>`;
  }
  if (ac.type === 'short-text') return `<input class="dt-in" data-f="text" type="text" autocomplete="off" aria-label="내 답" placeholder="답을 써요" value="${esc(v ?? '')}">`;
  if (ac.type === 'written-explanation') return `<textarea class="dt-in" data-f="text" rows="4" aria-label="내 답" placeholder="까닭까지 써요">${esc(v ?? '')}</textarea>`;
  if (ac.type === 'table-fill') {
    return `<table class="dt-tbl"><thead><tr><th>${esc(ac.rowHead || '')}</th>${ac.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${ac.rows.map((r, ri) => `<tr><th>${esc(r.label)}</th>${ac.columns.map((c, ci) => `<td><select data-r="${ri}" data-c="${ci}" aria-label="${esc(r.label)} ${esc(c)}"><option value="">고르기</option>${ac.options[c].map((o) => `<option${v?.[ri]?.[ci] === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  return '';
}
// 빈칸 문항은 문장 속 빈칸 자리에 바로 고르는 칸(보기가 있으면 고르기, 없으면 쓰기)
function promptHtml(it, v, misc) {
  const ac = it.answerContract;
  if (ac.type !== 'cloze') return esc(it.prompt);
  const C = misc?.cloze?.[it.id]; let k = 0;
  return esc(it.prompt).replace(/\( [①②③④⑤] \)/g, () => {
    const i = k++, cur = v?.[i] ?? '';
    if (C?.options?.[i]) return `<select class="dt-blank" data-k="${i}" aria-label="빈칸 ${i + 1}"><option value="">${CIRC[i]} 고르기</option>${[...C.options[i]].sort().map((o) => `<option${cur === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    return `<input class="dt-blank" data-k="${i}" type="text" size="6" aria-label="빈칸 ${i + 1}" placeholder="${CIRC[i]}" value="${esc(cur)}">`;
  });
}
const givensHtml = (it) => it.givens ? Object.entries(it.givens).map(([k, v]) => `<p class="dt-given">${/^(설명|내용|text|문항|자료|글|지문)$/.test(k) ? '' : `<b>${esc(k === '보기' ? '〈보기〉' : k)}</b> `}${esc(Array.isArray(v) ? v.join(' / ') : typeof v === 'object' ? JSON.stringify(v) : v)}</p>`).join('') : '';

function formatAnswer(it, v) {
  const ac = it.answerContract;
  if (v == null || (Array.isArray(v) ? !v.flat().some((x) => String(x ?? '').trim()) : !String(v).trim())) return '—';
  if (ac.type === 'single-choice') return `${CIRC[+v]} ${it.choices[+v]}`;
  if (ac.type === 'multi-choice') return [].concat(v).map((i) => `${CIRC[+i]} ${it.choices[+i]}`).join(' · ');
  if (ac.type === 'cloze') return [].concat(v).map((x, k) => `${CIRC[k]} ${String(x ?? '').trim() || '—'}`).join(' · ');
  if (ac.type === 'table-fill') return ac.rows.map((r, ri) => `${r.label} → ${v?.[ri]?.join(', ') || '—'}`).join(' · ');
  return String(v).trim();
}
function formatKey(it) {
  const ac = it.answerContract;
  if (ac.type === 'single-choice') return `${CIRC[ac.answer]} ${it.choices[ac.answer]}`;
  if (ac.type === 'multi-choice') return ac.answers.map((i) => `${CIRC[i]} ${it.choices[i]}`).join(' · ');
  if (ac.type === 'cloze') return ac.blanks.map((b, k) => `${CIRC[k]} ${b.answer}`).join(' · ');
  if (ac.type === 'table-fill') return ac.rows.map((r) => `${r.label} → ${r.answer.join(', ')}`).join(' · ');
  if (ac.type === 'written-explanation') return ac.sample;
  return ac.answer;
}

function ring(correct, confirmed) {
  const r = 40, c = 2 * Math.PI * r, share = confirmed ? correct / confirmed : 0;
  return `<svg class="dt-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${r}" class="dt-ring-bg"/><circle cx="50" cy="50" r="${r}" class="dt-ring-fg" stroke-dasharray="${(c * share).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`;
}
const STAMP = { correct: '<span class="dt-stamp ok" aria-label="맞음">○</span>', wrong: '<span class="dt-stamp no" aria-label="틀림">✕</span>', review: '<span class="dt-badge review">검토 필요</span>', blank: '<span class="dt-badge blank">안 풀었어요</span>' };
const SELF = { sure: '○ 자신 있었어요', unsure: '△ 헷갈렸어요' };
const STEPNAME = ['', '궁금', '실험', '개념', '확장', '점검'];

// ctx: { $app, u, title, ch, list, pool, misc, judge, record, remedyItems, itemHtml, wireItem, say, back }
export function mountDaily(ctx) {
  const { $app, u, list, misc } = ctx, N = list.length, vocab = vocabOf(ctx.pool, misc);
  const S = { answers: {}, self: {}, first: {}, graded: null, cur: 0, zoom: 1, ...(loadAll()[u] || {}) };
  const save = () => saveUnit(u, S);
  let photoUrl = null, recog = null;

  $app.innerHTML = `<header class="top"><div class="wrap"><a class="back" href="${ctx.back}">‹ 처음으로</a><h1>${esc(ctx.title)}</h1>
</div></header>
    <main class="dt-wrap">
      <section class="dt-left" style="--dt-zoom:${S.zoom}">
        <div class="dt-lhead"><span class="dt-chip">스스로 공부하기</span><h2>Daily Test ${pad(1)}–${pad(N)}</h2>
          <div class="dt-zoom" role="group" aria-label="글자 크기"><button type="button" data-z="-1">작게 −</button><output>${Math.round(S.zoom * 100)}%</output><button type="button" data-z="1">크게 +</button></div>
          <span class="dt-src">교재 ${esc(ctx.ch.no)}장 확인 문제 · 형성평가</span></div>
        <div class="dt-q" aria-live="polite"></div>
        <button type="button" class="dt-grade">${countWord(N)} 문항 채점하기</button>
        <div class="dt-photo"><p>답안을 찍거나 사진을 골라 이 쪽에 붙여 두세요.</p><div class="dt-photo-box"></div>
          <label class="btn dt-photo-btn">📷 사진 찍어 첨부<input type="file" accept="image/*" capture="environment" hidden></label>
          <small>사진은 이 기기에만 보관돼요. 선생님께 자동 전송되지 않아요.</small></div>
        <nav class="dt-nav" aria-label="문항 이동"><button type="button" class="btn" data-go="-1">이전 문항</button><b class="dt-pos"></b><button type="button" class="btn" data-go="1">다음 문항</button></nav>
        <ol class="dt-dots" aria-label="문항 바로 가기">${list.map((it, i) => `<li><button type="button" data-to="${i}" aria-label="${i + 1}번">${pad(i + 1)}</button></li>`).join('')}</ol>
      </section>
      <section class="dt-right" aria-live="polite"></section>
    </main>`;
  const $L = $app.querySelector('.dt-left'), $q = $app.querySelector('.dt-q'), $R = $app.querySelector('.dt-right');

  const answered = (it) => { const v = S.answers[it.id]; return v != null && (Array.isArray(v) ? v.flat().some((x) => String(x ?? '').trim()) : String(v).trim() !== ''); };
  const paintDots = () => $app.querySelectorAll('.dt-dots button').forEach((b, i) => { const it = list[i], g = S.graded?.[it.id]; b.dataset.st = g || (answered(it) ? 'done' : ''); b.setAttribute('aria-current', String(i === S.cur)); });

  function drawQ() {
    const it = list[S.cur], ac = it.answerContract, v = S.answers[it.id], speakable = ['single-choice', 'short-text', 'written-explanation'].includes(ac.type);
    $q.innerHTML = `<article class="dt-qcard" data-type="${ac.type}"><header><span class="dt-num">${pad(S.cur + 1)}</span><p>${promptHtml(it, v, misc)}</p></header>${givensHtml(it)}${fieldsHtml(it, v, misc)}
      <div class="dt-tools">${speakable ? `<button type="button" class="dt-tool dt-speak" aria-expanded="false">${mic}<span>말로 답하기</span></button>` : ''}
        <div class="dt-self" role="group" aria-label="스스로 체크 · 점수와 별개"><span>스스로 체크</span><button type="button" data-self="sure" aria-pressed="${S.self[it.id] === 'sure'}">○ 자신 있어요</button><button type="button" data-self="unsure" aria-pressed="${S.self[it.id] === 'unsure'}">△ 헷갈려요</button></div></div>
      ${speakable ? `<section class="dt-drawer" hidden><div class="dt-row-tools"><button type="button" class="btn dt-mic">${mic}<span>마이크로 말하기</span></button><p class="dt-msg" role="status"></p></div>
        <label>받아쓴 초안을 읽고 고쳐요<textarea class="dt-draft" rows="2" placeholder="마이크로 말하거나 여기에 답을 써 보세요"></textarea></label>
        <button type="button" class="btn primary dt-apply">고친 답을 문제에 넣기</button></section>` : ''}</article>`;
    $app.querySelector('.dt-pos').textContent = `${S.cur + 1} / ${N}`;
    $app.querySelector('[data-go="-1"]').disabled = S.cur === 0; $app.querySelector('[data-go="1"]').disabled = S.cur === N - 1;
    const set = (val) => { S.answers[it.id] = val; save(); paintDots(); };
    $q.querySelectorAll('.dt-choice').forEach((b) => b.addEventListener('click', () => {
      if (ac.type === 'single-choice') { set(+b.dataset.i); $q.querySelectorAll('.dt-choice').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); return; }
      const cur = new Set([].concat(S.answers[it.id] ?? []).map(Number)), i = +b.dataset.i; cur.has(i) ? cur.delete(i) : cur.add(i); b.setAttribute('aria-pressed', String(cur.has(i))); set([...cur].sort());
    }));
    $q.querySelectorAll('[data-f=text]').forEach((el) => el.addEventListener('input', () => set(el.value)));
    $q.querySelectorAll('.dt-blank').forEach((el) => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { const a = [...(S.answers[it.id] || [])]; a[+el.dataset.k] = el.value; set(a); }));
    $q.querySelectorAll('.dt-tbl select').forEach((el) => el.addEventListener('change', () => { const a = (S.answers[it.id] || ac.rows.map(() => [])).map((r) => [...r]); a[+el.dataset.r][+el.dataset.c] = el.value; set(a); }));
    $q.querySelectorAll('[data-self]').forEach((b) => b.addEventListener('click', () => { S.self[it.id] = S.self[it.id] === b.dataset.self ? undefined : b.dataset.self; save(); $q.querySelectorAll('[data-self]').forEach((x) => x.setAttribute('aria-pressed', String(S.self[it.id] === x.dataset.self))); }));
    // 말로 답하기: 받아쓴 초안 → 아이가 고친다 → 「넣기」. 고르기 문항은 「2번」·「②」·보기 글로 고른다.
    const drawer = $q.querySelector('.dt-drawer');
    if (drawer) {
      const tog = $q.querySelector('.dt-speak'), draft = drawer.querySelector('.dt-draft'), msg = drawer.querySelector('.dt-msg');
      tog.addEventListener('click', () => { const open = drawer.hidden; drawer.hidden = !open; tog.setAttribute('aria-expanded', String(open)); if (open) draft.focus({ preventScroll: true }); });
      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const micBtn = drawer.querySelector('.dt-mic');
      if (!Ctor) { micBtn.disabled = true; msg.textContent = '이 기기에서는 받아쓰기를 쓸 수 없어요. 아래 칸에 직접 써요.'; }
      else micBtn.addEventListener('click', () => {
        try { recog?.abort(); } catch { /* */ }
        recog = new Ctor(); recog.lang = 'ko-KR'; recog.interimResults = true; msg.textContent = '듣고 있어요… 말을 마치면 잠시 기다려요.';
        recog.onresult = (e) => { draft.value = [...e.results].map((r) => r[0].transcript).join(' '); };
        recog.onerror = () => { msg.textContent = '잘 듣지 못했어요. 다시 누르거나 직접 써요.'; };
        recog.onend = () => { if (draft.value.trim()) msg.textContent = '받아쓴 초안을 읽고, 틀린 곳을 고친 뒤 넣어요.'; };
        recog.start();
      });
      drawer.querySelector('.dt-apply').addEventListener('click', () => {
        const t = draft.value.trim(); if (!t) { msg.textContent = '먼저 말하거나 써요.'; return; }
        if (ac.type === 'single-choice') {
          const m = t.match(/^\s*(?:([1-5])\s*번?|([①②③④⑤]))\s*$/), nt = t.replace(/\s/g, '');
          const i = m ? (m[1] ? +m[1] - 1 : CIRC.indexOf(m[2])) : it.choices.findIndex((c) => c.replace(/\s/g, '') === nt);
          if (i < 0 || i >= it.choices.length) { msg.textContent = '어느 보기인지 모르겠어요. 「2번」처럼 말하거나 보기를 눌러요.'; return; }
          set(i); drawQ(); return;
        }
        set(t); drawQ();
      });
    }
    paintDots();
  }
  $app.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { S.cur = Math.max(0, Math.min(N - 1, S.cur + +b.dataset.go)); save(); drawQ(); }));
  $app.querySelectorAll('[data-to]').forEach((b) => b.addEventListener('click', () => { S.cur = +b.dataset.to; save(); drawQ(); }));
  $app.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => { S.zoom = Math.round(Math.max(0.85, Math.min(1.45, S.zoom + 0.1 * +b.dataset.z)) * 100) / 100; save(); $L.style.setProperty('--dt-zoom', S.zoom); $app.querySelector('.dt-zoom output').textContent = `${Math.round(S.zoom * 100)}%`; }));

  // 사진(이 기기에만)
  const $pbox = $app.querySelector('.dt-photo-box'), pkey = `${u}`;
  const showPhoto = (blob) => { if (photoUrl) URL.revokeObjectURL(photoUrl); photoUrl = blob ? URL.createObjectURL(blob) : null;
    $pbox.innerHTML = photoUrl ? `<figure><img src="${photoUrl}" alt="붙여 둔 답안 사진"><button type="button" class="btn" data-del>사진 빼기</button></figure>` : '';
    $pbox.querySelector('[data-del]')?.addEventListener('click', () => { photoOp('del', pkey).catch(() => {}); showPhoto(null); }); };
  photoOp('get', pkey).then((b) => b && showPhoto(b)).catch(() => {});
  $app.querySelector('.dt-photo input').addEventListener('change', (e) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 12 * 1024 * 1024) { alert('12MB보다 작은 사진을 골라요.'); return; } photoOp('put', pkey, f).catch(() => {}); showPhoto(f); });

  // ── 채점 ──
  function grade() {
    const rows = list.map((it) => { const g = gradeDaily(it, S.answers[it.id], { misc, judge: ctx.judge, vocab }); return { id: it.id, it, ...g }; });
    S.graded = {}; S.at = Date.now();
    for (const r of rows) {
      S.graded[r.id] = r.status;
      // 진단 기록은 문항마다 처음 채점한 답만(맞음·틀림만 — 검토 필요·빈칸은 남기지 않는다)
      if ((r.status === 'correct' || r.status === 'wrong') && !S.first[r.id]) {
        const e = ctx.record(r.it, 'daily', r.status === 'correct', r.detail || {});
        S.first[r.id] = { status: r.status, m: e?.m || [] };
      }
      r.m = r.status === 'wrong' ? (S.first[r.id]?.m?.length ? S.first[r.id].m : ctx.classify(r.it, r.detail || {})) : [];
      // 규칙으로 못 가린 쓰기 답 → 선생님 확인(check.js)
      if (r.status === 'review' && ['short-text', 'written-explanation', 'cloze'].includes(r.it.answerContract.type)) deckPut(`${u}:grade:daily-${r.id}`, { boxes: [{ k: 'daily', st: 'review', text: formatAnswer(r.it, S.answers[r.id]) }], tries: 1, at: S.at, item: r.id });
    }
    save(); paintDots(); report(rows);
  }
  $app.querySelector('.dt-grade').addEventListener('click', () => {
    const left = list.filter((it) => !answered(it)).length;
    if (left && !confirm(`아직 안 푼 문항이 ${left}개 있어요. 그래도 채점할까요?`)) return;
    grade(); $R.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function card(r) {
    const it = r.it, mine = `<div class="dt-row"><span>내 답</span><b>${esc(formatAnswer(it, S.answers[it.id]))}</b></div>`, key = `<div class="dt-row key"><span>정답</span><b>${esc(formatKey(it))}</b></div>`;
    const self = S.self[it.id] ? `<span class="dt-self-tag" title="스스로 체크 · 점수와 별개">${SELF[S.self[it.id]]}</span>` : '';
    const teacherSaid = deckAll()[`${u}:teacher:daily-${it.id}:daily`];
    let body = '';
    if (r.status === 'correct') body = `${mine}${key}<p class="dt-why">${esc(it.explanation)}</p>`;
    else if (r.status === 'wrong') {
      const M = r.m?.map((m) => misc?.misconceptions?.[m]).filter(Boolean)[0], m = r.m?.[0], step = misc?.remedy?.[m]?.step || 3;
      const ask = r.judged?.wrong?.say || (M ? `혹시 이런 생각을 했나요? 「${M.label}」 문제를 다시 읽고, 그 답을 고른 까닭을 떠올려 봐요.` : '어느 부분에서 헷갈렸는지 개념 정리를 떠올려 볼까요?');
      body = `${mine}<div class="dt-coach"><i class="dt-face" aria-hidden="true"></i><div><span>독쌤 첨삭${M ? ` · ${esc(M.label)}` : ''}</span><p>${esc(ask)}</p></div></div>
        <details class="dt-reveal"><summary>생각해 봤어요 · 해설 보기</summary>${key}<p class="dt-why">${esc(it.explanation)}</p>${M ? `<p class="dt-fix"><span>바로잡기</span>${M.fix}</p>` : ''}</details>
        <div class="dt-actions"><a class="dt-link" href="#/${u}/${step}">관련 화면 다시 보기 · ${STEPNAME[step]}</a></div>`;
    } else if (r.status === 'review') {
      const J = r.judged, met = J?.met || [], miss = (J?.missing || []).map((x) => x.t);
      body = `${mine}${met.length || miss.length ? `<ul class="dt-need">${met.map((t) => `<li class="ok">✓ ${esc(t)}</li>`).join('')}${miss.map((t) => `<li>□ ${esc(t)}</li>`).join('')}</ul>` : ''}
        <p class="dt-note">${teacherSaid?.v ? `선생님 확인: <b>${teacherSaid.v === 'ok' ? '맞음' : '다시 쓰기'}</b>${teacherSaid.note ? ` — ${esc(teacherSaid.note)}` : ''}` : '쓴 답을 자동으로 판단하지 않았어요. 점수에서 빼고 선생님과 함께 확인해요.'}</p>
        <details class="dt-reveal"><summary>예시 답 보기</summary>${key}</details>`;
    } else body = `<p class="dt-note">아직 풀지 않았어요.</p><div class="dt-actions"><button type="button" class="dt-link soft" data-goto="${list.indexOf(it)}">문제로 가기</button></div>`;
    return `<article class="dt-card ${r.status}"><header><span class="dt-num">${pad(list.indexOf(it) + 1)}</span><p>${esc(it.prompt.replace(/\( [①②③④⑤] \)/g, '(  )'))}</p>${STAMP[r.status] || ''}</header>${self}${body}</article>`;
  }

  function report(rows) {
    const s = summarize(rows), firstRows = list.map((it) => ({ id: it.id, status: S.first[it.id]?.status, m: S.first[it.id]?.m || [] }));
    const dx = diagnoseDaily(firstRows), perfect = s.confirmed > 0 && s.wrong === 0;
    const sureWrong = rows.filter((r) => r.status === 'wrong' && S.self[r.id] === 'sure').length, unsureRight = rows.filter((r) => r.status === 'correct' && S.self[r.id] === 'unsure').length;
    const head = !s.confirmed ? '채점할 수 있는 문항이 아직 없어요.' : perfect ? '확인된 문제를 모두 맞혔어요!' : s.correct >= s.wrong ? '잘 해냈어요. 틀린 문제만 다시 살펴봐요.' : '괜찮아요. 하나씩 다시 생각해 봐요.';
    const time = new Date(S.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const name = (m) => misc?.misconceptions?.[m]?.label || m;
    const hot = dx.filter((d) => d.status === 'confirmed');
    $R.innerHTML = `<div class="dt-report">
      <p class="dt-kick">SCIENCE LAB · 교재 연계 활동</p><h2 class="dt-title">Daily Test · 채점과 첨삭</h2>
      <section class="dt-hero"><div class="dt-score">${ring(s.correct, s.confirmed)}<div><b>${s.correct}</b><span>/ ${s.confirmed}</span></div></div>
        <div class="dt-hero-copy"><span class="dt-eyebrow">${esc(ctx.ch.title)} · 채점 결과</span><h3>${head}</h3>
          <div class="dt-meta"><span class="dt-pill ok">○ ${s.correct}</span><span class="dt-pill no">✕ ${s.wrong}</span>${s.review ? `<span class="dt-pill review">${s.review}문항 검토 중 · 점수 제외</span>` : ''}${s.blank ? `<span class="dt-pill blank">안 푼 문항 ${s.blank}</span>` : ''}</div>
          <small>확인된 정답 ${s.confirmed}문항 기준 · ${esc(time)} 채점</small></div></section>
      <section class="dt-diag"><div><span class="dt-eyebrow">오개념 진단 · 첫 채점 기준</span><h4>${hot.length ? '확정된 오개념이 있어요' : dx.length ? '살펴볼 헷갈림이 있어요' : '헷갈린 개념이 보이지 않아요'}</h4>
        ${dx.length ? `<ul class="dx-list">${dx.map((d) => `<li class="dx-row ${d.status}"><span class="dx-chip ${d.status}">${d.status === 'confirmed' ? '확정' : '의심'}</span><div><b>${esc(name(d.m))}</b><small>${d.items.map((id) => `${pad(list.findIndex((x) => x.id === id) + 1)}번 ✕`).join(' · ')}</small></div></li>`).join('')}</ul>` : ''}
        <p class="dt-meta-note">한 문항 = 의심 · 서로 다른 두 문항 = 확정. 진단은 문항마다 처음 채점한 답으로만 해요.${sureWrong || unsureRight ? ` 스스로 체크와 비교: ${[sureWrong && `자신 있었는데 틀린 문항 ${sureWrong}개`, unsureRight && `헷갈렸지만 맞힌 문항 ${unsureRight}개`].filter(Boolean).join(' · ')}` : ''}</p></div>
        ${dx.length ? `<div class="dt-recommend${hot.length ? ' hot' : ''}"><span>처방 문제</span><b>${esc(name((hot[0] || dx[0]).m))}</b><small>${hot.length ? '두 문제 이상에서 같은 헷갈림이 보였어요.' : '비슷한 문제로 한 번 더 확인해 봐요.'}</small><button type="button" class="btn primary" data-rx>처방 문제 풀기</button></div>` : ''}</section>
      <div class="dt-rx" hidden></div>
      <section class="dt-items">${rows.map(card).join('')}</section>
      <footer class="dt-foot"><p>스스로 체크(○ 자신 있어요 · △ 헷갈려요)는 채점·진단과 따로 두고 점수에 넣지 않아요. 답안 사진과 쓴 답은 이 기기에만 있어요.</p>
        <button type="button" class="btn" data-again>문제로 돌아가 다시 풀기</button></footer></div>`;
    $R.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => { S.cur = +b.dataset.goto; save(); drawQ(); $L.scrollIntoView({ behavior: 'smooth' }); }));
    $R.querySelector('[data-again]').addEventListener('click', () => { S.cur = Math.max(0, rows.findIndex((r) => r.status !== 'correct')); save(); drawQ(); $L.scrollIntoView({ behavior: 'smooth' }); });
    $R.querySelector('[data-rx]')?.addEventListener('click', () => {
      const box = $R.querySelector('.dt-rx'), ids = new Set(list.map((x) => x.id));
      const groups = dx.slice(0, 2).map((d) => ({ d, its: ctx.remedyItems(d.m, 2).filter((x) => !ids.has(x.id)) })).filter((g) => g.its.length);
      box.hidden = false;
      box.innerHTML = groups.length ? `<h3 class="dt-rx-h">처방 문제 · 비슷한 문제로 다시 확인</h3>${groups.map(({ d, its }) => { const M = misc.misconceptions[d.m];
        return `<div class="card drill"><p class="mis-tag">${esc(M.label)}</p><p class="fix">${M.fix}</p></div>${its.map((x) => ctx.itemHtml(x)).join('')}`; }).join('')}` : '<p class="dt-note">지금 풀 처방 문제가 없어요. 관련 화면을 다시 보고 와요.</p>';
      const I = Object.fromEntries(groups.flatMap((g) => g.its).map((x) => [x.id, x]));
      box.querySelectorAll('.item').forEach((c) => ctx.wireItem(c, I[c.dataset.id], null, { u, stage: 'remedy' }));
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ctx.say([{ mood: perfect ? 'praise' : s.wrong ? 'encourage' : 'talk', text: perfect ? `확인된 ${countWord(s.confirmed)} 문항을 모두 맞혔어요! 정말 잘했어요.${s.review ? ` 검토 중인 ${countWord(s.review)} 문항은 선생님과 확인해요.` : ''}` : s.wrong ? '틀린 문제는 독쌤 질문을 먼저 읽고, 생각한 뒤에 해설을 열어 봐요.' : '쓴 답은 선생님과 함께 확인해요.' }]);
  }
  function intro() {
    $R.innerHTML = `<div class="dt-report"><p class="dt-kick">SCIENCE LAB · 교재 연계 활동</p><h2 class="dt-title">Daily Test · 채점과 첨삭</h2>
      <section class="dt-hero slim"><div class="dt-hero-copy"><span class="dt-eyebrow">이렇게 풀어요</span><h3>${countWord(N)} 문항을 다 풀고 한꺼번에 채점해요</h3>
        <ol class="dt-howto"><li>왼쪽에서 01번부터 차례로 풀어요. 말로 답해도 돼요.</li><li>문항마다 스스로 체크(○ 자신 있어요 · △ 헷갈려요)를 눌러 둬요. 점수와는 따로예요.</li><li>노란 「채점하기」를 누르면 여기에 결과와 첨삭이 나와요.</li></ol>
        <small>쓰기 답은 기기 안의 판정표로 먼저 보고, 가리지 못한 답은 점수에서 빼고 선생님과 확인해요.</small></div></section></div>`;
  }

  drawQ();
  if (S.graded) grade(); else intro();
  ctx.say([{ mood: 'talk', text: S.graded ? '지난번 채점 결과예요. 고쳐서 다시 채점해도 돼요.' : `오늘 배운 것을 ${countWord(N)} 문항으로 확인해 봐요. 다 풀고 채점하기를 눌러요.` }]);
  return () => { try { recog?.abort(); } catch { /* */ } if (photoUrl) URL.revokeObjectURL(photoUrl); };
}

// 선생님 정답표(인쇄용): 문항 · 정답 · 해설 · 연결된 오개념
export function teacherKeyHtml({ u, ch, list, misc }) {
  return `<header class="top no-print"><div class="wrap"><a class="back" href="#/${u}/daily">‹ Daily Test</a><h1>Daily Test 정답표</h1><button type="button" class="icon-btn" onclick="print()">인쇄</button></div></header>
  <main class="wrap dt-key"><h2>${esc(ch.no)} · ${esc(ch.title)} — Daily Test ${pad(1)}–${pad(list.length)} 정답표</h2>
  <p class="lead">쓰기 문항은 예시 답이에요. 기기 판정에서 「검토 필요」로 남은 답은 <a href="#/${u}/check">선생님 확인</a>에 모여요.</p>
  <ol class="dt-key-list">${list.map((it, i) => { const ms = new Set([...Object.values(misc?.distractors?.[it.id] || {}), misc?.typed?.[it.id]?.any, misc?.cells?.[it.id], ...[].concat(misc?.cloze?.[it.id]?.wrong || [])].filter(Boolean));
    return `<li><p><span class="dt-num">${pad(i + 1)}</span>${esc(it.prompt)}</p><p class="dt-row key"><span>정답</span><b>${esc(formatKey(it))}</b></p><p class="dt-why">${esc(it.explanation)}</p>${ms.size ? `<p class="dt-mis">오답이면 살펴볼 오개념: ${[...ms].map((m) => esc(misc.misconceptions[m]?.label || m)).join(' · ')}</p>` : ''}</li>`; }).join('')}</ol></main>`;
}
