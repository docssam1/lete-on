// 3D 장면·체험 실험실을 어느 화면에서나(5단계 화면·수업 화면·교재·광고 페이지) 같은 방식으로 띄운다.
import { mountRingTower } from './lab-ring-tower.js';
import { mountFreeze } from './lab-freeze.js';
import { mountHill3D } from './lab-hill3d.js';
import { mountPond3D } from './lab-pond3d.js';
import { mountVolcano3D } from './lab-volcano3d.js';
export const LABS = { 'ring-tower': mountRingTower, freeze: mountFreeze, hill: mountHill3D, pond: mountPond3D, volcano: mountVolcano3D };
// 3D 실험실(캔버스가 있는 것)에는 「전체 화면」 단추를 붙인다. 실험실 파일은 건드리지 않고 마운트 뒤에 끼운다.
export const mountLabOf = (kind) => {
  const f = LABS[kind] || mountRingTower;
  return (el, opts) => { const r = f(el, opts); Promise.resolve(r).then(() => { if (el.querySelector('.lab3d canvas')) addLandscape(el, el.querySelector('.lab3d-btns')); }, () => {}); return r; };
};

// 전체 화면 — 3D 캔버스가 화면 전체를 채우고, 설명·단추·표는 그 위에 뜬 작은 조작판(접을 수 있음)에 모인다.
// (원장 2026-09-28: "가로로 넓게가 아니라 전체 화면으로") 가로 고정은 하지 않는다 — 들고 있는 방향 그대로 꽉 찬다.
// 전체 화면 API 가 없는 기기(iPhone Safari 등)는 화면을 덮는 겹침 화면으로 대신한다.
// 캔버스는 조작판 밖(호스트 바로 아래)으로 잠깐 옮긴다 — 조작판 안에 있으면 조작판 배경 위에 그려져 가려진다.
// 닫으면 모든 요소를 원래 자리로 되돌린다(요소를 옮길 뿐이라 실험실 코드의 참조·이벤트는 그대로 산다).
export function addLandscape(host, into) {
  if (!host || !into || into.querySelector('.fl-open')) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn fl-open'; b.innerHTML = '<span class="fl-ico" aria-hidden="true">⛶</span>전체 화면';
  const x = document.createElement('button'); x.type = 'button'; x.className = 'btn fl-close'; x.textContent = '✕ 닫기';
  const fold = document.createElement('button'); fold.type = 'button'; fold.className = 'fl-fold'; fold.setAttribute('aria-expanded', 'true');
  into.appendChild(b); host.append(x);
  let on = false, panel = null, canvasMark = null, canvas = null;
  const setFold = (open) => { panel?.classList.toggle('min', !open); fold.setAttribute('aria-expanded', String(open)); fold.textContent = open ? '조작판 접기 ▾' : '조작판 펴기 ▴'; };
  fold.onclick = () => setFold(panel?.classList.contains('min'));
  const exit = () => {
    if (!on) return; on = false;
    if (panel) { for (const n of [...panel.childNodes]) if (n !== fold) host.insertBefore(n, x); panel.remove(); panel = null; }
    if (canvas && canvasMark?.parentNode) { canvasMark.parentNode.insertBefore(canvas, canvasMark); canvasMark.remove(); }
    canvas = canvasMark = null;
    host.classList.remove('full-land'); document.documentElement.classList.remove('fl-lock');
    if (document.fullscreenElement === host) document.exitFullscreen?.().catch(() => {});
    b.focus({ preventScroll: true });
  };
  const enter = async () => {
    if (on) return; on = true;
    canvas = host.querySelector('canvas');
    if (canvas) { canvasMark = document.createComment('fl-canvas'); canvas.parentNode.insertBefore(canvasMark, canvas); host.prepend(canvas); }
    panel = document.createElement('div'); panel.className = 'fl-panel'; panel.append(fold);
    for (const n of [...host.childNodes]) if (n !== canvas && n !== x && n !== panel) panel.appendChild(n);
    host.append(panel); setFold(true);
    host.classList.add('full-land'); document.documentElement.classList.add('fl-lock'); x.focus({ preventScroll: true });
    try { if (host.requestFullscreen) await host.requestFullscreen({ navigationUI: 'hide' }); } catch (_) {}
  };
  b.onclick = enter; x.onclick = exit;
  document.addEventListener('fullscreenchange', () => { if (on && !document.fullscreenElement) exit(); });
  host.addEventListener('keydown', (e) => { if (e.key === 'Escape') exit(); });
}
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// 조작 안내는 기기에 맞게: 마우스면 Ctrl+휠, 손가락이면 두 손가락
const HINT3D = matchMedia?.('(pointer: fine)').matches ? '끌어서 돌리기 · Ctrl+휠 확대 · 두 번 클릭하면 처음 시점' : '옆으로 끌어 돌리기 · 두 손가락으로 확대';

// 3D (기존 engine.js 재사용)
// preview: true → 답이 나오기 전(장면의 revealAt)까지만, 숫자 → 그 단계 수만큼(광고 페이지). 끝나면 질문으로 멈춘다.
// from: 'reveal' → 답이 나오는 단계부터(가설·실험 뒤 「3D로 확인하기」).
export async function mount3D(el, sceneName, { autoplay, preview = false, from = null, onDone } = {}) {
  el.innerHTML = `<div class="stage3d"><div class="stage3d-view"><canvas aria-label="3D 실험 장면. 끌어서 돌려 볼 수 있어요."></canvas><span class="stage3d-hint">${HINT3D}</span></div><p class="cap"><b class="stage3d-step">1/1</b><span>장면을 준비하고 있어요…</span></p>
    <div class="ctl"><button class="btn primary" data-a="play">재생</button><button class="btn" data-a="prev">이전</button><button class="btn" data-a="next">다음</button></div></div>`;
  try {
    const [{ Stage, Player, watchDetached }, mod] = await Promise.all([import('../engine.js'), import(`../scenes/${sceneName}.js`)]);
    if (!el.isConnected) return;
    const stage = new Stage(el.querySelector('canvas')), player = new Player(stage);
    addLandscape(el.querySelector('.stage3d'), el.querySelector('.ctl'));   // 장면이 무거워도 단추는 먼저
    const $cap = el.querySelector('.cap span'), $step = el.querySelector('.stage3d-step'), $play = el.querySelector('[data-a=play]');
    let fired = false;   // 끝까지 재생되면 한 번 알린다(스스로 공부하기의 자동 넘김)
    player.onChange = () => { $cap.textContent = player.beats[player.index]?.text || ''; $step.textContent = `${player.index + 1}/${player.beats.length}`; $play.textContent = player.playing ? '멈춤' : '재생';
      if (player.done && !fired && onDone) { fired = true; onDone(); } };
    await player.load(mod.default);
    const reveal = mod.default.revealAt ?? 3;
    if (preview) { player.beats = player.beats.slice(0, typeof preview === 'number' ? preview : reveal); player.speed = 1.15; }
    if (preview === true) {   // 미리 보기가 끝나면 답 대신 질문을 남긴다
      const base = player.onChange;
      player.onChange = () => { base(); if (player.done) $cap.textContent = '여기까지! 어떻게 될지는 먼저 예상하고, 실험한 뒤에 확인해요.'; };
    }
    if (from === 'reveal' && reveal < player.beats.length) player.goto(reveal, false);
    player.onChange();
    el.querySelector('[data-a=play]').onclick = () => player.toggle();
    el.querySelector('[data-a=prev]').onclick = () => player.prev();
    el.querySelector('[data-a=next]').onclick = () => player.next();
    if (autoplay && !REDUCED) player.play();
    watchDetached(el, () => { player.stop(); stage.dispose(); document.documentElement.classList.remove('fl-lock'); });
  } catch (e) {
    el.querySelector('.cap').textContent = '이 기기에서는 3D를 보여 줄 수 없어요. 가상 실험실로 해 봐요.';
  }
}

