// 선생님 확인 — 스스로 공부(v2/deck.js)에서 이 기기에 남은 쓰기 답을 모아 본다(원장 2026-09-30).
//  · 규칙으로 가리지 못한 답(도전 과제, 다른 말로 쓴 긴 답)은 「확인 필요」에 모인다. 선생님이 맞음/다시 쓰기와 한마디를 남기면
//    아이가 그 쓰기 칸에 다시 왔을 때 보인다.
//  · 기록은 이 기기의 localStorage('sciLab.deck')에만 있다. 서버로 보내지 않는다 — 여러 기기를 모으는 것은 채점 계약 승인 뒤(GRADING-CONTRACT-DRAFT.md).
//  · API는 여기서 부르지 않는다. 나중에 붙인다면 「확인 필요」 답만 보낸다(필요할 때만).
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KEY = 'sciLab.deck';
const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const put = (k, v) => { try { const a = all(); if (v == null) delete a[k]; else a[k] = v; localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* 저장 불가 */ } };

export const ST = { ok: ['맞음', 'ok'], part: ['일부', 'part'], miss: ['빠짐', 'miss'], wrong: ['오개념', 'wrong'], review: ['확인 필요', 'review'], empty: ['빈칸', 'miss'] };

// 이 기기의 쓰기 기록 → [{ u, slide, k, st, text, tries, at, item, teacher }]
export function records(units) {
  const a = all(), out = [];
  for (const [key, rec] of Object.entries(a)) {
    const m = /^(.+?):grade:(.+)$/.exec(key); if (!m || !rec?.boxes) continue;
    const [, u, slide] = m; if (units && !units.includes(u)) continue;
    for (const b of rec.boxes) out.push({ u, slide, k: b.k, st: b.st, m: b.m, text: b.text, tries: rec.tries, at: rec.at, item: rec.item || null, teacher: a[`${u}:teacher:${slide}:${b.k}`] || null });
  }
  return out.sort((x, y) => (y.at || 0) - (x.at || 0));
}
export const needs = (r) => r.st === 'review' && !r.teacher?.v;
export const countNeeds = (units) => records(units).filter(needs).length;

// 칸 이름(k) → 질문과 예시 답. 교과 확인 문제는 기록된 문항 id로, 옛 기록은 ch.check 순서로 찾는다.
function lookup(r, ch, similar) {
  const g = ch.gifted;
  if (r.k === 'hypo') return { q: ch.hypothesis.hint, a: ch.hypothesis.a, where: '가설 세우기' };
  if (r.k === 'wonder') return { q: ch.wonder.q, a: ch.wonder.a, where: '이런 경우는?' };
  if (/^concl\d/.test(r.k)) { const c = ch.conclusion[+r.k.slice(5)]; return { q: c?.q, a: c?.a, where: '결론 내리기' }; }
  if (r.k === 'discuss') return { q: ch.discuss.q, a: ch.discuss.a, where: '도전 · 토의' };
  if (r.k === 'creative') return { q: ch.creative.q, a: ch.creative.a, where: '도전 · 창의력' };
  if (r.k.startsWith('gifted-')) { const row = r.k.slice(7); return { q: `${g.title} — ${row}`, a: g.a?.[row], where: '도전 · 영재성' }; }
  if (/^test\d/.test(r.k)) {
    const it = similar.find((x) => x.id === r.item) || similar.find((x) => `${x.sourceRef?.of?.set}-${x.sourceRef?.of?.no}` === ch.check[+r.k.slice(4)]);
    const ac = it?.answerContract; return { q: it?.prompt, a: ac ? (ac.type === 'short-text' ? ac.answer : ac.sample) : '', where: '교과 확인 문제' };
  }
  if (r.k === 'daily') {   // Daily Test(v2/daily.js)에서 규칙으로 못 가린 답
    const it = similar.find((x) => x.id === r.item), ac = it?.answerContract;
    const a = !ac ? '' : ac.type === 'written-explanation' ? ac.sample : ac.type === 'cloze' ? ac.blanks.map((b) => b.answer).join(' · ') : ac.answer;
    return { q: it?.prompt, a, where: 'Daily Test' };
  }
  return { q: r.k, a: '', where: '' };
}

export async function renderCheck($app, { units, loadUnit, only = null }) {
  const list = only ? [only] : units;
  const data = {};
  await Promise.all(list.map(async (u) => { try { data[u] = await loadUnit(u); } catch { data[u] = null; } }));
  let tab = 'need';
  const draw = () => {
    const rs = records(list).filter((r) => data[r.u]), need = rs.filter(needs);
    const shown = tab === 'need' ? need : rs;
    const groups = list.map((u) => [u, shown.filter((r) => r.u === u)]).filter(([, g]) => g.length);
    $app.innerHTML = `<header class="top no-print"><div class="wrap"><a class="back" href="${only ? `#/${only}/start` : '#/'}">‹ ${only ? '단원으로' : '지도로'}</a><h1>선생님 확인</h1></div></header>
    <main class="wrap check">
      <p class="lead">이 기기에서 스스로 공부한 쓰기 답이에요. 기기 안에서 먼저 판정했고, 규칙으로 가리지 못한 답만 「확인 필요」에 모여요.</p>
      <p class="ck-note">답은 이 기기에만 있어요. 서버로 보내지 않아요.</p>
      <div class="ck-bar no-print" role="tablist"><button type="button" role="tab" aria-selected="${tab === 'need'}" data-tab="need">확인 필요 <b>${need.length}</b></button>
        <button type="button" role="tab" aria-selected="${tab === 'all'}" data-tab="all">전체 <b>${rs.length}</b></button>
        <button type="button" class="btn ck-print" data-act="print">인쇄</button></div>
      ${groups.length ? groups.map(([u, g]) => `<section class="ck-unit"><h2>${esc(data[u].ch.no)} · ${esc(data[u].ch.title)}</h2>${g.map((r) => card(r, data[u])).join('')}</section>`).join('')
        : `<p class="ck-empty">${tab === 'need' ? '확인할 답이 없어요. 아이들이 쓴 답은 모두 기기에서 판정됐어요.' : '아직 이 기기에 쓰기 기록이 없어요.'}</p>`}
    </main>`;
    $app.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; draw(); }));
    $app.querySelector('[data-act=print]').addEventListener('click', () => print());
    $app.querySelectorAll('.ck-card').forEach((c) => {
      const key = c.dataset.key, note = c.querySelector('.ck-say');
      const save = (v) => { put(key, v ? { v, note: note.value.trim(), at: Date.now() } : null); draw(); };
      c.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => save(b.dataset.v)));
      c.querySelector('[data-act=undo]')?.addEventListener('click', () => save(null));
    });
    scrollTo(0, 0);
  };
  const card = (r, d) => {
    const L = lookup(r, d.ch, d.similar), [label, cls] = ST[r.st] || [r.st, 'miss'], key = `${r.u}:teacher:${r.slide}:${r.k}`, t = r.teacher;
    const when = r.at ? new Date(r.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    return `<article class="ck-card" data-key="${esc(key)}">
      <p class="ck-where">${esc(L.where)}${when ? ` · ${esc(when)}` : ''}${r.tries ? ` · ${r.tries}번 확인` : ''}</p>
      <p class="ck-q">${esc(L.q)}</p>
      <blockquote class="ck-a">${esc(r.text) || '<i>빈칸</i>'}</blockquote>
      <p class="ck-meta"><span class="ck-badge ${cls}">기기 판정 · ${esc(label)}</span>${t?.v ? `<span class="ck-badge ${t.v === 'ok' ? 'ok' : 'wrong'}">선생님 · ${t.v === 'ok' ? '맞음' : '다시 쓰기'}</span>` : ''}</p>
      ${L.a ? `<details class="ck-ex"><summary>예시 답</summary><p>${esc(L.a)}</p></details>` : ''}
      <div class="ck-act no-print">${t?.v ? `<span class="ck-said">${t.note ? `한마디: ${esc(t.note)}` : ''}</span><button type="button" class="btn" data-act="undo">판정 지우기</button>`
        : `<input class="ck-say" type="text" maxlength="80" placeholder="아이에게 한마디(선택)" aria-label="아이에게 한마디"><button type="button" class="btn primary" data-v="ok">맞음</button><button type="button" class="btn" data-v="redo">다시 쓰기</button>`}</div>
    </article>`;
  };
  draw();
}
