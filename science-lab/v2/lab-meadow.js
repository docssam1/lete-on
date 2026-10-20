// 생물과 환경 실험실 — 풀밭 먹이 관계(풀 → 토끼 → 여우). 바꿀 것 하나를 고르고 「몇 해 지켜보기」 → 3년 뒤 풀·토끼·여우의 수를 읽고 표에 적는다.
// 수는 경향을 보여 주려고 정한 모형 값이다(scenes/meadow-model.js). 실제 풀밭의 조사값이 아니다.
import { CHANGES, SPECIES, YEARS, BASE, meadowAt, meadowRow } from '../scenes/meadow-model.js';
export { CHANGES, meadowRow };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 4.5;

export async function mountMeadow(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/meadow-field.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let change = CHANGES[0], running = false, t = 0, dead = false, timer = null, seen = false, written = false;
  el.innerHTML = `<div class="modes" role="group" aria-label="바꿀 것">${CHANGES.map((c) => `<button type="button" data-change="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="풀밭 먹이 관계 3D. 풀 포기·토끼·여우가 모형 수만큼 놓여 있고, 몇 해가 지나며 수가 달라져요."></canvas>'
      : `<div class="md-2d" role="img" aria-label="풀·토끼·여우의 수 막대 모형">${SPECIES.map(([k, n]) => `<p><b>${n}</b><span class="md-bar" data-bar="${k}"></span></p>`).join('')}</div>`}
      <p class="lab3d-tip" data-tip aria-live="polite"></p>
      <p class="md-year" data-year></p>
      <ul class="md-read">${SPECIES.map(([k, n]) => `<li><b>${n}</b> <span data-r="${k}">?</span></li>`).join('')}<li class="md-res"><b>3년 뒤 달라진 것</b> <span data-r="result">?</span></li></ul>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>몇 해 지켜보기</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="md-note">풀 → 토끼 → 여우만 사는 닫힌 풀밭이에요(바깥에서 새 먹이가 들어오지 않아요). 처음에는 풀 ${BASE.grass}포기·토끼 ${BASE.rabbit}마리·여우 ${BASE.fox}마리이고, 수는 경향을 보여 주는 모형 값이에요.</p>
    <table class="lab-table"><thead><tr><th>바꾼 것</th><th>풀</th><th>토끼</th><th>여우</th><th>3년 뒤 달라진 것</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildMeadow(); stage.root.add(model); stage.setView({ theta: 0.25, phi: 0.95, frame: [[-2.5, 0, -1.7], [2.5, 0.45, 1.7]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountMeadow(el, { ...opts, force2D: true }); }
  }
  const unit = { grass: '포기', rabbit: '마리', fox: '마리' };
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><th scope="row">${esc(r.change)}</th><td>${r.grass}</td><td>${r.rabbit}</td><td>${r.fox}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  const read = (known) => { const r = meadowRow(change); for (const [k] of SPECIES) $(`[data-r="${k}"]`).textContent = known ? `${r[k]}${unit[k]}` : '?'; $('[data-r="result"]').textContent = known ? r.result : '?'; };
  const show = (y, tt = 0) => {
    $('[data-year]').textContent = y <= 0 ? '바꾼 직후' : y >= YEARS ? `${YEARS}년 뒤` : `${Math.floor(y) + 1}년째 지나는 중…`;
    if (model) model.userData.set({ change, year: y, t: tt });
    else { const n = meadowAt(change, y); for (const [k] of SPECIES) { const b = $(`[data-bar="${k}"]`); if (b) b.style.width = `${(n[k] / { grass: 80, rabbit: 28, fox: 3 }[k]) * 100}%`; } }
  };
  const press = () => el.querySelectorAll('[data-change]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.change === change)));
  const btn = () => { run.disabled = running || seen; record.disabled = running || !seen || written; };
  function pick(c) { clearInterval(timer); running = false; change = c; t = 0; seen = false; written = false; show(0); read(false); press(); btn();
    tip(c === '그대로' ? '아무것도 바꾸지 않은 풀밭이에요. 「몇 해 지켜보기」를 눌러 비교의 기준을 봐요.' : `「${c}」 — 몇 해 뒤 풀·토끼·여우는 어떻게 될지 예상하고 「몇 해 지켜보기」를 눌러요.`); }
  function done() { running = false; seen = true; show(YEARS, t); read(true); btn(); tip('3년 뒤의 수를 읽고 「표에 적기」를 눌러요. 다른 것도 바꿔 「그대로」와 비교해 봐요.'); }
  const step = (dt) => { t += dt; show(Math.min(YEARS, (t / DUR) * YEARS), t); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead || seen) return; running = true; t = 0; btn(); read(false); tip('한 해, 두 해… 풀밭을 지켜봐요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (running || dead || !seen) return;
    const row = meadowRow(change), i = rows.findIndex((r) => r.change === change);   // 같은 것을 다시 적으면 그 줄만 바꾼다
    if (i >= 0) rows[i] = row; else rows.push(row);
    rows.sort((a, b) => CHANGES.indexOf(a.change) - CHANGES.indexOf(b.change)); written = true; drawRows(); btn(); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => { rows.length = 0; drawRows(); pick(change); };
  el.querySelectorAll('[data-change]').forEach((b) => { b.onclick = () => pick(b.dataset.change); });
  let idle = 0;
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive())) return; if (running) step(dt); else { idle += dt; model.userData.set({ t: idle }); } };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  pick(opts.change ?? CHANGES[0]); drawRows(); return { rows, dispose };
}
export async function mountMeadow2D(el, opts = {}) { return mountMeadow(el, { ...opts, force2D: true }); }
