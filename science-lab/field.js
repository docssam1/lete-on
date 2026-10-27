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
  const arrive = (sid) => {
    const x = SPOTS.find((s) => s.id === sid);
    // 지점에서 걸어 나가면: 자유롭게 걷는 중 — 「다음」은 아직 안 간 다음 장소로
    if (!x) { mode = 'free'; const n = nextSpot(here || 'gate'); show(`표를 누르거나 땅을 눌러 마음대로 걸어가요. 「다음」을 누르면 ${n ? `${n.icon} ${n.name}(으)로` : '처음 장소로'} 같이 가요.`); return; }
    mode = 'arrived'; here = sid;
    show(`${x.icon} ${x.name}에 왔어요! ${firstSentence(setOf(x).lead)} 「다음」을 누르면 여기서 관찰을 시작해요.`, '관찰 시작 ▶');
  };
  const park = mountPark($app.querySelector('.fd-mapbox'), { field: true, start: at, onArrive: arrive });
  const goNext = () => { const x = nextSpot(here || at || 'gate') || SPOTS[0]; mode = 'walking'; show(`${x.icon} ${x.name}(으)로 걸어가요…`, '걸어가는 중', false); park.go(x.id); };
  const step = () => {
    if (mode === 'intro0') { mode = 'intro1'; show(`관찰할 곳에는 표가 꽂혀 있어요(모두 ${SPOTS.length}곳). 표를 직접 눌러도 되고, 「다음」을 누르면 첫 장소로 같이 걸어가요.`); return; }
    if (mode === 'arrived') { location.hash = `#/field/${here}`; return; }
    goNext();
  };
  $next.onclick = step;
  if (at) {
    const x = SPOTS.find((s) => s.id === at), n = nextSpot(at); here = at; mode = 'back';
    show(n ? `${x ? `${x.name} 관찰을 마쳤어요! ` : ''}인쇄한 양식에 따라 그려 봤나요? 「다음」을 누르면 다음 장소(${n.icon} ${n.name})로 가요.` : `${SPOTS.length}곳을 모두 돌았어요! 마음에 드는 곳을 다시 눌러 관찰해도 좋아요.`, n ? '다음 장소 ▶' : '처음 장소로 ▶');
  } else { mode = 'intro0'; show('자연관찰대회에 온 걸 환영해요! 유빈·유준과 공원을 돌며 관찰해요. 땅을 누르거나 방향키를 쓰면 두 친구가 그쪽으로 걸어가요.'); }
  return () => park.destroy();
}

// ── 관찰: 왼쪽 3D · 오른쪽 예시 보고서 · 아래 「다음」 ──
function observeScreen($app, spot) {
  const S = setOf(spot), M = S.mod, X = sampleFor(S.id);
  $app.innerHTML = `<div class="fd fd-obs">
    <header class="fd-top"><a class="fd-back" href="#/field?at=${spot.id}">← 지도</a><b>${spot.icon} ${esc(spot.name)}</b><small>${esc(S.title)}</small><span class="sp"></span>
      <button type="button" class="fd-print main" data-print="form">🖨 보고서 양식 인쇄</button><button type="button" class="fd-print" data-print="ex">🖨 예시 보고서 인쇄</button></header>
    <div class="fd-split">
      <section class="fd-left"><canvas aria-label="표본 3D 모형 — 끌어서 돌려 보기"></canvas><p class="fd-cap"></p></section>
      <section class="fd-right"><p class="fd-note">📄 <b>예시 보고서</b>예요. 그림과 글이 채워져 있지만 <b>생각이 다르면 다르게 써도 돼요.</b> 「보고서 양식 인쇄」로 뽑아서 보며 따라 그려요.</p>
        ${X ? sampleArticle(S) : '<p class="fd-none">이 장소의 예시 보고서는 준비 중이에요.</p>'}</section>
    </div>${bar(true)}</div>`;
  const $c = $app.querySelector('.fd-left canvas'), $cap = $app.querySelector('.fd-cap'), $right = $app.querySelector('.fd-right'), $say = $app.querySelector('.fd-say'), $n = $app.querySelector('.fd-n');
  const stage = Stage.canWebGL() ? new Stage($c) : null; if (!stage) $c.hidden = true;
  const snd = scratch(), D = makeDrawer($right, snd); D.reset();
  let cur = null, curSpec = -1, timers = [];
  const load = (i) => { if (!stage || i === curSpec) return; cur?.dispose?.(); cur = M.mountSpecimen(stage, M.SPECIMENS[i]); curSpec = i; };
  load(0);
  const acts = () => (cur ? cur.actions() : []);
  const hand = () => acts().filter((a) => !a.env && a.id !== 'find').map((a) => a.id);
  const env = () => acts().filter((a) => a.env && a.id !== 'find').map((a) => a.id);
  const specs = M.SPECIMENS.map((f) => f());

  // 단계: { sec(오른쪽 칸), obs(관찰 줄 번호), spec, act, place, draw(그림 키), say }
  const steps = [{ sec: 'target', spec: 0, say: `${S.title}. 보고서 맨 위에는 관찰 장소와 대상을 적어요 — 어디서, 언제, 날씨, 무엇을. 이름을 모르면 번호로 불러요.` }];
  specs.forEach((sp, i) => {
    const hs = (() => { load(i); return hand(); })();
    steps.push({ sec: 'obs', obs: i, spec: i, act: hs[0], say: `이번엔 ${sp.no || i + 1} — ${sp.hint || ''}. 끌어서 돌려 보며 생김새를 살펴요.`, think: sp.think?.[0] });
    steps.push({ sec: 'obs', obs: i, spec: i, act: hs[1], view: 'top', draw: String(i), say: '보고서에는 이렇게 그렸어요 — 전체 모습에 이름표와 자를 붙이고, 글은 본 것 → 확인한 것 → 추정으로 나눠 써요.' });
  });
  load(0);
  const envIds = env(), hasFind = acts().some((a) => a.id === 'find');
  (X?.extra || []).forEach((e, i) => steps.push({ sec: `x${i}`, draw: `x${i}`, say: `${e.title} — ${e.text}` }));
  if (X?.env && envIds.length) envIds.forEach((a) => steps.push({ sec: 'env', act: a, both: !!cur?.places, say: '' }));
  if (X) steps.push({ sec: 'table', act: hasFind ? 'find' : null, both: hasFind && !!cur?.places, say: hasFind ? '같은 넓이의 틀 안에서 찾은 것을 종류별로 세어 표에 적어요. 두 장소를 같은 방법으로 세야 비교가 돼요.' : '찾은 것·잰 것을 표에 정리해요.' });
  if (X?.tree) steps.push({ sec: 'tree', say: '분류 나무: 「그렇다 / 그렇지 않다」로 끝까지 나눠요. 누가 봐도 같게 나뉘는 기준부터 고르고, 그 까닭도 써요.' });
  if (X) steps.push({ sec: 'venn', say: '두 가지를 골라 같은 점(가운데)과 다른 점(양쪽)을 벤 다이어그램에 써요.' });
  if (X?.adapt) steps.push({ sec: 'adapt', say: '생김새가 하는 일을 사는 곳과 이어서 「~해서 ~에 좋을 것 같다」로 써요.' });
  if (X) steps.push({ sec: 'next', say: '더 알아보고 싶은 것 — 무엇을 바꾸고, 무엇을 재고, 무엇을 같게 할지 써요.' });
  steps.push({ end: true, say: '끝! 이제 「🖨 보고서 양식 인쇄」로 뽑아서, 오른쪽 예시를 보며 직접 그리고 써 봐요. 생각이 다르면 다르게 써도 돼요.' });

  let k = -1;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const go = (to) => {
    clear(); D.stop(); k = Math.max(0, Math.min(steps.length - 1, to)); const st = steps[k];
    // 왼쪽
    if (st.spec != null) load(st.spec);
    if (cur && st.view) cur.setView(st.view); else if (cur && st.spec != null && !st.draw) cur.setView('angle');
    if (cur?.places && (st.sec === 'env' || st.sec === 'table')) cur.setPlace(cur.places[0].id);
    let note = cur && st.act ? cur.run(st.act) : '';
    if (cur && st.act && st.both) timers.push(setTimeout(() => { cur.setPlace(cur.places[1].id); cur.run(st.act); }, 6500));
    const sp = specs[curSpec];
    $cap.textContent = st.sec === 'env' || st.sec === 'table' ? (cur?.places ? `${cur.places.map((p) => `${p.name} · ${p.where || ''}`).join('  →  ')}` : '') : sp ? `${sp.no || ''} ${sp.hint || ''}` : '';
    // 말
    let say = st.say;
    if (st.sec === 'env') say = `${note || ''}${st.both ? ' 장소 A를 잰 뒤 장소 B도 같은 방법으로 재요.' : ''}`;
    else if (note && st.sec === 'obs') say = st.draw ? `${note} ${st.say}` : `${st.say} ${note}`;
    $say.textContent = say.trim();
    $n.textContent = `${k + 1} / ${steps.length}`;
    $app.querySelector('.fd-prev').disabled = k === 0;
    const $nx = $app.querySelector('.fd-next'); $nx.textContent = st.end ? '🖨 보고서 양식 인쇄' : '다음 ▶'; $nx.classList.toggle('print', !!st.end);
    // 오른쪽: 그 칸만 밝게, 지난 그림은 다 그린 채, 이번 그림은 연필로
    $right.querySelectorAll('.fd-now').forEach((e) => e.classList.remove('fd-now'));
    const $sec = st.obs != null ? $right.querySelector(`.rp-obs-row[data-obs="${st.obs}"]`) : st.sec ? $right.querySelector(`[data-sec="${st.sec}"]`) : null;
    $right.classList.toggle('focus', !!$sec);
    if ($sec) { $sec.classList.add('fd-now'); $sec.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    const drawn = new Set(steps.slice(0, k).map((x) => x.draw).filter(Boolean));
    D.plans.forEach((p) => { if (drawn.has(p.key)) D.show(p.key); else D.hide(p.key); });
    if (st.end) D.finishAll(); else if (st.draw) { snd.on(); D.draw(st.draw); }
  };
  const printIt = (what) => {
    clear(); D.finishAll();
    const $p = document.createElement('div'); $p.className = 'fd-print-sheet'; document.body.appendChild($p);
    let rep = null;
    if (what === 'ex') $p.innerHTML = sampleArticle(S); else rep = renderReport(S.unit, $p, { embedded: true });
    document.body.classList.add('fd-printing');
    setTimeout(() => { print(); setTimeout(() => { document.body.classList.remove('fd-printing'); rep?.destroy?.(); $p.remove(); }, 400); }, 120);
  };
  $app.querySelector('.fd-next').onclick = () => (steps[k]?.end ? printIt('form') : go(k + 1));
  $app.querySelector('.fd-prev').onclick = () => go(k - 1);
  $app.querySelectorAll('[data-print]').forEach((b) => { b.onclick = () => printIt(b.dataset.print); });
  const onKey = (e) => { if (e.target.closest?.('input, textarea')) return; if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (!steps[k]?.end) go(k + 1); } if (e.key === 'ArrowLeft') go(k - 1); };
  addEventListener('keydown', onKey);
  markDone(spot.id);
  if (typeof window !== 'undefined') window.__field = { steps: steps.length, go: (i) => go(i), k: () => k };
  go(0);
  return () => { clear(); D.stop(); snd.off(); removeEventListener('keydown', onKey); cur?.dispose?.(); stage?.dispose(); };
}
