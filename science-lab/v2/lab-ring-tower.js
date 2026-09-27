// 가상 실험실: 고리 자석 탑 — 고리를 눌러 뒤집고, 탑 높이·떠 있는 층을 기록한다.
// 모델(3D 장면과 같음): 이웃한 두 고리의 윗면 극이 서로 다르면 마주 보는 면이 같은 극 → 밀어 내서 뜬다.
// 뜨는 간격은 위에 얹힌 고리가 많을수록 좁아진다(아래쪽 간격이 가장 좁다).

const RING_H = 1;            // 고리 두께 = 1칸
const GAP = 1.1;             // 위에 고리가 하나뿐일 때 뜨는 간격(칸)

export function towerModel(ups) {
  const n = ups.length, y = [0];
  let floating = 0;
  for (let i = 1; i < n; i++) {
    const repel = ups[i - 1] !== ups[i];
    const load = n - i; // 이 틈 위에 얹힌 고리 수
    const gap = repel ? GAP / (1 + 0.45 * (load - 1)) : 0;
    if (repel) floating++;
    y.push(y[i - 1] + RING_H + gap);
  }
  const height = Math.round((y[n - 1] + RING_H) * 10) / 10;
  return { y, floating, height };
}

const RING_COLORS = [0x3b6fd1, 0xf0b429, 0x3fae5b, 0xe0743a, 0x8e5bd1];
const shapeOf = (ups) => ups.map((u) => u + '위').join(' · ');
const REDUCED = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// 3D 가상 실험실: 3D 장면과 같은 교구(나무 받침·HB 연필·세라믹 고리 자석)를 손으로 뒤집는다.
// 고리를 누르면(또는 아래 번호 단추) 반 바퀴 뒤집히고, 이웃 고리들이 자석 힘을 따라 스프링처럼 튀며 새 자리로 간다.
// 옆에 선 눈금자(1칸 = 고리 두께)로 탑 높이를 직접 읽는다. WebGL이 없으면 2D 실험실.
export async function mountRingTower(el, opts = {}) {
  let THREE, Stage, watchDetached, TW, KIT;
  try {
    [{ Stage, watchDetached }, THREE, TW, KIT] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/ring-tower.js'), import('../scenes/_kit.js')]);
    if (!Stage.canWebGL()) throw new Error('no webgl');
  } catch (_) { return mountRingTower2D(el, opts); }
  if (!el.isConnected) return mountRingTower2D(el, opts);
  const n = Math.max(2, Math.min(5, opts.rings || 4)), rows = opts.rows || [], onRecord = opts.onRecord;
  const ups = Array.from({ length: n }, (_, i) => (i % 3 === 0 ? 'N' : 'S'));
  const hex = (c) => '#' + c.toString(16).padStart(6, '0');
  el.innerHTML = `
    <div class="lab3d">
      <canvas aria-label="고리 자석 탑 3D 실험. 고리를 누르면 뒤집혀요. 끌어서 돌려 볼 수 있어요."></canvas>
      <div class="lab3d-read">
        <p class="lab-read"><span>떠 있는 층</span><b data-r="floating">0</b><small>곳</small></p>
        <p class="lab-read"><span>탑 높이</span><b data-r="height">0</b><small>칸</small></p>
        <p class="lab-read"><span>윗면 극(아래→위)</span><b data-r="shape" class="rt-shape"></b></p>
      </div>
      <p class="lab3d-tip" data-r="tip">고리를 눌러 <b>뒤집어</b> 보세요. 마주 보는 면이 <b>같은 극</b>이면 떠요.</p>
      <div class="lab3d-btns">
        <div class="rt-flips" role="group" aria-label="고리 뒤집기(아래에서부터)">${Array.from({ length: n }, (_, i) => `<button class="btn rt-flip" type="button" data-flip="${i}" aria-label="아래에서 ${i + 1}번째 고리 뒤집기"><i style="background:${hex(RING_COLORS[i])}"></i>${i + 1}번 ↻</button>`).join('')}</div>
        <button class="btn primary" data-act="record" type="button">표에 적기</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>쌓은 모양(아래→위)</th><th>떠 있는 층</th><th>탑 높이(칸)</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), canvas = $('canvas'), tbody = $('tbody'), tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return mountRingTower2D(el, opts); }
  const { T, VIEW_TH } = TW.TOWER, BASE_Y = 0.3, KAN = T;       // 1칸 = 고리 두께(월드 0.28)
  const parts = TW.towerParts(RING_COLORS.slice(0, n)), root = stage.root;
  root.add(parts.base, parts.rod);
  parts.ruler.position.set(1.75, 0.018, -1.35); parts.ruler.rotation.y = -0.35; root.add(parts.ruler);
  // 고리마다 가운데를 축으로 뒤집히도록 받침대(pivot)에 끼운다.
  const holders = parts.rings.map((r, i) => {
    const h = new THREE.Group(); r.position.y = -T / 2; h.add(r); root.add(h);
    r.userData.top.visible = r.userData.bot.visible = true; parts.setUp(r, ups[i]);
    for (const f of [r.userData.top, r.userData.bot]) f.userData.badge.scale.setScalar(0.21);   // 틈이 좁아도 위아래 표가 겹치지 않게
    r.traverse((o) => { if (o.isMesh) o.userData.ring = i; });
    return h;
  });
  parts.rings[0].userData.bot.userData.badge.visible = false;       // 받침에 닿은 면·맨 위 면은 마주 보는 짝이 없다
  parts.rings[n - 1].userData.top.userData.badge.visible = false;
  // 세운 눈금자: 0칸 = 받침 윗면, 1칸마다 굵은 눈금과 숫자, 반 칸마다 가는 눈금
  const MAXK = n <= 4 ? 8 : 9, GH = MAXK * KAN;
  const right = new THREE.Vector3(Math.cos(VIEW_TH), 0, -Math.sin(VIEW_TH)), front = new THREE.Vector3(Math.sin(VIEW_TH), 0, Math.cos(VIEW_TH));
  const gauge = new THREE.Group(); gauge.position.copy(right).multiplyScalar(-1.75).addScaledVector(front, 0.1); gauge.rotation.y = VIEW_TH; root.add(gauge);
  {
    const W = 256, H = Math.round(W * (GH + 0.16) / 0.34), cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    g.fillStyle = '#f7f3e8'; g.fillRect(0, 0, W, H);
    const yPx = (k) => H - (0.08 + k * KAN) / (GH + 0.16) * H;
    g.fillStyle = '#1f2a37'; g.font = '800 64px "Pretendard Variable", Pretendard, sans-serif'; g.textAlign = 'right'; g.textBaseline = 'middle';
    for (let k = 0; k <= MAXK * 2; k++) { const y = yPx(k / 2), major = k % 2 === 0; g.fillRect(0, y - (major ? 4 : 2), major ? 110 : 64, major ? 8 : 4); if (major) g.fillText(String(k / 2), W - 26, y); }
    g.fillStyle = '#c94f4f'; g.fillRect(0, yPx(0) - 5, W, 10);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const side = new THREE.MeshPhysicalMaterial({ color: 0xe9e1cc, roughness: 0.5, clearcoat: 0.4 });
    const face = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, GH + 0.16, 0.05), [side, side, side, side, face, side]);
    bar.position.y = BASE_Y - 0.08 + (GH + 0.16) / 2; bar.castShadow = bar.receiveShadow = true; gauge.add(bar);
    const foot = new THREE.Mesh(KIT.roundedBoxGeometry(0.62, BASE_Y - 0.02, 0.4, 0.05, 3), new THREE.MeshPhysicalMaterial({ color: 0x3e4a5c, roughness: 0.45, clearcoat: 0.6 }));
    foot.position.set(0, (BASE_Y - 0.02) / 2, -0.12); foot.castShadow = foot.receiveShadow = true; gauge.add(foot);
  }
  // 높이 표시: 탑 꼭대기에서 눈금자까지 가는 빨간 선 + 눈금자 위 빨간 집게 + 라벨
  const redM = new THREE.MeshPhysicalMaterial({ color: 0xd8413c, roughness: 0.35, clearcoat: 0.7 });
  const clip = new THREE.Mesh(KIT.roundedBoxGeometry(0.44, 0.05, 0.11, 0.02, 2), redM); clip.castShadow = true; gauge.add(clip);
  const L = gauge.position.length(), len = L - TW.TOWER.R_OUT - 0.2;   // 고리 바깥 가장자리 → 눈금자 앞
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, len, 8), new THREE.MeshBasicMaterial({ color: 0xd8413c, transparent: true, opacity: 0.6, depthWrite: false }));
  line.rotation.z = Math.PI / 2; line.position.x = TW.TOWER.R_OUT + len / 2;
  const lineG = new THREE.Group(); lineG.add(line); lineG.rotation.y = Math.atan2(-gauge.position.z, gauge.position.x); root.add(lineG);   // +x 축이 눈금자를 향하게
  const hLabel = KIT.label('탑 높이 0칸', { size: 0.26 }); root.add(hLabel);
  stage.setView({ theta: 0.5, phi: 1.28, dist: 6.6, target: [-0.3, 1.5, 0] });   // 옆에 가깝게 — 뜬 틈이 잘 보이게
  stage.fitWidth = 1.1;   // 세로로 긴 화면(가로로 크게·세로 들기)에서도 소품이 잘리지 않게
  stage.setContactShadow({ x: -0.3, z: 0.2, w: 4.6, d: 4.0 });

  // 상태: 고리마다 현재 높이·속도, 뒤집기 진행
  const st = holders.map(() => ({ y: 5, v: 0, flip: -1 }));
  let model = towerModel(ups), shown = null;
  const target = (i) => BASE_Y + model.y[i] * KAN + T / 2;          // 고리 가운데 높이
  const read = () => {
    $('[data-r=floating]').textContent = model.floating; $('[data-r=height]').textContent = model.height;
    $('[data-r=shape]').textContent = ups.join(' ');
    const top = BASE_Y + model.height * KAN;
    clip.position.y = top; lineG.position.y = top; hLabel.position.copy(gauge.position).setY(top + 0.32);
    KIT.relabel(hLabel, `탑 높이 ${model.height}칸`, { size: 0.26 });
  };
  holders.forEach((h, i) => { st[i].y = REDUCED() ? target(i) : target(i) + 2.4 + i * 0.5; h.position.y = st[i].y; });   // 처음엔 위에서 차례로 끼워진다
  read();
  const flip = (i) => {
    if (st[i].flip >= 0) return;
    if (REDUCED()) { ups[i] = ups[i] === 'N' ? 'S' : 'N'; parts.setUp(parts.rings[i], ups[i]); settle(i); return; }
    st[i].flip = 0;
  };
  function settle(i) {
    model = towerModel(ups); read();
    const touching = (a) => ups[a] === ups[a + 1];
    const below = i > 0 ? (touching(i - 1) ? '붙었어요' : '떴어요') : '', above = i < n - 1 ? (touching(i) ? '붙었어요' : '떴어요') : '';
    tip(`${i + 1}번 고리를 뒤집었어요 → 윗면이 <b>${ups[i]}극</b>. ${below ? `아래 고리와 <b>${below}</b>` : ''}${below && above ? ', ' : ''}${above ? `위 고리와 <b>${above}</b>` : ''}.`);
  }
  const touchGap = 0.06;
  stage.update = (dt, t) => {
    if (opts.isActive && !opts.isActive()) return;
    const reduce = REDUCED();
    for (let i = 0; i < n; i++) {
      const s = st[i], h = holders[i];
      if (s.flip >= 0) {                                            // 반 바퀴: 살짝 들렸다가 뒤집혀 내려앉는다
        s.flip = Math.min(1, s.flip + dt / 0.6); const e = KIT.ease.io(s.flip);
        h.rotation.x = Math.PI * e; h.position.y = s.y + Math.sin(Math.PI * s.flip) * 0.32;
        if (s.flip >= 1) { s.flip = -1; h.rotation.x = 0; ups[i] = ups[i] === 'N' ? 'S' : 'N'; parts.setUp(parts.rings[i], ups[i]); settle(i); }
        continue;
      }
      let goal = target(i); const floating = i > 0 && ups[i - 1] !== ups[i];
      if (floating && !reduce) goal += Math.sin(t * 2.3 + i * 1.7) * 0.006;   // 자석 위에 뜬 고리는 아주 살짝 흔들린다
      if (reduce) { s.y = goal; s.v = 0; }
      else { const a = 95 * (goal - s.y) - 10 * s.v; s.v += a * Math.min(dt, 1 / 30); s.y += s.v * Math.min(dt, 1 / 30); }
      // 아래 고리를 뚫고 내려가지 않게(붙는 쪽은 딱 맞닿는다)
      if (i > 0 && s.y < holders[i - 1].position.y + T) { s.y = holders[i - 1].position.y + T; s.v = Math.max(0, s.v); }
      if (i === 0 && s.y < BASE_Y + T / 2) { s.y = BASE_Y + T / 2; s.v = 0; }
      h.position.y = s.y;
    }
    parts.rings.forEach((r, i) => {                                  // 붙어 있는 두 면의 원형 표가 겹치지 않게 좌우로 벌린다
      const a = holders[i + 1], b = holders[i - 1], y = holders[i].position.y;
      parts.placeBadge(r.userData.top, a && Math.abs(a.position.y - y - T) < touchGap ? -1 : 0);
      parts.placeBadge(r.userData.bot, b && Math.abs(y - b.position.y - T) < touchGap ? 1 : 0);
    });
  };
  // 고리 누르기 → 뒤집기(끌어서 돌린 것과 구별)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  const pickables = []; holders.forEach((h) => h.traverse((o) => { if (o.isMesh && o.userData.ring != null) pickables.push(o); }));
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8 || performance.now() - down.t > 450) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera); const hit = ray.intersectObjects(pickables, false)[0];
    if (hit) flip(hit.object.userData.ring);
  });
  el.querySelectorAll('[data-flip]').forEach((b) => b.addEventListener('click', () => flip(+b.dataset.flip)));
  function renderRows() {
    tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.shape}</td><td>${r.floating}</td><td>${r.height}</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">아직 기록이 없어요.</td></tr>';
  }
  $('[data-act=record]').addEventListener('click', () => {
    if (st.some((s) => s.flip >= 0)) { tip('고리가 다 내려앉은 뒤에 적어요.'); return; }
    const m = towerModel(ups), row = { shape: shapeOf(ups), floating: m.floating, height: m.height };
    if (!rows.some((r) => r.shape === row.shape)) rows.push(row);
    renderRows(); onRecord?.(rows); tip(`적었어요! 탑 높이 <b>${m.height}칸</b>. 고리를 뒤집어 더 높은(낮은) 탑도 만들어 봐요.`);
  });
  renderRows();
  const dispose = watchDetached(el, () => stage.dispose());
  return { rows, pause() {}, dispose };
}

// WebGL이 없는 기기: 옆모습 그림으로 하는 실험실(같은 모델·같은 표)
function mountRingTower2D(el, { rings = 4, onRecord, rows = [] } = {}) {
  const ups = Array.from({ length: rings }, (_, i) => (i % 3 === 0 ? 'N' : 'S'));
  const colors = ['#3b6fd1', '#f0b429', '#3fae5b', '#e0743a', '#8e5bd1'];
  el.innerHTML = `
    <div class="lab">
      <svg class="lab-svg" viewBox="0 0 220 300" role="img" aria-label="고리 자석 탑. 고리를 누르면 뒤집혀요."></svg>
      <div class="lab-side">
        <p class="lab-read"><span>떠 있는 층</span><b data-r="floating">0</b></p>
        <p class="lab-read"><span>탑 높이</span><b data-r="height">0</b><small>칸</small></p>
        <p class="lab-tip">고리를 누르면 뒤집혀요.</p>
        <button class="btn" data-act="record" type="button">표에 적기</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>쌓은 모양(아래→위)</th><th>떠 있는 층</th><th>탑 높이(칸)</th></tr></thead><tbody></tbody></table>`;
  const svg = el.querySelector('svg'), tbody = el.querySelector('tbody');
  const SCALE = 26, BASE_Y = 270, W = 150, CX = 110;

  function draw() {
    const m = towerModel(ups);
    const parts = [`<rect x="${CX - 70}" y="${BASE_Y}" width="140" height="14" rx="4" fill="#9aa3ad"/>`,
      `<rect x="${CX - 5}" y="30" width="10" height="${BASE_Y - 30}" rx="4" fill="#b08b5a"/>`];
    ups.forEach((u, i) => {
      const top = BASE_Y - (m.y[i] + RING_H) * SCALE, h = RING_H * SCALE;
      const topC = u === 'N' ? '#E24B4A' : '#3A6BC6', botC = u === 'N' ? '#3A6BC6' : '#E24B4A';
      parts.push(`<g class="ring" data-i="${i}" tabindex="0" role="button" aria-label="${i + 1}번째 고리, 윗면 ${u}극. 눌러서 뒤집기">
        <rect x="${CX - W / 2}" y="${top}" width="${W}" height="${h}" rx="6" fill="${colors[i]}"/>
        <rect x="${CX - W / 2 + 4}" y="${top}" width="${W - 8}" height="4" rx="2" fill="${topC}"/>
        <rect x="${CX - W / 2 + 4}" y="${top + h - 4}" width="${W - 8}" height="4" rx="2" fill="${botC}"/>
        <text x="${CX - W / 2 + 12}" y="${top + h / 2 + 5}" font-size="13" font-weight="700" fill="#fff">${u}</text>
        <text x="${CX + W / 2 - 14}" y="${top + h / 2 + 5}" font-size="12" fill="#fff" text-anchor="end">↻</text></g>`);
    });
    svg.innerHTML = parts.join('');
    el.querySelector('[data-r=floating]').textContent = m.floating;
    el.querySelector('[data-r=height]').textContent = m.height;
    svg.querySelectorAll('.ring').forEach((g) => {
      const flip = () => { const i = +g.dataset.i; ups[i] = ups[i] === 'N' ? 'S' : 'N'; draw(); };
      g.addEventListener('click', flip);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    });
    return m;
  }
  function renderRows() {
    tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.shape}</td><td>${r.floating}</td><td>${r.height}</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">아직 기록이 없어요.</td></tr>';
  }
  el.querySelector('[data-act=record]').addEventListener('click', () => {
    const m = towerModel(ups);
    const row = { shape: shapeOf(ups), floating: m.floating, height: m.height };
    if (!rows.some((r) => r.shape === row.shape)) rows.push(row);
    renderRows(); onRecord?.(rows);
  });
  draw(); renderRows();
  return { rows };
}
