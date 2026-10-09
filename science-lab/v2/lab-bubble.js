// 비눗방울 실험실 — 비눗물에 넣을 것(없음·설탕·글리세린)을 골라 「불기」를 세 번 → 회차마다 터지기까지 시간(초)을 재고, 평균을 표에 적는다.
// 지도자료 1부 「비눗방울 탐구」. 「그냥 비눗물 ≈ 10초」만 원본 설명이고 설탕·글리세린 시간은 그 순서를 따르는 모형 값이다.
import { ADDS, SHORT, TRIALS, bubbleModel } from '../scenes/bubble-model.js';
export { ADDS, TRIALS, bubbleModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SPEED = 8, GROW = 0.6, POP = 3;   // 1초에 8초씩 빨리 감기 · 부는 시간(초) · 터진 뒤 물방울이 흩어지는 시간(장면 초)

export async function mountBubble(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/bubble-wand.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let ai = 0, done = 0, running = false, t = 0, dead = false, timer = null;
  el.innerHTML = `<div class="modes" role="group" aria-label="비눗물에 넣을 것"><span class="lab-lbl">넣을 것</span>${SHORT.map((v, i) => `<button type="button" data-add="${i}" title="${esc(ADDS[i])}">${esc(v)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="비눗방울 3D 실험. 비눗물에 넣는 것을 바꾸어 방울이 터지기까지 시간을 재요."></canvas>'
      : '<div class="bubble-2d" role="img" aria-label="비눗방울 2D 관찰"><i class="bb-ball"></i><em class="bb-clock">0초</em></div>'}
      <div class="lab3d-read">${[1, 2, 3].map((i) => `<p class="lab-read"><span>${i}회</span><b data-r="${i}">–</b><small>초</small></p>`).join('')}</div>
      <p class="lab3d-tip" data-tip aria-live="polite">넣을 것을 고르고 「불기」를 세 번 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>불기 (1회)</button><button type="button" class="btn" data-record disabled>평균 내어 표에 적기</button></div></div>
    <p class="bb-model-note">물비누 1숟가락 + 따뜻한 물 6숟가락으로 만든 같은 비눗물에, 넣는 것만 바꿔요. 같은 고리로 같은 크기의 방울을 불어 터질 때까지 시간을 재요(화면은 8배 빨리 감기). 「그냥 비눗물은 10초쯤」은 지도자료의 설명이고, 설탕·글리세린 시간은 그 순서를 따르는 모형 값이에요.</p>
    <table class="lab-table"><thead><tr><th>넣은 것</th><th>1·2·3회</th><th>평균</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildBubbleRig({ adds: [ai] }); stage.root.add(model); stage.setView({ theta: 0.18, phi: 1.25, frame: [[-0.75, 0, -0.6], [0.95, 2.95, 0.7]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountBubble(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.add)}</td><td>${esc(r.trials.join(' · '))}초</td><td>${esc(r.mean)}초</td></tr>`).join(''); };
  const read = () => { const m = bubbleModel(ADDS[ai]); for (const i of [1, 2, 3]) $(`[data-r="${i}"]`).textContent = i <= done ? m.trials[i - 1] : '–'; };
  const life = () => bubbleModel(ADDS[ai]).trials[Math.min(done, TRIALS - 1)];
  // tt: 이번 회차의 실제 지난 시간(초)
  const show = (tt) => {
    const grow = Math.min(1, tt / GROW), sim = Math.max(0, (tt - GROW) * SPEED);
    if (model) model.userData.set({ adds: [ai], grow: running || done ? grow : 0, sim, t: tt, trial: Math.min(done, TRIALS - 1) });
    else { const b = $('.bubble-2d'); b.dataset.on = running && sim < life() ? '1' : '0'; $('.bb-clock').textContent = `${Math.floor(Math.min(sim, life()))}초`; }
  };
  const press = () => el.querySelectorAll('[data-add]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.add) === ai)));
  const label = () => { run.textContent = done >= TRIALS ? '다시 처음부터' : `불기 (${done + 1}회)`; };
  function choose() { clearInterval(timer); t = 0; running = false; done = 0; record.disabled = true; run.disabled = false; if (model) model.userData.set({ adds: [ai], grow: 0, sim: 0 }); else show(0); press(); read(); label(); tip(`${ADDS[ai]}. 「불기」를 세 번 눌러 회차마다 터지기까지 시간을 재요.`); }
  function finish() {
    running = false; const m = bubbleModel(ADDS[ai]); done += 1; run.disabled = false; read(); label();
    if (done < TRIALS) tip(`${done}회: ${m.trials[done - 1]}초 만에 터졌어요. 같은 비눗물로 한 번 더 불어요.`);
    else { record.disabled = false; tip(`세 번 모두 쟀어요: ${m.trials.join(' · ')}초 → 평균 ${m.mean}초. 「평균 내어 표에 적기」를 눌러요.`); }
  }
  const step = (dt) => { t += dt; show(t); if ((t - GROW) * SPEED >= life() + POP) finish(); };
  run.onclick = () => {
    if (running || dead) return;
    if (done >= TRIALS) { choose(); return; }
    running = true; run.disabled = true; t = 0; tip(`${done + 1}회째 — 방울을 불었어요. 터질 때까지 지켜봐요.`);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = GROW + (life() + POP) / SPEED; show(t); finish(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => { if (done < TRIALS || running || dead) return; rows.push({ add: ADDS[ai], ...bubbleModel(ADDS[ai]) }); drawRows(); opts.onRecord?.(rows.slice()); record.disabled = true; tip('표에 적었어요. 넣는 것만 바꾸어 비교해 봐요.'); };
  el.querySelectorAll('[data-add]').forEach((b) => { b.onclick = () => { ai = Number(b.dataset.add); choose(); }; });
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive())) return; if (running) step(dt); };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountBubble2D(el, opts = {}) { return mountBubble(el, { ...opts, force2D: true }); }
