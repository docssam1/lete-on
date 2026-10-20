// 물체와 물질 실험실 — 같은 모양 막대 네 개(금속·플라스틱·나무·고무). 시험을 고르고 「시험하기」 → 네 막대의 결과를 읽고 표에 적는다.
// 결과는 「이 모형의 막대」 값이다(scenes/material-model.js). 같은 이름의 물질도 종류·두께에 따라 다를 수 있다.
import { MATERIALS, TESTS, ASK, NOTE, materialRow } from '../scenes/material-model.js';
export { MATERIALS, TESTS, materialRow };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 3.2;

export async function mountMaterial(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/material-bars.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let test = 3, running = false, t = 0, dead = false, timer = null, ran = new Set(), written = new Set();
  el.innerHTML = `<div class="modes" role="group" aria-label="시험 고르기"><span class="lab-lbl">시험</span>${TESTS.map((v, i) => `<button type="button" data-test="${i}">${esc(v)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="같은 모양 막대 네 개 3D. 금속·플라스틱·나무·고무 막대를 같은 방법으로 시험해요."></canvas>'
      : `<div class="mt-2d" role="img" aria-label="막대 네 개 2D 모형">${MATERIALS.map((m) => `<span class="mt-bar" data-m="${m}"><b>${m}</b><i data-r></i></span>`).join('')}</div>`}
      <p class="lab3d-tip" data-tip aria-live="polite"></p>
      <ul class="mt-read" data-read>${MATERIALS.map((m) => `<li><b>${m}</b> <span data-res="${m}">?</span></li>`).join('')}</ul>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>시험하기</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="mt-note">네 막대는 길이 16 cm·굵기 1 cm로 모양과 크기가 같아요. 결과는 이 모형의 막대 값이에요(금속=${NOTE.금속}, 플라스틱=${NOTE.플라스틱}, 나무=${NOTE.나무}, 고무=${NOTE.고무}). 같은 이름의 물질도 종류와 두께에 따라 다를 수 있어요.</p>
    <table class="lab-table"><thead><tr><th>시험</th>${MATERIALS.map((m) => `<th>${m}</th>`).join('')}</tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildMaterialBench(); stage.root.add(model); stage.setView({ theta: 0, phi: 1.02, frame: [[-2.4, 0, -0.6], [2.4, 1.3, 1.35]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountMaterial(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><th scope="row">${esc(r.test)}</th>${MATERIALS.map((m) => `<td>${esc(r[m])}</td>`).join('')}</tr>`).join(''); };
  const read = (known) => { const row = materialRow(TESTS[test]); MATERIALS.forEach((m) => { $(`[data-res="${m}"]`).textContent = known ? row[m] : '?'; const b = el.querySelector(`.mt-bar[data-m="${m}"] [data-r]`); if (b) b.textContent = known ? row[m] : ''; }); };
  const show = (p) => { if (model) model.userData.set({ test, p, done: [...ran].map((i) => TESTS[i]) }); };
  const press = () => el.querySelectorAll('[data-test]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.test) === test)));
  const btn = () => { run.disabled = running || ran.has(test); record.disabled = running || !ran.has(test) || written.has(test); };
  function pick(i) { clearInterval(timer); running = false; test = i; t = 0; show(ran.has(test) ? 1 : 0); read(ran.has(test)); press(); btn();
    tip(`${TESTS[test]}: ${ASK[TESTS[test]]} 네 막대를 같은 방법으로 시험해요. 「시험하기」를 눌러요.`); }
  function done() { running = false; ran.add(test); show(1); read(true); btn(); tip('결과를 읽고 「표에 적기」를 눌러요. 다른 시험도 골라 해 봐요.'); }
  const step = (dt) => { t += dt; show(Math.min(1, t / DUR)); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead || ran.has(test)) return; running = true; t = 0; btn(); read(false); tip('네 막대를 같은 방법으로 시험하고 있어요…');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (running || dead || !ran.has(test)) return;
    const row = materialRow(TESTS[test]), i = rows.findIndex((r) => r.test === row.test);   // 같은 시험을 다시 적으면 그 줄만 바꾼다
    if (i >= 0) rows[i] = row; else rows.push(row);
    rows.sort((a, b) => TESTS.indexOf(a.test) - TESTS.indexOf(b.test));
    written.add(test); drawRows(); btn(); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => { ran = new Set(); written = new Set(); pick(test); };
  el.querySelectorAll('[data-test]').forEach((b) => { b.onclick = () => pick(Number(b.dataset.test)); });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) step(dt); else if (model) model.userData.set({ t: (model.userData.state.t || 0) + dt });
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  pick(opts.test ?? 3); drawRows(); return { rows, dispose };
}
export async function mountMaterial2D(el, opts = {}) { return mountMaterial(el, { ...opts, force2D: true }); }
