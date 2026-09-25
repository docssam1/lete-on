// 3D 장면·체험 실험실을 어느 화면에서나(5단계 화면·수업 화면·교재·광고 페이지) 같은 방식으로 띄운다.
import { mountRingTower } from './lab-ring-tower.js';
import { mountFreeze } from './lab-freeze.js';
import { mountHill3D } from './lab-hill3d.js';
import { mountPond3D } from './lab-pond3d.js';
import { mountVolcano3D } from './lab-volcano3d.js';
export const LABS = { 'ring-tower': mountRingTower, freeze: mountFreeze, hill: mountHill3D, pond: mountPond3D, volcano: mountVolcano3D };
// 3D 실험실(캔버스가 있는 것)에는 「가로로 크게」 단추를 붙인다. 실험실 파일은 건드리지 않고 마운트 뒤에 끼운다.
export const mountLabOf = (kind) => {
  const f = LABS[kind] || mountRingTower;
  return (el, opts) => { const r = f(el, opts); Promise.resolve(r).then(() => { if (el.querySelector('.lab3d canvas')) addLandscape(el, el.querySelector('.lab3d-btns')); }, () => {}); return r; };
};

// 가로로 크게 보기 — 휴대폰에서 3D는 가로 화면이 제일 넓다. 전체 화면 + 가로 고정을 시도하고,
// 안 되는 기기(iPhone Safari 등)는 화면 가득 채우는 겹침 화면으로 대신한다. 세로로 들고 있으면 돌려 달라고 안내.
export function addLandscape(host, into) {
  if (!host || !into || into.querySelector('.fl-open')) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn fl-open'; b.innerHTML = '<span aria-hidden="true">⤢</span> 가로로 크게';
  const x = document.createElement('button'); x.type = 'button'; x.className = 'btn fl-close'; x.textContent = '✕ 닫기';
  const hint = document.createElement('p'); hint.className = 'fl-rotate'; hint.textContent = '↻ 휴대폰을 가로로 돌리면 더 커져요';
  into.appendChild(b); host.append(x, hint);
  let on = false;
  const exit = () => {
    if (!on) return; on = false; host.classList.remove('full-land'); document.documentElement.classList.remove('fl-lock');
    try { screen.orientation?.unlock?.(); } catch (_) {}
    if (document.fullscreenElement === host) document.exitFullscreen?.().catch(() => {});
    b.focus({ preventScroll: true });
  };
  const enter = async () => {
    on = true; host.classList.add('full-land'); document.documentElement.classList.add('fl-lock'); x.focus({ preventScroll: true });
    try { if (host.requestFullscreen) { await host.requestFullscreen({ navigationUI: 'hide' }); await screen.orientation?.lock?.('landscape'); } } catch (_) {}
  };
  b.onclick = enter; x.onclick = exit;
  document.addEventListener('fullscreenchange', () => { if (on && !document.fullscreenElement) exit(); });
  host.addEventListener('keydown', (e) => { if (e.key === 'Escape') exit(); });
}
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// 3D (기존 engine.js 재사용)
export async function mount3D(el, sceneName, { autoplay, preview = false }) {
  el.innerHTML = `<div class="stage3d"><div class="stage3d-view"><canvas aria-label="3D 실험 장면. 끌어서 돌려 볼 수 있어요."></canvas><span class="stage3d-hint">끌어서 회전 · 두 손가락으로 확대</span></div><p class="cap"><b class="stage3d-step">1/1</b><span>장면을 준비하고 있어요…</span></p>
    <div class="ctl"><button class="btn primary" data-a="play">재생</button><button class="btn" data-a="prev">이전</button><button class="btn" data-a="next">다음</button></div></div>`;
  try {
    const [{ Stage, Player, watchDetached }, mod] = await Promise.all([import('../engine.js'), import(`../scenes/${sceneName}.js`)]);
    if (!el.isConnected) return;
    const stage = new Stage(el.querySelector('canvas')), player = new Player(stage);
    addLandscape(el.querySelector('.stage3d'), el.querySelector('.ctl'));   // 장면이 무거워도 단추는 먼저
    const $cap = el.querySelector('.cap span'), $step = el.querySelector('.stage3d-step'), $play = el.querySelector('[data-a=play]');
    player.onChange = () => { $cap.textContent = player.beats[player.index]?.text || ''; $step.textContent = `${player.index + 1}/${player.beats.length}`; $play.textContent = player.playing ? '멈춤' : '재생'; };
    await player.load(mod.default);
    if (preview) { player.beats = player.beats.slice(0, 3); player.speed = 1.15; }
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

