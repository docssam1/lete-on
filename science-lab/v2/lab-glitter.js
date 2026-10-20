// 감염병과 건강한 생활 실험실 — 반짝이 가루 손 모형. 손 씻기 규칙을 고르고 「악수하기」로 한 차례씩 진행 → 반짝이가 묻은 친구를 세어 표에 적는다.
// 짝·규칙은 교재 종이 카드 활동과 같다(scenes/glitter-model.js). 반짝이는 병원체가 아니라 표식이고, 손 씻기 규칙은 학습용이다.
import { RULES, ROUNDS, FRIENDS, glitterModel } from '../scenes/glitter-model.js';
export { RULES, glitterModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SHORT = ['씻지 않음', 'B·D·F 씻기'];
const DUR = 2.6;   // 한 차례(씻기 → 악수)

export async function mountGlitter(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/glitter-hands.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let rule = 0, round = 0, running = false, t = 0, dead = false, timer = null, recorded = new Set();
  el.innerHTML = `<div class="modes" role="group" aria-label="손 씻기 규칙"><span class="lab-lbl">손 씻기</span>${SHORT.map((v, i) => `<button type="button" data-rule="${i}" title="${esc(RULES[i])}">${esc(v)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="반짝이 가루 손 모형 3D. 여섯 친구가 차례로 악수할 때 반짝이가 묻은 친구를 세어요."></canvas>'
      : `<div class="gl-2d" role="img" aria-label="여섯 친구 2D 모형">${FRIENDS.map((f, i) => `<span class="gl-kid" data-k="${f}" style="--i:${i}"><b>${f}</b></span>`).join('')}<em class="gl-round">처음</em></div>`}
      <p class="lab3d-tip" data-tip aria-live="polite">손 씻기 규칙을 고르고 「악수하기」를 눌러요.</p>
      <p class="lab-read gl-read" data-read><b data-rd>처음</b> · 반짝이가 묻은 친구 <b data-n>1명(A)</b></p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>악수하기 · 1차례</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="gl-note">짝: 1차례 A-B·C-D·E-F → 2차례 B-C·D-E·F-A → 3차례 C-D·E-F·A-B. 반짝이는 손으로 옮겨 가는 것을 보이게 하는 표시일 뿐 병원체가 아니에요. 「B·D·F 씻기」는 차례마다 악수 전에 B·D·F가 손을 씻는 학습용 규칙이에요.</p>
    <table class="lab-table"><thead><tr><th>손 씻기</th><th>차례</th><th>반짝이가 묻은 친구</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildGlitterRoom(); stage.root.add(model); stage.setView({ theta: 0, phi: 0.9, frame: [[-1.8, 0, -1.8], [1.8, 1.7, 1.8]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountGlitter(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.rule)}</td><td>${esc(r.round)}차례 뒤</td><td>${esc(r.result)}</td></tr>`).join(''); };
  const show = (rv, tt = 0) => {
    if (model) model.userData.set({ round: rv, rule, t: tt });
    else { const who = glitterModel(Math.floor(rv), rule).who; el.querySelectorAll('.gl-kid').forEach((k) => k.classList.toggle('on', who.includes(k.dataset.k))); $('.gl-round').textContent = rv >= 1 ? `${Math.floor(rv)}차례 뒤` : '처음'; }
  };
  const read = (r, known) => { $('[data-rd]').textContent = r ? `${r}차례 뒤` : '처음'; $('[data-n]').textContent = known ? glitterModel(r, rule).result : '?'; };
  const press = () => el.querySelectorAll('[data-rule]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.rule) === rule)));
  const btn = () => { run.textContent = round < 3 ? `악수하기 · ${round + 1}차례` : '세 차례 끝'; run.disabled = running || round >= 3; record.disabled = running || round === 0 || recorded.has(`${rule}-${round}`); };
  function reset() { clearInterval(timer); running = false; round = 0; t = 0; recorded = new Set(); show(0); read(0, true); press(); btn();
    tip(`${RULES[rule]}. A의 손에만 반짝이가 있어요. 「악수하기」로 1차례를 시작해요.`); }
  function done() { running = false; round += 1; show(round, t); read(round, true); btn();
    tip(round < 3 ? `${round}차례가 끝났어요. 반짝이가 묻은 친구를 세어 표에 적고 다음 차례로 가요.` : '세 차례가 끝났어요. 표에 적고, 손 씻기 규칙을 바꾸어 다시 해 봐요.'); }
  const step = (dt) => { t += dt; show(round + Math.min(1, t / DUR), t); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead || round >= 3) return; running = true; t = 0; btn(); read(round, false);
    tip(rule ? '악수하기 전에 B·D·F가 비누와 흐르는 물로 손을 씻어요. 그다음 짝끼리 악수해요.' : '짝끼리 악수해요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (running || dead || round === 0) return;
    const m = glitterModel(round, rule), i = rows.findIndex((r) => r.round === m.round && r.rule === m.rule);   // 같은 규칙·차례를 다시 재면 그 줄만 바꾼다
    if (i >= 0) rows[i] = m; else rows.push(m);
    rows.sort((a, b) => (a.rule === b.rule ? a.round - b.round : RULES.indexOf(a.rule) - RULES.indexOf(b.rule)));
    recorded.add(`${rule}-${round}`); btn(); drawRows(); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => reset();
  el.querySelectorAll('[data-rule]').forEach((b) => { b.onclick = () => { rule = Number(b.dataset.rule); reset(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) step(dt); else { t += dt; show(round, t); }
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  rule = opts.rule ? 1 : 0; reset(); drawRows(); return { rows, dispose };
}
export async function mountGlitter2D(el, opts = {}) { return mountGlitter(el, { ...opts, force2D: true }); }
