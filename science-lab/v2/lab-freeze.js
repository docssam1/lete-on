// 가상 실험실: 얼음 병 저울 — 물의 양을 고르고 얼리거나 녹여서, 높이(칸)와 무게(g)를 표에 적는다.
// 모델: 물이 얼면 부피가 약 1.1배로 늘어난다(높이 늘어남). 무게는 변하지 않는다. 병 무게 20 g, 물 1 mL = 1 g.
const BOTTLE_G = 20, GROW = 1.1;
export function freezeModel(ml, frozen) {
  const water = ml / 10;                                  // 물 높이(칸) — 10 mL = 1칸
  const height = Math.round((frozen ? water * GROW : water) * 10) / 10;
  return { height, mass: BOTTLE_G + ml };
}

const REDUCED = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtMass = (g) => g.toFixed(1);

// 3D 가상 실험실: 3D 장면과 같은 전자저울·페트병·소금 얼음 통. 물의 양을 고르면 병에 물이 차오르고,
// 얼리기를 누르면 병을 들어 얼음 통에 넣었다가(저울 0.0 g) 얼면 다시 저울에 올린다 — 높이는 처음 빨간 선보다 올라가고 무게는 그대로.
// 녹이기는 저울 위에서 그대로 녹는다. WebGL이 없으면 2D 실험실.
export async function mountFreeze(el, opts = {}) {
  let THREE, Stage, watchDetached, FB, KIT;
  try {
    [{ Stage, watchDetached }, THREE, FB, KIT] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/freeze-bottle.js'), import('../scenes/_kit.js')]);
    if (!Stage.canWebGL()) throw new Error('no webgl');
  } catch (_) { return mountFreeze2D(el, opts); }
  if (!el.isConnected) return mountFreeze2D(el, opts);
  const amounts = opts.amounts || [60, 100, 140], rows = opts.rows || [], onRecord = opts.onRecord;
  let ml = amounts[1] ?? amounts[0], frozen = false, busy = false;
  el.innerHTML = `
    <div class="modes" role="group" aria-label="물의 양"><span class="lab-lbl">물의 양</span>${amounts.map((a) => `<button type="button" data-ml="${a}" aria-pressed="${a === ml}">${a} mL</button>`).join('')}</div>
    <div class="lab3d">
      <canvas aria-label="얼음 병 저울 3D 실험. 물의 양을 고르고 얼리거나 녹여요. 끌어서 돌려 볼 수 있어요."></canvas>
      <div class="lab3d-read">
        <p class="lab-read"><span>상태</span><b data-r="state">물</b></p>
        <p class="lab-read"><span>높이</span><b data-r="h">0</b><small>칸</small></p>
        <p class="lab-read"><span>무게</span><b data-r="m">0</b><small>g</small></p>
      </div>
      <p class="lab3d-tip" data-r="tip">물의 양을 고르고 <b>얼리기</b>를 눌러요. 빨간 선이 처음 물 높이예요.</p>
      <div class="lab3d-btns">
        <button class="btn primary pour" data-act="toggle" type="button">얼리기</button>
        <button class="btn" data-act="record" type="button">표에 적기</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>상태</th><th>물의 양(mL)</th><th>높이(칸)</th><th>무게(g)</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), canvas = $('canvas'), tbody = $('tbody'), $t = $('[data-act=toggle]'), tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return mountFreeze2D(el, opts); }
  const { R, RW, PAN_Y, ICE } = FB.BOTTLE_DIM, KY0 = 0.22, KU = 0.075;        // 병 안 0칸 높이, 1칸 = 0.075(10 mL)
  const yOf = (kan) => KY0 + kan * KU;
  const WATER = new THREE.Color(0x7fb3d5), ICEC = new THREE.Color(ICE), c = new THREE.Color();
  const scale = FB.buildScale(); stage.root.add(scale);
  const beaker = FB.buildBeaker(); beaker.position.set(-1.75, 0, -0.95); stage.root.add(beaker);       // 물을 따르던 비커(소품)
  // 병 + 물 + 처음 선을 한 묶음으로 들고 옮긴다
  const carry = new THREE.Group(); carry.position.y = PAN_Y; stage.root.add(carry);
  carry.add(FB.buildBottle({ max: 16 }));
  const wMat = new THREE.MeshPhysicalMaterial({ color: WATER, transparent: true, opacity: 0.78, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
  const frostTex = FB.canvasTex(256, 256, (cx, w) => {
    const r = FB.rng(3); cx.clearRect(0, 0, w, w);
    for (let i = 0; i < 1400; i++) { cx.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.75})`; const s = 1 + r() * 3.5; cx.fillRect(r() * w, r() * w, s, s); }
    cx.strokeStyle = 'rgba(255,255,255,0.8)'; cx.lineWidth = 1.4;
    for (let i = 0; i < 26; i++) { let x = r() * w, y = r() * w; cx.beginPath(); cx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; cx.lineTo(x, y); } cx.stroke(); }
  }, { repeat: [5, 3] });
  const frostMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: frostTex, transparent: true, opacity: 0, roughness: 0.8, depthWrite: false });
  const wMesh = new THREE.Mesh(FB.waterGeo(yOf(ml / 10), 0), wMat); wMesh.renderOrder = 1;
  const frost = new THREE.Mesh(wMesh.geometry, frostMat); frost.scale.set(1.006, 1.002, 1.006); frost.renderOrder = 2;
  carry.add(wMesh, frost);
  let shownH = -1, shownK = -1;
  const setWater = (kan, k) => {                                   // kan: 물 높이(칸), k: 언 정도 0~1
    kan = Math.round(kan * 200) / 200; k = Math.round(k * 50) / 50;
    if (kan !== shownH || k !== shownK) { const g = FB.waterGeo(yOf(kan), k); wMesh.geometry.dispose(); wMesh.geometry = g; frost.geometry = g; shownH = kan; shownK = k; }
    wMat.color.copy(c.copy(WATER).lerp(ICEC, k)); wMat.roughness = 0.06 + 0.39 * k; wMat.opacity = 0.78 + 0.12 * k; wMat.clearcoat = 1 - 0.7 * k; frostMat.opacity = 0.7 * k;
  };
  const mark = new THREE.Mesh(new THREE.TorusGeometry(R + 0.008, 0.014, 8, 64), new THREE.MeshPhysicalMaterial({ color: 0xd8413c, roughness: 0.4, clearcoat: 0.6 }));
  mark.rotation.x = Math.PI / 2; carry.add(mark);
  const markLabel = KIT.label('처음 10칸', { size: 0.22, color: '#b3261e' }); carry.add(markLabel);
  const grow = KIT.arrow([0, 0, 0], [0, 1, 0], 0xd8413c, 0.028); grow.position.set(R + 0.28, 0, 0.12); grow.visible = false; carry.add(grow);
  // 얼음 통: 저울 옆 실험대 위
  const BATH = new THREE.Vector3(2.75, 0, -0.35);
  const bath = FB.buildBath(); bath.position.copy(BATH); stage.root.add(bath);
  const mist = KIT.puffCloud(KIT.particleBudget(canvas, 48), { color: 0xf1f7ff, opacity: 0.5, soft: 0.8 }); stage.root.add(mist);
  const puffs = [];
  stage.setView({ theta: 0.3, phi: 1.16, dist: 6.9, target: [1.2, 0.95, -0.1] });
  stage.fitWidth = 1.45;   // 세로로 긴 화면(가로로 크게·세로 들기)에서도 소품이 잘리지 않게
  stage.setContactShadow({ x: 1.1, z: -0.1, w: 7.5, d: 4.4 });

  // 상태·애니메이션
  const lcd = (g) => scale.userData.setLcd(fmtMass(g));
  let anim = null, shownMass = 20 + ml, massTarget = shownMass, t = 0;
  const placeMark = (kan) => { mark.position.y = yOf(kan); markLabel.position.set(-R - 0.62, yOf(kan), 0.35); KIT.relabel(markLabel, `처음 ${kan}칸`, { size: 0.22, color: '#b3261e' }); };
  function read() {
    const m = freezeModel(ml, frozen);
    $('[data-r=state]').textContent = frozen ? '얼음' : '물'; $('[data-r=h]').textContent = m.height; $('[data-r=m]').textContent = m.mass;
    $t.textContent = frozen ? '녹이기' : '얼리기';
    const d = m.height - ml / 10; grow.visible = frozen && d > 0;
    if (grow.visible) { grow.position.y = yOf(ml / 10); grow.setLength(d * KU + 0.1); }
  }
  // 물의 양 바꾸기: 병 속 물이 새 높이로 차오르고(빠지고) 저울 숫자가 따라간다
  function setAmount(next) {
    const from = frozen ? freezeModel(ml, true).height : ml / 10; ml = next; frozen = false; placeMark(ml / 10);
    anim = { kind: 'pour', t: 0, dur: 0.9, from, to: ml / 10 }; massTarget = 20 + ml; read();
    tip(`물 ${ml} mL를 담았어요. 빨간 선(처음 ${ml / 10}칸)을 기억해요. <b>얼리기</b>를 눌러 봐요.`);
  }
  const spawnMist = (p) => {
    for (let i = puffs.length; i < mist.userData.max && Math.random() < 0.6; i = puffs.length) {
      const a = Math.random() * Math.PI * 2, r = 0.9 + Math.random() * 0.35;
      puffs.push({ x: BATH.x + Math.cos(a) * r, y: 0.98, z: BATH.z + Math.sin(a) * r, vx: Math.cos(a) * 0.12, vz: Math.sin(a) * 0.12, life: 0, max: 2.2 + Math.random() * 1.6, s: 0.35 + Math.random() * 0.3 });
      if (!p) break;
    }
  };
  const PAN = new THREE.Vector3(0, PAN_Y, 0), IN_BATH = new THREE.Vector3(BATH.x, 0.12, BATH.z);
  const arc = (a, b, p, lift) => carry.position.lerpVectors(a, b, p).setY(a.y + (b.y - a.y) * p + Math.sin(Math.PI * p) * lift);
  function toggle() {
    if (busy) return;
    const reduce = REDUCED(); busy = !reduce;
    if (!frozen) {
      tip('병을 들어 <b>소금 섞은 얼음</b>에 넣어요. 저울은 0 g이 돼요.');
      anim = reduce ? null : { kind: 'freeze', t: 0 };
      if (reduce) { frozen = true; setWater(freezeModel(ml, true).height, 1); massTarget = shownMass = 20 + ml; lcd(shownMass); read(); doneMsg(); }
    } else {
      tip('저울 위에서 얼음이 <b>녹아요</b>. 무게를 지켜봐요.');
      anim = reduce ? null : { kind: 'melt', t: 0 };
      if (reduce) { frozen = false; setWater(ml / 10, 0); read(); doneMsg(); }
    }
  }
  function doneMsg() {
    const m = freezeModel(ml, frozen);
    tip(frozen ? `얼음이 되니 높이가 <b>${m.height}칸</b> — 처음 선(${ml / 10}칸)보다 올라갔어요. 무게는 그대로 <b>${m.mass} g</b>.`
      : `녹으니 다시 <b>${m.height}칸</b>, 처음 선으로 돌아왔어요. 무게는 <b>${m.mass} g</b> 그대로예요.`);
  }
  const E = KIT.ease.io;
  stage.update = (dt) => {
    if (opts.isActive && !opts.isActive()) return;
    t += dt;
    if (anim) {
      anim.t += dt; const a = anim;
      if (a.kind === 'pour') { const p = Math.min(1, a.t / a.dur); setWater(a.from + (a.to - a.from) * E(p), 0); if (p >= 1) { anim = null; busy = false; } }
      else if (a.kind === 'freeze') {
        // 0~0.9 저울 → 얼음 통 · 0.9~3.1 얼기 · 3.1~4.0 다시 저울
        if (a.t < 0.9) { arc(PAN, IN_BATH, E(a.t / 0.9), 0.9); massTarget = 0; }
        else if (a.t < 3.1) { carry.position.copy(IN_BATH); const p = E((a.t - 0.9) / 2.2); setWater(ml / 10 + (freezeModel(ml, true).height - ml / 10) * p, p); spawnMist(true); }
        else if (a.t < 4.0) { arc(IN_BATH, PAN, E((a.t - 3.1) / 0.9), 0.9); }
        else { carry.position.copy(PAN); anim = null; busy = false; frozen = true; massTarget = 20 + ml; read(); doneMsg(); }
      } else if (a.kind === 'melt') {
        const p = Math.min(1, a.t / 2.4), e = E(p); setWater(freezeModel(ml, true).height + (ml / 10 - freezeModel(ml, true).height) * e, 1 - e);
        if (p >= 1) { anim = null; busy = false; frozen = false; read(); doneMsg(); }
      }
    }
    // 저울 숫자: 올려놓으면 잠깐 흔들리다 멈춘다(실제 저울처럼)
    const d = massTarget - shownMass; shownMass = Math.abs(d) < 0.05 ? massTarget : shownMass + d * Math.min(1, dt * 7);
    lcd(Math.max(0, shownMass));
    // 냉기: 통 가장자리에서 넘쳐 바닥으로 가라앉으며 퍼진다(차가운 공기는 무겁다)
    let k = 0;
    for (let i = puffs.length - 1; i >= 0; i--) { const q = puffs[i]; q.life += dt; if (q.life > q.max) { puffs.splice(i, 1); continue; }
      q.x += q.vx * dt; q.z += q.vz * dt; q.y = Math.max(0.05, q.y - dt * 0.28); }
    for (const q of puffs) { const f = q.life / q.max; mist.userData.set(k++, q.x, q.y, q.z, q.s * (1 + f * 1.6), Math.sin(Math.PI * f) * 0.55); }
    mist.userData.commit(k);
  };
  el.querySelectorAll('[data-ml]').forEach((b) => b.addEventListener('click', () => {
    if (busy) return; el.querySelectorAll('[data-ml]').forEach((x) => x.setAttribute('aria-pressed', x === b)); setAmount(+b.dataset.ml);
  }));
  $t.addEventListener('click', toggle);
  function renderRows() {
    tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.state}</td><td>${r.ml}</td><td>${r.height}</td><td>${r.mass}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">아직 기록이 없어요.</td></tr>';
  }
  $('[data-act=record]').addEventListener('click', () => {
    if (busy) { tip('움직임이 끝난 뒤에 적어요.'); return; }
    const m = freezeModel(ml, frozen), row = { state: frozen ? '얼음' : '물', ml, height: m.height, mass: m.mass };
    if (!rows.some((r) => r.state === row.state && r.ml === row.ml)) rows.push(row);
    renderRows(); onRecord?.(rows); tip(`적었어요! ${frozen ? '녹이거나 물의 양을 바꿔' : '얼려서'} 한 번 더 재 봐요.`);
  });
  placeMark(ml / 10); setWater(ml / 10, 0); lcd(shownMass); read(); renderRows();
  const dispose = watchDetached(el, () => stage.dispose());
  return { rows, pause() {}, dispose };
}

// WebGL이 없는 기기: 옆모습 그림으로 하는 실험실(같은 모델·같은 표)
function mountFreeze2D(el, { amounts = [60, 100, 140], onRecord, rows = [] } = {}) {
  let ml = amounts[1], frozen = false, busy = false;
  el.innerHTML = `
    <div class="modes" role="group" aria-label="물의 양">${amounts.map((a) => `<button type="button" data-ml="${a}" aria-pressed="${a === ml}">${a} mL</button>`).join('')}</div>
    <div class="lab">
      <svg class="lab-svg" viewBox="0 0 220 300" role="img" aria-label="눈금이 있는 병과 저울"></svg>
      <div class="lab-side">
        <p class="lab-read"><span>상태</span><b data-r="state">물</b></p>
        <p class="lab-read"><span>높이</span><b data-r="h">0</b><small>칸</small></p>
        <p class="lab-read"><span>무게</span><b data-r="m">0</b><small>g</small></p>
        <button class="btn primary" data-act="toggle" type="button">얼리기</button>
        <button class="btn" data-act="record" type="button" style="margin-top:6px">표에 적기</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>상태</th><th>물의 양(mL)</th><th>높이(칸)</th><th>무게(g)</th></tr></thead><tbody></tbody></table>`;
  const svg = el.querySelector('svg'), tbody = el.querySelector('tbody'), $t = el.querySelector('[data-act=toggle]');
  const X = 70, W = 80, BASE = 236, UNIT = 11;              // 병 안쪽 x, 폭, 바닥 y, 1칸 = 11px

  function draw(h, t) {                                    // t: 0 물 ~ 1 얼음 (색 섞기)
    const top = BASE - h * UNIT, mark = BASE - (ml / 10) * UNIT;
    const ticks = Array.from({ length: 17 }, (_, i) => `<line x1="${X - 10}" x2="${X - (i % 5 ? 4 : 1)}" y1="${BASE - i * UNIT}" y2="${BASE - i * UNIT}" stroke="#5B6577" stroke-width="1.5"/>${i % 5 ? '' : `<text x="${X - 14}" y="${BASE - i * UNIT + 4}" font-size="10" text-anchor="end" fill="#5B6577">${i}</text>`}`).join('');
    const water = `rgb(${Math.round(127 + (214 - 127) * t)},${Math.round(179 + (234 - 179) * t)},${Math.round(213 + (247 - 213) * t)})`;
    svg.innerHTML = `${ticks}
      <rect x="${X}" y="${top}" width="${W}" height="${BASE - top}" fill="${water}"/>
      ${t > 0.5 ? `<path d="M${X + 12} ${top + 10}l10 8M${X + 44} ${top + 24}l8 -6M${X + 28} ${top + 48}l12 4" stroke="#fff" stroke-width="2" opacity=".8"/>` : ''}
      <line x1="${X - 4}" x2="${X + W + 4}" y1="${mark}" y2="${mark}" stroke="#E23B2E" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="${X + W + 6}" y="${mark + 4}" font-size="10" fill="#E23B2E">처음</text>
      <path d="M${X} 50 V${BASE} H${X + W} V50" fill="none" stroke="#1E3A78" stroke-width="3"/>
      <rect x="${X + 24}" y="36" width="${W - 48}" height="16" rx="3" fill="#1E3A78"/>
      <rect x="30" y="${BASE + 4}" width="160" height="16" rx="4" fill="#9aa3ad"/>
      <rect x="44" y="${BASE + 20}" width="132" height="30" rx="6" fill="#262B36"/>
      <text x="110" y="${BASE + 41}" font-size="16" font-weight="700" text-anchor="middle" fill="#7CFFB2">${freezeModel(ml, frozen).mass} g</text>`;
  }
  function read() {
    const m = freezeModel(ml, frozen);
    el.querySelector('[data-r=state]').textContent = frozen ? '얼음' : '물';
    el.querySelector('[data-r=h]').textContent = m.height;
    el.querySelector('[data-r=m]').textContent = m.mass;
    $t.textContent = frozen ? '녹이기' : '얼리기';
  }
  function animate(to) {
    const h0 = freezeModel(ml, !to).height, h1 = freezeModel(ml, to).height, t0 = performance.now(), D = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1400;
    busy = true;
    const step = (now) => { const p = D ? Math.min(1, (now - t0) / D) : 1; draw(h0 + (h1 - h0) * p, to ? p : 1 - p);
      if (p < 1) requestAnimationFrame(step); else { busy = false; frozen = to; read(); draw(h1, to ? 1 : 0); } };
    requestAnimationFrame(step);
  }
  el.querySelectorAll('[data-ml]').forEach((b) => b.addEventListener('click', () => {
    if (busy) return; ml = +b.dataset.ml; frozen = false;
    el.querySelectorAll('[data-ml]').forEach((x) => x.setAttribute('aria-pressed', x === b)); read(); draw(freezeModel(ml, false).height, 0);
  }));
  $t.addEventListener('click', () => { if (!busy) animate(!frozen); });
  function renderRows() {
    tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.state}</td><td>${r.ml}</td><td>${r.height}</td><td>${r.mass}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">아직 기록이 없어요.</td></tr>';
  }
  el.querySelector('[data-act=record]').addEventListener('click', () => {
    if (busy) return; const m = freezeModel(ml, frozen);
    const row = { state: frozen ? '얼음' : '물', ml, height: m.height, mass: m.mass };
    if (!rows.some((r) => r.state === row.state && r.ml === row.ml)) rows.push(row);
    renderRows(); onRecord?.(rows);
  });
  read(); draw(freezeModel(ml, false).height, 0); renderRows();
  return { rows };
}
