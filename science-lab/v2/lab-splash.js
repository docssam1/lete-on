// 튀는 물방울 실험실 — 구멍 지름과 높이를 골라 「떨어뜨리기」를 세 번 → 회차마다 튄 방울 수를 재고, 평균을 표에 적는다.
// 지도자료 1부 예시 탐구의 측정값(3회 평균)을 쓰는 모형. 과학자의 탐구 과정(반복 측정 · 평균 · 변인 통제)을 직접 해 보게 한다.
import { HOLES, HEIGHTS, TRIALS, DATA, splashModel } from '../scenes/splash-model.js';
export { HOLES, HEIGHTS, TRIALS, DATA, splashModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const group = (label, key, list, unit) => `<div class="modes" role="group" aria-label="${label}"><span class="lab-lbl">${label}</span>${list.map((v) => `<button type="button" data-${key}="${v}">${v} ${unit}</button>`).join('')}</div>`;
const DUR = 2.4;   // 한 번 떨어뜨리는 연출 시간(초)

export async function mountSplash(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/splash-bottle.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let hole = 3, height = 15, done = 0, running = false, t = 0, dead = false, timer = null;
  el.innerHTML = `${group('구멍 지름', 'hole', HOLES, 'mm')}${group('높이', 'height', HEIGHTS, 'cm')}
    <div class="lab3d">${rig ? '<canvas aria-label="튀는 물방울 3D 실험. 페트병 뚜껑 구멍과 높이를 바꾸어 잉크 물을 떨어뜨리고 튄 방울 수를 세어요."></canvas>'
      : '<div class="splash-2d" role="img" aria-label="튀는 물방울 2D 관찰"><span class="sp-bottle">🧴</span><i class="sp-stream"></i><span class="sp-dots"></span></div>'}
      <div class="lab3d-read">${[1, 2, 3].map((i) => `<p class="lab-read"><span>${i}회</span><b data-r="${i}">–</b><small>개</small></p>`).join('')}</div>
      <p class="lab3d-tip" data-tip aria-live="polite">구멍 지름과 높이를 고르고 「떨어뜨리기」를 세 번 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>떨어뜨리기 (1회)</button><button type="button" class="btn" data-record disabled>평균 내어 표에 적기</button></div></div>
    <p class="sp-model-note">튄 방울 수는 지도자료에 실린 실제 측정값(3회 평균)을 바탕으로 한 모형이에요. 화면의 동심원 간격은 잘 보이게 넓혀 그렸어요.</p>
    <table class="lab-table"><thead><tr><th>구멍 지름</th><th>높이</th><th>1·2·3회</th><th>평균</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildSplash(); stage.root.add(model); stage.setView({ theta: 0.35, phi: 0.92, frame: [[-2.0, 0, -1.85], [1.85, 2.9, 1.85]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountSplash(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.hole)} mm</td><td>${esc(r.height)} cm</td><td>${esc(r.trials.join(' · '))}</td><td>${esc(r.mean)}개</td></tr>`).join(''); };
  const read = () => { const m = splashModel(hole, height); for (const i of [1, 2, 3]) $(`[data-r="${i}"]`).textContent = i <= done ? m.trials[i - 1] : '–'; };
  // p: 이번 회차 진행(0~1)
  const show = (p, tt = 0) => {
    const trial = Math.min(TRIALS, done + (running ? 1 : 0)) || 1;
    if (model) model.userData.set({ hole, height, phase: p, trial, t: tt });
    else { const b = $('.splash-2d'); b.dataset.on = p > 0 ? '1' : '0'; b.style.setProperty('--w', `${hole}px`); $('.sp-dots').textContent = p >= 1 ? '•'.repeat(Math.max(1, Math.round(splashModel(hole, height).trials[trial - 1] / 8))) : ''; }
  };
  const press = () => { for (const [k, v] of [['hole', hole], ['height', height]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset[k]) === v))); };
  const label = () => { run.textContent = done >= TRIALS ? '다시 처음부터' : `떨어뜨리기 (${done + 1}회)`; };
  function choose() { clearInterval(timer); t = 0; running = false; done = 0; record.disabled = true; run.disabled = false; show(0); press(); read(); label(); tip(`구멍 ${hole} mm · 높이 ${height} cm. 「떨어뜨리기」를 세 번 눌러 회차마다 튄 방울 수를 재요.`); }
  function finish() {
    running = false; done += 1; run.disabled = false; show(1, t); read(); label();
    const m = splashModel(hole, height);
    if (done < TRIALS) tip(`${done}회: ${m.trials[done - 1]}개. 같은 조건으로 한 번 더 재요(종이는 새것).`);
    else { record.disabled = false; tip(`세 번 모두 쟀어요: ${m.trials.join(' · ')}개 → 평균 ${m.mean}개. 「평균 내어 표에 적기」를 눌러요.`); }
  }
  run.onclick = () => {
    if (running || dead) return;
    if (done >= TRIALS) { choose(); return; }
    running = true; run.disabled = true; t = 0; tip(`${done + 1}회째 — 떨어지는 중이에요.`);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else if (!stage) { timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; show(Math.min(1, t / DUR), t); if (t >= DUR) { clearInterval(timer); finish(); } }, 100); }
  };
  record.onclick = () => { if (done < TRIALS || running || dead) return; rows.push({ hole, height, ...splashModel(hole, height) }); drawRows(); opts.onRecord?.(rows.slice()); record.disabled = true; tip('표에 적었어요. 구멍이나 높이 중 하나만 바꾸어 비교해 봐요.'); };
  for (const [k, set] of [['hole', (v) => { hole = v; }], ['height', (v) => { height = v; }]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => { b.onclick = () => { set(Number(b.dataset[k])); choose(); }; });
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive()) || !running) return; t += dt; show(Math.min(1, t / DUR), t); if (t >= DUR) finish(); };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountSplash2D(el, opts = {}) { return mountSplash(el, { ...opts, force2D: true }); }
