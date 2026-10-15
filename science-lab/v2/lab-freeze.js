// 가상 실험실: 물의 상태 변화(s41-u02).
//  · 본 실험 = 시험관(교재 「얼었다 녹는 물기둥」 = 이론편 4-1-2단계 22~23쪽): 예상 → 빨간 선·저울 → 적기 → 소금 얼음에 얼리기
//    → 파란 선 → 저울(겉에 물방울·소금물이 묻어 더 무겁다) → 수건으로 닦기 → 적기 → 따뜻한 물에 녹이기 → 자로 재기 → 닦기 → 저울 → 적기 → 세 기록 비교.
//    재기 전에는 높이·무게가 「?」, 결론은 학생이 적은 세 기록으로만 보여 준다. 수치는 교재 그림의 예시(모형 값).
//  · 추가 탐구·두 팀 배틀 = 얼음 병 저울(60·100·140 mL): 예전 실험 그대로(배틀 문제가 병 기록에 묶여 있다).
// 3D(WebGL)가 없으면 같은 단계·같은 공개 규칙의 2D 실험실.

// ── 얼음 병 저울 모형: 물이 얼면 부피가 약 1.1배(높이 늘어남), 무게는 그대로. 병 무게 20 g, 물 1 mL = 1 g.
const BOTTLE_G = 20, GROW = 1.1;
export function freezeModel(ml, frozen) {
  const water = ml / 10;                                  // 물 높이(칸) — 10 mL = 1칸
  const height = Math.round((frozen ? water * GROW : water) * 10) / 10;
  return { height, mass: BOTTLE_G + ml };
}

// ── 시험관 모형 값: 교재 그림의 예시(물 4.0 cm · 32.5 g → 얼음 약 4.4 cm → 녹은 물 4.0 cm). 얼음 높이 = 물 높이 × 1.1.
// wet: 얼음에서 꺼내 닦기 전 — 겉에 맺힌 물방울과 묻은 소금물만큼 더 무겁게 나온다(모형 값).
export const TUBE = { water: 4.0, ice: 4.4, mass: 32.5, wet: 33.1 };
export const TUBE_STEPS = ['처음 물', '다 언 얼음', '다 녹은 물'];
export const TUBE_PREDICT = { h: ['올라간다', '그대로다', '내려간다'], m: ['늘어난다', '그대로다', '줄어든다'] };
const f1 = (v) => Number(v).toFixed(1);
// 적은 기록(순서 상관없이)을 단계 순서로. 예전 병 기록({state, ml})은 버린다.
export const tubeRows = (rows) => TUBE_STEPS.map((s) => (rows || []).find((r) => r && r.step === s) || null);
// 세 기록에서 읽어 낸 말(학생 기록이 없으면 null) — 결론은 늘 기록에서 나온다.
export function tubeReading(rows) {
  const [w, i, m] = tubeRows(rows);
  if (!w || !i || !m) return null;
  const cmp = (a, b) => (b > a ? 1 : b < a ? -1 : 0);
  const hFreeze = cmp(w.height, i.height), hMelt = cmp(w.height, m.height), sameMass = w.mass === i.mass && i.mass === m.mass;
  const h = `높이: ${f1(w.height)} → ${f1(i.height)} → ${f1(m.height)} cm — 얼면 ${['낮아졌고', '그대로였고', '높아졌고'][hFreeze + 1]}, 녹으니 ${hMelt === 0 ? '처음 높이(빨간 선)로 돌아왔어요' : '처음 높이와 달랐어요'}.`;
  const g = `무게: ${f1(w.mass)} → ${f1(i.mass)} → ${f1(m.mass)} g — ${sameMass ? '세 번 모두 같아요' : '세 번이 서로 달라요'}.`;
  return { h, g, hDir: hFreeze, mDir: sameMass ? 0 : cmp(w.mass, i.mass) };
}

const REDUCED = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtMass = (g) => g.toFixed(1);

export async function mountFreeze(el, opts = {}) {
  if (opts.mode === 'battle') return mountBottle(el, opts);
  return mountTube(el, opts);
}

// ════════════════════════ 시험관 실험 ════════════════════════
// 단계: 한 번에 한 행동. act = 주 단추 글자(없으면 「표에 적기」 차례), rec = 적을 기록의 단계 번호.
const FLOW = {
  mark1: { act: '빨간 선 긋기', next: 'weigh1' },
  weigh1: { act: '저울에 올리기', next: 'rec1' },
  rec1: { rec: 0, next: 'freeze' },
  freeze: { act: '소금 얼음에 꽂아 얼리기', next: 'mark2' },
  mark2: { act: '파란 선 긋기', next: 'weigh2' },
  weigh2: { act: '저울에 올리기', next: 'wipe2' },
  wipe2: { act: '수건으로 닦기', next: 'rec2' },
  rec2: { rec: 1, next: 'melt' },
  melt: { act: '따뜻한 물에 넣어 녹이기', next: 'read3' },
  read3: { act: '자로 높이 재기', next: 'wipe3' },
  wipe3: { act: '수건으로 닦기', next: 'weigh3' },
  weigh3: { act: '저울에 올리기', next: 'rec3' },
  rec3: { rec: 2, next: 'compare' },
};

async function mountTube(el, opts) {
  let make3D = null;
  try {
    const [{ Stage, watchDetached }, THREE, FB, KIT] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/freeze-bottle.js'), import('../scenes/_kit.js')]);
    if (!Stage.canWebGL()) throw new Error('no webgl');
    make3D = (canvas) => tubeView3D({ canvas, Stage, watchDetached, THREE, FB, KIT, el, opts });
  } catch (_) { make3D = null; }
  if (!el.isConnected) make3D = null;
  return tubeLab(el, opts, make3D);
}

function tubeLab(el, opts, make3D) {
  const onRecord = opts.onRecord;
  const rows = tubeRows(opts.rows).filter(Boolean);       // 지난 기록(시험관)만. 같은 단계를 다시 재면 그 줄만 바꾼다.
  const slot = make3D ? '<canvas aria-label="시험관 3D 실험. 단계 단추를 누르면 시험관을 옮기고, 끌어서 돌려 볼 수 있어요."></canvas>'
    : '<svg class="ft2-svg" viewBox="0 0 480 300" role="img" aria-label="시험관과 저울, 소금 섞은 얼음 비커, 따뜻한 물 비커가 놓인 실험대"></svg>';
  el.innerHTML = `
    <div class="lab3d lab3d--tube${make3D ? '' : ' lab2d'}" data-phase="predict">
      ${slot}
      <div class="lab3d-read">
        <p class="lab-read ft-val"><span>지금</span><b data-r="state">처음 물</b></p>
        <p class="lab-read ft-val" data-v="h"><span>높이</span><b data-r="h">?</b><small data-why="선을 그어 재요">cm</small></p>
        <p class="lab-read ft-val" data-v="m"><span>무게</span><b data-r="m">?</b><small data-why="저울에 올리면 재요">g</small></p>
      </div>
      <p class="lab3d-tip" data-r="tip" aria-live="polite"></p>
      <div class="rt-card ft-card" data-r="card"></div>
      <div class="lab3d-btns">
        <button class="btn primary" data-act="step" type="button" disabled>예상하고 시작</button>
        <button class="btn" data-act="record" type="button" disabled>표에 적기</button>
        <button class="btn" data-act="extra" type="button" hidden>추가 탐구: 물의 양 바꿔 보기</button>
        <button class="btn" data-act="restart" type="button" hidden>처음부터</button>
      </div>
    </div>
    <table class="lab-table ft-table"><caption>높이·무게는 교재 그림의 예시를 따른 모형 값이에요.</caption>
      <thead><tr><th>단계</th><th>높이(cm)</th><th>무게(g)</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), host = $('.lab3d'), card = $('[data-r=card]'), stepBtn = $('[data-act=step]'), recBtn = $('[data-act=record]'), againBtn = $('[data-act=restart]');
  const tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  const view = make3D ? make3D($('canvas')) : tubeView2D($('svg'));
  if (!view) return mountTube2DOnly(el, opts);
  // 학생 실험 페이지에서만: 새로 연 카드·단추가 하단 고정 막대 밑으로 밀려나지 않게(덱·전체 화면은 자체 배치)
  const bring = (node) => {
    if (!node || !el.closest('#lab') || node.closest('.fl-panel')) return;
    const r = node.getBoundingClientRect(), bar = document.querySelector('.bottom')?.getBoundingClientRect(), limit = (bar && bar.top > 0 ? bar.top : innerHeight) - 12;
    if (r.bottom > limit) window.scrollBy(0, Math.max(0, Math.min(r.bottom - limit, r.top - 64)));
  };

  // 상태: 재지 않은 값은 null(「?」). 무게는 저울 위에 있을 때만 저울 숫자와 같다.
  let ph = 'predict', busy = false, pred = { h: null, m: null }, h = null, onScale = false, lcd = 0, stateText = '처음 물';
  const setPhase = (p) => { ph = p; host.dataset.phase = p; };
  function show() {
    $('[data-r=state]').textContent = stateText;
    $('[data-r=h]').textContent = h == null ? '?' : f1(h);
    $('[data-r=m]').textContent = onScale ? fmtMass(lcd) : '?';
    $('[data-v=h]').classList.toggle('is-locked', h == null);
    $('[data-v=m]').classList.toggle('is-locked', !onScale);
    host.dataset.lcd = view.lcdText();
    const f = FLOW[ph];
    stepBtn.hidden = f?.rec != null || ph === 'compare';
    if (ph === 'predict') { stepBtn.textContent = '예상하고 시작'; stepBtn.disabled = pred.h == null || pred.m == null; }
    else if (f?.act) { stepBtn.textContent = f.act; stepBtn.disabled = busy; }
    recBtn.disabled = busy || f?.rec == null;
    recBtn.hidden = ph === 'compare'; $('[data-act=extra]').hidden = ph !== 'compare';
    recBtn.classList.toggle('primary', f?.rec != null);
    againBtn.hidden = ph === 'predict';
    againBtn.disabled = busy;
  }
  function renderRows() {
    const got = tubeRows(rows);
    $('tbody').innerHTML = TUBE_STEPS.map((s, i) => `<tr${got[i] ? ' data-row' : ''}><th scope="row">${s}</th><td>${got[i] ? f1(got[i].height) : '—'}</td><td>${got[i] ? f1(got[i].mass) : '—'}</td></tr>`).join('');
  }
  function predictCard() {
    card.hidden = false;
    const grp = (k, name) => `<div class="ft-pred" role="group" aria-label="${name} 예상"><span>${name}</span>${TUBE_PREDICT[k].map((t, j) => `<button type="button" class="rt-opt" data-p${k}="${j}" aria-pressed="${pred[k] === j}">${t}</button>`).join('')}</div>`;
    card.innerHTML = `<p class="rt-q">시험관 속 물을 얼리면 높이와 무게는 어떻게 될까요? 먼저 예상해요.</p>${grp('h', '높이')}${grp('m', '무게')}`;
    card.querySelectorAll('[data-ph],[data-pm]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.ph != null ? 'h' : 'm'; pred[k] = +(b.dataset.ph ?? b.dataset.pm);
      card.querySelectorAll(`[data-p${k}]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      show(); if (pred.h != null && pred.m != null) tip('예상을 골랐어요. <b>예상하고 시작</b>을 눌러요.');
    }));
    tip('높이 하나, 무게 하나를 골라 예상해요.');
  }
  function compareCard() {
    const R = tubeReading(rows); card.hidden = false;
    if (!R) { card.innerHTML = '<p class="rt-q">세 단계를 모두 적으면 비교할 수 있어요.</p>'; return; }
    const okH = pred.h != null && [2, 1, 0][pred.h] === R.hDir + 1, okM = pred.m != null && [2, 1, 0][pred.m] === R.mDir + 1;
    const mine = pred.h == null ? '' : `<p class="rt-mine ${okH && okM ? 'ok' : 'no'}">내 예상: 높이는 ${TUBE_PREDICT.h[pred.h]} · 무게는 ${TUBE_PREDICT.m[pred.m]} — ${okH && okM ? '두 가지 모두 기록과 같아요' : `${okH ? '높이는 맞았어요' : '높이는 기록과 달라요'}, ${okM ? '무게는 맞았어요' : '무게는 기록과 달라요'}`}.</p>`;
    card.innerHTML = `<p class="rt-q">내가 적은 세 기록을 비교해요. <small>(수치는 교재 그림의 예시를 따른 모형 값)</small></p><p class="rt-why">${R.h}<br>${R.g}</p>${mine}`;
    tip('세 기록을 비교해 봐요. 다시 하려면 <b>처음부터</b>를 눌러요.');
  }

  async function doStep() {
    if (busy) return;
    if (ph === 'predict') { if (pred.h == null || pred.m == null) return; card.hidden = true; card.innerHTML = ''; setPhase('mark1'); show();
      tip('시험관에 물을 3분의 1쯤 넣고 고무마개로 막았어요. 물 높이에 <b>빨간 선</b>을 그어요.'); bring(stepBtn); return; }
    const f = FLOW[ph]; if (!f?.act) return;
    busy = true; show();
    // 저울을 떠나는 순간 저울은 0 g(빈 컵), 무게 칸은 「?」. 올리면 숫자가 멈춘 뒤에 무게 칸에 같은 값.
    const go = async (p, l) => {
      if (onScale && p !== 'cup') { onScale = false; lcd = 0; view.lcd(0); show(); }
      await view.move(p);
      if (p === 'cup') { await view.weigh(l); lcd = l; onScale = true; }
    };
    switch (ph) {
      case 'mark1': await view.focus('tube'); view.line('red', TUBE.water); h = TUBE.water;
        tip(`빨간 선이 물 높이예요. 종이 자로 읽으면 <b>${f1(TUBE.water)} cm</b>. 이제 <b>저울에 올려요</b>.`); break;
      case 'weigh1': tip('저울에 빈 컵을 올려 0 g으로 맞춰 두었어요. 컵에 시험관을 세워요.'); await go('cup', TUBE.mass);
        tip(`저울이 <b>${fmtMass(TUBE.mass)} g</b>을 가리켜요. <b>표에 적기</b>를 눌러요.`); break;
      case 'freeze': h = null; tip('시험관을 꺼내 <b>소금 섞은 얼음</b>에 꽂아요. 저울에는 빈 컵만 남아 0 g이에요.'); stateText = '얼리는 중'; show();
        await go('ice', 0); await view.freeze(); view.drops('salt'); await go('rack', 0); stateText = '다 언 얼음';
        tip('다 얼었어요. 꺼낸 시험관에서 얼음 윗면 가장자리에 <b>파란 선</b>을 그어요.'); break;
      case 'mark2': await view.focus('tube'); view.line('blue', TUBE.ice); h = TUBE.ice;
        tip(`파란 선을 종이 자로 읽으면 <b>${f1(TUBE.ice)} cm</b>. 빨간 선과 견주어 보고, <b>저울에 올려요</b>.`); break;
      case 'weigh2': await go('cup', TUBE.wet);
        tip(`저울이 <b>${fmtMass(TUBE.wet)} g</b>을 가리켜요. 그런데 시험관 겉에 <b>물방울과 소금물</b>이 묻어 있어요. 이대로 적어도 될까요? <b>수건으로 닦아요</b>.`); break;
      case 'wipe2': await go('wipe', 0); await view.wipe(); await go('cup', TUBE.mass);
        tip(`물기를 닦고 다시 올리니 <b>${fmtMass(TUBE.mass)} g</b>이에요. 이제 <b>표에 적기</b>를 눌러요.`); break;
      case 'melt': h = null; tip('시험관을 <b>따뜻한 물</b>에 넣어 얼음을 녹여요.'); stateText = '녹이는 중'; show();
        await go('warm', 0); await view.melt(); view.drops('water'); await go('rack', 0); stateText = '다 녹은 물';
        tip('다 녹았어요. 빨간 선·파란 선과 견주며 <b>자로 높이를 재요</b>.'); break;
      case 'read3': await view.focus('tube'); view.reread(TUBE.water); h = TUBE.water;
        tip(`종이 자로 읽으면 <b>${f1(TUBE.water)} cm</b>. 따뜻한 물이 묻었으니 저울에 올리기 전에 <b>수건으로 닦아요</b>.`); break;
      case 'wipe3': await go('wipe', 0); await view.wipe(); await go('rack', 0);
        tip('물기를 닦았어요. <b>저울에 올려요</b>.'); break;
      case 'weigh3': await go('cup', TUBE.mass);
        tip(`저울이 <b>${fmtMass(TUBE.mass)} g</b>을 가리켜요. <b>표에 적기</b>를 눌러요.`); break;
    }
    if (!host.isConnected) return;
    busy = false; setPhase(f.next); show();
    bring(host.querySelector('.lab3d-btns'));
  }
  function record() {
    const f = FLOW[ph]; if (busy || f?.rec == null || h == null || !onScale) return;
    const row = { step: TUBE_STEPS[f.rec], height: h, mass: lcd };
    const at = rows.findIndex((r) => r.step === row.step); if (at >= 0) rows[at] = row; else rows.push(row);
    rows.sort((a, b) => TUBE_STEPS.indexOf(a.step) - TUBE_STEPS.indexOf(b.step));
    renderRows(); onRecord?.(rows.slice(), { complete: rows.length === TUBE_STEPS.length && f.rec === 2 });
    setPhase(f.next);
    if (ph === 'compare') { view.focus('bench'); compareCard(); }
    else tip(f.rec === 0 ? `적었어요! 이제 <b>소금 섞은 얼음</b>에 꽂아 얼려요.` : `적었어요! 이제 <b>따뜻한 물</b>에 넣어 녹여요.`);
    show(); bring(host.querySelector('.lab3d-btns'));
  }
  function restart() {
    if (busy) return;
    rows.length = 0; renderRows(); onRecord?.([], { complete: false });
    view.reset(); h = null; onScale = false; lcd = 0; stateText = '처음 물'; pred = { h: null, m: null };
    setPhase('predict'); predictCard(); show();
  }
  // 추가 탐구: 얼음 병 저울(물의 양 60·100·140 mL) — 이 화면에서만 쓰고 기록은 저장하지 않는다(시험관 기록과 섞지 않게).
  function openExtra() {
    view.dispose();
    mountBottle(el, { amounts: opts.amounts || [60, 100, 140], rows: [], isActive: opts.isActive, lowPower: opts.lowPower, extra: true,
      onBack: () => { mountTube(el, { ...opts, rows: rows.slice() }); } });
  }
  stepBtn.addEventListener('click', doStep); recBtn.addEventListener('click', record); againBtn.addEventListener('click', restart); $('[data-act=extra]').addEventListener('click', openExtra);
  renderRows(); predictCard(); show();
  return { get rows() { return rows; }, pause() {}, dispose() { view.dispose(); } };
}
function mountTube2DOnly(el, opts) { return tubeLab(el, opts, null); }

// ── 3D 화면 ──────────────────────────────────────────────
function tubeView3D({ canvas, Stage, watchDetached, THREE, FB, KIT, el, opts }) {
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return null; }
  const { CM, TL, TB } = FB.TUBE_DIM, { PAN_Y, ICE } = FB.BOTTLE_DIM;
  const TH = 0.32, PHI = 1.2;
  const scale = FB.buildScale(); stage.root.add(scale);
  const cup = FB.buildCup(); cup.position.y = PAN_Y; stage.root.add(cup);
  const P = {                                                 // 시험관 바닥이 놓이는 자리
    rack: new THREE.Vector3(-1.85, 0.1, 0.35), cup: new THREE.Vector3(0, PAN_Y + 0.02, 0),
    ice: new THREE.Vector3(1.85, 0.12, -0.75), warm: new THREE.Vector3(-1.5, 0.12, -1.3), wipe: new THREE.Vector3(1.75, 0.55, 0.95),
  };
  const rack = FB.buildRack(); rack.position.set(P.rack.x, 0, P.rack.z); stage.root.add(rack);
  const ice = FB.buildIceBeaker(); ice.position.set(P.ice.x, 0, P.ice.z); stage.root.add(ice);
  const warm = FB.buildWarmBeaker(); warm.position.set(P.warm.x, 0, P.warm.z); stage.root.add(warm);
  const towel = FB.buildTowel(); towel.folded.position.set(P.wipe.x, 0.06, P.wipe.z); stage.root.add(towel.folded);
  const lbIce = KIT.label('소금 섞은 얼음', { size: 0.2 }); lbIce.position.set(P.ice.x, 1.25, P.ice.z); stage.root.add(lbIce);
  const lbWarm = KIT.label('따뜻한 물', { size: 0.2 }); lbWarm.position.set(P.warm.x, 1.25, P.warm.z); stage.root.add(lbWarm);
  // 시험관 묶음(유리·물·자·선·물방울)을 들고 옮긴다
  const carry = new THREE.Group(); carry.position.copy(P.rack); stage.root.add(carry);
  carry.add(FB.buildTube(TH + 0.95));
  const WATER = new THREE.Color(0x7fb3d5), ICEC = new THREE.Color(ICE), c = new THREE.Color();
  const wMat = new THREE.MeshPhysicalMaterial({ color: WATER, transparent: true, opacity: 0.8, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.08 });
  const wMesh = new THREE.Mesh(FB.tubeWaterGeo(TUBE.water, 0), wMat); wMesh.renderOrder = 1; carry.add(wMesh);
  let shown = { h: -1, k: -1 };
  const contents = (hcm, k) => {
    hcm = Math.round(hcm * 100) / 100; k = Math.round(k * 50) / 50;
    if (hcm !== shown.h || k !== shown.k) { const g = FB.tubeWaterGeo(hcm, k); wMesh.geometry.dispose(); wMesh.geometry = g; shown = { h: hcm, k }; }
    wMat.color.copy(c.copy(WATER).lerp(ICEC, k)); wMat.roughness = 0.06 + 0.4 * k; wMat.opacity = 0.8 + 0.12 * k; wMat.clearcoat = 1 - 0.7 * k;
  };
  const ringOf = (col) => { const m = new THREE.Mesh(new THREE.TorusGeometry(FB.TUBE_DIM.TO + 0.006, 0.009, 8, 48), new THREE.MeshBasicMaterial({ color: col })); m.rotation.x = Math.PI / 2; m.visible = false; carry.add(m); return m; };
  const red = ringOf(0xd23b30), blue = ringOf(0x2c64c8);
  const yAt = (cm) => TB + cm * CM;
  const lbRed = KIT.label('빨간 선', { size: 0.13, color: '#b3261e' }); lbRed.position.set(-0.62, yAt(TUBE.water), 0); lbRed.visible = false; carry.add(lbRed);
  const lbBlue = KIT.label('파란 선', { size: 0.13, color: '#1f4fa8' }); lbBlue.position.set(0.72, yAt(TUBE.ice), 0); lbBlue.visible = false; carry.add(lbBlue);
  const { drops, salt } = FB.buildTubeDrops(); drops.visible = salt.visible = false; carry.add(drops, salt);
  towel.wrap.visible = false; carry.add(towel.wrap);
  // 가까이 볼 때만 선 라벨, 멀리 볼 때는 비커 라벨(라벨이 화면 가장자리로 밀려 와 서로·자를 가리지 않게)
  const near = (on) => { lbIce.visible = lbWarm.visible = !on; lbRed.visible = on && !!lbRed.userData.on; lbBlue.visible = on && !!lbBlue.userData.on; };
  const mist = KIT.puffCloud(KIT.particleBudget(canvas, 36), { color: 0xf1f7ff, opacity: 0.5, soft: 0.8 }); stage.root.add(mist);
  const puffs = [];
  // 틀(엔진 자동 맞춤): 실험대 전체 · 저울 앞(숫자가 읽히게) · 시험관 물 높이 가까이(자 눈금이 읽히게)
  const BOX = {
    bench: [[-2.45, 0, -1.9], [2.45, 3.3, 1.3]],
    scale: [[-1.25, 0, -0.7], [1.25, PAN_Y + 1.55, 1.15]],                 // 저울 숫자가 읽히게: 저울과 시험관 아랫부분
  };
  const tubeBox = () => { const p = carry.position; return [[p.x - 0.75, p.y + yAt(TUBE.water - 1.0), p.z - 0.3], [p.x + 0.95, p.y + yAt(TUBE.ice + 0.9), p.z + 0.3]]; };
  stage.fitMargin = 0.92;
  stage.setView({ theta: TH, phi: PHI, dist: 7, target: [0, 1.2, -0.2], frame: BOX.bench });
  stage.setContactShadow({ x: 0, z: -0.3, w: 6.5, d: 4.2 });
  const box3 = (b) => new THREE.Box3(new THREE.Vector3(...b[0]), new THREE.Vector3(...b[1]));
  // 사용자가 돌리거나 확대했으면 카메라를 빼앗지 않는다. 아니면 새 틀로 부드럽게 옮긴다(처음 시점도 그 틀).
  const glideTo = (b) => {
    stage._frameFixed = box3(b);
    if (stage._vbShown || stage._userZoom || stage._goHome) return;
    const f = stage._solveFit(), hm = stage.orbit.home; if (!f || !hm) return;
    hm.dist = f.D; hm.target.copy(f.c); stage._glide = !REDUCED(); if (REDUCED()) stage.resetView();
  };
  // 저울 숫자: 올리면 잠깐 흔들리다 멈춘다
  let lcdShown = 0, lcdTarget = 0, lcdDone = null;
  const setLcd = (g) => scale.userData.setLcd(fmtMass(Math.max(0, g)));
  // 움직임 하나 = { dur, step(p), done }. 화면 밖이거나 동작 줄이기면 바로 끝낸다. 엔진이 멈춰 있어도 시계로 끝낸다(멈춤 방지).
  let anim = null;
  const seen = () => {
    if (canvas.closest('.full-land')) return true;
    const r = canvas.getBoundingClientRect(), v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    return v >= Math.min(r.height, innerHeight) * 0.4;
  };
  const play = (dur, step) => new Promise((res) => {
    if (anim) { anim.step(1); anim.res(); anim = null; }
    if (!seen() && el.closest('#lab')) { const r = canvas.getBoundingClientRect(); window.scrollBy(0, r.top - 64); }
    if (REDUCED() || (opts.isActive && !opts.isActive()) || !seen()) { step(1); res(); return; }
    const a = { t: 0, dur, step, res, guard: setTimeout(() => { if (anim === a) { a.step(1); anim = null; res(); } }, dur * 1000 + 1800) };
    anim = a;
  });
  const E = KIT.ease.io;
  const path = (a, b, p) => {                               // 위로 들기 → 옮기기 → 내리기
    const top = Math.max(a.y, b.y, 1.15) + 0.05;
    const up = Math.min(1, p / 0.3), mid = Math.min(1, Math.max(0, (p - 0.3) / 0.4)), dn = Math.max(0, (p - 0.7) / 0.3);
    carry.position.set(a.x + (b.x - a.x) * E(mid), a.y + (top - a.y) * E(up) - (top - b.y) * E(dn), a.z + (b.z - a.z) * E(mid));
  };
  let at = 'rack';
  stage.update = (dt) => {
    if (opts.isActive && !opts.isActive()) return;
    if (anim) { anim.t += dt; const p = Math.min(1, anim.t / anim.dur); anim.step(p); if (p >= 1) { const a = anim; anim = null; clearTimeout(a.guard); a.res(); } }
    const d = lcdTarget - lcdShown; lcdShown = Math.abs(d) < 0.05 ? lcdTarget : lcdShown + d * Math.min(1, dt * 7); setLcd(lcdShown);
    if (lcdDone && lcdShown === lcdTarget) { const f = lcdDone; lcdDone = null; f(); }
    let k = 0;                                               // 냉기: 비커 가장자리에서 넘쳐 가라앉으며 퍼진다
    for (let i = puffs.length - 1; i >= 0; i--) { const q = puffs[i]; q.life += dt; if (q.life > q.max) { puffs.splice(i, 1); continue; } q.x += q.vx * dt; q.z += q.vz * dt; q.y = Math.max(0.05, q.y - dt * 0.22); }
    for (const q of puffs) { const f = q.life / q.max; mist.userData.set(k++, q.x, q.y, q.z, q.s * (1 + f * 1.4), Math.sin(Math.PI * f) * 0.5); }
    mist.userData.commit(k);
  };
  const spawnMist = () => {
    if (puffs.length >= mist.userData.max || Math.random() > 0.5) return;
    const a = Math.random() * Math.PI * 2, r = 0.5 + Math.random() * 0.15;
    puffs.push({ x: P.ice.x + Math.cos(a) * r, y: 0.98, z: P.ice.z + Math.sin(a) * r, vx: Math.cos(a) * 0.1, vz: Math.sin(a) * 0.1, life: 0, max: 2 + Math.random() * 1.4, s: 0.3 + Math.random() * 0.25 });
  };
  const view = {
    async focus(kind) {
      near(kind === 'tube');
      glideTo(kind === 'tube' ? tubeBox() : kind === 'scale' ? BOX.scale : BOX.bench); if (!REDUCED() && seen()) await new Promise((r) => setTimeout(r, 650));
    },
    lcdText() { return scale.userData.lcd.userData.text || '0.0'; },
    async move(to) {
      if (to === at) return;
      const a = carry.position.clone(), b = P[to]; at = to;
      near(false);
      glideTo(to === 'cup' ? BOX.scale : BOX.bench);
      await play(1.5, (p) => path(a, b, p));
      carry.position.copy(b);
    },
    weigh(g) { lcdTarget = g; return new Promise((r) => { if (REDUCED() || !seen()) { lcdShown = g; setLcd(g); r(); } else lcdDone = r; setTimeout(() => { if (lcdDone === r) { lcdDone = null; lcdShown = g; setLcd(g); r(); } }, 2500); }); },
    lcd(g) { lcdTarget = g; if (REDUCED()) { lcdShown = g; setLcd(g); } },
    freeze() { return play(2.8, (p) => { contents(TUBE.water + (TUBE.ice - TUBE.water) * E(p), E(p)); if (p < 1) spawnMist(); }); },
    melt() { return play(2.4, (p) => contents(TUBE.ice + (TUBE.water - TUBE.ice) * E(p), 1 - E(p))); },
    drops(kind) { drops.visible = !!kind; salt.visible = kind === 'salt'; drops.material.opacity = 0.55; },
    wipe() {
      towel.wrap.visible = true;
      return play(1.3, (p) => { towel.wrap.position.y = 1.55 - 1.3 * p; drops.material.opacity = 0.55 * (1 - p); if (p >= 1) { drops.visible = salt.visible = false; towel.wrap.visible = false; } });
    },
    line(col, cm) {
      const m = col === 'red' ? red : blue, lb = col === 'red' ? lbRed : lbBlue;
      m.position.y = yAt(cm); m.visible = true; lb.visible = true; lb.userData.on = true;
      KIT.relabel(lb, `${col === 'red' ? '빨간 선' : '파란 선'} ${f1(cm)} cm`, { size: 0.13, color: col === 'red' ? '#b3261e' : '#1f4fa8' });
    },
    reread(cm) { KIT.relabel(lbRed, `녹은 물 ${f1(cm)} cm`, { size: 0.13, color: '#b3261e' }); lbRed.visible = lbRed.userData.on = true; },
    reset() {
      if (anim) { clearTimeout(anim.guard); anim = null; }
      at = 'rack'; carry.position.copy(P.rack); contents(TUBE.water, 0);
      red.visible = blue.visible = lbRed.visible = lbBlue.visible = lbRed.userData.on = lbBlue.userData.on = false; drops.visible = salt.visible = towel.wrap.visible = false;
      lcdTarget = lcdShown = 0; setLcd(0); near(false); glideTo(BOX.bench);
    },
    dispose() { stage.dispose(); },
  };
  contents(TUBE.water, 0); setLcd(0);
  watchDetached(el, () => stage.dispose());
  return view;
}

// ── 2D 화면(WebGL이 없는 기기): 옆모습 그림. 측정할 때는 왼쪽 위에 자 확대 창. ──────────────
function tubeView2D(svg) {
  const PX = 13.5, TUBE_L = 9 * PX, TW = 16;                  // 1 cm = 13.5 px, 시험관 9 cm
  const P = { rack: [60, 250], cup: [170, 222], ice: [300, 258], warm: [385, 258], wipe: [452, 214] };
  let pos = P.rack.slice(), hcm = TUBE.water, k = 0, lines = { red: false, blue: false }, drops = null, dropA = 1, lcd = 0, zoom = false, note = '', towelY = null;
  const BLUE = (t) => `rgb(${Math.round(127 + 87 * t)},${Math.round(179 + 55 * t)},${Math.round(213 + 34 * t)})`;
  function draw() {
    const [x, by] = pos, top = by - TUBE_L, wTop = by - hcm * PX;
    const tube = `<g>
      <path d="M${x - TW / 2} ${top} V${by - TW / 2} a${TW / 2} ${TW / 2} 0 0 0 ${TW} 0 V${top}" fill="#eef6fb" stroke="#5b7a96" stroke-width="1.6"/>
      <path d="M${x - TW / 2 + 2} ${wTop} V${by - TW / 2} a${TW / 2 - 2} ${TW / 2 - 2} 0 0 0 ${TW - 4} 0 V${wTop} Z" fill="${BLUE(k)}"/>
      ${k > 0.5 ? `<path d="M${x - 3} ${wTop + 8}l4 5M${x + 2} ${wTop + 22}l-3 4" stroke="#fff" stroke-width="1.5"/>` : ''}
      <rect x="${x - TW / 2 - 2}" y="${top - 12}" width="${TW + 4}" height="16" rx="3" fill="#8c3f2f"/>
      <rect x="${x + TW / 2 + 1}" y="${by - 7.3 * PX}" width="7" height="${7.3 * PX}" fill="#fbf6e6" stroke="#c9b98c" stroke-width=".6"/>
      ${Array.from({ length: 8 }, (_, i) => `<line x1="${x + TW / 2 + 1}" x2="${x + TW / 2 + 6}" y1="${by - i * PX}" y2="${by - i * PX}" stroke="#1f2a37" stroke-width="1"/>`).join('')}
      ${lines.red ? `<line x1="${x - TW / 2 - 3}" x2="${x + TW / 2 + 8}" y1="${by - TUBE.water * PX}" y2="${by - TUBE.water * PX}" stroke="#d23b30" stroke-width="2"/>` : ''}
      ${lines.blue ? `<line x1="${x - TW / 2 - 3}" x2="${x + TW / 2 + 8}" y1="${by - TUBE.ice * PX}" y2="${by - TUBE.ice * PX}" stroke="#2c64c8" stroke-width="2"/>` : ''}
      ${drops ? Array.from({ length: 14 }, (_, i) => `<circle cx="${x - TW / 2 + ((i * 7) % TW)}" cy="${by - 6 - ((i * 37) % 70)}" r="${drops === 'salt' && i % 3 === 0 ? 1.3 : 2}" fill="${drops === 'salt' && i % 3 === 0 ? '#fff' : '#cfe8fb'}" stroke="#7fb3d5" stroke-width=".5" opacity="${dropA}"/>`).join('') : ''}
      ${towelY != null ? `<rect x="${x - TW / 2 - 6}" y="${towelY}" width="${TW + 12}" height="34" rx="6" fill="#8fc1e3" opacity=".95"/>` : ''}
    </g>`;
    // 확대 창: 자 2.5~5.5 cm, 1 cm = 40 px
    const Z = 40, zx = 205, zy = 10, zw = 128, zh = 112, z0 = 5.3, zyOf = (cm) => zy + (z0 - cm) * Z;
    const zoomBox = zoom ? `<g class="ft2-zoom"><rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="8" fill="#fff" stroke="#9aa6b6"/>
      <clipPath id="ft2c"><rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="8"/></clipPath>
      <g clip-path="url(#ft2c)">
        <rect x="${zx + 18}" y="${zyOf(hcm)}" width="44" height="${zh}" fill="${BLUE(k)}"/>
        <rect x="${zx + 62}" y="${zy}" width="26" height="${zh}" fill="#fbf6e6"/>
        ${Array.from({ length: 31 }, (_, i) => { const cm = 2.5 + i / 10, y = zyOf(cm), mj = i % 10 === 5; return `<line x1="${zx + 62}" x2="${zx + 62 + (mj ? 14 : i % 5 === 0 ? 10 : 6)}" y1="${y}" y2="${y}" stroke="#1f2a37" stroke-width="${mj ? 1.6 : .8}"/>${mj ? `<text x="${zx + 80}" y="${y + 4}" font-size="11" font-weight="700" fill="#1f2a37">${Math.round(cm)}</text>` : ''}`; }).join('')}
        ${lines.red ? `<line x1="${zx + 12}" x2="${zx + 92}" y1="${zyOf(TUBE.water)}" y2="${zyOf(TUBE.water)}" stroke="#d23b30" stroke-width="2.4"/>` : ''}
        ${lines.blue ? `<line x1="${zx + 12}" x2="${zx + 92}" y1="${zyOf(TUBE.ice)}" y2="${zyOf(TUBE.ice)}" stroke="#2c64c8" stroke-width="2.4"/>` : ''}
      </g><text x="${zx + 6}" y="${zy + zh - 6}" font-size="10" fill="#5d6676">자 확대</text>${note ? `<text x="${zx + zw + 6}" y="${zy + 18}" font-size="12" font-weight="700" fill="#1f2a37">${note}</text>` : ''}</g>` : '';
    svg.innerHTML = `<rect width="480" height="300" fill="#f7f4ec"/><rect y="270" width="480" height="30" fill="#e5dccb"/>
      <rect x="35" y="246" width="50" height="24" rx="4" fill="#c69a63"/><text x="60" y="290" font-size="11" text-anchor="middle" fill="#5d6676">꽂이</text>
      <rect x="110" y="238" width="120" height="32" rx="6" fill="#e9ecef" stroke="#9aa3ad"/><rect x="125" y="226" width="90" height="10" rx="3" fill="#c7cdd3"/>
      <rect x="128" y="246" width="70" height="18" rx="3" fill="#b4c29d"/><text x="190" y="260" font-size="13" font-weight="800" text-anchor="end" fill="#18200f" data-lcd>${fmtMass(lcd)} g</text>
      <path d="M153 196 L156 226 H184 L187 196" fill="#f3f8fb" fill-opacity=".6" stroke="#9fb6c8"/><text x="170" y="290" font-size="11" text-anchor="middle" fill="#5d6676">저울(컵 0 g)</text>
      <rect x="265" y="200" width="70" height="70" rx="4" fill="#eef7fc" stroke="#8fb1c9"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${270 + (i % 4) * 15 + (i % 2) * 3}" y="${214 + Math.floor(i / 4) * 13}" width="11" height="9" rx="2" fill="#fff" stroke="#c4dbea"/>`).join('')}
      <text x="300" y="290" font-size="11" text-anchor="middle" fill="#5d6676">소금 섞은 얼음</text>
      <rect x="350" y="200" width="70" height="70" rx="4" fill="#fbe3cc" fill-opacity=".7" stroke="#d3a983"/><text x="385" y="290" font-size="11" text-anchor="middle" fill="#5d6676">따뜻한 물</text>
      <rect x="430" y="258" width="44" height="12" rx="3" fill="#8fc1e3"/><text x="452" y="290" font-size="11" text-anchor="middle" fill="#5d6676">수건</text>
      ${tube}${zoomBox}`;
  }
  let raf = 0, end = null;
  const play = (ms, step) => new Promise((res) => {
    if (end) end();
    if (REDUCED()) { step(1); draw(); res(); return; }
    const t0 = performance.now();
    end = () => { cancelAnimationFrame(raf); step(1); draw(); end = null; res(); };
    const tick = (now) => { const p = Math.min(1, (now - t0) / ms); step(p); draw(); if (p < 1) raf = requestAnimationFrame(tick); else { end = null; res(); } };
    raf = requestAnimationFrame(tick);
  });
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  let at = 'rack';
  draw();
  return {
    async focus(kind) { zoom = kind === 'tube' || zoom; draw(); },
    async move(to) {
      if (to === at) return; const a = pos.slice(), b = P[to]; at = to; const lift = Math.min(a[1], b[1], 190) - 20;
      await play(1100, (p) => { const up = Math.min(1, p / 0.3), mid = Math.min(1, Math.max(0, (p - 0.3) / 0.4)), dn = Math.max(0, (p - 0.7) / 0.3);
        pos = [a[0] + (b[0] - a[0]) * ease(mid), a[1] + (lift - a[1]) * ease(up) + (b[1] - lift) * ease(dn)]; });
      pos = b.slice(); draw();
    },
    async weigh(g) { lcd = g; draw(); },
    lcd(g) { lcd = g; draw(); },
    freeze() { return play(1600, (p) => { hcm = TUBE.water + (TUBE.ice - TUBE.water) * ease(p); k = ease(p); }); },
    melt() { return play(1400, (p) => { hcm = TUBE.ice + (TUBE.water - TUBE.ice) * ease(p); k = 1 - ease(p); }); },
    drops(kind) { drops = kind; dropA = 1; draw(); },
    wipe() { return play(900, (p) => { towelY = pos[1] - 80 + 60 * p; dropA = 1 - p; if (p >= 1) { towelY = null; drops = null; } }); },
    line(col, cm) { lines[col] = true; zoom = true; note = `${col === 'red' ? '빨간 선' : '파란 선'} ${f1(cm)} cm`; draw(); },
    reread(cm) { zoom = true; note = `녹은 물 ${f1(cm)} cm`; draw(); },
    reset() { if (end) end(); at = 'rack'; pos = P.rack.slice(); hcm = TUBE.water; k = 0; lines = { red: false, blue: false }; drops = null; towelY = null; lcd = 0; zoom = false; note = ''; draw(); },
    dispose() { if (end) end(); },
    lcdText() { return fmtMass(lcd); },
  };
}

// ════════════════════════ 얼음 병 저울(추가 탐구 · 두 팀 배틀) ════════════════════════
// 물의 양을 고르고 얼리거나 녹여서 높이(칸)와 무게(g)를 표에 적는다. 얼리는 동안 병은 저울을 떠나 있으므로 무게 칸은 「?」.
// 다 얼어도 결론을 먼저 말하지 않는다 — 학생이 선과 저울을 읽어 적는다. 같은 상태·같은 양을 다시 적으면 그 줄을 바꾼다.
async function mountBottle(el, opts = {}) {
  let THREE, Stage, watchDetached, FB, KIT;
  try {
    [{ Stage, watchDetached }, THREE, FB, KIT] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/freeze-bottle.js'), import('../scenes/_kit.js')]);
    if (!Stage.canWebGL()) throw new Error('no webgl');
  } catch (_) { return mountBottle2D(el, opts); }
  if (!el.isConnected) return mountBottle2D(el, opts);
  const amounts = opts.amounts || [60, 100, 140], rows = opts.rows || [], onRecord = opts.onRecord;
  let ml = amounts[1] ?? amounts[0], frozen = false, busy = false, away = false;
  el.innerHTML = `
    ${opts.extra ? '<p class="ft-extra-head"><b>추가 탐구</b> 물의 양을 바꿔 얼리고 녹여 봐요. (이 표는 저장하지 않아요)</p>' : ''}
    <div class="modes" role="group" aria-label="물의 양"><span class="lab-lbl">물의 양</span>${amounts.map((a) => `<button type="button" data-ml="${a}" aria-pressed="${a === ml}">${a} mL</button>`).join('')}</div>
    <div class="lab3d lab3d--bottle">
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
        ${opts.extra ? '<button class="btn" data-act="back" type="button">시험관 실험으로</button>' : ''}
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>상태</th><th>물의 양(mL)</th><th>높이(칸)</th><th>무게(g)</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), canvas = $('canvas'), tbody = $('tbody'), $t = $('[data-act=toggle]'), tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return mountBottle2D(el, opts); }
  const { R, PAN_Y, ICE } = FB.BOTTLE_DIM, KY0 = 0.22, KU = 0.075;        // 병 안 0칸 높이, 1칸 = 0.075(10 mL)
  const yOf = (kan) => KY0 + kan * KU;
  const WATER = new THREE.Color(0x7fb3d5), ICEC = new THREE.Color(ICE), c = new THREE.Color();
  const scale = FB.buildScale(); stage.root.add(scale);
  const beaker = FB.buildBeaker(); beaker.position.set(-1.75, 0, -0.95); stage.root.add(beaker);       // 물을 따르던 비커(소품)
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
  const BATH = new THREE.Vector3(2.75, 0, -0.35);
  const bath = FB.buildBath(); bath.position.copy(BATH); stage.root.add(bath);
  const mist = KIT.puffCloud(KIT.particleBudget(canvas, 48), { color: 0xf1f7ff, opacity: 0.5, soft: 0.8 }); stage.root.add(mist);
  const puffs = [];
  stage.setView({ theta: 0.3, phi: 1.16, dist: 6.9, target: [1.2, 0.95, -0.1] });
  stage.fitWidth = 1.45;
  stage.setContactShadow({ x: 1.1, z: -0.1, w: 7.5, d: 4.4 });
  const lcd = (g) => scale.userData.setLcd(fmtMass(g));
  let anim = null, shownMass = 20 + ml, massTarget = shownMass;
  const placeMark = (kan) => { mark.position.y = yOf(kan); markLabel.position.set(-R - 0.62, yOf(kan), 0.35); KIT.relabel(markLabel, `처음 ${kan}칸`, { size: 0.22, color: '#b3261e' }); };
  function read() {
    const m = freezeModel(ml, frozen);
    $('[data-r=state]').textContent = away ? (frozen ? '녹이는 중' : '얼리는 중') : frozen ? '얼음' : '물';
    $('[data-r=h]').textContent = away ? '?' : m.height; $('[data-r=m]').textContent = away ? '?' : m.mass;
    $t.textContent = frozen ? '녹이기' : '얼리기';
  }
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
  const doneMsg = () => tip(frozen ? '다 얼어 저울에 다시 올렸어요. 빨간 선과 견주어 높이를 읽고, 저울 숫자를 읽어 <b>표에 적어요</b>.'
    : '다 녹았어요. 높이와 저울 숫자를 읽어 <b>표에 적어요</b>.');
  function toggle() {
    if (busy) return;
    const reduce = REDUCED(); busy = !reduce;
    if (!frozen) {
      tip('병을 들어 <b>소금 섞은 얼음</b>에 넣어요. 병이 저울을 떠나면 저울은 0 g이에요.');
      if (reduce) { frozen = true; setWater(freezeModel(ml, true).height, 1); massTarget = shownMass = 20 + ml; lcd(shownMass); read(); doneMsg(); }
      else { anim = { kind: 'freeze', t: 0 }; away = true; read(); }
    } else {
      tip('저울 위에서 얼음이 <b>녹아요</b>. 무게를 지켜봐요.');
      if (reduce) { frozen = false; setWater(ml / 10, 0); read(); doneMsg(); }
      else { anim = { kind: 'melt', t: 0 }; away = true; read(); }
    }
  }
  const E = KIT.ease.io;
  stage.update = (dt) => {
    if (opts.isActive && !opts.isActive()) return;
    if (anim) {
      anim.t += dt; const a = anim;
      if (a.kind === 'pour') { const p = Math.min(1, a.t / a.dur); setWater(a.from + (a.to - a.from) * E(p), 0); if (p >= 1) { anim = null; busy = false; } }
      else if (a.kind === 'freeze') {
        if (a.t < 0.9) { arc(PAN, IN_BATH, E(a.t / 0.9), 0.9); massTarget = 0; }
        else if (a.t < 3.1) { carry.position.copy(IN_BATH); const p = E((a.t - 0.9) / 2.2); setWater(ml / 10 + (freezeModel(ml, true).height - ml / 10) * p, p); spawnMist(true); }
        else if (a.t < 4.0) { arc(IN_BATH, PAN, E((a.t - 3.1) / 0.9), 0.9); }
        else { carry.position.copy(PAN); anim = null; busy = false; frozen = true; massTarget = 20 + ml; away = false; read(); doneMsg(); }
      } else if (a.kind === 'melt') {
        const p = Math.min(1, a.t / 2.4), e = E(p); setWater(freezeModel(ml, true).height + (ml / 10 - freezeModel(ml, true).height) * e, 1 - e);
        if (p >= 1) { anim = null; busy = false; frozen = false; away = false; read(); doneMsg(); }
      }
    }
    const d = massTarget - shownMass; shownMass = Math.abs(d) < 0.05 ? massTarget : shownMass + d * Math.min(1, dt * 7);
    lcd(Math.max(0, shownMass));
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
    const at = rows.findIndex((r) => r.state === row.state && r.ml === row.ml); if (at >= 0) rows[at] = row; else rows.push(row);
    renderRows(); onRecord?.(rows); tip(`적었어요! ${frozen ? '녹이거나 물의 양을 바꿔' : '얼려서'} 한 번 더 재 봐요.`);
  });
  const dispose = watchDetached(el, () => stage.dispose());
  $('[data-act=back]')?.addEventListener('click', () => { stage.dispose(); opts.onBack?.(); });
  placeMark(ml / 10); setWater(ml / 10, 0); lcd(shownMass); read(); renderRows();
  return { rows, pause() {}, dispose: () => { stage.dispose(); dispose?.(); } };
}

// WebGL이 없는 기기의 병 실험실(같은 모델·같은 표)
function mountBottle2D(el, { amounts = [60, 100, 140], onRecord, rows = [], extra = false, onBack } = {}) {
  let ml = amounts[1], frozen = false, busy = false;
  el.innerHTML = `
    ${extra ? '<p class="ft-extra-head"><b>추가 탐구</b> 물의 양을 바꿔 얼리고 녹여 봐요. (이 표는 저장하지 않아요)</p>' : ''}
    <div class="modes" role="group" aria-label="물의 양">${amounts.map((a) => `<button type="button" data-ml="${a}" aria-pressed="${a === ml}">${a} mL</button>`).join('')}</div>
    <div class="lab">
      <svg class="lab-svg" viewBox="0 0 220 300" role="img" aria-label="눈금이 있는 병과 저울"></svg>
      <div class="lab-side">
        <p class="lab-read"><span>상태</span><b data-r="state">물</b></p>
        <p class="lab-read"><span>높이</span><b data-r="h">0</b><small>칸</small></p>
        <p class="lab-read"><span>무게</span><b data-r="m">0</b><small>g</small></p>
        <button class="btn primary" data-act="toggle" type="button">얼리기</button>
        <button class="btn" data-act="record" type="button" style="margin-top:6px">표에 적기</button>
        ${extra ? '<button class="btn" data-act="back" type="button" style="margin-top:6px">시험관 실험으로</button>' : ''}
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
    const h0 = freezeModel(ml, !to).height, h1 = freezeModel(ml, to).height, t0 = performance.now(), D = REDUCED() ? 0 : 1400;
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
    const at = rows.findIndex((r) => r.state === row.state && r.ml === row.ml); if (at >= 0) rows[at] = row; else rows.push(row);
    renderRows(); onRecord?.(rows);
  });
  el.querySelector('[data-act=back]')?.addEventListener('click', () => onBack?.());
  read(); draw(freezeModel(ml, false).height, 0); renderRows();
  return { rows };
}
