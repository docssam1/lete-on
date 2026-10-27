// 자연관찰 탐험 — #/field(공원 지도) · #/field/<지점>(그 자리 관찰). 화면 하나에 다 보이고(아래로 내리지 않음), 「다음 ▶」만 눌러도 끝까지 간다.
// 원장 2026-10-27: 「너무 복잡해 아래로 스크롤 하지 않고 전체 페이지에」 「맵도 전체 페이지」 「관찰 클릭하면 왼쪽에 화면 오른쪽에 탐구 보고서(그림과 글이 채워진 —
// 다른 생각이면 다른 걸 써도 돼)」 「보고서 양식 인쇄해서 따라 그리는 것이 핵심」 「버튼이 너무 많고 뭔지 몰라 스토리 모드처럼 다음만 눌러도」 「캐릭터 조정할 수도 있어야지」.
// 지도: 땅을 누르거나 방향키로 두 아이를 걷게 한다(park.js field 모드). 관찰: 왼쪽 3D 표본이 단계마다 움직이고, 오른쪽 예시 보고서의 그 칸이 밝아지며 연필이 그림을 그린다.
import { PARK } from './data/park-map.js';
import { OBSERVE_SETS } from './data/observe-sets.js';
import { sampleFor } from './data/observe-samples.js';
import { mountPark } from './park.js';
import { Stage } from './engine.js';
import { sampleArticle, makeDrawer, scratch, esc } from './observe-sample.js';
import { renderReport } from './report.js';
import { REPORTS } from './data/reports.js';

const SPOTS = PARK.spots.filter((x) => x.set && OBSERVE_SETS.some((s) => s.id === x.set));
const setOf = (spot) => OBSERVE_SETS.find((s) => s.id === spot.set);
const KEY = 'sciLab.field';
const done = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}').done || []; } catch { return []; } };
const markDone = (id) => { try { const d = done(); if (!d.includes(id)) d.push(id); localStorage.setItem(KEY, JSON.stringify({ done: d })); } catch { /* 저장 못 해도 진행 */ } };
const nextSpot = (from) => { const d = done(), i = SPOTS.findIndex((x) => x.id === from); for (let k = 1; k <= SPOTS.length; k++) { const x = SPOTS[(i + k + SPOTS.length) % SPOTS.length]; if (!d.includes(x.id)) return x; } return null; };
const firstSentence = (t) => (t.match(/^[^.?!]*[.?!]/) || [t])[0];

const bar = (prev) => `<div class="fd-bar"><span class="fd-who"><img src="./assets/docssam-A1-mouth-closed.webp" alt=""><b>독쌤</b></span><p class="fd-say" aria-live="polite"></p>
  <span class="fd-n"></span>${prev ? '<button type="button" class="fd-prev" aria-label="이전">◀</button>' : ''}<button type="button" class="fd-next">다음 ▶</button></div>`;

export function renderField($app, rest) {
  document.body.classList.add('field-on');
  const [id, q] = (rest || '').split('?'), at = (q || '').match(/at=([\w-]+)/)?.[1] || '';
  const spot = SPOTS.find((x) => x.id === id);
  const off = spot ? observeScreen($app, spot) : mapScreen($app, at);
  return { destroy() { off(); document.body.classList.remove('field-on'); } };
}

// ── 지도 ──
function mapScreen($app, at) {
  $app.innerHTML = `<div class="fd fd-map"><div class="fd-mapbox"></div>
    <a class="fd-home" href="#/contest/nature">← 대회 안내</a>
    <span class="fd-hint">땅을 누르거나 ← ↑ → ↓ 키로 두 친구를 움직여요</span>${bar(false)}</div>`;
  const $say = $app.querySelector('.fd-say'), $next = $app.querySelector('.fd-next');
  let mode = '', here = '';
  const show = (t, label = '다음 ▶', on = true) => { $say.textContent = t; $next.textContent = label; $next.disabled = !on; };
  // picked = 표를 눌러(또는 「다음」으로) 그 장소로 간 것 — 도착하면 아래 띠를 누르지 않아도 바로 관찰을 연다(원장 2026-10-27). 그냥 걷다가 가까이 온 것은 안내만.
  let enterT = 0;
  const arrive = (sid, picked = false) => {
    clearTimeout(enterT);
    const x = SPOTS.find((s) => s.id === sid);
    // 광장(대회 본부): 대회 안내 — 「다음」을 누르면 대회 안내 쪽을 연다
    if (sid === 'gate') { mode = 'gate'; here = 'gate'; show('📋 광장 · 대회 본부예요. 대회 날은 여기서 주제와 장소를 받고, 관찰 기록지와 연필을 챙겨요. 「다음」을 누르면 대회 안내(누가 나가는지·몇 분·무엇을 내는지·심사 기준)를 봐요.', '대회 안내 보기 ▶'); return; }
    // 지점에서 걸어 나가면: 자유롭게 걷는 중 — 「다음」은 아직 안 간 다음 장소로
    if (!x) { mode = 'free'; const n = nextSpot(here || 'gate'); show(`표를 누르거나 땅을 눌러 마음대로 걸어가요. 「다음」을 누르면 ${n ? `${n.icon} ${n.name}(으)로` : '처음 장소로'} 같이 가요.`); return; }
    mode = 'arrived'; here = sid;
    if (picked) { show(`${x.icon} ${x.name}에 왔어요! 관찰을 시작해요…`, '관찰 시작 ▶'); enterT = setTimeout(() => { location.hash = `#/field/${sid}`; }, 1200); return; }
    show(`${x.icon} ${x.name}에 왔어요! ${firstSentence(setOf(x).lead)} 「다음」을 누르면 여기서 관찰을 시작해요.`, '관찰 시작 ▶');
  };
  const park = mountPark($app.querySelector('.fd-mapbox'), { field: true, start: at, onArrive: arrive });
  const goNext = () => { const x = nextSpot(here || at || 'gate') || SPOTS[0]; mode = 'walking'; show(`${x.icon} ${x.name}(으)로 걸어가요…`, '걸어가는 중', false); park.go(x.id); };
  const step = () => {
    if (mode === 'intro0') { mode = 'intro1'; show(`관찰할 곳에는 표가 꽂혀 있어요(모두 ${SPOTS.length}곳). 표를 직접 눌러도 되고, 「다음」을 누르면 첫 장소로 같이 걸어가요.`); return; }
    if (mode === 'arrived') { location.hash = `#/field/${here}`; return; }
    if (mode === 'gate') { location.hash = '#/contest/nature'; return; }
    goNext();
  };
  $next.onclick = step;
  if (at) {
    const x = SPOTS.find((s) => s.id === at), n = nextSpot(at); here = at; mode = 'back';
    show(n ? `${x ? `${x.name} 관찰을 마쳤어요! ` : ''}인쇄한 양식에 따라 그려 봤나요? 「다음」을 누르면 다음 장소(${n.icon} ${n.name})로 가요.` : `${SPOTS.length}곳을 모두 돌았어요! 마음에 드는 곳을 다시 눌러 관찰해도 좋아요.`, n ? '다음 장소 ▶' : '처음 장소로 ▶');
  } else { mode = 'intro0'; show('자연관찰대회에 온 걸 환영해요! 유빈·유준과 공원을 돌며 관찰해요. 땅을 누르거나 방향키를 쓰면 두 친구가 그쪽으로 걸어가요.'); }
  return () => { clearTimeout(enterT); park.destroy(); };
}

// ── 관찰: 왼쪽 3D · 오른쪽 예시 보고서 · 아래 「다음」 ──
// 원장 2026-10-27: 「같이 그려볼까요? → 다음 또는 다 그렸어요」 「생각해 볼까요 → 다음 누르면 내용」 「화면도 같이 움직여야지」.
// 단계 셋: look(3D가 한 동작, 카메라가 그 각도로 미끄러져 감) · think(묻고 → 「다음」에 보고서 그 칸이 드러남) · draw(같이 그려요 — 손이 예시 그림을 그리는 동안 아이는 인쇄한 양식에).
// 보고서 칸은 그 단계에 오기 전까지 흐리게 가려 둔다(생각하기 전에 답이 보이지 않게).
function observeScreen($app, spot) {
  const S = setOf(spot), M = S.mod, X = sampleFor(S.id), R = REPORTS[S.id] || {}, P = S.unit.reportPatch || {};
  $app.innerHTML = `<div class="fd fd-obs">
    <header class="fd-top"><a class="fd-back" href="#/field?at=${spot.id}">← 지도</a><b>${spot.icon} ${esc(spot.name)}</b><small>${esc(S.title)}</small><span class="sp"></span>
      <button type="button" class="fd-print main" data-print="form">🖨 보고서 양식 인쇄</button><button type="button" class="fd-print" data-print="ex">🖨 예시 보고서 인쇄</button></header>
    <div class="fd-split">
      <section class="fd-left"><canvas aria-label="표본 3D 모형 — 끌어서 돌려 보기"></canvas><p class="fd-cap"></p></section>
      <section class="fd-right"><p class="fd-note">📄 <b>예시 보고서</b>예요. 그림과 글이 채워져 있지만 <b>생각이 다르면 다르게 써도 돼요.</b> 「보고서 양식 인쇄」로 뽑아서 보며 따라 그려요.</p>
        ${X ? sampleArticle(S) : '<p class="fd-none">이 장소의 예시 보고서는 준비 중이에요.</p>'}</section>
    </div>
    <div class="fd-bar"><span class="fd-who"><img src="./assets/docssam-A1-mouth-closed.webp" alt=""><b>독쌤</b></span><p class="fd-say" aria-live="polite"></p>
      <span class="fd-n"></span><button type="button" class="fd-prev" aria-label="이전">◀</button><button type="button" class="fd-drew" hidden>✏ 다 그렸어요</button><button type="button" class="fd-next">다음 ▶</button></div></div>`;
  const $c = $app.querySelector('.fd-left canvas'), $cap = $app.querySelector('.fd-cap'), $right = $app.querySelector('.fd-right'), $say = $app.querySelector('.fd-say'), $n = $app.querySelector('.fd-n');
  const $next = $app.querySelector('.fd-next'), $drew = $app.querySelector('.fd-drew'), $prev = $app.querySelector('.fd-prev');
  const stage = Stage.canWebGL() ? new Stage($c) : null; if (!stage) $c.hidden = true;
  if (typeof window !== 'undefined') window.__fdStage = stage;   // 검사 스크립트용
  const snd = scratch(), D = makeDrawer($right, snd); D.reset();
  let cur = null, curSpec = -1, timers = [];
  const load = (i) => { if (!stage || i === curSpec) return; cur?.dispose?.(); cur = M.mountSpecimen(stage, M.SPECIMENS[i]); curSpec = i; settle(); };
  // ── 카메라가 함께 움직인다(원장 「화면도 같이 움직여야지」): 단계마다 그 각도(aim)로 1초쯤 걸려 미끄러져 가고, 가만히 있을 때는 좌우로 천천히 흔들려 입체가 보인다.
  // 각도를 바꿀 때마다 엔진의 home도 같이 옮겨 자동 맞춤(거리·가운데)이 계속 맞게 한다. 손으로 돌리면(「처음 시점」 단추가 뜸) 그동안은 손대지 않는다.
  let aim = null, swayT0 = 0, hold = 0, camRaf = 0, last = performance.now();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settle = () => { if (!stage) return; const o = stage.orbit; aim = { th: o.theta, ph: o.phi }; swayT0 = performance.now(); };
  const glide = (id) => { if (!cur || !stage) return; const o = stage.orbit, th = o.theta, ph = o.phi; cur.setView(id); aim = { th: o.theta, ph: o.phi }; o.theta = th; o.phi = ph; if (o.home) { o.home.theta = th; o.home.phi = ph; } swayT0 = performance.now(); };
  const director = (now) => {
    camRaf = requestAnimationFrame(director); const dt = Math.min(0.5, (now - last) / 1000); last = now;
    if (!stage || !cur || !aim || stage._vbShown || stage._goHome || now < hold) return;
    const o = stage.orbit, h = o.home, k = reduced ? 1 : 1 - Math.exp(-dt * 2.6), sw = reduced ? 0 : 0.28 * Math.sin(((now - swayT0) / 1000) * 0.5);
    let d = (aim.th + sw - o.theta) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2;
    o.theta += d * k; o.phi += (aim.ph - o.phi) * k; if (h) { h.theta = o.theta; h.phi = o.phi; }
  };
  camRaf = requestAnimationFrame(director);
  $c.addEventListener('pointerdown', () => { hold = performance.now() + 5000; });
  load(0);
  const acts = () => (cur ? cur.actions() : []);
  const hand = () => acts().filter((a) => !a.env && a.id !== 'find').map((a) => a.id);
  const env = () => acts().filter((a) => a.env && a.id !== 'find').map((a) => a.id);
  const specs = M.SPECIMENS.map((f) => f());
  const ask = (key, fb) => R.asks?.[key]?.[0] || P[key]?.ask || fb;

  // 단계: { kind: look|think|draw|end, sec(오른쪽 칸), obs(관찰 줄), spec, act, view, both(장소 A→B), draw(그림 키), q(생각할 거리), say }
  const steps = [{ kind: 'look', sec: 'target', reveal: 'target', spec: 0, view: 'angle', say: `${S.title}. 보고서 맨 위에는 관찰 장소와 대상을 적어요 — 어디서, 언제, 날씨, 무엇을. 이름을 모르면 번호로 불러요.` }];
  specs.forEach((sp, i) => {
    const hs = (() => { load(i); return hand(); })(), no = sp.no || i + 1;
    // 보기(동작 없이 돌려 보기) → 생각하기(묻고, 「다음」에 3D가 직접 해 보이며 글이 드러남) → 두 번째 동작(있으면) → 같이 그리기
    steps.push({ kind: 'look', sec: 'obs', obs: i, spec: i, view: 'angle', say: `이번엔 ${no} — ${sp.hint || ''}. 끌어서 돌려 보며 생김새를 살펴요.` });
    steps.push({ kind: 'think', sec: 'obs', obs: i, spec: i, act: hs[0], view: 'angle', reveal: `obs${i}`, q: sp.think?.[0] || `${no}은 어떻게 생겼나요?` });
    if (hs[1]) steps.push({ kind: 'look', sec: 'obs', obs: i, spec: i, act: hs[1], view: 'side', say: '' });
    steps.push({ kind: 'draw', sec: 'obs', obs: i, spec: i, view: 'top', draw: String(i), say: `같이 그려 볼까요? 인쇄한 양식의 ${no} 칸에 함께 그려요 — 전체 모습을 크게, 이름표와 자도 붙여요.` });
  });
  load(0);
  const envIds = env(), hasFind = acts().some((a) => a.id === 'find'), two = !!cur?.places;
  (X?.extra || []).forEach((e, i) => { steps.push({ kind: 'think', sec: `x${i}`, reveal: `x${i}`, q: `${e.title} — 무엇이 보일까요?` }); if (e.draw) steps.push({ kind: 'draw', sec: `x${i}`, draw: `x${i}`, say: '같이 그려 볼까요? 양식의 빈 곳에 함께 그려요.' }); });
  if (X?.env && envIds.length) { envIds.forEach((a) => steps.push({ kind: 'look', sec: 'env', act: a, both: two, view: 'angle', say: '' })); steps.push({ kind: 'think', sec: 'env', reveal: 'env', q: ask('env', '두 장소는 무엇이 달랐나요? 왜 그럴까요?') }); }
  if (X) { if (hasFind) steps.push({ kind: 'look', sec: 'table', act: 'find', both: two, say: '같은 넓이의 틀 안에서 찾은 것을 종류별로 세어요. 두 장소를 같은 방법으로 세야 비교가 돼요.' }); steps.push({ kind: 'think', sec: 'table', reveal: 'table', q: ask('result', '찾은 것을 표에 어떻게 정리할까요?') }); }
  if (X?.tree) steps.push({ kind: 'think', sec: 'tree', reveal: 'tree', q: ask('classify', '어떤 기준으로 둘씩 나눌 수 있을까요? 누가 봐도 같게 나뉘는 기준부터.') });
  if (X) steps.push({ kind: 'think', sec: 'venn', reveal: 'venn', q: '두 가지를 골라 볼까요? 같은 점과 다른 점은 무엇일까요?' });
  if (X?.adapt) steps.push({ kind: 'think', sec: 'adapt', reveal: 'adapt', q: ask('adapt', '생김새는 사는 곳에서 어떤 점이 좋을까요?') });
  if (X) steps.push({ kind: 'think', sec: 'next', reveal: 'next', q: ask('next', '더 알아보고 싶은 것은 무엇인가요? 무엇을 바꾸고, 무엇을 재고, 무엇을 같게 할까요?') });
  steps.push({ kind: 'end', say: '끝! 이제 「🖨 보고서 양식 인쇄」로 뽑아서, 오른쪽 예시를 보며 직접 그리고 써 봐요. 생각이 다르면 다르게 써도 돼요.' });

  // 가릴 칸: think 단계가 드러내는 것(reveal) — 관찰 줄은 글만, 나머지는 칸 몸통
  const maskEl = (key) => (key.startsWith('obs') ? $right.querySelector(`.rp-obs-row[data-obs="${key.slice(3)}"] .rp-obs-text`) : $right.querySelector(`[data-sec="${key}"] .rp-body`));
  const keys = [...new Set(steps.map((x) => x.reveal).filter(Boolean))];
  let k = -1, open = false;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const render = () => {
    const st = steps[k], shown = new Set(steps.slice(0, k).map((x) => x.reveal).filter(Boolean));
    if (st.kind !== 'think' || open) if (st.reveal) shown.add(st.reveal);
    keys.forEach((key) => maskEl(key)?.classList.toggle('fd-hide', !shown.has(key)));
    let say = st.say || '';
    if (st.kind === 'think') say = open ? `${st.note ? `${st.note} ` : ''}보고서에는 이렇게 썼어요. 내 생각이 다르면 다르게 써도 돼요.` : `생각해 볼까요? ${st.q}`;
    $say.textContent = say.trim();
    $next.textContent = st.kind === 'end' ? '🖨 보고서 양식 인쇄' : st.kind === 'think' && !open ? '다음 ▶ (내용 보기)' : '다음 ▶';
    $next.classList.toggle('print', st.kind === 'end'); $drew.hidden = st.kind !== 'draw'; $prev.disabled = k === 0;
  };
  const go = (to) => {
    clear(); D.stop(); k = Math.max(0, Math.min(steps.length - 1, to)); open = false; const st = steps[k];
    // 왼쪽: 표본 바꾸기 · 카메라 미끄러지기 · 한 동작
    if (st.spec != null) load(st.spec);
    if (cur?.places && (st.sec === 'env' || st.sec === 'table')) cur.setPlace(cur.places[0].id);
    if (st.view && st.act !== 'find') glide(st.view);
    // 생각하기 단계의 동작은 「다음(내용 보기)」을 누를 때 한다 — 먼저 해 버리면 답을 보여 주는 셈
    const note = cur && st.act && st.kind !== 'think' ? cur.run(st.act) : '';
    // 틀 찾기는 엔진이 위에서 내려다보는 각도로 바꿨다가 끝나면 되돌린다 — 그동안 카메라를 놓아 둔다
    if (st.act === 'find') aim = null;
    if (cur && st.act && st.both) timers.push(setTimeout(() => { cur.setPlace(cur.places[1].id); cur.run(st.act); }, 6500));
    st.note = '';
    if (st.sec === 'env' && st.kind === 'look') st.say = `${note || ''}${st.both ? ' 장소 A를 잰 뒤 장소 B도 같은 방법으로 재요.' : ''}`;
    else if (st.kind === 'look' && st.sec === 'obs' && st.act) st.say = note || '';
    const sp = specs[curSpec];
    $cap.textContent = st.sec === 'env' || st.sec === 'table' ? (cur?.places ? cur.places.map((p) => `${p.name} · ${p.where || ''}`).join('  →  ') : '') : sp ? `${sp.no || ''} ${sp.hint || ''}` : '';
    $n.textContent = `${k + 1} / ${steps.length}`;
    // 오른쪽: 그 칸만 밝게, 지난 그림은 다 그린 채, 이번 그림은 손이 그린다
    $right.querySelectorAll('.fd-now').forEach((e) => e.classList.remove('fd-now'));
    const $sec = st.obs != null ? $right.querySelector(`.rp-obs-row[data-obs="${st.obs}"]`) : st.sec ? $right.querySelector(`[data-sec="${st.sec}"]`) : null;
    $right.classList.toggle('focus', !!$sec);
    if ($sec) { $sec.classList.add('fd-now'); $sec.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    const drawn = new Set(steps.slice(0, k).map((x) => x.draw).filter(Boolean));
    D.plans.forEach((p) => { if (drawn.has(p.key)) D.show(p.key); else D.hide(p.key); });
    // 연필 소리는 내지 않는다(원장 2026-10-27 「그리는 소리 거슬려」)
    if (st.kind === 'end') D.finishAll(); else if (st.draw) D.draw(st.draw);
    render();
  };
  const printIt = (what) => {
    clear(); D.finishAll(); $right.querySelectorAll('.fd-hide').forEach((e) => e.classList.remove('fd-hide'));
    const $p = document.createElement('div'); $p.className = 'fd-print-sheet'; document.body.appendChild($p);
    let rep = null;
    if (what === 'ex') $p.innerHTML = sampleArticle(S); else rep = renderReport(S.unit, $p, { embedded: true });
    document.body.classList.add('fd-printing');
    setTimeout(() => { print(); setTimeout(() => { document.body.classList.remove('fd-printing'); rep?.destroy?.(); $p.remove(); render(); }, 400); }, 120);
  };
  const forward = () => { const st = steps[k]; if (st.kind === 'end') return printIt('form'); if (st.kind === 'think' && !open) { open = true; if (cur && st.act) st.note = cur.run(st.act) || ''; render(); return; } go(k + 1); };
  $next.onclick = forward;
  $drew.onclick = () => { D.finishAll(); $say.textContent = '잘했어요! 예시와 견주어 보고, 빠뜨린 이름표나 자가 있으면 더해요.'; $drew.hidden = true; timers.push(setTimeout(() => go(k + 1), 1600)); };
  $prev.onclick = () => go(k - 1);
  $app.querySelectorAll('[data-print]').forEach((b) => { b.onclick = () => printIt(b.dataset.print); });
  const onKey = (e) => { if (e.target.closest?.('input, textarea')) return; if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); forward(); } if (e.key === 'ArrowLeft') go(k - 1); };
  addEventListener('keydown', onKey);
  markDone(spot.id);
  if (typeof window !== 'undefined') window.__field = { steps: steps.length, go: (i) => go(i), next: forward, k: () => k, kinds: steps.map((x) => x.kind) };
  go(0);
  return () => { clear(); D.stop(); snd.off(); cancelAnimationFrame(camRaf); removeEventListener('keydown', onKey); cur?.dispose?.(); stage?.dispose(); };
}
