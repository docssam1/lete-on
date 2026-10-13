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

const shapeOf = (ups) => ups.map((u) => u + '위').join(' · ');
const upsOf = (shape) => String(shape || '').split('·').map((s) => s.trim()[0]).filter((c) => c === 'N' || c === 'S');
const REDUCED = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const floatPairs = (ups) => ups.slice(1).map((u, i) => (ups[i] !== u ? i : -1)).filter((i) => i >= 0);   // 뜬 틈(i = i번째와 i+1번째 고리 사이)

// 3D 가상 실험실(2026-10-13 재설계 — 원장 승인안): 실제 교구처럼 검은 페라이트 고리 · 번호 스티커.
// 흐름: ① 예상 — 모두 붙은 탑에서 시작, 고리를 고르면 「뒤집으면 어디가 뜰까?」(처음 한 번)
//       ② 조작 — 위 고리를 빼 두고, 고른 고리를 연필 위로 빼서 반 바퀴 돌린 뒤 다시 끼운다. 내려앉으면 바뀐 틈을 가까이 본다.
//       ③ 확인 — 「표에 적기」를 눌러야 잰 값·자·마주 보는 극(고른 한 쌍만)이 나온다. 다시 뒤집으면 또 가린다. 두 줄 이상 적으면 두 탑을 나란히.
// 배틀(mode: 'battle')은 예전 대결 규칙 그대로: 섞인 탑에서 시작, 한 번 누르면 뒤집기(1초), 잰 값은 늘 보인다.
// 높이·간격은 towerModel의 교육용 규칙값이다(자기력을 계산하는 물리 엔진이 아니다). WebGL이 없으면 2D 실험실.
export async function mountRingTower(el, opts = {}) {
  let THREE, Stage, watchDetached, TW, KIT;
  try {
    [{ Stage, watchDetached }, THREE, TW, KIT] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/ring-tower.js'), import('../scenes/_kit.js')]);
    if (!Stage.canWebGL()) throw new Error('no webgl');
  } catch (_) { return mountRingTower2D(el, opts); }
  if (!el.isConnected) return mountRingTower2D(el, opts);
  const n = Math.max(2, Math.min(5, opts.rings || 4)), rows = opts.rows || [], onRecord = opts.onRecord, battle = opts.mode === 'battle';
  const ups = Array.from({ length: n }, (_, i) => (battle && i % 3 !== 0 ? 'S' : 'N'));   // 배틀은 예전처럼 섞인 탑(N S S N), 그 밖에는 모두 붙은 탑
  el.innerHTML = `
    <div class="lab3d lab3d--ring-tower${battle ? ' is-battle' : ''}" data-phase="${battle ? 'battle' : 'start'}">
      <canvas aria-label="고리 자석 탑 3D 실험. 고리를 누르면 뒤집혀요. 끌어서 돌려 볼 수 있어요."></canvas>
      <div class="lab3d-read">
        <p class="lab-read rt-val"><span>떠 있는 층</span><b data-r="floating">?</b><small>곳</small></p>
        <p class="lab-read rt-val"><span>탑 높이</span><b data-r="height">?</b><small>칸</small></p>
        <button class="lab-read rt-inspect" data-act="inspect-pair" type="button" hidden><span data-r="pair">1·2번 사이의 극 ↻</span><b data-r="facing">N ↔ N</b><small>윗면 <span data-r="shape" class="rt-shape"></span></small></button>
      </div>
      <p class="lab3d-tip" data-r="tip"></p>
      <div class="rt-card" data-r="card" hidden></div>
      <div class="lab3d-btns">
        <div class="rt-flips" role="group" aria-label="고리 고르기·뒤집기(아래에서부터)">${Array.from({ length: n }, (_, i) => `<button class="btn rt-flip" type="button" data-flip="${i}" aria-label="아래에서 ${i + 1}번째 고리 ${battle ? '뒤집기' : '고르기·뒤집기'}">${i + 1}번 ↻</button>`).join('')}</div>
        <button class="btn primary" data-act="record" type="button"${battle ? '' : ' disabled'}>표에 적기</button>
        <button class="btn" data-act="compare" type="button" hidden>두 탑 비교</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>쌓은 모양(아래→위)</th><th>떠 있는 층</th><th>탑 높이(칸)</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), host = $('.lab3d'), canvas = $('canvas'), tbody = $('tbody'), card = $('[data-r=card]'), recBtn = $('[data-act=record]'), cmpBtn = $('[data-act=compare]');
  const tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return mountRingTower2D(el, opts); }
  const { T, VIEW_TH, R_OUT } = TW.TOWER, BASE_Y = 0.3, KAN = T;       // 1칸 = 고리 두께(월드 0.28)
  const right = new THREE.Vector3(Math.cos(VIEW_TH), 0, -Math.sin(VIEW_TH)), front = new THREE.Vector3(Math.sin(VIEW_TH), 0, Math.cos(VIEW_TH));
  const parts = TW.towerParts(n), root = stage.root, live = new THREE.Group(); root.add(live);
  // 연필은 실험실에서만 받침 속으로 더 박는다 — 가장 높은 탑(6.4칸 ≈ 2.1)보다 조금 높으면 충분하고, 그래야 카메라가 탑에 가까이 간다.
  const PEN = 2.55, sink = Math.max(0, TW.TOWER.PEN_TOP - PEN); parts.rod.position.y = -sink;
  live.add(parts.base, parts.rod);
  // 고리마다 가운데를 축으로 뒤집히도록 받침대(pivot)에 끼운다. 면 데칼은 쓰지 않고(위 면 글자가 답을 흘린다) 옆 표만 고른 한 쌍에 띄운다.
  const holders = parts.rings.map((r, i) => {
    const h = new THREE.Group(); r.position.y = -T / 2; h.add(r); live.add(h);
    r.userData.top.visible = r.userData.bot.visible = true; r.userData.top.userData.decal.visible = r.userData.bot.userData.decal.visible = false;
    parts.setUp(r, ups[i]);
    for (const f of [r.userData.top, r.userData.bot]) { f.userData.badge.scale.setScalar(0.21); f.userData.badge.visible = false; }   // 틈이 좁아도 위아래 표가 겹치지 않게
    r.traverse((o) => { if (o.isMesh) o.userData.ring = i; });
    return h;
  });
  // 세운 자: 0칸 = 받침 윗면, 1칸마다 굵은 눈금과 숫자. 조작 중에는 숨겨 두고, 적을 때 나타나 맨 위 고리 윗면에 빨간 집게를 댄다(실험 순서 5 「자로 재기」).
  const MAXK = n <= 4 ? 8 : 9, GH = MAXK * KAN;
  const gauge = new THREE.Group(); gauge.position.copy(right).multiplyScalar(-1.75).addScaledVector(front, 0.1); gauge.rotation.y = VIEW_TH; live.add(gauge);
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
  const redM = new THREE.MeshPhysicalMaterial({ color: 0xd8413c, roughness: 0.35, clearcoat: 0.7 });
  const clip = new THREE.Mesh(KIT.roundedBoxGeometry(0.44, 0.05, 0.11, 0.02, 2), redM); clip.castShadow = true; gauge.add(clip);
  const L = gauge.position.length(), len = L - R_OUT - 0.2;   // 고리 바깥 가장자리 → 눈금자 앞
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, len, 8), new THREE.MeshBasicMaterial({ color: 0xd8413c, transparent: true, opacity: 0.6, depthWrite: false }));
  line.rotation.z = Math.PI / 2; line.position.x = R_OUT + len / 2;
  const lineG = new THREE.Group(); lineG.add(line); lineG.rotation.y = Math.atan2(-gauge.position.z, gauge.position.x); live.add(lineG);
  const hLabel = KIT.label('탑 높이 0칸', { size: 0.26 }); live.add(hLabel);
  // 카메라 — 각도는 눈높이에 가깝게(뜬 틈이 가로 줄로 보이게). 틀은 상황마다 바꾸고, 엔진의 부드러운 이동(glide)으로 옮긴다.
  const PEN_TOP = Math.min(TW.TOWER.PEN_TOP, 2.55), LIFT = PEN_TOP + 0.75, PILE = right.clone().multiplyScalar(2.3).addScaledVector(front, -0.3);
  const PHI = 1.3, xl = -(L + 0.3) * Math.cos(VIEW_TH) - 0.2;
  const BOX = {
    tower: [[-1.5, 0, -1.45], [1.5, PEN_TOP + 0.6, 1.45]],                    // 받침·고리·연필 끝까지(자 없이)
    overview: [[xl, 0, -1.45], [1.5, PEN_TOP + 0.6, 1.45]],                    // 적은 뒤: 옆에 선 자까지
    flip: [[-R_OUT - 0.2, 0, -R_OUT - 0.4], [PILE.x + R_OUT, LIFT + R_OUT + 0.1, R_OUT + 0.3]],
  };
  stage.fitMargin = 0.94;
  stage.setView({ theta: VIEW_TH, phi: PHI, dist: 6.6, target: [0, 1.5, 0], frame: battle ? BOX.overview : BOX.tower });
  stage.setContactShadow({ x: -0.4, z: 0.1, w: 4.6, d: 3.6 });
  const box3 = (b) => new THREE.Box3(new THREE.Vector3(...b[0]), new THREE.Vector3(...b[1]));
  // 사용자가 돌리거나 확대했다면 카메라를 빼앗지 않는다. 아니면 새 틀로 부드럽게 옮긴다(처음 시점도 그 틀이 된다).
  const glideTo = (b) => {
    if (stage._vbShown || stage._userZoom || stage._goHome) return;
    stage._frameFixed = box3(b); const f = stage._solveFit(), h = stage.orbit.home; if (!f || !h) return;
    h.dist = f.D; h.target.copy(f.c); stage._glide = !REDUCED(); if (REDUCED()) stage.resetView();
  };
  const ringsBox = (a, b) => {
    const y0 = holders[a].position.y - T / 2 - 0.18, y1 = holders[b].position.y + T / 2 + 0.18;
    return [[-R_OUT - 0.1, y0, -R_OUT - 0.1], [R_OUT + 0.3, y1, R_OUT + 0.3]];
  };

  // 상태
  const st = holders.map(() => ({ y: 0, v: 0 }));
  let model = towerModel(ups), shown = battle, phase = battle ? 'battle' : 'start', sel = -1, flipping = null, focusPair = 0;
  let pred = null, predAsked = battle, lastFlip = -1, compare = null;
  const target = (i) => BASE_Y + model.y[i] * KAN + T / 2;          // 고리 가운데 높이
  const setPhase = (p) => { phase = p; host.dataset.phase = p; };
  const showPair = (pair) => {
    focusPair = Math.max(0, Math.min(n - 2, pair));
    parts.rings.forEach((r, i) => {
      r.userData.top.userData.badge.visible = shown && i === focusPair;
      r.userData.bot.userData.badge.visible = shown && i === focusPair + 1;
    });
    const a = ups[focusPair], b = ups[focusPair + 1] === 'N' ? 'S' : 'N';
    $('[data-r=pair]').textContent = `${focusPair + 1}·${focusPair + 2}번 사이의 극 ↻`;
    $('[data-r=facing]').textContent = `${a} ↔ ${b}`;
    $('[data-r=shape]').textContent = ups.join(' ');
    $('[data-act=inspect-pair]').setAttribute('aria-label', `${focusPair + 1}번과 ${focusPair + 2}번 고리 사이의 마주 보는 극: ${a}과 ${b}. 누르면 다음 고리 사이를 봅니다.`);
  };
  // 잰 값·자·극 표를 보이거나 가린다(적기 전에는 「?」)
  const reveal = (on) => {
    shown = on;
    el.querySelectorAll('.rt-val').forEach((p) => p.classList.toggle('is-locked', !on));
    $('[data-r=floating]').textContent = on ? model.floating : '?';
    $('[data-r=height]').textContent = on ? model.height : '?';
    $('[data-act=inspect-pair]').hidden = !on;
    gauge.visible = lineG.visible = hLabel.visible = on;
    const top = BASE_Y + model.height * KAN;
    clip.position.y = top; lineG.position.y = top; hLabel.position.copy(gauge.position).setY(top + 0.32);
    KIT.relabel(hLabel, `탑 높이 ${model.height}칸`, { size: 0.26 });
    showPair(focusPair);
  };
  const select = (i) => {
    sel = i; parts.rings.forEach((r, j) => { r.userData.outline.visible = j === i; });
    el.querySelectorAll('[data-flip]').forEach((b) => b.classList.toggle('is-sel', +b.dataset.flip === i));
  };
  // ① 예상: 처음 고른 고리에 대해서만 묻는다. 고르지 않고 뒤집어도 된다(막지 않는다).
  const predictOptions = (i) => {
    const lo = i > 0 ? i - 1 : -1, hi = i < n - 1 ? i : -1, all = Array.from({ length: n - 1 }, (_, k) => k), nm = (p) => `${p + 1}·${p + 2}번 사이`;
    if (lo >= 0 && hi >= 0) return [[`${nm(lo)}만 뜬다`, [lo]], [`${nm(hi)}만 뜬다`, [hi]], [`${nm(lo)}와 ${nm(hi)}가 둘 다 뜬다`, [lo, hi]], ['아무 데도 뜨지 않는다', []]];
    const p = lo >= 0 ? lo : hi;
    return [[`${nm(p)}가 뜬다`, [p]], ['아무 데도 뜨지 않는다', []], ['모든 고리 사이가 뜬다', all]];
  };
  const showPredict = (i) => {
    const opts2 = predictOptions(i);
    card.hidden = false;
    card.innerHTML = `<p class="rt-q">${i + 1}번 고리를 뒤집어 다시 끼우면, 어느 고리 사이가 뜰까요?</p>
      <div class="rt-opts" role="group" aria-label="예상 고르기">${opts2.map(([t], k) => `<button type="button" class="rt-opt" data-pred="${k}">${t}</button>`).join('')}</div>
      <button type="button" class="btn primary rt-go" data-act="flip-sel">${i + 1}번 뒤집어 보기 ↻</button>`;
    card.querySelectorAll('[data-pred]').forEach((b) => b.addEventListener('click', () => {
      const [text, pairs] = opts2[+b.dataset.pred]; pred = { ring: i, text, pairs, checked: false };
      card.querySelectorAll('[data-pred]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      tip(`예상: <b>${text}</b>. 이제 뒤집어 확인해요.`);
    }));
    card.querySelector('[data-act=flip-sel]').addEventListener('click', () => flip(i));
    tip(`${i + 1}번 고리를 골랐어요. 뒤집으면 어디가 뜰지 예상을 고르고 뒤집어 보세요.`);
  };
  const tap = (i) => {
    if (flipping || compare) return;
    if (battle) { flip(i); return; }
    if (!predAsked) { predAsked = true; select(i); showPredict(i); return; }   // 처음 한 번만 고르고 예상한 뒤 뒤집는다
    flip(i);
  };
  // ② 조작: 위 고리 빼 두기 → 고른 고리 빼서 반 바퀴 → 다시 끼우기 → 위 고리 다시 끼우기
  const DUR = battle ? 1.0 : 2.0;
  const above = (i) => holders.map((_, j) => j).filter((j) => j > i);
  function flip(i) {
    if (flipping || compare) return;
    select(i); card.hidden = true;
    if (!battle) { reveal(false); recBtn.disabled = true; }
    const from = holders.map((h) => h.position.clone());
    flipping = { i, p: 0, from, swapped: false };
    lastFlip = i;
    if (REDUCED()) { finishFlip(); return; }
    if (!battle) glideTo(BOX.flip);
    tip(i < n - 1 ? `위 고리를 잠깐 빼 두고, ${i + 1}번 고리를 빼서 뒤집은 뒤 다시 끼워요.` : `${i + 1}번 고리를 빼서 뒤집은 뒤 다시 끼워요.`);
  }
  function swapPole(i) {   // 고른 고리가 반 바퀴 돌아 다시 끼워질 때: 극과 번호 방향을 바꾸고 새 높이를 계산한다
    ups[i] = ups[i] === 'N' ? 'S' : 'N'; parts.setUp(parts.rings[i], ups[i]); holders[i].quaternion.identity();
    model = towerModel(ups);
  }
  function finishFlip() {
    const i = flipping.i;
    if (!flipping.swapped) swapPole(i);
    holders.forEach((h, j) => { h.position.set(0, h.position.y, 0); h.quaternion.identity(); if (REDUCED()) { st[j].y = target(j); st[j].v = 0; h.position.y = st[j].y; } else { st[j].y = h.position.y; st[j].v = 0; } });
    flipping = null; select(-1);
    settle(i);
  }
  function settle(i) {
    showPair(i > 0 ? i - 1 : 0);
    if (battle) { reveal(true); tellBattle(i); return; }
    setPhase('explore'); recBtn.disabled = false;
    const lo = Math.max(0, i - 1), hi = Math.min(n - 1, i + 1);
    setTimeout(() => { if (!flipping && phase === 'explore' && !compare) glideTo(ringsBox(lo, hi)); }, REDUCED() ? 0 : 550);   // 내려앉은 뒤 바뀐 틈을 가까이
    tip(`${i + 1}번 고리를 뒤집어 다시 끼웠어요. 아래·위 틈을 잘 보세요. 어디가 뜨고 어디가 붙었나요? 다 봤으면 <b>표에 적기</b>를 눌러요.`);
  }
  function tellBattle(i) {
    const touching = (a) => ups[a] === ups[a + 1];
    const below = i > 0 ? (touching(i - 1) ? '붙었어요' : '떴어요') : '', abv = i < n - 1 ? (touching(i) ? '붙었어요' : '떴어요') : '';
    tip(`${i + 1}번 고리를 뒤집었어요. ${below ? `아래 고리와 <b>${below}</b>` : ''}${below && abv ? ', ' : ''}${abv ? `위 고리와 <b>${abv}</b>` : ''}.`);
  }
  const ease = KIT.ease.io, path = (pts, e) => {   // 꺾인 선을 따라(e 0~1) — 연필을 뚫지 않게 위로 뺀 뒤 옆으로
    const seg = pts.length - 1, k = Math.min(seg - 1, Math.floor(e * seg)), t = e * seg - k;
    return pts[k].clone().lerp(pts[k + 1], t);
  };
  stage.update = (dt, t) => {
    if (opts.isActive && !opts.isActive()) return;
    const reduce = REDUCED();
    if (flipping) {
      const F = flipping; F.p = Math.min(1, F.p + dt / DUR);
      const up = above(F.i), axisTop = (j) => new THREE.Vector3(0, LIFT + (j - F.i) * T, 0);
      up.forEach((j, k) => {                                           // 위 고리: 0~0.3 빼서 옆에 포개고, 0.7~1 다시 끼운다
        const pile = PILE.clone().setY(T / 2 + (up.length - 1 - k) * T), h = holders[j];
        if (F.p < 0.3) { const e = ease(F.p / 0.3); h.position.copy(path([F.from[j], axisTop(j), pile], e)); }
        else if (F.p < 0.7) h.position.copy(pile);
        else { const e = ease((F.p - 0.7) / 0.3); h.position.copy(path([pile, axisTop(j), new THREE.Vector3(0, target(j), 0)], e)); }
      });
      const h = holders[F.i];                                         // 고른 고리: 0.3~0.7 빼서 반 바퀴 돌려 다시 끼운다
      if (F.p >= 0.3 && F.p < 0.7) {
        const q = (F.p - 0.3) / 0.4, top = new THREE.Vector3(0, LIFT, 0);
        if (q < 0.3) h.position.copy(path([F.from[F.i], top], ease(q / 0.3)));
        else if (q < 0.7) { h.position.copy(top); h.quaternion.setFromAxisAngle(front, Math.PI * ease((q - 0.3) / 0.4)); }
        else { if (!F.swapped) { F.swapped = true; swapPole(F.i); } h.position.copy(path([top, new THREE.Vector3(0, target(F.i), 0)], ease((q - 0.7) / 0.3))); }
      } else if (F.p >= 0.7 && !F.swapped) { F.swapped = true; swapPole(F.i); h.position.set(0, target(F.i), 0); }
      if (F.p >= 1) finishFlip();
      return;
    }
    for (let i = 0; i < n; i++) {
      const s = st[i], h = holders[i];
      let goal = target(i); const floating = i > 0 && ups[i - 1] !== ups[i];
      if (floating && lastFlip >= 0 && !reduce) goal += Math.sin(t * 2.3 + i * 1.7) * 0.006;   // 첫 조작 뒤에만 아주 살짝 흔들린다
      if (reduce) { s.y = goal; s.v = 0; }
      else { const a = 95 * (goal - s.y) - 10 * s.v; s.v += a * Math.min(dt, 1 / 30); s.y += s.v * Math.min(dt, 1 / 30); }
      if (i > 0 && s.y < holders[i - 1].position.y + T) { s.y = holders[i - 1].position.y + T; s.v = Math.max(0, s.v); }   // 아래 고리를 뚫고 내려가지 않게
      if (i === 0 && s.y < BASE_Y + T / 2) { s.y = BASE_Y + T / 2; s.v = 0; }
      h.position.y = s.y;
    }
    parts.rings.forEach((r, i) => {                                  // 붙어 있는 두 면의 원형 표가 겹치지 않게 좌우로 벌린다
      const a = holders[i + 1], b = holders[i - 1], y = holders[i].position.y;
      parts.placeBadge(r.userData.top, a && Math.abs(a.position.y - y - T) < 0.06 ? -1 : 0);
      parts.placeBadge(r.userData.bot, b && Math.abs(y - b.position.y - T) < 0.06 ? 1 : 0);
    });
  };
  holders.forEach((h, i) => { st[i].y = target(i); h.position.set(0, st[i].y, 0); });   // 첫 조작 전에는 정지
  reveal(shown); showPair(0);
  tip(battle ? '고리를 눌러 <b>뒤집어</b> 목표 층 수를 만들어 보세요.' : '고리 네 개가 모두 붙어 있어요. 뒤집어 볼 고리를 하나 골라 눌러 보세요.');

  // 고리 누르기 → 고르기·뒤집기(끌어서 돌린 것과 구별)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  const pickables = []; holders.forEach((h) => h.traverse((o) => { if (o.isMesh && o.userData.ring != null) pickables.push(o); }));
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8 || performance.now() - down.t > 450) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera); const hit = ray.intersectObjects(pickables, false)[0];
    if (hit) tap(hit.object.userData.ring);
  });
  el.querySelectorAll('[data-flip]').forEach((b) => b.addEventListener('click', () => tap(+b.dataset.flip)));
  $('[data-act=inspect-pair]').addEventListener('click', () => showPair((focusPair + 1) % (n - 1)));

  // ③ 확인: 적으면 잰 값·자·마주 보는 극을 보여 주고, 처음 한 예상과 대조한다
  let cmpSel = [];
  function renderRows() {
    tbody.innerHTML = rows.length ? rows.map((r, k) => `<tr data-row="${k}"${compare && cmpSel.includes(k) ? ` class="is-cmp" data-cmp="${cmpSel.indexOf(k) ? '나' : '가'}"` : ''}><td>${r.shape}</td><td>${r.floating}</td><td>${r.height}</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">아직 기록이 없어요.</td></tr>';
    cmpBtn.hidden = battle || rows.length < 2;
  }
  recBtn.addEventListener('click', () => {
    if (flipping) { tip('고리가 다 내려앉은 뒤에 적어요.'); return; }
    if (!battle && phase === 'start') return;
    const m = towerModel(ups), row = { shape: shapeOf(ups), floating: m.floating, height: m.height };
    if (!rows.some((r) => r.shape === row.shape)) rows.push(row);
    renderRows(); onRecord?.(rows);
    if (battle) { tip(`적었어요! 탑 높이 <b>${m.height}칸</b>.`); return; }
    setPhase('revealed'); reveal(true); showPair(lastFlip > 0 ? lastFlip - 1 : 0); glideTo(BOX.overview);
    const fp = floatPairs(ups), a = ups[focusPair], b = ups[focusPair + 1] === 'N' ? 'S' : 'N', same = a === b;
    const why = `${focusPair + 1}·${focusPair + 2}번 사이: 마주 보는 면이 <b>${a}과 ${b}</b> — ${same ? '같은 극끼리는 서로 <b>밀어 내서</b> 떠요.' : '다른 극끼리는 서로 <b>끌어당겨</b> 붙어요.'}`;
    let mine = '';
    if (pred && !pred.checked) {
      pred.checked = true; const ok = pred.pairs.length === fp.length && pred.pairs.every((p) => fp.includes(p));
      mine = `<p class="rt-mine ${ok ? 'ok' : 'no'}">내 예상: ${pred.text} — ${ok ? '맞았어요' : '다르게 나왔어요. 어디가 떴는지 다시 볼까요?'}</p>`;
    }
    card.hidden = false; card.innerHTML = `${mine}<p class="rt-why">${why}</p><p class="rt-more">다른 쌍은 <b>${focusPair + 1}·${focusPair + 2}번 사이의 극 ↻</b>을 눌러 봐요. 고리를 또 뒤집어 더 높은(낮은) 탑도 만들어 보세요.</p>`;
    tip(`적었어요! 떠 있는 층 <b>${m.floating}곳</b>, 탑 높이 <b>${m.height}칸</b>.`);
  });
  // 두 탑 비교: 적은 줄 두 개를 같은 눈금으로 나란히(기본은 마지막 두 줄, 표의 줄을 누르면 바꾼다)
  function buildCompare() {
    const g = new THREE.Group(), lab = (txt) => KIT.label(txt, { size: 0.26 });
    cmpSel.forEach((k, side) => {
      const r = rows[k], u = upsOf(r.shape), m = towerModel(u), p = TW.towerParts(u.length), t = new THREE.Group();
      p.rod.position.y = -sink; t.add(p.base, p.rod);
      p.rings.forEach((ring, i) => {
        const h = new THREE.Group(); ring.position.y = -T / 2; h.add(ring); h.position.y = BASE_Y + m.y[i] * KAN + T / 2; t.add(h);
        ring.userData.top.visible = ring.userData.bot.visible = false; p.setUp(ring, u[i]);
      });
      const top = BASE_Y + m.height * KAN, bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, top - BASE_Y, 6), new THREE.MeshBasicMaterial({ color: 0x334155 }));
      bar.position.copy(right).multiplyScalar(-(R_OUT + 0.4)).setY((top + BASE_Y) / 2); t.add(bar);
      for (const y of [BASE_Y, top]) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.02), bar.material); tk.position.copy(bar.position).setY(y); tk.rotation.y = VIEW_TH; t.add(tk); }
      const lb = lab(`${side ? '나' : '가'}: ${m.height}칸 · 떠 있는 층 ${m.floating}`); lb.position.copy(bar.position).setY(top + 0.35); t.add(lb);
      t.position.copy(right).multiplyScalar(side ? 1.75 : -1.75); g.add(t);
    });
    return g;
  }
  function openCompare() {
    if (rows.length < 2) return;
    if (!compare) cmpSel = [rows.length - 2, rows.length - 1];
    if (compare) root.remove(compare);   // 재질은 실험 고리와 함께 쓰는 것이 있어 여기서 내리지 않는다(무대를 닫을 때 정리)
    compare = buildCompare(); root.add(compare); live.visible = false; setPhase('compare');
    const hMax = Math.max(...cmpSel.map((k) => towerModel(upsOf(rows[k].shape)).height));
    stage.setView({ theta: VIEW_TH, phi: 1.36, dist: 9, target: [0, 1.2, 0], frame: [[-1.75 - R_OUT - 0.6, 0, -1.4], [1.75 + R_OUT + 0.2, Math.max(BASE_Y + hMax * KAN + 0.7, PEN_TOP + 0.5), 1.4]] });
    cmpBtn.textContent = '실험으로 돌아가기'; renderRows();
    card.hidden = false; card.innerHTML = `<p class="rt-q">두 탑을 같은 눈금으로 나란히 봐요. 떠 있는 층이 많은 탑은 어느 쪽인가요? 높이는요?</p><p class="rt-more">표에서 줄을 누르면 비교할 탑을 바꿔요.</p>`;
    tip('두 탑을 나란히 놓았어요. 무엇이 다른지 찾아 보세요.');
  }
  function closeCompare() {
    if (!compare) return; root.remove(compare); compare = null; live.visible = true;
    setPhase(shown ? 'revealed' : 'explore'); cmpBtn.textContent = '두 탑 비교'; renderRows(); card.hidden = true;
    stage.setView({ theta: VIEW_TH, phi: PHI, dist: 6.6, target: [0, 1.5, 0], frame: shown ? BOX.overview : BOX.tower });
    tip('다시 실험해요. 고리를 골라 눌러 보세요.');
  }
  cmpBtn.addEventListener('click', () => (compare ? closeCompare() : openCompare()));
  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-row]'); if (!compare || !tr) return;
    const k = +tr.dataset.row; if (cmpSel.includes(k)) return;
    cmpSel = [cmpSel[1], k]; openCompare();
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
