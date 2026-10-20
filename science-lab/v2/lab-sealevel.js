// 기후변화와 우리 생활 실험실 — 해안 마을 모형. 물높이(1~4 cm)와 방파제를 고르고 「물 붓기」 → 물이 차분해지면 물에 닿은 집을 세어 표에 적는다.
// 2022 [4과16] 필수 탐구(해수면 상승으로 인한 피해 모형실험). 땅 높이·방파제 높이는 모형 값(scenes/sealevel-model.js).
import { LEVELS, WALLS, HOUSES, seaModel } from '../scenes/sealevel-model.js';
export { LEVELS, WALLS, seaModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 3.2;   // 물을 조금씩 부어 차분해지기까지(초)

export async function mountSeaLevel(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/sea-town.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let li = 1, wall = false, running = false, completed = false, t = 0, dead = false, timer = null, shown = 1;
  el.innerHTML = `<div class="modes" role="group" aria-label="물높이"><span class="lab-lbl">물높이</span>${LEVELS.map((v, i) => `<button type="button" data-level="${i}">${v} cm</button>`).join('')}</div>
    <div class="modes" role="group" aria-label="방파제"><span class="lab-lbl">방파제</span>${WALLS.map((v, i) => `<button type="button" data-wall="${i}">${esc(v.replace('방파제 ', ''))}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="해안 마을 3D 모형. 물높이와 방파제를 바꾸어 물에 닿는 집을 세어요."></canvas>'
      : `<div class="sea-2d" role="img" aria-label="해안 마을 단면 2D 모형"><svg viewBox="0 0 480 220" aria-hidden="true"><rect class="s2-water" x="0" y="0" width="480" height="0"/><path class="s2-land" d="M0 196 L70 192 L110 176 L150 150 L175 120 L195 112 L215 128 L240 168 L270 176 L300 152 L330 140 L360 132 L400 112 L440 84 L480 70 L480 220 L0 220Z"/><rect class="s2-wall" x="118" y="148" width="7" height="58" hidden/>${HOUSES.map((h) => `<g class="s2-house" data-h="${h.id}"><rect width="22" height="16" rx="2"/><text x="11" y="12">${h.id}</text></g>`).join('')}</svg></div>`}
      <p class="lab3d-tip" data-tip aria-live="polite">물높이와 방파제를 고르고 「물 붓기」를 눌러요.</p>
      <p class="lab-read sea-read" data-read>물높이 <b data-lv>1 cm</b> · 물에 닿은 집 <b data-wet>?</b></p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>물 붓기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="sea-note">통·점토 땅·집 위치는 그대로 두고 물높이와 방파제만 바꿔요. 물이 차분해진 뒤 같은 자리의 눈금으로 읽고, 집의 바닥에 물이 닿으면 「젖음」으로 세요. 땅 높이는 모형 값이고, 실제 바다의 파도·밀물과 썰물은 없어요.</p>
    <table class="lab-table"><thead><tr><th>물높이</th><th>방파제</th><th>물에 닿은 집</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildSeaTown(); stage.root.add(model); stage.setView({ theta: -0.38, phi: 1.02, frame: [[-2.5, 0, -1.55], [2.5, 1.4, 1.6]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountSeaLevel(el, { ...opts, force2D: true }); }
  }
  // 2D: 집 자리(단면 위 x)와 땅 높이(cm)
  const X2 = { A: 185, B: 92, C: 262, D: 330, E: 448 }, yOf = (cm) => 214 - cm * 21;
  if (!rig) HOUSES.forEach((h) => $(`[data-h="${h.id}"]`).setAttribute('transform', `translate(${X2[h.id] - 11} ${yOf(h.base) - 16})`));
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.level)} cm</td><td>${esc(r.wall)}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  const show = (level, tt = 0, reveal = false) => {
    shown = level;
    if (model) model.userData.set({ level, wall, t: tt, show: reveal || completed });
    else {
      const w = $('.s2-water'), y = yOf(level); w.setAttribute('y', String(y)); w.setAttribute('height', String(220 - y)); w.setAttribute('width', wall && level <= 3.5 ? '122' : '480');
      $('.s2-wall').hidden = !wall;
      const wet = seaModel(LEVELS.includes(Math.round(level)) ? Math.round(level) : 1, wall).wet;
      el.querySelectorAll('.s2-house').forEach((g) => g.classList.toggle('wet', (reveal || completed) && Math.abs(level - LEVELS[li]) < 0.01 && wet.includes(g.dataset.h)));
    }
    $('[data-lv]').textContent = `${level.toFixed(level % 1 ? 1 : 0)} cm`;
  };
  const press = () => {
    el.querySelectorAll('[data-level]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.level) === li)));
    el.querySelectorAll('[data-wall]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.wall === '1') === wall)));
  };
  // 조건을 바꾸면 처음 상태(물높이 1 cm)로 되돌린다 — 남은 물기 없이 다시 붓는다.
  function choose() { clearInterval(timer); t = 0; running = false; completed = false; record.disabled = true; run.disabled = false; show(1); press(); $('[data-wet]').textContent = '?';
    tip(`목표 물높이 ${LEVELS[li]} cm · ${WALLS[wall ? 1 : 0]}. 「물 붓기」를 눌러 물을 조금씩 부어요.`); }
  function done() {
    running = false; completed = true; run.disabled = false; record.disabled = false; show(LEVELS[li], t, true);
    tip('물이 차분해졌어요. 집 바닥에 물이 닿았는지 세어 표에 적어요.');
    $('[data-wet]').textContent = `${seaModel(LEVELS[li], wall).n}채`;
  }
  const step = (dt) => { t += dt; const k = Math.min(1, t / DUR), lv = 1 + (LEVELS[li] - 1) * (k * k * (3 - 2 * k)); show(lv, t); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead) return; completed = false; record.disabled = true; run.disabled = true; running = true; t = 0; $('[data-wet]').textContent = '?'; tip('물을 조금씩 붓는 중이에요. 흔들림이 가라앉을 때까지 기다려요.');
    if (LEVELS[li] === 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (!completed || running || dead) return;
    const m = seaModel(LEVELS[li], wall), i = rows.findIndex((r) => r.level === m.level && r.wall === m.wall);   // 같은 조건을 다시 재면 그 줄만 바꾼다
    if (i >= 0) rows[i] = m; else rows.push(m);
    rows.sort((a, b) => (a.wall > b.wall ? 1 : a.wall < b.wall ? -1 : a.level - b.level)); drawRows(); opts.onRecord?.(rows.slice());
  };
  el.querySelectorAll('[data-level]').forEach((b) => { b.onclick = () => { li = Number(b.dataset.level); choose(); }; });
  el.querySelectorAll('[data-wall]').forEach((b) => { b.onclick = () => { wall = b.dataset.wall === '1'; choose(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) step(dt); else { t += dt; show(shown, t, completed); }
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  li = opts.level != null ? Math.max(0, LEVELS.indexOf(opts.level)) : 1; wall = !!opts.wall;
  choose(); drawRows(); return { rows, dispose };
}
export async function mountSeaLevel2D(el, opts = {}) { return mountSeaLevel(el, { ...opts, force2D: true }); }
